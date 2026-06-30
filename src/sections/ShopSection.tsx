import { useState } from 'react';
import { products } from '../../content/shop';
import type { ProductCategory, ScaleTag, StockStatus } from '../../content/shop';

// ─── Contact email (update before going live) ─────────────────────────────────
const CONTACT_EMAIL = 'shop@gfxracing.ca';

// ─── Category visual config ───────────────────────────────────────────────────
// Inline gradients (not Tailwind classes) so the full values aren't tree-shaken.
const CATEGORY_META: Record<ProductCategory, { from: string; to: string }> = {
  Tires:       { from: '#3f3f46', to: '#18181b' },
  Bodies:      { from: '#1d4ed8', to: '#0f172a' },
  Drivetrain:  { from: '#b45309', to: '#1c1917' },
  Electronics: { from: '#7c3aed', to: '#1e1b4b' },
  Batteries:   { from: '#15803d', to: '#052e16' },
  Accessories: { from: '#dc2626', to: '#450a0a' },
};

const STOCK_META: Record<StockStatus, { dot: string; label: string; colour: string }> = {
  in_stock:     { dot: '#22c55e', label: 'In Stock',     colour: '#86efac' },
  low_stock:    { dot: '#f59e0b', label: 'Low Stock',    colour: '#fcd34d' },
  out_of_stock: { dot: '#52525b', label: 'Out of Stock', colour: '#71717a' },
};

// ─── Filter options ───────────────────────────────────────────────────────────
const CATEGORIES: Array<ProductCategory | 'All'> = [
  'All', 'Tires', 'Bodies', 'Drivetrain', 'Electronics', 'Batteries', 'Accessories',
];
const SCALES: Array<ScaleTag | 'All'> = ['All', '1/28', '1/10', '1/12'];

// ─── Mailto helper ────────────────────────────────────────────────────────────
function buildMailto(name: string, price: number): string {
  const subject = encodeURIComponent(`Shop Enquiry: ${name}`);
  const body    = encodeURIComponent(
    `Hi,\n\nI'm interested in purchasing the ${name} (CAD $${price.toFixed(2)}).\n\nPlease let me know availability and how to proceed.\n\nThank you.`,
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [activeScale,    setActiveScale]    = useState<ScaleTag | 'All'>('All');

  const visible = products.filter((p) => {
    const catOk   = activeCategory === 'All' || p.category === activeCategory;
    const scaleOk = activeScale    === 'All' || p.scales.includes(activeScale) || p.scales.includes('All');
    return catOk && scaleOk;
  });

  return (
    <section
      id="shop"
      aria-labelledby="shop-heading"
      className="py-20 bg-[#111111] racing-stripe border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Parts &amp; Gear
          </p>
          <h2
            id="shop-heading"
            className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white"
          >
           Shop
          </h2>
          <div className="mt-4 h-1 w-16 bg-red-600 rounded-full" />

          {/* Temporary ordering note — remove once Shopify checkout is live */}
          <p className="mt-5 text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Ordering is currently handled in-person or by email.{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            >
              Contact us
            </a>{' '}
            to check availability or reserve an item. Full online checkout via Shopify coming soon. 
          </p>
          <p className="mt-2 text-md font-bold text-zinc-500">
            Dassie's runs this shop and is all business!
          </p>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8" role="group" aria-label="Product filters">

          {/* Category chips */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat as ProductCategory | 'All')}
                  aria-pressed={active}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors',
                    active
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10',
                  ].join(' ')}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Scale chips */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by scale">
            {SCALES.map((scale) => {
              const active = activeScale === scale;
              return (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setActiveScale(scale as ScaleTag | 'All')}
                  aria-pressed={active}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors',
                    active
                      ? 'bg-zinc-200 text-zinc-900'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10',
                  ].join(' ')}
                >
                  {scale}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product grid ─────────────────────────────────────────────────── */}
        {visible.length > 0 ? (
          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            role="list"
            aria-label="Products"
          >
            {visible.map((product) => {
              const catMeta   = CATEGORY_META[product.category];
              const stockMeta = STOCK_META[product.stock];
              const disabled  = product.stock === 'out_of_stock';

              return (
                <li key={product.id}>
                  <article
                    aria-label={`${product.name}, CAD $${product.price.toFixed(2)}, ${stockMeta.label}`}
                    className="h-full bg-surface rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                  >
                    {/* ── Image placeholder ─────────────────────────────── */}
                    <div
                      aria-hidden="true"
                      style={{
                        background: `linear-gradient(135deg, ${catMeta.from}, ${catMeta.to})`,
                      }}
                      className="relative h-36 flex items-end p-3"
                    >
                      {/* Category label */}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                        {product.category}
                      </span>

                      {/* Scale badges — top-right */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                        {product.scales.map((s) => (
                          <span
                            key={s}
                            className="text-[9px] font-black uppercase tracking-wide bg-black/50 text-white/75 rounded px-1.5 py-0.5 leading-none"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── Card body ─────────────────────────────────────── */}
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price + stock row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-black text-white leading-none">
                          ${product.price.toFixed(2)}
                          <span className="text-[10px] text-zinc-500 font-normal ml-1">CAD</span>
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide"
                          style={{ color: stockMeta.colour }}
                        >
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: stockMeta.dot }}
                          />
                          {stockMeta.label}
                        </span>
                      </div>

                      {/* CTA */}
                      {disabled ? (
                        <span
                          aria-disabled="true"
                          className="block text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 text-zinc-600 select-none"
                        >
                          Out of Stock
                        </span>
                      ) : (
                        <a
                          href={buildMailto(product.name, product.price)}
                          aria-label={`Enquire about ${product.name}`}
                          className="block text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 transition-colors"
                        >
                          Enquire →
                        </a>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-zinc-500 text-sm py-8">
            No products match the selected filters.
          </p>
        )}

      </div>
    </section>
  );
}
