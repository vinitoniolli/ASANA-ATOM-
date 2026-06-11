export type DashboardValue = string | number | boolean | null | undefined

export type DashboardRow = Record<string, DashboardValue>

export interface DashboardResponse {
  success: boolean
  source: string
  document: string
  sheetName: string
  updatedAt: string
  totalRows: number
  columns: string[]
  rows: DashboardRow[]
}

export type LoadStatus = 'loading' | 'success' | 'error'

export type TabKey = 'Comercial' | 'MKT 1' | 'MKT 2'

export type ColumnGroupKey =
  | 'action'
  | 'content'
  | 'metrics'
  | 'form'
  | 'insideSales'
  | 'result'
  | 'other'

export interface MetricCardData {
  id: string
  label: string
  value: number
  helper: string
  tone: ColumnGroupKey
}