/** @odoo-module */

import * as ProductScreen from "@point_of_sale/../tests/tours/utils/product_screen_util";
import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("CoopcinellesPosScanAutoSelectTour", {
    steps: () =>
        [
            // 1. Focus sur la barre de recherche du POS et saisie d'un code-barres EAN-13
            {
                content: "Focus POS search input and type EAN barcode",
                trigger: ".pos-topheader input[type='text']",
                run: "edit 3760123456789",
            },
            // 2. Appui sur Entrée (simule la fin de lecture de la douchette)
            {
                content: "Press Enter inside search input to trigger barcode scan",
                trigger: ".pos-topheader input[type='text']",
                run() {
                    const input = document.querySelector(".pos-topheader input[type='text']");
                    const enterEvent = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                    });
                    input.dispatchEvent(enterEvent);
                },
            },
            // 3. Vérifie que le champ de recherche a bien été vidé et défocalisé
            {
                content: "Verify search input is cleared and blurred",
                trigger: ".pos-topheader input[type='text']",
                run() {
                    const input = document.querySelector(".pos-topheader input[type='text']");
                    if (input.value !== "") {
                        throw new Error(`Expected search input to be empty, got "${input.value}"`);
                    }
                    if (document.activeElement === input) {
                        throw new Error("Expected search input to lose focus (blur) after scan");
                    }
                },
            },
            // 4. Vérifie que le produit correspondant au code-barres a été ajouté à la commande
            ProductScreen.selectedOrderlineHas("Produit Test Code-Barres", "1,0"),

            // 5. Vérifie qu'une recherche textuelle classique + Entrée n'ajoute pas de produit
            {
                content: "Type standard text query in search bar",
                trigger: ".pos-topheader input[type='text']",
                run: "edit Produit Test",
            },
            {
                content: "Press Enter on text query (should NOT auto-select)",
                trigger: ".pos-topheader input[type='text']",
                run() {
                    const input = document.querySelector(".pos-topheader input[type='text']");
                    const enterEvent = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                    });
                    input.dispatchEvent(enterEvent);
                },
            },
            {
                content: "Verify search input still contains the text query",
                trigger: ".pos-topheader input[type='text']",
                run() {
                    const input = document.querySelector(".pos-topheader input[type='text']");
                    if (input.value !== "Produit Test") {
                        throw new Error(
                            `Expected search input to keep "Produit Test", got "${input.value}"`,
                        );
                    }
                },
            },
            ProductScreen.selectedOrderlineHas("Produit Test Code-Barres", "1,0"),
        ].flat(),
});
