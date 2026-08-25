import HubTabs from '../components/HubTabs.jsx'
import AiAppDiscovery from './AiAppDiscovery.jsx'
import BrowserExtensions from './BrowserExtensions.jsx'
import LocalAi from './LocalAi.jsx'
import McpDiscovery from './McpDiscovery.jsx'

const tabs = [
  { id: 'apps', label: 'AI Apps', Component: AiAppDiscovery },
  { id: 'extensions', label: 'Extensions', Component: BrowserExtensions },
  { id: 'local', label: 'Local AI', Component: LocalAi },
  { id: 'mcp', label: 'MCP', Component: McpDiscovery },
]

export default function Discovery() {
  return <HubTabs tabs={tabs} />
}
