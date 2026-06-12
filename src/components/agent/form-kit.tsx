import { Arrow } from '@/components/Arrow'
import { Check } from '@/components/agent/glyphs'

// The .jmf form-kit MOLECULES — the label+control pairs and form chrome shared by all four
// agent demo forms (Career / Creator / Finance / Markets). Extracted so no form hand-repeats
// the markup: atoms are the .jmf-* styles in agent.css, these molecules compose them, the
// form components compose the molecules. Output is byte-identical to the previously inlined markup.

// Generic field — label + any control (upload, pills, custom). A <div> wrapper because the
// control may contain buttons; use TextField/TextAreaField/SelectField for native inputs.
export function Field({ label, optional, hint, children }: { label: string; optional?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="jmf-field">
      <span className="jmf-lbl">{label}{optional && <> <span className="jmf-opt">({optional})</span></>}</span>
      {children}
      {hint && <span className="jmf-hint">{hint}</span>}
    </div>
  )
}

export function TextField({ label, optional, type = 'text', placeholder }: { label: string; optional?: string; type?: string; placeholder?: string }) {
  return (
    <label className="jmf-field">
      <span className="jmf-lbl">{label}{optional && <> <span className="jmf-opt">({optional})</span></>}</span>
      <input className="jmf-input" type={type} placeholder={placeholder} />
    </label>
  )
}

export function TextAreaField({ label, placeholder, rows = 2 }: { label: string; placeholder?: string; rows?: number }) {
  return (
    <label className="jmf-field">
      <span className="jmf-lbl">{label}</span>
      <textarea className="jmf-input jmf-textarea" rows={rows} placeholder={placeholder} />
    </label>
  )
}

export function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="jmf-field">
      <span className="jmf-lbl">{label}</span>
      <select className="jmf-input jmf-select" defaultValue={defaultValue}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

// Pill choice field — multi-select (value: string[]) or single-select (value: string).
export function PillsField({ label, options, value, onToggle }: { label: string; options: string[]; value: string | string[]; onToggle: (option: string) => void }) {
  return (
    <div className="jmf-field">
      <span className="jmf-lbl">{label}</span>
      <div className="jmf-pills">
        {options.map((o) => {
          const on = Array.isArray(value) ? value.includes(o) : value === o
          return (
            <button type="button" key={o} className={`jmf-pill${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => onToggle(o)}>
              {on && <Check />}{o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Tabs<K extends string>({ tabs, value, onChange }: { tabs: [K, string][]; value: K; onChange: (k: K) => void }) {
  return (
    <div className="jmf-tabs">
      {tabs.map(([k, label]) => (
        <button type="button" key={k} aria-pressed={value === k} className={`jmf-tab${value === k ? ' is-on' : ''}`} onClick={() => onChange(k)}>{label}</button>
      ))}
    </div>
  )
}

export function FormHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="jmf-head">
      <h2 className="jmf-title">{title}</h2>
      <p className="jmf-sub">{sub}</p>
    </div>
  )
}

export function Agree({ children }: { children: React.ReactNode }) {
  return (
    <label className="jmf-agree">
      <input type="checkbox" />
      <span>{children}</span>
    </label>
  )
}

export function Submit({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="jmf-submit">{children}<Arrow size={18} /></button>
  )
}
