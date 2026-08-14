FROM nginx:1.29.1-alpine

RUN apk add --no-cache openssl

COPY --chmod=755 docker/nginx/generate-local-certificate.sh /docker-entrypoint.d/10-generate-local-certificate.sh
