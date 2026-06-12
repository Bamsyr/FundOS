/**
 * FundOS DataTable — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Table System
 *
 * Sticky header, row hover, sortable columns, expandable rows (via onRowClick)
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface Column<T> {
  key: string
  header: string
  accessor: (row: T) => React.ReactNode
  sortable?: boolean
  sticky?: boolean
  numeric?: boolean
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  onRowClick?: (row: T) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  emptyState?: React.ReactNode
  className?: string
}

export function DataTable<T>({
  columns, rows, getRowKey, onRowClick,
  sortColumn, sortDirection, onSort,
  emptyState, className
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border-default', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-3 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide',
                  'border-b border-border-default',
                  col.sticky && 'sticky left-0 bg-surface-muted z-10',
                  col.sortable && 'cursor-pointer select-none hover:text-text-primary transition-colors',
                  col.className
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
                aria-sort={sortColumn === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortColumn === col.key && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                      {sortDirection === 'asc'
                        ? <path d="M6 2l4 5H2l4-5z"/>
                        : <path d="M6 10L2 5h8l-4 5z"/>}
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-text-secondary text-sm">
                  {emptyState ?? 'No data available.'}
                </td>
              </tr>
            )
            : rows.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border-default last:border-0',
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-surface-muted'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3 py-3 text-sm text-text-primary',
                      col.sticky && 'sticky left-0 bg-surface-default z-10',
                      col.numeric && 'numeric',
                      col.className
                    )}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
