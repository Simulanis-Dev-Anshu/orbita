import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import BrandMark from '../BrandMark.jsx'
import ThemeToggle from '../ThemeToggle.jsx'
import { COOKIE_PREFS_EVENT } from '../PolicyBar.jsx'
import RouteFade from '../motion/RouteFade.jsx'

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  )
}

function StatusDot(props) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" {...props}>
      <rect width="12" height="12" rx="2" fill="#16a34a" />
    </svg>
  )
}

const navLinks = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/security', label: 'Security' },
  { to: '/about', label: 'About' },
]

const footerCols = [
  {
    h: 'Product',
    links: [
      ['Identity', '/app/identity'],
      ['Discovery', '/app/discovery'],
      ['Assets', '/app/assets'],
      ['Relationships', '/app/relationships'],
      ['Risk', '/app/risk'],
      ['Intelligence', '/app/intelligence'],
      ['Remediation', '/app/remediation'],
      ['Governance', '/app/governance'],
    ],
  },
  {
    h: 'Resources',
    links: [
      ['Blog', '/blog'],
      ['Pricing', '/pricing'],
      ['DPDP guide', '/blog/dpdp-act-ai-agents'],
      ['Get a demo', '/app'],
    ],
  },
  {
    h: 'Company',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Security', '/security'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Cookies', '/cookies'],
    ],
  },
]

const socials = [
  { Icon: XIcon, label: 'X (Twitter)', href: '#' },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/anshu-nishad/' },
]

export default function MarketingLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/88 backdrop-blur-[14px]">
        <nav className="relative mx-auto flex h-14 max-w-[1200px] items-center px-4 sm:px-8" aria-label="Main">
          <Link to="/" className="relative z-10 flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <BrandMark size={32} />
            <span className="font-display text-[18px] tracking-[-0.03em]">Orbita</span>
          </Link>

          <div className="absolute inset-x-0 hidden items-center justify-center gap-7 md:flex">
            {navLinks.map((l) => {
              const className = 'text-[13.5px] font-medium tracking-[-0.01em] transition-colors'
              if (l.to.includes('#')) {
                return (
                  <Link key={l.to} to={l.to} className={`${className} text-ink-2 hover:text-ink`}>
                    {l.label}
                  </Link>
                )
              }
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `${className} ${isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'}`
                  }
                >
                  {l.label}
                </NavLink>
              )
            })}
          </div>

          <div className="relative z-10 ml-auto hidden items-center gap-2 md:flex">
            <ThemeToggle className="rounded-lg p-2" />
            <Link
              to="/login"
              className="px-3 py-2 text-[13.5px] font-medium tracking-[-0.01em] text-ink-2 transition-colors hover:text-ink"
            >
              Log in
            </Link>
            <Link to="/app" className="ox-btn ox-btn-ghost ox-btn-sm">
              Get a demo
            </Link>
            <Link to="/signup" className="ox-btn ox-btn-primary ox-btn-sm">
              Get started
            </Link>
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2 md:hidden">
            <ThemeToggle className="rounded-lg p-2" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer border border-line bg-card p-2"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-line bg-canvas px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-muted"
              >
                Log in
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  navigate('/signup')
                }}
                className="ox-btn ox-btn-primary mt-2 w-full cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      <RouteFade>
        <Outlet />
      </RouteFade>

      <section className="border-t border-line py-16" aria-label="Newsletter">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 text-center sm:px-8">
          <h2 className="font-display text-[clamp(28px,3vw,40px)] text-ink">The Shadow Ledger</h2>
          <p className="ox-lead text-center">
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
                className="w-full border border-line bg-card px-5 py-3 text-[15px] outline-none transition-colors placeholder:text-sub/60 focus:border-ink"
              />
            </label>
            <button type="submit" className="ox-btn ox-btn-primary shrink-0 cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-[1200px] px-4 pt-14 sm:px-8 sm:pt-16">
          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <p className="ox-label text-ink">Orbita</p>
              <p className="mt-4 max-w-[28ch] text-[15px] leading-relaxed text-ink-2">
                Every AI agent in your company: discovered, owned, risk-scored, and kill-switch ready.
              </p>
              <p className="ox-label mt-7 text-sub">Get updated on</p>
              <div className="mt-3 flex items-center gap-1">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center text-ink-2 transition-colors hover:bg-muted hover:text-ink"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.h}>
                <p className="ox-label text-ink">{col.h}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      {to ? (
                        <Link
                          to={to}
                          className="text-[15px] text-ink-2 transition-colors hover:text-ink"
                        >
                          {label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new Event(COOKIE_PREFS_EVENT))}
                          className="cursor-pointer text-[15px] text-ink-2 transition-colors hover:text-ink"
                        >
                          {label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-brand mt-16 overflow-hidden sm:mt-20">
            <span className="footer-wordmark" aria-label="Orbita">
              Orbita
            </span>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
            <p className="text-[12.5px] text-sub">© 2026 Orbita, Inc. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-sub">
              <Link to="/privacy" className="transition-colors hover:text-ink">
                Privacy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-ink">
                Terms
              </Link>
              <Link to="/cookies" className="transition-colors hover:text-ink">
                Cookies
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(COOKIE_PREFS_EVENT))}
                className="cursor-pointer transition-colors hover:text-ink"
              >
                Cookie preferences
              </button>
              <span className="inline-flex items-center gap-2">
                Ask about Orbita on
                {socials.slice(0, 2).map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-ink-2 transition-colors hover:text-ink"
                  >
                    <Icon />
                  </a>
                ))}
              </span>
              <span className="inline-flex items-center gap-2 text-ink-2">
                <StatusDot />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
