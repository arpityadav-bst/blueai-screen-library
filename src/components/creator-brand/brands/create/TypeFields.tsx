'use client'

import SelectField from '../../controls/SelectField'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError } from '../../forms'
import type { TypeField } from './campaignSpec'

// THE PER-TYPE QUESTIONS. Nine campaigns ask nine different things - a post URL, a karma floor, a
// brief, a subreddit, how many pieces - so the setup form cannot be a fixed list of inputs. It
// renders whatever its chosen type declares, and the type is the only place that knows.
//
// Values are held as a flat Record<string, string | string[]> keyed by field.key, which is also the
// shape written to the dashboard entry. One shape from question to storage to report row: nothing
// has to be re-derived at the boundaries, and a field added to a type appears in all three.
//
// EVERY CONTROL IS THE SITE'S OWN. SelectField, INPUT/LABEL and FieldError come from the shared
// controls; the chip treatment is copied class-for-class from the campaign form's Actions row -
// 10% accent wash, accent ink, accent hairline, no gradient - because a second opinion about what
// a selected chip looks like is how two forms on one site start disagreeing.

export type FieldValues = Record<string, string | string[]>

const CHIP_BASE =
  'flex min-h-[44px] items-center gap-1.5 rounded-card border px-3.5 py-2.5 text-[12px] font-medium transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2'
const CHIP_ON = 'border-[rgba(var(--cb-accent-rgb),0.38)] bg-[rgba(var(--cb-accent-rgb),0.07)] text-[var(--cb-accent)]'
const CHIP_OFF = 'border-divider text-ink-muted hover:border-stroke-warm hover:text-ink-body-2'

function Hint({ children }: { children?: string }) {
  if (!children) return null
  return <span className="bai-caption mt-1.5 block text-ink-muted">{children}</span>
}

export default function TypeFields({
  fields,
  values,
  onChange,
  errors,
}: {
  fields: readonly TypeField[]
  values: FieldValues
  onChange: (key: string, v: string | string[]) => void
  errors: Record<string, string | undefined>
}) {
  return (
    <>
      {fields.map((f) => {
        const raw = values[f.key]
        const err = errors[f.key]

        if (f.kind === 'chips') {
          const on = Array.isArray(raw) ? raw : []
          return (
            // fieldset/legend rather than label: a group of checkboxes has no single control for a
            // label to point at, which is the same reason the campaign form's Actions row uses one.
            <fieldset key={f.key} className="mt-5">
              <legend className={LABEL}>{f.label}</legend>
              <Hint>{f.hint}</Hint>
              <div className="mt-2 flex flex-wrap gap-2">
                {(f.options ?? []).map((o) => {
                  const sel = on.includes(o)
                  return (
                    <label key={o} className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={() => onChange(f.key, sel ? on.filter((x) => x !== o) : [...on, o])}
                        className="peer sr-only"
                      />
                      <span className={`${CHIP_BASE} ${sel ? CHIP_ON : err ? 'border-status-danger text-ink-body-2' : CHIP_OFF}`}>
                        {o}
                      </span>
                    </label>
                  )
                })}
              </div>
              <FieldError>{err}</FieldError>
            </fieldset>
          )
        }

        if (f.kind === 'select') {
          return (
            <div key={f.key} className="mt-5">
              <SelectField
                label={f.label}
                value={typeof raw === 'string' ? raw : ''}
                options={[...(f.options ?? [])]}
                onChange={(v) => onChange(f.key, v)}
                placeholder={f.ph}
                err={err}
              />
              <Hint>{f.hint}</Hint>
            </div>
          )
        }

        if (f.kind === 'textarea') {
          return (
            <label key={f.key} className="mt-5 block">
              <span className={LABEL}>{f.label}</span>
              <textarea
                rows={3}
                value={typeof raw === 'string' ? raw : ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.ph}
                className={`${INPUT} resize-y`}
              />
              <Hint>{f.hint}</Hint>
              <FieldError>{err}</FieldError>
            </label>
          )
        }

        // text | number | filelink. FILELINK IS A LINK FIELD, not a file input: this build has
        // nowhere to put an upload, and a file picker that discards the file is a control that lies
        // about what it did. The source page kept a real <input type=file> and stored only its
        // name; a URL is the honest version of the same question and the placeholder says so.
        return (
          <label key={f.key} className="mt-5 block">
            <span className={LABEL}>{f.label}</span>
            <input
              type={f.kind === 'number' ? 'number' : 'text'}
              inputMode={f.kind === 'number' ? 'numeric' : undefined}
              min={f.kind === 'number' ? 0 : undefined}
              value={typeof raw === 'string' ? raw : ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.kind === 'filelink' ? `Paste a link ${f.ph ?? ''}`.trim() : f.ph}
              className={`${INPUT} ${f.kind === 'number' ? 'cb-nospin cb-tabular' : ''}`}
            />
            <Hint>{f.hint}</Hint>
            <FieldError>{err}</FieldError>
          </label>
        )
      })}
    </>
  )
}
