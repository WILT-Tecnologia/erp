.DEFAULT_GOAL := help

BACKEND_SERVICES := db redis app nginx pgadmin
FRONTEND_SERVICES := frontend

.PHONY: help up up-backend up-frontend down down-backend down-frontend stop logs logs-backend logs-frontend ps build

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

up: ## Sobe backend + frontend juntos (comando único)
	docker compose up -d

up-backend: ## Sobe somente o backend (db, redis, app, nginx, pgadmin)
	docker compose up -d $(BACKEND_SERVICES)

up-frontend: ## Sobe somente o frontend (não inicia o backend junto)
	docker compose up -d --no-deps $(FRONTEND_SERVICES)

down: ## Derruba tudo (backend + frontend) e remove os containers
	docker compose down

down-backend: ## Derruba somente o backend
	docker compose stop $(BACKEND_SERVICES)
	docker compose rm -f $(BACKEND_SERVICES)

down-frontend: ## Derruba somente o frontend
	docker compose stop $(FRONTEND_SERVICES)
	docker compose rm -f $(FRONTEND_SERVICES)

stop: ## Para todos os containers sem remover
	docker compose stop

logs: ## Mostra logs de tudo
	docker compose logs -f

logs-backend: ## Mostra logs somente do backend
	docker compose logs -f $(BACKEND_SERVICES)

logs-frontend: ## Mostra logs somente do frontend
	docker compose logs -f $(FRONTEND_SERVICES)

ps: ## Lista os containers do projeto
	docker compose ps

build: ## Builda as imagens de backend e frontend
	docker compose build
