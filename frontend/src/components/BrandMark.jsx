/** Orbita mark: rounded field, orbital arc, core, and a discovery node. */
export default function BrandMark({ size = 32, invert = false, className = '' }) {
  const field = invert ? '#FF4D00' : '#170702'
  const ink = invert ? '#fffaf8' : '#FF4D00'

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill={field} />
      <path
        d="M23.7 12.41 A8.5 8.5 0 1 1 18.2 7.79"
        fill="none"
        stroke={ink}
        strokeWidth="2.15"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.35" fill={ink} />
      <circle cx="21.5" cy="9.5" r="2.15" fill={ink} />
    </svg>
  )
}
