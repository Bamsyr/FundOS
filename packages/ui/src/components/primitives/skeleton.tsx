/**
 * FundOS Skeleton — Primitive
 * Source: FRONTEND_DESIGN_SYSTEM.md § Micro-Interactions § Skeleton Shimmer
 */
import * as React from 'react'
import { cn } from '../lib/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay stagger in ms for cascaded skeletons */
  delay?: number
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, delay, style, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('skeleton', className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

/** Convenience: KPI card skeleton */
export const KpiCardSkeleton = () => (
  <div className="rounded-lg border border-border-default p-6 flex flex-col gap-3">
    <Skeleton className="h-3 w-24 rounded" />
    <Skeleton className="h-8 w-32 rounded" delay={100} />
    <Skeleton className="h-3 w-16 rounded" delay={200} />
  </div>
)

/** Convenience: Deal card skeleton */
export const DealCardSkeleton = () => (
  <div className="rounded-lg border border-border-default p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-[14px]" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-28 rounded" delay={50} />
        <Skeleton className="h-3 w-20 rounded" delay={100} />
      </div>
    </div>
    <Skeleton className="h-1.5 w-full rounded-full" delay={150} />
    <div className="flex gap-2">
      {[0,1,2].map(i => <Skeleton key={i} className="h-6 w-16 rounded-full" delay={200 + i * 50} />)}
    </div>
    <Skeleton className="h-10 w-full rounded-md" delay={350} />
  </div>
)
