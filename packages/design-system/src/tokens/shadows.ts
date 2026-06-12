/**
 * FundOS Design System — Shadow Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Shadows & Depth
 * Base color: #0F1728 at specified opacity
 */
export const shadows = {
  none:   'none',
  subtle: '0 1px 4px rgba(15, 23, 40, 0.04)',
  sm:     '0 2px 8px rgba(15, 23, 40, 0.06)',
  md:     '0 4px 12px rgba(15, 23, 40, 0.08)',
  lg:     '0 8px 16px rgba(15, 23, 40, 0.12)',
} as const

export type ShadowToken = keyof typeof shadows
