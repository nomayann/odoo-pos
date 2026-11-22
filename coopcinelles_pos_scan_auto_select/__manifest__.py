# -*- coding: utf-8 -*-
{
    "name": "Coop'Cinelles - POS - Scan Auto Select",
    "version": "18.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Automatically selects the first product in the search results when scanning a barcode in the POS.",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "coopcinelles_pos_barcode_search/static/src/js/product_screen_patch.js",
        ],
    },
    "installable": True,
    "license": "LGPL-3",
}
