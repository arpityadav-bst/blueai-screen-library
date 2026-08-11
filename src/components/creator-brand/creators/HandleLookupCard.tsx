'use client'

import { useState } from 'react'
import { FieldError, withErr } from '../forms'
import { useCBModal } from '../ModalHost'

// YouTube is the only live platform right now, so there's nothing to pick — no tab row needed.
const PLATFORM_LABEL = 'YouTube'

// THE INPUT NEVER CHANGES (designer, 2026-08-11). This component used to be a three-state machine:
// it swapped itself for a scanning card and then for the result, so the field the reader had just
// typed into disappeared, the hero's height jumped twice, and trying a second handle meant
// reloading the page. Every state after submit now lives in a dialog (LookupFlow.tsx) and this
// stays exactly as it is, always — which is also why it no longer holds the scan timer, the mode,
// or the estimate. It collects a handle and hands it over.
export default function HandleLookupCard() {
  const { open } = useCBModal()
  const [handle, setHandle] = useState('')
  const [touched, setTouched] = useState(false)

  const clean = handle.trim().replace(/^@/, '')
  // Only two ways to get this wrong, and neither is worth a regex: empty, or so short it can't be
  // a channel. A stricter rule would start rejecting real handles.
  const error = !clean ? 'Enter your channel handle.' : clean.length < 2 ? 'That looks too short to be a handle.' : undefined
  const err = touched && error ? error : undefined

  return (
    <div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (error) return
          open('lookup', { handle: clean })
        }}
        // cb-field owns border colour + hover + focus + placeholder (creator-brand.css). The
        // border-colour utility and `focus-within:border-iris` are gone from here on purpose —
        // see that rule for why focus is neutral rather than brand-purple. withErr layers the
        // danger border on top; it wins on source order.
        className={withErr('cb-field shadow-hairline flex items-stretch rounded-pill border bg-white pl-4', err)}
      >
        {/* The @ is a prefix affix, not content — it should sit at placeholder weight while the
            field is empty and not compete with what gets typed after it. */}
        <span className="cb-field-affix flex items-center text-[14px]">@</span>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="yourchannel"
          aria-label={`Your ${PLATFORM_LABEL} handle`}
          // No placeholder: utility here — cb-field sets it, and a utility would outrank it.
          className="w-full bg-transparent py-3.5 pl-1.5 pr-2 text-[14px] text-ink-heading outline-none"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-pill bg-cta-gradient px-6 text-[14px] font-semibold text-white shadow-cta transition-transform duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
        >
          See your earnings
        </button>
      </form>
      {/* Centred under a centred pill, same as the waitlist form's — a left-hung line under a
          centred control reads as belonging to the column rather than to the field. */}
      <div className="text-center">
        <FieldError>{err}</FieldError>
      </div>
    </div>
  )
}
