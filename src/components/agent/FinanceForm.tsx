'use client'
import { useState } from 'react'
import { FileUpload } from '@/components/agent/FileUpload'
import { Field, TextField, TextAreaField, Tabs, FormHead, Agree, Submit } from '@/components/agent/form-kit'

// Faithful interactive replica of the live bluestacks.ai "Get your analysis" demo — a tabbed
// form (Upload my holdings / Ask about a stock). Design-only (submit inert). Composes form-kit.
export function FinanceForm() {
  const [tab, setTab] = useState<'upload' | 'ask'>('upload')
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <FormHead title="Get your analysis" sub="Join the queue. The agent runs the numbers and emails you the breakdown." />
      <Tabs value={tab} onChange={setTab} tabs={[['upload', 'Upload my holdings'], ['ask', 'Ask about a stock']]} />
      <TextField label="Email" type="email" placeholder="you@email.com" />
      {tab === 'upload' ? (
        <Field label="Your holdings (screenshot or report)" hint="A broker screenshot, a portfolio export, or a PDF statement all work.">
          <FileUpload accept=".pdf,.csv,.xlsx,image/*" />
        </Field>
      ) : (
        <TextAreaField label="Your question" placeholder="e.g. Is NVDA overbought? How has MU's momentum held up? Compare AMD and INTC." />
      )}
      <Agree>I understand this is data analysis for education, not investment advice, and I agree to be emailed my analysis and product updates.</Agree>
      <Submit>Get my analysis</Submit>
    </form>
  )
}
