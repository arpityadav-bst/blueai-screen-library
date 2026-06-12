'use client'
import { useRef, useState } from 'react'
import { UploadIcon } from '@/components/agent/glyphs'

// Design-only file picker with semantically correct states:
//  • empty  → upload icon + "Choose file" + "No file chosen"
//  • filled → file icon + filename + a remove (✕) button; the "Choose file" prompt is gone
// Reused by the Resume (apply-to-jobs) and holdings (ai-trading-agent) fields.
const FileGlyph = () => <svg className="jmf-file-ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
const XGlyph = () => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>

export function FileUpload({ accept }: { accept?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string | null>(null)
  return (
    <div className={`jmf-upload${name ? ' is-filled' : ''}`}>
      <input ref={ref} type="file" accept={accept} className="jmf-file-input" onChange={(e) => setName(e.target.files?.[0]?.name ?? null)} />
      {name ? (
        <>
          <FileGlyph />
          <span className="jmf-file-name">{name}</span>
          <button type="button" className="jmf-file-x" onClick={() => { setName(null); if (ref.current) ref.current.value = '' }} aria-label="Remove file"><XGlyph /></button>
        </>
      ) : (
        <>
          <UploadIcon />
          <button type="button" className="jmf-file-choose" onClick={() => ref.current?.click()}>Choose file</button>
          <span className="jmf-file-empty">No file chosen</span>
        </>
      )}
    </div>
  )
}
