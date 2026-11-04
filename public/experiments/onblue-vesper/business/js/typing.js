/* The hero field's placeholder, with breathing room (Appy): it rests on
   "yourwebsite.com" for 5 s, then types out three example sites one after
   another (type, pause, delete), then rests again. Only while the field is
   empty and not focused; clicking in stops it on "yourwebsite.com". */
(function () {
  'use strict';
  var input = document.querySelector('.ob-hero [data-site-input]');
  if (!input) { return; }
  var REST = 'yourwebsite.com', SITES = ['northlinecoffee.com', 'glowtheory.com', 'ironcladgames.com', 'wanderco.travel', 'pulseclub.fit'];
  var STEP = 70, REST_TICKS = Math.round(5000 / STEP), PER_ROUND = 3;
  var si = 0, ci = 0, dir = 1, hold = REST_TICKS, shown = 0, resting = true;
  window.setInterval(function () {
    if (input.value || document.activeElement === input) { return; }
    if (hold > 0) { hold--; return; }
    if (resting) { resting = false; ci = 0; dir = 1; }
    var w = SITES[si];
    ci += dir;
    if (ci >= w.length) { dir = -1; hold = 18; }              // a beat on the full site
    if (ci <= 0) {                                            // deleted: next site, or back to rest
      si = (si + 1) % SITES.length; shown++; dir = 1;
      if (shown % PER_ROUND === 0) { resting = true; hold = REST_TICKS; input.placeholder = REST; return; }
      hold = 3;
    }
    input.placeholder = w.slice(0, Math.max(ci, 0)) || ' ';
  }, STEP);
  input.placeholder = REST;
  input.addEventListener('focus', function () { input.placeholder = REST; });
})();
