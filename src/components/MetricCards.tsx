import type { MetricCardData } from '../types/dashboard'
import { formatMetricValue } from '../utils/dashboard'

interface MetricCardsProps {
  metrics: MetricCardData[]
}

export function MetricCards({ metrics }: MetricCardsProps) {
  if (metrics.length === 0) {
    return null
  }

  return (
    <section className="cards-grid" aria-label="Resumo de métricas">
      {metrics.map((metric) => (
        <article key={metric.id} className="metric-card" data-tone={metric.tone}>
          <span className="metric-card__label">{metric.label}</span>
          <h2 className="metric-card__value">{formatMetricValue(metric.value)}</h2>
          <p className="metric-card__helper">{metric.helper}</p>
        </article>
      ))}
    </section>
  )
}