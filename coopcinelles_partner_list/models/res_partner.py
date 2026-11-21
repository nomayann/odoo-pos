# -*- coding: utf-8 -*-
from odoo import api, models

class ResPartner(models.Model):
    _inherit = "res.partner"

    @api.model
    def _load_pos_data_domain(self, data):
        domain = super()._load_pos_data_domain(data)
        if not isinstance(domain, list):
            domain = []
        domain.extend([
            ("customer_rank", ">", 0),
            # complete with relevant conditions, if any, to filter out pure suppliers and Odoo users from the partner list
            # ("is_company", "=", False),  # Exclude companies
            # ("membership_state", "not_in", ["none", "cancelled", "old"]),  # Exclude partners with expired or cancelled memberships
            # ("active", "=", True),  # Exclude inactive partners
        ])
        return domain
