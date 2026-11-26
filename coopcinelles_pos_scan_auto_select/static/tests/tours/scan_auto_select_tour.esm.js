/** @odoo-module */

import {registry} from "@web/core/registry";

const pressEnter = (input) => {
    input.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        })
    );
};

const assertOrderlineQty = (productName, expectedQty = 1) => {
    const lines = [
        ...document.querySelectorAll(".order-container .orderline, .orderline"),
    ];
    const match = lines.find((el) => el.textContent?.includes(productName));
    if (!match) {
        throw new Error(`Expected orderline for "${productName}" to exist`);
    }
    const qtyText = match.querySelector(".qty")?.textContent?.trim() ?? "";
    const qty = Number.parseFloat(qtyText.replace(/\s+/g, "").replace(",", "."));
    if (!Number.isFinite(qty) || qty !== expectedQty) {
        throw new Error(
            `Expected quantity ${expectedQty} for "${productName}", got "${qtyText}"`
        );
    }
};

registry.category("web_tour.tours").add("CoopcinellesPosScanAutoSelectTour", {
    steps: () => [
        {
            content: "Clear search input before starting the scan scenario",
            trigger: ".pos-topheader input[type='text']",
            run: () => {
                const input = document.querySelector(
                    ".pos-topheader input[type='text']"
                );
                if (input) {
                    input.value = "";
                    input.dispatchEvent(new Event("input", {bubbles: true}));
                }
                const pos = odoo?.__WOWL_DEBUG__?.root?.env?.services?.pos;
                if (pos && "searchProductWord" in pos) {
                    pos.searchProductWord = "";
                }
            },
        },
        {
            content: "Focus POS search input and type EAN barcode",
            trigger: ".pos-topheader input[type='text']",
            run: "edit 3760123456789",
        },
        {
            content: "Press Enter inside search input to trigger barcode scan",
            trigger: ".pos-topheader input[type='text']",
            run: () => {
                const input = document.querySelector(
                    ".pos-topheader input[type='text']"
                );
                pressEnter(input);
            },
        },
        {
            content: "Verify search input is cleared and blurred",
            trigger: ".pos-topheader input[type='text']",
            run: () => {
                const input = document.querySelector(
                    ".pos-topheader input[type='text']"
                );
                if (input.value !== "") {
                    throw new Error(
                        `Expected search input to be empty, got "${input.value}"`
                    );
                }
                if (document.activeElement === input) {
                    throw new Error(
                        "Expected search input to lose focus (blur) after scan"
                    );
                }
            },
        },
        {
            content:
                "Verify scanned product orderline has quantity 1 regardless of locale",
            trigger: ".orderline",
            run: () => assertOrderlineQty("Produit Test Code-Barres", 1),
        },
        {
            content: "Type standard text query in search bar",
            trigger: ".pos-topheader input[type='text']",
            run: "edit Produit Test",
        },
        {
            content: "Press Enter on text query (should NOT auto-select)",
            trigger: ".pos-topheader input[type='text']",
            run: () => {
                const input = document.querySelector(
                    ".pos-topheader input[type='text']"
                );
                pressEnter(input);
            },
        },
        {
            content: "Verify search input still contains the text query",
            trigger: ".pos-topheader input[type='text']",
            run: () => {
                const input = document.querySelector(
                    ".pos-topheader input[type='text']"
                );
                if (input.value !== "Produit Test") {
                    throw new Error(
                        `Expected search input to keep "Produit Test", got "${input.value}"`
                    );
                }
            },
        },
        {
            content: "Verify orderline quantity is still 1 after non-barcode Enter",
            trigger: ".orderline",
            run: () => assertOrderlineQty("Produit Test Code-Barres", 1),
        },
    ],
});
