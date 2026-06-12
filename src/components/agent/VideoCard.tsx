'use client'
import { useRef, useState } from 'react'

// Click-to-play video card for the "Made by the agent" showcase — mirrors the live
// bluestacks.ai treatment (poster + custom play overlay, loop, playsInline, no native controls).
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>

export type Vid = { badge: string; t: string; meta: string; file: string; exp?: boolean }

export function VideoCard({ v }: { v: Vid }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) void el.play()?.catch(() => {})
    else el.pause()
  }
  return (
    <div className="ag-vid">
      <button type="button" className={`ag-vid-frame${v.exp ? ' exp' : ''}`} onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${v.t}`}>
        <video ref={ref} className="ag-vid-media" src={`/videos/${v.file}.mp4`} poster={`/videos/${v.file}.jpg`} loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        <span className="ag-vid-badge">{v.badge}</span>
        {!playing && <span className="ag-vid-play"><PlayIcon /></span>}
      </button>
      <h4>{v.t}</h4>
      <p className="meta">{v.meta}</p>
    </div>
  )
}
