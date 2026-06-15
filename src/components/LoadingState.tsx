interface LoadingStateProps {
  title?: string
  description?: string
}

export function LoadingState({
  title = 'Carregando dados do painel',
  description = 'Buscando os dados atualizados do painel.',
}: LoadingStateProps) {
  return (
    <section className="state-card" aria-live="polite">
      <span className="state-card__eyebrow">Loading</span>
      <div className="state-card__inline">
        <span className="spinner" aria-hidden="true" />
        <h2 className="state-card__title">{title}</h2>
      </div>
      <p className="state-card__description">{description}</p>
    </section>
  )
}