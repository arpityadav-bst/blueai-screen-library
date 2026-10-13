/* BlueAI: agent permissions (ROB-21350, "Agent should ask for permission once").

   One setting PER APP (Abhisht, 2026-10-12), deciding whether the BlueAI worker asks before it
   takes a paid job on that app during its daily run:
     always  Always ask (the default): the job ask waits for an answer, then the job runs to the end.
     auto    Automatic: no ask; the worker takes the job and finishes it on its own.
   YouTube is the app today; Instagram is next. A new app always starts on Always ask and has to
   be switched to Automatic on its own, and each switch is its own consent. The wording is
   "Always ask" and "Automatic" everywhere, never "Always allow", "Auto" or "Supervised".

   Where the person first picks is worker_flow.jsx's business (an onboarding question, or "Yes,
   switch to Automatic" on the daily job ask). Where they change it LATER is the question two
   versions put to the seniors (Abhisht, 2026-10-05), switched from the Preview panel's
   "Change mode from" row:
     1 'chatbox'  ModeChip in the composer's bottom bar, in every signed-in chat (product level).
     2 'ribbon'   AutoRibbon above the composer, only in a worker chat and only while Automatic is
                  on for some app (skill level); its "Change" opens the sheet.
   Both open the same mode sheet (Arpit, 2026-10-14): one row per app, each with ONE switch, on =
   Automatic, off = Always ask. Settings carries the same list under Worker > Apps, so the mode
   has a permanent home outside chat. Adding an app is one APPS entry; both lists pick it up.
   Not persisted: every reload of this prototype starts a brand-new user on Always ask everywhere.
   The real app keeps the settings per account.

   Automatic is CONSENT, not a preference: with it on, BlueAI accepts jobs and acts on the person's
   account on that app (posting videos, liking, following) with nobody watching. So every way of
   turning it on for an app goes through AutoConfirm, whose "I agree, turn on" button is the
   agreement; turning it off applies at once. Asked
   every time it is turned on, not once per lifetime. The agreement time is kept locally here; the
   real product records it server-side, per app.

   Exposes window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, autoApps, requestMode,
   usePermissionMode, ModeChip, AutoRibbon, ModeSheet, AppSwitchList, AutoConfirm, IcoShieldCheck,
   IcoZap }. */
(function () {
  const { useState, useEffect, useRef } = React;

  const ACCENT = '#1990FF';
  const INK = '#111827';
  const MUTED = '#6b7280';
  const FAINT = '#9ca3af';

  const stroke = (size, paths) =>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths}</svg>;
  const IcoShieldCheck = ({ size = 16 }) => stroke(size, <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>);
  const IcoZap = ({ size = 16 }) => stroke(size, <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />);
  // App marks, in the product's own stroke style rather than brand logos.
  const IcoYouTube = ({ size = 16 }) => stroke(size, <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>);
  const IcoInstagram = ({ size = 16 }) => stroke(size, <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" /></>);
  const IcoChevron = () =>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><polyline points="6 15 12 9 18 15" /></svg>;

  const MODES = [
    { id: 'always', title: 'Always ask', sub: 'Asks before each job starts, then runs it to the end', Icon: IcoShieldCheck },
    { id: 'auto', title: 'Automatic', sub: 'Starts and finishes jobs without asking', Icon: IcoZap }];
  const APPS = [
    { id: 'youtube', name: 'YouTube', Icon: IcoYouTube },
    { id: 'instagram', name: 'Instagram', Icon: IcoInstagram }];
  const byId = (id) => MODES.find((m) => m.id === id) || MODES[0];
  const appById = (id) => APPS.find((a) => a.id === id) || APPS[0];
  // The chip's and the ribbon's words: one app is named, several are counted, so the line stays
  // one line however many apps there are.
  const summary = (auto) => (!auto.length ? 'Always ask' : 'Automatic on ' + (auto.length === 1 ? auto[0].name : auto.length + ' apps'));

  /* ── Store ── */
  const fresh = () => Object.fromEntries(APPS.map((a) => [a.id, 'always']));
  let modes = fresh();
  let confirming = null;     // the app whose consent dialog is up
  let afterConsent = null;   // what the asker does once the person agrees (the job card starts its job)
  let sheetOpen = false;     // the mode sheet
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const getMode = (app = 'youtube') => modes[app] || 'always';
  const autoApps = () => APPS.filter((a) => modes[a.id] === 'auto');
  function setMode(app, m) { modes = { ...modes, [appById(app).id]: byId(m).id }; confirming = null; emit(); }
  function reset() { modes = fresh(); confirming = null; afterConsent = null; sheetOpen = false; emit(); }
  const openSheet = () => { sheetOpen = true; emit(); };
  const closeSheet = () => { sheetOpen = false; emit(); };
  // `then` runs only if the mode actually changes; Cancel on the consent drops it.
  function requestMode(app, m, then) {
    if (m === 'auto' && modes[app] !== 'auto') { confirming = app; afterConsent = then || null; emit(); return; }
    setMode(app, m); if (then) then();
  }
  function agreeAuto() {
    const app = confirming, then = afterConsent; afterConsent = null;
    try { localStorage.setItem('blueai_auto_consent_' + app, new Date().toISOString()); } catch (e) { /* stand-in for the server-side record */ }
    setMode(app, 'auto'); if (then) then();
  }
  function cancelConfirm() { confirming = null; afterConsent = null; emit(); }
  function usePermissionMode() {
    const [, bump] = useState(0);
    useEffect(() => { const f = () => bump((n) => n + 1); subs.add(f); return () => { subs.delete(f); }; }, []);
    return { modes, confirming, sheetOpen, requestMode, setMode, autoApps };
  }

  /* ── The app list ── one row per app: its mark, its name and ONE switch, on = Automatic, off =
     Always ask. Switching on goes through the consent for that app; off applies at once. It is
     the mode sheet's body and Settings' Worker > Apps group, so both read from APPS. */
  function AppSwitchList() {
    const { modes: cur } = usePermissionMode();
    return (
      <ul style={{ listStyle: 'none' }}>
        {APPS.map((a, i) => {
          const on = cur[a.id] === 'auto';
          return (
            <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: i ? '1px solid #eef2f6' : 'none' }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><a.Icon size={17} /></span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: INK }}>{a.name}</span>
              <button type="button" role="switch" aria-checked={on} aria-label={'Run ' + a.name + ' jobs without asking'} className="ba-switch"
                onClick={() => requestMode(a.id, on ? 'always' : 'auto')}
                style={{ position: 'relative', width: 40, height: 24, flexShrink: 0, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: on ? ACCENT : '#cbd5e1', transition: 'background 0.18s ease' }}>
                <span style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(15,23,42,0.25)', transition: 'left 0.18s ease' }} />
              </button>
            </li>);
        })}
      </ul>);
  }

  /* ── The mode sheet ── Rendered ONCE, at App level inside .ba-app like AutoConfirm, so it is
     scoped to the product window whichever control opened it. Slides up over a light scrim; the
     scrim, Esc and the close button shut it. Focus moves to the close button on open and back to
     the opener on close. z50 keeps it under the consent dialog (ModalOverlay, z60), which opens
     on top of it when a switch is turned on; Esc then answers the dialog, not the sheet. The list
     scrolls inside the sheet once there are more apps than fit. */
  function ModeSheet() {
    const { sheetOpen: open, confirming: asking } = usePermissionMode();
    const closeRef = useRef(null);
    const opener = useRef(null);
    useEffect(() => {
      if (!open) return;
      opener.current = document.activeElement;
      if (closeRef.current) closeRef.current.focus();
      return () => { if (opener.current && opener.current.isConnected) opener.current.focus(); };
    }, [open]);
    useEffect(() => {
      if (!open || asking) return;
      const key = (e) => { if (e.key === 'Escape') closeSheet(); };
      document.addEventListener('keydown', key);
      return () => document.removeEventListener('keydown', key);
    }, [open, asking]);
    if (!open) return null;
    return (
      <div className="ba-sheet-scrim" onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}
        style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(15,23,42,0.24)' }}>
        <div role="dialog" aria-modal="true" aria-labelledby="ap-sheet-title" className="ba-sheet"
          style={{ display: 'flex', flexDirection: 'column', maxHeight: '72%', background: 'white', borderRadius: '20px 20px 0 0', borderTop: '1px solid #e5e7eb', boxShadow: '0 -12px 40px rgba(8,10,31,0.14)', padding: '20px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 id="ap-sheet-title" style={{ fontSize: 17, fontWeight: 800, color: INK, letterSpacing: '-0.3px', lineHeight: 1.3 }}>Apps BlueAI can run on its own</h2>
              <p style={{ marginTop: 4, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>New apps always start on Always ask.</p>
            </div>
            <button ref={closeRef} type="button" onClick={closeSheet} aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, padding: 4, borderRadius: 6, margin: '-2px -6px 0 0' }}><IcoXClose size={18} /></button>
          </div>
          <div style={{ marginTop: 8, minHeight: 0, overflowY: 'auto' }}><AppSwitchList /></div>
        </div>
      </div>);
  }

  /* ── Version 1: the Mode chip ── sits in the composer's bottom bar and opens the mode sheet. Its
     label sums the apps up in the ribbon's words: "Always ask" while nothing is automatic,
     otherwise "Automatic on YouTube" or "Automatic on 2 apps". */
  function ModeChip() {
    const { autoApps: on, sheetOpen: open } = usePermissionMode();
    const auto = on();
    const m = byId(auto.length ? 'auto' : 'always');
    return (
      <button type="button" onClick={openSheet} aria-haspopup="dialog" aria-expanded={open} title="Mode"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', borderRadius: 8, padding: '5px 7px', fontSize: 12, fontWeight: 650, color: '#475569', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.13s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
        <m.Icon size={14} />{summary(auto)}<IcoChevron />
      </button>);
  }

  /* ── Consent to Automatic ── Rendered ONCE, at App level inside .ba-app, so the absolute
     ModalOverlay is scoped to the product window whichever surface asked for it. MINIMAL since
     2026-10-14 (Arpit): what BlueAI will do, that it posts under your name, that it can be undone,
     and the agreement IS the button ("I agree, turn on", per the PM's spec), so there is no
     checkbox and no separate agreement paragraph. The per-app list lives in the mode sheet and
     in Settings, where the setting is changed. */
  function AutoConfirm() {
    const { confirming: app } = usePermissionMode();
    const a = app ? appById(app) : null;
    const btn = { flex: 1, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' };
    return (
      <ModalOverlay isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''}>
        {a && <>
          <p style={{ fontSize: 13.5, color: '#4b5563', lineHeight: 1.6 }}>BlueAI will take {a.name} jobs and finish them on your account without asking first, including posting videos. You can turn this off anytime.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button onClick={cancelConfirm} style={{ ...btn, background: 'white', border: '1px solid #e2e8f0', color: '#374151' }}>Cancel</button>
            <button onClick={agreeAuto} style={{ ...btn, background: ACCENT, border: 'none', color: 'white' }}>I agree, turn on</button>
          </div>
        </>}
      </ModalOverlay>);
  }

  /* ── Version 2: the Automatic ribbon ── Sits above the composer, only in a chat where the BlueAI
     worker has started and only while Automatic is on for some app (Abhisht, 2026-10-05): the
     setting belongs to the worker skill, not to the product, so it shows up where the worker is
     working and nowhere else. One line (Arpit, 2026-10-14): "Automatic on YouTube", or a count
     once several apps are on, then "Change", which opens the mode sheet. Renders nothing while
     every app is on Always ask. */
  function AutoRibbon() {
    const { autoApps: on } = usePermissionMode();
    const auto = on();
    if (!auto.length) return null;
    return (
      <div className="ba-msg-in" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, padding: '5px 5px 5px 11px', borderRadius: 10, background: '#eaf3ff', border: '1px solid #d6e6fb' }}>
        <span style={{ display: 'flex', color: '#1763c6' }}><IcoZap size={13} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: '#1763c6', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary(auto)}</span>
        <button type="button" onClick={openSheet} aria-haspopup="dialog"
          style={{ border: 'none', background: 'transparent', borderRadius: 8, padding: '3px 7px', fontSize: 12, fontWeight: 700, color: ACCENT, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.13s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(25,144,255,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Change</button>
      </div>);
  }

  window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, autoApps, requestMode, usePermissionMode, ModeChip, AutoRibbon, ModeSheet, AppSwitchList, AutoConfirm, IcoShieldCheck, IcoZap };
})();
