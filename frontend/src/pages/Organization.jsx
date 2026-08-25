import { Building2, Shield, Users, UserCog } from 'lucide-react'
import {
  organization,
  teams,
  users,
  roles,
} from '../data/platform.js'

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function roleName(roleId) {
  return roles.find((r) => r.id === roleId)?.name ?? '—'
}

export default function Organization() {
  const admins = users.filter((u) => u.isAdmin)
  const membersByTeam = teams.map((team) => ({
    ...team,
    members: users.filter((u) => u.teamId === team.id),
  }))

  return (
    <div className="mt-4 space-y-4">
      {/* Org header */}
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Building2 size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Organization</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{organization.name}</h2>
            <p className="mt-1 text-sm text-sub">
              {organization.domain} · {organization.plan} · {organization.region}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-muted px-3 py-1.5 text-ink">{teams.length} teams</span>
            <span className="rounded-full bg-muted px-3 py-1.5 text-ink">{users.length} users</span>
            <span className="rounded-full bg-brand-soft px-3 py-1.5 text-forest">{admins.length} admins</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Org tree */}
        <section className="rounded-card bg-card p-5 shadow-soft sm:p-6 lg:col-span-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-ink">
              <Users size={18} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Teams & users</h3>
              <p className="text-sm text-sub">Hierarchy under {organization.name}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-canvas p-4 font-mono text-[13px] leading-relaxed">
            <p className="font-sans text-[15px] font-semibold tracking-tight text-ink">
              {organization.name}
            </p>
            <ul className="mt-3 space-y-4">
              {membersByTeam.map((team) => (
                <li key={team.id}>
                  <p className="font-sans text-sm font-semibold text-ink">{team.name}</p>
                  <ul className="mt-1.5 space-y-1 border-l border-line pl-4">
                    {team.members.map((m, i) => (
                      <li key={m.id} className="flex flex-wrap items-center gap-2">
                        <span className="text-sub" aria-hidden="true">
                          {i === team.members.length - 1 ? '└──' : '├──'}
                        </span>
                        <span className="font-sans font-medium text-ink">{m.name}</span>
                        <span className="rounded-full bg-card px-2 py-0.5 font-sans text-[11px] font-medium text-sub shadow-soft">
                          {roleName(m.roleId)}
                        </span>
                        {m.isAdmin && (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 font-sans text-[11px] font-semibold text-forest">
                            Admin
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* Flat member cards */}
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-3.5 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-brand">
                  {initials(u.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{u.name}</span>
                  <span className="block truncate text-xs text-sub">{u.email}</span>
                </span>
                <span className="text-[11px] text-sub">{u.lastActive}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Roles + Admins */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-ink">
                <Shield size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold">Roles</h3>
                <p className="text-sm text-sub">Permission sets for this org</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {roles.map((r) => (
                <li key={r.id} className="rounded-2xl border border-line bg-canvas p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <span className="text-[11px] font-medium text-sub">
                      {users.filter((u) => u.roleId === r.id).length} users
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-sub">{r.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.permissions.slice(0, 4).map((p) => (
                      <span
                        key={p}
                        className="rounded-[4px] bg-card px-1.5 py-0.5 font-mono text-[10px] text-sub shadow-soft"
                      >
                        {p}
                      </span>
                    ))}
                    {r.permissions.length > 4 && (
                      <span className="text-[10px] text-sub">+{r.permissions.length - 4}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
                <UserCog size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold">Admins</h3>
                <p className="text-sm text-sub">Users with elevated control</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {admins.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-3.5 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-brand">
                    {initials(a.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{a.name}</span>
                    <span className="block text-xs text-sub">{roleName(a.roleId)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
