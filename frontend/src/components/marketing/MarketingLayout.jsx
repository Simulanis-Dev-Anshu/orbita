import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Radar, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react'
import { COOKIE_PREFS_EVENT } from '../PolicyBar.jsx'

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

const navLinks = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]

export default function MarketingLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <nav className="relative mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6" aria-label="Main">
          <Link to="/" className="relative z-10 flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest">
              <Radar size={16} className="text-brand" aria-hidden="true" />
            </span>
            <span className="text-[15px] font-bold tracking-tight">Orbita</span>
          </Link>

          <div className="absolute inset-x-0 hidden items-center justify-center gap-8 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-sub hover:text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="relative z-10 ml-auto hidden items-center gap-4 md:flex">
            <Link to="/login" className="text-sm font-medium text-sub transition-colors hover:text-ink">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-btn bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start free scan
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 ml-auto cursor-pointer rounded-full border border-line bg-card p-2 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-line bg-canvas px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-muted"
              >
                Log in
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  navigate('/signup')
                }}
                className="mt-2 cursor-pointer rounded-btn bg-ink px-4 py-3 text-sm font-semibold text-white"
              >
                Start free scan
              </button>
            </div>
          </div>
        )}
      </header>

      <Outlet />

      <section className="border-t border-line py-16" aria-label="Newsletter">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">The Shadow Ledger</h2>
          <p className="text-sm leading-relaxed text-sub">
            Shadow-AI research and agent-governance notes. One email a week.
          </p>
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              e.target.reset()
            }}
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Work email</span>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-btn border border-line bg-card px-5 py-3 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-ink"
              />
            </label>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest">
                <Radar size={14} className="text-brand" aria-hidden="true" />
              </span>
              <span className="font-bold">Orbita</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sub">
              Every AI agent in your company — discovered, owned, risk-scored.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
              <ShieldCheck size={12} aria-hidden="true" />
              DPDP-ready · India residency
            </p>
          </div>
          {[
            {
              h: 'Product',
              links: [
                ['Pricing', '/pricing'],
                ['Live demo', '/app'],
                ['Free scan', '/signup'],
              ],
            },
            {
              h: 'Resources',
              links: [
                ['Blog', '/blog'],
                ['Shadow MCP', '/blog/shadow-mcp-servers'],
                ['DPDP guide', '/blog/dpdp-act-ai-agents'],
              ],
            },
            {
              h: 'Company',
              links: [
                ['About', '/about'],
                ['Privacy', '/privacy'],
                ['Terms', '/terms'],
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <p className="text-xs font-semibold tracking-wider text-sub uppercase">{col.h}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-sub transition-colors hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-5 sm:px-6">
            <p className="text-xs text-sub">© 2026 Orbita · Made in India</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sub sm:ml-auto">
              <Link to="/privacy" className="hover:text-ink">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-ink">
                Terms
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(COOKIE_PREFS_EVENT))}
                className="cursor-pointer hover:text-ink"
              >
                Cookies
              </button>
            </div>
            <div className="flex gap-1">
              {[
                { Icon: LinkedInIcon, label: 'LinkedIn' },
                { Icon: XIcon, label: 'X (Twitter)' },
                { Icon: GitHubIcon, label: 'GitHub' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="rounded-lg p-2 text-sub transition-colors hover:bg-muted hover:text-ink"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
