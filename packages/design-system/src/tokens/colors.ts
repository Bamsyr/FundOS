/**
 * FundOS Design System — Color Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Color System
 */
export const colors = {
  // Surfaces
  surface: {
    app:      '#F6F8FB',
    default:  '#FFFFFF',
    elevated: '#FCFDFE',
    muted:    '#F2F4F7',
  },
  // Borders
  border: {
    default: '#E4E7EC',
    strong:  '#D0D5DD',
  },
  // Text
  text: {
    primary:   '#0F1728',
    secondary: '#667085',
    tertiary:  '#98A2B3',
    inverse:   '#FFFFFF',
  },
  // Accents
  accent: {
    primary:       '#0F766E',
    primaryHover:  '#0C5F59',
    primaryActive: '#094F4A',
    info:          '#2E90FA',
    success:       '#12B76A',
    warning:       '#F79009',
    danger:        '#F04438',
    dangerHover:   '#D92D20',
    lavender:      '#7A5AF8',
  },
  // Semantic bg washes (light tints)
  wash: {
    success: '#EBF5F3',
    warning: '#FFFAEB',
    danger:  '#FEFCF7',
    info:    '#EFF8FF',
    primary: 'rgba(15, 118, 110, 0.03)',
  },
} as const

export type ColorToken = typeof colors
