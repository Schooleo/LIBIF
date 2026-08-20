# Azure for Students backend deployment

This deployment keeps the Next.js frontend on Vercel and runs the complete persistent backend on one Azure Linux VM:

- NestJS API and BullMQ OCR worker
- PostgreSQL, authenticated Redis with AOF, and private MinIO storage
- one-shot Prisma migrations
- Caddy automatic HTTPS for the API hostname
- GitHub Actions production images and Azure deployment through OpenID Connect (OIDC)

The Azure jobs remain disabled until the student subscription, DNS, VM environment, and GitHub variables are configured. Until then, pushing a valid release tag deploys only the Vercel frontend after both quality gates pass.

## Architecture

```text
browser
  ├─ https://library.example.edu ──> Vercel Next.js
  └─ https://api.library.example.edu ──> Azure public IP
                                                │
                                              Caddy
                                                │
                    ┌───────────────────────────┴────────────┐
                    │ API ─ PostgreSQL / Redis / MinIO       │
                    │ worker ─ Redis / PostgreSQL / MinIO    │
                    └────────────────────────────────────────┘

vMAJOR.MINOR.PATCH tag on main -> API + web quality gates -> GHCR tag + SHA images
                              -> GitHub OIDC -> Azure VM Run Command -> Compose deploy -> health check
```

Use custom frontend and API hostnames under the same registrable domain. The default `*.vercel.app` hostname and an unrelated API hostname are cross-site, which prevents LIBIF's `SameSite=Lax` credential flow from operating as designed.

## 1. Prepare the student subscription

Install the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli), authenticate, and explicitly select the Azure for Students subscription:

```bash
az login
az account list --output table
az account set --subscription '<azure-for-students-subscription-id>'
az account show --output table
```

The default template uses Southeast Asia, `Standard_B2als_v2` (AMD64, 2 vCPU, 4 GB RAM), a 30 GB OS disk, and a detached-on-delete 128 GB Standard SSD data disk. Docker stores images and named volumes on the data disk. A 4 GB swap file protects light OCR workloads from abrupt memory exhaustion. For more headroom, deploy `Standard_B2as_v2` (8 GB RAM), understanding that it consumes the student credit faster.

Create a budget and alerts in Azure Cost Management before deployment. The USD 100 student credit is finite and storage plus public IPv4 continue to incur charges while a VM is deallocated.

## 2. Provision infrastructure and GitHub OIDC

Generate an emergency SSH key if needed, determine the public IPv4 address that should be allowed to connect, then run the provisioner:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/libif-azure

# Replace 203.0.113.10 with your current public IPv4 address.
scripts/azure/provision.sh ~/.ssh/libif-azure.pub 203.0.113.10/32
```

The Bicep template creates:

- VNet, subnet, NSG, static public IPv4, and NIC
- Ubuntu 24.04 LTS VM with ports 80/443 public and SSH restricted to the supplied CIDR
- persistent Standard SSD data disk
- Docker/cloud-init bootstrap
- user-assigned Azure identity with a GitHub `production` environment federated credential
- VM-scoped Virtual Machine Contributor assignment for Azure Run Command

The Home/tenant account performs the initial deployment. GitHub receives only short-lived OIDC access later; no Azure client secret is stored in GitHub.

## 3. Configure DNS and the private VM environment

Create an A record for the API hostname using `publicIpAddress.value` from the provisioner output:

```text
api.library.example.edu  A  <azure-public-ip>
```

Prepare the environment locally, replacing every placeholder. Passwords used in URLs must be percent-encoded while the corresponding service password remains raw.

```bash
cp .env.azure.production.example .env.azure.production
chmod 600 .env.azure.production
editor .env.azure.production
make azure-config
```

Install it on the VM without adding it to Git:

```bash
scp -i ~/.ssh/libif-azure .env.azure.production \
  libifadmin@<azure-public-ip>:/tmp/libif.env

ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'sudo install -D -m 600 -o root -g root /tmp/libif.env /etc/libif/.env.production && rm /tmp/libif.env'
```

For private GHCR packages, create a read-only GitHub token with only `read:packages` and authenticate the VM once without placing the token in shell history:

```bash
read -rsp 'GHCR read token: ' GHCR_READ_TOKEN; echo
printf '%s' "$GHCR_READ_TOKEN" | \
  ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'sudo docker login ghcr.io --username <github-user> --password-stdin'
unset GHCR_READ_TOKEN
```

Alternatively, make the `libif-api` and `libif-migrate` GHCR packages public after their first publication.

## 4. Configure Vercel

Keep the Vercel project rooted at `apps/web` and configure its Production environment:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.library.example.edu
INTERNAL_API_BASE_URL=https://api.library.example.edu
```

Attach `library.example.edu` (or another same-site custom hostname) to Vercel. Set `LIBIF_WEB_BASE_URL=https://library.example.edu` in the Azure VM environment. Add only intentional preview origins to `LIBIF_CORS_ORIGINS`; wildcard origins are not supported for credentialed requests.

## 5. Configure GitHub

Create or reuse the protected GitHub environment named `production`. Configure its deployment tag rule to allow only `v*.*.*`; the workflow additionally enforces the exact `vMAJOR.MINOR.PATCH` format and verifies that the tagged commit belongs to `main`. Add required reviewers if deployment approval is desired. Configure these **repository variables** from the provisioner output:

| Variable | Source |
|---|---|
| `AZURE_CLIENT_ID` | `deployClientId.value` |
| `AZURE_TENANT_ID` | `tenantId.value` |
| `AZURE_SUBSCRIPTION_ID` | `subscriptionId.value` |
| `AZURE_RESOURCE_GROUP` | `resourceGroupName.value` |
| `AZURE_VM_NAME` | `vmName.value` |
| `LIBIF_API_HOSTNAME` | API DNS hostname, without `https://` |
| `AZURE_DEPLOY_ENABLED` | Keep `false` until every previous step passes; then set `true`. |

Keep the existing Vercel production secrets in the same environment. The OIDC subject created by Bicep is restricted to `repo:Schooleo/LIBIF:environment:production`; changing the repository or environment name requires redeploying the Bicep template with matching parameters.

## 6. First automated deployment

After DNS resolves, the VM environment is installed, GHCR access is configured, and `AZURE_DEPLOY_ENABLED=true`, merge the reviewed commit to `main`, then create and push a release tag:

```bash
git switch main
git pull --ff-only
git tag v1.2.3
git push origin v1.2.3
```

Use exactly `vMAJOR.MINOR.PATCH`. Prerelease/build suffixes such as `v1.2.3-rc.1` or `v1.2.3+build.4` are not accepted by the production CD contract.

The `Production` workflow will:

1. complete every API and web CI job;
2. deploy the validated frontend to Vercel;
3. publish AMD64 API/worker and migration images under the semantic release tag;
4. exchange the GitHub OIDC token for short-lived Azure access;
5. run `scripts/azure/deploy.sh` through the Azure VM agent;
6. pull images, apply migrations, start the backend-only Compose model, and verify `/api/health` over public HTTPS.

The deploy script refuses placeholder environments, concurrent deployments, malformed release tags, incomplete commit SHAs, tag/SHA mismatches, and unexpected content at `/opt/libif`.

## Operations

```bash
# Container health/status and logs over SSH
ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'cd /opt/libif && sudo make AZURE_ENV_FILE=/etc/libif/.env.production azure-ps'

ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'cd /opt/libif && sudo make AZURE_ENV_FILE=/etc/libif/.env.production azure-logs'

# Current successfully health-checked release
ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'sudo cat /var/lib/libif-deploy/current-release'

# Full commit SHA behind that release tag
ssh -i ~/.ssh/libif-azure libifadmin@<azure-public-ip> \
  'sudo cat /var/lib/libif-deploy/current-release-sha'
```

Back up PostgreSQL and MinIO off the VM. The data disk survives deletion of the VM by default, but it is still a single disk in one region and is not a tested backup. Do not delete the resource group until backups are restored elsewhere.

To stop compute charges, use `az vm deallocate`; storage and static public IP charges continue. Reallocation retains the IP and data disk:

```bash
az vm deallocate --resource-group libif-production --name libif-prod-vm
az vm start --resource-group libif-production --name libif-prod-vm
```
