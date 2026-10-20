/** @odoo-module */

import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";
import { patch } from "@web/core/utils/patch";

patch(PartnerList.prototype, {
    getPartners() {
        const partners = super.getPartners();
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
