/**
 * FundOS ConfidenceMeter — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Confidence Score Ring
 *
 * Animated SVG ring that fills from 0 to score on mount (800ms spring)
 * Variants: strong (80-100) | medium (50-79) | weak (0-49)
 */
'use client'
import * as React from 'react'
import { cn } from '../lib/cn'

export interface ConfidenceMeterProps {
  /** Score 0–100 */
  score: number
  /** Outer diameter in px, default 160 */
  size?: number
  /** Ring stroke width, default 8 */
  strokeWidth?: number
  showLabel?: boolean
  showSparkline?: boolean
  sparkline?: React.ReactNode
  className?: string
  /** Override label beneath ring */
  label?: string
}

function getColor(score: number): string {
  if (score >= 80) return '#0F766E' // strong—full teal
  if (score >= 50) return '#2E90FA' // medium—info blue blend
  return '#F79009'                  // weak—warning orange
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  size = 160,
  strokeWidth = 8,
  showLabel = true,
  sparkline,
  className,
  label,
}) => {
  const [animatedScore, setAnimatedScore] = React.useState(0)
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (animatedScore / 100) * circumference
  const color = getColor(score)

  React.useEffect(() => {
    // Count up on mount, fires once
    let start: number | null = null
    const duration = 800
    const animate = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // spring easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
      const ease = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(ease * score))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const strengthLabel =
    score >= 80 ? 'High confidence' :
    score >= 50 ? 'Medium confidence' :
    'Low confidence'

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="#E4E7EC" strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.4s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold numeric text-text-primary" aria-label={`Confidence score: ${score} out of 100`}>
            {animatedScore}
          </span>
          <span className="text-xs text-text-secondary">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-text-secondary">{label ?? strengthLabel}</span>
          {sparkline && <div className="h-4">{sparkline}</div>}
        </div>
      )}
    </div>
  )
}
