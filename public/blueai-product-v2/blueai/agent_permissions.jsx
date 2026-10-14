/* BlueAI: agent permissions (ROB-21350, "Agent should ask for permission once").

   ONE app, YouTube, with two modes (Abhisht, 2026-10-14: "We need a UI with only one app; the one
   we had before worked"). The setting decides whether the BlueAI worker asks before it takes a
   paid YouTube job during its daily run:
     always  Always ask (the default): the job ask waits for an answer, then the job runs to the end.
     auto    Automatic: no ask; the worker takes the job and finishes it on its own.
   The wording is "Always ask" and "Automatic" everywhere, never "Always allow", "Auto" or
   "Supervised". The store stays keyed by app (getMode('youtube')), so a second app later is one
   APPS entry plus a UI decision; the UI today shows YouTube only. Arpit's two-app sheet (one
   switch per app) was dropped the same day for this. A one-app bottom sheet was tried after it
   and dropped too (Abhisht: "the previous one with the dialogue was better").

   No worker question offers Automatic (Abhisht, 2026-10-14): the mode is switched only from
   ModeChip in the composer's bottom bar, in every signed-in chat (product level).
   ARCHIVED 2026-10-14: AutoRibbon, the one-line "Automatic on YouTube / Change" ribbon above the
   composer (worker chats only, while Automatic is on). Its code stays below and is still exported,
   but nothing renders it; chat_product.jsx notes where it went if it comes back.
   The chip opens the Oct 5 Mode menu as the design system's Popover (DESIGN.md 27): a header naming
   YouTube, one row per mode with a one-line description, a check on the current one and its
   number shortcut. (Settings' Worker card was removed 2026-10-14: the chip is the one place.) Not persisted: every reload
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
   requestMode, usePermissionMode, ModeChip, AutoRibbon, ModeRows, AutoConfirm, IcoShieldCheck,
   IcoZap }. */
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
    { id: 'auto', key: '2', title: 'Automatic', sub: 'Starts and finishes jobs without asking', Icon: IcoZap }];
  const APPS = [{ id: 'youtube', name: 'YouTube', Icon: IcoYouTube }];
  const APP = APPS[0];
  const HEADER = 'Mode for ' + APP.name + ' jobs';
  const byId = (id) => MODES.find((m) => m.id === id) || MODES[0];

  /* ── Store ── */
  const fresh = () => Object.fromEntries(APPS.map((a) => [a.id, 'always']));
  let modes = fresh();
  let confirming = null;     // the app whose consent dialog is up
  let afterConsent = null;   // what the asker does once the person agrees (the job card starts its job)
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const getMode = (app = APP.id) => modes[app] || 'always';
  const autoApps = () => APPS.filter((a) => modes[a.id] === 'auto');
  function setMode(app, m) { modes = { ...modes, [app in modes ? app : APP.id]: byId(m).id }; confirming = null; emit(); }
  function reset() { modes = fresh(); confirming = null; afterConsent = null; emit(); }
  // `then` runs only if the mode actually changes; Cancel on the consent drops it.
  function requestMode(app, m, then) {
    if (m === 'auto' && getMode(app) !== 'auto') { confirming = app; afterConsent = then || null; emit(); return; }
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

  /* ── The mode rows ── a radio group, one row per mode: icon, title, one-line description, a check
     on the current one and (in the popover) its number shortcut. Picking Automatic goes through
     the consent; Always ask applies at once. Up/Down move between the rows. */
  function ModeRows({ onPick, keys = false }) {
    const t = T();
    const { modes: cur } = usePermissionMode();
    const now = cur[APP.id];
    const choose = (id) => { if (onPick) onPick(id); if (id !== now) requestMode(APP.id, id); };
    const arrow = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const rows = Array.from(e.currentTarget.querySelectorAll('[role="radio"]'));
      const i = rows.indexOf(document.activeElement);
      const next = rows[(i + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length];
      if (next) next.focus({ preventScroll: true });
    };
    return (
      <div role="radiogroup" aria-label={HEADER} onKeyDown={arrow}>
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
     named by its header. Focus moves to the current row on open, without scrolling; Esc closes and
     returns focus to the button; an outside click or focus leaving closes it; 1 and 2 pick. */
  // Darker than the design system's shadow-1 (Abhisht, 2026-10-14), so the popover lifts clearly
  // off the white chat behind it: a deep soft cast plus a tight contact shadow.
  const POP_SHADOW = '0 16px 40px rgba(15,23,42,0.28), 0 3px 10px rgba(15,23,42,0.14)';
  function ModePopover({ triggerRef, onClose }) {
    const t = T();
    const ref = useRef(null);
    const back = () => { const b = triggerRef.current; if (b && b.isConnected) b.focus({ preventScroll: true }); };
    const pick = (id) => { onClose(); if (id === 'always') setTimeout(back, 0); };
    useEffect(() => {
      const panel = ref.current;
      const app = panel && panel.closest('.ba-app');
      const pin = () => { if (app) { app.scrollTop = 0; app.scrollLeft = 0; } };
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
        if (hit) { e.preventDefault(); pick(hit.id); if (hit.id !== getMode()) requestMode(APP.id, hit.id); }
      };
      document.addEventListener('mousedown', down);
      document.addEventListener('keydown', key);
      return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); pin(); };
    }, []);
    return (
      <div ref={ref} role="dialog" aria-labelledby="ap-mode-head" tabIndex={-1} className="ba-msg-in"
        onBlur={(e) => { const to = e.relatedTarget; if (to && !e.currentTarget.contains(to) && !(triggerRef.current && triggerRef.current.contains(to))) onClose(); }}
        style={{ position: 'absolute', left: 0, bottom: 'calc(100% + 8px)', width: t.popoverW, maxWidth: '100%', boxSizing: 'border-box', background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusMd, boxShadow: POP_SHADOW, padding: 4, zIndex: t.zPopover, outline: 'none', textAlign: 'left' }}>
        <p id="ap-mode-head" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: t.text12, fontWeight: t.wMedium, color: t.ink3, padding: '7px 10px 5px' }}>
          <APP.Icon size={14} />{HEADER}</p>
        <ModeRows keys onPick={pick} />
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
     agreement paragraph. Buttons: the design system's 44px pair, Cancel then the primary. */
  function AutoConfirm() {
    const t = T();
    const { confirming: app } = usePermissionMode();
    const a = app ? (APPS.find((x) => x.id === app) || APP) : null;
    const btn = { flex: '1 1 0', minWidth: 0, height: t.controlLg, borderRadius: t.radiusSm, padding: '0 16px', fontSize: t.text13, fontWeight: t.wMedium, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard };
    return (
      <ModalOverlay isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''}>
        {a && <>
          <p style={{ fontSize: t.text14, color: t.ink2, lineHeight: t.leadingBody }}>BlueAI will take {a.name} jobs and finish them on your account without asking first, including posting videos. You can turn this off anytime.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={cancelConfirm} style={{ ...btn, background: t.surface, border: t.stroke + 'px solid ' + t.lineStrong, color: t.ink }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.surface; }}>Cancel</button>
            <button onClick={agreeAuto} style={{ ...btn, background: t.action, border: t.stroke + 'px solid ' + t.action, color: t.onColor }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.actionHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.action; }}>I agree, turn on</button>
          </div>
        </>}
      </ModalOverlay>);
  }

  /* ── ARCHIVED (2026-10-14, not rendered): Version 2, the Automatic ribbon ── Sits above the composer, only in a chat where the BlueAI
     worker has started and only while Automatic is on (Abhisht, 2026-10-05): the setting belongs to
     the worker skill, so it shows up where the worker is working and nowhere else. One line
     (Arpit, 2026-10-14), "Automatic on YouTube", then "Change", which opens the mode popover above
     the ribbon. Renders nothing in Always ask, so switching back makes it disappear. */
  function AutoRibbon() {
    const t = T();
    usePermissionMode();
    const [open, setOpen] = useState(false);
    const btn = useRef(null);
    if (getMode() !== 'auto') return null;
    return (
      <div className="ba-msg-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '4px 4px 4px 12px', borderRadius: t.radiusMd, background: t.blueTint, border: t.stroke + 'px solid ' + t.blueTintLine }}>
        <span style={{ display: 'flex', color: t.blueInk }}><IcoZap size={t.iconSm} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: t.text13, fontWeight: t.wMedium, color: t.blueInk, lineHeight: t.leadingSnug, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Automatic on {APP.name}</span>
        <button ref={btn} type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open}
          style={{ minHeight: t.hitMin, border: 'none', background: open ? t.washHover : 'transparent', borderRadius: t.radiusSm, padding: '0 8px', fontSize: t.text13, fontWeight: t.wMedium, color: t.blueInk, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}>Change</button>
        {open && <ModePopover triggerRef={btn} onClose={() => setOpen(false)} />}
      </div>);
  }

  window.AgentPermissions = { MODES, APPS, HEADER, getMode, setMode, reset, autoApps, requestMode, usePermissionMode, ModeChip, AutoRibbon, ModeRows, AutoConfirm, IcoShieldCheck, IcoZap };
})();
