/* BlueAI: agent permissions (ROB-21350, "Agent should ask for permission once").

   ONE app, YouTube, with two modes (PM, 2026-10-14: "We need a UI with only one app"). The setting
   decides whether the BlueAI worker asks before it takes a paid YouTube job during its daily run:
     always  Always ask (the default): the job ask waits for an answer, then the job runs to the end.
     auto    Automatic: no ask; the worker takes the job and finishes it on its own.
   The wording is "Always ask" and "Automatic" everywhere, never "Always allow", "Auto" or
   "Supervised". The store stays keyed by app (getMode('youtube')), so a second app later is one
   APPS entry plus a UI decision; the UI shows YouTube only.

   The ONE place the mode is changed (PM, 2026-10-14): ModeChip in the composer's bottom bar, in
   every signed-in chat. No worker question offers Automatic, Settings has no Worker card, and the
   Automatic ribbon and the per-app sheet are gone. The chip opens the mode popover (the kit's
   Popover, design-md 27): a header naming YouTube, one row per mode with a one-line description, a
   check on the current one and its number shortcut. Not persisted: every reload starts a brand-new
   user on Always ask. The real app keeps the setting per account.

   Automatic is CONSENT, not a preference: with it on, BlueAI accepts jobs and acts on the person's
   YouTube account with nobody watching. So turning it on goes through AutoConfirm, whose "I agree,
   turn on" button is the agreement; Always ask applies at once. The agreement time is kept locally
   here; the real product records it server-side.

   Exposes window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, requestMode,
   usePermissionMode, ModeChip, AutoConfirm }. */
(function () {
  const { useState, useEffect, useRef } = React;

  /* V3: the chip is a quiet kit button, the popover the kit's Popover with kit menu rows (radio
     rows, worker.css .v3-mode-row), the consent on the button ladder (Cancel secondary, "I agree,
     turn on" primary). Every glyph is the kit's Icon by name. */
  const Icon = (p) => React.createElement(window.V2Kit.Icon, p);

  /* `key` is the number shortcut shown on the popover row and honoured while it is open. */
  const MODES = [
    { id: 'always', key: '1', title: 'Always ask', sub: 'Asks before each job starts, then runs it to the end', icon: 'shield-check' },
    { id: 'auto', key: '2', title: 'Automatic', sub: 'Starts and finishes jobs without asking', icon: 'zap' }];
  const APPS = [{ id: 'youtube', name: 'YouTube', icon: 'youtube' }];
  const APP = APPS[0];
  const HEADER = 'Mode for ' + APP.name + ' jobs';
  const byId = (id) => MODES.find((m) => m.id === id) || MODES[0];

  /* ── Store ── */
  const fresh = () => Object.fromEntries(APPS.map((a) => [a.id, 'always']));
  let modes = fresh();
  let confirming = null;     // the app whose consent dialog is up
  let afterConsent = null;   // what the asker does once the person agrees
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const getMode = (app = APP.id) => modes[app] || 'always';
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
    return { modes, confirming, requestMode, setMode };
  }

  /* ── The mode rows ── a radio group, one kit menu row per mode: icon, title, one-line description,
     a check on the current one and its number shortcut. Picking Automatic goes through the consent;
     Always ask applies at once. Up and Down move between the rows, 1 and 2 pick. The current row
     takes focus on open (after the kit Popover's own focus-on-open, hence the frame). */
  function ModeRows({ onPick }) {
    const now = getMode();
    const box = useRef(null);
    useEffect(() => {
      const id = requestAnimationFrame(() => {
        const row = box.current && box.current.querySelector('[aria-checked="true"]');
        if (row) row.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(id);
    }, []);
    const choose = (id) => { onPick(id); if (id !== now) requestMode(APP.id, id); };
    const onKey = (e) => {
      const hit = MODES.find((x) => x.key === e.key);
      if (hit) { e.preventDefault(); choose(hit.id); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const rows = Array.from(e.currentTarget.querySelectorAll('[role="radio"]'));
      const i = rows.indexOf(document.activeElement);
      const next = rows[(i + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length];
      if (next) next.focus({ preventScroll: true });
    };
    return (
      <div ref={box} role="radiogroup" aria-label={HEADER} onKeyDown={onKey}>
        {MODES.map((x) => {
          const on = x.id === now;
          return (
            <button key={x.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              className={'v2-menu-item v3-mode-row' + (on ? ' is-current' : '')} onClick={() => choose(x.id)}>
              <span className="v2-menu-icon"><Icon name={x.icon} /></span>
              <span className="v2-menu-label">
                <span className="v3-mode-title">{x.title}</span>
                <span className="v3-mode-sub">{x.sub}</span>
              </span>
              <span className="v3-mode-check">{on && <Icon name="check" />}</span>
              <span className="v2-menu-hint" aria-hidden="true">{x.key}</span>
            </button>);
        })}
      </div>);
  }

  /* ── The Mode chip ── sits in the composer's bottom bar and shows the mode itself ("Always ask" or
     "Automatic"). It opens the mode popover above the composer; Esc, an outside click or focus
     leaving closes it (the kit Popover). Picking Always ask closes it and returns focus to the
     chip; picking Automatic closes it for the consent dialog, which takes focus. */
  function ModeChip() {
    usePermissionMode();
    const m = byId(getMode());
    const [open, setOpen] = useState(false);
    const wrap = useRef(null);
    const pick = (id) => {
      setOpen(false);
      if (id === 'always') setTimeout(() => { const b = wrap.current && wrap.current.querySelector('button'); if (b) b.focus({ preventScroll: true }); }, 0);
    };
    return (
      <span ref={wrap}>
        <window.V2Kit.Popover placement="up" align="start" open={open} onOpenChange={setOpen} label={HEADER}
          header={<span className="v3-mode-head"><Icon name={APP.icon} />{HEADER}</span>}
          trigger={(t) =>
            <button type="button" title={HEADER} {...t} className="v2-button v2-button--quiet v2-button--sm">
              <Icon name={m.icon} />{m.title}<Icon name="chevron-up" className="v3-mode-chev" />
            </button>}>
          <ModeRows onPick={pick} />
        </window.V2Kit.Popover>
      </span>);
  }

  /* ── Consent to Automatic ── Rendered ONCE, at App level inside .ba-app, so the absolute
     ModalOverlay is scoped to the product window. MINIMAL since 2026-10-14 (Arpit): what BlueAI will
     do, that it posts under your name, that it can be undone, and the agreement IS the button ("I
     agree, turn on", per the PM's spec), so there is no checkbox and no separate agreement
     paragraph. The body describes the dialog (aria-describedby). */
  function AutoConfirm() {
    const { confirming: app } = usePermissionMode();
    const a = app ? (APPS.find((x) => x.id === app) || APP) : null;
    return (
      <ModalOverlay plain isOpen={!!app} onClose={cancelConfirm} title={a ? 'Run ' + a.name + ' jobs automatically?' : ''} describedBy="ap-consent-body">
        {a && <>
          <p id="ap-consent-body" className="v2-text-body">BlueAI will take paid {a.name} jobs on its own and like, comment, follow and post from your account.</p>
          <p className="v2-text-body-sm v3-dlg-note">You can turn this off anytime.</p>
          <div className="v3-btn-row v3-dlg-actions">
            <button type="button" onClick={cancelConfirm} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
            <button type="button" onClick={agreeAuto} className="v2-button v2-button--primary v2-button--lg">I agree, turn on</button>
          </div>
        </>}
      </ModalOverlay>);
  }

  window.AgentPermissions = { MODES, APPS, getMode, setMode, reset, requestMode, usePermissionMode, ModeChip, AutoConfirm };
})();
