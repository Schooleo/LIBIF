SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

COMPOSE := docker compose
COMPOSE_DEBUG := docker compose -f docker-compose.yml -f docker-compose.debug.yml --profile debug

.PHONY: help install dev build lint test test-e2e verify \
	infra-up infra-down infra-restart infra-logs infra-ps \
	debug-up debug-down debug-logs pgadmin db-migrate db-seed db-reset prisma-generate api web clean

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

dev: ## Start all workspace dev servers
	npm run dev

api: ## Start only the NestJS API dev server
	npm run dev -w apps/api

web: ## Start only the Next.js web dev server
	npm run dev -w apps/web

build: ## Build all workspaces
	npm run build

lint: ## Lint all workspaces
	npm run lint

test: ## Run unit/component tests
	npm test

test-e2e: ## Run API e2e tests
	npm run test:e2e

verify: lint test test-e2e build ## Run full local verification suite

clean: ## Remove generated build/test artifacts, preserving source and Docker volumes
	python3 -c "from pathlib import Path; import shutil; [shutil.rmtree(p) for p in map(Path, ['apps/api/dist','apps/api/coverage','apps/web/.next','apps/web/coverage','packages/shared/dist','packages/shared/coverage']) if p.exists()]"
