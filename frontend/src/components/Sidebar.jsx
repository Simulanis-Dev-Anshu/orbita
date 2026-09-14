import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BellRing,
  Settings,
  LifeBuoy,
  ChevronDown,
  X,
  Fingerprint,
  Boxes,
  Radar,
  ScanSearch,
  Share2,
  ShieldAlert,
  Wrench,
  Landmark,
  Search,
} from 'lucide-react'
import BrandMark from './BrandMark.jsx'

const mainNav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/identity', label: 'Identity', icon: Fingerprint },
  { to: '/app/discovery', label: 'Discovery', icon: Radar },
  { to: '/app/assets', label: 'Assets', icon: Boxes },
  { to: '/app/relationships', label: 'Relationships', icon: Share2 },
  { to: '/app/risk', label: 'Risk', icon: ShieldAlert },
  { to: '/app/intelligence', label: 'Intelligence', icon: ScanSearch },
  { to: '/app/remediation', label: 'Remediation', icon: Wrench },
  { to: '/app/governance', label: 'Governance', icon: Landmark },
  { to: '/app/alerts', label: 'Alerts', icon: BellRing, badge: 5 },
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
        `group flex items-center gap-3 rounded-[12px] px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
          isActive ? 'bg-white/[0.07] text-ink' : 'text-sub hover:bg-white/[0.04] hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={1.7}
            className={isActive ? 'text-ink' : 'text-sub group-hover:text-ink'}
            aria-hidden="true"
          />
          <span className="flex-1">{label}</span>
          {badge ? (
            <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose, onSearchClick }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-canvas transition-transform duration-300 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex h-full flex-col border-r border-white/[0.06] px-3 py-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <span className="text-[15px] font-semibold tracking-tight">Orbita</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-sub hover:bg-white/6 hover:text-ink lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left"
          >
            <span className="h-2 w-2 rounded-full bg-[#3ddc8a]" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">Anshu · Orbita</span>
            </span>
            <ChevronDown size={14} className="text-sub" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onSearchClick}
            className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[13px] text-sub"
          >
            <Search size={14} aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          <nav className="mt-5 flex flex-1 flex-col gap-0.5">
            <p className="px-3 pb-2 text-[11px] tracking-wide text-sub">Platform</p>
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={onClose} />
            ))}

            <div className="mt-auto flex flex-col gap-0.5 border-t border-white/[0.06] pt-3">
              {bottomNav.map((item) => (
                <NavItem key={item.to} {...item} onNavigate={onClose} />
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
