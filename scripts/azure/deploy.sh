#!/usr/bin/env bash
set -euo pipefail

: "${LIBIF_RELEASE_TAG:?LIBIF_RELEASE_TAG must be injected by the deployment workflow}"
: "${LIBIF_RELEASE_SHA:?LIBIF_RELEASE_SHA must be injected by the deployment workflow}"
: "${LIBIF_REPOSITORY:?LIBIF_REPOSITORY must be injected by the deployment workflow}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Azure Run Command must execute this deployment as root." >&2
  exit 1
fi

if [[ ! "${LIBIF_RELEASE_TAG}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Release tag must use vMAJOR.MINOR.PATCH, for example v1.2.3." >&2
  exit 1
fi

if [[ ! "${LIBIF_RELEASE_SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Release SHA must be a complete 40-character Git commit SHA." >&2
  exit 1
fi

if [[ ! "${LIBIF_REPOSITORY}" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "Repository must use owner/name format." >&2
  exit 1
fi

exec 9>/var/lock/libif-deploy.lock
if ! flock -n 9; then
  echo "Another LIBIF deployment is already running." >&2
  exit 1
fi

readonly app_dir=/opt/libif
readonly env_file=/etc/libif/.env.production
readonly repository_url="https://github.com/${LIBIF_REPOSITORY}.git"
readonly registry_owner="${LIBIF_REPOSITORY%%/*}"
readonly registry_owner_lower="${registry_owner,,}"

if [[ ! -f "${env_file}" ]]; then
  echo "Missing ${env_file}; install the Azure production environment before deploying." >&2
  exit 1
fi

if grep -Eq '^(LIBIF_HOSTNAME|LIBIF_API_HOSTNAME|LIBIF_ACME_EMAIL|LIBIF_WEB_BASE_URL)=.*example|=(change-me|replace-with-)' "${env_file}"; then
  echo "Replace every example/placeholder value in ${env_file} before deploying." >&2
  exit 1
fi

if [[ ! -d "${app_dir}/.git" ]]; then
  if [[ -d "${app_dir}" && -n "$(find "${app_dir}" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
    echo "${app_dir} exists but is not an empty directory or a Git checkout; refusing to replace it." >&2
    exit 1
  fi
  git clone --filter=blob:none --no-checkout "${repository_url}" "${app_dir}"
fi

cd "${app_dir}"
git remote set-url origin "${repository_url}"
git fetch --force --depth=1 origin "refs/tags/${LIBIF_RELEASE_TAG}:refs/tags/${LIBIF_RELEASE_TAG}"
release_sha="$(git rev-list --max-count=1 "${LIBIF_RELEASE_TAG}")"
if [[ "${release_sha}" != "${LIBIF_RELEASE_SHA}" ]]; then
  echo "Release tag ${LIBIF_RELEASE_TAG} resolves to ${release_sha}, not ${LIBIF_RELEASE_SHA}." >&2
  exit 1
fi
git checkout --force --detach "${LIBIF_RELEASE_SHA}"

export LIBIF_API_IMAGE="ghcr.io/${registry_owner_lower}/libif-api:${LIBIF_RELEASE_TAG}"
export LIBIF_MIGRATE_IMAGE="ghcr.io/${registry_owner_lower}/libif-migrate:${LIBIF_RELEASE_TAG}"

compose=(
  docker compose
  --env-file "${env_file}"
  -f docker-compose.production.yml
  -f docker-compose.azure.yml
)

"${compose[@]}" config --quiet
"${compose[@]}" pull postgres redis minio migrate api worker azure-edge
"${compose[@]}" up --detach --no-build --remove-orphans --wait --wait-timeout 300

api_hostname="$("${compose[@]}" config --format json | jq -r '.services["azure-edge"].environment.LIBIF_API_HOSTNAME')"
if [[ -z "${api_hostname}" || "${api_hostname}" == "null" ]]; then
  echo "Unable to resolve LIBIF_API_HOSTNAME from the rendered Compose configuration." >&2
  exit 1
fi

curl \
  --fail \
  --show-error \
  --silent \
  --retry 12 \
  --retry-all-errors \
  --retry-delay 5 \
  "https://${api_hostname}/api/health" >/dev/null

install -d -m 0755 /var/lib/libif-deploy
printf '%s\n' "${LIBIF_RELEASE_TAG}" > /var/lib/libif-deploy/current-release
printf '%s\n' "${LIBIF_RELEASE_SHA}" > /var/lib/libif-deploy/current-release-sha

echo "LIBIF backend release ${LIBIF_RELEASE_TAG} (${LIBIF_RELEASE_SHA}) is healthy at https://${api_hostname}."
