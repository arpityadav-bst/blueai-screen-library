// The field shells every form on this site shares — the campaign form's inputs, the manual-details
// fallback's, and the two custom controls in this folder. Lifted out of the campaign form's own
// spec.ts when the creators' manual-details form needed the same select: a control used by both
// audiences has no business living under brands/.
//
// cb-field-strong (creator-brand.css) owns border colour, hover, focus halo and placeholder for all
// of them, so nothing here declares a border colour or focus ring of its own — and the two CUSTOM
// controls therefore get the same hover/focus treatment as a real <input> rather than an
// approximation of it. .cb-field-error, applied on top via withErr(), beats all of that by source
// order when a field is invalid.
//
// px-3.5 both sides on purpose: at the previous px-3, a native <select>'s arrow sat visibly tighter
// to the right edge than the text was to the left. Symmetric padding with the chevron inside it is
// the fix, and every shell shares the value so the two can't drift.
const FIELD = 'cb-field-strong w-full rounded-field border bg-white px-3.5 text-[14px] outline-none'

export const LABEL = 'text-[12px] font-medium text-ink-muted'
export const INPUT = `mt-1.5 ${FIELD} py-3 text-ink-heading`
export const TRIGGER = `mt-1.5 ${FIELD} flex items-center gap-2.5 py-3 text-left`
