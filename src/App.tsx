import { startTransition, useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { MktOnePage } from './pages/MktOnePage'
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

      <div hidden={activeTab === 'MKT 1'} aria-hidden={activeTab === 'MKT 1'}>
        <section className="page-shell">
          <Header panelName="ATOM" sectionName={activeTab} status="success" />
          <EmptyState
            title="Em construção"
            description="Esta seção ainda está sendo preparada para receber novos dados e indicadores."
          />
        </section>
      </div>
    </Layout>
  )
}

export default App
