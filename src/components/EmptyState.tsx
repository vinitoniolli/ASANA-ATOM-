interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="state-card empty-state">
      <span className="state-card__eyebrow">Sem conteúdo</span>
      <h2 className="state-card__title">{title}</h2>
      <p className="empty-state__text">{description}</p>
    </section>
  )
}