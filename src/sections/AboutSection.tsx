import AboutContent from '../content/about.mdx';

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-16 bg-gray-50 border-t border-gray-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          The <h1> "About Us" is rendered by the MDX content itself.
          The section uses aria-labelledby pointing to the heading inside the article.
        */}
        <article className="prose max-w-none" aria-labelledby="about-heading">
          <span id="about-heading" className="sr-only">About</span>
          <AboutContent />
        </article>
      </div>
    </section>
  );
}
