/**
 * FundOS Badge — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Badge & Status System
 *
 * Confidence badges: strong | medium | low | updated | verified
 * Status chips: pending | completed | error
 * Lead investor badge: outline variant
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export type BadgeVariant =
  | 'strong' | 'medium' | 'low' | 'updated' | 'verified'
  | 'pending' | 'completed' | 'error'
  | 'lead'
  | 'outline'
  | 'default'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  pulse?: boolean
  icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  strong:    'bg-accent text-text-inverse',
  medium:    'bg-warning text-text-inverse',
  low:       'bg-danger text-text-inverse',
  updated:   'bg-accent text-text-inverse',
  verified:  'bg-success text-text-inverse',
  pending:   'bg-surface-muted text-text-secondary',
  completed: 'bg-wash-success text-success',
  error:     'bg-wash-danger text-danger',
  lead:      'border border-accent text-accent bg-transparent',
  outline:   'border border-border-default text-text-secondary bg-transparent',
  default:   'bg-surface-muted text-text-secondary',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', pulse, icon, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
        'whitespace-nowrap select-none',
        variantStyles[variant],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden>{icon}</span>}
      {children}
    </span>
  )
)
Badge.displayName = 'Badge'
