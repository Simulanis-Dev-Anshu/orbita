import { Link } from 'react-router-dom'
import useSeo from '../../hooks/useSeo.js'

const links = [
  ['Home', '/'],
  ['Pricing', '/pricing'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['Security', '/security'],
  ['Contact', '/contact'],
]

export default function NotFound() {
  useSeo({
    title: 'Page not found — Orbita',
    description: 'This page does not exist. Return to Orbita’s homepage, pricing, blog or contact.',
    noindex: true,
  })

  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="ox-label text-sub">404</p>
      <h1 className="font-display mt-3 text-4xl">This page is not in the inventory.</h1>
      <p className="mt-4 text-sm leading-relaxed text-sub">
        The URL may be mistyped or the page moved. These are the pages search engines and people
        actually need:
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-forest hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
