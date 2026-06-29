import AboutContent from '../content/about.mdx';

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-20 bg-[#111111] racing-stripe border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-10">
          — Who We Are
        </p>
        <article className="prose max-w-none" aria-labelledby="about-heading">
          <span id="about-heading" className="sr-only">About</span>
          <AboutContent />
        </article>
      </div>
    </section>
  );
}
