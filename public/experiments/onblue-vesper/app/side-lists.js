/* The sidebar's lists, under Campaigns (shell.js draws them; loaded before it).
   THE SIDEBAR SHOWS WHAT YOU ARE DOING (Abhisht and Appy, 2026-11-03, after
   Claude's own sidebar), never a second way to a page it already links:
   - campaigns running: ACTIVE, every live or in-review campaign, one plain
     row each with a status dot, newest first. Completed and rejected ones are
     in the list page only, which "Campaigns" above already opens.
   - nothing running yet: GET STARTED, three steps a new agency takes
     (approval, a sample report, the first campaign), each ticked when done.
   Which campaigns: the list page's own (data.js), as its dock last set them
   ("First visit" has none). Each section folds, and remembers it. */
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
    var rows = st === 'first' ? [] : st === 'empty' ? D.OWN : D.MINE;
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

  // a step: done (ticked, quiet), to do (a link, or a button for New campaign), or waiting (locked)
  function step(label, state, how) {
    var mark = '<i class="app-step-mark is-' + state + '" aria-hidden="true">' + (state === 'done' ? TICK : '') + '</i>';
    var sr = '<span class="app-sr">, ' + (state === 'done' ? 'done' : state === 'wait' ? 'not yet' : 'to do') + '</span>';
    var inner = mark + '<span>' + label + '</span>' + sr;
    if (state !== 'todo') { return '<span class="app-nav-item app-nav-camp app-nav-step is-' + state + '">' + inner + '</span>'; }
    return how === 'new'
      ? '<button class="app-nav-item app-nav-camp app-nav-step" type="button" data-new>' + inner + '</button>'
      : '<a class="app-nav-item app-nav-camp app-nav-step" href="' + how + '">' + inner + '</a>';
  }
  function getStarted(review) {
    return head('start', 'Get started') + (shut('start') ? '' : step(review ? 'Agency in review' : 'Agency approved', review ? 'wait' : 'done')
      + step('See a sample report', get(K_SAMPLE) ? 'done' : 'todo', 'campaign.html?id=' + SAMPLE)
      + step('Create your first campaign', review ? 'wait' : 'todo', 'new'));
  }

  window.onblueSideLists = {
    // the section the sidebar shows, and whether the open campaign is a row in it
    html: function (open, review) { return active().length ? activeList(open) : getStarted(review); },
    has: function (open) { return !!open && !shut('active') && active().some(function (c) { return c.id === open; }); },
    fold: function (key) { set('onblue-side-' + key, shut(key) ? 'open' : 'closed'); },
    // a sample report has been opened: the Get started step is done
    sawSample: function () { set(K_SAMPLE, '1'); }
  };
})();
