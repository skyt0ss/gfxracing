import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#home',       label: 'Home'            },
  { href: '#about',      label: 'About'           },
  { href: '#membership', label: 'Membership'      },
  { href: '#classes',    label: 'Classes & Rules' },
];

const SECTION_IDS = navLinks.map((l) => l.href.slice(1));
const HEADER_H = 68; // px — must match h-16 (64px) + a small buffer

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(SECTION_IDS[0] ?? '');

  // Scroll-spy: mark the last section whose top is above the viewport centre
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Site name / logo */}
          <a
            href="#home"
            className="text-xl font-bold text-gray-900 hover:text-gray-700"
            aria-label="Community Club – scroll to top"
          >
            Community Club
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
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

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => {
              const active = activeId === href.slice(1);
              return (
                <a
                  key={href}
                  href={href}
                  // aria-current="location" is the correct value for in-page anchor links
                  aria-current={active ? 'location' : undefined}
                  className={
                    active
                      ? 'text-sm font-medium text-blue-700 underline underline-offset-4'
                      : 'text-sm font-medium text-gray-700 hover:text-gray-900'
                  }
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-gray-200 bg-white"
        >
          <ul className="max-w-5xl mx-auto px-4 py-3 space-y-1" role="list">
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
                        ? 'block px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700'
                        : 'block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
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
