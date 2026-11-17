/* THE REPORT ON A PHONE (Appy, 2026-11-17, after a blind mobile review).
   Three behaviours the phone needs and CSS can't give (the rest is in
   app/css/report-looks.css, "PHONE PASS"):
   1. The section bar keeps its five tabs: refresh and the date range move up
      into the header's action row at 700px and below, and back above it.
   2. Sorting: a phone hides the posts list's column headers, which are its
      sort controls, so a "Sort" pill joins the filters. It drives the same
      header buttons report.js listens to, so the list sorts exactly as before.
   3. Changing page takes you to the top of the list, not the foot of it. */
(function () {
  'use strict';

  var phone = window.matchMedia('(max-width: 700px)');

  // 1. the tools ride in the header on a phone
  var tools = document.querySelector('.secnav-tools'), nav = document.getElementById('secnav'), acts = document.querySelector('.rep-actions');
  function place() {
    if (!tools || !nav || !acts) { return; }
    var home = phone.matches ? acts : nav;
    if (tools.parentNode !== home) { home.appendChild(tools); }
  }
  place();
  if (phone.addEventListener) { phone.addEventListener('change', place); }

  // 2. a Sort pill, first in the filters (shown on a phone only, CSS)
  var SORTS = [['newest', 'Newest'], ['oldest', 'Oldest'], ['views', 'Most views'], ['likes', 'Most likes'], ['comments', 'Most comments']];
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.insertAdjacentHTML('afterbegin', '<label class="sel sel--sort" data-sel="sort"><span class="sel-k">Sort</span><span class="sel-v">Newest</span>'
      + '<select id="f-sort-m" aria-label="Sort posts">' + SORTS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join('') + '</select></label>');
    var pick = document.getElementById('f-sort-m');
    var head = function (k) { return document.querySelector('[data-sort="' + k + '"]'); };
    // which way the list is sorted now, read from the header the list draws
    var current = function () {
      var on = document.querySelector('[data-sort].is-on');
      if (!on) { return 'newest'; }
      var k = on.getAttribute('data-sort');
      return k === 'newest' && /↑/.test(on.textContent) ? 'oldest' : k;
    };
    pick.addEventListener('change', function (ev) {
      ev.stopPropagation();   // report.js's filter listener has nothing to do with it
      var want = pick.value, b;
      if (current() !== want) {
        b = head(want === 'oldest' ? 'newest' : want);
        if (b) { b.click(); }
        // Published flips: from another sort, one press gives newest, a second gives oldest
        if (want === 'oldest' && current() !== 'oldest' && (b = head('newest'))) { b.click(); }
      }
      pick.value = current();
      pick.parentNode.querySelector('.sel-v').textContent = pick.options[pick.selectedIndex].textContent;
    });
  }

  // 3. a new page starts at the top of the list, under the sticky bar
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('#pager [data-page]');
    if (!b || b.disabled) { return; }
    window.setTimeout(function () {
      var pager = document.getElementById('pager'), card = pager && pager.closest('.card');
      if (!card) { return; }
      var bar = nav ? nav.getBoundingClientRect().height : 0;
      var top = card.getBoundingClientRect().top + window.scrollY - bar - 12;
      if (top < window.scrollY) { window.scrollTo({ top: top, behavior: 'smooth' }); }
    }, 0);
  });
})();
