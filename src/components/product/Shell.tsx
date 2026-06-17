'use client'
import { useState } from 'react'
import { TopBar } from './TopBar'
import { BottomNav, Tab } from './BottomNav'
import { ProductChat } from './screens/ProductChat'
import { Skills } from './screens/Skills'
import { Jobs } from './screens/Jobs'
import { Schedule } from './screens/Schedule'
import { Settings } from './screens/Settings'
import { ChatHistory } from './screens/ChatHistory'
import { Profile } from './screens/Profile'
import { AICredits } from './screens/AICredits'
import { BootSplash, HomeSkeleton } from './screens/BootSkeleton'

const CREDITS = 45812

// The product app shell — top bar + tabbed content + bottom nav + overlay screens + cold-start boot.
export function Shell() {
  const [tab, setTab] = useState<Tab>('chat')
  const [sessionKey, setSessionKey] = useState(0)
  const [seed, setSeed] = useState<{ text?: string } | undefined>(undefined)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [booting, setBooting] = useState(true)
  const [homeReady, setHomeReady] = useState(false)

  const clearOverlays = () => { setCreditsOpen(false); setHistoryOpen(false); setProfileOpen(false) }
  const newChat = () => { setSeed(undefined); setSessionKey((k) => k + 1); setTab('chat'); clearOverlays() }
  const openHistory = () => { clearOverlays(); setHistoryOpen(true) }
  const openProfile = () => { clearOverlays(); setProfileOpen(true) }
  const openCredits = () => { clearOverlays(); setCreditsOpen(true) }
  const changeTab = (t: Tab) => { setTab(t); clearOverlays(); if (t !== 'chat') setSeed(undefined) }
  const trySkill = (s: { prompt?: string; name?: string }) => { setSeed({ text: s.prompt || s.name }); setTab('chat'); clearOverlays() }
  const signOut = () => { clearOverlays(); newChat() }

  const overlay = creditsOpen || historyOpen || profileOpen

  let body
  if (profileOpen) body = <Profile onSignOut={signOut} />
  else if (historyOpen) body = <ChatHistory />
  else if (creditsOpen) body = <AICredits credits={CREDITS} onRefresh={() => {}} />
  else if (tab === 'chat') body = <ProductChat sessionKey={sessionKey} seed={seed} loading={!homeReady} loadingFallback={<HomeSkeleton />} onOpenHistory={openHistory} />
  else if (tab === 'skills') body = <Skills onTrySkill={trySkill} isLoading={!homeReady} />
  else if (tab === 'jobs') body = <Jobs />
  else if (tab === 'schedule') body = <Schedule isLoading={!homeReady} />
  else body = <Settings />

  // Chat owns its own scroll + pinned composer; the other screens scroll within the content area.
  const scrolls = !(tab === 'chat' && !overlay)

  return (
    <>
      <TopBar credits={CREDITS} onNewChat={newChat} onOpenCredits={openCredits} onOpenHistory={openHistory} onOpenProfile={openProfile} onLogout={openProfile} />
      <div className={`flex min-h-0 flex-1 flex-col ${scrolls ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {body}
      </div>
      <BottomNav active={overlay ? null : tab} onChange={changeTab} />
      {booting && <BootSplash onDone={() => { setBooting(false); setTimeout(() => setHomeReady(true), 850) }} />}
    </>
  )
}
