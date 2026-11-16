/* THE SECTION BAR (CEO and PM, 2026-11-16). The report reads in five groups,
   Overview, Audience, Views & spend, Creators and Posts, and a bar under the
   title row names them (index.html #secnav, styled in report-sections.css).
   This file only drives that bar:
   - it marks the group in view (an IntersectionObserver on a band a third of
     the way down the screen);
   - a click scrolls to the group, smoothly, or at once under reduced motion,
     and moves focus there for keyboard and screen reader users;
   - it draws a hairline once the bar is stuck;
   - it drops a group, and its link, while every card in it is hidden (the
     review dock can hide Geography and Age and gender).
   report.js renders the cards; nothing here reads or changes its data. */
(function () {
  'use strict';

  var nav = document.getElementById('secnav');
  if (!nav) { return; }
  var strip = nav.querySelector('.secnav-in');
  var links = [].slice.call(nav.querySelectorAll('a[href^="#sec-"]'));
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var current = null, locked = false, lockT = 0, seen = {};

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function shown() { return secs.filter(function (s) { return s && !s.hidden; }); }

  /* a group shows while it has a card or the tiles to show */
  function sync() {
    secs.forEach(function (sec, i) {
      if (!sec) { return; }
      var on = !!sec.querySelector('.card:not([hidden]), .tiles, .minis');
      if (sec.hidden === on) { sec.hidden = !on; }
      if (links[i].hidden === on) { links[i].hidden = !on; }
    });
    if (current && document.getElementById(current).hidden) { current = null; pick(); }
  }

  /* on a phone the bar scrolls sideways: the marked chip is kept in sight */
  function bringIn(a) {
    if (strip.scrollWidth <= strip.clientWidth + 1) { return; }
    var left = a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2;
    try { strip.scrollTo({ left: Math.max(0, left), behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { strip.scrollLeft = left; }
  }
  function setActive(id) {
    if (!id || id === current) { return; }
    current = id;
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) {
        a.setAttribute('aria-current', 'location');
        bringIn(a);
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* the group in the band; at the very top, the first group */
  function pick() {
    if (locked) { return; }
    var list = shown();
    if (!list.length) { return; }
    if ((window.scrollY || window.pageYOffset) < 4) { setActive(list[0].id); return; }
    for (var i = 0; i < list.length; i++) {
      if (seen[list[i].id]) { setActive(list[i].id); return; }
    }
  }

  if ('IntersectionObserver' in window) {
    var onSeen = function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      pick();
    };
    /* the report's own viewport, also when it runs inside the app's frame */
    var io, opts = { rootMargin: '-30% 0px -65% 0px' };
    try { opts.root = document; io = new IntersectionObserver(onSeen, opts); } catch (e) {
      delete opts.root;
      io = new IntersectionObserver(onSeen, opts);
    }
    secs.forEach(function (s) { if (s) { io.observe(s); } });
  }

  /* stuck: the bar sits at its sticky offset and the page has moved */
  var ticking = false;
  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var top = parseFloat(window.getComputedStyle(nav).top) || 0;
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-stuck', y > 0 && nav.getBoundingClientRect().top <= top + 0.5);
      pick();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  nav.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href^="#sec-"]');
    var sec = a && document.getElementById(a.getAttribute('href').slice(1));
    if (!sec) { return; }
    ev.preventDefault();
    var how = reduced() ? 'auto' : 'smooth';
    /* the marked link follows the click, not every group the scroll passes */
    setActive(sec.id);
    locked = true;
    clearTimeout(lockT);
    lockT = setTimeout(function () { locked = false; pick(); }, how === 'smooth' ? 900 : 80);
    if (sec === shown()[0]) {
      window.scrollTo({ top: 0, behavior: how });
    } else {
      sec.scrollIntoView({ behavior: how, block: 'start' });
    }
    try { sec.focus({ preventScroll: true }); } catch (e) {}
  });

  /* report.js shows and hides cards as the dock's switches change */
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(sync);
    secs.forEach(function (s) { if (s) { mo.observe(s, { attributes: true, attributeFilter: ['hidden'], subtree: true }); } });
  }

  sync();
  pick();
  onScroll();
})();
