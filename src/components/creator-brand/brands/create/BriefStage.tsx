'use client'

import { reviewLabel, type CampaignType } from './campaignSpec'

// STAGE 2 - what this campaign actually is, before anyone is asked to fill anything in.
//
// The dev prototype gives this stage a large campaign-art image in a two-column layout. Same call
// as the catalogue: the image goes, and what replaces it is the thing a brand is really deciding
// between - the mechanism, the unit it pays for, and how much of the work goes out under its name
// without a human seeing it first.
//
// THE THREE STEPS ARE NUMBERED IN MONO because they are a sequence a machine runs, and the numbers
// are the one place a reader looks to count. Swap #7.

function StepList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="mt-3 space-y-3">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3">
          <span className="cb-mono mt-[1px] flex h-5 w-5 flex-none items-center justify-center rounded-full border border-divider text-[11px] font-semibold text-ink-muted">
            {i + 1}
          </span>
          <span className="bai-body-sm text-ink-body-2">{s}</span>
        </li>
      ))}
    </ol>
  )
}

// The money figures inside the worked example get the accent, so the arithmetic is scannable
// without the data carrying markup. `ex` is plain text in the catalogue (see campaignCatalog) and
// the emphasis is applied HERE, which is why a $-figure can change without touching a component.
function WorkedExample({ text }: { text: string }) {
  const parts = text.split(/(\$[\d,]+(?:\.\d+)?|\b[\d,]{3,}\b)/g)
  return (
    <p className="bai-body-sm text-ink-body-2">
      {parts.map((p, i) =>
        /^\$|^[\d,]{3,}$/.test(p) ? (
          <b key={i} className="cb-mono font-semibold text-[var(--cb-accent)]">
            {p}
          </b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-field border border-divider bg-white p-4">
      <p className="cb-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </p>
      <p className="bai-body-sm mt-1.5 text-ink-heading">{children}</p>
    </div>
  )
}

export default function BriefStage({
  type,
  onRun,
  onBack,
}: {
  type: CampaignType
  onRun: () => void
  onBack: () => void
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="cb-mono text-[12px] text-ink-muted transition-colors hover:text-ink-heading"
      >
        &lsaquo; All campaigns
      </button>

      <h1 className="mt-4 font-head text-[26px] font-bold leading-tight text-ink-display sm:text-[30px]">
        {type.name}
      </h1>
      <p className="bai-body-sm mt-2 max-w-[64ch] text-ink-body-2">{type.tag}</p>

      {/* THE THREE FACTS A BRAND IS ACTUALLY CHOOSING BETWEEN, up front and in one row: what it
          pays for, what it costs per result, and how much goes out unreviewed. On the source page
          the first two are buried in a pricing panel below the fold and the third only appears on
          the form, which means the decision is made before the deciding facts are on screen. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Fact label="You pay for">{type.outcome.unit}</Fact>
        <Fact label="Priced">
          {type.outcome.per > 1 ? `Per ${type.outcome.per.toLocaleString()} results` : 'Per result'}
        </Fact>
        <Fact label="Arrives on">{reviewLabel(type.review)}</Fact>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="cb-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            How it works
          </h2>
          <StepList steps={type.steps} />
        </div>

        <div className="rounded-field border border-divider bg-white p-5">
          <h2 className="cb-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            How you pay
          </h2>
          <p className="bai-body-sm mt-2 text-ink-body-2">
            You do not pay for time or promises. You place a bid, and you pay only when a result is
            checked and real.
          </p>
          {/* "Example" AS A LABEL, not as the first two words of nine data strings. The source
              prefixed every worked example with "Example: "; the prefix is the hedge that keeps an
              illustrative figure from reading as a quote, so it has to survive - but it belongs in
              the chrome, where it is written once and cannot go missing from one entry. */}
          <div className="mt-4 border-t border-divider pt-4">
            <p className="cb-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Example
            </p>
            <div className="mt-1.5">
              <WorkedExample text={type.ex} />
            </div>
          </div>
          {type.gen && (
            <p className="cb-mono mt-3 text-[11.5px] text-ink-muted">
              Second bid on this campaign: {type.gen.label.toLowerCase()}, out of the same budget.
            </p>
          )}
        </div>
      </div>

      {/* FLAT ACCENT, NO GRADIENT (swap #5). Every other primary on this site is bg-cta-gradient;
          this route is the one place we are testing the research's call that the gradient is a
          large part of why the site reads as 2021. Deliberate divergence, scoped to this flow. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRun}
          className="rounded-pill bg-[var(--cb-accent)] px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Run this campaign
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-pill border border-divider px-6 py-3 text-[15px] font-semibold text-ink-heading transition-colors hover:bg-[var(--cb-hover)]"
        >
          Pick a different one
        </button>
      </div>
    </section>
  )
}
