/* VOLT KIT: the website header and the icon fill, lifted out of the Volt
   reference's js/site.js (which also runs the Volt site's own free-report
   field; that stays behind). Load after ob.js. Markup: css/header.css.
   - [data-ico="arrow"] and friends get OB.icon(); [data-agent] gets OB.agent()
   - [data-nav]: past half the first screen the header becomes the floating
     pill (.is-stuck); over an .ob-dark section the pill turns dark (.on-dark)
   - [data-burger] + [data-nav-menu]: the phone popover (900 and below); a tap
     outside, Escape, any row, or widening past 900 closes it */
(function () {
  'use strict';
  var OB = window.OB;

  document.querySelectorAll('[data-ico]').forEach(function (n) { n.innerHTML = OB.icon(n.getAttribute('data-ico'), n.closest('.ob-logo-mark') ? 16 : 18); });
  document.querySelectorAll('[data-agent]').forEach(function (n) { n.outerHTML = OB.agent(); });

  var nav = document.querySelector('[data-nav]');
  if (nav) {
    /* WHICH BANDS ARE DARK, MEASURED, NOT HIT-TESTED (PM, 2026-11-06: the first
       fold hung on scroll). elementsFromPoint on every scroll event hit-tested
       through the hero's 3D film ring each time; now the dark bands' page
       positions are read once, again when the page changes size, and a scroll
       only compares numbers, once per frame */
    var darks = [], ticking = false;
    var measure = function () {
      var y = window.scrollY;
      darks = [].map.call(document.querySelectorAll('.ob-dark, .ob-horizon'), function (el) { var r = el.getBoundingClientRect(); return [r.top + y, r.bottom + y]; });
    };
    var overDark = function () {
      var y = window.scrollY + 34;
      for (var i = 0; i < darks.length; i++) { if (y >= darks[i][0] && y < darks[i][1]) { return true; } }
      return false;
    };
    var onScroll = function () {
      ticking = false;
      var stuck = window.scrollY > window.innerHeight * 0.5;
      nav.classList.toggle('is-stuck', stuck);
      nav.classList.toggle('on-dark', stuck && overDark());
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }, { passive: true });
    if ('ResizeObserver' in window) { new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body); }
    window.addEventListener('load', function () { measure(); onScroll(); });
    measure(); onScroll();
  }

  var burger = document.querySelector('[data-burger]'), menu = document.querySelector('[data-nav-menu]');
  if (burger && menu) {
    var shut = function () { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
    // the menu is pinned to the header: scrolling the page underneath closes it
    window.addEventListener('scroll', function () { if (menu.classList.contains('is-open')) { shut(); } }, { passive: true });
    burger.addEventListener('click', function () { var on = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', on); burger.setAttribute('aria-expanded', String(on)); });
    document.addEventListener('click', function (e) { if (!burger.contains(e.target) && (!menu.contains(e.target) || e.target.closest('.ob-nav-row'))) { shut(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { shut(); } });
    window.matchMedia('(min-width: 901px)').addEventListener('change', shut);
  }
})();
