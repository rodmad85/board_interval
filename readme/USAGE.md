# Usage

1. Open a dashboard (*Dashboards > My Dashboard*).
2. Set **Start Date** and/or **End Date** in the header.
3. Every block whose model has the configured date field reloads with the
   selected date range applied.
4. Click **Clear** to remove the filter.

The filter is kept while navigating between dashboards in the same browser
session. For `Datetime` fields, the selected dates are converted from the user
timezone to UTC, using the beginning and the end of the day.
