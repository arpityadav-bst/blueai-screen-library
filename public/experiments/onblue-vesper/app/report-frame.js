/* The PM's report in the app's frame (campaign.html). His page is used as it
   is; this only adjusts it from the outside, once it has loaded:
   - his top bar goes (the app's sidebar is the frame now), and his page
     background gives way to the content area's tone;
   - his "All campaigns" link leaves the frame for the app's Campaigns page.
   Same origin, so the frame's document is ours to read. His files are not
   touched. */
(function () {
  'use strict';

  var frame = document.getElementById('pm-report');
  if (!frame) { return; }

  frame.addEventListener('load', function () {
    var doc;
    try { doc = frame.contentDocument; } catch (e) { doc = null; }
    if (doc) {
      var s = doc.createElement('style');
      s.textContent = 'header.top { display: none !important; } body { background: transparent !important; }';
      doc.head.appendChild(s);
      doc.querySelectorAll('a.back').forEach(function (a) {
        a.setAttribute('href', '../app/campaigns.html');
        a.setAttribute('target', '_top');
      });
    }
    // shown even if the frame could not be read, so the report is never hidden
    frame.classList.add('is-ready');
  });
})();
