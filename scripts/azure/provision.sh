#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/azure/provision.sh <ssh-public-key-file> <trusted-ssh-cidr>

Environment overrides:
  AZURE_LOCATION       Default: eastasia
  AZURE_RESOURCE_GROUP Default: libif-production
  AZURE_NAME_PREFIX    Default: libif-prod
  AZURE_PUBLIC_DNS_LABEL Default: libif-schooleo-prod
  AZURE_VM_SIZE        Default: Standard_B2als_v2
  GITHUB_REPOSITORY    Default: Schooleo/LIBIF

Authenticate first with `az login` and select the Azure for Students subscription.
The trusted SSH CIDR should normally be your current public address followed by /32.
EOF
}

if [[ "$#" -ne 2 ]]; then
  usage >&2
  exit 2
fi

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI is required: https://learn.microsoft.com/cli/azure/install-azure-cli" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to display the Azure deployment outputs." >&2
  exit 1
fi

readonly ssh_public_key_file="$1"
readonly ssh_allowed_cidr="$2"
readonly location="${AZURE_LOCATION:-eastasia}"
readonly resource_group="${AZURE_RESOURCE_GROUP:-libif-production}"
readonly name_prefix="${AZURE_NAME_PREFIX:-libif-prod}"
readonly public_dns_label="${AZURE_PUBLIC_DNS_LABEL:-libif-schooleo-prod}"
readonly vm_size="${AZURE_VM_SIZE:-Standard_B2als_v2}"
readonly github_repository="${GITHUB_REPOSITORY:-Schooleo/LIBIF}"

if [[ ! -f "${ssh_public_key_file}" ]]; then
  echo "SSH public key file not found: ${ssh_public_key_file}" >&2
  exit 1
fi

if [[ ! "${ssh_allowed_cidr}" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}/(3[0-2]|[12]?[0-9])$ ]]; then
  echo "Trusted SSH source must be an IPv4 CIDR, normally x.x.x.x/32." >&2
  exit 1
fi

if [[ ! "${github_repository}" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "GITHUB_REPOSITORY must use owner/name format." >&2
  exit 1
fi

az account show --output none
az bicep build --file infra/azure/main.bicep --stdout >/dev/null
az group create --name "${resource_group}" --location "${location}" --output none

outputs="$({
  az deployment group create \
    --resource-group "${resource_group}" \
    --template-file infra/azure/main.bicep \
    --parameters \
      namePrefix="${name_prefix}" \
      publicDnsLabel="${public_dns_label}" \
      githubRepository="${github_repository}" \
      vmSize="${vm_size}" \
      sshPublicKey="$(<"${ssh_public_key_file}")" \
      sshAllowedCidr="${ssh_allowed_cidr}" \
    --query properties.outputs \
    --output json
})"

echo "${outputs}" | jq .
cat <<EOF

Azure infrastructure is provisioned. Configure these GitHub environment variables
under the protected 'production' environment using the output values above:

  AZURE_CLIENT_ID       <- deployClientId.value
  AZURE_TENANT_ID       <- tenantId.value
  AZURE_SUBSCRIPTION_ID <- subscriptionId.value
  AZURE_RESOURCE_GROUP  <- resourceGroupName.value
  AZURE_VM_NAME         <- vmName.value
  AZURE_DEPLOY_ENABLED  <- false until DNS, the VM environment, and image access
                           are verified; then set it to true

Configure LIBIF_API_HOSTNAME from publicDnsName.value. Azure manages this DNS
record, so no external DNS provider is required.
EOF
