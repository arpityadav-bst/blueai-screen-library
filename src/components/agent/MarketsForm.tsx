'use client'
import { useState } from 'react'
import { TextField, TextAreaField, Tabs, FormHead, Agree, Submit } from '@/components/agent/form-kit'

// Faithful interactive replica of the live bluestacks.ai "Get odds alerts" demo — a tabbed
// form (Watch markets / Ask about odds). Design-only (submit inert). Composes form-kit.
export function MarketsForm() {
  const [tab, setTab] = useState<'watch' | 'ask'>('watch')
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <FormHead title="Get odds alerts" sub="Join the queue. The agent watches your markets and emails you the moves." />
      <Tabs value={tab} onChange={setTab} tabs={[['watch', 'Watch markets'], ['ask', 'Ask about odds']]} />
      <TextField label="Email" type="email" placeholder="you@email.com" />
      {tab === 'watch' ? (
        <>
          <TextAreaField label="Markets to watch" placeholder="e.g. World Cup 2026 winner, USA to advance from group, Spain vs France" />
          <TextField label="Alert me when odds move" optional="optional" placeholder="e.g. 3 points of implied probability" />
        </>
      ) : (
        <TextAreaField label="Your question" placeholder="e.g. What are the current World Cup winner odds? Where do Polymarket and Kalshi disagree most?" />
      )}
      <Agree>I understand this is odds information for education, not betting advice, and I agree to be emailed my alerts and product updates.</Agree>
      <Submit>Get my alerts</Submit>
    </form>
  )
}
