/* A campaign's frame only ever shows the PM's screen it was opened on.
   His pages link out (Back to the site, Log out, his logo): followed inside the
   frame, the homepage loaded INSIDE the app, under the report skin and his
   hidden header, and read as a broken page (Appy, 2026-11-05). Any way out of
   his screen now leaves the app as a whole page instead. Runs after
   report-frame.js, so its own "back to the list" and sample links come first. */
(function () {
  'use strict';

  var frame = document.getElementById('pm-report');
  if (!frame) { return; }

  function pathOf(u) { try { return new URL(u, location.href).pathname; } catch (e) { return ''; } }
  function leave(href) {
    frame.style.visibility = 'hidden';
    window.location.href = href;
  }

  frame.addEventListener('load', function () {
    var win, doc;
    try { win = frame.contentWindow; doc = frame.contentDocument; } catch (e) { return; }
    if (!win || !doc) { return; }
    var home = pathOf(frame.src);
    // the frame ended up somewhere else (a script of his navigated it): go there for real
    if (home && win.location.pathname !== home) { leave(win.location.href); return; }
    // a plain link out of his screen opens at the top, never in the frame
    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self')) { return; }
      var url;
      try { url = new URL(a.getAttribute('href'), doc.baseURI); } catch (err) { return; }
      if (url.origin !== location.origin || url.pathname === win.location.pathname) { return; }
      e.preventDefault();
      leave(url.href);
    });
  });
})();
