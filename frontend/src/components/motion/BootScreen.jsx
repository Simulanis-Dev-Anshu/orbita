import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import BrandMark from '../BrandMark.jsx'
import { prefersReducedMotion } from '../../lib/motion.js'

const KEY = 'orbita-booted'

export default function BootScreen() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) !== '1'
    } catch {
      return true
    }
  })
  const root = useRef(null)
  const mark = useRef(null)
  const word = useRef(null)
  const line = useRef(null)
  const meta = useRef(null)

  useEffect(() => {
    if (!show) return
    const reduced = prefersReducedMotion()
    const finish = () => {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      setShow(false)
    }

    if (reduced) {
      finish()
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      })
      gsap.set([mark.current, word.current, line.current, meta.current], { opacity: 0 })
      gsap.set(mark.current, { scale: 0.72, rotate: -12 })
      gsap.set(word.current, { y: 28, filter: 'blur(10px)' })
      gsap.set(line.current, { scaleX: 0 })
      tl.to(mark.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.7 }, 0.08)
        .to(word.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.78 }, 0.22)
        .to(line.current, { opacity: 1, scaleX: 1, duration: 0.55 }, 0.42)
        .to(meta.current, { opacity: 1, duration: 0.4 }, 0.55)
        .to(root.current, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 1.35)
    }, root)

    return () => ctx.revert()
  }, [show])

  if (!show) return null

  return (
    <div ref={root} className="boot-screen" role="status" aria-label="Loading Orbita">
      <div className="flex flex-col items-center gap-5">
        <div ref={mark} className="boot-screen__mark">
          <BrandMark size={44} invert />
        </div>
        <p ref={word} className="boot-screen__word">
          Orbita
        </p>
        <span ref={line} className="boot-screen__line" aria-hidden="true" />
        <p ref={meta} className="boot-screen__meta">
          Scanning the fleet
        </p>
      </div>
    </div>
  )
}
