'use client'
import { useState } from 'react'
import { FileUpload } from '@/components/agent/FileUpload'
import { Field, TextField, SelectField, PillsField, FormHead, Agree, Submit } from '@/components/agent/form-kit'

// Faithful interactive replica of the live bluestacks.ai "Get your job matches" form.
// Design-only: submit is inert (preventDefault). Composes the form-kit molecules (.jmf-* atoms).
const LOCATIONS = ['US', 'Remote', 'Global', 'Other']
const SENIORITY = ['Any', 'Internship', 'Entry level', 'Mid level', 'Senior', 'Lead / Staff', 'Director and above']

export function CareerForm() {
  const [locs, setLocs] = useState<string[]>(['US', 'Remote'])
  const toggle = (l: string) => setLocs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <FormHead title="Get your job matches" sub="Join the queue. The agent runs and emails you matching openings." />
      <TextField label="Email" type="email" placeholder="you@email.com" />
      <TextField label="Roles you want" placeholder="e.g. Senior Product Manager, Growth PM" />
      <PillsField label="Location" options={LOCATIONS} value={locs} onToggle={toggle} />
      <SelectField label="Seniority" options={SENIORITY} defaultValue="Any" />
      <Field label="Resume" optional="optional, improves matching">
        <FileUpload accept=".pdf,.doc,.docx,image/*" />
      </Field>
      <Agree>I agree to let BlueStacks email me job matches and product updates. We never apply on your behalf without BlueAI running on your own device.</Agree>
      <Submit>Get my job matches</Submit>
    </form>
  )
}
