from odoo.tests import tagged

from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon


@tagged("post_install", "-at_install")
class TestPosPartnerList(TestPointOfSaleHttpCommon):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env["res.partner"].create(
            {
                "name": "Alice RGPD",
                "customer_rank": 1,
                "email": "secret.rgpd@example.com",
                "phone": "0699887766",
            }
        )

    def test_partner_list_rgpd_tour(self):
        self.main_pos_config.with_user(self.pos_user).open_ui()
        self.start_tour(
            f"/pos/ui?config_id={self.main_pos_config.id}",
            "CoopcinellesPartnerListRgpdTour",
            login="pos_user",
        )
