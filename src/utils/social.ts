import type { ColumnGroupKey, DashboardResponse, DashboardRow, DashboardValue, MetricCardData } from '../types/dashboard'
import { normalizeColumnName } from './dashboard'

const GROUP_RULES: Record<string, ColumnGroupKey> = {
  'DATA': 'action',
  'TÍTULO / CONTEÚDO': 'content',
  'STATUS': 'action',
  '❤ CURTIDAS': 'metrics',
  '💬 COMENTÁRIOS': 'metrics',
  '👁 VISUALIZAÇÕES': 'metrics',
  'CT. ALCANÇADAS': 'metrics',
  'VISITAS PERFIL': 'metrics',
  'SEGUIDORES': 'metrics',
}

const METRIC_SPECS = [
  {
    id: 'posts',
    label: 'Total de posts',
    helper: 'Quantidade total de posts recebidos do endpoint.',
    tone: 'action' as const,
    aliases: [] as string[],
  },
  {
    id: 'likes',
    label: 'Curtidas',
    helper: 'Soma total de curtidas nos posts.',
    tone: 'metrics' as const,
    aliases: ['❤ Curtidas'],
  },
  {
    id: 'comments',
    label: 'Comentários',
    helper: 'Soma total de comentários nos posts.',
    tone: 'metrics' as const,
    aliases: ['💬 Comentários'],
  },
  {
    id: 'views',
    label: 'Visualizações',
    helper: 'Soma total de visualizações nos posts.',
    tone: 'metrics' as const,
    aliases: ['👁 Visualizações'],
  },
  {
    id: 'reach',
    label: 'Contas Alcançadas',
    helper: 'Soma total de contas alcançadas.',
    tone: 'metrics' as const,
    aliases: ['Ct. Alcançadas'],
  },
  {
    id: 'profileVisits',
    label: 'Visitas ao Perfil',
    helper: 'Soma total de visitas ao perfil.',
    tone: 'metrics' as const,
    aliases: ['Visitas Perfil'],
  },
  {
    id: 'followers',
    label: 'Seguidores',
    helper: 'Soma total de seguidores ganhos.',
    tone: 'result' as const,
    aliases: ['Seguidores'],
  },
]

export function resolveSocialColumnGroup(column: string): ColumnGroupKey {
  return GROUP_RULES[normalizeColumnName(column)] ?? 'other'
}

export function buildSocialMetricCards(data: DashboardResponse): MetricCardData[] {
  return METRIC_SPECS.flatMap((spec) => {
    if (spec.id === 'posts') {
      return [{ id: spec.id, label: spec.label, helper: spec.helper, value: data.rows.length, tone: spec.tone }]
    }

    const column = findColumn(data.columns, spec.aliases)
    if (!column) return []

    return [{ id: spec.id, label: spec.label, helper: spec.helper, value: sumColumn(data.rows, column), tone: spec.tone }]
  })
}

function findColumn(columns: string[], aliases: string[]): string | undefined {
  const aliasSet = new Set(aliases.map((a) => normalizeColumnName(a)))
  return columns.find((col) => aliasSet.has(normalizeColumnName(col)))
}

function sumColumn(rows: DashboardRow[], column: string): number {
  return rows.reduce((total, row) => {
    const parsed = parseNumberish(row[column])
    return parsed === null ? total : total + parsed
  }, 0)
}

function parseNumberish(value: DashboardValue): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null

  const cleaned = value.replace(/\s+/g, '').replace(/%/g, '')
  if (!cleaned) return null

  const normalized = cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}
