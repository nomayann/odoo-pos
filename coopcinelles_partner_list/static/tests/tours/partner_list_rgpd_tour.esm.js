/** @odoo-module */

import {registry} from "@web/core/registry";

const SEARCH_INPUT_SELECTOR =
    ".partner-list input, .o_partner_list input, .modal-header input[type='text']";

const PARTNER_ROW_SELECTOR =
    ".partner-list .partner-line, .o_partner_list .partner-line, tr.partner-info";

const getPartnerRows = () => [...document.querySelectorAll(PARTNER_ROW_SELECTOR)];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async (predicate, errorMessage, timeoutMs = 3000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        if (predicate()) {
            return;
        }
        await sleep(100);
    }
    throw new Error(errorMessage);
};

const setSearchValue = (value) => {
    const input = document.querySelector(SEARCH_INPUT_SELECTOR);
    if (!input) {
        throw new Error("Partner search input not found");
    }
    input.focus();
    const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    )?.set;
    if (nativeSetter) {
        nativeSetter.call(input, value);
    } else {
        input.value = value;
    }
    input.dispatchEvent(new Event("input", {bubbles: true}));
    input.dispatchEvent(new Event("change", {bubbles: true}));
    input.dispatchEvent(
        new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
        })
    );
};

registry.category("web_tour.tours").add("CoopcinellesPartnerListRgpdTour", {
    steps: () => [
        {
            content: "Open partner list from POS",
            trigger: "button.set-partner",
            run: "click",
        },
        {
            content:
                "Verify GDPR address and email/phone elements are hidden with d-none",
            trigger: ".partner-list, .o_partner_list",
            run: () => {
                const hiddenNodes = [
                    ...document.querySelectorAll(
                        ".partner-line-adress.d-none, .partner-line-email.d-none, tr.partner-info td.d-none"
                    ),
                ];
                if (hiddenNodes.length === 0) {
                    throw new Error(
                        "Expected RGPD partner info elements to have d-none class"
                    );
                }
            },
        },
        {
            content: "Verify Alice RGPD is present in initial customer list",
            trigger: PARTNER_ROW_SELECTOR,
            run: async () => {
                await waitFor(
                    () =>
                        getPartnerRows().some((row) =>
                            (row.textContent || "").includes("Alice RGPD")
                        ),
                    "Expected 'Alice RGPD' in initial partner list (check customer_rank > 0 and POS reload)"
                );
            },
        },
        {
            content: "Search by hidden email address",
            trigger: SEARCH_INPUT_SELECTOR,
            run: () => {
                setSearchValue("secret.rgpd@example.com");
            },
        },
        {
            content: "Verify partner is not matched when searching by hidden email",
            trigger: ".partner-list, .o_partner_list",
            run: async () => {
                await waitFor(
                    () =>
                        !getPartnerRows().some((row) =>
                            (row.textContent || "").includes("Alice RGPD")
                        ),
                    "Partner 'Alice RGPD' still appears in partner list when searching by hidden email"
                );
            },
        },
        {
            content: "Search by partner name",
            trigger: SEARCH_INPUT_SELECTOR,
            run: () => {
                setSearchValue("Alice RGPD");
            },
        },
        {
            content: "Verify partner is found in partner list when searching by name",
            trigger: ".partner-list, .o_partner_list",
            run: async () => {
                await waitFor(
                    () =>
                        getPartnerRows().some((row) =>
                            (row.textContent || "").includes("Alice RGPD")
                        ),
                    "Expected partner 'Alice RGPD' to appear when searching by name"
                );
            },
        },
    ],
});
