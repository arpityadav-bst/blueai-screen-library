'use client'
import { useState } from 'react'
import { Arrow } from '@/components/Arrow'

// Faithful interactive replica of the live bluestacks.ai "Get odds alerts" demo — a tabbed
// form (Watch markets / Ask about odds). Design-only (submit inert). Reuses .jmf-*.
export function MarketsForm() {
  const [tab, setTab] = useState<'watch' | 'ask'>('watch')
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <div className="jmf-head">
        <h2 className="jmf-title">Get odds alerts</h2>
        <p className="jmf-sub">Join the queue. The agent watches your markets and emails you the moves.</p>
      </div>

      <div className="jmf-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'watch'} className={`jmf-tab${tab === 'watch' ? ' is-on' : ''}`} onClick={() => setTab('watch')}>Watch markets</button>
        <button type="button" role="tab" aria-selected={tab === 'ask'} className={`jmf-tab${tab === 'ask' ? ' is-on' : ''}`} onClick={() => setTab('ask')}>Ask about odds</button>
      </div>

      <label className="jmf-field">
        <span className="jmf-lbl">Email</span>
        <input className="jmf-input" type="email" placeholder="you@email.com" />
      </label>

      {tab === 'watch' ? (
        <>
          <label className="jmf-field">
            <span className="jmf-lbl">Markets to watch</span>
            <textarea className="jmf-input jmf-textarea" rows={2} placeholder="e.g. World Cup 2026 winner, USA to advance from group, Spain vs France" />
          </label>
          <label className="jmf-field">
            <span className="jmf-lbl">Alert me when odds move <span className="jmf-opt">(optional)</span></span>
            <input className="jmf-input" type="text" placeholder="e.g. 3 points of implied probability" />
          </label>
        </>
      ) : (
        <label className="jmf-field">
          <span className="jmf-lbl">Your question</span>
          <textarea className="jmf-input jmf-textarea" rows={2} placeholder="e.g. What are the current World Cup winner odds? Where do Polymarket and Kalshi disagree most?" />
        </label>
      )}

      <label className="jmf-agree">
        <input type="checkbox" />
        <span>I understand this is odds information for education, not betting advice, and I agree to be emailed my alerts and product updates.</span>
      </label>

      <button type="submit" className="jmf-submit">Get my alerts<Arrow size={18} /></button>
    </form>
  )
}
