# -*- coding: utf-8 -*-
from odoo.tests import tagged
from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon


@tagged("post_install", "-at_install")
class TestPosScanAutoSelect(TestPointOfSaleHttpCommon):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.barcode_product = cls.env["product.product"].create(
            {
                "name": "Produit Test Code-Barres",
                "available_in_pos": True,
                "list_price": 10.0,
                "barcode": "3760123456789",
            }
        )

    def test_pos_scan_auto_select_from_search(self):
        """Test that scanning a barcode in the POS search input triggers scan and clears input."""
        self.main_pos_config.with_user(self.pos_user).open_ui()
        self.start_tour(
            f"/pos/ui?config_id={self.main_pos_config.id}",
            "CoopcinellesPosScanAutoSelectTour",
            login="pos_user",
        )
