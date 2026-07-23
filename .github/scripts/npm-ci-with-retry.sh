#!/usr/bin/env bash

set -euo pipefail

max_attempts="${NPM_CI_MAX_ATTEMPTS:-3}"
base_delay_seconds="${NPM_CI_RETRY_BASE_DELAY_SECONDS:-15}"

if ! [[ "$max_attempts" =~ ^[1-9][0-9]*$ ]]; then
  echo "::error::NPM_CI_MAX_ATTEMPTS must be a positive integer."
  exit 2
fi

if ! [[ "$base_delay_seconds" =~ ^[0-9]+$ ]]; then
  echo "::error::NPM_CI_RETRY_BASE_DELAY_SECONDS must be a non-negative integer."
  exit 2
fi

export NPM_CONFIG_FETCH_RETRIES="${NPM_CONFIG_FETCH_RETRIES:-5}"
export NPM_CONFIG_FETCH_RETRY_MINTIMEOUT="${NPM_CONFIG_FETCH_RETRY_MINTIMEOUT:-20000}"
export NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT="${NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT:-120000}"
export NPM_CONFIG_FETCH_TIMEOUT="${NPM_CONFIG_FETCH_TIMEOUT:-300000}"

for ((attempt = 1; attempt <= max_attempts; attempt += 1)); do
  log_file="$(mktemp)"

  set +e
  npm ci --prefer-offline --no-audit --fund=false 2>&1 | tee "$log_file"
  install_status="${PIPESTATUS[0]}"
  set -e

  if [[ "$install_status" -eq 0 ]]; then
    rm -f "$log_file"
    exit 0
  fi

  if ! grep -Eq \
    'npm error (code )?(ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|ECONNREFUSED)|npm error network' \
    "$log_file"; then
    rm -f "$log_file"
    exit "$install_status"
  fi

  if [[ "$attempt" -eq "$max_attempts" ]]; then
    rm -f "$log_file"
    exit "$install_status"
  fi

  delay_seconds=$((base_delay_seconds * attempt))
  echo "::warning::npm ci hit a transient network failure (attempt ${attempt}/${max_attempts}); retrying in ${delay_seconds}s."
  npm cache verify || true
  rm -f "$log_file"
  sleep "$delay_seconds"
done
