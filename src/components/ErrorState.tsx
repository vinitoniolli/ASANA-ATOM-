interface ErrorStateProps {
  message: string
  onRetry?: () => void
  compact?: boolean
}

export function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  return (
    <section className={`state-card error-state${compact ? ' is-compact' : ''}`} role="alert">
      <span className="state-card__eyebrow">Erro</span>
      <h2 className="state-card__title">Não foi possível sincronizar o painel.</h2>
      <p className="error-state__message">{message}</p>
      {onRetry ? (
        <button type="button" className="state-card__button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </section>
  )
}