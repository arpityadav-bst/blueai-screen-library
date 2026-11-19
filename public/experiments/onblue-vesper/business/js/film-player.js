/* THE EXAMPLE PLAYER (2026-11-18, Abhisht: "should be able to see the examples"). Any element
   with data-film="<index into OB.FILMS>" opens that sample Short in a small player over the
   page; data-film-title names the format. The listener runs in the capture phase and stops the
   click, so a play button inside a selectable card never toggles the card. Esc, the close
   button or a click outside closes it, and focus goes back to the button that opened it. */
(function () {
  'use strict';
  var OB = window.OB, box = null, from = null;

  function close() {
    if (!box) { return; }
    var v = box.querySelector('video'); if (v) { v.pause(); }
    box.remove(); box = null;
    document.removeEventListener('keydown', onKey);
    if (from && from.isConnected) { from.focus({ preventScroll: true }); }
    from = null;
  }
  function onKey(ev) { if (ev.key === 'Escape') { ev.preventDefault(); close(); } }

  OB.playFilm = function (f, title, opener) {
    close();
    from = opener || null;
    box = document.createElement('div');
    box.className = 'ob-filmbox';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Example: ' + title);
    box.innerHTML = '<div class="ob-filmbox-card">' +
      '<video src="' + f.src + '" poster="' + f.poster + '" autoplay muted loop playsinline controls></video>' +
      '<div class="ob-filmbox-t"><small>Example</small><b>' + OB.esc(title) + '</b><span>A sample Short in this format, made by our team. Yours are made for your brand.</span></div>' +
      '<button class="ob-filmbox-x" type="button" aria-label="Close the example">' + OB.icon('close', 16) + '</button></div>';
    box.addEventListener('click', function (ev) { if (ev.target === box || ev.target.closest('.ob-filmbox-x')) { close(); } });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    box.querySelector('.ob-filmbox-x').focus({ preventScroll: true });
  };

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-film]');
    if (!b) { return; }
    ev.preventDefault(); ev.stopPropagation();
    OB.playFilm(OB.film(+b.getAttribute('data-film')), b.getAttribute('data-film-title') || '', b);
  }, true);
})();
