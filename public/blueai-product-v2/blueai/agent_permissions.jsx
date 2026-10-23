/* BlueAI: agent permissions (ROB-21350, "Agent should ask for permission once").

   ONE app, YouTube, with two modes (Abhisht, 2026-10-14: "We need a UI with only one app; the one
   we had before worked"). The setting decides whether the BlueAI worker asks before it takes a
   paid YouTube job during its daily run:
     always  Always ask (the default): the job ask waits for an answer, then the job runs to the end.
     auto    Automatic: no ask; the worker takes the job and finishes it on its own.
   The wording is "Always ask" and "Auto" everywhere ("Automatic" until 2026-10-15, Abhisht), never "Always allow" or
   "Supervised". The store stays keyed by app (getMode('youtube')), so a second app later is one
   APPS entry plus a UI decision; the UI today shows YouTube only. Arpit's two-app sheet (one
   switch per app) was dropped the same day for this. A one-app bottom sheet was tried after it
   and dropped too (Abhisht: "the previous one with the dialogue was better").

   No worker question offers Automatic (Abhisht, 2026-10-14). Where the mode is switched (LOCAL
   TRIAL, Abhisht, 2026-10-23; the Preview panel's "Mode control" row or ?control= compares them):
     ribbon   (default) AppRibbon, while the worker runs on an app. The mode belongs to the app
              (YouTube today, Instagram later), so the control names that app and shows only once
              the worker is working inside it (Abhisht: "when the worker detects it's running on
              YouTube (or any app)"): the 20-day bar above the chat box tucks away and the ribbon
              takes its place, then they swap back when the run closes. Day 1's setup run never
              shows it: the person's own answers matter there, so Auto is not put in front of them.
     chatbox  ModeChip in the composer's bottom bar, in every signed-in chat (the Oct 14 call). One
              chip cannot say which app it is for, and it is there during setup too.
   The Oct 14 AutoRibbon (Automatic only) is replaced by AppRibbon, which shows in both modes.
   Both open the Oct 5 Mode menu as the design system's Popover (DESIGN.md 27): a header naming
   YouTube, one row per mode with a one-line description, a check on the current one and its
   number shortcut. Settings > Worker (back 2026-10-23, settings.jsx) lists every app with its
   own Always ask | Auto switch, the place to change it outside a run. Not persisted: every reload
   starts a brand-new user on Always ask. The real app keeps the setting per account.

   No scroll jump (the bug in Arpit's sheet): the popover opens in view above the composer, focus
   moves into it with preventScroll, and the app box is pinned to scrollTop 0 as a guard.

   Automatic is CONSENT, not a preference: with it on, BlueAI accepts jobs and acts on the person's
   YouTube account (posting videos, liking, following) with nobody watching. So every way of
   turning it on goes through AutoConfirm, whose "I agree, turn on" button is the agreement;
   Always ask applies at once. The agreement time is kept locally here; the real product records
   it server-side. The consent paragraph is Arpit's draft and still needs Abhisht's (or legal's) OK.

   Look: the "V2 today" tokens (v2_tokens.jsx).

   Exposes window.AgentPermissions = { MODES, APPS, HEADER, getMode, setMode, reset, autoApps,
   requestMode, usePermissionMode, ModeChip, AppRibbon, ModeRows, AutoConfirm, IcoShieldCheck,
   IcoZap, headerFor, arrowKeys }. */
(function () {
  const { useState, useEffect, useRef } = React;
  const T = () => window.V2Tokens;

  const stroke = (size, paths) =>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths}</svg>;
  const IcoShieldCheck = ({ size = 16 }) => stroke(size, <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>);
  const IcoZap = ({ size = 16 }) => stroke(size, <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />);
  // The app mark, in the product's own stroke style rather than the brand logo.
  const IcoYouTube = ({ size = 16 }) => stroke(size, <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>);
  const IcoCheck = ({ size = 16, color }) =>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>;
  const IcoChevron = () =>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><polyline points="6 15 12 9 18 15" /></svg>;

  /* `key` is the number shortcut shown on the popover row and honoured while it is open. */
  const MODES = [
    { id: 'always', key: '1', title: 'Always ask', sub: 'Asks before each job starts, then runs it to the end', Icon: IcoShieldCheck },
    { id: 'auto', key: '2', title: 'Auto', sub: 'Starts and finishes jobs without asking', Icon: IcoZap }];
  const APPS = [{ id: 'youtube', name: 'YouTube', Icon: IcoYouTube }];
  const APP = APPS[0];
  const headerFor = (a) => 'Mode for ' + a.name + ' jobs';
  const HEADER = headerFor(APP);
  const byId = (id) => MODES.find((m) => m.id === id) || MODES[0];
  const appById = (id) => APPS.find((a) => a.id === id) || APP;

  /* ── Store ── */
  const fresh = () => Object.fromEntries(APPS.map((a) => [a.id, 'always']));
  let modes = fresh();
  let confirming = null;     // the app whose consent dialog is up
  let confirmFrom = 'chat';  // where it was asked from: 'chat' (the ribbon or chip) or 'settings'
  let afterConsent = null;   // what the asker does once the person agrees (the job card starts its job)
  /* Mode popovers open right now (the ribbon's or the chip's). With `confirming`, it says the
     person is in the middle of choosing a mode (`choosing` below), and the chat holds the
     run-complete popup, and the ribbon, until they have picked or dismissed it (Abhisht,
     2026-10-23: "don't overwrite the choosing popup, wait for the user's input"). */
  let popovers = 0;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const getMode = (app = APP.id) => modes[app] || 'always';
  const autoApps = () => APPS.filter((a) => modes[a.id] === 'auto');
  function setMode(app, m) { modes = { ...modes, [app in modes ? app : APP.id]: byId(m).id }; confirming = null; emit(); }
  function reset() { modes = fresh(); confirming = null; afterConsent = null; emit(); }
  // `then` runs only if the mode actually changes; Cancel on the consent drops it.
  function requestMode(app, m, then, from = 'chat') {
    if (m === 'auto' && getMode(app) !== 'auto') { confirming = app; confirmFrom = from; afterConsent = then || null; emit(); return; }
    setMode(app, m); if (then) then();
  }
  function agreeAuto() {
    const app = confirming, then = afterConsent; afterConsent = null;
    try { localStorage.setItem('blueai_auto_consent_' + app, new Date().toISOString()); } catch (e) { /* stand-in for the server-side record */ }
    setMode(app, 'auto'); if (then) then();
  }
  function cancelConfirm() { confirming = null; afterConsent = null; emit(); }
  const popoverOpened = (on) => { popovers = Math.max(0, popovers + (on ? 1 : -1)); emit(); };
  function usePermissionMode() {
    const [, bump] = useState(0);
    useEffect(() => { const f = () => bump((n) => n + 1); subs.add(f); return () => { subs.delete(f); }; }, []);
    return { modes, confirming, confirmFrom, requestMode, setMode, autoApps, choosing: popovers > 0 || !!confirming };
  }

  /* ── The mode rows ── a radio group, one row per mode: icon, title, one-line description, a check
     on the current one and (in the popover) its number shortcut. Picking Automatic goes through
     the consent; Always ask applies at once. Up/Down move between the rows. */
  // Arrow keys move focus between a radio group's options (here, and Settings' per-app switches).
  function arrowKeys(e) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const rows = Array.from(e.currentTarget.querySelectorAll('[role="radio"]'));
    const i = rows.indexOf(document.activeElement);
    const next = rows[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : rows.length - 1)) % rows.length];
    if (next) next.focus({ preventScroll: true });
  }
  function ModeRows({ onPick, keys = false, app = APP }) {
    const t = T();
    const { modes: cur } = usePermissionMode();
    const now = cur[app.id];
    const choose = (id) => { if (onPick) onPick(id); if (id !== now) requestMode(app.id, id); };
    return (
      <div role="radiogroup" aria-label={headerFor(app)} onKeyDown={arrowKeys}>
        {MODES.map((x) => {
          const on = x.id === now;
          return (
            <button key={x.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} className="ba-mode-row" onClick={() => choose(x.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: on ? t.select : 'transparent', borderRadius: t.radiusSm, padding: '8px 10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = t.washHover; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ display: 'flex', color: t.ink3 }}><x.Icon size={t.iconSm} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: t.text14, fontWeight: t.wSemibold, color: t.ink, lineHeight: 1.3 }}>{x.title}</span>
                <span style={{ display: 'block', fontSize: t.text12, color: t.ink3, lineHeight: 1.35, marginTop: 1 }}>{x.sub}</span>
              </span>
              <span style={{ width: 16, display: 'flex' }}>{on && <IcoCheck color={t.action} />}</span>
              {keys && <span aria-hidden="true" style={{ fontSize: t.text11, fontWeight: t.wMedium, color: t.ink4, width: 10, textAlign: 'right' }}>{x.key}</span>}
            </button>);
        })}
      </div>);
  }

  /* ── The mode popover ── anchored ABOVE its nearest positioned ancestor (the composer box for the
     chip, the ribbon for Change), at its left edge, min(364, that box) wide. A non-modal dialog
     named by its header, for one app (the job's, from the ribbon). Focus moves to the current row
     on open, without scrolling; Esc closes and returns focus to the button; an outside click or
     focus leaving closes it; 1 and 2 pick. */
  // Darker than the design system's shadow-1 (Abhisht, 2026-10-14), so the popover lifts clearly
  // off the white chat behind it: a deep soft cast plus a tight contact shadow.
  const POP_SHADOW = '0 16px 40px rgba(15,23,42,0.28), 0 3px 10px rgba(15,23,42,0.14)';
  function ModePopover({ triggerRef, onClose, app = APP }) {
    const t = T();
    const ref = useRef(null);
    const back = () => { const b = triggerRef.current; if (b && b.isConnected) b.focus({ preventScroll: true }); };
    const pick = (id) => { onClose(); if (id === 'always') setTimeout(back, 0); };
    useEffect(() => {
      popoverOpened(true);
      const panel = ref.current;
      const win = panel && panel.closest('.ba-app');
      const pin = () => { if (win) { win.scrollTop = 0; win.scrollLeft = 0; } };
      const row = panel && (panel.querySelector('[role="radio"][aria-checked="true"]') || panel.querySelector('[role="radio"]'));
      if (row) row.focus({ preventScroll: true });
      pin();
      const down = (e) => {
        if (panel.contains(e.target) || (triggerRef.current && triggerRef.current.contains(e.target))) return;
        onClose();
      };
      const key = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); onClose(); back(); return; }
        if (/^(INPUT|TEXTAREA)$/.test((e.target && e.target.tagName) || '')) return;
        const hit = MODES.find((x) => x.key === e.key);
        if (hit) { e.preventDefault(); pick(hit.id); if (hit.id !== getMode(app.id)) requestMode(app.id, hit.id); }
      };
      document.addEventListener('mousedown', down);
      document.addEventListener('keydown', key);
      return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); pin(); popoverOpened(false); };
    }, []);
    return (
      <div ref={ref} role="dialog" aria-labelledby="ap-mode-head" tabIndex={-1} className="ba-msg-in"
        onBlur={(e) => { const to = e.relatedTarget; if (to && !e.currentTarget.contains(to) && !(triggerRef.current && triggerRef.current.contains(to))) onClose(); }}
        style={{ position: 'absolute', left: 0, bottom: 'calc(100% + 8px)', width: t.popoverW, maxWidth: '100%', boxSizing: 'border-box', background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusMd, boxShadow: POP_SHADOW, padding: 4, zIndex: t.zPopover, outline: 'none', textAlign: 'left' }}>
        <p id="ap-mode-head" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: t.text12, fontWeight: t.wMedium, color: t.ink3, padding: '7px 10px 5px' }}>
          <app.Icon size={14} />{headerFor(app)}</p>
        <ModeRows keys onPick={pick} app={app} />
      </div>);
  }

  /* ── Version 1: the Mode chip ── sits in the composer's bottom bar and shows the mode itself:
     "Always ask" or "Automatic". It opens the mode popover above the composer. */
  function ModeChip() {
    const t = T();
    usePermissionMode();
    const m = byId(getMode());
    const [open, setOpen] = useState(false);
    const btn = useRef(null);
    return (
      <>
        <button ref={btn} type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open} title={HEADER}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: t.hitMin, border: 'none', background: open ? t.washHover : 'transparent', borderRadius: t.radiusSm, padding: '0 8px', fontSize: t.text13, fontWeight: t.wMedium, color: t.ink2, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
          <span style={{ display: 'flex', color: t.ink3 }}><m.Icon size={t.iconSm} /></span>{m.title}<IcoChevron />
        </button>
        {open && <ModePopover triggerRef={btn} onClose={() => setOpen(false)} />}
      </>);
  }

  /* ── Consent to Automatic ── Rendered ONCE, at App level inside .ba-app, so the absolute
     ModalOverlay is scoped to the product window whichever surface asked for it. MINIMAL (Arpit,
     2026-10-14): what BlueAI will do, that it posts under your name, that it can be undone, and
     the agreement IS the button ("I agree, turn on"), so there is no checkbox and no separate
     agreement paragraph. Buttons: the design system's 44px pair, Cancel then the primary.
     Asked from chat (the ribbon or the chip), one more line says where else it can be changed
     (Abhisht, 2026-10-23: only in the chat one, not when the person is already in Settings), and
     the body drops "You can turn this off anytime.", which that line covers; Settings keeps it. */
  function AutoConfirm() {
    const t = T();
    const { confirming: app, confirmFrom: from } = usePermissionMode();
    const a = app ? (APPS.find((x) => x.id === app) || APP) : null;
    const btn = { flex: '1 1 0', minWidth: 0, height: t.controlLg, borderRadius: t.radiusSm, padding: '0 16px', fontSize: t.text13, fontWeight: t.wMedium, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard };
    return (
      <ModalOverlay isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''}>
        {a && <>
          <p style={{ fontSize: t.text14, color: t.ink2, lineHeight: t.leadingBody }}>BlueAI will take {a.name} jobs and finish them on your account without asking first, including posting videos.{from === 'settings' ? ' You can turn this off anytime.' : ''}</p>
          {from !== 'settings' && <p style={{ fontSize: t.text13, color: t.ink3, lineHeight: t.leadingBody, marginTop: t.space2 }}>You can change this anytime in Settings &gt; Job Approval.</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={cancelConfirm} style={{ ...btn, background: t.surface, border: t.stroke + 'px solid ' + t.lineStrong, color: t.ink }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.surface; }}>Cancel</button>
            <button onClick={agreeAuto} style={{ ...btn, background: t.action, border: t.stroke + 'px solid ' + t.action, color: t.onColor }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.actionHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.action; }}>I agree, turn on</button>
          </div>
        </>}
      </ModalOverlay>);
  }

  /* ── The app ribbon (LOCAL TRIAL, Abhisht, 2026-10-23) ── Takes the 20-day bar's place above the
     chat box while the worker runs on an app (chat_product.jsx does the swap), in both modes. One
     line: the mode and the app, "Always ask on YouTube" or "Auto on YouTube" (the Oct 14 ribbon's
     "Automatic on YouTube" with the mode's Oct 15 name), then "Change", which opens that app's
     mode popover above the ribbon. The same 36px box as the bar, so the swap never moves the
     thread. Always ask is the bar's white; Auto is blue-tinted: BlueAI is acting on its own.
     `hidden` closes an open popover as the ribbon leaves. */
  function AppRibbon({ app: appId = APP.id, hidden = false }) {
    const t = T();
    usePermissionMode();
    const a = appById(appId);
    const m = byId(getMode(a.id));
    const auto = m.id === 'auto';
    const [open, setOpen] = useState(false);
    const btn = useRef(null);
    useEffect(() => { if (hidden) setOpen(false); }, [hidden]);
    const ease = t.dur2 + 'ms ' + t.easeStandard;
    return (
      <div role="status" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: t.space2, height: 36, boxSizing: 'border-box', padding: '0 1px 0 10px', borderRadius: t.radiusMd, background: auto ? t.blueTint : t.surface, border: t.stroke + 'px solid ' + (auto ? t.blueTintLine : t.line), boxShadow: auto ? 'none' : t.shadow0, transition: 'background ' + ease + ', border-color ' + ease }}>
        <span style={{ display: 'flex', color: auto ? t.blueInk : t.ink3 }}><m.Icon size={t.iconSm} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: t.text13, fontWeight: t.wMedium, color: auto ? t.blueInk : t.ink2, lineHeight: t.leadingSnug, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title} on {a.name}</span>
        <button ref={btn} type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open} aria-label={'Change the mode for ' + a.name + ' jobs'}
          style={{ height: t.hitMin, border: 'none', background: open ? t.washHover : 'transparent', borderRadius: t.radiusSm, padding: '0 8px', fontSize: t.text13, fontWeight: t.wMedium, color: t.blueInk, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}>Change</button>
        {open && <ModePopover triggerRef={btn} onClose={() => setOpen(false)} app={a} />}
      </div>);
  }

  window.AgentPermissions = { MODES, APPS, HEADER, getMode, setMode, reset, autoApps, requestMode, usePermissionMode, ModeChip, AppRibbon, ModeRows, AutoConfirm, IcoShieldCheck, IcoZap, headerFor, arrowKeys };
})();
