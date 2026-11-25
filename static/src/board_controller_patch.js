/** @odoo-module **/
// Copyright 2026 Madooit
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import {BoardController} from "@board/board_controller";
import {useState} from "@odoo/owl";
import {patch} from "@web/core/utils/patch";
import {dateInterval, isDateIntervalEmpty} from "./board_interval_state";

patch(BoardController.prototype, {
    setup() {
        super.setup();
        this.boardInterval = useState({...dateInterval});
    },

    /**
     * Update one bound of the date interval.
     *
     * @param {Event} ev change event of a date input
     * @param {String} field "dateFrom" or "dateTo"
     */
    onIntervalChange(ev, field) {
        const value = ev.target.value || "";
        if (this.boardInterval[field] === value) {
            return;
        }
        dateInterval[field] = value;
        dateInterval.revision++;
        Object.assign(this.boardInterval, dateInterval);
    },

    clearInterval() {
        if (isDateIntervalEmpty()) {
            return;
        }
        dateInterval.dateFrom = "";
        dateInterval.dateTo = "";
        dateInterval.revision++;
        Object.assign(this.boardInterval, dateInterval);
    },
});
