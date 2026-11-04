/* "Continue with Google" the way it behaves for real: Google's account chooser
   in a small popup window over the page (app/google.html, a prototype stand-in,
   framed here so it looks and closes the same in every browser; a real
   window.open popup became a full tab with no way back in the in-app browser).
   The chooser hands the chosen email back and the window closes; the close
   button, Esc or a click outside cancel it.
   OB.google(hint, onPick): hint pre-lists an address the page already knows
   (passed through local storage, never the URL). */
(function () {
  'use strict';
  var OB = window.OB, pending = null, pop = null, back = null;
  var css = '.ob-gpop{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:1rem;background:rgba(10,10,9,0.42);opacity:0;transition:opacity 0.2s ease}' +
    '.ob-gpop.is-on{opacity:1}' +
    '.ob-gwin{display:flex;flex-direction:column;width:min(28.125rem,100%);height:min(37.5rem,calc(100dvh - 2rem));overflow:hidden;border-radius:0.75rem;background:#fff;box-shadow:0 1.5rem 4rem -1rem rgba(10,10,9,0.5),0 0 0 1px rgba(10,10,9,0.08);transform:translateY(0.5rem) scale(0.98);transition:transform 0.25s var(--ease)}' +
    '.ob-gpop.is-on .ob-gwin{transform:none}' +
    '.ob-gbar{display:flex;align-items:center;gap:0.5rem;height:2.5rem;padding:0 0.25rem 0 0.875rem;border-bottom:1px solid #e3e3e3;background:#f8f9fa;color:#444746;font:400 0.8125rem/1 Roboto,Arial,sans-serif}' +
    '.ob-gbar svg{flex:none}' +
    '.ob-gbar span{flex:1}' +
    '.ob-gbar button{display:grid;place-items:center;width:2.75rem;height:2.5rem;border:0;border-radius:0.5rem;background:none;color:#444746;cursor:pointer}' +
    '.ob-gbar button:hover,.ob-gbar button:focus-visible{outline:0;background:#e9eaec}' +
    '.ob-gwin iframe{flex:1;width:100%;border:0}' +
    '@media (prefers-reduced-motion:reduce){.ob-gpop,.ob-gwin{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function close() {
    if (!pop) { return; }
    var p = pop; pop = null; pending = null;
    p.classList.remove('is-on'); window.setTimeout(function () { p.remove(); }, 200);
    document.removeEventListener('keydown', esc, true);
    if (back && back.focus) { back.focus(); }
  }
  function esc(ev) { if (ev.key === 'Escape') { ev.stopImmediatePropagation(); ev.preventDefault(); close(); } }   // only this window closes, not the sign-up under it
  window.addEventListener('message', function (ev) {
    if (ev.origin !== location.origin || !ev.data || !pending) { return; }
    if (ev.data.ob === 'google-close') { close(); return; }   // Esc inside the chooser
    if (ev.data.ob !== 'google') { return; }
    var cb = pending; close(); cb(String(ev.data.email || ''));
  });
  OB.google = function (hint, onPick) {
    if (pop) { return; }
    OB.store('onblue-google-hint', hint || null);
    back = document.activeElement; pending = onPick;
    var src = location.pathname.indexOf('/app/') >= 0 ? 'google.html' : 'app/google.html';
    pop = document.createElement('div');
    pop.className = 'ob-gpop';
    pop.innerHTML = '<div class="ob-gwin" role="dialog" aria-modal="true" aria-label="Sign in with Google"><div class="ob-gbar">' + OB.icon('google', 16) + '<span>Sign in with Google</span>' +
      '<button type="button" aria-label="Close" data-gclose>' + OB.icon('close', 18) + '</button></div><iframe src="' + src + '" title="Choose a Google account"></iframe></div>';
    document.body.appendChild(pop);
    pop.addEventListener('click', function (ev) { if (ev.target === pop || ev.target.closest('[data-gclose]')) { close(); } });
    document.addEventListener('keydown', esc, true);
    window.requestAnimationFrame(function () { pop.classList.add('is-on'); pop.querySelector('[data-gclose]').focus(); });
  };
})();
