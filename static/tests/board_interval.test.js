/** @odoo-module **/
// Copyright 2026 Madooit
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import {defineMailModels} from "@mail/../tests/mail_test_helpers";
import {beforeEach, describe, expect, test} from "@odoo/hoot";
import {
    animationFrame,
    manuallyDispatchProgrammaticEvent,
    queryAllTexts,
} from "@odoo/hoot-dom";
import {BoardAction} from "@board/board_action";
import {
    appendDomain,
    dateInterval,
    intervalDomain,
} from "@board_interval/board_interval_state";
import {
    contains,
    defineModels,
    fields,
    models,
    mountView,
    onRpc,
} from "@web/../tests/web_test_helpers";

class Board extends models.Model {}

class Partner extends models.Model {
    name = fields.Char({string: "Name"});
    date_order = fields.Date({string: "Order Date"});

    _records = [
        {id: 1, name: "Before", date_order: "2025-12-31"},
        {id: 2, name: "Inside", date_order: "2026-01-10"},
    ];

    _views = {
        "list,4": '<list><field name="name"/></list>',
    };
}

defineModels([Board, Partner]);
defineMailModels();

beforeEach(() => {
    BoardAction.cache = {};
    dateInterval.dateFrom = "";
    dateInterval.dateTo = "";
    dateInterval.revision = 0;
});

describe("board_interval", () => {
    test("build the domain for both bounds", () => {
        dateInterval.dateFrom = "2026-01-01";
        dateInterval.dateTo = "2026-01-31";
        expect(intervalDomain("date_order", "date")).toEqual([
            ["date_order", ">=", "2026-01-01"],
            ["date_order", "<=", "2026-01-31"],
        ]);
    });

    test("build the domain for a single bound", () => {
        dateInterval.dateFrom = "2026-01-01";
        expect(intervalDomain("date_order", "date")).toEqual([
            ["date_order", ">=", "2026-01-01"],
        ]);
        dateInterval.dateFrom = "";
        dateInterval.dateTo = "2026-01-31";
        expect(intervalDomain("date_order", "date")).toEqual([
            ["date_order", "<=", "2026-01-31"],
        ]);
    });

    test("append the interval domain to an existing domain", () => {
        dateInterval.dateFrom = "2026-01-01";
        const extraDomain = intervalDomain("date_order", "date");
        expect(appendDomain([["state", "=", "sale"]], extraDomain)).toEqual([
            ["state", "=", "sale"],
            ["date_order", ">=", "2026-01-01"],
        ]);
        expect(appendDomain(undefined, extraDomain)).toEqual(extraDomain);
    });

    test("reload board blocks when the date interval changes", async () => {
        onRpc("/web/action/load", () => ({
            res_model: "partner",
            views: [[4, "list"]],
        }));
        onRpc("board.board", "get_date_interval_info", () => ({
            field: "date_order",
            models: {partner: "date"},
        }));
        await mountView({
            type: "form",
            resModel: "board",
            arch: `
                <form string="My Dashboard" js_class="board">
                    <board style="1">
                        <column>
                            <action name="51" string="Orders" view_mode="list" domain="[]"/>
                        </column>
                    </board>
                </form>`,
        });
        expect("#board_interval_date_from").toHaveCount(1);
        expect("#board_interval_date_to").toHaveCount(1);
        expect(".o_data_row").toHaveCount(2);

        const dateFrom = document.querySelector("#board_interval_date_from");
        dateFrom.value = "2026-01-01";
        await manuallyDispatchProgrammaticEvent(dateFrom, "change");
        await animationFrame();
        await animationFrame();
        expect(dateInterval.dateFrom).toBe("2026-01-01");
        expect(".o_data_row").toHaveCount(1);
        expect(queryAllTexts(".o_data_row")).toEqual(["Inside"]);

        const dateTo = document.querySelector("#board_interval_date_to");
        dateTo.value = "2026-01-05";
        await manuallyDispatchProgrammaticEvent(dateTo, "change");
        await animationFrame();
        await animationFrame();
        expect(".o_data_row").toHaveCount(0);

        await contains(".o_board_interval button").click();
        await animationFrame();
        await animationFrame();
        expect(".o_data_row").toHaveCount(2);
    });
});
