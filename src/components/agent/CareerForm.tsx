'use client'
import { useState } from 'react'
import { Arrow } from '@/components/Arrow'
import { Check } from '@/components/agent/glyphs'
import { FileUpload } from '@/components/agent/FileUpload'

// Faithful interactive replica of the live bluestacks.ai "Get your job matches" form.
// Design-only: submit is inert (preventDefault). Built on the shared .jmf-* form kit (agent.css).
const LOCATIONS = ['US', 'Remote', 'Global', 'Other']
const SENIORITY = ['Any', 'Internship', 'Entry level', 'Mid level', 'Senior', 'Lead / Staff', 'Director and above']

export function CareerForm() {
  const [locs, setLocs] = useState<string[]>(['US', 'Remote'])
  const toggle = (l: string) => setLocs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <div className="jmf-head">
        <h2 className="jmf-title">Get your job matches</h2>
        <p className="jmf-sub">Join the queue. The agent runs and emails you matching openings.</p>
      </div>

      <label className="jmf-field">
        <span className="jmf-lbl">Email</span>
        <input className="jmf-input" type="email" placeholder="you@email.com" />
      </label>

      <label className="jmf-field">
        <span className="jmf-lbl">Roles you want</span>
        <input className="jmf-input" type="text" placeholder="e.g. Senior Product Manager, Growth PM" />
      </label>

      <div className="jmf-field">
        <span className="jmf-lbl">Location</span>
        <div className="jmf-pills">
          {LOCATIONS.map((l) => {
            const on = locs.includes(l)
            return (
              <button type="button" key={l} className={`jmf-pill${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggle(l)}>
                {on && <Check />}{l}
              </button>
            )
          })}
        </div>
      </div>

      <label className="jmf-field">
        <span className="jmf-lbl">Seniority</span>
        <select className="jmf-input jmf-select" defaultValue="Any">
          {SENIORITY.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>

      <div className="jmf-field">
        <span className="jmf-lbl">Resume <span className="jmf-opt">(optional, improves matching)</span></span>
        <FileUpload accept=".pdf,.doc,.docx,image/*" />
      </div>

      <label className="jmf-agree">
        <input type="checkbox" />
        <span>I agree to let BlueStacks email me job matches and product updates. We never apply on your behalf without BlueAI running on your own device.</span>
      </label>

      <button type="submit" className="jmf-submit">Get my job matches<Arrow size={18} /></button>
    </form>
  )
}
