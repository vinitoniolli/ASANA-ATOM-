import type {
  ColumnGroupKey,
  DashboardResponse,
  DashboardRow,
  DashboardValue,
  MetricCardData,
} from '../types/dashboard'

const GROUP_RULES: Record<string, ColumnGroupKey> = {
  DATA: 'action',
  HORÁRIO: 'action',
  CANAL: 'action',
  'TÍTULO / ASSUNTO': 'content',
  'MENSAGEM CENTRAL': 'content',
  CTA: 'content',
  'DISPAROS ENVIADOS': 'metrics',
  'ABERTURAS (QTD)': 'metrics',
  'TX. ABERTURA (%)': 'metrics',
  'CLIQUES (QTD)': 'metrics',
  'TX. CLIQUE (%)': 'metrics',
  'LEADS GERADOS': 'metrics',
  'PALPITES RECEBIDOS': 'form',
  'LIGAÇÕES REALIZADAS': 'insideSales',
  'ATENDIMENTOS (QTD)': 'insideSales',
  'CONVERSÕES (IMERSÃO 360)': 'result',
}

const METRIC_SPECS = [
  {
    id: 'actions',
    label: 'Total de ações',
    helper: 'Quantidade total de linhas recebidas do endpoint.',
    tone: 'action' as const,
    aliases: [] as string[],
  },
  {
    id: 'sent',
    label: 'Disparos enviados',
    helper: 'Soma automática da coluna de disparos, quando existir.',
    tone: 'metrics' as const,
    aliases: ['DISPAROS ENVIADOS'],
  },
  {
    id: 'openings',
    label: 'Aberturas',
    helper: 'Soma automática das aberturas recebidas via planilha.',
    tone: 'metrics' as const,
    aliases: ['ABERTURAS (QTD)'],
  },
  {
    id: 'clicks',
    label: 'Cliques',
    helper: 'Soma automática dos cliques recebidos via planilha.',
    tone: 'metrics' as const,
    aliases: ['CLIQUES (QTD)'],
  },
  {
    id: 'leads',
    label: 'Leads gerados',
    helper: 'Soma automática dos leads gerados, quando a coluna existir.',
    tone: 'form' as const,
    aliases: ['LEADS GERADOS'],
  },
  {
    id: 'conversions',
    label: 'Conversões',
    helper: 'Soma automática das conversões vindas do endpoint.',
    tone: 'result' as const,
    aliases: ['CONVERSÕES (IMERSÃO 360)'],
  },
]

export const COLUMN_GROUP_LABELS: Record<ColumnGroupKey, string> = {
  action: 'Ação',
  content: 'Conteúdo',
  metrics: 'Base/Métricas',
  form: 'Formulário',
  insideSales: 'Inside Sales',
  result: 'Resultado',
  other: 'Outras Colunas',
}

export function normalizeColumnName(column: string): string {
  return column.replace(/\s+/g, ' ').trim().toLocaleUpperCase('pt-BR')
}

export function resolveColumnGroup(column: string): ColumnGroupKey {
  return GROUP_RULES[normalizeColumnName(column)] ?? 'other'
}

const CURRENCY_KEYWORDS = [
  'checkout',
  'inside sales',
  'total',
  'valor',
  'receita',
  'venda',
  'faturamento',
  'preço',
  'price',
  'revenue',
  'sales',
  'amount',
]

export function isCurrencyColumn(column: string): boolean {
  const lower = column.toLocaleLowerCase('pt-BR')
  return CURRENCY_KEYWORDS.some((kw) => lower.includes(kw))
}

export function formatCurrencyValue(value: DashboardValue): string {
  if (value === null || value === undefined) return '—'

  const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))

  if (!Number.isFinite(num)) return formatCellValue(value)

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatCellValue(value: DashboardValue): string {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'string') {
    return value.trim().length > 0 ? value : '—'
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)
      : '—'
  }

  return String(value)
}

export function formatDateTime(value: string): string {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(parsed)
}

export function formatMetricValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export function filterRows(
  columns: string[],
  rows: DashboardRow[],
  searchTerm: string,
): DashboardRow[] {
  const normalizedTerm = searchTerm.replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR')

  if (!normalizedTerm) {
    return rows
  }

  return rows.filter((row) =>
    columns.some((column) => {
      const value = formatCellValue(row[column])

      return value.replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR').includes(normalizedTerm)
    }),
  )
}

export function buildMetricCards(data: DashboardResponse): MetricCardData[] {
  return METRIC_SPECS.flatMap((spec) => {
    if (spec.id === 'actions') {
      return [
        {
          id: spec.id,
          label: spec.label,
          helper: spec.helper,
          value: data.rows.length,
          tone: spec.tone,
        },
      ]
    }

    const column = findColumn(data.columns, spec.aliases)

    if (!column) {
      return []
    }

    return [
      {
        id: spec.id,
        label: spec.label,
        helper: spec.helper,
        value: sumColumn(data.rows, column),
        tone: spec.tone,
      },
    ]
  })
}

export function parseDashboardResponse(payload: unknown): DashboardResponse {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Resposta inválida do endpoint.')
  }

  const record = payload as Record<string, unknown>

  if (record.success === false) {
    throw new Error('O endpoint retornou success=false.')
  }

  const columns = Array.isArray(record.columns)
    ? record.columns.filter((column): column is string => typeof column === 'string')
    : []

  const rows = Array.isArray(record.rows)
    ? record.rows.filter((row): row is DashboardRow => {
        return typeof row === 'object' && row !== null && !Array.isArray(row)
      })
    : []

  return {
    success: record.success !== false,
    source: asString(record.source),
    document: asString(record.document),
    sheetName: asString(record.sheetName),
    updatedAt: asString(record.updatedAt),
    totalRows: typeof record.totalRows === 'number' ? record.totalRows : rows.length,
    columns,
    rows,
  }
}

function findColumn(columns: string[], aliases: string[]): string | undefined {
  const aliasSet = new Set(aliases.map((alias) => normalizeColumnName(alias)))

  return columns.find((column) => aliasSet.has(normalizeColumnName(column)))
}

function sumColumn(rows: DashboardRow[], column: string): number {
  return rows.reduce((total, row) => {
    const parsed = parseNumberish(row[column])

    return parsed === null ? total : total + parsed
  }, 0)
}

function parseNumberish(value: DashboardValue): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const cleaned = value.replace(/\s+/g, '').replace(/%/g, '')

  if (!cleaned) {
    return null
  }

  const normalized = cleaned
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')

  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}