/**
 * FundOS Design System — Animation Tokens
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md § Micro-Interactions & Animation
 */
export const duration = {
  instant:  '100ms',
  fast:     '150ms',
  standard: '200ms',
  moderate: '300ms',
  slow:     '500ms',
  ring:     '800ms',
  shimmer:  '1500ms',
} as const

export const easing = {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  spring:     'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeOut:    'ease-out',
  easeIn:     'ease-in',
  easeInOut:  'ease-in-out',
} as const

/**
 * Confidence ring animation
 * Ring fills from 0 to final value on mount
 */
export const confidenceRingAnimation = {
  duration: duration.ring,
  easing: easing.spring,
  firesOnce: true,
} as const

/**
 * Page transitions
 */
export const pageTransition = {
  enter: { opacity: 0, y: 4, duration: duration.moderate, easing: easing.decelerate },
  exit:  { opacity: 0, duration: duration.fast, easing: easing.accelerate },
} as const

/**
 * Dialog transitions
 */
export const dialogTransition = {
  enter: { scale: 0.95, opacity: 0, duration: duration.standard },
  exit:  { scale: 0.95, opacity: 0, duration: duration.fast },
} as const
