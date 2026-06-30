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
  // — July 2026 —
  { date: "2026-07-02", title: "Example event",          notes: "You can add a custom description and notes here. Or even get Bodi a burger right MEOW! · 10 am - 6 pm" },
  { date: "2026-07-04", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
  { date: "2026-07-11", title: "Club Race Day",           notes: "1/28 · 10 am │ 1/10-1/12 · 1 pm" },
  { date: "2026-07-12", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
  // — August 2026 —
  { date: "2026-08-01", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
  { date: "2026-08-02", title: "Club Race Day",           notes: "1/28 · 10 am │ 1/10-1/12 · 1 pm" },
  { date: "2026-08-08", title: "Summer Series — Rd 2", notes: "All classes · Doors open 9 am" },
  { date: "2026-08-09", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
  { date: "2026-08-15", title: "Club Race Day",           notes: "1/28 · 10 am │ 1/10-1/12 · 1 pm" },
  { date: "2026-08-16", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
  { date: "2026-08-22", title: "Summer Series — Final", notes: "Championship round · Doors open 9 am" },
  { date: "2026-08-23", title: "Open Practice",          notes: "All scales · 10 am - 6 pm" },
];
