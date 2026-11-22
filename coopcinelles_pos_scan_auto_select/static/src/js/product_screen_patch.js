/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onMounted, onWillUnmount } from "@odoo/owl";

patch(ProductScreen.prototype, {
    setup() {
        super.setup(...arguments);
        this.barcodeReader = useService("barcode_reader");

        const onKeyDown = async (ev) => {
            // Check if the Enter key is pressed while focus is inside the POS search bar
            if (
                ev.key === "Enter" &&
                document.activeElement &&
                document.activeElement.closest(".pos-search-bar")
            ) {
                const searchWord = (this.pos.searchProductWord || "").trim();
                if (!searchWord) {
                    return;
                }

                // Check if the input matches a single displayed product's exact barcode
                // or looks like a standard numeric barcode (EAN-8, EAN-13, UPC, scale barcode, etc.)
                const matchingProducts = this.productsToDisplay;
                const isSingleExactBarcode =
                    matchingProducts.length === 1 &&
                    (matchingProducts[0].barcode === searchWord ||
                        matchingProducts[0].product_tmpl_id?.barcode === searchWord);

                const looksLikeBarcode = /^\d{8,14}$/.test(searchWord);

                if (isSingleExactBarcode && looksLikeBarcode) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    const inputEl = document.activeElement;

                    // Clear the search input before triggering the native barcode scan
                    this.pos.searchProductWord = "";
                    inputEl.value = "";
                    // Blur the input so subsequent scans are handled globally by the barcode reader
                    inputEl.blur();

                    // Delegate full processing (scales, lots, packagings) to Odoo 18's native barcode reader
                    await this.barcodeReader.scan(searchWord);
                }
            }
        };

        onMounted(() => {
            // Use capture phase (true) to intercept Enter before the input's default behavior
            document.addEventListener("keydown", onKeyDown, true);
        });

        onWillUnmount(() => {
            document.removeEventListener("keydown", onKeyDown, true);
        });
    },
});
