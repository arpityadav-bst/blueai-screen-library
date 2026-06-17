// BlueAI — Profile (in-app screen) + Logout confirm dialog.
// Faithful port of profile.jsx onto the product DS kit. Opened from the kebab → Profile:
// gradient banner + logo-disc avatar, name/email, an Account Information card, and a
// Sign out card-button that confirms via ConfirmDialog.
// Self-contained: the ACCOUNT data lives here (matches live; values are representative
// handoff data, not a live backend).
'use client'

import { useState } from 'react'
import { Card, Pill, ConfirmDialog } from '../ui'

const ACCOUNT = {
  name: 'Arpit Yadav',
  email: 'arpit.yadav@bluestacks.com',
  handle: 'TriflingStandpoint',
  country: 'India',
  mobile: 'Not set',
}

function Row({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-start justify-between gap-3 py-3.5 ${last ? '' : 'border-b border-divider'}`}>
      <span className="shrink-0 text-base text-ink-muted">{label}</span>
      <div className="min-w-0 text-right">{children}</div>
    </div>
  )
}

export function Profile({ onSignOut }: { onSignOut?: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-surface px-4 pb-5 pt-3.5">
      {/* Identity card: gradient banner · avatar disc · name · email */}
      <Card className="overflow-hidden">
        {/* Profile banner — decorative blue→purple gradient (tier-3 brand, kept as-is; see notes). */}
        <div className="h-24" style={{ background: 'linear-gradient(100deg,#2f6fed,#7B4CFF)' }} />
        <div className="px-4.5 pb-4.5">
          {/* Avatar disc — decorative tier-3 fill + emoji art (kept as-is; see notes). */}
          <div
            className="-mt-[54px] flex h-[92px] w-[92px] items-center justify-center rounded-circle border-4 border-canvas text-[46px] leading-none shadow-float"
            style={{ background: '#A3D977' }}
          >
            🦇
          </div>
          <p className="mt-3 text-xl font-extrabold tracking-tight-1 text-ink-heading">{ACCOUNT.name}</p>
          <p className="mt-0.5 break-all text-base text-ink-muted">{ACCOUNT.email}</p>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="px-4.5 py-4">
        <div className="mb-1 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h2 className="text-h3 font-extrabold text-ink-heading">Account Information</h2>
        </div>
        <Row label="Handle"><span className="text-base font-semibold text-ink-heading">{ACCOUNT.handle}</span></Row>
        <Row label="Email">
          <p className="break-all text-base font-semibold text-ink-heading">{ACCOUNT.email}</p>
          <Pill tone="success" className="mt-1.5">Verified</Pill>
        </Row>
        <Row label="Country"><span className="text-base font-semibold text-ink-heading">{ACCOUNT.country}</span></Row>
        <Row label="Mobile" last><span className="text-base font-semibold text-ink-muted">{ACCOUNT.mobile}</span></Row>
      </Card>

      {/* Sign out — full-width button carrying the DS card recipe (rounded-field + hairline). */}
      <button
        onClick={() => setConfirmOpen(true)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-field border border-divider bg-canvas px-4.5 py-4 text-left shadow-hairline transition-colors duration-fast hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="flex-1 text-h4 font-semibold text-ink-body-2">Sign out</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-ink-muted">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Logout"
        body="Are you sure you want to sign out?"
        confirmLabel="Logout"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); onSignOut?.() }}
      />
    </div>
  )
}
