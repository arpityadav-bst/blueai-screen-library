/* The sidebar's lists, under Campaigns (shell.js draws them; loaded before it).
   THE SIDEBAR SHOWS WHAT YOU ARE DOING (Abhisht and Appy, 2026-11-03, after
   Claude's own sidebar), never a second way to a page it already links:
   - campaigns running: ACTIVE, every live or in-review campaign, one plain
     row each with a status dot, newest first. Completed and rejected ones are
     in the list page only, which "Campaigns" above already opens.
   - nothing running yet: GET STARTED, three steps a new agency takes
     (approval, a sample report, the first campaign), each ticked when done.
   Which campaigns: the list page's own (data.js), as its dock last set them
   ("New account" has only what it filed since). Each section folds, and remembers it. */
(function () {
  'use strict';

  var K_STATE = 'onblue-app-state', K_SAMPLE = 'onblue-seen-sample';
  var SAMPLE = '7c2d91e4'; // Spring Launch, the first sample report
  var CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var TICK = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function get(k) { try { return window.localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* this page only */ } }
  function esc(s) { return window.onblueApp ? window.onblueApp.esc(s) : String(s); }

  function active() {
    var D = window.onblueData, st = get(K_STATE);
    if (!D) { return []; }
    var rows = st === 'first' ? D.fresh() : st === 'empty' ? D.OWN : D.MINE;
    return rows.filter(function (c) { return c.status === 'live' || c.status === 'review'; });
  }
  function shut(key) { return get('onblue-side-' + key) === 'closed'; }
  function head(key, label) {
    return '<button class="app-group-label app-group-fold" type="button" data-side-fold="' + key + '" aria-expanded="' + !shut(key) + '">' + label + CHEV + '</button>';
  }

  function activeList(open) {
    var rows = active();
    return head('active', 'Active') + (shut('active') ? '' : rows.map(function (c) {
      return '<a class="app-nav-item app-nav-camp" href="campaign.html?id=' + encodeURIComponent(c.id) + '"' + (c.id === open ? ' aria-current="page"' : '') + ' title="' + esc(c.title) + '">'
        + '<i class="app-dot app-dot--' + c.status + '" aria-hidden="true"></i><span>' + esc(c.title) + '</span>'
        + '<span class="app-sr">, ' + (c.status === 'live' ? 'live' : 'in review') + '</span></a>';
    }).join(''));
  }

  // a step: done (ticked, quiet), to do, or waiting (locked). A step that goes
  // somewhere still goes there once it is done; only one with nowhere to go is text
  function step(label, state, how, here) {
    var mark = '<i class="app-step-mark is-' + state + '" aria-hidden="true">' + (state === 'done' ? TICK : '') + '</i>';
    var sr = '<span class="app-sr">, ' + (state === 'done' ? 'done' : state === 'wait' ? 'not yet' : 'to do') + '</span>';
    var inner = mark + '<span>' + label + '</span>' + sr;
    var cls = 'app-nav-item app-nav-camp app-nav-step is-' + state;
    // the agency step answers a click with where things stand (note, below)
    if (how === 'note') { return '<button class="' + cls + '" type="button" data-side-note>' + inner + '</button>'; }
    if (state === 'wait' || !how) { return '<span class="' + cls + '">' + inner + '</span>'; }
    return how === 'new'
      ? '<button class="' + cls + '" type="button" data-new>' + inner + '</button>'
      : '<a class="' + cls + '" href="' + how + '"' + (here ? ' aria-current="page"' : '') + '>' + inner + '</a>';
  }
  function getStarted(review, open) {
    return head('start', 'Get started') + (shut('start') ? '' : step(review ? 'Agency in review' : 'Agency approved', review ? 'wait' : 'done', 'note')
      + step('See a sample report', get(K_SAMPLE) ? 'done' : 'todo', 'campaign.html?id=' + SAMPLE, open === SAMPLE)
      + step('Create your first campaign', review ? 'wait' : 'todo', 'new'));
  }

  /* A CLICK ON THE AGENCY STEP SAYS WHERE IT STANDS: a small note beside the
     step, the review popover's look (components.css .agency-pop), the title
     alone, and it goes by itself. */
  var noteT;
  function note(btn) {
    var A = window.onblueApp, review = A && A.session.status === 'review';
    var old = document.getElementById('side-note');
    if (old) { old.remove(); }
    var p = document.createElement('div');
    p.id = 'side-note';
    p.className = 'agency-pop agency-pop--note' + (review ? '' : ' is-ok');
    p.setAttribute('role', 'status');
    p.innerHTML = (A ? (review ? A.icons.clock : A.icons.check) : '')
      + '<span class="agency-pop-text"><b>' + (review ? 'Your agency is in review' : 'Your agency is approved') + '</b></span>';
    document.body.appendChild(p);
    var r = btn.getBoundingClientRect();
    p.style.top = (r.top + r.height / 2 - p.offsetHeight / 2) + 'px';
    p.style.left = (r.right + 12) + 'px';
    p.style.setProperty('--pop-arrow', (p.offsetHeight / 2) + 'px');
    clearTimeout(noteT);
    noteT = setTimeout(function () { p.classList.add('is-going'); setTimeout(function () { p.remove(); }, 200); }, 2200);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-side-note]');
    if (b) { note(b); }
  });

  window.onblueSideLists = {
    // the section the sidebar shows, and whether the open campaign is a row in it
    html: function (open, review) { return active().length ? activeList(open) : getStarted(review, open); },
    // the open campaign has a row of its own here (so Campaigns is not the current place)
    has: function (open) {
      if (!open) { return false; }
      var rows = active();
      return rows.length ? !shut('active') && rows.some(function (c) { return c.id === open; }) : !shut('start') && open === SAMPLE;
    },
    fold: function (key) { set('onblue-side-' + key, shut(key) ? 'open' : 'closed'); },
    // a sample report has been opened: the Get started step is done
    sawSample: function () { set(K_SAMPLE, '1'); }
  };
})();
