# ==============================================================================
# Makefile for Coop'Cinelles 38 Odoo modules
# ==============================================================================

.PHONY: help clean zip-all

# List of all Odoo modules in the monorepo
MODULES = coopcinelles_gift_card coopcinelles_partner_list

.PHONY: coopcinelles_gift_card coopcinelles_partner_list

help: ## Display this help message
	@echo "======================================================================"
	@echo " Available commands for Coop'Cinelles Odoo modules"
	@echo "======================================================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'
	@echo ""

# Generic rule: 'make coopcinelles_gift_card' or 'make coopcinelles_partner_list'
$(MODULES): ## Generate a clean ZIP for a specific module (e.g., make coopcinelles_gift_card)
	@VERSION=$$(grep -oE "['\"]version['\"]:\s*['\"]([0-9.]+)['\"]" $@/__manifest__.py | grep -oE "[0-9.]+"); \
	ZIP_NAME="$@-$$VERSION.zip"; \
	echo "📦 Creating $$ZIP_NAME..."; \
	zip -r "$$ZIP_NAME" "$@" \
		-x "*/.git*" \
		-x "*/__pycache__/*" \
		-x "*.pyc" \
		-x "*.DS_Store" \
		-x "*/tests/*" \
		-x "*/.editorconfig" \
		-x "*/.gitignore" \
		-x "*/.github/*" \
		-x "*/.vscode/*" \
		-x "docker-compose.yaml" \
		-x "Makefile"; \
	echo "✅ Successfully generated: $$ZIP_NAME"

zip-all: $(MODULES) ## Generate clean ZIPs for ALL modules in the monorepo
	@echo "🎉 All modules have been packaged successfully!"

.PHONY: help up down restart rebuild logs ps \
        test test-tour test-unit test-quick clean-output

COMPOSE_FILE ?= docker-compose.yaml
WEB_SERVICE  ?= web
DB           ?= test
MODULE       ?= coopcinelles_partner_list
HTTP_PORT    ?= 18069
GEVENT_PORT  ?= 18072
OUTPUT_DIR   ?= ./odoo_tests_output

# Si un argument est passé après une cible (ex: make test mon_module),
# on le capture dans TARGET_MODULE et on neutralise sa cible vide.
TEST_TARGETS := test test-tour test-unit test-quick
ifneq ($(filter $(firstword $(MAKECMDGOALS)),$(TEST_TARGETS)),)
  EXTRA_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  ifneq ($(EXTRA_ARGS),)
    MODULE := $(firstword $(EXTRA_ARGS))
    $(eval $(EXTRA_ARGS):;@:)
  endif
endif

# help: ## Afficher l'aide et les commandes disponibles
# 	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# --- Docker Compose ---

up: ## Démarrer les services Docker en arrière-plan
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Arrêter et supprimer les conteneurs
	docker compose -f $(COMPOSE_FILE) down

restart: ## Redémarrer les services Docker
	docker compose -f $(COMPOSE_FILE) restart

rebuild: ## Reconstruire et redémarrer les services Docker
	docker compose -f $(COMPOSE_FILE) up -d --build

ps: ## Afficher l'état des conteneurs
	docker compose -f $(COMPOSE_FILE) ps

logs: ## Suivre les logs du service Odoo
	docker compose -f $(COMPOSE_FILE) logs -f $(WEB_SERVICE)

# --- Tests Odoo (MODULE par défaut : coopcinelles_partner_list) ---

test: ## Lancer tous les tests du module avec -u [MODULE]
	docker compose -f $(COMPOSE_FILE) exec -T $(WEB_SERVICE) odoo \
		-c /etc/odoo/odoo.conf \
		--http-port=$(HTTP_PORT) \
		--gevent-port=$(GEVENT_PORT) \
		-d $(DB) \
		-u $(MODULE) \
		--test-enable \
		--test-tags /$(MODULE) \
		--stop-after-init

test-tour: ## Lancer le test du tour frontend [MODULE]
	docker compose -f $(COMPOSE_FILE) exec -T $(WEB_SERVICE) odoo \
		-c /etc/odoo/odoo.conf \
		--http-port=$(HTTP_PORT) \
		--gevent-port=$(GEVENT_PORT) \
		-d $(DB) \
		-u $(MODULE) \
		--test-enable \
		--test-tags /$(MODULE) \
		--stop-after-init

test-unit: ## Lancer les tests hors tour frontend [MODULE]
	docker compose -f $(COMPOSE_FILE) exec -T $(WEB_SERVICE) odoo \
		-c /etc/odoo/odoo.conf \
		--http-port=$(HTTP_PORT) \
		--gevent-port=$(GEVENT_PORT) \
		-d $(DB) \
		-u $(MODULE) \
		--test-enable \
		--test-tags /$(MODULE),-tour \
		--stop-after-init

test-quick: ## Relancer les tests sans -u [MODULE]
	docker compose -f $(COMPOSE_FILE) exec -T $(WEB_SERVICE) odoo \
		-c /etc/odoo/odoo.conf \
		--http-port=$(HTTP_PORT) \
		--gevent-port=$(GEVENT_PORT) \
		-d $(DB) \
		--test-enable \
		--test-tags /$(MODULE) \
		--stop-after-init

clean-output: ## Nettoyer les captures d'écran et fichiers temporaires de test et zip
	rm -rf $(OUTPUT_DIR)/*
	@echo "🧹 Cleaning up ZIP archives..."
	@rm -f *.zip
	@echo "✅ Cleanup completed."

