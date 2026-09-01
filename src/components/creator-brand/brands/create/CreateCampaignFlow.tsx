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

// NO STEPPER (Appy, 2026-09-01: "we delete that breadcrumbs at the top... I don't want that"). It
// was a 1 Pick / 2 Understand / 3 Set up line above every stage, and it earned its removal: each
// stage already opens with the back link that walks it ("All campaigns", "About this campaign"),
// the topbar carries the Campaigns > New campaign crumb, and a three-item counter above a page that
// is never longer than three steps was telling the reader something the page itself already said.
// The stages are still a machine with a plan; that plan just does not need its own chrome.

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
        <div>
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
