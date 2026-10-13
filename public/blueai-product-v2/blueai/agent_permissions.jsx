/* BlueAI — agent permissions (ROB-21350, "Agent should ask for permission once").

   One setting PER APP (Abhisht, 2026-10-12), deciding whether the BlueAI worker asks before it
   takes a paid job on that app during its daily run:
     always  Always ask (the default): the job ask waits for an answer, then the job runs to the end.
     auto    Automatic: no ask; the worker takes the job and finishes it on its own.
   YouTube is the app today; Instagram is next. A new app always starts on Always ask and has to
   be switched to Automatic on its own, and each switch is its own consent. The wording is
   "Always ask" and "Automatic" everywhere, never "Always allow", "Auto" or "Supervised".

   Where the person first picks is worker_flow.jsx's business (an onboarding question, or "Yes,
   switch to Automatic" on the daily job ask). Where they change it LATER is the question two
   versions put to the seniors (Abhisht, 2026-10-05), switched from the Preview panel's Version row:
     1 'chatbox'  ModeChip in the composer's bottom bar, in every signed-in chat (product level).
     2 'ribbon'   AutoRibbon above the composer, only in a worker chat and only while Automatic is
                  on for some app (skill level). A Settings card and a worker-card row were dropped.
   Both open the same menu: one row per app, each with its own Always ask / Automatic switch.
   Not persisted: every reload of this prototype starts a brand-new user on Always ask everywhere.
   The real app keeps the settings per account.

   Automatic is CONSENT, not a preference: with it on, BlueAI accepts jobs and acts on the person's
   account on that app (posting videos, liking, following) with nobody watching. So every way of
   turning it on for an app goes through AutoConfirm, whose "I agree, turn on" button is the
   agreement. The dialog names the app and lists every app with the setting it will have. Asked
   every time it is turned on, not once per lifetime. The agreement time is kept locally here; the
   real product records it server-side, per app.

   Exposes window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, autoApps, requestMode,
   usePermissionMode, ModeChip, AutoRibbon, AutoConfirm, IcoShieldCheck, IcoZap }. */
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
  const IcoChevron = ({ down }) =>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, transform: down ? 'rotate(180deg)' : undefined }}><polyline points="6 15 12 9 18 15" /></svg>;

  const MODES = [
    { id: 'always', title: 'Always ask', sub: 'Asks before each job starts, then runs it to the end', Icon: IcoShieldCheck },
    { id: 'auto', title: 'Automatic', sub: 'Starts and finishes jobs without asking', Icon: IcoZap }];
  const APPS = [
    { id: 'youtube', name: 'YouTube', Icon: IcoYouTube },
    { id: 'instagram', name: 'Instagram', Icon: IcoInstagram }];
  const byId = (id) => MODES.find((m) => m.id === id) || MODES[0];
  const appById = (id) => APPS.find((a) => a.id === id) || APPS[0];
  const listNames = (apps) => apps.map((a) => a.name).join(apps.length === 2 ? ' and ' : ', ');

  /* ── Store ── */
  const fresh = () => Object.fromEntries(APPS.map((a) => [a.id, 'always']));
  let modes = fresh();
  let confirming = null;     // the app whose consent dialog is up
  let afterConsent = null;   // what the asker does once the person agrees (the job card starts its job)
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const getMode = (app = 'youtube') => modes[app] || 'always';
  const autoApps = () => APPS.filter((a) => modes[a.id] === 'auto');
  function setMode(app, m) { modes = { ...modes, [appById(app).id]: byId(m).id }; confirming = null; emit(); }
  function reset() { modes = fresh(); confirming = null; afterConsent = null; emit(); }
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
    return { modes, confirming, requestMode, setMode, autoApps };
  }

  /* ── The per-app switch ── one row per app: mark, name, and a two-way segmented control. Picking
     Automatic goes through the consent for that app; Always ask applies at once. */
  function AppRows({ onPick }) {
    const { modes: cur } = usePermissionMode();
    const seg = (on) => ({ flex: 1, border: 'none', borderRadius: 6, padding: '5px 8px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', background: on ? 'white' : 'transparent', color: on ? INK : MUTED, boxShadow: on ? '0 1px 3px rgba(15,23,42,0.14)' : 'none', transition: 'background 0.13s ease, color 0.13s ease' });
    return (
      <>
        {APPS.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px' }}>
            <span style={{ display: 'flex', color: '#64748b' }}><a.Icon size={16} /></span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: INK }}>{a.name}</span>
            <div role="radiogroup" aria-label={a.name + ' mode'} style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 2, width: 172 }}>
              {MODES.map((m) => {
                const on = cur[a.id] === m.id;
                return <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => { if (!on) { if (onPick) onPick(); requestMode(a.id, m.id); } }} style={seg(on)}>{m.title}</button>;
              })}
            </div>
          </div>))}
      </>);
  }

  /* ── Mode chip + menu ── Version 1 seats it in the composer's bottom bar; Version 2's ribbon
     uses it as a bare "Change" link (`bare` + `label`). placement 'up' opens above the trigger,
     'down' below it. anchor 'row' positions the menu against the host row instead of the trigger
     (give that row position: relative), so a trigger at the row's right end can't push the menu
     off the window. The chip's own label sums the apps up: "Always ask" while nothing is
     automatic, otherwise "Automatic · YouTube". */
  function ModeChip({ placement = 'up', anchor = 'self', label, bare = false }) {
    const { autoApps: on } = usePermissionMode();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const auto = on();
    const m = byId(auto.length ? 'auto' : 'always');
    const summary = auto.length ? 'Automatic · ' + listNames(auto) : 'Always ask';

    useEffect(() => {
      if (!open) return;
      const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const key = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', down);
      document.addEventListener('keydown', key);
      return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
    }, [open]);

    return (
      <div ref={ref} style={{ position: anchor === 'row' ? 'static' : 'relative' }}>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} title="Mode"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: open ? (bare ? 'rgba(25,144,255,0.1)' : '#f1f5f9') : 'transparent', borderRadius: 8, padding: bare ? '3px 7px' : '5px 7px', fontSize: 12, fontWeight: bare ? 700 : 650, color: bare ? ACCENT : '#475569', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.13s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = bare ? 'rgba(25,144,255,0.1)' : '#f1f5f9'; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
          {bare ? label : <><m.Icon size={14} />{label || summary}<IcoChevron down={placement === 'down'} /></>}
        </button>

        {open &&
          <div role="menu" aria-label="Mode" className="ba-msg-in"
            style={{ position: 'absolute', left: -4, ...(placement === 'down' ? { top: 'calc(100% + 6px)' } : { bottom: 'calc(100% + 8px)' }), width: 364, background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 14px 34px rgba(15,23,42,0.16)', padding: 5, zIndex: 30 }}>
            <p style={{ fontSize: 11.5, fontWeight: 650, color: FAINT, padding: '6px 10px 3px' }}>Mode, per app</p>
            <AppRows onPick={() => setOpen(false)} />
            <p style={{ fontSize: 11.5, color: FAINT, lineHeight: 1.45, padding: '4px 10px 6px' }}>Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask.</p>
          </div>}
      </div>);
  }

  /* ── Consent to Automatic ── Rendered ONCE, at App level inside .ba-app, so the absolute
     ModalOverlay is scoped to the product window whichever surface asked for it. Shaped like
     Claude Code's bypass-permissions warning: what changes, then what you are agreeing to, and the
     agreement IS the button ("I agree, turn on"), so there is no checkbox to tick first. It names
     the app, and lists every app with the setting it will have, so "per app" is seen, not read. */
  function AutoConfirm() {
    const { confirming: app, modes: cur } = usePermissionMode();
    const a = app ? appById(app) : null;
    const btn = { flex: 1, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' };
    return (
      <ModalOverlay isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''}>
        {a && <>
          <p style={{ fontSize: 13.5, color: '#4b5563', lineHeight: 1.6 }}>BlueAI will accept {a.name} jobs and finish them on your {a.name} account without asking you first, including posting videos and other content.</p>
          <div style={{ marginTop: 12, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            {APPS.map((x, i) => {
              const willBeAuto = x.id === a.id || cur[x.id] === 'auto';
              return (
                <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderTop: i ? '1px solid #eef2f6' : 'none', background: x.id === a.id ? '#f5f9ff' : 'white' }}>
                  <span style={{ display: 'flex', color: '#64748b' }}><x.Icon size={15} /></span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: INK }}>{x.name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: willBeAuto ? '#1763c6' : MUTED }}>
                    {willBeAuto ? <IcoZap size={12} /> : <IcoShieldCheck size={12} />}{willBeAuto ? 'Automatic' : 'Always ask'}
                  </span>
                </div>);
            })}
          </div>
          <p style={{ fontSize: 12, color: FAINT, lineHeight: 1.5, marginTop: 7 }}>Each app has its own setting. The others stay on Always ask until you switch them.</p>
          <p style={{ fontSize: 13.5, color: '#4b5563', lineHeight: 1.6, marginTop: 10 }}>By turning this on, you agree to let BlueAI do this for you on {a.name}. You can turn it off anytime.</p>
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
     working and nowhere else. "Change" opens the same per-app menu upward, anchored to the
     ribbon's left edge. Renders nothing while every app is on Always ask. */
  function AutoRibbon() {
    const { autoApps: on } = usePermissionMode();
    const auto = on();
    if (!auto.length) return null;
    return (
      <div className="ba-msg-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, padding: '5px 5px 5px 11px', borderRadius: 10, background: '#eaf3ff', border: '1px solid #d6e6fb' }}>
        <span style={{ display: 'flex', color: '#1763c6' }}><IcoZap size={13} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#1763c6', lineHeight: 1.4 }}>Automatic is on for {listNames(auto)}. BlueAI takes paid {auto.length === 1 ? auto[0].name + ' ' : ''}jobs without asking.</span>
        <ModeChip placement="up" anchor="row" label="Change" bare />
      </div>);
  }

  window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, autoApps, requestMode, usePermissionMode, ModeChip, AutoRibbon, AutoConfirm, IcoShieldCheck, IcoZap };
})();
