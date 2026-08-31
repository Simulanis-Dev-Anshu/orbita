import { Link } from 'react-router-dom'
import useSeo from '../../hooks/useSeo.js'
import { organization, SITE } from '../../data/seo.js'

const contacts = [
  ['Sales & demos', 'hello@orbita.io', 'Pricing, a live walkthrough, or a free discovery scan.'],
  ['Privacy requests', 'privacy@orbita.io', 'Access, correction, deletion or DPDP/GDPR rights.'],
  ['Legal', 'legal@orbita.io', 'Terms, DPAs and contract questions.'],
  ['Security', 'security@orbita.io', 'Vulnerability reports and security questionnaires.'],
]

export default function Contact() {
  useSeo({
    title: 'Contact Orbita — sales, privacy, legal, security',
    description:
      'Email Orbita for a demo, privacy requests, legal questions or security reports. Headquartered in India, serving security teams worldwide.',
    path: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${SITE}/contact`,
      mainEntity: organization,
    },
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="ox-label text-sub">Contact</p>
      <h1 className="font-display mt-3 text-4xl">Talk to a human.</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-sub sm:text-base">
        Orbita is headquartered in India and sells to security teams worldwide. Pick the inbox that
        matches your request — we reply within two business days, faster for security reports.
      </p>

      <ul className="mt-10 space-y-3">
        {contacts.map(([label, email, hint]) => (
          <li key={email} className="rounded-card bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold tracking-wider text-sub uppercase">{label}</p>
            <a href={`mailto:${email}`} className="mt-1 block text-base font-semibold text-forest hover:underline">
              {email}
            </a>
            <p className="mt-1 text-sm text-sub">{hint}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-sub">
        Looking for the product instead?{' '}
        <Link to="/signup" className="font-semibold text-forest hover:underline">
          Start a free scan
        </Link>{' '}
        or{' '}
        <Link to="/pricing" className="font-semibold text-forest hover:underline">
          see pricing
        </Link>
        .
      </p>
    </main>
  )
}
