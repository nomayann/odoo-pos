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
		-x "Makefile"; \
	echo "✅ Successfully generated: $$ZIP_NAME"

zip-all: $(MODULES) ## Generate clean ZIPs for ALL modules in the monorepo
	@echo "🎉 All modules have been packaged successfully!"

clean: ## Remove all generated ZIP archives from the root directory
	@echo "🧹 Cleaning up ZIP archives..."
	@rm -f *.zip
	@echo "✅ Cleanup completed."
