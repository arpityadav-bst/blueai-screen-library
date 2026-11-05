/* VOLT KIT: the small behaviours of the Volt homepage sections, without the
   Volt site's own content (from the reference's js/site-parts.js). Load after
   ob.js. The page supplies its own words.
   - FAQ (css/site-2.css .ob-qa): either static markup inside [data-faq]
     (.ob-qa-item > button + .ob-qa-a > div > p), or set OB.FAQ = [[q, a], ...]
     before this script and it draws them. One open at a time, the first open.
   - [data-bars] (css/site-2.css .ob-bars) and any [data-inview]: get .is-in the
     first time they are 40% on screen, so their CSS grow-in runs once. */
(function () {
  'use strict';
  var OB = window.OB;

  var faq = document.querySelector('[data-faq]');
  if (faq) {
    if (OB.FAQ && OB.FAQ.length) {
      faq.innerHTML = OB.FAQ.map(function (q, i) {
        var n = i + 1 < 10 ? '0' + (i + 1) : String(i + 1);
        return '<div class="ob-qa-item' + (i === 0 ? ' is-open' : '') + '"><button type="button" aria-expanded="' + (i === 0) + '"><em>' + n + '</em><span>' + OB.esc(q[0]) + '</span><i>' + OB.icon('plus', 16) + '</i></button>' +
          '<div class="ob-qa-a"><div><p>' + OB.esc(q[1]) + '</p></div></div></div>';
      }).join('');
    }
    faq.addEventListener('click', function (e) {
      var b = e.target.closest('.ob-qa-item > button'); if (!b) { return; }
      var item = b.parentNode, open = !item.classList.contains('is-open');
      faq.querySelectorAll('.ob-qa-item').forEach(function (x) { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
    });
  }

  var grow = document.querySelectorAll('[data-bars], [data-inview]');
  if (!('IntersectionObserver' in window)) { grow.forEach(function (n) { n.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  grow.forEach(function (n) { io.observe(n); });
})();
