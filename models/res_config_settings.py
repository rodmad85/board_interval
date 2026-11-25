# Copyright 2026 Madooit
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    board_interval_date_field = fields.Char(
        string="Dashboard Date Field",
        config_parameter="board_interval.date_field",
        default="date_order",
        help="Technical name of the Date or Datetime field used by the dashboard "
        "date selector. Blocks whose model does not have this field are left "
        "unfiltered.",
    )
