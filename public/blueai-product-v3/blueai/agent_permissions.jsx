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

  /* V3 (phase 4): the worker's controls in the site's language (worker.css): a quiet chip, a
     panel-band ribbon, a sheet with one select-blue switch per app, and the consent on the button
     ladder (Cancel ghost, "I agree, turn on" solid ink). Icons take the Target stroke (.v3-ico). */
  const stroke = (size, paths) =>
    <svg className="v3-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths}</svg>;
  const IcoShieldCheck = ({ size = 16 }) => stroke(size, <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>);
  const IcoZap = ({ size = 16 }) => stroke(size, <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />);
  // App marks, in the product's own stroke style rather than brand logos.
  const IcoYouTube = ({ size = 16 }) => stroke(size, <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>);
  const IcoInstagram = ({ size = 16 }) => stroke(size, <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" /></>);
  const IcoChevron = () =>
    <svg className="v3-ico v3-mode-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="6 15 12 9 18 15" /></svg>;

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
      <ul className="v3-apps">
        {APPS.map((a) => {
          const on = cur[a.id] === 'auto';
          return (
            <li key={a.id} className="v3-app">
              <span className="v3-row-tile"><a.Icon size={18} /></span>
              <span className="v3-app-name">{a.name}</span>
              <button type="button" role="switch" aria-checked={on} aria-label={'Run ' + a.name + ' jobs without asking'} className="v3-switch"
                onClick={() => requestMode(a.id, on ? 'always' : 'auto')} />
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
      // preventScroll: the sheet is still below the window when this runs (its slide-up has just
      // started), so a plain focus() scrolled .ba-app down to reach the button, which lifted the
      // sheet into the middle and pulled the hidden free-credits panel into view.
      if (closeRef.current) closeRef.current.focus({ preventScroll: true });
      return () => { if (opener.current && opener.current.isConnected) opener.current.focus({ preventScroll: true }); };
    }, [open]);
    useEffect(() => {
      if (!open || asking) return;
      const key = (e) => { if (e.key === 'Escape') closeSheet(); };
      document.addEventListener('keydown', key);
      return () => document.removeEventListener('keydown', key);
    }, [open, asking]);
    if (!open) return null;
    return (
      <div className="v3-sheet-scrim" onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="ap-sheet-title" className="v3-sheet">
          <div className="v3-sheet-head">
            <div>
              <h2 id="ap-sheet-title" className="v3-dialog-title">Apps BlueAI can run on its own</h2>
              <p className="v3-sheet-sub">New apps always start on Always ask.</p>
            </div>
            <button ref={closeRef} type="button" onClick={closeSheet} aria-label="Close" className="v3-icon-btn v3-sheet-close"><IcoXClose size={18} /></button>
          </div>
          <div className="v3-sheet-list"><AppSwitchList /></div>
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
      <button type="button" onClick={openSheet} aria-haspopup="dialog" aria-expanded={open} title="Mode" className="v3-quiet v3-mode-chip">
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
    return (
      <ModalOverlay plain isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''}>
        {a && <>
          <p className="v3-dlg-text">BlueAI will take paid {a.name} jobs on its own and like, comment, follow and post from your account.</p>
          <p className="v3-note v3-dlg-note">Switch back anytime in Settings.</p>
          <div className="v3-btn-row v3-dlg-actions">
            <button type="button" onClick={cancelConfirm} className="v3-btn-ghost">Cancel</button>
            <button type="button" onClick={agreeAuto} className="v3-btn-solid">I agree, turn on</button>
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
      <div className="ba-msg-in v3-ribbon">
        <span className="v3-ribbon-icon"><IcoZap size={14} /></span>
        <span className="v3-ribbon-text">{summary(auto)}</span>
        <button type="button" onClick={openSheet} aria-haspopup="dialog" className="v3-quiet v3-mode-chip">Change</button>
      </div>);
  }

  window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, autoApps, requestMode, usePermissionMode, ModeChip, AutoRibbon, ModeSheet, AppSwitchList, AutoConfirm, IcoShieldCheck, IcoZap };
})();
