const plans = [
  {
    key: 'day',
    label: 'Day Pass',
    price: '$20',
    period: 'per visit',
    description: 'Walk in on any open practice day. No registration required.',
    features: [
      'Full track access',
      'All scale sections',
      'No sign-up needed',
    ],
    featured: false,
  },
  {
    key: 'monthly',
    label: 'Practice Pass',
    price: '$80',
    period: 'per month',
    description: 'Unlimited practice during all operating hours.',
    features: [
      'Unlimited track sessions',
      'All scale sections',
      'Priority event booking',
      'Members-only lounge',
    ],
    featured: true,
  },
  {
    key: 'race',
    label: 'Race Entry',
    price: '$25',
    period: '1st class',
    description: '+$15 for each additional class on the same race day.',
    features: [
      'Formal race heats & finals',
      'Club championship points',
      '$15 per additional class',
      'Open to all skill levels',
    ],
    featured: false,
  },
] as const;

export default function MembershipSection() {
  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="py-20 bg-track border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Get on Track
          </p>
          <h2
            id="membership-heading"
            className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white"
          >
            Membership &amp; Pricing
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 bg-red-600 rounded-full" />
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={[
                'relative rounded-2xl overflow-hidden flex flex-col',
                plan.featured
                  ? 'bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)] ring-2 ring-red-400/50'
                  : 'bg-surface border border-white/10',
              ].join(' ')}
            >
              {plan.featured && (
                <div className="absolute top-0 inset-x-0 flex justify-center">
                  <span className="bg-white text-red-600 text-[10px] font-black uppercase tracking-widest px-5 py-1 rounded-b-xl">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={['p-7 flex flex-col flex-1', plan.featured ? 'pt-10' : ''].join(' ')}>
                <p className={[
                  'text-[10px] font-bold uppercase tracking-widest mb-4',
                  plan.featured ? 'text-red-200' : 'text-red-500',
                ].join(' ')}>
                  {plan.label}
                </p>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-5xl font-black text-white leading-none">
                    {plan.price}
                  </span>
                  <span className={[
                    'text-sm pb-1',
                    plan.featured ? 'text-red-200' : 'text-zinc-500',
                  ].join(' ')}>
                    {plan.period}
                  </span>
                </div>

                <p className={[
                  'text-sm mt-1 mb-7 leading-relaxed',
                  plan.featured ? 'text-red-100' : 'text-zinc-400',
                ].join(' ')}>
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={[
                          'mt-0.5 h-4 w-4 shrink-0',
                          plan.featured ? 'text-white' : 'text-red-500',
                        ].join(' ')}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={plan.featured ? 'text-white' : 'text-zinc-400'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

