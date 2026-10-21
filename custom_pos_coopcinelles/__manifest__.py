# -*- coding: utf-8 -*-
{
    'name': "Point of sale Coop'Cinelles customization",
    'author': "Coop'Cinelles 38 / yannchvl@gmail.com",
    'description': """
    A little customization of the point of sale module for Coop'Cinelles 38
    
    Removes GDPR columns from the partner list
    """,
    'version': '1.0.0',
    'category': 'Point of Sale',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'custom_pos_coopcinelles/static/src/app/screens/partner_line_override.xml',
            'custom_pos_coopcinelles/static/src/app/screens/partner_list_override.xml',
        ],
    },
    'installable': True,
    'license': 'LGPL-3',
}
