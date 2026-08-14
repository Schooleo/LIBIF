#!/bin/sh
set -eu

hostname="${LIBIF_TLS_HOSTNAME:-libif.local.com}"
valid_days="${LIBIF_TLS_CERT_DAYS:-825}"
certificate_directory=/etc/nginx/certs
ca_certificate_path="${certificate_directory}/libif-local-ca.crt"
ca_private_key_path="${certificate_directory}/libif-local-ca.key"
certificate_path="${certificate_directory}/libif.local.com.crt"
private_key_path="${certificate_directory}/libif.local.com.key"

if [ -s "$ca_certificate_path" ] && [ -s "$ca_private_key_path" ] && \
   [ -s "$certificate_path" ] && [ -s "$private_key_path" ]; then
  exit 0
fi

mkdir -p "$certificate_directory"
umask 077
certificate_request_path="$(mktemp)"
certificate_extensions_path="$(mktemp)"
trap 'rm -f "$certificate_request_path" "$certificate_extensions_path"' EXIT

openssl req \
  -x509 \
  -nodes \
  -newkey rsa:3072 \
  -sha256 \
  -days "$valid_days" \
  -subj "/CN=LIBIF Local Development CA" \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
  -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -keyout "$ca_private_key_path" \
  -out "$ca_certificate_path"

openssl req \
  -nodes \
  -newkey rsa:2048 \
  -sha256 \
  -subj "/CN=${hostname}" \
  -keyout "$private_key_path" \
  -out "$certificate_request_path"

cat >"$certificate_extensions_path" <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=DNS:${hostname}
EOF

openssl x509 \
  -req \
  -in "$certificate_request_path" \
  -CA "$ca_certificate_path" \
  -CAkey "$ca_private_key_path" \
  -CAcreateserial \
  -sha256 \
  -days "$valid_days" \
  -extfile "$certificate_extensions_path" \
  -out "$certificate_path"

chmod 600 "$ca_private_key_path"
chmod 600 "$private_key_path"
chmod 644 "$ca_certificate_path"
chmod 644 "$certificate_path"
