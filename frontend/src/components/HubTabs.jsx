import { useSearchParams } from 'react-router-dom'

/**
 * Segment tabs for consolidated hub pages.
 * Syncs active tab to ?tab= in the URL.
 */
export default function HubTabs({ tabs, param = 'tab' }) {
  const [params, setParams] = useSearchParams()
  const fallback = tabs[0]?.id
  const active = tabs.some((t) => t.id === params.get(param)) ? params.get(param) : fallback
  const Active = tabs.find((t) => t.id === active)?.Component

  return (
    <div>
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-btn bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setParams({ [param]: t.id }, { replace: true })}
            className={`shrink-0 cursor-pointer rounded-btn px-3.5 py-2 text-sm font-semibold transition-colors ${
              active === t.id ? 'bg-card text-ink shadow-soft' : 'text-sub hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {Active ? <Active /> : null}
    </div>
  )
}
