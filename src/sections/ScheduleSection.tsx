import { useMemo } from 'react';
import { events } from '../../content/events';
import CalendarWidget from '../components/CalendarWidget';
import MapEmbed from '../components/MapEmbed';

// ─── Date helpers ─────────────────────────────────────────────────────────────
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

const DAY_SHORT  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDay(iso: string): string {
  const d = parseLocalDate(iso);
  return `${DAY_SHORT[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ScheduleSection() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sort all future events chronologically
  const upcoming = useMemo(
    () =>
      events
        .filter((e) => parseLocalDate(e.date) >= today)
        .sort(
          (a, b) =>
            parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
        ),
    [today],
  );

  const nextEvent = upcoming[0];      // featured "next race" card
  const sideList  = upcoming.slice(1, 8); // up to 7 more listed alongside calendar

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="bg-[#0d0d0d] border-t border-white/5 racing-stripe"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Race Calendar
          </p>
          <h2
            id="schedule-heading"
            className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white"
          >
            Schedule
          </h2>
          <div className="mt-4 h-1 w-16 bg-red-600 rounded-full" />
        </div>

        {/* ── Next Race highlight ──────────────────────────────────────────── */}
        {nextEvent && (
          <div
            className="mb-10 rounded-2xl bg-red-600 px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_0_50px_rgba(220,38,38,0.3)] relative overflow-hidden"
            aria-label={`Next Race: ${nextEvent.title} on ${formatDay(nextEvent.date)}`}
          >
            {/* Decorative diagonal stripe */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(-45deg,white,white 1px,transparent 1px,transparent 14px)',
              }}
            />
            <div className="relative">
              <p className="text-red-200 text-[10px] font-black uppercase tracking-widest mb-1">
                Next Race
              </p>
              <p className="text-white text-2xl sm:text-3xl font-black leading-tight">
                {nextEvent.title}
              </p>
              <p className="text-red-100 text-sm mt-1">
                {formatDay(nextEvent.date)}
                {nextEvent.notes ? ` · ${nextEvent.notes}` : ''}
              </p>
            </div>
            <a
              href="#membership"
              className="relative shrink-0 self-start sm:self-auto px-6 py-2.5 rounded-full bg-white text-red-600 text-sm font-black uppercase tracking-wide hover:bg-red-50 transition-colors"
            >
              Race Info →
            </a>
          </div>
        )}

        {/* ── Calendar + upcoming list ─────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 mb-12">

          {/* Calendar — left, takes more space */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
              Monthly View
            </p>
            {/* Scale the calendar up using a larger wrapper */}
            <div className="[&_table]:w-full [&_th]:pb-2! [&_button]:w-10! [&_button]:h-10! [&_td]:w-10! [&_td]:h-10!">
              <CalendarWidget events={events} />
            </div>
          </div>

          {/* Upcoming events list — right */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
              Coming Up
            </p>
            {sideList.length > 0 ? (
              <ul className="space-y-2.5" role="list">
                {sideList.map((event, i) => {
                  const d = parseLocalDate(event.date);
                  return (
                    <li
                      key={`${event.date}-${event.title}`}
                      className="bg-surface rounded-xl px-4 py-3 border border-white/5 flex items-start gap-3"
                    >
                      {/* Date chip */}
                      <div className="bg-red-600/15 border border-red-600/20 rounded-lg text-center px-2 py-1.5 shrink-0 min-w-10.5">
                        <p className="text-red-400 text-[9px] font-black uppercase leading-none">
                          {MONTH_SHORT[d.getMonth()]}
                        </p>
                        <p className="text-white text-xl font-black leading-tight">
                          {d.getDate()}
                        </p>
                      </div>
                      {/* Event info */}
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {event.title}
                        </p>
                        {event.notes && (
                          <p className="text-zinc-500 text-xs mt-0.5 truncate">{event.notes}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-zinc-600 text-sm">No further events scheduled.</p>
            )}
          </div>
        </div>

        {/* ── Location map — full-width, taller ───────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
            Find Us
          </p>
          <MapEmbed height={420} />
        </div>

      </div>
    </section>
  );
}
