'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'
import CatalogueStage from './CatalogueStage'
import BriefStage from './BriefStage'
import SetupStage, { type SubmitPayload } from './SetupStage'
import { findType } from './campaignCatalog'
import { dashboardUrl, saveCampaign } from './saveCampaign'

// THE THREE-STAGE FLOW, ported from the dev prototype and re-cut to the 2026-08-25 agentic research
// (Appy, 2026-09-01: "if we had to make this screen again now with this learning").
//
// The stages themselves are the prototype's and they are RIGHT: choose an outcome, understand the
// mechanism, then set it up. What changed is everything the research named -
//   · the catalogue shows nine running dashboards instead of nine illustrations (swap #3)
//   · a real work queue replaces a claim about autonomy (swap #4)
//   · headings shrink and go flush left; the product carries the page (swap #2)
//   · one flat accent, no gradient anywhere in this flow (swap #5)
//   · mono for every count, unit, id and state (swap #7)
//   · the setup form answers back as you type it (swap #1: the surface starts the work)
// Each is argued at the point it is applied, in the stage that applies it.
//
// A TOOL TOPBAR, NOT THE SITE HEADER. This is a signed-in surface that hands off to the campaign
// dashboard, so it wears the dashboard's chrome - wordmark, breadcrumb, a way back - rather than the
// marketing header with its nav and Create a campaign CTA. A CTA to start the thing you are already
// doing is the kind of detail that makes a prototype feel unconsidered.

type Stage = 'pick' | 'brief' | 'setup'

const STEPS: readonly { s: Stage; n: string }[] = [
  { s: 'pick', n: 'Pick' },
  { s: 'brief', n: 'Understand' },
  { s: 'setup', n: 'Set up' },
]

function Topbar() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return (
    <header className="border-b border-divider bg-white">
      <div className="mx-auto flex max-w-content items-center gap-3 px-6 py-3.5">
        <Link href="/creator-brand/brands" className="flex items-center gap-2" aria-label="BlueAI home">
          <Wordmark size={17} />
        </Link>
        <span className="cb-mono text-[11.5px] text-ink-muted">
          <a href={`${base}/creator-brand/campaign-report.html`} className="transition-colors hover:text-ink-heading">
            Campaigns
          </a>{' '}
          &rsaquo; <b className="font-semibold text-ink-heading">New campaign</b>
        </span>
        <a
          href={`${base}/creator-brand/campaign-report.html`}
          className="ml-auto rounded-pill border border-divider px-3.5 py-2 text-[12px] font-semibold text-ink-heading transition-colors hover:bg-[var(--cb-hover)]"
        >
          Back to dashboard
        </a>
      </div>
    </header>
  )
}

// The machine's plan, stated. Three steps, the current one lit, the ones behind it walkable - a
// reader who can see how many steps remain does not have to guess whether the next click submits.
function Stepper({ stage, onJump }: { stage: Stage; onJump: (s: Stage) => void }) {
  const at = STEPS.findIndex((x) => x.s === stage)
  return (
    <ol className="cb-mono flex items-center gap-2 text-[11px]">
      {STEPS.map((step, i) => {
        const done = i < at
        const now = i === at
        return (
          <li key={step.s} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-ink-muted">·</span>}
            <button
              type="button"
              disabled={!done}
              onClick={() => onJump(step.s)}
              aria-current={now ? 'step' : undefined}
              className={`transition-colors ${
                now
                  ? 'font-semibold text-[var(--cb-accent)]'
                  : done
                    ? 'text-ink-muted hover:text-ink-heading'
                    : 'text-[rgba(0,0,0,0.22)]'
              }`}
            >
              {i + 1} {step.n}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default function CreateCampaignFlow() {
  const [stage, setStage] = useState<Stage>('pick')
  const [typeId, setTypeId] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)
  const type = findType(typeId)

  // Every stage change returns to the top. Stage 3 is a long form and stage 1 is a long grid; a
  // reader who advances from halfway down one lands halfway down the next without it.
  const go = useCallback((s: Stage) => {
    setStage(s)
    window.scrollTo(0, 0)
  }, [])

  const pick = useCallback(
    (id: string) => {
      setTypeId(id)
      go('brief')
    },
    [go],
  )

  const submit = useCallback(
    (p: SubmitPayload) => {
      if (!type) return
      const entry = saveCampaign(type, p)
      // Same cover-then-navigate as the sign-in flows, and the same reason: setting state and
      // assigning location in one tick never paints. Two rAFs so the cover is on screen in both
      // Chromium and WebKit before the dashboard starts loading.
      setLeaving(true)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.location.assign(dashboardUrl(entry))
        }),
      )
    },
    [type],
  )

  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="mx-auto max-w-content px-6 py-8 sm:py-10">
        <Stepper stage={stage} onJump={go} />
        <div className="mt-7">
          {stage === 'pick' || !type ? (
            <CatalogueStage onPick={pick} />
          ) : stage === 'brief' ? (
            <BriefStage type={type} onRun={() => go('setup')} onBack={() => go('pick')} />
          ) : (
            <SetupStage type={type} onBack={() => go('brief')} onSubmit={submit} />
          )}
        </div>
      </div>

      {leaving && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[140] flex flex-col items-center justify-center gap-3 bg-[rgba(249,249,250,0.92)]"
        >
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--cb-track)] border-t-[var(--cb-accent)]" />
          <span className="cb-mono text-[12px] text-ink-muted">Filing your campaign…</span>
        </div>
      )}
    </div>
  )
}
