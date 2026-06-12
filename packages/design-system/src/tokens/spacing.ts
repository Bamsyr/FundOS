/**
 * FundOS Design System — Spacing Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Spacing & Rhythm
 * Base unit: 4px
 */
export const spacing = {
  0:   '0px',
  0.5: '2px',
  1:   '4px',
  2:   '8px',
  3:   '12px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  8:   '32px',
  10:  '40px',
  12:  '48px',
  16:  '64px',
  20:  '80px',
  24:  '96px',
  32:  '128px',
} as const

/**
 * Semantic padding presets per context
 * Source: FRONTEND_DESIGN_SYSTEM.md § Padding Rules
 */
export const paddingPresets = {
  card:        { x: spacing[6], y: spacing[6] },       // 24px
  formInput:   { x: spacing[3], y: '14px' },            // 12px H, 14px V
  buttonMd:    { x: spacing[4], y: '10px' },            // 16px H, 10px V
  buttonSm:    { x: spacing[3], y: '8px' },             // 12px H, 8px V
  buttonLg:    { x: spacing[5], y: '14px' },            // 20px H, 14px V
  listRow:     { x: spacing[3], y: spacing[4] },        // 12px H, 16px V
  heroSection: { x: spacing[12], y: spacing[10] },      // 48px H, 40px V
  modal:       { x: spacing[6],  y: spacing[6] },       // 24px
  drawerHeader:{ x: spacing[6],  y: spacing[6] },
} as const

export const gapPresets = {
  cardSections:  spacing[6],   // 24px vertical
  formFields:    spacing[4],   // 16px
  listRows:      spacing[3],   // 12px
  kpiStrip:      spacing[4],   // 16px
  buttonGroup:   spacing[3],   // 12px
} as const
