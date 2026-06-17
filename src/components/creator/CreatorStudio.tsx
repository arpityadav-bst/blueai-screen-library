'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { CreatorLoginModal } from './CreatorLoginModal'
import { CreatorShareModal } from './CreatorShareModal'
import { CreatorSampleModal } from './CreatorSampleModal'

// A sample-gallery card opened in the sample popup (copy-the-prompt). `ratio` drives the popup layout
// (portrait = video-left/info-right; landscape/square = video-top/info-below).
export type Sample = { title: string; meta: string; tint?: string; video?: string; clip?: boolean; prompt: string; ratio?: '9/16' | '16/9' | '1/1' }

// Shared state for the creator "studio" flow (design-only, no real auth/generation):
// Generate → (not signed in) Google login modal → sign in grants 1 free generation →
// the render appears in the "Your generations" library section. Hero + Library + Modal all read this.
export type Gen = { id: number; title: string; style: string; video: string }
const CLIPS = ['kai-bride', 'ceo-married-rival', 'steam-engine'] // our demo clips, rotated for variety

type StudioCtx = {
  prompt: string; setPrompt: (s: string) => void
  style: string; setStyle: (s: string) => void
  loggedIn: boolean
  generating: boolean
  generations: Gen[]
  modal: 'login' | null
  closeModal: () => void
  requestGenerate: () => void
  login: () => void
  openGen: Gen | null
  shareTo: string | null
  installing: boolean
  openGeneration: (g: Gen) => void
  closeGeneration: () => void
  share: (platform: string) => void
  backToDetail: () => void
  startInstall: () => void
  openSample: Sample | null
  openSampleModal: (s: Sample) => void
  closeSample: () => void
}
const Ctx = createContext<StudioCtx | null>(null)
export const useStudio = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStudio must be used within <CreatorStudio>')
  return c
}

export function CreatorStudio({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Cinematic')
  const [loggedIn, setLoggedIn] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generations, setGenerations] = useState<Gen[]>([])
  const [modal, setModal] = useState<'login' | null>(null)
  const [openGen, setOpenGen] = useState<Gen | null>(null) // generation opened in the detail/share modal
  const [shareTo, setShareTo] = useState<string | null>(null) // platform chosen → publish upsell view
  const [installing, setInstalling] = useState(false) // Download BlueAI clicked → installer-steps view
  const [openSample, setOpenSample] = useState<Sample | null>(null) // a sample-gallery card opened (copy-prompt)

  const scrollToLibrary = () =>
    setTimeout(() => document.querySelector('.cr-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)

  const runGenerate = () => {
    setGenerating(true)
    scrollToLibrary() // the loading card renders the .cr-library section, so this lands
    setTimeout(() => {
      setGenerations((g) => [
        { id: g.length + 1, title: prompt.trim() || 'A faceless short', style, video: CLIPS[g.length % CLIPS.length] },
        ...g,
      ])
      setGenerating(false)
    }, 2200)
  }

  const requestGenerate = () => {
    if (generating) return
    if (!loggedIn) { setModal('login'); return } // sign in once; then generate freely
    runGenerate()
  }
  const login = () => { setLoggedIn(true); setModal(null); runGenerate() }
  const closeModal = () => setModal(null)

  const openGeneration = (g: Gen) => { setOpenGen(g); setShareTo(null); setInstalling(false) }
  const closeGeneration = () => { setOpenGen(null); setShareTo(null); setInstalling(false) }
  const share = (platform: string) => { setShareTo(platform); setInstalling(false) }
  const backToDetail = () => { setShareTo(null); setInstalling(false) }
  const startInstall = () => setInstalling(true)
  const openSampleModal = (s: Sample) => setOpenSample(s)
  const closeSample = () => setOpenSample(null)

  return (
    <Ctx.Provider value={{ prompt, setPrompt, style, setStyle, loggedIn, generating, generations, modal, closeModal, requestGenerate, login, openGen, shareTo, installing, openGeneration, closeGeneration, share, backToDetail, startInstall, openSample, openSampleModal, closeSample }}>
      {children}
      <CreatorLoginModal />
      <CreatorShareModal />
      <CreatorSampleModal />
    </Ctx.Provider>
  )
}
