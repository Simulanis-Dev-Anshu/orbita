import HubTabs from '../components/HubTabs.jsx'
import AssetDatabase from './AssetDatabase.jsx'
import Inventory from './Inventory.jsx'
import McpTools from './McpTools.jsx'
import DataAccess from './DataAccess.jsx'

const tabs = [
  { id: 'database', label: 'Asset database', Component: AssetDatabase },
  { id: 'inventory', label: 'Agent inventory', Component: Inventory },
  { id: 'mcp-tools', label: 'MCP tools', Component: McpTools },
  { id: 'data', label: 'Data access', Component: DataAccess },
]

export default function Assets() {
  return <HubTabs tabs={tabs} />
}
