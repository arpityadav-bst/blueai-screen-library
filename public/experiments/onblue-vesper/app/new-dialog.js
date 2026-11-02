/* One confirm dialog for the app (plan 5.6 .app-dialog): "Switch to Video
   growth?" in the wizard, "Delete this draft?" on Campaigns. A native
   <dialog> opened with showModal(), so focus is trapped, Escape keeps, and
   focus goes back to the button that opened it. Keep is focused first, so
   pressing Enter by reflex never deletes anything. */
(function () {
  'use strict';

  var esc = function (s) { return window.onblueApp ? window.onblueApp.esc(s) : String(s); };

  function el() {
    var d = document.getElementById('app-dialog');
    if (d) { return d; }
    d = document.createElement('dialog');
    d.id = 'app-dialog';
    d.className = 'app-dialog';
    d.setAttribute('aria-labelledby', 'app-dialog-t');
    d.setAttribute('aria-describedby', 'app-dialog-b');
    document.body.appendChild(d);
    return d;
  }

  // o: { title, body, keep, go, danger, onGo }
  window.onblueConfirm = function (o) {
    var d = el();
    d.innerHTML = '<form method="dialog">'
      + '<h2 class="app-dialog-title" id="app-dialog-t">' + esc(o.title) + '</h2>'
      + '<p class="app-dialog-body" id="app-dialog-b">' + esc(o.body) + '</p>'
      + '<div class="app-dialog-foot">'
      + '<button class="app-btn" value="keep" autofocus>' + esc(o.keep) + '</button>'
      + '<button class="app-btn ' + (o.danger ? 'app-btn--danger' : 'app-btn--solid') + '" value="go">' + esc(o.go) + '</button>'
      + '</div></form>';
    d.returnValue = '';
    d.onclose = function () { if (d.returnValue === 'go' && o.onGo) { o.onGo(); } };
    // a click on the scrim, outside the box, is a Keep
    d.onclick = function (e) { if (e.target === d) { d.close('keep'); } };
    if (typeof d.showModal === 'function') { d.showModal(); }
    else if (window.confirm(o.title + ' ' + o.body) && o.onGo) { o.onGo(); }
  };
})();
