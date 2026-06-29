import { useState, useMemo } from 'react';
import type { CalendarEvent } from '../content/events';

interface Props {
  events: CalendarEvent[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

export default function CalendarWidget({ events }: Props) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { year, month } = view;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Build cells: leading nulls + day numbers + trailing nulls (pad to multiple of 7)
  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
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

  function prevMonth() {
    setView(({ year: y, month: m }) =>
      m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 },
    );
    setSelectedDay(null);
  }

  function nextMonth() {
    setView(({ year: y, month: m }) =>
      m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 },
    );
    setSelectedDay(null);
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
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* ── Month navigation ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-lg leading-none"
        >
          ‹
        </button>
        <h3
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-semibold text-gray-900"
        >
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-lg leading-none"
        >
          ›
        </button>
      </div>

      {/* ── Day grid ─────────────────────────────────────── */}
      <table
        className="w-full px-4 pb-3"
        role="grid"
        aria-label={`Calendar for ${MONTH_NAMES[month]} ${year}`}
      >
        <thead>
          <tr>
            {DAY_LABELS.map((d) => (
              <th
                key={d}
                scope="col"
                className="text-center text-xs font-medium text-gray-400 pb-1.5 w-10"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) {
                  return <td key={di} aria-hidden="true" className="w-10 h-10" />;
                }
                const dayEvents = eventsOnDay(day);
                const todayFlag = isToday(day);
                const selected = selectedDay === day;
                const hasEvents = dayEvents.length > 0;

                const btnClass = [
                  'relative mx-auto flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors',
                  todayFlag
                    ? 'bg-blue-600 text-white font-semibold'
                    : selected
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                    : 'text-gray-700 hover:bg-gray-100',
                ].join(' ');

                return (
                  <td key={di} className="w-10 h-10 text-center p-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDay(selected ? null : day)}
                      aria-label={[
                        `${day} ${MONTH_NAMES[month]} ${year}`,
                        hasEvents
                          ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`
                          : '',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      aria-pressed={selected}
                      className={btnClass}
                    >
                      {day}
                      {hasEvents && !todayFlag && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"
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

      {/* ── Event list ───────────────────────────────────── */}
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          {displayLabel}
        </p>
        {displayedEvents.length > 0 ? (
          <ul
            className="space-y-2"
            aria-label={`Events for ${displayLabel}`}
          >
            {displayedEvents.map((event, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">{event.title}</span>
                  {event.notes && (
                    <span className="block text-xs text-gray-500">{event.notes}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No events scheduled.</p>
        )}
      </div>
    </div>
  );
}
