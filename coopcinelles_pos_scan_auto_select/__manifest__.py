# -*- coding: utf-8 -*-
{
    "name": "Coop'Cinelles - POS - Scan Auto Select",
    "author": "Coop'Cinelles / yannchvl@gmail.com",
    "version": "18.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Automatically selects the first product in the search results when scanning a barcode in the POS.",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "coopcinelles_pos_scan_auto_select/static/src/js/product_screen_patch.js",
        ],
        "point_of_sale.assets_qunit_tests": [
            "coopcinelles_pos_scan_auto_select/static/tests/product_screen_patch.test.js",
        ],
    },
    "installable": True,
    "auto_install": False,
    "license": "LGPL-3",
}
