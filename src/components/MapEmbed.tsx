interface Props {
  /** Full address shown as a caption below the map */
  address?: string;
}

export default function MapEmbed({
  address = '1 Parliament St, Toronto, ON M5A 1C1',
}: Props) {
  const query = encodeURIComponent(address);

  return (
    <figure className="rounded-lg overflow-hidden border border-gray-200">
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
      <figcaption className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
        <address className="not-italic">{address}</address>
      </figcaption>
    </figure>
  );
}
