'use client'
import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TextField, SelectField } from '../ui/Field'
import { Modal } from '../ui/Modal'

// BlueAI — Settings Screen (faithful DS port of public/blueai-product/blueai/settings.jsx)
// Matches the live product: NO page title, NO account card (Profile / Chat History /
// Report Issue / Log Out live in the header ? and kebab menus). Cards, in order:
// BlueStacks Instance · Telegram · Chat AI Settings.

// ── AI model options (ported verbatim) ─────────────────────────────────────
const AI_MODELS = [
  { value: 'auto', label: 'Auto' },
  { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview' },
  { value: 'gpt-5.4-mini', label: 'GPT-5.4 Mini' },
  { value: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
  { value: 'claude-opus-4.6', label: 'Claude Opus 4.6' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'gpt-5.4', label: 'GPT-5.4' },
]

function BluestacksCard() {
  return (
    <Card className="mb-3.5 p-4">
      <div className="mb-2 flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="assets/BlueStacks.png"
          alt="BlueStacks"
          className="size-[30px] rounded-card object-contain"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
        <h2 className="text-h3 font-bold text-ink-heading">BlueStacks Instance</h2>
      </div>
      <p className="mb-[5px] text-h5 text-ink-muted">
        Connected to <span className="font-semibold text-accent">BlueStacks App Player</span>
      </p>
      <p className="text-sm leading-normal text-ink-muted">
        To switch, open BlueAI from another instance.
      </p>
    </Card>
  )
}

function TelegramCard() {
  const [connected, setConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Card className="mb-3.5 p-4">
        <div className="mb-2 flex items-center gap-2.5">
          {/* Tier-3 brand glyph — Telegram mark; geometry kept as-is */}
          <svg viewBox="0 0 24 24" fill="#3B82F6" className="size-8 shrink-0">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <h2 className="text-h3 font-bold text-ink-heading">Telegram</h2>
        </div>
        <div className="mb-3 min-h-10">
          {connected
            ? <p className="mt-1 text-h5 text-ink-muted">Connected to <span className="font-semibold text-accent">@BlueAIBot</span></p>
            : <p className="mt-0.5 text-h5 leading-normal text-ink-muted">Connect your Telegram account and send commands to BlueAI from any device.</p>}
        </div>
        {connected
          ? <Button variant="secondary" size="sm" onClick={() => setConnected(false)}>Unlink</Button>
          : <Button size="sm" onClick={() => setShowModal(true)}>Connect Telegram</Button>}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Connect Telegram">
        <div className="flex flex-col gap-4">
          <p className="text-base leading-relaxed text-ink-muted">Scan the QR code or use the pairing code below to connect your Telegram account to BlueAI.</p>
          <div className="flex flex-col items-center gap-3.5 rounded-field border border-divider bg-surface p-6">
            {/* QR placeholder */}
            <div className="flex size-[120px] items-center justify-center rounded-card bg-divider">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <circle cx="17.5" cy="17.5" r="2.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <p className="text-sm text-ink-muted">Or use pairing code:</p>
            <div className="rounded-card border-[1.5px] border-dashed border-accent/30 bg-canvas px-5 py-2.5">
              <span className="text-xl font-bold tracking-[6px] text-accent">4829</span>
            </div>
          </div>
          <Button pill={false} className="w-full" onClick={() => { setConnected(true); setShowModal(false) }}>
            I&apos;ve paired — continue
          </Button>
        </div>
      </Modal>
    </>
  )
}

function AISettingsCard() {
  const [model, setModel] = useState('auto')
  const [maxTokens, setMaxTokens] = useState(10000)
  const [maxSteps, setMaxSteps] = useState(50)
  const [timeoutVal, setTimeoutVal] = useState(1200)
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  // Live layout: bold dark label + control on one row, grey hint line below, divider between.
  const fieldRow = (label: string, sublabel: string | null, el: React.ReactNode) => (
    <div key={label} className="border-b border-divider py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-h4 font-bold text-ink-heading">{label}</p>
        {el}
      </div>
      {sublabel && <p className="mt-2 text-sm leading-tight text-ink-muted">{sublabel}</p>}
    </div>
  )

  const numInput = (val: number, set: (n: number) => void, min: number, max: number, step = 1) => (
    <TextField
      type="number"
      value={val}
      onChange={(e) => set(+e.target.value)}
      min={min}
      max={max}
      step={step}
      className="w-[150px] font-medium"
    />
  )

  return (
    <Card data-section="ai-chat-settings" className="mb-3.5 p-4.5">
      <div className="mb-1.5 flex items-center gap-2">
        {/* Accent chat-settings glyph — geometry kept; stroke tokenized to accent */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 className="text-h3 font-bold text-ink-heading">Chat AI Settings</h2>
      </div>
      <div>
        {fieldRow('AI Model', null,
          <SelectField value={model} onChange={(e) => setModel(e.target.value)} className="w-[200px]">
            {AI_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </SelectField>,
        )}
        {fieldRow('Max Output Tokens', 'Maximum number of tokens to generate (5,000-100,000)', numInput(maxTokens, setMaxTokens, 5000, 100000, 1000))}
        {fieldRow('Max Steps', 'Maximum number of reasoning steps (10-500)', numInput(maxSteps, setMaxSteps, 10, 500))}
        {fieldRow('Timeout (in Secs)', null, numInput(timeoutVal, setTimeoutVal, 60, 7200, 60))}
      </div>
      {saved && (
        <div className="mt-3 rounded-card border border-status-success bg-status-success-soft px-3.5 py-2.5 text-h5 text-status-success-ink">
          Settings saved successfully.
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button pill={false} onClick={save}>Save settings</Button>
      </div>
    </Card>
  )
}

export function Settings() {
  return (
    <div className="pb-5 pt-4">
      <BluestacksCard />
      <TelegramCard />
      <AISettingsCard />
    </div>
  )
}

export default Settings
