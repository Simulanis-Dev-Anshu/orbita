import HubTabs from '../components/HubTabs.jsx'
import SecurityAnalyst from './SecurityAnalyst.jsx'
import NlSecuritySearch from './NlSecuritySearch.jsx'
import AttackSimulation from './AttackSimulation.jsx'

const tabs = [
  { id: 'analyst', label: 'Analyst', Component: SecurityAnalyst },
  { id: 'search', label: 'NL search', Component: NlSecuritySearch },
  { id: 'simulate', label: 'Attack sim', Component: AttackSimulation },
]

export default function Intelligence() {
  return <HubTabs tabs={tabs} />
}
