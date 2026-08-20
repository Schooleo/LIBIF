SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

COMPOSE := docker compose
COMPOSE_DEBUG := docker compose -f docker-compose.yml -f docker-compose.debug.yml --profile debug
STAGING_ENV_FILE ?= .env.staging
COMPOSE_STAGING := docker compose --env-file $(STAGING_ENV_FILE) -f docker-compose.staging.yml
COMPOSE_PRODUCTION := docker compose --env-file .env.production -f docker-compose.production.yml
AZURE_ENV_FILE ?= .env.azure.production
COMPOSE_AZURE := docker compose --env-file $(AZURE_ENV_FILE) -f docker-compose.production.yml -f docker-compose.azure.yml


.PHONY: help install dev build lint test test-e2e test-worker verify \
	infra-up infra-down infra-restart infra-logs infra-ps \
	staging-config staging-pin-main staging-up staging-funnel staging-seed staging-reindex-search staging-backfill-page-search staging-down staging-logs staging-ps \
	production-config production-up production-down production-logs production-ps \
	azure-config azure-down azure-logs azure-ps \
	debug-up debug-down debug-logs pgadmin db-migrate db-seed db-reset prisma-generate api web worker clean

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*##"; printf "LIBIF development commands:\n\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install npm workspace dependencies
	npm install

infra-up: ## Start core local services: Postgres, Redis, MinIO
	$(COMPOSE) up -d

infra-down: ## Stop core local services
	$(COMPOSE) down

infra-restart: ## Restart core local services
	$(COMPOSE) restart

infra-logs: ## Follow core service logs
	$(COMPOSE) logs -f

infra-ps: ## Show Docker service status
	$(COMPOSE) ps

staging-config: ## Validate the self-hosted staging environment and Funnel URL
	@test -f $(STAGING_ENV_FILE) || { echo "Missing $(STAGING_ENV_FILE); copy .env.staging.example and replace every placeholder." >&2; exit 1; }
	@! grep -Eq 'example-tailnet|replace-with-|tskey-auth-replace' $(STAGING_ENV_FILE) || { echo "Replace every placeholder in $(STAGING_ENV_FILE) before staging deployment." >&2; exit 1; }
	@set -a; source $(STAGING_ENV_FILE); set +a; \
		[[ "$${LIBIF_STAGING_BASE_URL:-}" =~ ^https://[a-z0-9-]+\.[a-z0-9-]+\.ts\.net$$ ]] || { \
			echo "LIBIF_STAGING_BASE_URL must be the Funnel origin https://<node>.<tailnet>.ts.net without a trailing slash." >&2; \
			exit 1; \
		}
	@set -a; source $(STAGING_ENV_FILE); set +a; \
		[[ "$${LIBIF_GHCR_NAMESPACE:-}" =~ ^[a-z0-9_.-]+$$ ]] || { \
			echo "LIBIF_GHCR_NAMESPACE must be the lowercase GHCR owner or organization." >&2; \
			exit 1; \
		}
	@set -a; source $(STAGING_ENV_FILE); set +a; \
		[[ "$${LIBIF_STAGING_RELEASE_SHA:-}" =~ ^[0-9a-f]{40}$$ ]] || { \
			echo "LIBIF_STAGING_RELEASE_SHA must be the full SHA from a successful main-branch Staging Images workflow." >&2; \
			exit 1; \
		}
	$(COMPOSE_STAGING) config --quiet

staging-pin-main: ## Pin staging to the newest successful main SHA published to GHCR
	scripts/staging/pin-main-release.sh $(STAGING_ENV_FILE)

staging-up: staging-pin-main ## Pull and start the newest successful main SHA behind Funnel
	$(MAKE) --no-print-directory STAGING_ENV_FILE=$(STAGING_ENV_FILE) staging-config
	$(COMPOSE_STAGING) pull
	$(COMPOSE_STAGING) up --detach --no-build --wait --wait-timeout 300
	@echo "Staging is configured at $$(set -a; source $(STAGING_ENV_FILE); printf '%s' "$$LIBIF_STAGING_BASE_URL")."
	@echo "Run 'make staging-funnel' to confirm the public Funnel route."

staging-funnel: ## Show the active public Tailscale Funnel route
	$(COMPOSE_STAGING) exec tailscale tailscale funnel status

staging-seed: staging-config ## Migrate, seed demonstration data, and index staging search data
	$(COMPOSE_STAGING) pull migrate seed worker
	$(COMPOSE_STAGING) up -d --wait postgres minio redis
	$(COMPOSE_STAGING) run --rm --no-deps migrate
	$(COMPOSE_STAGING) run --rm --no-deps seed
	$(COMPOSE_STAGING) run --rm --no-deps worker node apps/api/dist/src/scripts/backfill-page-text.js
	$(COMPOSE_STAGING) run --rm --no-deps seed npx tsx scripts/backfill-search-index.ts

staging-reindex-search: staging-config ## Rebuild the staging public-catalogue search projection
	$(COMPOSE_STAGING) pull migrate seed
	$(COMPOSE_STAGING) up -d --wait postgres minio redis
	$(COMPOSE_STAGING) run --rm --no-deps migrate
	$(COMPOSE_STAGING) run --rm --no-deps seed npx tsx scripts/backfill-search-index.ts

staging-backfill-page-search: staging-config ## Build staging page-level search data for existing PDFs
	$(COMPOSE_STAGING) pull migrate worker
	$(COMPOSE_STAGING) up -d --wait postgres minio redis
	$(COMPOSE_STAGING) run --rm --no-deps migrate
	$(COMPOSE_STAGING) run --rm --no-deps worker node apps/api/dist/src/scripts/backfill-page-text.js

staging-down: ## Stop staging without deleting its persistent volumes
	$(COMPOSE_STAGING) down

staging-logs: ## Follow self-hosted staging logs
	$(COMPOSE_STAGING) logs -f

staging-ps: ## Show staging service and health status
	$(COMPOSE_STAGING) ps

production-config: ## Validate the production Compose file and private environment
	@test -f .env.production || { echo "Missing .env.production; copy .env.production.example and replace every placeholder." >&2; exit 1; }
	@! grep -Eq '^(LIBIF_HOSTNAME|LIBIF_ACME_EMAIL)=.*example|=(change-me|replace-with-)' .env.production || { echo "Replace every example/placeholder value in .env.production before deployment." >&2; exit 1; }
	$(COMPOSE_PRODUCTION) config --quiet

production-up: production-config ## Build and start the production VPS stack
	$(COMPOSE_PRODUCTION) up --build -d --wait --wait-timeout 300

production-down: ## Stop the production stack without deleting persistent volumes
	$(COMPOSE_PRODUCTION) down

production-logs: ## Follow production stack logs
	$(COMPOSE_PRODUCTION) logs -f

production-ps: ## Show production service and health status
	$(COMPOSE_PRODUCTION) ps

azure-config: ## Validate the Azure backend-only Compose configuration
	@test -f $(AZURE_ENV_FILE) || { echo "Missing $(AZURE_ENV_FILE); copy .env.azure.production.example and replace every placeholder." >&2; exit 1; }
	@! grep -Eq '^(LIBIF_HOSTNAME|LIBIF_API_HOSTNAME|LIBIF_ACME_EMAIL|LIBIF_WEB_BASE_URL)=.*example|=(change-me|replace-with-)' $(AZURE_ENV_FILE) || { echo "Replace every example/placeholder value in $(AZURE_ENV_FILE) before deployment." >&2; exit 1; }
	$(COMPOSE_AZURE) config --quiet

azure-down: ## Stop the Azure backend stack without deleting persistent volumes
	$(COMPOSE_AZURE) down

azure-logs: ## Follow Azure backend container logs
	$(COMPOSE_AZURE) logs -f

azure-ps: ## Show Azure backend container and health status
	$(COMPOSE_AZURE) ps

debug-up: ## Start core services plus debug tools such as pgAdmin
	$(COMPOSE_DEBUG) up -d

debug-down: ## Stop only debug services such as pgAdmin
	$(COMPOSE_DEBUG) stop pgadmin

debug-logs: ## Follow pgAdmin/debug service logs
	$(COMPOSE_DEBUG) logs -f pgadmin

pgadmin: debug-up ## Start pgAdmin and print its local URL/login
	@echo "pgAdmin: http://localhost:$${PGADMIN_PORT:-5050}"
	@echo "Login:   $${PGADMIN_DEFAULT_EMAIL:-admin@libif.local}"
	@echo "Password: $${PGADMIN_DEFAULT_PASSWORD:-admin}"
	@echo "Postgres server inside Docker: host=postgres port=5432 db=libif user=library password=library"

db-migrate: ## Apply Prisma migrations
	npm run db:migrate

db-seed: ## Seed development users and starter categories
	npm run db:seed

prisma-generate: ## Generate Prisma client
	npm run prisma:generate -w apps/api

db-reset: ## Reset local database, apply migrations, and seed data
	npm run db:migrate -w apps/api -- --reset --force
	npm run db:seed

dev: ## Start the web app, HTTP API, and background OCR worker
	@set -euo pipefail; \
	pids=""; \
	cleanup() { \
		trap - EXIT INT TERM; \
		if [[ -n "$$pids" ]]; then \
			kill $$pids 2>/dev/null || true; \
			wait $$pids 2>/dev/null || true; \
		fi; \
	}; \
	trap cleanup EXIT INT TERM; \
	$(MAKE) --no-print-directory api & pids="$$pids $$!"; \
	$(MAKE) --no-print-directory web & pids="$$pids $$!"; \
	$(MAKE) --no-print-directory worker & pids="$$pids $$!"; \
	wait -n $$pids

api: ## Start only the NestJS API dev server
	npm run dev -w apps/api

web: ## Start only the Next.js web dev server
	npm run dev -w apps/web

worker: ## Start only the background PDF/OCR worker in watch mode
	npm run dev:worker -w apps/api

build: ## Build all workspaces
	npm run build

lint: ## Lint all workspaces
	npm run lint

test: ## Run unit/component tests
	npm test

test-e2e: ## Run API e2e tests
	npm run test:e2e

test-worker: ## Run Redis/MinIO/PostgreSQL/PDF/OCR worker integration tests
	npm run test:worker

verify: lint test test-e2e test-worker build ## Run full local verification suite

clean: ## Remove generated build/test artifacts, preserving source and Docker volumes
	python3 -c "from pathlib import Path; import shutil; [shutil.rmtree(p) for p in map(Path, ['apps/api/dist','apps/api/coverage','apps/web/.next','apps/web/coverage','packages/shared/dist','packages/shared/coverage']) if p.exists()]"
