/**
 * FundOS Toggle (Switch) — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Toggle Switch
 *
 * Track: gray (off), success-green (on)
 * Animation: 200ms ease cubic-bezier(0.4, 0, 0.2, 1)
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
  className?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked = false, onChange, disabled, label, id, className }, ref) => {
    const toggleId = id ?? React.useId()
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <button
          ref={ref}
          id={toggleId}
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
            'border-2 border-transparent transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-success' : 'bg-border-strong'
          )}
        >
          <span
            aria-hidden
            className={cn(
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm',
              'transform transition-transform duration-200 cubic-bezier(0.4,0,0.2,1)',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {label && (
          <label htmlFor={toggleId} className="text-sm text-text-primary cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    )
  }
)
Toggle.displayName = 'Toggle'
