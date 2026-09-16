/** Orbita mark: orbital arc + two hollow circles. Compact so it holds at 16-32px. */
export default function BrandMark({ size = 32, invert = false, className = '' }) {
  const ink = invert ? '#fff6ee' : '#E24A12'

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      overflow="visible"
      className={`block shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <path
        d="M24.97 12.59 A10 10 0 1 1 18.28 7.26"
        stroke={ink}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="17" r="5.1" stroke={ink} strokeWidth="2.2" />
      <circle cx="22.4" cy="9.1" r="3.3" stroke={ink} strokeWidth="1.9" />
    </svg>
  )
}
