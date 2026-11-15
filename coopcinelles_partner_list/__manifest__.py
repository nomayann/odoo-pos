# -*- coding: utf-8 -*-
{
    'name': "Point of sale partner list Coop'Cinelles",
    'author': "Coop'Cinelles 38 / yannchvl@gmail.com",
    'description': """
    A the point of sale customization for Coop'Cinelles 38

    Removes GDPR columns from the partner list (address, email, phone number)
    Improves the partner list to only show valid customers, excluding pure suppliers and Odoo users.
    Update search parameters to filter partners based on customer rank and user association.
    Only search beased on the partner's name, not on the email, phone number or address.
    """,
    'version': '18.0.1.0.1',
    'category': 'Point of Sale',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'coopcinelles_partner_list/static/src/app/screens/partner_line_override.xml',
            'coopcinelles_partner_list/static/src/app/screens/partner_list_override.xml',
            'coopcinelles_partner_list/static/src/app/screens/partner_list_patch.js',
        ],
    },
    'installable': True,
    'license': 'LGPL-3',
}
