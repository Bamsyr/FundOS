/**
 * FundOS Stepper — Composite
 * Source: FRONTEND_DESIGN_SYSTEM.md § Page 2 § Onboarding Stepper
 *
 * Horizontal dot-line stepper with progress bar
 * States per dot: completed (teal filled) | current (teal, pulse ring) | upcoming (gray outline)
 */
import * as React from 'react'
import { cn } from '../lib/cn'
import { ProgressBar } from '../primitives/progress-bar'

export interface StepperStep {
  id: string
  label: string
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number  // 0-indexed
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className={cn('flex flex-col gap-3', className)} aria-label="Progress steps">
      <ProgressBar value={progress} size="xs" animate />
      <div className="flex justify-between">
        {steps.map((step, i) => {
          const isDone    = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${i + 1}: ${step.label}${isDone ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  isDone    && 'bg-accent',
                  isCurrent && 'bg-accent ring-4 ring-accent/20',
                  !isDone && !isCurrent && 'bg-border-strong'
                )}
              />
              <span className={cn(
                'text-xs text-center hidden tablet:block',
                isCurrent ? 'text-text-primary font-medium' : 'text-text-secondary'
              )}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
