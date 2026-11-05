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
    var overDark = function () {
      if (!document.elementsFromPoint) { return false; }
      var hits = document.elementsFromPoint(window.innerWidth / 2, 34);
      for (var i = 0; i < hits.length; i++) { if (!nav.contains(hits[i])) { return !!hits[i].closest('.ob-dark, .ob-horizon'); } }
      return false;
    };
    var onScroll = function () {
      var stuck = window.scrollY > window.innerHeight * 0.5;
      nav.classList.toggle('is-stuck', stuck);
      nav.classList.toggle('on-dark', stuck && overDark());
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
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
