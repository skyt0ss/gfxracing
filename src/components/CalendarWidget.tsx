import { useState, useMemo, useRef } from 'react';
import type { CalendarEvent } from '../../content/events';

interface Props {
  events: CalendarEvent[];
}

// APG: abbreviated display labels + full name in abbr attribute for screen readers
const DAY_LABELS = [
  { short: 'Su', full: 'Sunday'    },
  { short: 'Mo', full: 'Monday'    },
  { short: 'Tu', full: 'Tuesday'   },
  { short: 'We', full: 'Wednesday' },
  { short: 'Th', full: 'Thursday'  },
  { short: 'Fr', full: 'Friday'    },
  { short: 'Sa', full: 'Saturday'  },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function parseLocalDate(iso: string): Date {
  // Parse YYYY-MM-DD as local time (not UTC) to avoid off-by-one day errors
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Clamp `day` to the last day of the target month (for PageUp/Down). */
function clampDay(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month));
}

const HEADING_ID = 'cal-month-heading';

export default function CalendarWidget({ events }: Props) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // APG grid pattern: roving tabindex — only the "focused" day cell is tabindex=0
  const [focusedDay, setFocusedDay] = useState<number>(today.getDate());

  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const { year, month } = view;
  const dim = daysInMonth(year, month);
  const startOffset = new Date(year, month, 1).getDay(); // 0 = Sunday

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = chunk(cells, 7);

  const monthEvents = useMemo(
    () =>
      events.filter((e) => {
        const d = parseLocalDate(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }),
    [events, year, month],
  );

  function eventsOnDay(day: number): CalendarEvent[] {
    return monthEvents.filter((e) => parseLocalDate(e.date).getDate() === day);
  }

  function focusDay(targetDay: number, targetYear: number, targetMonth: number) {
    const monthChanged = targetYear !== year || targetMonth !== month;
    if (monthChanged) {
      setView({ year: targetYear, month: targetMonth });
      setSelectedDay(null);
    }
    setFocusedDay(targetDay);
    // After React re-renders, imperatively move browser focus to the new cell
    requestAnimationFrame(() => {
      tbodyRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${targetDay}"]`)
        ?.focus();
    });
  }

  function prevMonth() {
    const newM = month === 0 ? 11 : month - 1;
    const newY = month === 0 ? year - 1 : year;
    setView({ year: newY, month: newM });
    setFocusedDay((d) => clampDay(newY, newM, d));
    setSelectedDay(null);
  }

  function nextMonth() {
    const newM = month === 11 ? 0 : month + 1;
    const newY = month === 11 ? year + 1 : year;
    setView({ year: newY, month: newM });
    setFocusedDay((d) => clampDay(newY, newM, d));
    setSelectedDay(null);
  }

  // ── APG grid keyboard navigation ──────────────────────────────────────────
  // Spec: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, day: number) {
    let nd = day;   // new day
    let nm = month; // new month
    let ny = year;  // new year
    let handled = true;

    switch (e.key) {
      case 'ArrowRight': {
        nd = day + 1;
        if (nd > dim) {
          nd = 1;
          nm = month === 11 ? 0 : month + 1;
          if (month === 11) ny = year + 1;
        }
        break;
      }
      case 'ArrowLeft': {
        nd = day - 1;
        if (nd < 1) {
          nm = month === 0 ? 11 : month - 1;
          if (month === 0) ny = year - 1;
          nd = daysInMonth(ny, nm);
        }
        break;
      }
      case 'ArrowDown': {
        nd = day + 7;
        if (nd > dim) {
          nd = nd - dim;
          nm = month === 11 ? 0 : month + 1;
          if (month === 11) ny = year + 1;
        }
        break;
      }
      case 'ArrowUp': {
        nd = day - 7;
        if (nd < 1) {
          nm = month === 0 ? 11 : month - 1;
          if (month === 0) ny = year - 1;
          nd = daysInMonth(ny, nm) + nd; // nd is negative → subtraction
        }
        break;
      }
      case 'Home': {
        // First day of the current week (Sunday = 0)
        const weekday = new Date(year, month, day).getDay();
        nd = day - weekday;
        if (nd < 1) {
          nm = month === 0 ? 11 : month - 1;
          if (month === 0) ny = year - 1;
          nd = daysInMonth(ny, nm) + nd;
        }
        break;
      }
      case 'End': {
        // Last day of the current week (Saturday = 6)
        const weekday = new Date(year, month, day).getDay();
        nd = day + (6 - weekday);
        if (nd > dim) {
          nd = nd - dim;
          nm = month === 11 ? 0 : month + 1;
          if (month === 11) ny = year + 1;
        }
        break;
      }
      case 'PageUp': {
        nm = e.shiftKey ? month : (month === 0 ? 11 : month - 1);
        ny = e.shiftKey ? year - 1 : (month === 0 ? year - 1 : year);
        nd = clampDay(ny, nm, day);
        break;
      }
      case 'PageDown': {
        nm = e.shiftKey ? month : (month === 11 ? 0 : month + 1);
        ny = e.shiftKey ? year + 1 : (month === 11 ? year + 1 : year);
        nd = clampDay(ny, nm, day);
        break;
      }
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      focusDay(nd, ny, nm);
    }
  }

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const displayedEvents =
    selectedDay !== null ? eventsOnDay(selectedDay) : monthEvents;

  const displayLabel =
    selectedDay !== null
      ? `${selectedDay} ${MONTH_NAMES[month]}`
      : `${MONTH_NAMES[month]} ${year}`;

  return (
    <div className="rounded-lg border border-white/10 bg-surface overflow-hidden">

      {/* ── Month navigation ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-1.5 rounded-md text-zinc-400 hover:bg-white/10 hover:text-white text-lg leading-none transition-colors"
        >
          ‹
        </button>
        <h3
          id={HEADING_ID}
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-semibold text-white"
        >
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="p-1.5 rounded-md text-zinc-400 hover:bg-white/10 hover:text-white text-lg leading-none transition-colors"
        >
          ›
        </button>
      </div>

      {/* ── Day grid ──────────────────────────────────────────────────────── */}
      {/*
          APG grid pattern:
          • role="grid" on <table> (already implied by thead/tbody structure)
          • aria-labelledby points to the live month heading
          • Only ONE cell is tabindex=0 at a time (roving tabindex)
          • Arrow / Home / End / PageUp / PageDown handled in onKeyDown
          • aria-selected on <td> marks the user-chosen day
          • abbr on <th> provides full day name to screen readers
      */}
      <table
        className="w-full px-4 pb-3"
        role="grid"
        aria-labelledby={HEADING_ID}
      >
        <thead>
          <tr>
            {DAY_LABELS.map(({ short, full }) => (
              <th
                key={full}
                scope="col"
                abbr={full}
                className="text-center text-xs font-medium text-zinc-500 pb-1.5 w-10"
              >
                {short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) {
                  // Empty padding cell — not interactive, excluded from tab order
                  return <td key={di} aria-disabled="true" className="w-10 h-10" />;
                }

                const dayEvents  = eventsOnDay(day);
                const todayFlag  = isToday(day);
                const selected   = selectedDay === day;
                const isFocused  = focusedDay === day;
                const hasEvents  = dayEvents.length > 0;

                return (
                  <td
                    key={di}
                    className="w-10 h-10 text-center p-0.5"
                    aria-selected={selected || undefined}
                  >
                    <button
                      type="button"
                      data-day={day}
                      tabIndex={isFocused ? 0 : -1}
                      onFocus={() => setFocusedDay(day)}
                      onClick={() => setSelectedDay(selected ? null : day)}
                      onKeyDown={(e) => handleKeyDown(e, day)}
                      aria-label={[
                        `${day} ${MONTH_NAMES[month]} ${year}`,
                        todayFlag ? 'today' : '',
                        hasEvents
                          ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`
                          : '',
                      ].filter(Boolean).join(', ')}
                      aria-pressed={selected}
                      className={[
                        'relative mx-auto flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
                        todayFlag
                          ? 'bg-red-600 text-white font-semibold'
                          : selected
                          ? 'bg-red-600/20 text-red-300 ring-2 ring-red-500'
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white',
                      ].join(' ')}
                    >
                      {day}
                      {hasEvents && !todayFlag && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"
                        />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Event list ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          {displayLabel}
        </p>
        {displayedEvents.length > 0 ? (
          <ul
            className="space-y-2"
            aria-label={`Events for ${displayLabel}`}
          >
            {displayedEvents.map((event) => (
              <li key={`${event.date}–${event.title}`} className="flex gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"
                />
                <div>
                  <span className="font-medium text-white">{event.title}</span>
                  {event.notes && (
                    <span className="block text-xs text-zinc-500">{event.notes}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600">No events scheduled.</p>
        )}
      </div>
    </div>
  );
}
