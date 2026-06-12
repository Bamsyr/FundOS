/**
 * FundOS Modal — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Modal & Drawer System
 *
 * Centered overlay, 600px wide, radius-20, large shadow + backdrop blur
 * Animation: scale(0.95) → scale(1) + fade 200ms
 */
'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, description, children, footer, className
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div
        ref={dialogRef}
        className={cn(
          'relative bg-surface-default rounded-xl shadow-lg w-full max-w-[600px] max-h-[90vh]',
          'flex flex-col overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-default flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default z-10">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-text-primary">{title}</h2>
            {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
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
