{
    "name": "POS Scan Auto Select",
    "author": "Elabore, Coop'Cinelles",
    "website": "https://git.elabore.coop/elabore/coopcinelles-addons",
    "version": "18.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Auto-select scanned product from POS search bar",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "coopcinelles_pos_scan_auto_select/static/src/js/product_screen_patch.esm.js",  # noqa: E501
        ],
        "web.assets_tests": [
            "coopcinelles_pos_scan_auto_select/static/tests/tours/scan_auto_select_tour.esm.js",  # noqa: E501
        ],
    },
    "installable": True,
    "license": "LGPL-3",
}
