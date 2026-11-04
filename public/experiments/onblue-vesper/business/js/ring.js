/* The hero's film ring, ported from the PM's brands.html ring: frames on a
   turning cylinder. NO POINTER INTERACTION (Appy): it never stops, shows no
   play button and opens no player; it just keeps moving. */
(function () {
  'use strict';
  var OB = window.OB;
  var arc = document.querySelector('[data-cyl]');
  if (!arc) { return; }

  var html = '';
  for (var i = 0; i < 40; i++) {   // up to 40 slots; fitRing shows as many as the screen wants
    var f = OB.film(i);
    html += '<div class="ob-cyl-card" style="--i:' + i + '" aria-hidden="true">' +
      '<span class="ob-cyl-shot"><video src="' + f.src + '" poster="' + f.poster + '" muted loop playsinline preload="none" data-ob-film></video></span></div>';
  }
  arc.innerHTML = '<div class="ob-cyl-stage">' + html + '</div>';
  OB.watchFilms(arc);

  // ---- THE HERO IS ONE SCREEN, ON ANY SCREEN (Appy) ------------------------
  // The hero is exactly the viewport under the header. The words take what
  // they need; the ring gets the rest: its frame width is solved from the
  // height left over, then snapped to a whole number of slots on the 70vw
  // circle so the gap between frames stays 16px. A short wide screen gets more,
  // smaller frames; a tall one gets fewer, bigger ones. Same look, always fits.
  var hero = arc.closest('.ob-hero'), nav = document.querySelector('.ob-nav'), allCards = arc.querySelectorAll('.ob-cyl-card');
  function fitRing() {
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, hdr = nav ? nav.offsetHeight : 72;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16, gap = 24.79 * rem;   // the site scales by rem above 1920px
    document.documentElement.style.setProperty('--hdr', hdr + 'px');
    var cs = getComputedStyle(hero), heroH = Math.max(560 * rem, vh - hdr);
    var g = Math.min(60, Math.max(28, vh * 0.046));
    var words = hero.querySelector('.ob-wrap'), crowd = hero.querySelector('.ob-crowd');
    var avail = heroH - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - words.offsetHeight - (crowd ? crowd.offsetHeight : 0) - (crowd ? 2 : 1) * (1.33 * g - 12);   // one gap now the creators row lives in the next section
    // the frames take ~85% of the room they could (Appy: a touch smaller); the hero
    // keeps the spare height as air around the words
    var R = 0.7 * vw, cap = 0.85 * Math.min(vw < 820 ? 0.48 * vw : 0.2 * vw, avail / 1.248), n = 9, w = 0;
    for (n = 9; n <= 40; n++) { w = 2 * R * Math.sin(Math.PI / n) - gap; if (w <= cap) { break; } }
    // a phone (620 wide or less) keeps the ring 3D with fixed steps: 40deg (9
    // frames, about three across) on a tall phone, 30deg (12) on the rest
    // (Appy: on a phone the videos sit closer and larger) a wider ring (80% of the
    // screen, not 70%) and a 10px gap between frames instead of ~25
    var phone = vw <= 620;
    if (phone) { n = vh >= 780 ? 9 : 12; R = 0.8 * vw; gap = 10; }
    hero.style.setProperty('--ring-r', phone ? R.toFixed(2) + 'px' : '');
    n = Math.min(n, 40); w = Math.max(60, 2 * R * Math.sin(Math.PI / n) - gap);
    hero.style.setProperty('--ring-w', w.toFixed(2) + 'px');
    hero.style.setProperty('--ring-step', (360 / n).toFixed(4) + 'deg');
    hero.style.setProperty('--slot', (-420 / n).toFixed(3) + 's');
    for (var k = 0; k < allCards.length; k++) { allCards[k].style.display = k < n ? '' : 'none'; }
  }
  fitRing();
  window.addEventListener('resize', fitRing);
  window.addEventListener('load', fitRing);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitRing); }
})();
