/**
 * FundOS Sidebar — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Navigation & Layout § Sidebar
 *
 * Width: 264px, fixed, border-right
 * States: default | active | hover
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string | number
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onNavigate: (item: SidebarItem) => void
  bottomSlot?: React.ReactNode
  askAiSlot?: React.ReactNode
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  items, activeId, onNavigate, bottomSlot, askAiSlot, className
}) => (
  <aside
    className={cn(
      'fixed left-0 top-0 h-screen w-[264px] z-50',
      'flex flex-col',
      'bg-[#F8FAFC] border-r border-border-default',
      className
    )}
    aria-label="Main navigation"
  >
    {/* Logo slot */}
    <div className="px-5 py-6 border-b border-border-default">
      <span className="text-xl font-bold text-text-primary font-display">FundOS</span>
    </div>

    {/* Nav items */}
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul role="list" className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'bg-white text-text-primary border-l-[3px] border-accent shadow-subtle pl-[9px]'
                    : 'text-text-secondary hover:bg-surface-muted border-l-[3px] border-transparent pl-[9px]'
                )}
              >
                <span aria-hidden className="shrink-0 w-5 h-5">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-accent text-white text-xs rounded-full px-1.5 py-0.5 numeric">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>

    {/* Bottom section */}
    <div className="mt-auto border-t border-border-default px-3 py-4 flex flex-col gap-3">
      {bottomSlot}
      {askAiSlot && (
        <div className="w-full">{askAiSlot}</div>
      )}
    </div>
  </aside>
)
