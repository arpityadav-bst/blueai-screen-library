'use client'
import { useState } from 'react'
import { Arrow } from '@/components/Arrow'
import { FileUpload } from '@/components/agent/FileUpload'

// Faithful interactive replica of the live bluestacks.ai "Get your analysis" demo — a tabbed
// form (Upload my holdings / Ask about a stock). Design-only (submit inert). Reuses .jmf-*.
export function FinanceForm() {
  const [tab, setTab] = useState<'upload' | 'ask'>('upload')
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <div className="jmf-head">
        <h2 className="jmf-title">Get your analysis</h2>
        <p className="jmf-sub">Join the queue. The agent runs the numbers and emails you the breakdown.</p>
      </div>

      <div className="jmf-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'upload'} className={`jmf-tab${tab === 'upload' ? ' is-on' : ''}`} onClick={() => setTab('upload')}>Upload my holdings</button>
        <button type="button" role="tab" aria-selected={tab === 'ask'} className={`jmf-tab${tab === 'ask' ? ' is-on' : ''}`} onClick={() => setTab('ask')}>Ask about a stock</button>
      </div>

      <label className="jmf-field">
        <span className="jmf-lbl">Email</span>
        <input className="jmf-input" type="email" placeholder="you@email.com" />
      </label>

      {tab === 'upload' ? (
        <div className="jmf-field">
          <span className="jmf-lbl">Your holdings (screenshot or report)</span>
          <FileUpload accept=".pdf,.csv,.xlsx,image/*" />
          <span className="jmf-hint">A broker screenshot, a portfolio export, or a PDF statement all work.</span>
        </div>
      ) : (
        <label className="jmf-field">
          <span className="jmf-lbl">Your question</span>
          <textarea className="jmf-input jmf-textarea" rows={2} placeholder="e.g. Is NVDA overbought? How has MU's momentum held up? Compare AMD and INTC." />
        </label>
      )}

      <label className="jmf-agree">
        <input type="checkbox" />
        <span>I understand this is data analysis for education, not investment advice, and I agree to be emailed my analysis and product updates.</span>
      </label>

      <button type="submit" className="jmf-submit">Get my analysis<Arrow size={18} /></button>
    </form>
  )
}
