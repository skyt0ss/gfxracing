import { useEffect, useMemo, useRef, useState } from 'react';
import { events } from '../../content/events';
import BrandBadge from './BrandBadge';

// ─── Date helpers (duplicated from ScheduleSection to keep component self-contained) ─
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function formatShortDate(iso: string): string {
  const d = parseLocalDate(iso);
  return `${DAY_SHORT[d.getDay()]} ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

// ─── Placeholder video ────────────────────────────────────────────────────────
// Free stock footage – Pixabay license (no attribution required).
// "Rallye, Car Race, Rally, Drifting, Dirt" – Editor's Choice, HD, ~10 s
// Source: https://pixabay.com/videos/rallye-car-race-rally-drifting-1295/
//
// ⚠ For production: download and place at /public/videos/hero.mp4 to avoid
//   any CDN availability or CORS concerns, then change VIDEO_SRC to:
//   `${import.meta.env.BASE_URL}videos/hero.mp4`
const VIDEO_SRC =
  'https://cdn.pixabay.com/video/2015/11/09/1295-145209438_large.mp4';

interface Props {
  /** Override the club name shown in the hero */
  title?: string;
  /** Override the tagline shown below the title */
  tagline?: string;
}

export default function VideoHero({
  // title = 'GFX★RACING',
  tagline = 'Ottawa’s indoor R/C racing facility — 1/28, 1/10 & 1/12 scale tracks, all skill levels welcome.',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Compute next upcoming event for the hero badge
  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((e) => parseLocalDate(e.date) >= today)
      .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime())[0];
  }, []);

  // Respect prefers-reduced-motion: only autoplay if the user hasn't opted out
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser policy (e.g. low-power mode) – fine,
          // the gradient placeholder remains visible.
          setIsPlaying(false);
        });
    }

    // React to live changes (e.g. OS setting toggled while page is open)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.pause();
        setIsPlaying(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div
      className="relative h-screen min-h-96 overflow-hidden flex items-center justify-center"
      role="region"
      aria-label="Hero banner"
    >
      {/* ── Gradient placeholder ─────────────────────────────────────────────
          Shown while the video is buffering, or as a permanent fallback when
          the video cannot play (reduced motion, CORS block, etc.).          */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-gray-950 via-gray-800 to-slate-900"
      />

      {/* ── Background video (decorative, aria-hidden) ───────────────────── */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoReady(true)}
        aria-hidden="true"
        className={[
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
          videoReady ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Dark overlay — ensures text contrast ratio ≥ 4.5:1 (WCAG AA) ── */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center text-white px-6 sm:px-12 max-w-4xl mx-auto">
        <h1
          id="hero-heading"
          className="font-brand italic text-6xl sm:text-7xl lg:text-8xl font-black tracking-wide drop-shadow-lg mb-6"
        >
          {/* {title} */}
          {/* GFX<span className="text-red-500 mr-3">★</span>RACING */}
          GFX<span className="mr-3">★</span>RACING
        </h1>

        {/* Brand badge graphic — matches the venue logo / entrance panel */}
        <BrandBadge className="w-16 h-19 sm:w-20 sm:h-23.75 mx-auto mb-14 drop-shadow-lg" />

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/60 mb-3 font-medium">
          Ottawa, Ontario
        </p>

        <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto drop-shadow mb-8">
          {tagline}
        </p>

        {/* ── Next Race badge ───────────────────────────────────────────── */}
        {nextEvent && (
          <a
            href="#schedule"
            className="inline-flex items-center gap-2.5 text-md text-white/75 hover:text-white transition-colors group mb-14 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-red-500 motion-safe:animate-pulse shrink-0"
            />
            <span>
              Next Race:
              <span className="font-semibold text-white/85 ml-1">
                {formatShortDate(nextEvent.date)}
              </span>
            </span>
            <span aria-hidden="true" className="text-white/40 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </a>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#membership"
            className="px-8 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            Join the Club
          </a>
          <a
            href="#schedule"
            className="px-8 py-3 rounded-full border-2 border-white/70 text-white font-semibold hover:bg-white hover:text-gray-900 transition-colors"
          >
            View Schedule
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 motion-safe:animate-bounce"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 15l7 7 7-7" />
        </svg>
      </div>

      {/* ── Pause / Play — WCAG 2.2.2 Pause, Stop, Hide ─────────────────── */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-6 right-6 z-20 p-2.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
}
