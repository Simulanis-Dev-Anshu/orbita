import HubTabs from '../components/HubTabs.jsx'
import Organization from './Organization.jsx'
import OauthDiscovery from './OauthDiscovery.jsx'
import AiAccounts from './AiAccounts.jsx'
import IdentityCorrelation from './IdentityCorrelation.jsx'

const tabs = [
  { id: 'organization', label: 'Organization', Component: Organization },
  { id: 'oauth', label: 'OAuth', Component: OauthDiscovery },
  { id: 'accounts', label: 'AI Accounts', Component: AiAccounts },
  { id: 'correlation', label: 'Correlation', Component: IdentityCorrelation },
]

export default function Identity() {
  return <HubTabs tabs={tabs} />
}
