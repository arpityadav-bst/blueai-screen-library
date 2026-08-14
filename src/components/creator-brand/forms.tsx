import type { ReactNode } from 'react'

// Shared validation UI for every form on this site — the campaign form's nine fields, the two
// waitlist emails, the handle lookup, and the manual-details fallback. One place, so "what an
// invalid field looks like" can't be answered four different ways.
//
// THE ERRORS ARE DELIBERATELY QUIET. A red border plus one line of 11px text, and no icon-heavy
// alert box: these fields fail for boring reasons (empty, or not a link, or not an email) and the
// fix is always "type the right thing in the field you're already looking at". The border does the
// locating and the line does the explaining.
//
// WHEN they show matters more than how they look, so the rule is the same everywhere:
//   · never while first typing — a "that's not an email" the moment you type "a" is noise
//   · on blur, once a field has been touched
//   · on advance/submit, for every field at once, so nothing is hidden behind a dead button
// This is why no CTA on this site is disabled-until-valid any more. A greyed-out button states
// that something is wrong and refuses to say what; an enabled button that answers on click is the
// same guard with the reason attached.

export type Errors = Record<string, string | undefined>

/** A field is only in error once it's been touched, or once a submit has forced the issue. */
export function showErr(errors: Errors, touched: Record<string, boolean>, forced: boolean, key: string) {
  return (touched[key] || forced) && !!errors[key] ? errors[key] : undefined
}

export function FieldError({ children, dark = false }: { children?: string; dark?: boolean }) {
  // SPACE RESERVED WHETHER OR NOT THERE'S A MESSAGE (designer, 2026-08-13) — this used to return null
  // when empty, so a field's real height was shorter with no error than with one. An error appearing
  // therefore pushed everything below it down by its own height, on every field on the page at once —
  // which on this form's fixed-height card read as the whole card visibly resizing the moment you blurred
  // a field, not as a small in-place message. The line's box now always exists at the same height; an
  // error swaps an invisible placeholder for visible red text IN that box instead of inserting a new one.
  // role/aria-hidden stay conditional so an empty slot is neither announced nor exposed as an alert.
  return (
    <span
      role={children ? 'alert' : undefined}
      aria-hidden={!children}
      className={`mt-1.5 block min-h-[15px] text-[11px] font-medium leading-snug ${
        children ? (dark ? 'cb-err-dark' : 'text-status-danger') : 'invisible'
      }`}
    >
      {children || ' '}
    </span>
  )
}

/**
 * Appends the error border class when a field is invalid. .cb-field-error is declared AFTER the
 * three .cb-field* variants in creator-brand.css, which is what lets a single class beat their
 * rest AND hover borders — same specificity, later wins.
 */
export function withErr(base: string, err: string | undefined, dark = false) {
  if (!err) return base
  return `${base} ${dark ? 'cb-field-error-dark' : 'cb-field-error'}`
}

/** Small helper so every label in the forms below reads the same. */
export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="text-[12px] font-medium text-ink-muted">
      {children}
      {optional && <span className="font-normal"> (optional)</span>}
    </span>
  )
}

// The validators themselves. Kept here rather than beside each form because two of them (email,
// required) are used by three different forms, and a second copy of "what counts as an email" is
// how two forms start disagreeing about it.
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v.trim())
export const isPositive = (v: string) => Number(v) > 0
