import LegalShell from '../../components/marketing/LegalShell.jsx'
import useSeo from '../../hooks/useSeo.js'

const sections = [
  {
    id: 'what-we-use',
    h: 'What cookies we use',
    body: [
      'Orbita uses a small set of cookies and similar storage on www.orbita.io and app.orbita.io. We do not use advertising cookies or cross-site tracking. You can change your choice at any time via Cookie preferences in the footer.',
    ],
  },
  {
    id: 'essential',
    h: 'Essential cookies',
    body: ['These are required for the site to work and cannot be switched off.'],
    list: [
      'Session authentication — keeps you signed in while you use the product.',
      'Security (CSRF protection) — stops forged requests against your account.',
      'Cookie preference — remembers whether you chose Essential only or Accept all.',
    ],
  },
  {
    id: 'analytics',
    h: 'Analytics cookies (optional)',
    body: [
      'Set only if you choose Accept all. They help us understand which pages and features are used so we can improve the product. They are first-party and are not sold or used to advertise to you on other sites.',
    ],
  },
  {
    id: 'choices',
    h: 'How to change your choice',
    body: [
      'Open Cookie preferences in the site footer, or clear site data for orbita.io in your browser. Blocking all cookies will prevent sign-in. For the full picture of personal data we collect, see the Privacy Policy.',
    ],
  },
]

export default function Cookies() {
  useSeo({
    title: 'Cookie Policy — Orbita',
    description:
      'How Orbita uses cookies: essential session and security cookies, optional first-party analytics, and how to change your preference. No advertising or cross-site tracking.',
    path: '/cookies',
  })

  return (
    <LegalShell
      title="Cookie Policy"
      updated="August 25, 2026"
      intro="Short version: essential cookies keep you signed in and safe. Optional analytics cookies are first-party only. Nothing is used for ads or cross-site tracking."
      sections={sections}
    />
  )
}
