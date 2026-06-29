import type { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import Header from './Header';
import Footer from './Footer';
import { mdxComponents } from '../mdxComponents';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <MDXProvider components={mdxComponents}>
      <div className="min-h-screen bg-track text-white flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </MDXProvider>
  );
}
