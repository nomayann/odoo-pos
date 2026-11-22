# Coop'Cinelles — Modules Odoo 18

Dépôt regroupant les développements spécifiques et personnalisations réalisés pour **Odoo 18 (Community)**.

---

## Prérequis techniques

- **Version d'Odoo :** `18.0` (Community Edition)
- **Conteneurisation :** Docker `24+` & Docker Compose (`docker compose` v2)
- **Base de données :** PostgreSQL `15` ou `16`
- **Dépendances natives principales :** `point_of_sale`, `sale_management`, `stock`, `account`, `contacts` *(à adapter selon vos modules)*

---

## Catalogue des modules

| Nom technique | Nom fonctionnel | Description |
| :--- | :--- | :--- |
| coopcinelles_pos_scan_auto_select | POS - Scan Auto Select | Automatically selects the first product in the search results when scanning a barcode in the POS |

---

## Environnement de développement et de test (Docker Compose)

Un fichier `docker-compose.yml` est directement disponible à la racine du dépôt pour lancer une instance **Odoo 18** isolée et monter automatiquement les modules locaux.

### 1. Démarrer l'environnement local

À la racine du dépôt :

```bash
docker compose up -d

## Déploiement et release

### Versionnement

Les montées de version des modules sont générées automatiquement. Lorsqu'une pull request est mergée, une pull request est automatiquement ouverte avec la mise à jour du fichier `__manifest__.py` du module. (github workflow `bump-version`)

### Tags et release

Lorsque'une nouvelle version de module est mergée dans la branche mais, un tag et une release de module sont automatiquement générés(workflow `tag-and-release-odoo-module`).
