from datetime import date

from odoo import api, models
from odoo.osv import expression


class ResPartner(models.Model):
    _inherit = "res.partner"

    @api.model
    def _load_pos_data_domain(self, data):
        domain = super()._load_pos_data_domain(data)
        if not isinstance(domain, list):
            domain = []
        min_membership_start = date(date.today().year - 1, 3, 1)
        return expression.AND(
            [
                domain,
                [("membership_start", ">=", min_membership_start)],
            ]
        )

    @api.model
    def _load_pos_data_fields(self, config_id):
        fields = super()._load_pos_data_fields(config_id)
        fields.extend(["membership_start", "membership_state"])
        return fields

