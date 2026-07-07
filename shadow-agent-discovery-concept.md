# Shadow-Agent Discovery — Startup Concept

*Researched 2026-07-07*

## One-line pitch

**"You can't secure a workforce you can't see — we show you every AI agent in your company in 24 hours."**

## The problem

Employees everywhere are quietly creating AI agents — a Zapier bot with CRM access, a custom GPT holding the sales playbook, a Claude automation on a personal API key, a forgotten n8n workflow. Each holds live company credentials. Security teams have **no inventory of them**. It's the Shadow IT story replayed, with higher stakes.

## The product

A SaaS platform that:
1. **Discovers** every AI agent operating inside a company
2. **Maps** what each agent can access and who created it
3. **Risk-scores** each agent (data sensitivity × permission breadth × ownership status × vendor trust)
4. **Monitors continuously** — new agents, permission drift, orphaned credentials
5. **Proves compliance** — inventory reports for SOC 2, ISO 27001, EU AI Act, India DPDP Act 2023

## Why customers keep paying (retention logic)

- **The problem regenerates weekly.** Any employee can create a new agent this afternoon. Monday's inventory is stale by Friday. This is a live sensor (antivirus model), not an audit (pentest model).
- **Agents drift silently.** Read-only in March, write-access to payroll in June. Employees leave; their agents keep running on orphaned credentials.
- **Compliance makes it contractual.** Once auditors ask for the agent inventory every quarter, canceling means failing the next audit.
- **Alerts create daily habit.** "New agent detected with payroll access, no sponsor" is a page someone must acknowledge.

## Detection engine (the core IP)

| Source | What it yields |
|---|---|
| OAuth/app grants (Google Workspace Admin SDK, MS Graph) | Every third-party app authorized, with exact scopes |
| SaaS audit logs (Slack, Notion, GitHub, Zoho, Freshworks) | App installs and integrations — Zoho/Freshworks matter for Indian mid-market |
| Network/DNS egress | Traffic to api.openai.com, api.anthropic.com, generativelanguage.googleapis.com etc.; a machine calling an LLM every 5 min at 3 a.m. is an agent |
| Behavioral fingerprinting | Cron-like timing, 24/7 activity, machine-speed gaps, headless user-agents → agent-vs-human classifier. **This layer is the moat; connectors alone are copyable.** |

## Feature roadmap

**MVP (months 0–3)**
- Discovery scan — connect Google Workspace + Slack + network logs, "scary list" in under an hour (the demo that closes deals)
- Agent inventory — registry: name, platform, access, activity, first/last seen
- Ownership mapping — every agent tied to its creator; **orphaned-agent flags** (creator left) are the scariest finding
- Per-agent risk score

**V2 (months 3–9)**
- Permission-drift alerts ("this agent gained write access to payroll yesterday")
- New-agent alerts to Slack/email
- Compliance reports (SOC 2, ISO 27001, EU AI Act, DPDP Act 2023)
- Policy engine ("no agent touches finance data without a registered sponsor")

**V3**
- Kill switch — revoke an agent's OAuth grant from the UI
- Agent registration/approval workflow
- Risk-score trend lines; cross-company benchmarks ("companies your size average 23 shadow agents")

## Architecture

```
   CONNECTORS (pollers/webhooks)
   Google WS │ MS Graph │ Slack │ Zoho │ GitHub │ DNS/proxy logs
        │
        ▼
   INGESTION QUEUE (Redis Streams) ──► raw events, replayable
        │
        ▼
   NORMALIZER (Celery workers) ──► one common event schema
        │
        ▼
   DETECTION ENGINE
     ├─ rule matcher (known agent platforms, LLM endpoints)
     ├─ behavior classifier (timing/regularity → agent vs human)
     └─ local LLM (Ollama) → classify unknown apps from names/scopes
        │
        ▼
   IDENTITY GRAPH (Postgres + Apache AGE)
     nodes: Agent · Human · Credential · DataScope · Vendor
     edges: OWNS · CAN_ACCESS · CREATED_BY · CALLS
        │
        ├──► RISK SCORER (recomputed on every graph change)
        ▼
   API (FastAPI) ──► Dashboard (Next.js) · Alerts (Slack/email) · Compliance PDFs
```

The **temporal identity graph is the heart**: orphaned agents, permission drift, and credential blast-radius are all graph queries, and the time dimension answers "what could this agent access in March vs. now."

## Free & open-source tech stack (₹0 software cost)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + Tailwind + shadcn/ui | Free, huge Indian talent pool |
| API | FastAPI (Python) | Async, fast to build, same language as workers |
| Workers/jobs | Celery + Redis | Battle-tested polling/queueing |
| Database + graph | PostgreSQL + Apache AGE + pgvector | One DB does relational + graph + vector; avoids Neo4j licensing friction |
| Local LLM | Ollama + Qwen 2.5 / Llama 3.x | Classify apps without sending customer security data to US APIs — trust win |
| Anomaly detection | scikit-learn | Timing-pattern classifier needs nothing fancier |
| Auth | Keycloak | Free SSO/SAML — enterprise buyers require it |
| Monitoring | Prometheus + Grafana + Loki | Standard free stack |
| Deploy | Docker Compose → k3s | Compose for first customers, k3s at scale |
| Hosting | AWS Mumbai / DO Bangalore / E2E Networks / Hetzner | ₹5–15K/month runs first 10 customers |

## India go-to-market

- **DPDP Act 2023 as the compliance hook** — agent inventory is exactly the accountability evidence Indian enterprises need for automated personal-data processing; competitors won't build DPDP reports natively
- **Data residency as a feature** — self-hosted/India-hosted deployment wins BFSI and healthcare deals; the FOSS stack makes self-hosting genuinely deliverable
- **Cost structure** — connectors + Postgres + rules, no GPUs: two engineers + ₹15K/month servers → sellable MVP
- **Pricing** — ₹40–80K/month Indian mid-market; $1.5–3K/month US (same product, two margins)
- **Top of funnel** — free scan tool: "connect Google Workspace, see your shadow agents in 10 minutes"

## Expansion path

Discovery is the **CISO wedge**. Once every agent is inventoried, the upsell is the **internal task auction** (agents bid on tasks; price-discovery routing; you become the dispatcher in the critical path) sold to the COO. Two budgets, one platform — discovery finds the agents, the auction routes their work, and by then the product is effectively uncancelable.

## Known risks

- Connector maintenance is a permanent grind (every SaaS API changes)
- Google/Microsoft admin-API app-verification programs take weeks — **start approvals in month one**
- 12–18 month window before observability vendors (AgentOps, Langfuse, Arize) or suite incumbents (Workday ASOR, Salesforce Agentforce Command Center, Microsoft Entra Agent ID) move into the neutral cross-platform space

## Competitive context

The category is now called **"Agent System of Record"**. Incumbents manage only their own agents (Workday → Workday agents, Salesforce → Agentforce, Microsoft → Copilot). The open gap this product occupies: **cross-platform neutrality, mid-market price point, and continuous discovery** — the Datadog/Okta position that suite vendors structurally can't take because they each want lock-in.
