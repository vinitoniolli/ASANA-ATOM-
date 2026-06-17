import { startTransition, useState } from 'react'
import { Layout } from './components/Layout'
import { MktOnePage } from './pages/MktOnePage'
import { MktTwoPage } from './pages/MktTwoPage'
import type { TabKey } from './types/dashboard'

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('MKT 1')

  const handleTabChange = (nextTab: TabKey) => {
    startTransition(() => {
      setActiveTab(nextTab)
    })
  }

  return (
    <Layout activeTab={activeTab} onSelectTab={handleTabChange}>
      <div hidden={activeTab !== 'MKT 1'} aria-hidden={activeTab !== 'MKT 1'}>
        <MktOnePage />
      </div>

      <div hidden={activeTab !== 'MKT 2'} aria-hidden={activeTab !== 'MKT 2'}>
        <MktTwoPage />
      </div>
    </Layout>
  )
}

export default App
