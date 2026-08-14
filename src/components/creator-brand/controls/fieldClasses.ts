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
// text-[16px] BELOW sm. iOS Safari zooms the whole page when you focus a field under 16px, and it
// does not zoom back out — inside a dialog that means the panel jumps and the reader loses their
// place mid-form. 14px is the designed size and is kept everywhere it is safe, i.e. everywhere that
// is not a phone. One change here covers every text input, textarea, select trigger and date trigger
// on both pages.
const FIELD = 'cb-field-strong w-full rounded-field border bg-white px-3.5 text-[16px] outline-none sm:text-[14px]'

// DARKER AND BOLDER, not lighter hints (designer, 2026-08-13). Labels and their hint text were both
// text-ink-muted, differing only by 1px of size and a weight step — nearly the same colour, which is
// why a label and the description under it read as one undifferentiated block. The fix is on the
// LABEL side deliberately: ink-muted is already ~9:1 on white at 11-12px, so making a HINT any lighter
// risks failing contrast at that size, while the label — the thing a reader's eye should find FIRST
// near a field — had room to go darker. ink-heading + semibold now makes it the strongest text next
// to a field, and hints (still ink-muted, unchanged) sit clearly quieter beneath it by comparison.
export const LABEL = 'text-[12px] font-semibold text-ink-heading'
export const INPUT = `mt-1.5 ${FIELD} py-3 text-ink-heading`
export const TRIGGER = `mt-1.5 ${FIELD} flex items-center gap-2.5 py-3 text-left`
