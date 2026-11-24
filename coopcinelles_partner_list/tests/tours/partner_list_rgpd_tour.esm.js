/** @odoo-module */

import {registry} from "@web/core/registry";

registry.category("web_tour.tours").add("CoopcinellesPartnerListRgpdTour", {
    steps: () => [
        {
            content: "Open partner list from POS",
            trigger:
                ".pos-topheader .oe_status .fa-user, .partner-button, button:contains('Customer')",
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
            content: "Search by hidden email address should return no matching partner",
            trigger:
                ".partner-list input, .o_partner_list input, input[placeholder*='Search']",
            run: "edit secret.rgpd@example.com",
        },
        {
            content:
                "Verify partner with hidden email is not shown when searching by email",
            trigger: ".partner-list, .o_partner_list",
            run: () => {
                const text = document.body.textContent || "";
                if (text.includes("Alice RGPD")) {
                    throw new Error(
                        "Partner should not be matched by hidden email address"
                    );
                }
            },
        },
        {
            content: "Search by partner name should match Alice RGPD",
            trigger:
                ".partner-list input, .o_partner_list input, input[placeholder*='Search']",
            run: "edit Alice RGPD",
        },
        {
            content: "Verify partner is found when searching by name",
            trigger: ".partner-list, .o_partner_list",
            run: () => {
                const text = document.body.textContent || "";
                if (!text.includes("Alice RGPD")) {
                    throw new Error(
                        "Expected partner 'Alice RGPD' to be found by name"
                    );
                }
            },
        },
    ],
});
