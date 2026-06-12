/**
 * @fundos/design-system
 *
 * Central export for all FundOS design tokens and theme utilities.
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md
 *
 * Usage:
 *   import { colors, spacing, radius } from '@fundos/design-system'
 *   import { fundosPreset } from '@fundos/design-system/themes/tailwind.preset'
 *   // In layout.tsx: import '@fundos/design-system/src/themes/globals.css'
 */

// — Tokens
export * from './tokens'

// — Theme utilities
export { fundosPreset } from './themes/tailwind.preset'

// — Version
export const DESIGN_SYSTEM_VERSION = '0.1.0'
