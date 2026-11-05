/* "onBlue versus everything else" as a FACE-OFF (Appy picked it from three):
   onBlue against one rival at a time, chosen from the tabs; onBlue's column is
   lit like the screen glow; yes is a volt dot, partly a halftone dot, no an
   empty ring; the rows slide in when the section comes into view and again on
   every switch. The data is site-parts.js's (OB.COMPARE). */
(function () {
  'use strict';
  var OB = window.OB, C = OB && OB.COMPARE;
  if (!C) { return; }
  var e = OB.esc;
  var face = document.querySelector('[data-cmp-face]');
  var sec = face && face.closest('section');
  var FEAT = C.ROWS.filter(function (r) { return /^[ypn]$/.test(r[1]); });
  var WORDS = C.ROWS.filter(function (r) { return !/^[ypn]$/.test(r[1]); });
  // a word answer like "$8 per 1,000 verified views" splits into the figure and its
  // unit on two lines, so the lit column never wraps mid-phrase
  function words(v) {
    var m = /^(\$[\d,.]+) (.+)$/.exec(v);
    return m ? '<b>' + e(m[1]) + '</b><small>' + e(m[2]) + '</small>' : '<b>' + e(v) + '</b>';
  }
  function sym(v) { return '<i class="cmp-sym cmp-' + v + '" aria-label="' + ({ y: 'Yes', p: 'Partly', n: 'No' })[v] + '">' + (v === 'y' ? OB.icon('check', 11) : '') + '</i>'; }

  // ---- the face-off: onBlue against the rival picked in the tabs
  var rival = 1;
  function drawFace() {
    var rows = FEAT.map(function (r, i) {
      return '<div class="cmp-row" style="--d:' + (i * 80) + 'ms"><span>' + e(r[0]) + '</span><span class="us">' + sym(r[1]) + '</span><span>' + sym(r[rival + 1]) + '</span></div>';
    }).join('') + WORDS.map(function (r, i) {
      return '<div class="cmp-row cmp-words" style="--d:' + ((FEAT.length + i) * 80) + 'ms"><span>' + e(r[0]) + '</span><span class="us">' + words(r[1]) + '</span><span>' + words(r[rival + 1]) + '</span></div>';
    }).join('');
    face.innerHTML = '<div class="cmp-tabs" role="tablist">' + C.COLS.slice(1).map(function (c, i) {
      return '<button type="button" role="tab" aria-selected="' + (i + 1 === rival) + '" data-rival="' + (i + 1) + '">' + e(c) + '</button>';
    }).join('') + '</div><div class="cmp-panel"><span class="cmp-lit" aria-hidden="true"></span>' +
      '<div class="cmp-row cmp-head"><span></span><span class="us"><em>onBlue</em></span><span>' + e(C.COLS[rival]) + '</span></div>' + rows + '</div>' +
      // what the three marks mean (shown on phones only, css/compare.css)
      '<p class="cmp-key" aria-hidden="true">' + ['y', 'p', 'n'].map(function (v) { return '<span>' + sym(v) + ({ y: 'Yes', p: 'Partly', n: 'No' })[v] + '</span>'; }).join('') + '</p>';
  }
  if (face) {
    face.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-rival]'); if (!b) { return; }
      rival = +b.getAttribute('data-rival'); drawFace(); replay();
    });
  }

  // ---- the rows slide in when the section comes into view, and again on a switch
  function replay() {
    if (!sec) { return; }
    sec.classList.remove('is-in'); void sec.offsetWidth;
    window.requestAnimationFrame(function () { if (inView) { sec.classList.add('is-in'); } });
  }
  var inView = false;
  if (sec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; sec.classList.toggle('is-in', inView); }, { threshold: 0.2 }).observe(sec);
  } else if (sec) { inView = true; }
  if (face) { drawFace(); replay(); }
})();
