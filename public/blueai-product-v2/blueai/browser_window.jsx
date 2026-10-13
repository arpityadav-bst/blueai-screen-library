// BlueAI: a web browser window on the desktop (ROB-21388).
// Exports: window.BrowserWindow
//
// The app signs people in by opening the system browser, so a review of the sign-in flow has to
// show one. This is the frame only: tab strip, toolbar with the omnibox, and a page slot. What
// the page shows is signin_page.jsx's business. Styles sit in product-scene.css next to the
// other OS/third-party chrome, because none of this is product DS.

(function () {
  const I = {
    back:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>,
    fwd:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>,
    reload: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>,
    lock:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
    kebab:  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>,
    plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
    min:    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 5h10" stroke="currentColor" strokeWidth="1" /></svg>,
    max:    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" /></svg>,
    close:  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" strokeWidth="1.1" /></svg>
  };

  // url: { host, path }. The omnibox draws the host dark and the path grey, as every browser does,
  // so a reviewer can see at a glance which site each step is on.
  function BrowserWindow({ url, title, favicon, onClose, children }) {
    return (
      <div className="pscene-browser pscene-win-in" aria-label="Web browser">
        <div className="pscene-br-tabs">
          <div className="pscene-br-tab">{favicon}<span>{title}</span></div>
          <div className="pscene-br-newtab">{I.plus}</div>
          <div className="pscene-br-winbtns">
            <span className="pscene-br-winbtn">{I.min}</span>
            <span className="pscene-br-winbtn">{I.max}</span>
            <button type="button" className="pscene-br-winbtn pscene-br-winbtn--close" aria-label="Close browser" title="Close" onClick={onClose}>{I.close}</button>
          </div>
        </div>
        <div className="pscene-br-bar">
          <span className="pscene-br-nav">{I.back}</span>
          <span className="pscene-br-nav pscene-br-nav--off">{I.fwd}</span>
          <span className="pscene-br-nav">{I.reload}</span>
          <div className="pscene-br-omni">
            {I.lock}
            <span><b>{url.host}</b><i>{url.path}</i></span>
          </div>
          <span className="pscene-br-nav">{I.kebab}</span>
        </div>
        <div className="pscene-br-page">{children}</div>
      </div>
    );
  }

  window.BrowserWindow = BrowserWindow;
})();
