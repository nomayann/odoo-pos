{
    "name": "Point of sale partner list RGPD customization",
    "author": "Elabore, Coop'Cinelles",
    "website": "https://git.elabore.coop/elabore/coopcinelles-addons",
    "summary": """
    A the point of sale customization for Coop'Cinelles 38

    Removes GDPR columns from the partner list (address, email, phone number)
    Improves the partner list to only show valid customers
    Update search parameters to filter partners based on customer rank.
    Only search beased on the partner's name, not on other personal information.
    """,
    "version": "18.0.1.0.1",
    "category": "Point of Sale",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "coopcinelles_partner_list/static/src/app/screens/partner_line_override.xml",
            "coopcinelles_partner_list/static/src/app/screens/partner_list_override.xml",
            "coopcinelles_partner_list/static/src/app/screens/partner_list_patch.esm.js",
        ],
        "web.assets_tests": [
            "coopcinelles_partner_list/static/tests/tours/partner_list_rgpd_tour.js",
        ],
    },
    "installable": True,
    "license": "LGPL-3",
}
