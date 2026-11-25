/** @odoo-module **/
// Copyright 2026 Madooit
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import {onWillStart} from "@odoo/owl";
import {BoardAction} from "@board/board_action";
import {rpc} from "@web/core/network/rpc";
import {patch} from "@web/core/utils/patch";
import {
    appendDomain,
    intervalDomain,
    isDateIntervalEmpty,
} from "./board_interval_state";

const modelInfoCache = new Map();

/**
 * Ask the server which date field the interval must use on a given model.
 *
 * @param {String} resModel technical name of the model
 * @returns {Promise<object>} {field: string, models: {[model]: string|false}}
 */
function getIntervalInfo(resModel) {
    if (!modelInfoCache.has(resModel)) {
        const request = rpc("/web/dataset/call_kw/board.board/get_date_interval_info", {
            model: "board.board",
            method: "get_date_interval_info",
            args: [[resModel]],
            kwargs: {},
        }).catch((error) => {
            modelInfoCache.delete(resModel);
            throw error;
        });
        modelInfoCache.set(resModel, request);
    }
    return modelInfoCache.get(resModel);
}

patch(BoardAction.prototype, {
    setup() {
        super.setup();
        onWillStart(async () => {
            if (isDateIntervalEmpty() || !this.viewProps) {
                return;
            }
            const info = await getIntervalInfo(this.viewProps.resModel);
            const fieldType = info && info.models[this.viewProps.resModel];
            if (!fieldType) {
                return;
            }
            this.viewProps.domain = appendDomain(
                this.viewProps.domain,
                intervalDomain(info.field, fieldType)
            );
        });
    },
});
