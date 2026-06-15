import type { LoadStatus } from '../types/dashboard'
import { formatDateTime, formatMetricValue } from '../utils/dashboard'

interface HeaderProps {
  panelName: string
  sectionName: string
  status: LoadStatus
  document?: string
  sheetName?: string
  updatedAt?: string
  totalRows?: number
  isRefreshing?: boolean
  onRefresh?: () => void
}

export function Header({
  panelName,
  sectionName,
  status,
  document,
  sheetName,
  updatedAt,
  totalRows,
  isRefreshing = false,
  onRefresh,
}: HeaderProps) {
  const statusLabel = getStatusLabel(status, isRefreshing)

  const metadata = [
    { label: 'Documento', value: document },
    { label: 'Aba', value: sheetName },
    { label: 'Última atualização', value: updatedAt ? formatDateTime(updatedAt) : undefined },
    {
      label: 'Total de linhas',
      value: typeof totalRows === 'number' ? formatMetricValue(totalRows) : undefined,
    },
  ].filter((item) => item.value)

  return (
    <header className="page-header">
      <span className="header__eyebrow">Painel ATOM</span>

      <div className="header__row">
        <div className="header__title-block">
          <h2 className="header__title">{panelName}</h2>
          <p className="header__section">{sectionName}</p>
        </div>

        <div className="header__actions">
          <div className="header__status" data-status={status}>
            <span className="header__status-dot" aria-hidden="true" />
            <span>{statusLabel}</span>
          </div>

          {onRefresh ? (
            <button
              type="button"
              className="header__button"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar agora'}
            </button>
          ) : null}
        </div>
      </div>

      {metadata.length > 0 ? (
        <div className="header__meta">
          {metadata.map((item) => (
            <article key={item.label} className="meta-pill">
              <span className="meta-pill__label">{item.label}</span>
              <p className="meta-pill__value">{item.value}</p>
            </article>
          ))}
        </div>
      ) : null}
    </header>
  )
}

function getStatusLabel(status: LoadStatus, isRefreshing: boolean): string {
  if (status === 'error') {
    return 'Erro de sincronização'
  }

  if (status === 'loading' || isRefreshing) {
    return 'Sincronizando dados'
  }

  return 'Sincronizado'
}