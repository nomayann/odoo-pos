from odoo.tests.common import TransactionCase


class TestResPartnerPosDomain(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.partner_model = cls.env["res.partner"]
        cls.pos_config = cls.env["pos.config"].search([], limit=1)
        if not cls.pos_config:
            cls.pos_config = cls.env["pos.config"].create({"name": "POS Test Config"})

        cls.customer = cls.partner_model.create(
            {
                "name": "Client Coop Test",
                "customer_rank": 1,
                "email": "client@example.com",
                "phone": "0102030405",
            }
        )
        cls.non_customer = cls.partner_model.create(
            {
                "name": "Fournisseur Sans Classement Client",
                "customer_rank": 0,
                "email": "fournisseur@example.com",
                "phone": "0607080910",
            }
        )

    def test_load_pos_data_domain_includes_customer_rank(self):
        data = {
            "pos.config": {"data": [{"id": self.pos_config.id}]},
            "pos.order": {"data": []},
        }
        domain = self.partner_model._load_pos_data_domain(data)
        self.assertIn(("customer_rank", ">", 0), domain)

        matched_ids = self.partner_model.search(domain).ids
        self.assertIn(self.customer.id, matched_ids)
        self.assertNotIn(self.non_customer.id, matched_ids)
