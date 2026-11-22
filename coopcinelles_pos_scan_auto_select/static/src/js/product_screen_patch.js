/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { onMounted, onWillUnmount } from "@odoo/owl";

patch(ProductScreen.prototype, {
    setup() {
        super.setup(...arguments);

        const onKeyDown = async (ev) => {
            // Vérify if the Enter key is pressed and the focus is on the search bar
            if (
                ev.key === "Enter" &&
                document.activeElement &&
                document.activeElement.closest(".pos-search-bar")
            ) {
                const searchWord = (this.pos.searchProductWord || "").trim();
                if (!searchWord) {
                    return;
                }

                // Retrieve the list of products that match the search word
                const matchingProducts = this.productsToDisplay;

                // Verify if there is exactly one matching product
                // And the search word is a valid barcode format (8 to 14 digits)
                if (matchingProducts.length === 1) {
                    const product = matchingProducts[0];
                    const isExactBarcode =
                        product.barcode === searchWord ||
                        (product.product_tmpl_id?.barcode === searchWord);
                    const isBarcodeFormat = /^\d{8,14}$/.test(searchWord);

                    // If both conditions are met, prevent the default behavior and add the product to the current order
                    if (isExactBarcode && isBarcodeFormat) {
                        ev.preventDefault();
                        ev.stopPropagation();

                        // Add the product to the current order
                        await this.pos.addLineToCurrentOrder({ product_id: product });

                        // Reset the search bar and clear the input field
                        this.pos.searchProductWord = "";
                        document.activeElement.value = "";
                    }
                }
            }
        };

        onMounted(() => {
            document.addEventListener("keydown", onKeyDown, true);
        });

        onWillUnmount(() => {
            document.removeEventListener("keydown", onKeyDown, true);
        });
    },
});
