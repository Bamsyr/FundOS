/**
 * FundOS Design System — Border Radius Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Border Radius & Shapes
 */
export const radius = {
  sm:   '8px',    // reserved
  md:   '12px',   // buttons, inputs, list items
  lg:   '16px',   // primary cards, surfaces
  xl:   '20px',   // modals, drawers, elevated surfaces
  full: '9999px', // capsules, badges, circular
} as const

export type RadiusToken = keyof typeof radius
