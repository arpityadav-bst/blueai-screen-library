/* BlueAI: a Windows 11 notification (toast) at the bottom right of the desktop (Oct 2026 worker
   sheet, row 2, built 2026-10-12). A scheduled worker run ends with nobody watching, so the chat's
   day-done card alone would be missed; this is the surface that reaches the person.

   OS chrome, not product UI: the styles live in product-scene.css with the rest of the desktop.
   Exposes window.DesktopToast. Props: title, body, onOpen (a click anywhere on it brings BlueAI
   up), onClose (after the ✕ or the auto-dismiss), ms (auto-dismiss; Windows keeps a toast about
   5 s, a little longer here so a reviewer can read it). */
(function () {
  const { useEffect, useState } = React;

  function DesktopToast({ title, body, onOpen, onClose, ms = 8000 }) {
    const [leaving, setLeaving] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => setLeaving(true), ms);
      return () => clearTimeout(t);
    }, []);
    useEffect(() => {
      if (!leaving) return;
      const t = setTimeout(() => { if (onClose) onClose(); }, 260);
      return () => clearTimeout(t);
    }, [leaving]);

    return (
      <div className={'pscene-toast' + (leaving ? ' pscene-toast--out' : '')} role="status" onClick={onOpen}>
        <div className="pscene-toast-head">
          <img src="assets/Logo.png" alt="" draggable="false" />
          <span>BlueAI</span>
          <i>now</i>
          <button type="button" aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setLeaving(true); }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
          </button>
        </div>
        <p className="pscene-toast-title">{title}</p>
        <p className="pscene-toast-body">{body}</p>
      </div>);
  }

  window.DesktopToast = DesktopToast;
})();
