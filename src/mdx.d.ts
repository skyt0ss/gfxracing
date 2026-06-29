// Type declarations for .mdx imports.
// @types/mdx provides the mdx/types module; this declaration maps *.mdx files
// to React components so TypeScript understands the imports.
declare module '*.mdx' {
  import type { MDXComponents } from 'mdx/types';
  import type { ComponentType } from 'react';
  const MDXContent: ComponentType<{ components?: MDXComponents }>;
  export default MDXContent;
}
