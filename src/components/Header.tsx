import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#home',       label: 'Home'            },
  { href: '#schedule',   label: 'Schedule'        },
  { href: '#about',      label: 'About'           },
  { href: '#membership', label: 'Membership'      },
  { href: '#classes',    label: 'Classes & Rules' },
];

const SECTION_IDS = navLinks.map((l) => l.href.slice(1));
const HEADER_H = 68; // px — must match h-16 (64px) + a small buffer

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(SECTION_IDS[0] ?? '');

  // Scroll-spy: mark the last section whose top is above the viewport threshold
  useEffect(() => {
    function update() {
      const threshold = window.scrollY + HEADER_H + 10;
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
    <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b-2 border-red-600 shadow-[0_4px_24px_rgba(220,38,38,0.2)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="GFX RACING – scroll to top"
          >
            {/* Double-chevron racing mark */}
            <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true" fill="none">
              <path d="M2 3L11 11L20 3" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 11L11 19L20 11" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
              GFX<span className="text-red-500">★</span>RACING
            </span>
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
                  className={
                    active
                      ? 'px-4 py-5 text-xs font-bold text-red-500 uppercase tracking-widest border-b-2 border-red-500 transition-colors'
                      : 'px-4 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white border-b-2 border-transparent transition-colors'
                  }
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
          className="md:hidden border-t border-white/10 bg-[#0a0a0a]"
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

