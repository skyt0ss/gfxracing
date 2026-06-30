/**
 * GFX★RACING brand badge — star + two downward chevrons.
 * Matches the physical banner/logo graphic used at the venue.
 *
 * Use `className` to control size, e.g. className="w-11 h-13".
 * The SVG viewBox is 44×52 (aspect ratio 11:13).
 */
interface Props {
  className?: string;
}

export default function BrandBadge({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 44 52"
      aria-hidden="true"
      fill="none"
      className={className}
    >
      {/*
       * Five-pointed star centred at (22, 12).
       * Outer radius 10, inner radius 4.
       * Points alternate: outer at −90°+k·72°, inner at −54°+k·72°.
       */}
      <path
        fill="#dc2626"
        d="M22,2 L24.35,8.76 L31.51,8.91 L25.80,13.24 L27.88,20.09 L22,16 L16.12,20.09 L18.20,13.24 L12.49,8.91 L19.65,8.76 Z"
      />

      {/* Chevron 1 — downward-pointing V */}
      <path
        d="M3,28 L22,38 L41,28"
        stroke="#dc2626"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Chevron 2 — downward-pointing V, offset 10px below */}
      <path
        d="M3,38 L22,48 L41,38"
        stroke="#dc2626"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
