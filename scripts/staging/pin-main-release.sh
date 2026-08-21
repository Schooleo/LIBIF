#!/usr/bin/env bash
set -euo pipefail

env_file="${1:-.env.staging}"
workflow_file="${STAGING_WORKFLOW_FILE:-staging.yml}"

if [[ ! -f "${env_file}" ]]; then
  echo "Missing ${env_file}; copy .env.staging.example and configure staging first." >&2
  exit 1
fi

for command_name in gh docker python3; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "${command_name} is required to resolve and verify the newest main staging release." >&2
    exit 1
  fi
done

set -a
# shellcheck disable=SC1090
source "${env_file}"
set +a

: "${LIBIF_GHCR_NAMESPACE:?Set LIBIF_GHCR_NAMESPACE in ${env_file}}"

repository="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner --jq '.nameWithOwner')}"
release_sha="$(gh run list \
  --repo "${repository}" \
  --workflow "${workflow_file}" \
  --branch main \
  --event push \
  --status success \
  --limit 1 \
  --json headSha \
  --jq '.[0].headSha // empty')"

if [[ ! "${release_sha}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "No successful ${workflow_file} run with a full main-branch SHA was found for ${repository}." >&2
  exit 1
fi

for image in libif-api libif-migrate libif-web; do
  reference="ghcr.io/${LIBIF_GHCR_NAMESPACE}/${image}:${release_sha}"
  if ! docker buildx imagetools inspect "${reference}" >/dev/null; then
    echo "The successful workflow SHA is missing ${reference}; refusing a partial staging release." >&2
    exit 1
  fi
done

python3 - "${env_file}" "${release_sha}" <<'PY'
from pathlib import Path
import os
import re
import sys
import tempfile

env_path = Path(sys.argv[1])
release_sha = sys.argv[2]
content = env_path.read_text()
line = f'LIBIF_STAGING_RELEASE_SHA="{release_sha}"'
pattern = re.compile(r'^LIBIF_STAGING_RELEASE_SHA=.*$', re.MULTILINE)
if pattern.search(content):
    updated = pattern.sub(line, content, count=1)
else:
    updated = f'{content.rstrip()}\n{line}\n'

mode = env_path.stat().st_mode
with tempfile.NamedTemporaryFile('w', dir=env_path.parent, delete=False) as temporary:
    temporary.write(updated)
    temporary_path = Path(temporary.name)
os.chmod(temporary_path, mode)
os.replace(temporary_path, env_path)
PY

printf 'Pinned staging to main release %s.\n' "${release_sha}"
