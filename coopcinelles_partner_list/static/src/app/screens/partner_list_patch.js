/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";
import { patch } from "@web/core/utils/patch";

/**
 * This patch modifies the PartnerList component
 * It keeps the original search functionality
 * But filters the results based on the partner name only, ignoring the email, phone number, address fields.
 */
patch(PartnerList.prototype, {
    getPartners() {
        const partners = super.getPartners();
        const query = (this.state.query || "").trim().toLowerCase();

        if (!query) {
            return partners;
        }

        return this.filterPartnersByName(partners);
    },
    async getNewPartners() {
        const partners = await super.getNewPartners();
        const query = (this.state.query || "").trim().toLowerCase();

        if (!query) {
            return partners;
        }

        return this.filterPartnersByName(partners);
    },
    // This method filters the partners based on the search query, considering only the partner name.
    filterPartnersByName(partners) {
        const query = (this.state.query || "").trim().toLowerCase();
        const searchTerms = query.split(/\s+/).filter(Boolean);

        return partners.filter((partner) => {
            const fullName = (partner.name || "").toLowerCase();
            return searchTerms.every((term) => fullName.includes(term));
        });
    },
});
