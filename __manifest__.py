# Copyright 2026 Madooit
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    "name": "Board Date Interval",
    "summary": "Filter dashboard blocks with a start/end date selector",
    "version": "18.0.1.0.0",
    "category": "Productivity",
    "license": "AGPL-3",
    "author": "Madooit,Odoo Community Association (OCA)",
    "maintainers": ["rodmad85"],
    "website": "https://github.com/OCA/server-ux",
    "development_status": "Beta",
    "depends": ["board", "base_setup"],
    "data": ["views/res_config_settings_views.xml"],
    "assets": {
        "web.assets_backend": [
            "board_interval/static/src/**/*.scss",
            "board_interval/static/src/**/*.js",
            "board_interval/static/src/**/*.xml",
        ],
        "web.assets_unit_tests": [
            "board_interval/static/tests/**/*.test.js",
        ],
    },
    "installable": True,
}
