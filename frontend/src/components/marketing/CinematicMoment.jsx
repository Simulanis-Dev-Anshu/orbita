import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function OrbitGraphic({ className = '' }) {
  return (
    <svg
      className={`cinematic-orbit ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.5" />
      <circle cx="200" cy="200" r="168" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" opacity="0.35" />
      <circle cx="200" cy="200" r="72" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />
      <path
        d="M200 32 C 280 80, 320 140, 320 200 C 320 280, 260 340, 200 368"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.45"
      />
      <path
        d="M200 32 C 120 80, 80 140, 80 200 C 80 280, 140 340, 200 368"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.3"
      />
    </svg>
  )
}

function CinematicBackdrop({ image }) {
  return (
    <div className="cinematic-backdrop" aria-hidden="true">
      <div className="cinematic-backdrop__layer cinematic-backdrop__layer--sharp">
        <img src={image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="cinematic-backdrop__layer cinematic-backdrop__layer--blur">
        <img src={image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="cinematic-backdrop__grade" />
      <div className="cinematic-backdrop__vignette" />
      <OrbitGraphic className="cinematic-orbit--right" />
      <OrbitGraphic className="cinematic-orbit--left" />
    </div>
  )
}

export function CinematicInterlude({
  image = '/images/cinematic-moment.jpg',
  label = 'Shadow inventory',
  title = 'Every agent leaves a trace.',
  text = 'Orbita reads the signals your stack already emits: OAuth grants, API keys, workflow logs. It turns them into a live map.',
}) {
  return (
    <section className="cinematic-interlude" aria-label={label}>
      <CinematicBackdrop image={image} />
      <div className="cinematic-interlude__content">
        <p className="cinematic-eyebrow">{label}</p>
        <h2 className="cinematic-serif">{title}</h2>
        <p className="cinematic-interlude__text">{text}</p>
      </div>
    </section>
  )
}

export default function CinematicCta({
  image = '/images/cinematic-moment.jpg',
  title = 'Start mapping…',
  subtitle = 'A live inventory of every AI agent you already run, in 24 hours, read-only.',
  footnote = 'Free discovery scan · no credit card · data hosted in India',
}) {
  return (
    <section className="cinematic-cta" aria-label="Get started">
      <CinematicBackdrop image={image} />
      <div className="cinematic-cta__content">
        <h2 className="cinematic-serif cinematic-cta__title">{title}</h2>
        <p className="cinematic-cta__subtitle">{subtitle}</p>
        <div className="cinematic-cta__actions">
          <Link to="/signup" className="cinematic-btn cinematic-btn--primary">
            Start a free scan
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link to="/pricing" className="cinematic-btn cinematic-btn--ghost">
            See pricing
          </Link>
        </div>
        <p className="cinematic-cta__footnote">{footnote}</p>
      </div>
    </section>
  )
}
