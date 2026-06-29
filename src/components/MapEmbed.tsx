interface Props {
  /** Full address shown as a caption below the map */
  address?: string;
}

export default function MapEmbed({
  address = '2481 Kaladar Ave, Ottawa, ON',
}: Props) {
  const query = encodeURIComponent(address);

  return (
    <figure className="rounded-lg overflow-hidden border border-white/10">
      <iframe
        src={`https://maps.google.com/maps?q=${query}&output=embed&z=16`}
        width="100%"
        height="320"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${address}`}
        aria-label={`Google Map showing the location of ${address}`}
      />
      <figcaption className="px-3 py-2 text-sm text-zinc-400 bg-[#161616] border-t border-white/10">
        <address className="not-italic">{address} &mdash; Unit 103</address>
      </figcaption>
    </figure>
  );
}
