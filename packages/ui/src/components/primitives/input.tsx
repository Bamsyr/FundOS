/**
 * FundOS Input — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Input & Form System
 *
 * States: default | focus | error | disabled | filled
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  /** 'amount' renders 56px tall input for large currency entry */
  variant?: 'default' | 'amount'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightElement, variant = 'default', className, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText && !error ? `${inputId}-helper` : undefined

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-secondary pointer-events-none" aria-hidden>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={errorId ?? helperId}
            aria-invalid={!!error}
            className={cn(
              'w-full rounded-md border bg-surface-default text-text-primary',
              'placeholder:text-text-tertiary',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/20',
              'disabled:bg-surface-muted disabled:text-text-tertiary disabled:cursor-not-allowed',
              error
                ? 'border-danger bg-wash-danger focus-visible:border-danger focus-visible:ring-danger/20'
                : 'border-border-default',
              variant === 'amount' ? 'h-14 text-2xl font-semibold numeric px-3' : 'h-12 text-base px-3',
              leftIcon ? 'pl-10' : '',
              rightElement ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 text-text-secondary">
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-text-secondary">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
