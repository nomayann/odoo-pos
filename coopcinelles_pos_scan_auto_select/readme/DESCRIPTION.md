# POS - Scan Auto Select

Module Odoo 18 développé pour **Coop'Cinelles** afin d'améliorer l'utilisation d'une douchette code-barres lorsque le focus se trouve dans la barre de recherche du Point de Vente (POS).

---

## Description fonctionnelle

Dans le Point de Vente d'Odoo, un caissier peut parfois scanner un code-barres alors que le curseur est actif dans le champ de recherche de produits (`.pos-topheader input[type='text']`).

La confusion avec le comportement de scan standard déclenche un comportement de recherche/sélection inadapté, exposant à des produits non facturés.

Le lecteur de code-barres émet une chaine composée de 8 à 14 chiffres + `Entrée`.

Ce module ajoute le comportement suivant (écran `ProductScreen`):

1. **Détection de scan lors de l'appui sur Entrée dans la barre de recherche :**
   - Lors d'une saisie de code barres + **Entrée** alors que le focus est dans le champ de recherche du bandeau supérieur du POS, le module vérifie si la valeur saisie :
     - correspond exactement au code-barres (`barcode` ou `product_tmpl_id.barcode`) d'un unique produit affiché, **ou**
     - ressemble à un code-barres numérique standard (de 8 à 14 chiffres : EAN-8, EAN-13, UPC, code-barres balance, etc.).
2. **Nettoyage du champ et perte de focus :**
   - La propagation normale de la touche **Entrée** est interceptée.
   - La recherche en cours (`searchProductWord`) et la valeur du champ texte sont vidées, puis le champ perd le focus (`blur()`) afin que les scans suivants soient gérés globalement par le lecteur de code-barres.
3. **Délégation au lecteur natif du POS :**
   - Le code est transmis à `barcode_reader.scan(...)` afin de bénéficier du traitement natif d'Odoo 18 (articles pesés, lots, conditionnements, etc.).
4. **Respect des recherches textuelles classiques :**
   - Si la saisie correspond à une recherche texte normale (ex. un nom de produit) et non à un code-barres, le comportement standard de recherche est conservé.

---

## Configuration et installation

1. Dépend du module `point_of_sale` (Odoo 18).
2. Installez ou mettez à jour le module `coopcinelles_pos_scan_auto_select` dans votre base Odoo.

---

## Tests

Le module inclut un tour de test POS (`CoopcinellesPosScanAutoSelectTour` dans `static/tests/tours/scan_auto_select_tour.js`) ainsi qu'un test d'intégration `HttpCase` (`tests/test_pos_scan_auto_select.py`).

### Exécution dans le navigateur

1. Ouvrez le Point de Vente avec les assets de test activés (ex. `http://localhost:8069/pos/ui?config_id=1&debug=tests`).
2. Depuis la console du navigateur (`F12`), lancez le tour :
   ```javascript
   odoo.__WOWL_DEBUG__.root.env.services.tour_service.startTour("CoopcinellesPosScanAutoSelectTour");


