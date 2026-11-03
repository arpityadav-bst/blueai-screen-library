/* The app shell: sidebar, account menu, phone nav, toasts and the session.
   Every signed-in page has <aside class="app-side" id="side"> and calls nothing:
   this fills it on load and exposes window.onblueApp for the page script.

   THE SESSION IS THE HOMEPAGE GATE'S, read from the same sessionStorage keys
   (brands.html: onblue:signedin, onblue:agency, onblue:email, onblue:site).
   One key is new: onblue:agency-status, 'review' until the agency is approved.
   A reviewer who opens an app page directly, without signing in, sees a demo
   agency, so the prototype never bounces the person reviewing it. */
(function () {
  'use strict';

  var KEYS = ['onblue:signedin', 'onblue:agency', 'onblue:new', 'onblue:email', 'onblue:site', 'onblue:agency-status'];
  var DEMO = { agency: 'Acme Games', email: 'you@acmegames.com' };

  function get(k) { try { return window.sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* storage off: the page still works */ } }

  var session = {
    agency: get('onblue:agency') || DEMO.agency,
    email: get('onblue:email') || DEMO.email,
    status: get('onblue:agency-status') || 'approved'
  };
  // the one-shot "just registered" flag from the gate becomes a lasting status here
  if (get('onblue:new') === '1') {
    session.status = 'review';
    set('onblue:agency-status', 'review');
    try { window.sessionStorage.removeItem('onblue:new'); } catch (e) {}
    session.justRegistered = true;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var I = {
    spark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    campaigns: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9h17M8 13.5h8M8 16.5h5"/></svg>',
    samples: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/></svg>',
    settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    // a circle reads smaller than a square of the same span, so this one runs a
    // unit wider than the others (optical sizing): r 9.5 against their 17-wide boxes
    pricing: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M15 9.2c-.45-1-1.6-1.7-3-1.7-1.7 0-2.8.9-2.8 2.2s1.2 1.8 2.8 2.2 2.8.9 2.8 2.2-1.1 2.3-2.8 2.3c-1.3 0-2.5-.7-3-1.7M12 6v1.5M12 16.5V18"/></svg>',
    help: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.5M12 17h.01"/></svg>',
    ext: '<svg class="ext" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7"/></svg>',
    updown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 9 4-4 4 4M8 15l4 4 4-4"/></svg>',
    site: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    out: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17 5 12l5-5M5 12h11M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    // THE close, for every close in the app: one glyph, 16px, stroke 1.8.
    // Its button is 36px over a page or in a dialog, 28px inside a notification.
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  function item(href, icon, label, current, extra) {
    return '<a class="app-nav-item" href="' + href + '"' + (current ? ' aria-current="page"' : '') + '>'
      + icon + '<span>' + label + '</span>' + (extra || '') + '</a>';
  }

  function renderSide() {
    var side = document.getElementById('side');
    if (!side) { return; }
    var page = document.body.getAttribute('data-page');
    var review = session.status === 'review';
    side.innerHTML =
      '<a class="app-brand" href="../brands.html" aria-label="onBlue home">' + I.spark + '<span><i>on</i>Blue</span></a>'
      // phone only: the drawer's own way out, beside the scrim and Escape
      + '<button class="app-btn app-btn--icon app-btn--quiet app-side-close" type="button" data-nav-close aria-label="Close menu">' + I.close + '</button>'
      + '<button class="app-nav-item app-nav-new" type="button" data-new title="New campaign">' + I.plus + '<span>New campaign</span></button>'
      + item('campaigns.html', I.campaigns, 'Campaigns', page === 'campaigns', '<span class="app-count" id="side-count" hidden></span>')
      + item('campaigns.html#samples', I.samples, 'Sample reports', false)
      // Settings and How pricing works are off the nav for now (Appy, 2026-11-03):
      // settings.html and pricing.js stay, unlinked, until they come back
      + '<div class="app-side-spacer"></div>'
      // no Help item until there is a help page to send it to: a dead link is worse than none
      /* ONE IDENTITY ROW, ONE LINE (Appy): the agency's name on a nav-height row,
         its avatar on the nav icons' centre line and its name where their labels
         start, so the foot of the sidebar is the same column as the rest. The
         email is in the menu ("Signed in as"); "in review" is the avatar's blue
         dot, the popover, and the menu's Review status */
      + '<div class="app-acct"><button class="app-acct-btn" type="button" aria-haspopup="menu" aria-expanded="false" data-acct title="' + esc(session.agency) + (review ? ', in review' : '') + '">'
      + '<span class="app-acct-av' + (review ? ' is-review' : '') + '" aria-hidden="true">' + esc(session.agency.charAt(0).toUpperCase()) + '</span>'
      + '<span class="app-acct-name">' + esc(session.agency) + '</span>' + I.updown + '</button>'
      + '<div class="app-menu" role="menu" hidden>'
      + '<p class="app-menu-note">Signed in as ' + esc(session.email) + '</p>'
      + (review ? '<button class="app-menu-item" type="button" role="menuitem" data-agency-card>' + I.clock + 'Review status</button>' : '')
      + '<a class="app-menu-item" role="menuitem" href="../brands.html">' + I.site + 'Back to the onBlue site</a>'
      + '<div class="app-menu-sep"></div>'
      + '<button class="app-menu-item" type="button" role="menuitem" data-logout>' + I.out + 'Sign out</button>'
      + '</div></div>';
    if (!document.querySelector('.app-scrim')) {
      var scrim = document.createElement('div');
      scrim.className = 'app-scrim';
      scrim.setAttribute('data-nav-close', '');
      document.body.appendChild(scrim);
    }
    renderPop();
  }

  /* AGENCY STATUS SPEAKS FROM THE IDENTITY ROW (Appy): while the agency is in
     review, a popover points at its "In review" from the right, on every
     page. Closed, it stays closed for the visit; the row's menu has Review
     status to open it again. A page can say one thing there once (agencyNote: "approved"). It
     floats, so it is fixed to the card's measured place; not on phones, where
     the sidebar is a drawer and its card already says "In review". */
  var POP_KEY = 'onblue-notice-review', note = null;
  function popClosed() { try { return window.sessionStorage.getItem(POP_KEY) === 'closed'; } catch (e) { return false; } }
  function renderPop() {
    var old = document.getElementById('agency-pop');
    if (old) { old.remove(); }
    var card = document.querySelector('.app-acct-btn');
    var wanted = note || (session.status === 'review' && !popClosed());
    if (!card || !wanted || !window.matchMedia('(min-width: 768px)').matches) { return; }
    var p = document.createElement('div');
    p.id = 'agency-pop';
    p.className = 'agency-pop' + (note ? ' is-ok' : '');
    p.setAttribute('role', 'status');
    p.innerHTML = (note ? I.check : I.clock) + '<span class="agency-pop-text"><b>' + (note ? note.title : 'Registration received') + '</b>'
      + (note ? note.body : 'We usually approve within one working day and will email '
        + esc(session.email) + '. You can draft campaigns meanwhile.') + '</span>'
      + '<button class="app-btn app-btn--sm app-btn--icon app-btn--quiet" type="button" data-pop-close aria-label="Dismiss">' + I.close + '</button>';
    document.body.appendChild(p);
    // level with the card, lifted only as far as the window's foot requires
    var r = card.getBoundingClientRect(), top = Math.max(8, Math.min(r.top, window.innerHeight - p.offsetHeight - 8));
    p.style.top = top + 'px';
    p.style.left = (r.right + 12) + 'px';
    p.style.setProperty('--pop-arrow', (r.top - top + r.height / 2) + 'px');
  }
  window.addEventListener('resize', renderPop);

  var toastT;
  function toast(msg) {
    var t = document.querySelector('.app-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'app-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.innerHTML = I.check + '<span>' + esc(msg) + '</span>';
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, 4000);
  }

  function closeAcct() {
    var b = document.querySelector('[data-acct]');
    if (!b) { return; }
    b.setAttribute('aria-expanded', 'false');
    b.nextElementSibling.hidden = true;
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-pop-close]')) {
      if (note) { note = null; } else { try { window.sessionStorage.setItem(POP_KEY, 'closed'); } catch (err) { /* this page only */ } }
      renderPop();
      return;
    }
    if (t.closest('[data-agency-card]')) {
      closeAcct();
      try { window.sessionStorage.removeItem(POP_KEY); } catch (err) { /* it shows anyway */ }
      renderPop();
      return;
    }
    var acct = t.closest('[data-acct]');
    if (acct) {
      var open = acct.getAttribute('aria-expanded') !== 'true';
      acct.setAttribute('aria-expanded', String(open));
      acct.nextElementSibling.hidden = !open;
      return;
    }
    if (!t.closest('.app-menu')) { closeAcct(); }
    if (t.closest('[data-logout]')) {
      KEYS.forEach(function (k) { try { window.sessionStorage.removeItem(k); } catch (err) {} });
      window.location.href = '../brands.html';
      return;
    }
    if (t.closest('[data-nav-open]')) { document.documentElement.classList.add('is-nav-open'); return; }
    if (t.closest('[data-nav-close]') || t.closest('.app-nav-item')) { document.documentElement.classList.remove('is-nav-open'); }
    if (t.closest('[data-new]')) { e.preventDefault(); newCampaign(); return; }
    // pricing opens over the current page; its script loads on first use
    if (t.closest('[data-pricing]')) {
      e.preventDefault();
      if (window.onbluePricing) { window.onbluePricing(); return; }
      var s = document.createElement('script');
      s.src = 'pricing.js';
      s.onload = function () { window.onbluePricing(); };
      document.head.appendChild(s);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAcct(); document.documentElement.classList.remove('is-nav-open'); }
  });

  renderSide();

  /* New campaign opens the type picker over this page (type-picker.js, loaded
     on first use). Phones go straight to the form, which tells them to use a
     computer. ?new=1 opens it on arrival: where the form sends an address
     that names no type. */
  function newCampaign() {
    if (!window.matchMedia('(min-width: 640px)').matches) { window.location.href = 'new.html'; return; }
    if (window.onblueTypePicker) { window.onblueTypePicker(); return; }
    var s = document.createElement('script');
    s.src = 'type-picker.js';
    s.onload = function () { window.onblueTypePicker(); };
    document.head.appendChild(s);
  }
  if (new URLSearchParams(location.search).get('new') === '1') {
    history.replaceState(null, '', location.pathname + location.hash);
    setTimeout(newCampaign, 0);
  }

  /* A confirmation that belongs to one control is said beside it, then fades:
     "up to date" is about the button just pressed, not news for the whole page. */
  function flash(btn, msg) {
    var old = btn.parentNode.querySelector('.app-flash');
    if (old) { old.remove(); }
    var f = document.createElement('span');
    f.className = 'app-flash';
    f.setAttribute('role', 'status');
    f.innerHTML = I.check + '<span>' + esc(msg) + '</span>';
    btn.parentNode.insertBefore(f, btn);
    requestAnimationFrame(function () { f.classList.add('is-on'); });
    setTimeout(function () { f.classList.remove('is-on'); }, 2000);
    setTimeout(function () { f.remove(); }, 2300);
  }

  window.onblueApp = {
    flash: flash,
    session: session,
    esc: esc,
    icons: I,
    toast: toast,
    agencyNote: function (title, body) { note = { title: title, body: body }; renderPop(); },
    setStatus: function (s) {
      session.status = s;
      set('onblue:agency-status', s);
      // back into review is news again: its popover shows, and an old "approved" goes
      if (s === 'review') { note = null; try { window.sessionStorage.removeItem(POP_KEY); } catch (e) { /* shows anyway */ } }
      // approval moves the waiting campaigns into review without a reload
      if (s !== 'review' && window.onblueData) { window.onblueData.promoteWaiting(); }
      renderSide();
    },
    setCount: function (n) {
      var c = document.getElementById('side-count');
      if (!c) { return; }
      c.hidden = !n;
      c.textContent = n > 99 ? '99+' : String(n);
    }
  };
})();
