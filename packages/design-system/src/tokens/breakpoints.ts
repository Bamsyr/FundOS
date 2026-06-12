/**
 * FundOS Design System — Responsive Breakpoints
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Responsive Breakpoints
 */
export const breakpoints = {
  mobile:  320,
  tablet:  768,
  desktop: 1024,
  large:   1440,
} as const

export const breakpointPx = {
  mobile:  '320px',
  tablet:  '768px',
  desktop: '1024px',
  large:   '1440px',
} as const

/**
 * Responsive layout rules per breakpoint
 */
export const layoutRules = {
  mobile: {
    padding: '16px',
    gridGap: '12px',
    cardStack: '1-col',
    sidebar: 'hidden (hamburger)',
    fontScale: '-2px on base',
  },
  tablet: {
    padding: '24px',
    gridGap: '16px',
    cardStack: '2-col',
    sidebar: 'collapsible 200px',
    fontScale: 'standard',
  },
  desktop: {
    padding: '24px',
    gridGap: '24px',
    cardStack: '3-col (varies)',
    sidebar: 'fixed 264px',
    fontScale: 'standard',
  },
  large: {
    padding: '24px',
    gridGap: '24px',
    cardStack: '3-col+ (varies)',
    sidebar: 'fixed 264px',
    fontScale: 'standard',
  },
} as const
