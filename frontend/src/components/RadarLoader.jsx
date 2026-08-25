// Radar-sweep loader, Orbita's "scanning for agents" motif.
// `dark` renders it for dark surfaces (hero, forest cards).

const blips = [
  { top: '22%', left: '62%', delay: '0s' },
  { top: '58%', left: '30%', delay: '0.8s' },
  { top: '40%', left: '74%', delay: '1.5s' },
]

export default function RadarLoader({ label = 'Scanning your agent fleet', size = 88, dark = false }) {
  const ring = dark ? 'border-white/15' : 'border-forest/15'
  const cross = dark ? 'bg-white/10' : 'bg-forest/10'
  const beam = dark
    ? 'conic-gradient(from 0deg, rgba(255, 77, 0, 0.45), rgba(255, 77, 0, 0.08) 70deg, transparent 90deg)'
    : 'conic-gradient(from 0deg, rgba(23, 7, 2, 0.35), rgba(23, 7, 2, 0.06) 70deg, transparent 90deg)'

  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label={label}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Rings */}
        <span className={`absolute inset-0 rounded-full border ${ring}`} aria-hidden="true" />
        <span className={`absolute inset-[18%] rounded-full border ${ring}`} aria-hidden="true" />
        <span className={`absolute inset-[36%] rounded-full border ${ring}`} aria-hidden="true" />
        {/* Crosshairs */}
        <span className={`absolute top-1/2 right-0 left-0 h-px ${cross}`} aria-hidden="true" />
        <span className={`absolute top-0 bottom-0 left-1/2 w-px ${cross}`} aria-hidden="true" />
        {/* Sweep */}
        <span
          className="radar-beam absolute inset-0 rounded-full"
          style={{ background: beam }}
          aria-hidden="true"
        />
        {/* Blips */}
        {blips.map((b, i) => (
          <span
            key={i}
            className="radar-blip absolute h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(255,77,0,0.9)]"
            style={{ top: b.top, left: b.left, animationDelay: b.delay }}
            aria-hidden="true"
          />
        ))}
        {/* Center dot */}
        <span
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
          aria-hidden="true"
        />
      </div>
      {label && (
        <p className={`loading-dots text-sm font-medium ${dark ? 'text-white/60' : 'text-sub'}`}>
          {label}
        </p>
      )}
    </div>
  )
}
