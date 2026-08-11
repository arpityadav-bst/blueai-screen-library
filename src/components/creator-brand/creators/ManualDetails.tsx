'use client'

import { useState } from 'react'
import SelectField from '../controls/SelectField'
import { INPUT, LABEL } from '../controls/fieldClasses'
import { FieldError, withErr } from '../forms'
import { CATEGORIES } from './estimate'

// The fallback path: BlueAI couldn't read the channel, so it asks. Reachable from the state
// toggler (bottom-left, creators only) because this is a design-handoff replica — there's no real
// YouTube API behind the lookup to fail on its own, and a state nobody can reach is a state nobody
// reviews.
//
// TWO FIELDS, not five. Everything the estimate actually needs is the subscriber count; the
// category feeds MATCHING, not the rate (see estimateFromManual). Asking for anything else here
// would be asking a creator to do the work the product just failed to do.
export default function ManualDetails({
  handleLabel,
  onSubmit,
}: {
  handleLabel: string
  onSubmit: (followers: number, category: string) => void
}) {
  const [subs, setSubs] = useState('')
  const [category, setCategory] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [forced, setForced] = useState(false)

  const errors = {
    subs: !subs.trim()
      ? 'Enter your subscriber count.'
      : Number(subs) <= 0
        ? 'That needs to be a number above zero.'
        : undefined,
    category: !category ? 'Pick the closest match.' : undefined,
  }
  const show = (k: 'subs' | 'category') => ((touched[k] || forced) && errors[k]) || undefined

  return (
    <>
      <div className="border-b border-divider px-6 py-5 pr-12 sm:px-7 sm:pr-14">
        {/* Names what failed and what happens next, in that order. "Something went wrong" would
            leave the reader deciding whether the form below is a punishment or a fix. */}
        <h2 className="font-head text-[19px] font-bold text-ink-display">
          We couldn&apos;t read {handleLabel} automatically.
        </h2>
        <p className="mt-1.5 text-[13.5px] text-ink-body-2">
          Two details and we can still show you the estimate. Nothing here is stored — it&apos;s only
          used to work out the number.
        </p>
      </div>

      <form
        noValidate
        className="px-6 py-6 sm:px-7"
        onSubmit={(e) => {
          e.preventDefault()
          if (errors.subs || errors.category) {
            setForced(true)
            return
          }
          onSubmit(Number(subs), category)
        }}
      >
        <label className="block">
          <span className={LABEL}>Subscribers</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={subs}
            onChange={(e) => setSubs(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, subs: true }))}
            placeholder="12500"
            className={withErr(`${INPUT} cb-nospin cb-tabular`, show('subs'))}
          />
          {show('subs') ? (
            <FieldError>{show('subs')}</FieldError>
          ) : (
            <span className="mt-1.5 block text-[11px] text-ink-muted">A rough number is fine.</span>
          )}
        </label>

        <div className="mt-5">
          <SelectField
            label="What are your videos about?"
            value={category}
            options={CATEGORIES}
            placeholder="Pick a category"
            err={show('category')}
            onChange={(v) => {
              setTouched((p) => ({ ...p, category: true }))
              setCategory(v)
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-7 w-full rounded-pill bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
        >
          Show my estimate
        </button>
      </form>
    </>
  )
}
