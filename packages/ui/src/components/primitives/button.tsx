/**
 * FundOS Button — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Button System
 *
 * Variants: primary | secondary | ghost | destructive
 * Sizes:    sm | md | lg
 * States:   default | hover | active | focus | disabled | loading
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-accent text-text-inverse border-transparent hover:bg-accent-hover active:bg-accent-active ' +
    'disabled:bg-border-strong disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-accent border border-accent hover:bg-surface-muted active:text-accent-active ' +
    'disabled:text-text-tertiary disabled:border-border-strong disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-accent border-transparent hover:bg-surface-muted active:text-accent-active ' +
    'disabled:text-text-tertiary disabled:cursor-not-allowed',
  destructive:
    'bg-danger text-text-inverse border-transparent hover:bg-danger-hover active:bg-danger-hover ' +
    'disabled:bg-border-strong disabled:cursor-not-allowed',
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 py-2 text-sm rounded-md gap-1.5',   // 36px, 14px text
  md: 'h-11 px-4 py-2.5 text-base rounded-md gap-2', // 44px, 16px text
  lg: 'h-13 px-5 py-3.5 text-lg rounded-[14px] gap-2', // 52px, 18px text
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, iconLeft, iconRight, className, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
          'select-none cursor-pointer whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
        ) : (
          <>
            {iconLeft && <span className="shrink-0" aria-hidden>{iconLeft}</span>}
            {children}
            {iconRight && <span className="shrink-0" aria-hidden>{iconRight}</span>}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
