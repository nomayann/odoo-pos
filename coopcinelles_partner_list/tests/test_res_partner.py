from datetime import date

from odoo.tests.common import TransactionCase
from odoo.osv import expression


class TestResPartnerPosDomain(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.partner_model = cls.env["res.partner"]
        cls.pos_config = cls.env["pos.config"].search([], limit=1)
        if not cls.pos_config:
            cls.pos_config = cls.env["pos.config"].create({"name": "POS Test Config"})

        current_year = date.today().year
        cls.member_old = cls.partner_model.create(
            {
                "name": "Member Old",
                "email": "member_old@example.com",
                "phone": "0102030404",
                "customer_rank": 1,
            }
        )
        cls.member_prev_year = cls.partner_model.create(
            {
                "name": "Member Prev Year",
                "email": "member_prev@example.com",
                "phone": "0102030405",
                "customer_rank": 1,
            }
        )
        cls.member_curr_year = cls.partner_model.create(
            {
                "name": "Member Curr Year",
                "customer_rank": 0,
                "email": "member_curr@example.com",
                "phone": "0102030406",
            }
        )

        # membership_start est un champ calculé (store=True) sur res.partner :
        # on fixe la valeur stockée pour isoler le test du domaine POS.
        cls.env.cr.execute(
            """
            UPDATE res_partner
               SET membership_start = %s
             WHERE id = %s
            """,
            (date(current_year - 2, 3, 1), cls.member_old.id),
        )
        cls.env.cr.execute(
            """
            UPDATE res_partner
               SET membership_start = %s
             WHERE id = %s
            """,
            (date(current_year - 1, 4, 1), cls.member_prev_year.id),
        )
        cls.env.cr.execute(
            """
            UPDATE res_partner
               SET membership_start = %s
             WHERE id = %s
            """,
            (date(current_year, 3, 1), cls.member_curr_year.id),
        )
        (cls.member_old | cls.member_prev_year | cls.member_curr_year).invalidate_recordset(
            ["membership_start"]
        )

    def test_load_data_domain_includes_membership_start(self):
        expected_min_date = date(date.today().year - 1, 3, 1)
        data = {
            "pos.config": {"data": [{"id": self.pos_config.id}]},
            "pos.order": {"data": []},
        }
        domain = self.partner_model._load_pos_data_domain(data)
        self.assertIn(("membership_start", ">=", expected_min_date), domain)

    def test_load_data_domain_includes_membership_start(self):
        expected_fields = ["membership_start", "membership_state"]
        fields = self.partner_model._load_pos_data_fields(self.pos_config.id)
        for field in expected_fields:
            self.assertIn(field, fields)

    def test_load_pos_data_domain_searches_over_year(self):
        data = {
            "pos.config": {"data": [{"id": self.pos_config.id}]},
            "pos.order": {"data": []},
        }
        domain = self.partner_model._load_pos_data_domain(data)

        matched_ids = self.partner_model.search(domain).ids
        self.assertNotIn(self.member_old.id, matched_ids)
        self.assertIn(self.member_prev_year.id, matched_ids)
        self.assertIn(self.member_curr_year.id, matched_ids)

    def test_load_pos_data_domain_search_name(self):
        data = {
            "pos.config": {"data": [{"id": self.pos_config.id}]},
            "pos.order": {"data": []},
        }
        domain = self.partner_model._load_pos_data_domain(data)
        domain = expression.AND([domain, [("name", "like", "Curr")]])

        matched_ids = self.partner_model.search(domain).ids
        self.assertNotIn(self.member_old.id, matched_ids)
        self.assertNotIn(self.member_prev_year.id, matched_ids)
        self.assertIn(self.member_curr_year.id, matched_ids)
