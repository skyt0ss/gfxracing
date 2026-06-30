import { useState, useEffect } from 'react';
import BrandBadge from './BrandBadge';

const navLinks = [
  { href: '#home',       label: 'Home'            },
  { href: '#schedule',   label: 'Schedule'        },
  { href: '#about',      label: 'About'           },
  { href: '#membership', label: 'Membership'      },
  { href: '#classes',    label: 'Classes & Rules' },
  { href: '#shop',       label: 'Shop'            },
];

const SECTION_IDS = navLinks.map((l) => l.href.slice(1));
const COMPACT_H   = 64;  // px — h-16
const SCROLL_THRESHOLD = 80; // px — switch to compact state

export default function Header() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeId, setActiveId]   = useState(SECTION_IDS[0] ?? '');
  const [scrolled, setScrolled]   = useState(false);

  // Compact / hero toggle
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: mark the last section whose top is above the viewport threshold
  useEffect(() => {
    function update() {
      const threshold = window.scrollY + COMPACT_H + 10;
      let current = SECTION_IDS[0] ?? '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) current = id;
      }
      setActiveId(current);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-track border-b-2 border-red-600 shadow-[0_4px_24px_rgba(220,38,38,0.2)]'
          : 'bg-linear-to-b from-black/75 via-black/30 to-transparent border-b-0 shadow-none',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={[
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-16' : 'h-24',
          ].join(' ')}
        >

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <a
            href="#home"
            className="flex items-center gap-3"
            aria-label="GFX RACING - scroll to top"
          >
            {/* Star + chevron badge — scales with header height */}
            <BrandBadge
              className={[
                'transition-all duration-300 shrink-0',
                scrolled ? 'w-6 h-6.75' : 'w-11 h-13',
              ].join(' ')}
            />
            <div className="flex flex-col justify-center">
              <span
                className={[
                  'font-brand italic font-black tracking-wide text-white uppercase leading-none transition-all duration-300',
                  scrolled ? 'text-2xl' : 'text-4xl',
                ].join(' ')}
              >
                GFX<span className="text-red-500 mr-1">★</span>RACING
              </span>
              {/* Tagline — visible only in hero/expanded state */}
              <span
                aria-hidden="true"
                className={[
                  'font-medium tracking-[0.15em] uppercase text-white/55 leading-none transition-all duration-300 overflow-hidden',
                  scrolled ? 'opacity-0 max-h-0 mt-0 text-[0px]' : 'opacity-100 max-h-4 mt-1 text-[9px]',
                ].join(' ')}
              >
                Ottawa's Indoor R/C Racing
              </span>
            </div>
          </a>

          {/* ── Mobile menu toggle ─────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? (
              <svg className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center">
            {navLinks.map(({ href, label }) => {
              const active = activeId === href.slice(1);
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={active ? 'location' : undefined}
                  className={[
                    'px-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-300',
                    scrolled ? 'py-5' : 'py-3',
                    active
                      ? 'text-red-500 border-red-500'
                      : 'text-zinc-300 hover:text-white border-transparent',
                  ].join(' ')}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Mobile nav panel ─────────────────────────────────────────────── */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-white/10 bg-track"
        >
          <ul className="max-w-6xl mx-auto px-4 py-3 space-y-1" role="list">
            {navLinks.map(({ href, label }) => {
              const active = activeId === href.slice(1);
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={active ? 'location' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={
                      active
                        ? 'block px-4 py-2.5 rounded-md text-xs font-bold text-red-500 bg-red-500/10 uppercase tracking-widest border-l-2 border-red-500'
                        : 'block px-4 py-2.5 rounded-md text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/10 border-l-2 border-transparent'
                    }
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}

