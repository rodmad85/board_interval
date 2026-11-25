# Copyright 2026 Madooit
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo.tests import TransactionCase, tagged


@tagged("post_install", "-at_install")
class TestBoardInterval(TransactionCase):
    def setUp(self):
        super().setUp()
        self.board = self.env["board.board"]
        self.config_parameter = self.env["ir.config_parameter"].sudo()

    def test_get_date_interval_info_default_field(self):
        self.config_parameter.set_param("board_interval.date_field", "date_order")
        info = self.board.get_date_interval_info(["res.partner"])
        self.assertEqual(info["field"], "date_order")
        self.assertFalse(info["models"]["res.partner"])

    def test_get_date_interval_info_datetime_field(self):
        self.config_parameter.set_param("board_interval.date_field", "create_date")
        info = self.board.get_date_interval_info(["res.partner"])
        self.assertEqual(info["field"], "create_date")
        self.assertEqual(info["models"]["res.partner"], "datetime")

    def test_get_date_interval_info_non_date_field(self):
        self.config_parameter.set_param("board_interval.date_field", "name")
        info = self.board.get_date_interval_info(["res.partner"])
        self.assertFalse(info["models"]["res.partner"])

    def test_get_date_interval_info_unknown_model(self):
        info = self.board.get_date_interval_info(["not.a.model"])
        self.assertFalse(info["models"]["not.a.model"])

    def test_settings_field_uses_config_parameter(self):
        field = self.env["res.config.settings"]._fields["board_interval_date_field"]
        self.assertEqual(field.config_parameter, "board_interval.date_field")
