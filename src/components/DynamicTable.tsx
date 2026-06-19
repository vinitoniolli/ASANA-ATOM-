import { startTransition } from 'react'
import type { DashboardRow } from '../types/dashboard'
import {
  COLUMN_GROUP_LABELS,
  formatCellValue,
  formatCurrencyValue,
  isCurrencyColumn,
  resolveColumnGroup,
} from '../utils/dashboard'

interface DynamicTableProps {
  columns: string[]
  rows: DashboardRow[]
  totalRows: number
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export function DynamicTable({
  columns,
  rows,
  totalRows,
  searchTerm,
  onSearchTermChange,
}: DynamicTableProps) {
  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <div className="table-toolbar__copy">
          <span className="table-panel__eyebrow">Tabela dinâmica</span>
          <h2>Leitura completa da planilha</h2>
          <p>
            Busca local sem alterar os dados originais. Mostrando {rows.length} de {totalRows}{' '}
            linhas visíveis.
          </p>
        </div>

        <label className="search-pill">
          <span>Busca local</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              startTransition(() => {
                onSearchTermChange(event.target.value)
              })
            }}
            placeholder="Buscar em qualquer coluna"
          />
        </label>
      </div>

      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" data-group={resolveColumnGroup(column)}>
                  <span className="table__group-tag">
                    {COLUMN_GROUP_LABELS[resolveColumnGroup(column)]}
                  </span>
                  <span className="table__column-label">{column}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(columns.length, 1)}>
                  <div className="table-empty">Nenhuma linha corresponde à busca atual.</div>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={`${String(row['row_number'] ?? rowIndex)}-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={`${column}-${rowIndex}`} data-group={resolveColumnGroup(column)}>
                      {isCurrencyColumn(column)
                        ? formatCurrencyValue(row[column])
                        : formatCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}