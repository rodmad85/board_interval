/** @odoo-module **/
// Copyright 2026 Madooit
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import {DateTime, serializeDateTime} from "@web/core/l10n/dates";
import {user} from "@web/core/user";

export const dateInterval = {
    dateFrom: "",
    dateTo: "",
    revision: 0,
};

/**
 * @returns {Boolean} true when no bound is selected
 */
export function isDateIntervalEmpty() {
    return !dateInterval.dateFrom && !dateInterval.dateTo;
}

/**
 * Convert a date input value to the value expected by the server.
 *
 * Datetime values are stored in UTC, while the date input is expressed in the
 * user timezone: use the beginning/end of the user's day.
 *
 * @param {String} value date input value (ISO date)
 * @param {String} fieldType "date" or "datetime"
 * @param {String} boundary "start" or "end"
 * @returns {String} serialized value
 */
function serializeIntervalBoundary(value, fieldType, boundary) {
    if (fieldType === "date") {
        return value;
    }
    const date = DateTime.fromISO(value, {zone: user.tz || "default"});
    const localDate = boundary === "start" ? date.startOf("day") : date.endOf("day");
    return serializeDateTime(localDate);
}

/**
 * Build the domain terms for the selected date interval.
 *
 * @param {String} fieldName technical name of the date field
 * @param {String} fieldType "date" or "datetime"
 * @returns {Array[]} domain terms
 */
export function intervalDomain(fieldName, fieldType) {
    const domain = [];
    if (dateInterval.dateFrom) {
        domain.push([
            fieldName,
            ">=",
            serializeIntervalBoundary(dateInterval.dateFrom, fieldType, "start"),
        ]);
    }
    if (dateInterval.dateTo) {
        domain.push([
            fieldName,
            "<=",
            serializeIntervalBoundary(dateInterval.dateTo, fieldType, "end"),
        ]);
    }
    return domain;
}

/**
 * Append interval terms to an existing domain without mutating it.
 *
 * @param {Array[]|object|undefined} domain existing domain (array or Domain)
 * @param {Array[]} extraDomain interval terms
 * @returns {Array[]} combined domain
 */
export function appendDomain(domain, extraDomain) {
    if (!extraDomain.length) {
        return domain;
    }
    let currentDomain = [];
    if (Array.isArray(domain)) {
        currentDomain = domain;
    } else if (domain) {
        currentDomain = domain.toList();
    }
    return [...currentDomain, ...extraDomain];
}
