/** @odoo-module */

import {PartnerList} from "@point_of_sale/app/screens/partner_list/partner_list";
import {patch} from "@web/core/utils/patch";

/**
 * This patch modifies the PartnerList component
 * It keeps the original search functionality
 * But filters the results based on the partner name only, ignoring the email, phone number, address fields.
 */
patch(PartnerList.prototype, {
    getPartners() {
        const partners = super.getPartners();

        return this.filterPartnersByName(partners);
    },
    async getNewPartners() {
        const partners = await super.getNewPartners();

        return this.filterPartnersByName(partners);
    },
    filterPartnersByName(partners) {
        const query = (this.state.query || "").trim().toLowerCase();

        if (!query) {
            return partners;
        }
        const searchTerms = query.split(/\s+/).filter(Boolean);

        return partners.filter((partner) => {
            const fullName = (partner.name || "").toLowerCase();
            return searchTerms.every((term) => fullName.includes(term));
        });
    },
});


