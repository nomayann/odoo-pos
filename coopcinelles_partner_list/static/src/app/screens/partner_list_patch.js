/** @odoo-module */

import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";
import { patch } from "@web/core/utils/patch";

patch(PartnerList.prototype, {
    getPartners() {
        // The list retrieved via super() already contains ONLY valid customers (filtered by Python model)
        const partners = super.getPartners();
        const query = this.state.query;

        if (!query) {
            return partners;
        }

        // Only keep partners whose name or parent name contains all search terms (case-insensitive)
        const searchTerms = query.toLowerCase().split(" ");

        return partners.filter((partner) => {
            const name = (partner.name || "").toLowerCase();
            const parentName = (partner.parent_name || "").toLowerCase();

            return searchTerms.every(
                (term) => name.includes(term) || parentName.includes(term)
            );
        });
    }
});
