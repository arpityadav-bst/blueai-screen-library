import { INPUT, LABEL } from './controls'
import { FieldError, withErr } from './forms'

// Shared long-text field — ported from creator-brand/creators/apply/Long.tsx; the kit's .crx-field
// carries the shell (border, hover, focus halo, placeholder), same as every text input in the flow.
//
// THREE rows, not four (source, 2026-08-13): four "invites a full answer" but two of these sit on
// the same step, and at four rows each that step ran ~200px past its siblings. Three still reads as
// an invitation to write a couple of sentences, not a single-line field — it caps the box's RESTING
// size, never the answer; the textarea scrolls internally past three lines. (The source's extra
// mobile two-line cap was tuned against the light build's fixed 480px card and is not ported — this
// page has one 880px breakpoint and no fixed-height card contract yet; re-tune at the gate if one
// lands.)
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
    <label className="crx-ctl">
      <span className={LABEL}>{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        // crx-area: resize:none + relaxed leading — see the missing-styles report.
        className={withErr(`${INPUT} crx-area`, err)}
      />
      <FieldError>{err}</FieldError>
    </label>
  )
}
