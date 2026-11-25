# Copyright 2026 Madooit
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo import api, models

DATE_FIELD_PARAM = "board_interval.date_field"
DEFAULT_DATE_FIELD = "date_order"
DATE_FIELD_TYPES = ("date", "datetime")


class Board(models.AbstractModel):
    _inherit = "board.board"

    @api.model
    def _get_date_interval_field(self):
        return (
            self.env["ir.config_parameter"]
            .sudo()
            .get_param(DATE_FIELD_PARAM, DEFAULT_DATE_FIELD)
            or DEFAULT_DATE_FIELD
        ).strip()

    @api.model
    def get_date_interval_info(self, model_names):
        """Return the configured date field and its availability per model.

        :param list[str] model_names: technical names of the models displayed
            in the dashboard blocks
        :return: configured field name and, for each model, the field type
            when it can be used by the interval (``False`` otherwise)
        :rtype: dict
        """
        field_name = self._get_date_interval_field()
        models_info = {}
        for model_name in model_names:
            model = self.env.registry.get(model_name)
            field = model._fields.get(field_name) if model else None
            models_info[model_name] = (
                field.type if field and field.type in DATE_FIELD_TYPES else False
            )
        return {"field": field_name, "models": models_info}
