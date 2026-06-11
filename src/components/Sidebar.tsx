import type { TabKey } from '../types/dashboard'

interface SidebarProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
}

const TABS: Array<{ key: TabKey; helper: string }> = [
  { key: 'Comercial', helper: 'Visão reservada para indicadores comerciais.' },
  { key: 'MKT 1', helper: 'Painel conectado ao Google Sheets via n8n.' },
  { key: 'MKT 2', helper: 'Espaço pronto para a próxima frente de marketing.' },
]

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  return (
    <aside className="layout__sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark" aria-hidden="true">
          AT
        </div>
        <div className="sidebar__brand-copy">
          <span className="sidebar__eyebrow">Painel de Operações</span>
          <h1 className="sidebar__title">ATOM</h1>
          <p className="sidebar__description">
            Front-end em React consumindo dados vivos do Google Sheets via n8n.
          </p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Seções do painel">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`sidebar__button${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => onSelectTab(tab.key)}
          >
            <span className="sidebar__button-title">{tab.key}</span>
            <span className="sidebar__button-copy">{tab.helper}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        Atualização automática a cada 10 segundos e sincronização manual sob demanda.
      </div>
    </aside>
  )
}