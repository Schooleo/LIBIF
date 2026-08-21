# Self-hosted pre-production staging with Tailscale Funnel

This is LIBIF's presentation, stakeholder-review, and acceptance-test environment. It is intentionally separate from both workstation development and the Vercel/Azure production design.

## Image promotion contract

| Git source | GHCR tag | Intended consumer |
|---|---|---|
| `dev` branch | `latest` only | Self-hosted development testing |
| `main` branch | Full 40-character commit SHA only | Self-hosted pre-production staging |
| `vMAJOR.MINOR.PATCH` tag | Semantic release tag only | Production release |

The `Staging Images` workflow runs the complete API and web quality gates on every `main` push before publishing `libif-api`, `libif-migrate`, and `libif-web` under that commit's SHA. It never writes `latest`. Conversely, the `dev` publishers write only `latest`; staging and production configurations never consume that moving tag.

## Architecture and boundary

```text
public reviewer
  -> https://libif-staging.<tailnet>.ts.net
  -> Tailscale Funnel (public TLS termination)
  -> 127.0.0.1:8080 in the shared Tailscale/Nginx network namespace
  -> Nginx
       |-- /api/* -> NestJS API
       `-- /*     -> Next.js web

private Compose network
  -> PostgreSQL / authenticated Redis / MinIO / worker / migrations
```

Docker publishes no host ports. Tailscale Funnel is the only ingress path, and Nginx listens only on loopback within the sidecar's network namespace. Browser API calls remain same-origin, while server-rendered web requests use the private `http://api:3001` address.

Funnel is public internet exposure, not a private tailnet share. Use synthetic/non-sensitive documents, keep development-header authentication disabled, use unique staging passwords, and stop Funnel when the review window ends. Funnel remains subject to Tailscale's documented bandwidth limits and supported HTTPS ports.

## 1. Tailnet prerequisites

Before starting Compose:

1. Enable MagicDNS and HTTPS certificates in the Tailscale admin console.
2. Authorize Funnel for a dedicated staging tag in the tailnet policy.
3. Create a reusable, non-ephemeral auth key authorized for that tag.
4. Decide the stable node name, normally `libif-staging`.

A narrowly scoped policy can follow this shape; merge it with the existing tailnet policy rather than replacing unrelated rules:

```json
{
  "tagOwners": {
    "tag:staging": ["autogroup:admin"]
  },
  "nodeAttrs": [
    {
      "target": ["tag:staging"],
      "attr": ["funnel"]
    }
  ]
}
```

Official references: [Tailscale Funnel requirements](https://tailscale.com/docs/features/tailscale-funnel), [Docker configuration parameters](https://tailscale.com/docs/features/containers/docker/docker-params), and [Tailscale's Docker sidecar/Funnel pattern](https://tailscale.com/blog/docker-tailscale-guide).

## 2. Configure staging

```bash
cp .env.staging.example .env.staging
chmod 600 .env.staging
editor .env.staging
```

Set `LIBIF_STAGING_BASE_URL` to the exact Funnel origin without a trailing slash:

```env
TAILSCALE_HOSTNAME="libif-staging"
LIBIF_STAGING_BASE_URL="https://libif-staging.<tailnet-name>.ts.net"
```

Replace every database, Redis, MinIO, token-signing, Tailscale, and demonstration-account placeholder with unique values. Do not reuse production secrets.

Authenticate the GitHub CLI and Docker to read the workflow result and GHCR packages. Public packages need no Docker token; private packages require a token with `read:packages`:

```bash
gh auth status
read -rsp 'GHCR read token: ' GHCR_READ_TOKEN; echo
printf '%s' "$GHCR_READ_TOKEN" | docker login ghcr.io --username <github-user> --password-stdin
unset GHCR_READ_TOKEN
```

Validate without starting containers:

```bash
make staging-pin-main
make staging-config
```

## 3. Start and verify

```bash
make staging-up
make staging-funnel
make staging-ps
```

`make staging-up` queries the newest successful `Staging Images` run on `main`, verifies the API, migration, and web manifests, writes its full SHA to `LIBIF_STAGING_RELEASE_SHA`, and uses `docker compose pull` plus `--no-build`. It fails rather than mixing artifacts or falling back to `latest`. `make staging-funnel` must report the same HTTPS origin configured in `LIBIF_STAGING_BASE_URL`. Public DNS can take several minutes to propagate after Funnel is first enabled.

Verify the public edge:

```bash
curl --fail --show-error --silent \
  "$(grep '^LIBIF_STAGING_BASE_URL=' .env.staging | cut -d= -f2- | tr -d '\"')/api/health"
```

Then open the Funnel URL in a browser and validate sign-in, processing, approval, Reader search/page jumps, History separation, and administration reporting.

## 4. Presentation data

```bash
make staging-seed
```

The staging seed uses the account emails documented in the root README but reads unique passwords from `STAGING_*_PASSWORD` variables in `.env.staging`. It also loads project-documentation PDFs and builds catalogue and page-level search indexes. Never upload confidential or regulated documents to this public presentation environment.

For existing data:

```bash
make staging-reindex-search
make staging-backfill-page-search
```

## 5. Operations and teardown

```bash
make staging-logs
make staging-ps
make staging-down
```

`staging-down` preserves named volumes, including the Tailscale node identity. To disable public exposure while retaining other containers, stop the Tailscale/Nginx pair:

```bash
docker compose --env-file .env.staging -f docker-compose.staging.yml stop nginx tailscale
```

Delete staging volumes only after confirming the presentation data and Tailscale identity are no longer needed:

```bash
docker compose --env-file .env.staging -f docker-compose.staging.yml down --volumes
```

The former `docker-compose.local.yml`, private `libif.local.com` CA, hosts-file mapping, and certificate export commands were intentionally removed. Staging uses a separate `libif-staging` project and separate named volumes so workstation development data cannot be mistaken for pre-production evidence.
