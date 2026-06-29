/**
 * Calendar events
 * ───────────────
 * Add, edit, or remove entries in the array below to update the calendar.
 *
 * Fields:
 *   date  — required  "YYYY-MM-DD"
 *   title — required  short label shown on the calendar and in the event list
 *   notes — optional  extra detail, e.g. location or time
 */

export interface CalendarEvent {
  date: string;
  title: string;
  notes?: string;
}

export const events: CalendarEvent[] = [
  { date: '2026-07-02', title: 'General Meeting',    notes: 'Main Hall, 7:00 pm'         },
  { date: '2026-07-06', title: 'Morning Social',      notes: '9:00 – 11:00 am, Main Hall' },
  { date: '2026-07-10', title: 'Youth Program',       notes: '6:30 pm, Room 2'            },
  { date: '2026-07-18', title: 'Family Activity Day', notes: '10:00 am, Grounds'          },
  { date: '2026-07-23', title: 'General Meeting',    notes: 'Main Hall, 7:00 pm'         },
  { date: '2026-08-06', title: 'General Meeting',    notes: 'Main Hall, 7:00 pm'         },
  { date: '2026-08-10', title: 'Morning Social',      notes: '9:00 – 11:00 am, Main Hall' },
  { date: '2026-08-20', title: 'General Meeting',    notes: 'Main Hall, 7:00 pm'         },
];
