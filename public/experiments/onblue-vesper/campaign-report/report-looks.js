/* THREE LOOKS OF ONE REPORT (Appy, 2026-11-16), switched from the review bar
   (Layout: 1 Refined, 2 Bento, 3 Volt). Same data and markup in all three;
   the look is html[data-look], styled from app/css/report-looks*.css, which
   the app links into the framed report. Remembered per browser. */
(function () {
  'use strict';

  var KEY = 'campaign-report:look', LOOKS = { 1: 1, 2: 1, 3: 1 };
  var look = '1';
  try { var saved = window.localStorage.getItem(KEY); if (LOOKS[saved]) { look = saved; } } catch (e) {}

  function apply() {
    document.documentElement.setAttribute('data-look', look);
    document.querySelectorAll('[data-look]').forEach(function (b) {
      if (b === document.documentElement) { return; }
      b.setAttribute('aria-pressed', b.getAttribute('data-look') === look ? 'true' : 'false');
    });
  }
  apply();

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button[data-look]');
    if (!b || !LOOKS[b.getAttribute('data-look')]) { return; }
    look = b.getAttribute('data-look');
    try { window.localStorage.setItem(KEY, look); } catch (err) {}
    apply();
    // the section bar and the chart measure themselves on resize
    window.dispatchEvent(new Event('resize'));
  });
})();
