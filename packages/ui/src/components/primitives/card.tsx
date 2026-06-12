/**
 * FundOS Card — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Card & Container System
 *
 * Variants: default | elevated | muted | accent-wash
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'muted' | 'accent-wash'
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  'default':     'bg-surface-default border border-border-default',
  'elevated':    'bg-surface-elevated shadow-md border border-border-default',
  'muted':       'bg-surface-muted border border-border-default',
  'accent-wash': 'bg-wash-primary border border-border-default',
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive, padding = 'md', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        interactive && [
          'cursor-pointer transition-all duration-200',
          'hover:shadow-sm hover:-translate-y-0.5 hover:border-border-strong',
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold text-text-primary text-h4', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 pt-4 border-t border-border-default', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
