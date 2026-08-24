/** Oximy-style mark: square field + 13-cell ring (center occupied). */
const CELLS = [
  [26.78, 13.39],
  [40.17, 13.39],
  [53.55, 13.39],
  [13.39, 26.78],
  [66.94, 26.78],
  [13.39, 40.16],
  [40.17, 40.16],
  [66.94, 40.16],
  [13.39, 53.55],
  [66.94, 53.55],
  [26.78, 66.94],
  [40.17, 66.94],
  [53.55, 66.94],
]

export default function BrandMark({ size = 32, invert = false, className = '' }) {
  const field = invert ? '#FF4D00' : '#170702'
  const cell = invert ? '#fffaf8' : '#FF4D00'
  return (
    <svg
      viewBox="0 0 90.37 90.37"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="90.37" height="90.37" fill={field} />
      {CELLS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="10.04" height="10.04" fill={cell} />
      ))}
    </svg>
  )
}
