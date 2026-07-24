# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

FROM dependencies AS build
ENV DATABASE_URL=postgresql://build:build@localhost:5432/libif?schema=public
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w packages/shared \
    && npm pack --workspace=@libif/shared --pack-destination /tmp \
    && npm run prisma:generate -w apps/api \
    && npm run build -w apps/api

FROM base AS runtime-dependencies
COPY apps/api/package.json package.json
COPY package-lock.json package-lock.json
COPY --from=build /tmp/libif-shared-0.1.0.tgz ./libif-shared-0.1.0.tgz
RUN npm pkg set dependencies.@libif/shared=file:./libif-shared-0.1.0.tgz \
    && npm install --omit=dev --ignore-scripts \
    && npm cache clean --force

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
      imagemagick \
      poppler-utils \
      tesseract-ocr \
      tesseract-ocr-eng \
      tesseract-ocr-vie \
    && rm -rf /var/lib/apt/lists/*

COPY --from=runtime-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist

USER node
EXPOSE 3001
CMD ["node", "apps/api/dist/src/main.js"]
