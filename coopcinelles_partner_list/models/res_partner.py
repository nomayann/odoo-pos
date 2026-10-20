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
        ])
        return domain
