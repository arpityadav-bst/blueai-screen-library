'use client'

import { useEffect, useState } from 'react'
import { CAMPAIGN_TYPES } from './campaignCatalog'
import { FAMILIES, type CampaignType } from './campaignSpec'

// STAGE 1 - the catalogue. Two things make this the agentic version of the dev prototype's picker,
// and both come straight out of the 2026-08-25 research rather than from taste:
//
// 1. NO ILLUSTRATION. The source renders a campaign-art/<id>.jpg on every tile. Our own research
//    named that exact move as the reason the site reads like 2021 - "we demonstrate the product
//    with a cartoon" - and swap #3 is `illustration -> real UI, cropped by the fold`. So each card
//    carries a fragment of what this campaign LOOKS LIKE once it is running: the type's own unit,
//    counting up, in mono, over a real progress bar. A brand choosing between nine campaigns is
//    choosing between nine dashboards, and this shows them nine dashboards.
//
// 2. A WORK QUEUE, NOT AN ADJECTIVE. Swap #4: proof of autonomy is state, not copy. The strip under
//    the heading reports what this agency actually has in flight, read from the same localStorage
//    the dashboard uses - so it is the reader's own number, not a decoration. With nothing in
//    flight it says so plainly instead of hiding.
//
// The samples are illustrative and marked as such on the card, because a number that looks live and
// isn't is the one thing this pattern can get badly wrong.

const MY_KEY = 'cb-my-campaigns'

function useInReviewCount() {
  // 0 until mounted, always: reading storage during render makes the server HTML and the first
  // client render disagree. Same rule as CrxState and BrandSession.
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(MY_KEY) || '[]')
      setN(Array.isArray(raw) ? raw.length : 0)
    } catch {
      setN(0)
    }
  }, [])
  return n
}

function QueueStrip() {
  const inReview = useInReviewCount()
  return (
    <div className="cb-mono mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-field border border-divider bg-white px-4 py-3 text-[12px] text-ink-muted">
      {/* The counts a brand can actually verify against its own dashboard. Running and checked are
          honest zeroes in a design-only build: nothing here is executing, and inventing a "1,284
          results checked" would be the adjective this strip exists to replace. */}
      <span>
        <b className="text-ink-heading">{inReview === null ? '—' : inReview}</b> in review
      </span>
      <span>
        <b className="text-ink-heading">0</b> running
      </span>
      <span>
        <b className="text-ink-heading">0</b> results checked
      </span>
      <span className="ml-auto">
        {CAMPAIGN_TYPES.length} campaigns · {FAMILIES.length} outcomes
      </span>
    </div>
  )
}

// The product fragment. A bar plus one mono line in the type's OWN unit - "38 of 50 surviving
// comments" for a Reddit campaign, "212 of 500 checked views" for a boost - which is the whole
// argument for per-type data made visible at the moment of choosing.
function SampleReadout({ type }: { type: CampaignType }) {
  const pct = Math.max(2, Math.min(100, Math.round((type.sample.done / type.sample.target) * 100)))
  return (
    <div className="mt-4">
      <div className="h-1 w-full overflow-hidden rounded-pill bg-[var(--cb-track)]">
        <span className="block h-full rounded-pill bg-[var(--cb-accent)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="cb-mono mt-2 text-[11.5px] text-ink-muted">
        <b className="font-semibold text-ink-heading">
          {type.sample.done} of {type.sample.target}
        </b>{' '}
        {type.outcome.unit} · {type.sample.note}
      </p>
    </div>
  )
}

export default function CatalogueStage({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section>
      {/* SMALL AND FLUSH LEFT (swap #2). The dev page centres a 34px headline over the grid; the
          references put a modest two-line heading at the left margin and let the product carry the
          weight. The question itself is unchanged - it is the right question. */}
      <h1 className="font-head text-[26px] font-bold leading-tight text-ink-display sm:text-[30px]">
        What do you want to happen?
      </h1>
      <p className="bai-body-sm mt-2 max-w-[62ch] text-ink-body-2">
        Pick a campaign. Real community members do the work on their own accounts, and you pay only
        for results that are checked.
      </p>

      <QueueStrip />

      {FAMILIES.map((family) => {
        const types = CAMPAIGN_TYPES.filter((t) => t.family === family)
        return (
          <div key={family} className="mt-10">
            {/* Family label in mono small-caps: it is a category machine-side, not a headline, and
                swap #7 puts mono on exactly this kind of label. */}
            <h2 className="cb-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {family}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onPick(type.id)}
                  className="group flex flex-col rounded-field border border-divider bg-white p-4 text-left transition-colors hover:border-[var(--cb-accent)]"
                >
                  <span className="text-[15px] font-semibold text-ink-heading">{type.name}</span>
                  <span className="bai-body-sm mt-1 text-ink-body-2">{type.one}</span>
                  {/* mt-auto so the readouts line up across a row whose one-liners wrap to
                      different heights - the bars are being compared, so they have to share a
                      baseline. */}
                  <span className="mt-auto block">
                    <SampleReadout type={type} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <p className="cb-mono mt-10 text-[11px] text-ink-muted">
        Progress figures above are illustrative examples of how each campaign reports.
      </p>
    </section>
  )
}
