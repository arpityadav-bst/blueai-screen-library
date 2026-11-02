/* The start card's art (css/start.css): five creator films fanned, and every
   few seconds the fan moves on. The leftmost film leaves, the others shift left,
   and a new one comes in on the right. Only the front film plays, muted and
   looped; the others show their poster and never load their video.
   Rests when the card is hidden or the tab is in the background; with reduced
   motion it is five still posters. */
(function () {
  'use strict';

  var art = document.querySelector('.start-art');
  if (!art) { return; }

  // all fourteen sample films. The opening five are people (Appy): the
  // gameplay films come in later, one at a time, never two side by side
  var FILMS = ['airtap-pasta', 'sandbar-think-out-loud', 'airtap-date-night', 'sandbar-the-menu',
    'airtap-first-date', 'hunter-raid-awaken', 'sandbar-before-the-meeting', 'airtap-weekend-trip',
    'hunter-raid-coupon', 'sandbar-the-quiet-floor', 'airtap-grocery-run', 'hunter-raid-class-tree',
    'airtap-red-eye', 'hunter-raid-first-hour'];
  var EVERY = 5000, LEAVE = 700, next = 0;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function film(pos) {
    var name = FILMS[next++ % FILMS.length], v = document.createElement('video');
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    // nothing loads until this film reaches the front and plays
    v.preload = 'none';
    v.poster = '../samples/' + name + '.jpg';
    v.src = '../samples/' + name + '.mp4';
    // a frame around the film, so a veil can dim it by its distance from the front
    var f = document.createElement('span');
    f.className = 'sa-film';
    f.dataset.pos = pos;
    f.appendChild(v);
    return art.appendChild(f);
  }
  function at(pos) { return art.querySelector('[data-pos="' + pos + '"]'); }
  function play(f) { var p = f.firstChild.play(); if (p && p.catch) { p.catch(function () { /* blocked: the poster stays */ }); } }
  function pause(f) { f.firstChild.pause(); }

  art.textContent = '';
  film('ll'); film('l'); film('c'); film('r'); film('rr');
  if (still) { return; }

  function live() { return !document.hidden && art.offsetParent !== null; }

  function step() {
    var c = at('c');
    if (!live()) { pause(c); return; }
    // the card just came into view: play the front film for a full turn first
    if (c.firstChild.paused) { play(c); return; }
    var ll = at('ll'), l = at('l'), r = at('r'), rr = at('rr'), n = film('in');
    n.getBoundingClientRect(); // settle the entering pose so the move animates
    ll.dataset.pos = 'out';
    l.dataset.pos = 'll';
    c.dataset.pos = 'l';
    r.dataset.pos = 'c';
    rr.dataset.pos = 'r';
    n.dataset.pos = 'rr';
    pause(c);
    play(r);
    setTimeout(function () { ll.remove(); }, LEAVE);
  }

  setInterval(step, EVERY);
  document.addEventListener('visibilitychange', function () {
    var c = at('c');
    if (live()) { play(c); } else { pause(c); }
  });
  if (live()) { play(at('c')); }
})();
