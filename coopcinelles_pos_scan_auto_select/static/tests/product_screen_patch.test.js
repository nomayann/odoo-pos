/** @odoo-module */

import { describe, expect, test } from "@odoo/hoot";
import { press, queryOne } from "@odoo/hoot-dom";
import { animationFrame } from "@odoo/hoot-mock";
import { mountWithCleanup, patchWithCleanup } from "@web/../tests/web_test_helpers";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { definePosModels } from "@point_of_sale/../tests/unit/data/generate_model_definitions";
import { setupPosEnv } from "@point_of_sale/../tests/unit/utils";

// Charge les définitions de modèles mockés du POS (Odoo 18)
definePosModels();

describe("coopcinelles_pos_scan_auto_select - ProductScreen barcode scan", () => {
    test("intercepts Enter on EAN barcode in search bar, clears input, blurs, and scans", async () => {
        const store = await setupPosEnv();
        const barcodeReader = store.env.services.barcode_reader;

        let scannedCode = null;
        patchWithCleanup(barcodeReader, {
            async scan(code) {
                scannedCode = code;
            },
        });

        await mountWithCleanup(ProductScreen, {
            props: { orderUuid: store.get_order().uuid },
        });

        const searchInput = queryOne(".pos-topheader input[type='text']");
        searchInput.focus();
        expect(document.activeElement).toBe(searchInput);

        // Simule la saisie d'un code-barres EAN-13 par douchette dans le champ de recherche
        const eanBarcode = "3760123456789";
        searchInput.value = eanBarcode;
        store.searchProductWord = eanBarcode;
        await animationFrame();

        // Simule la touche Entrée envoyée par le lecteur code-barres
        await press("Enter");
        await animationFrame();

        expect(scannedCode).toBe(eanBarcode);
        expect(store.searchProductWord).toBe("");
        expect(searchInput.value).toBe("");
        expect(document.activeElement).not.toBe(searchInput);
    });

    test("intercepts Enter when search matches a single product exact non-numeric barcode", async () => {
        const store = await setupPosEnv();
        const barcodeReader = store.env.services.barcode_reader;

        // Récupère un produit existant dans l'environnement mocké et lui attribue un code-barres alphanumérique
        const product = store.models["product.product"].getFirst();
        product.barcode = "COOP-BIO-001";

        let scannedCode = null;
        patchWithCleanup(barcodeReader, {
            async scan(code) {
                scannedCode = code;
            },
        });

        await mountWithCleanup(ProductScreen, {
            props: { orderUuid: store.get_order().uuid },
        });

        const searchInput = queryOne(".pos-topheader input[type='text']");
        searchInput.focus();

        searchInput.value = "COOP-BIO-001";
        store.searchProductWord = "COOP-BIO-001";
        await animationFrame();

        await press("Enter");
        await animationFrame();

        expect(scannedCode).toBe("COOP-BIO-001");
        expect(store.searchProductWord).toBe("");
        expect(searchInput.value).toBe("");
    });

    test("does not intercept Enter for a standard text search", async () => {
        const store = await setupPosEnv();
        const barcodeReader = store.env.services.barcode_reader;

        let scanCalled = false;
        patchWithCleanup(barcodeReader, {
            async scan() {
                scanCalled = true;
            },
        });

        await mountWithCleanup(ProductScreen, {
            props: { orderUuid: store.get_order().uuid },
        });

        const searchInput = queryOne(".pos-topheader input[type='text']");
        searchInput.focus();

        searchInput.value = "Pomme";
        store.searchProductWord = "Pomme";
        await animationFrame();

        await press("Enter");
        await animationFrame();

        expect(scanCalled).toBe(false);
        expect(store.searchProductWord).toBe("Pomme");
        expect(searchInput.value).toBe("Pomme");
        expect(document.activeElement).toBe(searchInput);
    });
});
