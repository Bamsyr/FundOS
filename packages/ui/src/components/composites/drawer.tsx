/**
 * FundOS Drawer — Composite (Right-side slide)
 * Source: FRONTEND_DESIGN_SYSTEM.md § Modal & Drawer System § Drawer
 *
 * Width: 440px, slides from right, 300ms spring easing
 * Close: X button | click outside | ESC key
 */
'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  open, onClose, title, subtitle, children, footer, className
}) => {
  React.useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[900] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div
        className={cn(
          'relative bg-surface-default h-full w-[440px] max-w-full',
          'shadow-lg flex flex-col overflow-hidden',
          'animate-in slide-in-from-right-full duration-300 ease-out',
          className
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-default flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default z-10">
          <div>
            <h2 id="drawer-title" className="text-lg font-semibold text-text-primary">{title}</h2>
            {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="shrink-0 p-1 rounded-md text-text-secondary hover:bg-surface-muted transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 bg-surface-default px-6 py-4 border-t border-border-default">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
