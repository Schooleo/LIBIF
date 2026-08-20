# Free VPS production deployment

This guide keeps the LIBIF application topology intact on one Linux host: Next.js, NestJS, the BullMQ OCR worker, PostgreSQL, Redis, MinIO, migrations, and the HTTPS edge all run through `docker-compose.production.yml`. It is appropriate for demonstrations and low-volume institutional trials, not a highly available production service.

## Recommended free hosts

Free-tier terms and capacity change. The ranking below was checked against provider documentation on 20 August 2026.

| Rank | Option | Fit for LIBIF | Important limits |
|---|---|---|---|
| 1 | **Oracle Cloud Always Free Ampere A1** | Best permanent-free choice. Allocate the Always Free total as one ARM64 VM with 2 OCPUs and 12 GB RAM; that is enough for the complete stack and light, single-worker OCR. | Oracle's current Free Tier documentation defines the Always Free tenancy total as 2 A1 OCPUs and 12 GB RAM, plus 200 GB combined boot/block storage and 10 TB monthly outbound transfer. Capacity can be unavailable, and Always Free compute must be created in the account's home region. |
| 2 | **Azure for Students** | Best temporary student option. Use the USD 100 credit for an Ubuntu VM with at least 4 GB RAM, preferably 8 GB for OCR/build headroom. | No credit card is required, but the credit lasts 12 months and renewal depends on continued student eligibility. The specifically free B2pts v2/B2ats v2 VM variants have only 1 GB RAM, so they cannot host this complete stack reliably. |
| 3 | **AWS Free Plan** | Good for a short demonstration when OCI capacity is unavailable. Choose an eligible instance with at least 4 GB RAM and watch credits closely. | New-account free plans are credit-based and end after six months or when credits are exhausted; this is not an always-free host. |
| Not recommended | **Google Cloud e2-micro Always Free** | Too small for the combined database, object store, API, web, and OCR worker. | The allowance is one e2-micro in selected US regions; e2-micro has 1 GB RAM and a fractional CPU. |

Official terms: [Oracle Always Free resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), [Oracle Free Tier lifecycle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm), [Azure for Students](https://azure.microsoft.com/en-us/free/students), [Azure Bpsv2 sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/bpsv2-series), [Azure Basv2 sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/basv2-series), [AWS EC2 free-tier usage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html), and [Google Cloud Free Tier](https://docs.cloud.google.com/free/docs/free-cloud-features).

Render, Railway, and Vercel can host selected services, but they do not provide a free, untouched Docker Compose VPS for this complete persistent stack. Railway, for example, imports Compose services into its own service model rather than running the Compose file directly. A free self-hosted control plane such as Coolify can consume Compose, but it uses resources on the same small VM; start with plain Docker Compose instead. See [Railway's Compose guide](https://docs.railway.com/guides/docker-compose), [Render service types](https://render.com/docs/service-types), and [Coolify Compose support](https://coolify.io/docs/applications/build-packs/docker-compose).

## Recommended OCI shape

- Ubuntu 24.04 ARM64 on `VM.Standard.A1.Flex`.
- 2 OCPUs, 12 GB RAM, and a 100–150 GB boot volume.
- One OCR worker; do not scale `worker` on this shape without measuring CPU and memory.
- Add 2–4 GB swap for image-build spikes. Swap prevents abrupt out-of-memory termination but is not a substitute for RAM.
- Keep at least 20% of disk space free for PostgreSQL, MinIO objects, Docker layers, and OCR temporary files.

All pinned base/service images in the production Compose file publish ARM64 variants. Building the application images directly on an A1 host therefore produces native ARM64 images without emulation.

## First deployment

1. Create the VM and allow inbound TCP `22`, `80`, and `443`, plus UDP `443` for HTTP/3. Do not expose PostgreSQL, Redis, MinIO, or application ports.
2. Point the production hostname's DNS A/AAAA record at the VM. Remove an AAAA record if the VM is not actually reachable over IPv6.
3. Install Docker Engine and the Compose plugin from [Docker's official Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/). Add the deployment user to the `docker` group only if that user is trusted as root-equivalent.
4. Clone the repository and create the private environment file:

   ```bash
   cp .env.production.example .env.production
   chmod 600 .env.production
   editor .env.production
   ```

5. Replace every placeholder. Generate independent secrets, for example with `openssl rand -base64 48`. URL-encode special characters in the password portions of `DATABASE_URL` and `REDIS_URL` while keeping the raw values in `POSTGRES_PASSWORD` and `REDIS_PASSWORD`.
6. Validate and start the stack:

   ```bash
   make production-config
   make production-up
   make production-ps
   curl --fail --show-error "https://$LIBIF_HOSTNAME/api/health"
   ```

Caddy obtains and renews a public certificate and redirects HTTP to HTTPS automatically. DNS must already resolve to the VM, ports 80/443 must be reachable, and the `production_caddy_data` volume must remain persistent. These are the requirements documented by [Caddy Automatic HTTPS](https://caddyserver.com/docs/automatic-https). Only Caddy publishes host ports; all stateful services remain on an internal Docker network.

## Operations and recovery

- View logs with `make production-logs`; check health with `make production-ps`.
- Deploy a reviewed revision with `git pull --ff-only`, `make verify`, and `make production-up`. The migration service must finish successfully before the API and worker start.
- Stop containers with `make production-down`. This intentionally preserves named volumes.
- Never run `docker compose down --volumes` on a host containing data you need.
- Back up PostgreSQL with `pg_dump`, mirror MinIO objects to separate storage, and copy the Caddy data volume or rely on automatic certificate reissuance. Store backups off the VPS and test a restore. Provider snapshots alone are not a database-consistent backup strategy.
- Redis AOF is persisted so queued jobs survive normal container restarts. PostgreSQL and MinIO remain the durable sources of record; do not treat Redis as a document backup.
- Monitor free-tier account notices, boot-volume usage, `docker system df`, container health, and backup completion. Free accounts and idle resources can still be reclaimed under provider-specific policies.

This follows Docker's documented [single-server Compose production model](https://docs.docker.com/compose/how-tos/production/). It intentionally does not claim high availability: the VM, disk, and local Docker daemon are single points of failure. Move PostgreSQL, object storage, and Redis to managed or replicated services before using LIBIF for availability-critical workloads.
