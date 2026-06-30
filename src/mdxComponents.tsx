import type { MDXComponents } from 'mdx/types';

/**
 * Component overrides applied globally to all MDX content via MDXProvider.
 * Extend this to customise how any Markdown element renders across the site.
 */
export const mdxComponents: MDXComponents = {
  // Wrap tables in a scroll container so they stay usable on narrow viewports
  table: (props) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-white/10">
      <table className="min-w-full text-sm" {...props} />
    </div>
  ),
};
