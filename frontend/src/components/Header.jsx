import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  Users,
  CreditCard,
  LogOut,
  BellRing,
  CheckCheck,
} from 'lucide-react'
import { notifications as seed } from '../data/mock.js'
import { endpoints, mapNotification } from '../lib/api.js'
import { DEMO_ACCOUNT, exitDemoMode, isDemoMode } from '../lib/demoSession.js'
import ThemeToggle from './ThemeToggle.jsx'

const severityDot = {
  critical: 'bg-danger',
  high: 'bg-warn',
  info: 'bg-brand',
}

function NotificationsMenu({ items, onMarkAllRead, onClose }) {
  const navigate = useNavigate()
  const unread = items.filter((n) => n.unread).length

  return (
    <div className="pop-in absolute top-full right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-card border border-line bg-card shadow-lift">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unread === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-sub transition-colors hover:bg-canvas hover:text-ink disabled:cursor-default disabled:opacity-50"
        >
          <CheckCheck size={14} aria-hidden="true" />
          Mark all read
        </button>
      </div>

      <ul className="max-h-80 overflow-y-auto p-1.5">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/app/alerts')
              }}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-canvas ${
                n.unread ? '' : 'opacity-60'
              }`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[n.severity]}`}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{n.title}</span>
                <span className="block text-xs leading-relaxed text-sub">{n.detail}</span>
                <span className="mt-0.5 block text-[11px] text-sub">{n.time}</span>
              </span>
              {n.unread && (
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="flex flex-col items-center gap-2 p-6 text-center">
            <BellRing size={22} className="text-sub" aria-hidden="true" />
            <p className="text-sm text-sub">You're all caught up.</p>
          </li>
        )}
      </ul>

      <Link
        to="/app/alerts"
        onClick={onClose}
        className="block border-t border-line px-4 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-canvas"
      >
        View all alerts
      </Link>
    </div>
  )
}

function ProfileMenu({ onClose }) {
  const navigate = useNavigate()

  const go = (to) => {
    onClose()
    navigate(to)
  }

  const items = [
    { label: 'My profile', icon: User, action: () => go('/app/settings') },
    { label: 'Team members', icon: Users, action: () => go('/app/settings') },
    { label: 'Plan & billing', icon: CreditCard, action: () => go('/app/settings') },
  ]

  return (
    <div className="pop-in absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-card border border-line bg-card shadow-lift">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-ink">
          AN
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{DEMO_ACCOUNT.name.split(' ')[0]}</span>
          <span className="block truncate text-xs text-sub">
            {isDemoMode() ? `${DEMO_ACCOUNT.email} · demo` : DEMO_ACCOUNT.email}
          </span>
        </span>
      </div>

      <div className="p-1.5">
        {items.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-canvas"
          >
            <Icon size={16} className="text-sub" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-line p-1.5">
        <button
          type="button"
          onClick={() => {
            exitDemoMode()
            go('/login')
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function Header({ title, subtitle, onMenuClick, onSearchClick }) {
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(null) // 'notifications' | 'profile' | null
  const [items, setItems] = useState(seed)

  useEffect(() => {
    endpoints
      .notifications()
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) setItems(rows.map(mapNotification))
      })
      .catch(() => {})
  }, [])
  const menusRef = useRef(null)

  const unread = items.filter((n) => n.unread).length
  const toggle = (menu) => setOpenMenu((cur) => (cur === menu ? null : menu))
  const close = () => setOpenMenu(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!openMenu) return
    const onPointer = (e) => {
      if (menusRef.current && !menusRef.current.contains(e.target)) close()
    }
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu])

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[22px] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 hidden truncate text-[13px] text-ink-2 sm:block">{subtitle}</p>}
        </div>

        {/* Search: opens the command palette */}
        <button
          type="button"
          onClick={onSearchClick}
          className="hidden w-64 cursor-pointer items-center gap-2.5 rounded-btn border border-line bg-card py-2.5 pr-3 pl-3.5 text-sm text-sub shadow-soft transition-colors hover:border-brand md:flex"
          aria-label="Search agents, owners and pages"
        >
          <Search size={18} aria-hidden="true" />
          <span className="flex-1 text-left">Search agents, owners…</span>
          <kbd className="rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[10px] font-semibold">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onSearchClick}
          className="cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-brand md:hidden"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div ref={menusRef} className="flex items-center gap-3">
          <ThemeToggle />
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('notifications')}
              className={`bell-btn relative cursor-pointer rounded-btn border bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-brand ${
                openMenu === 'notifications' ? 'border-forest' : 'border-line'
              }`}
              aria-label={`Notifications (${unread} unread)`}
              aria-expanded={openMenu === 'notifications'}
              aria-haspopup="true"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {unread}
                </span>
              )}
            </button>
            {openMenu === 'notifications' && (
              <NotificationsMenu
                items={items}
                onMarkAllRead={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
                onClose={close}
              />
            )}
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              close()
              navigate('/app/settings')
            }}
            className="hidden cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-brand hover:[&>svg]:rotate-45 sm:block [&>svg]:transition-transform [&>svg]:duration-300"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('profile')}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-ink ring-2 transition-shadow ${
                openMenu === 'profile' ? 'ring-brand' : 'ring-transparent hover:ring-white/20'
              }`}
              aria-label="Account menu"
              aria-expanded={openMenu === 'profile'}
              aria-haspopup="true"
            >
              AN
            </button>
            {openMenu === 'profile' && <ProfileMenu onClose={close} />}
          </div>
        </div>
      </div>
    </header>
  )
}
