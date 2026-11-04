/* "Back to site" with a subtle word first (Appy): leaving loses nothing (the
   report stays in this browser and the homepage offers it back), but it lives
   only in this browser. So a small popover under the link, not a blocking
   dialog. From step 3 (with the bar's save): save it, or leave anyway. Before
   that: keep going, or leave anyway. Once saved the link just leaves. */
(function () {
  'use strict';
  var OB = window.OB;
  var link = document.querySelector('.ob-runbar-exit'), save = document.querySelector('[data-save]');
  if (!link || !save) { return; }
  var end = link.parentNode, pop = null;

  function close() {
    if (!pop) { return; }
    pop.remove(); pop = null; link.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', outside, true); document.removeEventListener('keydown', key, true);
  }
  function outside(ev) { if (pop && !pop.contains(ev.target) && ev.target !== link) { close(); } }
  function key(ev) { if (ev.key === 'Escape') { ev.stopPropagation(); close(); link.focus(); } }

  link.setAttribute('aria-haspopup', 'dialog'); link.setAttribute('aria-expanded', 'false');
  link.addEventListener('click', function (ev) {
    if (save.disabled) { return; }   // saved: nothing to warn about, just go
    // before step 3 there is nothing worth an email yet (the bar's save is hidden): the main way is to keep going
    var early = save.classList.contains('is-hidden');
    ev.preventDefault();
    if (pop) { close(); return; }
    pop = document.createElement('div');
    pop.className = 'ob-exit-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Before you go');
    pop.innerHTML = '<b>Your report stays in this browser.</b><p>' + (early ? 'Pick up where you left off from the homepage, any time.' : 'Save it with your email to open it anywhere.') + '</p>' +
      '<div class="ob-exit-act"><button class="ob-btn ob-btn--sm ob-btn--ink" type="button" data-exit-save>' + (early ? 'Keep going' : 'Save my report') + '</button><a class="ob-link" href="./">Leave anyway</a></div>';
    end.appendChild(pop); link.setAttribute('aria-expanded', 'true');
    pop.querySelector('[data-exit-save]').addEventListener('click', function () { close(); if (!early) { save.click(); } });
    pop.querySelector('[data-exit-save]').focus();
    document.addEventListener('click', outside, true); document.addEventListener('keydown', key, true);
  });
  OB.runExit = { close: close };
})();
