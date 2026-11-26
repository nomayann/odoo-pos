/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { PartnerLine } from "@point_of_sale/app/screens/partner_list/partner_line/partner_line";

const MEMBERSHIP_BADGES = {
    free: {
        label: _t("Free Member"),
        badgeClass: "text-bg-success",
    },
    paid: {
        label: _t("Paid Member"),
        badgeClass: "text-bg-success",
    },
    invoiced: {
        label: _t("Invoiced Member"),
        badgeClass: "text-bg-info",
    },
    waiting: {
        label: _t("Waiting Member"),
        badgeClass: "text-bg-warning",
    },
    old: {
        label: _t("Expired Member"),
        badgeClass: "text-bg-danger",
    },
    canceled: {
        label: _t("Cancelled Member"),
        badgeClass: "text-bg-secondary",
    },
    none: {
        label: _t("Non Member"),
        badgeClass: "text-bg-light text-muted border",
    },
};

patch(PartnerLine.prototype, {
    getMembershipBadge(partner) {
        const state = partner?.membership_state;
        if (!state) {
            return null;
        }
        return (
            MEMBERSHIP_BADGES[state] || {
                label: state,
                badgeClass: "text-bg-secondary",
            }
        );
    },
});
