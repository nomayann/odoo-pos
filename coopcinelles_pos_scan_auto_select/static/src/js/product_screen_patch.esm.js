/** @odoo-module */

import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {patch} from "@web/core/utils/patch";
import {useService} from "@web/core/utils/hooks";
import {onMounted, onWillUnmount} from "@odoo/owl";

patch(ProductScreen.prototype, {
    setup() {
        super.setup(...arguments);
        this.barcodeReader = useService("barcode_reader");

        const onKeyDown = async (ev) => {
            if (ev.key !== "Enter") {
                return;
            }
            const activeEl = document.activeElement;
            if (
                !activeEl ||
                activeEl.tagName !== "INPUT" ||
                activeEl.type !== "text" ||
                !activeEl.closest(".pos-topheader")
            ) {
                return;
            }

            const searchWord = (
                (this.pos?.searchProductWord ?? activeEl.value) ||
                activeEl.value ||
                ""
            ).trim();
            if (!searchWord) {
                return;
            }

            const matchingProducts = this.productsToDisplay || [];
            const isSingleExactBarcode =
                matchingProducts.length === 1 &&
                (matchingProducts[0].barcode === searchWord ||
                    matchingProducts[0].product_tmpl_id?.barcode === searchWord);

            const looksLikeBarcode = /^\d{8,14}$/.test(searchWord);

            if (isSingleExactBarcode || looksLikeBarcode) {
                ev.preventDefault();
                ev.stopPropagation();

                if (this.pos && "searchProductWord" in this.pos) {
                    this.pos.searchProductWord = "";
                }
                activeEl.value = "";
                activeEl.dispatchEvent(new Event("input", {bubbles: true}));
                activeEl.blur();

                await this.barcodeReader.scan(searchWord);
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
