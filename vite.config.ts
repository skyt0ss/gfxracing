import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages deployment:  SITE_BASE defaults to /site-explore (repo name)
// SFTP / custom domain:     set SITE_BASE=/ in the workflow env
const base = process.env.SITE_BASE ?? '/site-explore';

export default defineConfig({
  base,
  plugins: [
    // MDX must run before React's JSX transform
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
});
