import { useState } from 'react'
import { Check, Play, Shield } from 'lucide-react'
import { remediationActions as seed } from '../data/platform.js'

function statusTone(status) {
  if (status === 'executed') return 'bg-brand-soft text-forest'
  if (status === 'approved') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

export default function OneClickRemediation() {
  const [rows, setRows] = useState(seed)

  const approve = (id) => {
    setRows((list) => list.map((r) => (r.id === id && r.status === 'pending' ? { ...r, status: 'approved' } : r)))
  }
  const execute = (id) => {
    setRows((list) => list.map((r) => (r.id === id && r.status === 'approved' ? { ...r, status: 'executed' } : r)))
  }

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Shield size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">One-Click Remediation</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Recommend → Admin approves → Execute
            </h2>
            <p className="mt-1 text-sm text-sub">
              Revoke OAuth, disable MCP, rotate tokens, open Jira — never fully autonomous at first.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-card bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-muted/60 text-xs font-semibold tracking-wide text-sub uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Action</th>
                <th className="px-4 py-3 font-semibold">Target</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Workflow</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink sm:px-5">{r.action}</td>
                  <td className="px-4 py-3.5 text-sub">{r.target}</td>
                  <td className="px-4 py-3.5 text-sub">{r.risk}</td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => approve(r.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-btn bg-forest px-2.5 py-1.5 text-[11px] font-semibold text-white"
                        >
                          <Check size={12} aria-hidden="true" />
                          Approve
                        </button>
                      )}
                      {r.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => execute(r.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-btn bg-brand px-2.5 py-1.5 text-[11px] font-semibold text-white"
                        >
                          <Play size={12} aria-hidden="true" />
                          Execute
                        </button>
                      )}
                      {r.status === 'executed' && (
                        <span className="text-[11px] font-semibold text-forest">Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
