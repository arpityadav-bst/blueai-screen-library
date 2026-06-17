'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { Button, IconButton } from './ui'

const LOGO = '/blueai-product/assets/Logo.png'

function Menu({ open, items }: { open: boolean; items: { icon: ReactNode; label: string; onClick: () => void; danger?: boolean }[] }) {
  if (!open) return null
  return (
    <div className="absolute right-0 top-[calc(100%+6px)] z-[60] min-w-[190px] overflow-hidden rounded-field border border-divider bg-canvas p-1 shadow-overlay">
      {items.map((it) => (
        <button key={it.label} onClick={it.onClick}
          className={`flex w-full items-center gap-2.5 rounded-card px-3 py-2.5 text-left text-base transition-colors hover:bg-surface ${it.danger ? 'text-status-danger' : 'text-ink-body'}`}>
          {it.icon}{it.label}
        </button>
      ))}
    </div>
  )
}

export function TopBar({ credits, onNewChat, onOpenCredits, onOpenHistory, onOpenProfile, onLogout }: {
  credits: number; onNewChat: () => void; onOpenCredits: () => void; onOpenHistory: () => void; onOpenProfile: () => void; onLogout: () => void
}) {
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (helpOpen || menuOpen) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [helpOpen, menuOpen])

  const ico = (d: string, stroke = '#64748b') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

  return (
    <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-divider bg-canvas px-3 py-2.5">
      <div className="flex items-center gap-2">
        <img src={LOGO} alt="BlueAI" className="size-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-lg font-bold tracking-tight-1 text-ink-heading">BlueAI</span>
      </div>
      <div className="flex items-center gap-1.5">
        {/* credits chip — quiet neutral, gray logo mark */}
        <button onClick={onOpenCredits} aria-label="AI credits"
          className="flex items-center gap-1.5 rounded-pill border border-divider bg-surface py-1 pl-2.5 pr-3 transition-colors hover:bg-divider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <img src={LOGO} alt="" className="size-4 grayscale" />
          <span className="text-h5 font-bold text-ink-heading">{credits.toLocaleString('en-US')}</span>
        </button>
        <Button size="sm" onClick={onNewChat}
          leftIcon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>}>
          New Chat
        </Button>
        <div ref={helpRef} className="relative">
          <IconButton label="Help" active={helpOpen} onClick={() => { setHelpOpen((v) => !v); setMenuOpen(false) }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </IconButton>
          <Menu open={helpOpen} items={[
            { icon: ico('M19.27 5.33C17.94 4.71 16.5 4.26 15 4M8.52 14.91c-.97 0-1.77-.89-1.77-1.99'), label: 'Get help', onClick: () => setHelpOpen(false) },
            { icon: ico('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', '#ef4444'), label: 'Report Issue', onClick: () => setHelpOpen(false) },
          ]} />
        </div>
        <div ref={menuRef} className="relative">
          <IconButton label="More options" active={menuOpen} onClick={() => { setMenuOpen((v) => !v); setHelpOpen(false) }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
          </IconButton>
          <Menu open={menuOpen} items={[
            { icon: ico('M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'), label: 'Chat History', onClick: () => { setMenuOpen(false); onOpenHistory() } },
            { icon: ico('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'), label: 'Profile', onClick: () => { setMenuOpen(false); onOpenProfile() } },
            { icon: ico('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'), label: 'Logout', onClick: () => { setMenuOpen(false); onLogout() } },
          ]} />
        </div>
      </div>
    </div>
  )
}
