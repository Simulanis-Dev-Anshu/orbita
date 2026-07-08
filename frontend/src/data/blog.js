// Blog content — grounded in real 2026 market research.

export const posts = [
  {
    slug: 'shadow-mcp-servers',
    title: 'Shadow MCP: the newest blind spot in your AI stack',
    excerpt:
      'MCP servers went from niche experiment to Linux Foundation governance in a year. Only ~24% of organizations can see which agents talk to which MCP servers. Here is how the other 76% get breached.',
    tag: 'Research',
    date: 'Jul 6, 2026',
    readTime: '6 min',
    author: 'Orbita Research',
    content: [
      { t: 'p', v: 'Model Context Protocol (MCP) has become the connective tissue between AI agents and enterprise systems. Every major AI platform adopted it, and your employees are already running MCP servers you have never heard of — connected to Postgres, GitHub, and your CRM.' },
      { t: 'h', v: 'Why security teams call it "the new shadow IT"' },
      { t: 'p', v: 'A 2026 industry survey found that only 24.4% of organizations have full visibility into which AI agents are communicating with each other. The remaining three quarters have agent-to-MCP connections that no one has mapped, scoped, or approved.' },
      { t: 'ul', v: ['Rogue MCP servers spun up on employee laptops with production credentials', 'Sensitive data leakage through MCP tool responses containing PII', 'Prompt injection via compromised data sources flowing back into agents'] },
      { t: 'h', v: 'What discovery looks like' },
      { t: 'p', v: 'Orbita treats MCP servers as first-class nodes in the identity graph: every server is tied to the human who launched it, the credentials it holds, and the data scopes it can reach. Orphaned MCP servers — running after their creator left — get flagged the same way orphaned agents do.' },
      { t: 'p', v: 'If you cannot list your MCP servers today, that is the first thing our free discovery scan will show you.' },
    ],
  },
  {
    slug: 'dpdp-act-ai-agents',
    title: 'DPDP Act 2023: what your AI agents mean for compliance',
    excerpt:
      'When an AI agent sends customer data to a US LLM endpoint, DPDP transfer restrictions apply. Most Indian mid-market companies discover this during an audit — the expensive way.',
    tag: 'Compliance',
    date: 'Jun 28, 2026',
    readTime: '5 min',
    author: 'Orbita Research',
    content: [
      { t: 'p', v: 'India\'s Digital Personal Data Protection Act treats every AI agent that touches personal data as part of your processing chain. That has three consequences most compliance teams have not priced in.' },
      { t: 'h', v: '1. The 72-hour clock' },
      { t: 'p', v: 'DPDP Rules require notifying the Data Protection Board within 72 hours of a breach, with logs retained for one year. If an orphaned agent leaks data, the clock starts whether or not you knew the agent existed.' },
      { t: 'h', v: '2. Cross-border transfers' },
      { t: 'p', v: 'Section 16 lets the government restrict transfers to notified territories. An employee\'s Zapier workflow that pipes customer records to a US LLM API is a cross-border transfer — one that needs to appear in your transfer inventory.' },
      { t: 'h', v: '3. The processor register' },
      { t: 'p', v: 'Every external AI service your agents call is effectively a data processor. Auditors increasingly ask for a register of them. Orbita generates this register automatically from the live agent inventory.' },
    ],
  },
  {
    slug: 'orphaned-agents',
    title: 'Orphaned agents: when employees leave, their bots stay',
    excerpt:
      'Offboarding revokes the laptop and the email account. It almost never revokes the six automations the employee built. Meet the highest-risk identity class in your company.',
    tag: 'Security',
    date: 'Jun 15, 2026',
    readTime: '4 min',
    author: 'Orbita Research',
    content: [
      { t: 'p', v: 'In every discovery scan we run, orphaned agents are the finding that makes CISOs sit up: automations still executing on credentials of people who left months ago.' },
      { t: 'h', v: 'Why offboarding misses them' },
      { t: 'p', v: 'OAuth grants issued to third-party automation platforms survive account deactivation in surprising ways — service tokens, refresh tokens cached by vendors, workflows re-assigned to shared mailboxes. IT closes the account; the agent keeps its keys.' },
      { t: 'ul', v: ['No human owner means no one notices drift or failures', 'Credentials are never rotated because no one knows they exist', 'Blast radius grows silently as connected apps expand scopes'] },
      { t: 'h', v: 'The fix is continuous, not annual' },
      { t: 'p', v: 'A quarterly access review catches orphans nine weeks too late. Tying every agent to a human owner — and alerting the moment that owner is deactivated in your IdP — turns offboarding into an automatic kill-switch trigger.' },
    ],
  },
  {
    slug: 'behavioral-fingerprinting',
    title: 'How to tell an agent from a human in your audit logs',
    excerpt:
      'Agents do not sleep, do not take weekends, and act at machine speed. Behavioral fingerprinting turns those tells into a classifier — and a heatmap your auditor understands in five seconds.',
    tag: 'Engineering',
    date: 'Jun 2, 2026',
    readTime: '7 min',
    author: 'Orbita Research',
    content: [
      { t: 'p', v: 'API keys and OAuth grants tell you an integration exists. They do not tell you whether the thing behind them is a person or an autonomous agent. Behavior does.' },
      { t: 'h', v: 'The three tells' },
      { t: 'ul', v: ['Cadence: cron-like regularity — actions every 15 minutes, around the clock', 'Coverage: activity at 3 AM on Sundays, with no weekend drop-off', 'Speed: sub-second gaps between multi-step actions no human can produce'] },
      { t: 'h', v: 'From signals to score' },
      { t: 'p', v: 'We aggregate activity into a 7-day × 24-hour matrix per identity and feed timing features to a classifier. Flat, uniform heatmaps score as machine; business-hours clusters score as human. Confidence lands on the agent\'s risk profile — and on the passport your auditor sees.' },
      { t: 'p', v: 'The heatmap is the feature customers screenshot the most. Not because it is clever, but because it makes an invisible workforce visible in one glance.' },
    ],
  },
]
