import { Menu, Search, Bell, Settings } from 'lucide-react'

export default function Header({ title, subtitle, onMenuClick, onSearchClick }) {
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
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="hidden truncate text-sm text-sub sm:block">{subtitle}</p>}
        </div>

        {/* Search — opens the command palette */}
        <button
          type="button"
          onClick={onSearchClick}
          className="hidden w-64 cursor-pointer items-center gap-2.5 rounded-btn border border-line bg-card py-2.5 pr-3 pl-3.5 text-sm text-sub shadow-soft transition-colors hover:border-forest md:flex"
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
          className="cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-forest md:hidden"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="relative cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-forest"
          aria-label="Notifications (3 unread)"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="hidden cursor-pointer rounded-btn border border-line bg-card p-2.5 text-ink shadow-soft transition-colors hover:border-forest sm:block"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-brand">
          PR
        </span>
      </div>
    </header>
  )
}
