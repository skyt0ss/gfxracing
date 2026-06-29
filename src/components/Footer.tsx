const footerLinks = [
  { href: '#home',       label: 'Home'            },
  { href: '#about',      label: 'About'           },
  { href: '#membership', label: 'Membership'      },
  { href: '#classes',    label: 'Classes & Rules' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {year} Community Club. All rights reserved.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end" role="list">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
