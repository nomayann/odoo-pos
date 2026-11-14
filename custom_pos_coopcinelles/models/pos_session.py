# -*- coding: utf-8 -*-
from odoo import models

class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_res_partner(self):
        """
        Override the loading parameters to restrict the partners loaded in the POS
        to only valid customers, excluding pure suppliers and Odoo users.
        """
        result = super()._loader_params_res_partner()
        
        domain = result['search_params'].get('domain', [])
        if not isinstance(domain, list):
            domain = []
            
        # Inject our criteria directly into the loading query
        domain.extend([
            ('customer_rank', '>', 0),      # Uniquement les clients
            ('user_ids', '=', False),       # Exclut les utilisateurs internes liés à un partenaire
        ])
        
        result['search_params']['domain'] = domain
        return result