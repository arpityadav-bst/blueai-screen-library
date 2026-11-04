/* The website, part 1: icons, the hero ring is ring.js, the film wall, the website
   field (Explee: favicon + name as you type), the no-website dialog. Both
   lead to run.html, where BlueAI starts working in front of you. */
(function () {
  'use strict';
  var OB = window.OB;

  document.querySelectorAll('[data-ico]').forEach(function (n) { n.innerHTML = OB.icon(n.getAttribute('data-ico'), n.closest('.ob-logo-mark') ? 16 : 18); });
  document.querySelectorAll('[data-agent]').forEach(function (n) { n.outerHTML = OB.agent(); });
  document.querySelectorAll('[data-ico-agent]').forEach(function (n) { n.innerHTML = OB.icon('spark'); });

  // the wall: two rows, each doubled so the drift loops seamlessly. On a phone
  // it skips the one film whose poster has a white frame baked in (app-data.js
  // keeps it out of the app for the same reason); desktop keeps its wall as is
  var wall = document.querySelector('[data-wall]');
  if (wall) {
    var skip = window.matchMedia('(max-width: 700px)').matches ? { 'storm-chaser-night-drive': 1 } : {};
    var row = function (from, cls) {
      var tiles = '';
      for (var i = 0, k = from; i < 12; k++) {
        var f = OB.film(k);
        if (skip[f.id]) { continue; }
        i++;
        tiles += '<div class="ob-tile">' + OB.videoTag(f) + '<span class="ob-phone-tag">' + OB.esc(f.label) + '</span></div>';
      }
      return '<div class="ob-wall-row ' + cls + '">' + tiles + tiles + '</div>';
    };
    wall.innerHTML = row(0, '') + row(12, 'ob-wall-row--b');
  }
  OB.watchFilms();

  // the nav gets a hairline once the page scrolls
  var nav = document.querySelector('[data-nav]');
  // the glass pill takes over once half the first screen has scrolled by
  // over a dark section, the pill's logo turns volt (header.css .on-dark): look
  // at what sits under the pill's middle, skipping the header itself
  var overDark = function () {
    if (!document.elementsFromPoint) { return false; }
    var hits = document.elementsFromPoint(window.innerWidth / 2, 34);
    for (var i = 0; i < hits.length; i++) { if (!nav.contains(hits[i])) { return !!hits[i].closest('.ob-dark, .ob-horizon'); } }
    return false;
  };
  var onScroll = function () {
    if (!nav) { return; }
    var stuck = window.scrollY > window.innerHeight * 0.5;
    nav.classList.toggle('is-stuck', stuck);
    nav.classList.toggle('on-dark', stuck && overDark());
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // the phone bar's burger and its popover (header.css, 900 and below): a tap
  // outside, Escape, any row, or widening past 900 closes it
  var burger = document.querySelector('[data-burger]'), menu = document.querySelector('[data-nav-menu]');
  if (burger && menu) {
    var shut = function () { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function () { var on = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', on); burger.setAttribute('aria-expanded', String(on)); });
    document.addEventListener('click', function (e) { if (!burger.contains(e.target) && (!menu.contains(e.target) || e.target.closest('.ob-nav-row'))) { shut(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { shut(); } });
    window.matchMedia('(min-width: 901px)').addEventListener('change', shut);
  }

  // every "Get my free report" button takes you to the hero field
  function toField() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var inp = document.querySelector('[data-site-input]');
    window.setTimeout(function () { if (inp) { inp.focus({ preventScroll: true }); } }, 450);
  }
  document.querySelectorAll('[data-to-field]').forEach(function (b) { b.addEventListener('click', toField); });
  // on a phone the bento's report field looks like an input, so a tap on it does what one would
  var btField = document.querySelector('.bt-report .bt-field'), phoneQ = window.matchMedia('(max-width: 700px)');
  if (btField) { btField.addEventListener('click', function () { if (phoneQ.matches) { toField(); } }); }

  var ALERT = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="display:inline;vertical-align:-0.125em;margin-right:0.375rem"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5v5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.3" fill="currentColor"/></svg>';
  function looksLikeSite(v) { return /^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(v.replace(/^https?:\/\//i, '').replace(/^www\./i, '')); }

  function go(input) {
    OB.sess('onblue-run-input', JSON.stringify(input));
    window.location.href = 'run.html';
  }

  // the website field: favicon and brand name appear as you type
  document.querySelectorAll('[data-site-form]').forEach(function (form) {
    var inp = form.querySelector('[data-site-input]'), fav = form.querySelector('[data-fav]');
    var name = form.nextElementSibling && form.nextElementSibling.matches('[data-site-name]') ? form.nextElementSibling : null;
    // the closing field has no line under it: give it one, so its errors show too
    if (!name) { name = document.createElement('div'); name.className = 'ob-field-name'; form.parentNode.insertBefore(name, form.nextSibling); }
    name.setAttribute('aria-live', 'polite');
    // the hero's line under the field swaps with "No website?": give it that
    // line's height, so the centred hero never shifts when it appears
    var alt = name.nextElementSibling && name.nextElementSibling.matches('.ob-hero-alt') ? name.nextElementSibling : null;
    var fit = function () {
      if (!alt || name.textContent) { return; }
      var h = alt.offsetHeight + parseFloat(getComputedStyle(alt).marginTop) - parseFloat(getComputedStyle(name).marginTop);
      if (h > 0) { name.style.minHeight = h + 'px'; }
    };
    fit(); window.addEventListener('resize', fit);
    var t, err = false;
    // the error has its own look: a warm red edge on the field in place of the
    // volt focus ring (field-focus.css), cleared the moment it holds a website
    var bad = function (on) {
      err = on;
      form.classList.toggle('is-bad', on);   // the phone's resting volt ring steps aside (field-focus.css)
      form.style.borderColor = on ? '#c8432b' : '';
      form.style.background = on ? '#fff' : '';
      // the phone's halo is 4px, so it stays 16px or more from the screen's edges
      form.style.boxShadow = on ? '0 0 0 ' + (window.matchMedia('(max-width: 700px)').matches ? '0.25rem' : '0.3125rem') + ' rgba(200, 67, 43, 0.14)' : '';
    };
    fav.innerHTML = OB.icon('globe', 20);
    inp.addEventListener('input', function () {
      window.clearTimeout(t);
      t = window.setTimeout(function () {
        var v = inp.value.trim();
        // an error stays until the field holds a real website
        if (!looksLikeSite(v)) { fav.innerHTML = OB.icon('globe', 20); if (!err) { name.textContent = ''; } return; }
        bad(false);
        var b = OB.report.brand(v);
        var img = new Image();
        img.alt = ''; img.onerror = function () { fav.innerHTML = OB.icon('globe', 20); };
        img.onload = function () { if (img.naturalWidth < 32) { fav.innerHTML = OB.icon('globe', 20); } };   // Google's tiny default globe blurs: our crisp one
        img.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(b.host) + '&sz=64';
        fav.innerHTML = ''; fav.appendChild(img);
        if (name) { name.innerHTML = 'BlueAI will read <b>' + OB.esc(b.host) + '</b> and build your free report.'; }
      }, 350);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = inp.value.trim();
      window.clearTimeout(t);
      if (!looksLikeSite(v)) {
        inp.focus();
        // one sentence on one baseline at one size, in ink with a small alert
        // mark; only the way out (no website) is styled differently, as a link
        bad(true);
        name.innerHTML = '<span style="color:#a3341f;font-weight:500">' + ALERT +
          (v ? 'That doesn\'t look like a website yet. Try yourbrand.com' : 'Type your website to start') + ', or ' +
          '<button class="ob-link" type="button" data-nosite-inline style="color:inherit;text-decoration-color:currentColor">start without one</button>.</span>';
        name.querySelector('[data-nosite-inline]').addEventListener('click', function () { open(); });
        return;
      }
      go({ site: v });
    });
  });

  // no website: three questions instead
  var modal = document.querySelector('[data-modal]');
  var open = function () { modal.classList.add('is-open'); window.setTimeout(function () { modal.querySelector('input').focus(); }, 60); };
  var close = function () { modal.classList.remove('is-open'); };
  document.querySelectorAll('[data-nosite]').forEach(function (b) { b.addEventListener('click', open); });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) { close(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
  // touch: keep the bottom sheet above the keyboard (iOS does not resize the page)
  if (window.visualViewport && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    var vv = window.visualViewport;
    var lift = function () { modal.style.bottom = modal.classList.contains('is-open') ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) + 'px' : ''; };
    vv.addEventListener('resize', lift); vv.addEventListener('scroll', lift);
  }
  modal.querySelectorAll('[data-where] .ob-pick').forEach(function (p) {
    p.addEventListener('click', function () {
      modal.querySelectorAll('[data-where] .ob-pick').forEach(function (q) { q.setAttribute('aria-pressed', String(q === p)); });
    });
  });
  modal.querySelector('[data-nosite-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, where = modal.querySelector('[data-where] [aria-pressed="true"]');
    go({ sell: f.sell.value.trim(), buyers: f.buyers.value.trim(), where: where ? where.textContent : 'United States' });
  });

  // back from the run by any route (the logo, "Done for now"), with a report and no
  // account yet: the hero's quiet line offers the report back instead of "No website?"
  var rep = OB.report.get(), alt = document.querySelector('.ob-hero-alt');
  if (alt && rep && !OB.store('onblue-app-stage')) {
    alt.innerHTML = 'Welcome back. <a class="ob-link" href="run.html?resume=1">Continue your report' + (rep.brand === 'Your brand' ? '' : ' for ' + OB.esc(rep.brand)) + '</a>';
  }
})();
