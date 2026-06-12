/**
 * FundOS Design System — Typography Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Typography
 */
export const fontFamily = {
  display: "'Satoshi', 'General Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  body:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  numeric: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const

/**
 * Type scale — [fontSize, lineHeight] in px
 * Maps to FRONTEND_DESIGN_SYSTEM.md Scale table
 */
export const typeScale = {
  displayXl: { fontSize: 48, lineHeight: 56, weight: fontWeight.semibold },
  displayL:  { fontSize: 40, lineHeight: 48, weight: fontWeight.semibold },
  h1:        { fontSize: 32, lineHeight: 40, weight: fontWeight.semibold },
  h2:        { fontSize: 28, lineHeight: 36, weight: fontWeight.semibold },
  h3:        { fontSize: 24, lineHeight: 32, weight: fontWeight.medium  },
  h4:        { fontSize: 20, lineHeight: 28, weight: fontWeight.medium  },
  bodyL:     { fontSize: 18, lineHeight: 28, weight: fontWeight.regular },
  body:      { fontSize: 16, lineHeight: 24, weight: fontWeight.regular },
  bodyS:     { fontSize: 14, lineHeight: 22, weight: fontWeight.regular },
  caption:   { fontSize: 12, lineHeight: 18, weight: fontWeight.medium  },
  kpiXl:     { fontSize: 36, lineHeight: 40, weight: fontWeight.semibold, fontVariantNumeric: 'tabular-nums' },
  kpiL:      { fontSize: 28, lineHeight: 32, weight: fontWeight.semibold, fontVariantNumeric: 'tabular-nums' },
} as const

export type TypeScaleKey = keyof typeof typeScale
