/**
 * FundOS AiBrief — Composite (Dashboard Hero Section)
 * Source: FRONTEND_DESIGN_SYSTEM.md § Page 3 § Bloc A — AI Brief Hero
 *
 * Layout: 60% greeting + summary + CTAs | 40% stats + confidence ring
 */
import * as React from 'react'
import { cn } from '../lib/cn'
import { Button } from '../primitives/button'
import { ConfidenceMeter } from './confidence-meter'

export interface AiBriefStat {
  label: string
  value: string
}

export interface AiBriefProps extends React.HTMLAttributes<HTMLDivElement> {
  userName: string
  summary: string
  primaryCta?: { label: string; onClick: () => void }
  secondaryCta?: { label: string; onClick: () => void }
  stats: [AiBriefStat, AiBriefStat, AiBriefStat]
  confidenceScore: number
}

export const AiBrief: React.FC<AiBriefProps> = ({
  userName,
  summary,
  primaryCta,
  secondaryCta,
  stats,
  confidenceScore,
  className,
  ...props
}) => (
  <section
    className={cn(
      'rounded-lg p-8 flex gap-8 items-center',
      'bg-[rgba(15,118,110,0.03)] border border-border-default',
      'min-h-[240px]',
      className
    )}
    aria-label="AI Brief"
    {...props}
  >
    {/* Left — 60% */}
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Good morning, {userName}
        </h1>
        <p className="mt-1 text-base text-text-secondary max-w-lg">{summary}</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {primaryCta && (
          <Button size="md" variant="primary" onClick={primaryCta.onClick}>
            {primaryCta.label}
          </Button>
        )}
        {secondaryCta && (
          <Button size="md" variant="secondary" onClick={secondaryCta.onClick}>
            {secondaryCta.label}
          </Button>
        )}
      </div>
    </div>

    {/* Right — 40% */}
    <div className="flex items-center gap-8 shrink-0">
      <div className="flex flex-col gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-xs text-text-secondary uppercase tracking-wide">{s.label}</span>
            <span className="text-xl font-semibold numeric text-text-primary">{s.value}</span>
          </div>
        ))}
      </div>
      <ConfidenceMeter score={confidenceScore} size={120} strokeWidth={7} />
    </div>
  </section>
)
