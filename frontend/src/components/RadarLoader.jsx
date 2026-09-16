import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/motion.js'

const blips = [
  { top: '22%', left: '62%' },
  { top: '58%', left: '30%' },
  { top: '40%', left: '74%' },
]

export default function RadarLoader({ label = 'Scanning your agent fleet', size = 88, dark = false }) {
  const wrap = useRef(null)
  const beam = useRef(null)
  const ring = dark ? 'border-white/20' : 'border-forest/20'
  const cross = dark ? 'bg-white/14' : 'bg-forest/14'
  const beamFill = dark
    ? 'conic-gradient(from 0deg, rgba(255, 106, 51, 0.5), rgba(255, 106, 51, 0.08) 70deg, transparent 90deg)'
    : 'conic-gradient(from 0deg, rgba(226, 74, 18, 0.42), rgba(226, 74, 18, 0.06) 70deg, transparent 90deg)'

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap.to(beam.current, { rotation: 360, duration: 2.4, repeat: -1, ease: 'none' })
      gsap.fromTo(
        '.radar-blip',
        { scale: 0.35, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: { each: 0.55, repeat: -1, yoyo: true },
          ease: 'power2.out',
        },
      )
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrap} className="flex flex-col items-center gap-4" role="status" aria-label={label}>
      <div className="relative" style={{ width: size, height: size }}>
        <span className={`absolute inset-0 rounded-full border ${ring}`} aria-hidden="true" />
        <span className={`absolute inset-[18%] rounded-full border ${ring}`} aria-hidden="true" />
        <span className={`absolute inset-[36%] rounded-full border ${ring}`} aria-hidden="true" />
        <span className={`absolute top-1/2 right-0 left-0 h-px ${cross}`} aria-hidden="true" />
        <span className={`absolute top-0 bottom-0 left-1/2 w-px ${cross}`} aria-hidden="true" />
        <span
          ref={beam}
          className="absolute inset-0 rounded-full"
          style={{ background: beamFill }}
          aria-hidden="true"
        />
        {blips.map((b, i) => (
          <span
            key={i}
            className="radar-blip absolute h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(226,74,18,0.9)]"
            style={{ top: b.top, left: b.left }}
            aria-hidden="true"
          />
        ))}
        <span
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
          aria-hidden="true"
        />
      </div>
      {label && (
        <p className={`loading-dots text-sm font-medium ${dark ? 'text-white/75' : 'text-ink-2'}`}>
          {label}
        </p>
      )}
    </div>
  )
}
