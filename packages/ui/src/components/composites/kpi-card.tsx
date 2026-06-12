/**
 * FundOS KpiCard — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Card Variants § KPI Card
 *
 * Layout: Label → Large numeric value → Delta badge → Sparkline (optional)
 */
import * as React from 'react'
import { cn } from '../lib/cn'
import { Card } from '../primitives/card'
import { Badge } from '../primitives/badge'

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'neutral'
  /** Render a sparkline slot (pass SVG or chart component) */
  sparkline?: React.ReactNode
  loading?: boolean
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, delta, deltaDirection = 'neutral', sparkline, loading, className, ...props }, ref) => (
    <Card
      ref={ref}
      interactive
      className={cn('flex flex-col gap-2 min-w-0', className)}
      {...props}
    >
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{label}</span>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-text-primary numeric leading-none">
          {loading ? <span className="skeleton h-8 w-24 rounded inline-block" /> : value}
        </span>
        {delta && !loading && (
          <Badge
            variant={deltaDirection === 'up' ? 'verified' : deltaDirection === 'down' ? 'low' : 'default'}
            className="shrink-0 text-xs"
          >
            {deltaDirection === 'up' ? '\u2191' : deltaDirection === 'down' ? '\u2193' : ''} {delta}
          </Badge>
        )}
      </div>

      {sparkline && (
        <div className="mt-1 h-4">{sparkline}</div>
      )}
    </Card>
  )
)
KpiCard.displayName = 'KpiCard'
