import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'

// Split out of Steps.tsx on 2026-08-13 to keep that file under this project's 300-line rule — pure
// extraction, no behaviour change.
//
// Shared long-text field. THREE rows now, not four (2026-08-13) — down from the original reasoning
// that four "invites a full answer" while three "reads as smaller than the answer it's asking for".
// That was true in isolation and it was never weighed against the fact that TWO of these sit on the
// same step: at four rows each, step 4 (two Longs + a chip question) ran to roughly 500px against
// steps 1-3's ~300px floor and step 5's ~390px — the step that changed the form's height the most,
// once the two spacing/layout bugs on the OTHER steps were fixed. Three rows still reads as an
// invitation to write a couple of sentences, not a single-line field; it does not cap what someone can
// type, only the box's resting size — the textarea still scrolls internally past three lines the same
// way it always scrolled past four.
//
// TWO LINES ON MOBILE, THREE AT sm+ (Appy, 2026-08-14) — the h-[78px] sm:h-auto pair below. Same
// budget as the rest of that day's mobile pass: the form card is a FIXED 480px below sm (see
// ApplyForm), and this textarea's third line was part of the ~33px its step ran over. The rows={3}
// attribute still sets the desktop resting size (sm:h-auto hands control back to it); on mobile the
// explicit height wins. 78px = two 26px lines of the mobile 16px/relaxed text plus py-3's 24px.
// The same truth as the three-vs-four paragraph above still holds one size further down: this caps
// the box's resting size, never the answer — it scrolls internally past two lines exactly as it
// always scrolled past three.
// Hover, focus and placeholder come from cb-field-strong, the same shell every text input on this site
// uses (controls/fieldClasses.ts).
export default function Long({
  label, value, onChange, onBlur, placeholder, err,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder: string
  err?: string
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={withErr(`${INPUT} h-[78px] resize-none py-3 leading-relaxed sm:h-auto`, err)}
      />
      <FieldError>{err}</FieldError>
    </label>
  )
}
