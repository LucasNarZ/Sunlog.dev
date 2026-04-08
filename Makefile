COMPOSE_BASE := docker compose --env-file .env -f infra/docker-compose.yml
COMPOSE_DEV := $(COMPOSE_BASE) -f infra/docker-compose.dev.yml
COMPOSE_PROD := $(COMPOSE_BASE) -f infra/docker-compose.prod.yml

.PHONY: dev-up dev-down dev-build dev-logs prod-up prod-down prod-build prod-pull prod-logs

dev-up:
	$(COMPOSE_DEV) up -d --build

dev-down:
	$(COMPOSE_DEV) down

dev-build:
	$(COMPOSE_DEV) build

dev-logs:
	$(COMPOSE_DEV) logs -f

prod-up:
	$(COMPOSE_PROD) up -d

prod-down:
	$(COMPOSE_PROD) down

prod-build:
	$(COMPOSE_PROD) build

prod-pull:
	$(COMPOSE_PROD) pull

prod-logs:
	$(COMPOSE_PROD) logs -f
