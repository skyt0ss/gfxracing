/**
 * GFX★RACING — Race & practice calendar
 * ─────────────────────────────────────────
 * Add, edit, or remove entries in the array below to update the calendar.
 *
 * Fields:
 *   date  — required  "YYYY-MM-DD"
 *   title — required  short label shown on the calendar and in the event list
 *   notes — optional  extra detail, e.g. time or scale info
 */

export interface CalendarEvent {
  date: string;
  title: string;
  notes?: string;
}

export const events: CalendarEvent[] = [
  /**
  UPDATE HERE
  **/
    { date: "2026-08-08", title: "Bodi's heist",          notes: "Nothing to see here. Just keep moving." },
  { date: "2026-08-09", title: "Bodi's second heist",          notes: "Keep the party going!" },
  { date: "2026-08-16", title: "Bodi's 3rd heist",          notes: "Keep the party going again!" },
  /**
  END: UPDATE HERE
  **/
];
