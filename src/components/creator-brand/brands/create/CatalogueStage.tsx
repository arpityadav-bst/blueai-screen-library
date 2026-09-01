'use client'

import { useEffect, useMemo, useState } from 'react'
import { CAMPAIGN_TYPES } from './campaignCatalog'
import { FAMILIES, type CampaignType, type Family } from './campaignSpec'

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
//
// 3. THE FAMILIES ARE A SIDEBAR, NOT FOUR HEADINGS DOWN THE PAGE (Appy, 2026-09-01). Stacked labels
//    made the page a scroll: four headings, nine cards, and no way to see only the two campaigns you
//    came for. As a filter the same four words become a control - "All" first, every card on the
//    right, and one click narrows it. It also fixes a quieter problem, that a heading and its cards
//    scroll apart, so by the third group a reader is looking at tiles with the label off-screen.
//    Selecting a family drops the headings entirely: the sidebar IS the label, and repeating it over
//    the grid would be the same word twice on one screen.

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

// 'all' is not a Family, deliberately: it is the absence of a filter, and giving it a place in the
// Family union would put it in every switch that means "which of the four".
type Tab = Family | 'all'

export default function CatalogueStage({ onPick }: { onPick: (id: string) => void }) {
  const [active, setActive] = useState<Tab>('all')

  // Counts come from the catalogue, not from a written-down number - the tabs cannot disagree with
  // the grid, and a tenth campaign appears in both without an edit here.
  const TABS = useMemo(
    () => [
      { key: 'all' as Tab, label: 'All', n: CAMPAIGN_TYPES.length },
      ...FAMILIES.map((f) => ({
        key: f as Tab,
        label: f,
        n: CAMPAIGN_TYPES.filter((t) => t.family === f).length,
      })),
    ],
    [],
  )

  const shown = active === 'all' ? CAMPAIGN_TYPES : CAMPAIGN_TYPES.filter((t) => t.family === active)

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

      {/* THE SPLIT STARTS HERE, below the question, its subtitle and the queue strip - those three
          are about the whole page and stay its full width. Everything that was one stacked grid is
          now sidebar + content.
          168/196px: the longest label, "Learn from real people", fits on one line at 12px mono in
          196px, and a filter list that wraps is a filter list you re-read every time. */}
      <div className="mt-8 grid gap-6 md:grid-cols-[168px_1fr] lg:grid-cols-[196px_1fr] lg:gap-8">
        {/* Sticky on desktop so the filter stays put while the cards scroll - which is most of the
            point of moving it out of the flow. Below md it is a horizontal strip of the same
            controls: a vertical sidebar on a phone is a column of buttons eating the fold. */}
        <nav
          aria-label="Campaign category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:sticky md:top-6 md:mx-0 md:block md:space-y-0.5 md:self-start md:overflow-visible md:px-0 md:pb-0"
        >
          {TABS.map((tab) => {
            const on = tab.key === active
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                aria-current={on ? 'true' : undefined}
                className={`cb-mono flex flex-none items-center gap-2 whitespace-nowrap rounded-card px-3 py-2 text-[12px] transition-colors md:w-full md:flex-auto ${
                  on
                    ? 'bg-[rgba(var(--cb-accent-rgb),0.07)] font-semibold text-[var(--cb-accent)]'
                    : 'text-ink-muted hover:bg-[var(--cb-hover)] hover:text-ink-heading'
                }`}
              >
                <span className="md:flex-1 md:text-left">{tab.label}</span>
                {/* The count is the useful half of a filter label: it says whether narrowing to
                    this one leaves you two cards or nine, before you click it. */}
                <span className={on ? 'text-[rgba(var(--cb-accent-rgb),0.65)]' : 'text-[rgba(0,0,0,0.28)]'}>
                  {tab.n}
                </span>
              </button>
            )
          })}
        </nav>

        <div>
          {/* NO GROUP HEADINGS. Under "All" the nine sit as one grid: the four words that used to
              head them are the sidebar now, and printing them again over the cards would be the
              same label twice on one screen. Two columns at lg rather than three - the sidebar took
              ~200px and three tracks in what is left makes each card too narrow for its one-liner. */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((type) => (
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

          <p className="cb-mono mt-6 text-[11px] text-ink-muted">
            Progress figures above are illustrative examples of how each campaign reports.
          </p>
        </div>
      </div>
    </section>
  )
}
