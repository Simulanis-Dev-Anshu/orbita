import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Waypoints,
  Bot,
  BellRing,
  ShieldCheck,
  Plug,
  Settings,
  LifeBuoy,
  ChevronDown,
  Sparkles,
  X,
} from 'lucide-react'
import BrandMark from './BrandMark.jsx'

const mainNav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/copilot', label: 'Sentinel Copilot', icon: Sparkles },
  { to: '/app/graph', label: 'Agent Graph', icon: Waypoints },
  { to: '/app/inventory', label: 'Inventory', icon: Bot },
  { to: '/app/alerts', label: 'Alerts', icon: BellRing, badge: 5 },
  { to: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
  { to: '/app/connectors', label: 'Connectors', icon: Plug },
]

const bottomNav = [
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/help', label: 'Help', icon: LifeBuoy },
]

function NavItem({ to, label, icon: Icon, badge, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-btn px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-brand-soft text-ink'
            : 'text-sub hover:bg-card/60 hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={1.8}
            className={isActive ? 'text-brand' : 'text-sub group-hover:text-brand'}
            aria-hidden="true"
          />
          <span className="flex-1">{label}</span>
          {badge ? (
            <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-canvas transition-transform duration-300 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex h-full flex-col border-r border-line px-4 py-6">
          {/* Logo */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size={36} />
              <span className="text-lg font-semibold tracking-tight">
                Orb<span className="text-forest">ita</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-sub hover:bg-card hover:text-ink lg:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* User profile */}
          <button
            type="button"
            className="mt-6 flex w-full cursor-pointer items-center gap-3 rounded-card bg-card p-3 text-left shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-forest">
              PR
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Prabhhav</span>
              <span className="block text-xs text-sub">Security Admin</span>
            </span>
            <ChevronDown size={16} className="text-sub" aria-hidden="true" />
          </button>

          {/* Main nav */}
          <nav className="mt-8 flex flex-1 flex-col gap-1.5">
            <p className="ox-label px-4 pb-2 text-sub">
              Main
            </p>
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={onClose} />
            ))}

            <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4">
              {bottomNav.map((item) => (
                <NavItem key={item.to} {...item} onNavigate={onClose} />
              ))}
            </div>
          </nav>

          {/* Scan CTA */}
          <div className="ox-plate mt-6 rounded-card p-4">
            <p className="text-sm font-semibold text-white">Weekly scan ready</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              12 sources connected. Run a fresh discovery sweep.
            </p>
            <button
              type="button"
              className="ox-btn ox-btn-primary mt-3 w-full cursor-pointer"
            >
              Run scan
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
