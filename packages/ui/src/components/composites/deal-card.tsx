/**
 * FundOS DealCard — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Card Variants § Deal Card
 *
 * Used in Discover grid view (~360px wide)
 */
import * as React from 'react'
import { cn } from '../lib/cn'
import { Card } from '../primitives/card'
import { Badge } from '../primitives/badge'
import { ProgressBar } from '../primitives/progress-bar'
import { Button } from '../primitives/button'

export interface DealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string
  name: string
  thesis: string
  stage: string
  location: string
  fundingProgress: number  // 0-100
  raisedAmount: string
  targetAmount: string
  confidenceScore: number
  minTicket: string
  aiNote?: string
  isLeadPresent?: boolean
  isVerified?: boolean
  onInvest?: () => void
  onTrack?: () => void
}

export const DealCard: React.FC<DealCardProps> = ({
  logo, name, thesis, stage, location,
  fundingProgress, raisedAmount, targetAmount,
  confidenceScore, minTicket, aiNote,
  isLeadPresent, isVerified,
  onInvest, onTrack,
  className,
  ...props
}) => (
  <Card
    interactive
    className={cn('flex flex-col gap-4 w-full max-w-[360px]', className)}
    {...props}
  >
    {/* Header */}
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-[14px] bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
        {logo
          ? <img src={logo} alt={name} className="w-full h-full object-cover" />
          : <span className="text-sm font-bold text-text-secondary">{name[0]}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-text-primary truncate">{name}</h3>
        <p className="text-sm text-text-secondary line-clamp-2">{thesis}</p>
      </div>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-1.5">
      {isVerified && <Badge variant="verified">Verified</Badge>}
      {isLeadPresent && <Badge variant="lead">Lead present</Badge>}
      <Badge variant="outline">{stage}</Badge>
      <Badge variant="outline">{location}</Badge>
    </div>

    {/* Progress */}
    <div className="flex flex-col gap-1.5">
      <ProgressBar value={fundingProgress} showLabel />
      <div className="flex justify-between text-xs text-text-secondary numeric">
        <span>{raisedAmount} raised</span>
        <span>Target: {targetAmount}</span>
      </div>
    </div>

    {/* Confidence */}
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">Min ticket: <span className="font-medium text-text-primary numeric">{minTicket}</span></span>
      <Badge
        variant={confidenceScore >= 80 ? 'strong' : confidenceScore >= 50 ? 'medium' : 'low'}
      >
        {confidenceScore}/100
      </Badge>
    </div>

    {/* AI Note */}
    {aiNote && (
      <div className="bg-wash-primary border border-border-default rounded-md px-3 py-2">
        <p className="text-xs text-text-secondary">✨ {aiNote}</p>
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2 pt-1">
      <Button size="sm" variant="primary" className="flex-1" onClick={onInvest}>Invest</Button>
      <Button size="sm" variant="ghost" onClick={onTrack}>Track</Button>
    </div>
  </Card>
)
