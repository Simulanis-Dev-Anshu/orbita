# AgentLens: Shadow Agent Discovery Dashboard

Frontend for the shadow-AI-agent discovery platform: discover, inventory and risk-score every AI agent operating inside a company.

Built with **React + Vite**, **Tailwind CSS v4**, **Recharts** (analytics), **@xyflow/react** (identity graph) and **lucide-react** icons. All data is mocked in `src/data/mock.js`. Swap those imports for FastAPI calls when the backend is ready.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Pages

**Public site** (marketing layout with navbar/footer):

| Route | What's there |
|-------|--------------|
| `/` | Homepage: announcement bar, animated live-discovery hero (beams → radar → discovered-agent ticker), logo marquee, threat-landscape grid (6 risks), stats, how-it-works, product modules (Discovery Engine / Identity Graph / MCP Gateway / Compliance Packs), features grid, exposure calculator, trust section (stack compatibility + framework alignment + zero-intrusion), testimonials, blog cards, newsletter, certified footer |
| `/pricing` | Flat ₹/$ plans with "most popular" highlight + FAQ accordion |
| `/blog`, `/blog/:slug` | "The Shadow Ledger": 4 research-grounded articles (Shadow MCP, DPDP, orphaned agents, behavioral fingerprinting) |
| `/login`, `/signup` | Split-screen auth (mock, submits into the app) |

**App** (sidebar layout, under `/app`):

| Route | What's there |
|-------|--------------|
| `/app` | Dashboard: hero KPI + minis, discovery trend, Sentinel copilot, agents table, risk donut, peer benchmark, approvals + source health |
| `/app/graph` | React Flow identity graph: Human → Agent → Credential → Data scope, red animated edges for orphaned/PII paths |
| `/app/inventory` | Full registry with search, **Register agent** (create), and per-agent edit/delete |
| `/app/alerts` | Drift/orphan/egress alert feed with severity filters and resolve actions |
| `/app/compliance` | DPDP / SOC 2 / ISO 27001 / EU AI Act scorecards, DPDP checklist, auditor evidence |
| `/app/connectors` | Source catalog incl. MCP Server Scanner, connect/disconnect, free-scan CTA, and **register custom MCP servers / API endpoints by URL** (validated, removable) |
| `/app/settings` | Workspace + data residency, team roles, ₹/$ billing plans |

**⌘K / Ctrl+K** anywhere in the app opens the command palette: search agents/owners/pages, or hand the query to Sentinel Copilot ("Stuck?" row). Clicking any table row opens the **agent drawer**: Agent Passport trust score, risk breakdown, blast radius, behavioral fingerprint heatmap, kill switch, edit and delete.

Agent CRUD is backed by `src/context/AgentsContext.jsx` (in-memory). Swap its callbacks for FastAPI calls to go live.

## Design tokens

Defined in `src/index.css` (`@theme`): primary `#86E64A`, dark `#103E2D`, background `#F8F9F7`, borders `#ECECEC`, cards 20px radius, buttons/inputs 14px, soft shadow `0 4px 20px rgba(0,0,0,.05)`, Poppins type. Use the generated utilities (`bg-brand`, `text-forest`, `rounded-card`, `shadow-soft`, …) instead of raw hex values.
