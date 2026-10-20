# -*- coding: utf-8 -*-
{
    'name': "Point of sale Coop'Cinelles customization",
    'author': "Coop'Cinelles 38 / yannchvl@gmail.com"
    "",
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'static/src/app/screens/partner_line_override.xml',
            'static/src/app/screens/partner_list_override.xml',
        ],
    },
    'installable': True,
    'license': 'LGPL-3',
}
