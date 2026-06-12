/**
 * FundOS Topbar — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Navigation & Layout § Topbar
 *
 * Height: 72px, white bg, border-bottom
 * Slots: breadcrumb | search | contextArea (wallet, notifications, AI input, avatar)
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface TopbarProps extends React.HTMLAttributes<HTMLElement> {
  breadcrumb?: React.ReactNode
  search?: React.ReactNode
  contextArea?: React.ReactNode
}

export const Topbar: React.FC<TopbarProps> = ({
  breadcrumb, search, contextArea, className, ...props
}) => (
  <header
    className={cn(
      'fixed top-0 left-[264px] right-0 z-40',
      'h-[72px] bg-surface-default border-b border-border-default',
      'flex items-center gap-4 px-6',
      className
    )}
    {...props}
  >
    {breadcrumb && <div className="text-sm text-text-secondary shrink-0">{breadcrumb}</div>}
    {search && <div className="flex-1 max-w-[320px]">{search}</div>}
    <div className="ml-auto flex items-center gap-3">{contextArea}</div>
  </header>
)
