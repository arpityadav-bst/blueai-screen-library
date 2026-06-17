'use client'

import { Button, IconButton } from '@/components/product/ui'

// AI Credits balance screen — ported from public/blueai-product/index.html
// (AICreditsScreen). Faithful re-skin onto the product DS kit + --bai-* utilities.
// Opens when the header credits pill is tapped. Card-less full-screen layout.

// Brand gradient (cyan→iris) for the big balance number. Tier-3 brand asset —
// kept inline per KEEP-AS-IS (not in the token map). Flagged in self-report.
const balanceGradient: React.CSSProperties = {
  background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

// Daily-spend-limit bar fill — brand gradient (cyan→accent). Kept inline (brand). Flagged.
const barFillGradient: React.CSSProperties = {
  background: 'linear-gradient(90deg,#0EA4C5,#1990FF)',
}

export interface AICreditsProps {
  credits?: number
  onRefresh?: () => void
}

export function AICredits({ credits = 45812, onRefresh }: AICreditsProps) {
  const balance = credits.toLocaleString('en-US')

  return (
    <div className="tab-anim flex flex-1 flex-col overflow-y-auto bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] pb-1 pt-4">
        <h1 className="text-h3 font-extrabold tracking-tight-3 text-ink-heading">AI Credits</h1>
        <IconButton label="Refresh" onClick={onRefresh}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
        </IconButton>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-center gap-3 pb-[34px] pt-10">
        <img
          src="/blueai-product/assets/Logo.png"
          alt=""
          className="h-11 w-11 shrink-0"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
        <span
          className="text-[54px] font-extrabold leading-none tracking-tight-2"
          style={balanceGradient}
        >
          {balance}
        </span>
      </div>

      {/* Daily spend limit */}
      <div className="px-[18px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-h5 font-semibold text-ink-muted">Daily Spend Limit</span>
          <span className="text-h5 font-semibold text-ink-muted">9/∞</span>
        </div>
        <div className="h-2 overflow-hidden rounded-pill bg-divider">
          <div className="h-full w-full rounded-pill" style={barFillGradient} />
        </div>
      </div>

      {/* Breakdown divider */}
      <div className="flex items-center gap-3 px-[18px] pb-2 pt-7">
        <div className="h-px flex-1 bg-divider" />
        <span className="text-2xs font-bold tracking-[0.08em] text-ink-muted">CREDIT BREAKDOWN</span>
        <div className="h-px flex-1 bg-divider" />
      </div>

      {/* Breakdown rows */}
      <div className="px-[18px]">
        <div className="flex items-center justify-between border-b border-divider py-[13px]">
          <div>
            <p className="text-h4 font-bold text-ink-heading">Prime</p>
            <p className="mt-0.5 text-sm text-ink-muted">Renews in 11 days</p>
          </div>
          <span className="text-h4 font-bold text-ink-heading">0</span>
        </div>
        <div className="flex items-center justify-between border-b border-divider py-[13px]">
          <p className="text-h4 font-bold text-ink-heading">Top-ups</p>
          <span className="text-h4 font-bold text-ink-heading">{balance}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-[18px] pb-6 pt-[22px]">
        <Button
          size="md"
          pill={false}
          className="w-full rounded-field py-3.5 text-h4 font-bold"
        >
          Top Up or Manage Credits
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default AICredits
