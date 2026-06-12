/**
 * FundOS Design System — Tailwind CSS Preset
 * Source of truth: FRONTEND_DESIGN_SYSTEM.md
 *
 * Usage in tailwind.config.ts:
 *   import { fundosPreset } from '@fundos/design-system/themes/tailwind.preset'
 *   export default { presets: [fundosPreset], ... }
 */

import type { Config } from 'tailwindcss'

export const fundosPreset: Partial<Config> = {
  darkMode: ['selector', '[data-theme="dark"]'],

  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'Inter', '-apple-system', 'sans-serif'],
        body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      colors: {
        // — Brand primary (teal)
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          active:  'var(--color-primary-active)',
          subtle:  'var(--color-primary-subtle)',
          muted:   'var(--color-primary-muted)',
          border:  'var(--color-primary-border)',
          fg:      'var(--color-primary-fg)',
        },
        // — Surfaces
        bg:         'var(--color-bg)',
        surface:   'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        overlay:    'var(--color-overlay)',
        // — Borders
        border:    'var(--color-border)',
        'border-2': 'var(--color-border-2)',
        divider:   'var(--color-divider)',
        // — Text
        ink:            'var(--color-text)',
        'ink-secondary': 'var(--color-text-secondary)',
        'ink-tertiary':  'var(--color-text-tertiary)',
        'ink-disabled':  'var(--color-text-disabled)',
        'ink-inverse':   'var(--color-text-inverse)',
        // — Status
        success: {
          DEFAULT: 'var(--color-success)',
          subtle:  'var(--color-success-subtle)',
          fg:      'var(--color-success-fg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          subtle:  'var(--color-warning-subtle)',
          fg:      'var(--color-warning-fg)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          subtle:  'var(--color-danger-subtle)',
          fg:      'var(--color-danger-fg)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          subtle:  'var(--color-info-subtle)',
          fg:      'var(--color-info-fg)',
        },
        // — FundOS confidence signals
        confidence: {
          high:   'var(--color-confidence-high)',
          medium: 'var(--color-confidence-medium)',
          low:    'var(--color-confidence-low)',
          none:   'var(--color-confidence-none)',
        },
      },

      borderRadius: {
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        xs:   'var(--shadow-xs)',
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'focus-primary': 'var(--shadow-focus-primary)',
        'focus-danger':  'var(--shadow-focus-danger)',
      },

      transitionTimingFunction: {
        standard:   'cubic-bezier(0.16, 1, 0.3, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
        spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      transitionDuration: {
        instant:    '80ms',
        fast:      '150ms',
        base:      '200ms',
        medium:    '300ms',
        slow:      '400ms',
        deliberate: '600ms',
      },

      screens: {
        xs:    '320px',
        sm:    '640px',
        md:    '768px',
        lg:    '1024px',
        xl:    '1280px',
        '2xl': '1440px',
      },

      spacing: {
        'topbar': 'var(--topbar-height)',
        'sidebar': 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
        'content-narrow':  'var(--content-narrow)',
        'content-default': 'var(--content-default)',
        'content-wide':    'var(--content-wide)',
      },
    },
  },
} satisfies Partial<Config>
