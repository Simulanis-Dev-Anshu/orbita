# Orbita: Backend Architecture & Free Tech Stack

*Researched 2026-07-09. All licenses verified as of this date.*

## Architecture

```
CONNECTORS (pollers/webhooks)
Google Workspace Admin SDK │ MS Graph │ Slack audit │ Zoho │ GitHub │ DNS/proxy logs
     │
     │  dlt pipelines (extract → normalize, schema evolution, retries)
     ▼
RabbitMQ (MPL 2.0) ──► Celery workers            Valkey (BSD-3)
     │                  (ETL + detection jobs)    cache · rate limits · sessions
     ▼
DETECTION ENGINE
  ├─ rule matcher (known agent platforms, LLM endpoints)
  ├─ scikit-learn behavior classifier (agent-vs-human timing)
  └─ Ollama local LLM (Qwen/Llama): classify unknown apps, stays in India
     │
     ▼
PostgreSQL: one database, three engines
  ├─ relational: inventory, users, alerts, billing
  ├─ Apache AGE: identity graph (Agent·Human·Credential·Scope, openCypher)
  └─ pgvector: embeddings for Sentinel Copilot RAG
     │
     ▼
FastAPI (MIT)
  ├─ React dashboard (existing frontend)
  ├─ Keycloak: OIDC/SAML SSO (Apache 2.0)
  ├─ Sentinel Copilot: LangGraph *library* or Pydantic AI + Langfuse traces
  └─ Alerts/mail: Brevo free tier → SES + listmonk (newsletter)
```

## Recommended stack (all ₹0 license cost)

| Layer | Pick | License | Free alternatives |
|---|---|---|---|
| Message queue | RabbitMQ | MPL 2.0 | Valkey streams (simpler MVP), NATS JetStream (Apache 2.0) |
| Cache ("Redis") | Valkey | BSD-3, Linux Foundation | Redis 8 (AGPLv3: fine for internal use) |
| Graph DB | Postgres + Apache AGE | Apache 2.0 | Neo4j Community (GPLv3, limits below) |
| Vector DB | pgvector + pgvectorscale | PostgreSQL license | Qdrant (Apache 2.0) at >50M vectors; Chroma for prototypes |
| Agent framework | LangGraph library only / Pydantic AI | MIT | CrewAI (MIT), smolagents (Apache 2.0) |
| LLM runtime | Ollama + Qwen 2.5 / Llama 3.x | Free, local | vLLM (Apache 2.0) at scale |
| LLM observability | Langfuse self-hosted | MIT core | - |
| Auth / SSO | Keycloak | Apache 2.0 | Authentik (MIT, easier ops), Zitadel (AGPL since 2025) |
| Transactional mail | Brevo free tier (300/day) → Amazon SES | free / ~₹8 per 1000 | Self-host Postal (deliverability pain: avoid) |
| Newsletter/campaigns | listmonk self-hosted | AGPLv3 (fine to use) | - |
| Email templates | MJML / React Email | MIT | - |
| ETL | dlt + Celery beat schedules | Apache 2.0 | Meltano (Apache 2.0); avoid Airbyte OSS (needs k8s+Temporal now) |
| Workflow orchestration | Prefect or Dagster (when needed) | Apache 2.0 | Temporal (MIT) for durable workflows |
| API | FastAPI | MIT | - |
| Error tracking | GlitchTip | MIT | Sentry self-host (FSL, functional but source-available) |
| Metrics/logs | Prometheus + Grafana + Loki | Apache/AGPL mix, standard | - |
| Deploy | Docker Compose → k3s | free | Hetzner / E2E Networks / DO Bangalore |

## License traps (why some "obvious" picks are wrong)

### 1. LangGraph Platform is not free
- `langgraph` / `langchain-core` libraries: **MIT, free**.
- `langgraph-api` (what `langgraph dev` / `langgraph build` run): **Elastic License 2.0**: production use requires the paid Platform ($39/user/mo cloud; self-hosting is Enterprise-only, sales call required).
- **Free path:** use LangGraph as a plain library; serve agents from your own FastAPI endpoints; store checkpoints in Postgres. Or use **Pydantic AI** (MIT, typed, no upsell): the better fit for Sentinel Copilot's graph-query/summarize/report workloads. LangChain only for integrations.

### 2. Neo4j Community Edition is deliberately limited
GPLv3, single instance, **no clustering, no RBAC, no hot backups**: the enterprise features a security product needs are the paywall. Memgraph is BSL (enterprise from ~$25K/yr); FalkorDB is source-available. For a SaaS that also ships self-hosted to BFSI customers, **Apache AGE** (openCypher inside Postgres, Apache 2.0) is the clean answer. Orphan detection, permission drift and blast radius are all Cypher queries either way.

### 3. Redis licensing: pick Valkey
Redis 8 returned to open source (AGPLv3 tri-license, May 2025): fine for internal use. But Orbita sells self-hosted deployments, so **Valkey** (BSD-3, drop-in compatible fork under the Linux Foundation) removes copyleft questions from every enterprise sales conversation.

### 4. Airbyte OSS got heavy
Docker Compose deprecated; self-hosting now requires Kubernetes + Temporal + Postgres + Redis. Orbita's connectors are custom API pollers anyway → **dlt** (pure Python, state/retries/schema handled) + Celery beats is lighter and free.

## Component notes

- **RabbitMQ**: natural Celery broker; use topic exchanges for connector fan-out, dead-letter queues for failed syncs. At MVP, Valkey-as-broker is acceptable to cut one service; add RabbitMQ when routing complexity demands it. Kafka only if DNS-log streaming volume forces it.
- **Data sources & gotchas**: Google Workspace Admin SDK (OAuth app verification takes weeks: start month one), MS Graph, Slack audit-log API (**customer must be on Enterprise Grid**), GitHub audit log, Zoho/Freshworks for Indian mid-market, DNS/proxy egress for LLM-endpoint detection.
- **One Postgres, three engines**: relational + AGE graph + pgvector means the Copilot's RAG context, the identity graph and the inventory live in one transactional database: and one `docker compose up` for self-hosted customers.
- **Mail reality check**: self-hosting SMTP means fighting IP reputation forever. Brevo free tier (300/day) covers MVP alerts; SES (~₹8/1000) at growth; listmonk self-hosted for the newsletter.
- **Auth**: Keycloak because enterprise buyers demand SAML/OIDC SSO and auditors recognize it. Authentik if Keycloak ops feel heavy pre-enterprise.

## Sources

- [LangGraph is MIT-licensed, but your production deployment might not be](https://rvernica.github.io/2026/03/langchain-license)
- [ZenML: LangGraph pricing guide](https://www.zenml.io/blog/langgraph-pricing)
- [ArcadeDB: Neo4j alternatives in 2026](https://arcadedb.com/blog/neo4j-alternatives-in-2026-a-fair-look-at-the-open-source-options/)
- [Redis is now available under AGPLv3](https://redis.io/blog/agplv3/)
- [Redis vs Valkey after the license drama](https://sumguy.com/redis-vs-valkey-2026/)
- [DataExpert: open source ETL tools 2026](https://www.dataexpert.io/blog/open-source-etl-tools-comparison-guide-2026)
- [Keycloak vs Authentik vs Zitadel 2026](https://blog.houseoffoss.com/post/keycloak-vs-authentik-vs-zitadel-2026-which-open-source-login-tool-should-you-use)
- [listmonk: self-hosted newsletter + transactional](https://listmonk.app/)
- [Brevo: free SMTP tiers compared](https://www.brevo.com/blog/free-smtp-servers/)
- [Firecrawl: best open source agent frameworks 2026](https://www.firecrawl.dev/blog/best-open-source-agent-frameworks)
- [Speakeasy: agent framework comparison](https://www.speakeasy.com/blog/ai-agent-framework-comparison/)
- [Layerbase: vector databases compared 2026](https://layerbase.com/blog/vector-databases-compared-2026)
- [Encore: best vector databases](https://encore.dev/articles/best-vector-databases)
