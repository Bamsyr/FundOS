import type { Config } from 'tailwindcss'
import { colors, spacing, radius, shadows, breakpoints, fontFamily } from './tokens'

/**
 * FundOS Tailwind Preset
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md
 * Import in tailwind.config.ts: presets: [fundosPreset]
 */
const fundosPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Surfaces
        'surface-app':      colors.surface.app,
        'surface-default':  colors.surface.default,
        'surface-elevated': colors.surface.elevated,
        'surface-muted':    colors.surface.muted,
        // Borders
        'border-default': colors.border.default,
        'border-strong':  colors.border.strong,
        // Text
        'text-primary':   colors.text.primary,
        'text-secondary': colors.text.secondary,
        'text-tertiary':  colors.text.tertiary,
        'text-inverse':   colors.text.inverse,
        // Accents
        'accent':         colors.accent.primary,
        'accent-hover':   colors.accent.primaryHover,
        'accent-active':  colors.accent.primaryActive,
        'info':           colors.accent.info,
        'success':        colors.accent.success,
        'warning':        colors.accent.warning,
        'danger':         colors.accent.danger,
        'danger-hover':   colors.accent.dangerHover,
        'lavender':       colors.accent.lavender,
        // Washes
        'wash-success': colors.wash.success,
        'wash-warning': colors.wash.warning,
        'wash-danger':  colors.wash.danger,
        'wash-info':    colors.wash.info,
        'wash-primary': colors.wash.primary,
      },
      fontFamily: {
        display: fontFamily.display.split(',').map(f => f.trim().replace(/'/g, '')),
        body:    fontFamily.body.split(',').map(f => f.trim().replace(/'/g, '')),
        numeric: fontFamily.numeric.split(',').map(f => f.trim().replace(/'/g, '')),
      },
      borderRadius: {
        sm:   radius.sm,
        md:   radius.md,
        lg:   radius.lg,
        xl:   radius.xl,
        full: radius.full,
      },
      boxShadow: {
        subtle: shadows.subtle,
        sm:     shadows.sm,
        md:     shadows.md,
        lg:     shadows.lg,
      },
      screens: {
        mobile:  `${breakpoints.mobile}px`,
        tablet:  `${breakpoints.tablet}px`,
        desktop: `${breakpoints.desktop}px`,
        large:   `${breakpoints.large}px`,
      },
      spacing: {
        '0.5': '2px',
        '3':   '12px',
        '5':   '20px',
        '6':   '24px',
        '10':  '40px',
        '12':  '48px',
        '16':  '64px',
        '20':  '80px',
        '24':  '96px',
        '32':  '128px',
      },
    },
  },
}

export default fundosPreset
