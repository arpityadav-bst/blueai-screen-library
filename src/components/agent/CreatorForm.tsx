'use client'
import { useState } from 'react'
import { TextAreaField, PillsField, FormHead, Submit } from '@/components/agent/form-kit'

// Faithful interactive replica of the live bluestacks.ai "Generate a video" demo.
// Design-only (submit inert). Composes the form-kit molecules (.jmf-* atoms).
const STYLES = ['Faceless short', 'Micro-drama', 'Explainer', 'Talking-head reel']
const PLATFORMS = ['YouTube Shorts', 'TikTok', 'Instagram Reels']
const LENGTHS = ['15 sec', '30 sec', '60 sec']

export function CreatorForm() {
  const [style, setStyle] = useState('Faceless short')
  const [platforms, setPlatforms] = useState<string[]>(['YouTube Shorts'])
  const [length, setLength] = useState('30 sec')
  const togglePlat = (p: string) => setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <FormHead title="Generate a video" sub="Describe it. The agent makes your video and emails you the link." />
      <TextAreaField label="What should the video be about?" placeholder="e.g. A 3-part mafia micro-drama about a betrayal, or 5 mind-blowing space facts" />
      <PillsField label="Style" options={STYLES} value={style} onToggle={setStyle} />
      <PillsField label="Platforms" options={PLATFORMS} value={platforms} onToggle={togglePlat} />
      <PillsField label="Length" options={LENGTHS} value={length} onToggle={setLength} />
      <Submit>Generate my video</Submit>
    </form>
  )
}
