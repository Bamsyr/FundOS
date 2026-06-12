/**
 * FundOS ProgressBar — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Data Visualization § Progress Bar
 *
 * Height: 4px, teal fill, radius-full
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value 0–100 */
  value: number
  /** Show percentage label */
  showLabel?: boolean
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md'
  animate?: boolean
}

const colorStyles: Record<NonNullable<ProgressBarProps['color']>, string> = {
  primary: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

const sizeStyles: Record<NonNullable<ProgressBarProps['size']>, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, showLabel, color = 'primary', size = 'xs', animate = true, className, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value))
    return (
      <div ref={ref} className={cn('flex items-center gap-2 w-full', className)} {...props}>
        <div
          className={cn('flex-1 rounded-full overflow-hidden bg-border-default', sizeStyles[size])}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              'h-full rounded-full',
              colorStyles[color],
              animate && 'transition-all duration-700 ease-out'
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-xs text-text-secondary numeric shrink-0 w-10 text-right">
            {clamped}%
          </span>
        )}
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'
