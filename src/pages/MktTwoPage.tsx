import { useDeferredValue, useState } from 'react'
import { DynamicTable } from '../components/DynamicTable'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Header } from '../components/Header'
import { LoadingState } from '../components/LoadingState'
import { MetricCards } from '../components/MetricCards'
import { useDashboardData } from '../hooks/useDashboardData'
import { filterRows } from '../utils/dashboard'
import { buildSocialMetricCards } from '../utils/social'

const ENDPOINT = 'https://n8nsemfila.iatom.site/webhook/dashboard-redes-sociais-2'

export function MktTwoPage() {
  const { data, status, error, isRefreshing, refresh } = useDashboardData(ENDPOINT)
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const columns = data?.columns ?? []
  const rows = data?.rows ?? []
  const filteredRows = filterRows(columns, rows, deferredSearchTerm)

  if (status === 'loading' && !data) {
    return (
      <section className="page-shell">
        <Header panelName="ATOM" sectionName="MKT 2" status="loading" />
        <LoadingState />
      </section>
    )
  }

  if (status === 'error' && !data) {
    return (
      <section className="page-shell">
        <Header panelName="ATOM" sectionName="MKT 2" status="error" onRefresh={refresh} />
        <ErrorState
          message={error ?? 'O endpoint não respondeu com um payload válido.'}
          onRetry={refresh}
        />
      </section>
    )
  }

  if (!data) {
    return null
  }

  const metrics = buildSocialMetricCards(data)
  const hasColumns = columns.length > 0
  const isCompletelyEmpty = columns.length === 0 && rows.length === 0

  return (
    <section className="page-shell">
      <Header
        panelName="ATOM"
        sectionName="MKT 2"
        status={status}
        document={data.document}
        sheetName={data.sheetName}
        updatedAt={data.updatedAt}
        totalRows={data.totalRows}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />

      {error ? <ErrorState compact message={error} onRetry={refresh} /> : null}

      {isCompletelyEmpty ? (
        <EmptyState
          title="Endpoint vazio"
          description="O endpoint respondeu, mas não trouxe colunas nem linhas para renderizar no painel."
        />
      ) : (
        <>
          <MetricCards metrics={metrics} />

          {hasColumns ? (
            <DynamicTable
              columns={columns}
              rows={filteredRows}
              totalRows={rows.length}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          ) : (
            <EmptyState
              title="Nenhuma coluna recebida"
              description="A tabela depende do array columns do endpoint. Quando ele voltar a ser preenchido, a renderização reaparece automaticamente."
            />
          )}
        </>
      )}
    </section>
  )
}
