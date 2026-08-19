import type { ReactNode } from 'react'

// Validation UI for the /creators application — ported from creator-brand/forms.tsx, presentation
// swapped from Tailwind utilities to the .crx kit (creators.css flow-kit section). One place, so
// "what an invalid field looks like" can't be answered two different ways in this flow.
//
// THE ERRORS ARE DELIBERATELY QUIET (source file's rule, kept): a red border plus one small line —
// these fields fail for boring reasons (empty, not an email) and the fix is always "type the right
// thing in the field you're already looking at". The border does the locating, the line explains.
//
// WHEN they show matters more than how they look:
//   · never while first typing — a "that's not an email" the moment you type "a" is noise
//   · on blur, once a field has been touched
//   · on advance/submit, for every field at once, so nothing is hidden behind a dead button
// This is why no CTA here is disabled-until-valid: a greyed-out button states that something is
// wrong and refuses to say what; an enabled button that answers on click is the same guard with the
// reason attached.

export type Errors = Record<string, string | undefined>

/** A field is only in error once it's been touched, or once a submit has forced the issue. */
export function showErr(errors: Errors, touched: Record<string, boolean>, forced: boolean, key: string) {
  return (touched[key] || forced) && !!errors[key] ? errors[key] : undefined
}

export function FieldError({ children }: { children?: string }) {
  // SPACE RESERVED WHETHER OR NOT THERE'S A MESSAGE (designer, 2026-08-13, source: forms.tsx's
  // FieldError) — the line's box always exists at the same height, so an error appearing swaps an
  // invisible placeholder for red text IN that box instead of reflowing the card. The kit carries
  // the reservation itself: .crx-err has min-height and hides itself via :empty when there's no
  // message. role/aria-hidden stay conditional so an empty slot is neither announced nor an alert.
  return (
    <span role={children ? 'alert' : undefined} aria-hidden={!children} className="crx-err">
      {children || ''}
    </span>
  )
}

/**
 * Appends the kit's error class when a field is invalid. `.err` is declared AFTER the rest/hover
 * rules in creators.css (withErr's original contract, same mechanism): equal specificity, later
 * wins, so one class beats both the rest and hover borders.
 */
export function withErr(base: string, err: string | undefined) {
  if (!err) return base
  return `${base} err`
}

/** Small helper so every label in the flow reads the same. */
export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="crx-label">
      {children}
      {optional && <span className="crx-label-opt"> (optional)</span>}
    </span>
  )
}

// The validators themselves — kept together (source file's rule) because a second copy of "what
// counts as an email" is how two forms start disagreeing about it.
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v.trim())
export const isPositive = (v: string) => Number(v) > 0
