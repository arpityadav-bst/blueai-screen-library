/* Radar's competitor manager (Appy: "how do I add more competitors or scan for
   new ones?"). One panel under Radar's head: every competitor with an on/off
   switch, an add field that takes a website or a YouTube handle (checked, then
   given an estimated Shorts count, the same way the report's step 2 does it),
   and "Find more competitors", where BlueAI suggests brands in your category
   that sell to the same buyers. Every change saves the report, so Radar, its
   best Short and home's "Remix a competitor" all follow it.
   OB.radarManage(el, onChange) renders into el; .open(find) shows it. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  // brands BlueAI "finds" per category, beyond the five the report started with
  var MORE = {
    'Food and drink': ['Oat & Ember', 'Little Press', 'Hearthside Bakery', 'Two Spoons', 'Morning Ration', 'Copper Kettle', 'Sunday Crumb', 'Fig & Flour', 'Steam Room Coffee'],
    'Beauty and skincare': ['Petal Proof', 'Clear Theory', 'Soft Ritual', 'Moon Balm', 'Dew Supply', 'Calm Skin Co', 'Gloss Lab', 'Root & Rose', 'Thirty Drops'],
    'Fitness': ['Rep Room', 'Tempo Run', 'Ground Up', 'Mobility Co', 'Iron Hour', 'Stretch Club', 'Pace Setters', 'Bodyform', 'Early Lift'],
    'Games': ['Pixel Harbor', 'Lantern Games', 'Grit Studio', 'Tiny Titan', 'Moonmoth', 'Quest Kitchen', 'Bright Byte', 'Odd Owl Games', 'Half Moon Play'],
    'Retail and fashion': ['Fold & Fray', 'Common Cut', 'Ash Avenue', 'Little Loom', 'Field Day Supply', 'Ninth Thread', 'Plain Goods', 'Hemline', 'Seam & Co'],
    'Travel': ['Slow Miles', 'Harbor Stays', 'Field Notes Travel', 'Blue Door', 'Weekend Atlas', 'Cabin Days', 'Lighthouse Trips', 'Easy Abroad', 'Northbound'],
    'Home and gifts': ['Paper & Pine', 'Clay Days', 'Small Batch Co', 'Warm Corner', 'Linen & Light', 'Gift Theory', 'Hearth & Hue', 'Kiln House', 'Wildflower Goods'],
    'Apps and software': ['Tidy', 'Focusly', 'Quill', 'Pocket Plan', 'Nudge', 'Clearday', 'Stackwise', 'Doable', 'Inkpad']
  };
  var el, onChange, open = false, finding = false, found = null, seen = {};

  function on() { return r.rivals.filter(function (x) { return x.on && !x.checking; }); }
  // every number that hangs off the list stays true to what is switched on
  function sync() {
    var o = on();
    r.rivalsTotal = o.reduce(function (s, x) { return s + x.videos; }, 0);
    r.perMonth = Math.round(r.rivalsTotal / 6);
    if (o.length && !o.some(function (x) { return x.name === r.longest.rival; })) { r.longest.rival = o[0].name; }
    A.saveReport(); onChange();
  }
  function has(name, site) {
    return r.rivals.some(function (x) { return x.name.toLowerCase() === name.toLowerCase() || x.site === site; });
  }
  function count(x) {
    return x.checking ? '<span class="rd-m-check"></span>Checking their Shorts&hellip;' : (x.est ? 'About ' : '') + x.videos + ' Shorts in 6 months' + (x.est ? ', my estimate' : '');
  }
  function av(name) { return '<span class="rd-m-av" style="--h:' + (OB.hash(name) % 360) + '" aria-hidden="true">' + e(name.charAt(0).toUpperCase()) + '</span>'; }

  function rows() {
    return r.rivals.map(function (x, i) {
      return '<li class="rd-m-row' + (x.on ? '' : ' is-off') + '">' + av(x.name) + '<span class="rd-m-t"><b>' + e(x.name) + '</b><small>' + e(x.site) + ' &middot; ' + count(x) + '</small></span>' +
        '<button class="rd-sw" type="button" role="switch" aria-checked="' + !!x.on + '" aria-label="Watch ' + e(x.name) + '" data-sw="' + i + '"' + (x.checking ? ' disabled' : '') + '><i></i></button></li>';
    }).join('');
  }
  // every scan can run again: each brings brands not on your list and not shown before
  function scanBtn(label) { return '<button class="ob-btn ob-btn--sm rd-m-find" type="button" data-find>' + OB.icon('radar', 15) + label + '</button>'; }
  function finds() {
    if (finding) { return '<p class="rd-m-finding"><span class="rd-m-check"></span>Looking across ' + e(r.category.toLowerCase()) + ' for brands that sell to the same buyers&hellip;</p>'; }
    if (!found) { return scanBtn('Find more competitors'); }
    var left = found.filter(function (x) { return !has(x.name, x.site); });
    if (!found.length) { return '<p class="rd-m-finding rd-m-none">No new brands since your last scan. BlueAI checks your category every day; scan again any time.</p>' + scanBtn('Scan again'); }
    if (!left.length) { return '<p class="rd-m-finding rd-m-none">All added. Radar watches them from today.</p>' + scanBtn('Scan again'); }
    // BlueAI's finds sit in their own tinted panel, as cards, so they never read as
    // more of the list you already watch (Appy)
    return '<div class="rd-m-found"><div class="rd-m-found-h">' + OB.agent() + '<p><b>BlueAI found ' + left.length + ' more</b> selling to ' + e(r.buyers.charAt(0).toLowerCase() + r.buyers.slice(1)) + '</p><button class="ob-link" type="button" data-find>Scan again</button></div>' +
      '<ul class="rd-m-cards">' + left.map(function (x) {
        return '<li class="rd-m-card">' + av(x.name) + '<span class="rd-m-t"><b>' + e(x.name) + '</b><small>' + e(x.site) + ' &middot; about ' + x.videos + ' Shorts in 6 months</small></span>' +
          '<button class="ob-btn ob-btn--sm" type="button" data-take="' + e(x.name) + '" aria-label="Add ' + e(x.name) + '">' + OB.icon('plus', 15) + 'Add</button></li>';
      }).join('') + '</ul></div>';
  }
  function draw() {
    if (!open) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<div class="ob-card rd-m"><div class="rd-m-head"><div><h2 class="ob-pg-h3">Your competitors</h2><p class="ob-pg-p">Switch one off and Radar stops watching it. Its Shorts leave Radar and your home.</p></div>' +
      '<button class="ob-btn ob-btn--sm" type="button" data-close>Done</button></div>' +
      '<ul class="rd-m-list">' + rows() + '</ul>' +
      '<form class="rd-m-add" data-add><input class="ob-input" placeholder="Website or YouTube handle, like rival.com or @rival" aria-label="Add a competitor by website or YouTube handle"><button class="ob-btn ob-btn--sm" type="submit">' + OB.icon('plus', 15) + 'Add</button></form>' +
      '<div class="rd-m-more" data-more>' + finds() + '</div></div>';
  }
  // a site or a handle: "@crumb.co" and "crumbandco.com" both become a name
  function parse(v) {
    if (v.charAt(0) === '@') {
      var h = v.slice(1).replace(/[^a-z0-9._-]/gi, '');
      return { name: h.split(/[._-]+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '), site: '@' + h.toLowerCase() };
    }
    var b = OB.report.brand(v); return { name: b.name, site: b.host || v };
  }
  function add(x) {
    r.rivals.push(x); sync(); draw();
    if (!x.checking) { return; }
    window.setTimeout(function () {
      var n = 12 + (OB.hash(x.site) % 25);
      x.checking = false; x.est = true; x.videos = n; x.views = n * 30000;
      sync(); draw();
    }, 1400);
  }

  function bind() {
    el.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t.closest('[data-close]')) { open = false; draw(); return; }
      var sw = t.closest('[data-sw]');
      if (sw) { var x = r.rivals[+sw.getAttribute('data-sw')]; x.on = !x.on; sync(); draw(); el.querySelector('[data-sw="' + sw.getAttribute('data-sw') + '"]').focus(); return; }
      if (t.closest('[data-find]')) { find(); return; }
      var tk = t.closest('[data-take]');
      if (tk) {
        var f = found.filter(function (q) { return q.name === tk.getAttribute('data-take'); })[0];
        add({ name: f.name, site: f.site, videos: f.videos, views: f.views, on: true, added: true, est: true });
        OB.toast(f.name + ' added. Radar watches it from today.');
      }
    });
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var inp = el.querySelector('[data-add] input'), v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      var p = parse(v);
      if (!p.name) { OB.toast('That doesn\'t look like a website or a handle yet'); return; }
      if (has(p.name, p.site)) { OB.toast(p.name + ' is already on your list'); return; }
      add({ name: p.name, site: p.site, videos: 0, views: 0, on: true, added: true, checking: true });
      el.querySelector('[data-add] input').focus();
    });
  }
  function find() {
    finding = true; draw();
    window.setTimeout(function () {
      finding = false;
      found = (MORE[r.category] || MORE['Apps and software']).filter(function (n) {
        return !seen[n] && !has(n, n.toLowerCase().replace(/[^a-z]/g, '') + '.com');
      }).slice(0, 3).map(function (n) {
        seen[n] = true;
        var v = 14 + (OB.hash(n + r.site) % 24);
        return { name: n, site: n.toLowerCase().replace(/[^a-z]/g, '') + '.com', videos: v, views: v * 26000 };
      });
      draw();
    }, 1600);
  }

  OB.radarManage = function (node, cb) {
    el = node; onChange = cb;
    // a check left half-way (the page was closed during it) finishes now
    r.rivals.forEach(function (x) { if (x.checking) { var n = 12 + (OB.hash(x.site) % 25); x.checking = false; x.est = true; x.videos = n; x.views = n * 30000; } });
    bind(); draw();
    return {
      open: function (doFind) {
        open = true; draw(); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (doFind && !finding) { find(); } else if (!doFind) { el.querySelector('[data-add] input').focus({ preventScroll: true }); }
      },
      count: function () { return on().length; }
    };
  };
})();
