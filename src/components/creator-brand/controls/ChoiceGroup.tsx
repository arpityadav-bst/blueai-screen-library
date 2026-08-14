'use client'

import type { ReactNode } from 'react'
import { TickIcon } from './choiceIcons'
import { LABEL } from './fieldClasses'
import { FieldError } from '../forms'

// SINGLE-select options, in two shapes.
//
// THE BUG THIS REPLACES (designer, 2026-08-13): every option reserved a fixed-width slot for a
// checkmark that only rendered once selected, so an unselected row showed a hole where its glyph
// wasn't. Across a whole form that reads as a mis-indent, not as a control. It was reserved for a real
// reason — without it, selecting a chip widened it and shuffled its neighbours — so the fix is not to
// delete the slot but to stop the layout depending on the mark at all:
//
//   `cards`  keep a permanent left mass (an icon that is always there) and move the tick to an
//            ABSOLUTELY positioned corner badge. Selected differs by colour, and nothing reflows.
//   `chips`  drop the mark entirely. Colour already says "on" unambiguously — border, fill and ink
//            all change — so a tick was a second signal for one state, paid for with a permanent
//            hole in the other. Hierarchy carried by colour does not also need to be carried by
//            layout.
//
// WHICH SHAPE WHERE is a judgement about the question, not the option count: `cards` when the choice
// deserves to be looked at (who you are, which machine you run) and `chips` for the small factual
// ones (yes/no, how much RAM) where a card row would inflate three words into a wall.
//
// STATES ARE EXPLICIT AND ALL FOUR EXIST — rest, hover, focus-visible, selected. The rest state used
// to be the only one with any thought in it. Hover moves the border and the surface but never the
// fill's hue, so hovering an unselected option can't be mistaken for having chosen it; focus is a ring
// forwarded from the sr-only input, since without it the group is keyboard-operable but invisibly so.
// ONE SELECTED COLOUR, AND IT IS NOT THE GRADIENT (designer, 2026-08-13). The corner badge used
// bg-bai-gradient while CheckField's box used solid iris, so two controls in one form said "chosen" in
// two different colours. The gradient was also the wrong one of the two on its own terms: this site
// reserves it for things you PRESS (see the 2026-08-11 "selected is not a CTA" correction that took it
// off the campaign form's filter chips), and a selection mark is a value, not an action.
//
// Iris solid is what every other selection on the site already uses — the chips here, SelectField's
// tick, DateField's chosen day, PricingTable's highlight. Note this is deliberately NOT --cb-accent:
// that token is the site's LINK accent (footer cross-link, header CTA hover) and moving the whole
// selection family onto it is a separate, larger decision that reaches into the brands form too.
const SELECTED_BORDER = 'rgba(var(--cb-accent-rgb),0.38)'
const SELECTED_WASH = 'rgba(var(--cb-accent-rgb),0.07)'
const SELECTED_SOLID = 'var(--cb-accent)'

// A yes/no answer is not a neutral pick between two equal things, and painting both in the same iris
// hid that. Affirm reads green and deny reads red — the pattern blueai-desktop uses for its own ok /
// danger roles (referenced, not copied: that product's tokens are .drawer-scoped with different values,
// and assuming a --bai-* name means the same thing in both is a documented trap). These are OUR DS's
// status tokens, which already ship a soft fill and an ink for exactly this.
//
// The tone shows at REST too, on the icon alone. Waiting until selection would mean the colour only
// appears once you no longer need it to tell the options apart.
export type Tone = 'ok' | 'danger'
export type Choice = { value: string; icon?: ReactNode; hint?: string; tone?: Tone }

const TONE = {
  ok: {
    idle: 'text-status-success',
    on: 'border-status-success bg-status-success-soft text-status-success-ink',
    mark: 'bg-status-success',
  },
  danger: {
    idle: 'text-status-danger',
    on: 'border-status-danger bg-status-danger-soft text-status-danger-ink',
    mark: 'bg-status-danger',
  },
} as const

export default function ChoiceGroup({
  label,
  hint,
  name,
  value,
  options,
  onChange,
  err,
  variant = 'chips',
  columns = 2,
}: {
  label: string
  /** Sits under the options, and gives way to the error rather than stacking with it. */
  hint?: string
  /** Must be unique on the page — it's the radio group's identity, not a display string. */
  name: string
  value: string
  options: readonly (string | Choice)[]
  onChange: (v: string) => void
  err?: string
  variant?: 'cards' | 'chips'
  /** cards only. */
  columns?: 2 | 3
}) {
  const items: Choice[] = options.map((o) => (typeof o === 'string' ? { value: o } : o))

  return (
    // A fieldset rather than a div, so the group carries ONE accessible name instead of the reader
    // meeting four unrelated radios with no idea what question they answer.
    <fieldset>
      <legend className={LABEL}>{label}</legend>

      <div
        className={
          variant === 'cards'
            // One column below sm. At 320 the form card leaves ~224px, so a 2-up card is ~106px wide
            // against p-3.5 padding, a 13px label, an 11px hint and an absolutely-positioned tick at
            // right-2 — labels wrapped to three lines and ran under the tick.
            ? `mt-2.5 grid gap-2.5 ${columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`
            : 'mt-2.5 flex flex-wrap gap-2'
        }
      >
        {items.map((o, i) => {
          const on = o.value === value
          const t = o.tone ? TONE[o.tone] : null
          // A toned option paints itself; an untoned one falls back to the shared iris selection.
          const onCls = t ? t.on : 'text-[var(--cb-accent)]'
          const onStyle = on && !t ? { borderColor: SELECTED_BORDER, background: SELECTED_WASH } : undefined
          const iconCls = on ? (t ? '' : 'text-[var(--cb-accent)]') : t ? t.idle : 'text-ink-muted'
          // An odd number of cards leaves the last one alone in a half-empty row. Spanning it is the
          // difference between a grid and a grid with a hole in it, and it costs nothing.
          //
          // columns={3} (added 2026-08-13, apply/Steps.tsx's five-option describes question) renders
          // grid-cols-2 below sm — so the SAME odd-count-leaves-a-gap problem shows up there too, just
          // at 2 columns instead of 3. sm:col-span-1 cancels the span back off at the desktop
          // breakpoint, where columns={3} means a lone last item sits in a normal partial row (2 of 3
          // filled) that needs no spanning at all.
          const lastOdd = variant === 'cards' && items.length % 2 === 1 && i === items.length - 1
          const wide = lastOdd && columns !== 3
          return (
            // The radio is sr-only so the control keeps its semantics — one answer per group, arrow
            // keys for free — while the paint is ours. `peer` is what forwards its focus ring out.
            <label
              key={o.value}
              className={`relative cursor-pointer select-none ${
                wide ? 'col-span-2' : lastOdd && columns === 3 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={on}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />

              {variant === 'cards' ? (
                <span
                  style={onStyle}
                  className={`flex h-full flex-col items-start gap-2 rounded-field border p-3.5 transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2 ${
                    on
                      ? onCls
                      : err
                        ? 'border-status-danger bg-white text-ink-body-2'
                        : 'border-divider bg-white text-ink-body-2 hover:-translate-y-px hover:border-stroke-warm hover:bg-surface hover:shadow-hairline'
                  }`}
                >
                  <span className={iconCls}>{o.icon}</span>
                  <span className="text-[13px] font-medium leading-snug">{o.value}</span>
                  {o.hint && <span className="text-[11px] leading-snug text-ink-muted">{o.hint}</span>}

                  {/* ABSOLUTE, so it costs no layout — the whole reason cards can carry a tick and
                      chips can't afford one. Same fill, size and glyph as CheckField's box; ROUND
                      rather than square only because these are radios and that box is a checkbox,
                      which is the one shape difference that carries meaning. */}
                  {on && (
                    <span
                      style={t ? undefined : { background: SELECTED_SOLID }}
                      className={`absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-circle text-white ${t ? t.mark : ''}`}
                    >
                      <TickIcon size={11} />
                    </span>
                  )}
                </span>
              ) : (
                <span
                  style={onStyle}
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-card border px-3.5 py-3 text-[13px] transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2 ${
                    on
                      ? `font-semibold ${onCls}`
                      : err
                        ? 'border-status-danger bg-white font-medium text-ink-body-2'
                        : 'border-divider bg-white font-medium text-ink-muted hover:border-stroke-warm hover:bg-surface hover:text-ink-body-2'
                  }`}
                >
                  {o.icon && <span className={iconCls}>{o.icon}</span>}
                  {o.value}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {/* ALWAYS ONE SLOT, NEVER ZERO (designer, 2026-08-13) — a group with no hint and no error used to
          render nothing at all here, so an error appearing added a brand new line rather than filling
          an already-reserved one, and the whole card grew under it. FieldError with no children is
          exactly that reserved-but-invisible line (see forms.tsx) — using it as the fallback here
          means every group, hinted or not, holds the same space open whether or not anything currently
          needs it.
          THE HINT NOW SHARES FIELDERROR'S EXACT BOX (fixed 2026-08-13) — it used to be its own
          `mt-2` span with no explicit line-height, which put it at a genuinely DIFFERENT height than
          FieldError's `mt-1.5 min-h-[15px] leading-snug` box. A group with a hint (PayPal) was
          therefore taller at rest than it became once its own error replaced the hint — so submitting
          with it unanswered visibly SHRANK the card instead of leaving it the same size. Same margin,
          same min-height, same leading now, so swapping hint for error changes the colour and the
          words, not the box. */}
      {err ? <FieldError>{err}</FieldError> : hint ? (
        <span className="mt-1.5 block min-h-[15px] text-[11px] leading-snug text-ink-muted">{hint}</span>
      ) : (
        <FieldError />
      )}
    </fieldset>
  )
}
