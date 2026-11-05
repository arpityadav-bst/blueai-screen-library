/* brands.html (the Volt homepage): being signed in, the account menu, and the
   access gate. The PM's flow from the old brands.html, kept as it was: the same
   sessionStorage keys and values, the same copy, the same 1150ms provider wait,
   and every way into the app ends in leave('app/campaigns.html').
   Keys: onblue:signedin, onblue:agency, onblue:new, onblue:email, onblue:site,
   onblue:agency-status (app/shell.js and app/agency-kit.js read them). */
(function () {
  'use strict';

  var ss = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { window.sessionStorage.removeItem(k); } catch (e) {} }
  };

  // shown, then navigate: the cover is on screen before the old page can be misread
  function leave(url) {
    var cover = document.getElementById('leaving');
    if (cover) { cover.hidden = false; }
    window.location.href = url;
  }
  window.BH = { leave: leave };

  function signedIn() { return ss.get('onblue:signedin') === '1'; }
  function hasAgency() { return !!ss.get('onblue:agency'); }

  // who is signed in: the agency, else the email's local part, else the stub
  var ACCOUNT_STUB = 'Arpit Yadav';
  function acctLabel() {
    var a = ss.get('onblue:agency');
    if (a && a.trim()) { return a.trim(); }
    var e = ss.get('onblue:email');
    if (e && e.indexOf('@') > 0) { return e.split('@')[0]; }
    return ACCOUNT_STUB;
  }
  function paintAccount() {
    var label = acctLabel();
    var n = document.getElementById('acct-name'), av = document.getElementById('acct-av'), go = document.getElementById('acct-campaigns');
    if (n) { n.textContent = label; }
    if (av) { av.textContent = label.charAt(0).toUpperCase(); }
    if (go) { go.hidden = !hasAgency(); }
  }
  function markSignedIn() {
    ss.set('onblue:signedin', '1');
    document.body.classList.add('is-signed-in');
    paintAccount();
  }

  // ---- the account menu, and logging out (header menu and the burger's copy)
  var acct = document.getElementById('acct'), acctBtn = document.getElementById('acct-btn'), acctMenu = document.getElementById('acct-menu');
  function setAcct(on) {
    if (!acct || !acctBtn || !acctMenu) { return; }
    acct.classList.toggle('is-open', on);
    acctMenu.hidden = !on;
    acctBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  if (acctBtn) { acctBtn.addEventListener('click', function () { setAcct(acctMenu.hidden); }); }
  document.addEventListener('pointerdown', function (e) {
    if (!acctMenu || acctMenu.hidden || (e.target.closest && e.target.closest('#acct'))) { return; }
    setAcct(false);
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setAcct(false); } });
  if (signedIn()) { document.body.classList.add('is-signed-in'); paintAccount(); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-logout]') : null;
    if (!b) { return; }
    e.preventDefault();
    ['onblue:signedin', 'onblue:agency', 'onblue:new', 'onblue:email', 'onblue:site', 'onblue:agency-status'].forEach(ss.del);
    setAcct(false);
    document.body.classList.remove('is-signed-in');
  });

  /* BACK FROM THE APP (browser Back, or the app's way back to the site): a page
     restored from the back/forward cache comes back exactly as it left, with
     the leaving cover up, a gate open and the old signed-in state. Undo all
     three and repaint from sessionStorage, which the app may have changed. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) { return; }
    var cover = document.getElementById('leaving');
    if (cover) { cover.hidden = true; }
    setAcct(false);
    document.body.classList.toggle('is-signed-in', signedIn());
    if (signedIn()) { paintAccount(); }
    if (window.BH.resetGate) { window.BH.resetGate(); }
  });

  // ---- the gate ------------------------------------------------------------
  var gate = document.getElementById('gate');
  if (!gate || typeof gate.showModal !== 'function') { return; }
  var lv2 = gate.querySelector('[data-level="2"]');
  var mail = document.getElementById('gate-mail'), email = document.getElementById('gate-email'), err = document.getElementById('gate-email-err');
  var sub2 = document.getElementById('gate-sub-2'), altTitle = document.getElementById('gate-title-alt');
  var regPane = document.getElementById('pane-reg'), optsPane = document.getElementById('pane-opts'), regForm = document.getElementById('gate-reg');
  var loadEl = document.getElementById('gate-load');
  var returning = false, loading = false, closing = 0;
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };

  // which ask is showing; the doors pane is the only one reached two ways
  function pane(which) {
    var reg = which === 'register';
    regPane.hidden = !reg; optsPane.hidden = reg;
    if (!reg) {
      altTitle.innerHTML = which === 'signin' ? 'Sign in to <span class="ob-tone">onBlue</span>.' : 'Choose how to <span class="ob-tone">sign in</span>.';
      sub2.textContent = which === 'signin' ? 'Sign in to open your dashboard.' : 'This is how you will get back to your campaigns.';
    }
    gate.setAttribute('aria-labelledby', reg ? 'gate-title-2' : 'gate-title-alt');
    if (which === 'choose' && email) { email.value = ss.get('onblue:email') || ''; }
  }

  function openMail() {
    if (mail.classList.contains('is-open')) { email.focus(); return; }
    mail.classList.add('is-open');
    window.setTimeout(function () { email.focus(); }, 30);
  }

  function open(asReturning) {
    window.clearTimeout(closing);
    returning = !!asReturning;
    if (signedIn() && hasAgency()) { leave('app/campaigns.html'); return; }
    if (signedIn()) { prefillReg(); }
    pane(signedIn() ? 'register' : (returning ? 'signin' : 'choose'));
    clearError();
    loading = false; loadEl.hidden = true;
    mail.classList.remove('is-open');
    email.value = '';
    if (!gate.open) { gate.showModal(); }
    document.documentElement.classList.add('gate-lock');
    lv2.hidden = false;
    window.requestAnimationFrame(function () { gate.classList.add('is-open'); });
  }
  // the gate, shut at once with nothing pending (a page back from the cache)
  window.BH.resetGate = function () {
    window.clearTimeout(closing);
    loading = false; loadEl.hidden = true;
    gate.classList.remove('is-open');
    document.documentElement.classList.remove('gate-lock');
    if (gate.open) { gate.close(); }
  };
  function close() {
    if (loading) { return; }
    gate.classList.remove('is-open');
    document.documentElement.classList.remove('gate-lock');
    closing = window.setTimeout(function () { if (gate.open) { gate.close(); } }, 260);
  }

  function clearError() { err.hidden = true; err.textContent = ''; email.classList.remove('is-bad'); }
  function check() {
    var v = email.value;
    if (!v.trim()) { return 'Add the email you want to be contacted on.'; }
    if (!isEmail(v)) { return 'That doesn’t look like an email. Check for a typo.'; }
    return '';
  }
  function showError(bad) { err.textContent = bad; err.hidden = false; email.classList.add('is-bad'); }
  function proceed() {
    var bad = check();
    if (bad) { showError(bad); email.focus(); return; }
    ss.set('onblue:email', email.value.trim());
    toAgency();
  }

  // a door pressed is the sign-in; a returning reader goes to the app, a new one registers
  function toAgency() {
    markSignedIn();
    loading = true; loadEl.hidden = false;
    window.setTimeout(function () {
      if (returning) {
        if (!hasAgency()) { standInAgency(); }
        leave('app/campaigns.html');
        return;
      }
      loading = false;
      prefillReg();
      pane('register');
      loadEl.hidden = true;
    }, 1150);
  }

  // never ask twice: the work email arrives filled, the website follows it until typed
  var FREE_MAIL = /^(gmail|googlemail|outlook|hotmail|live|msn|yahoo|ymail|icloud|me|aol|proton|protonmail|zoho|gmx|mail|rediffmail)\./i;
  var siteTyped = false;
  var regName = document.getElementById('reg-name'), regMail = document.getElementById('reg-mail'), regSite = document.getElementById('reg-site');
  function siteFrom(m) {
    var dom = (m.split('@')[1] || '').trim().toLowerCase();
    return dom && dom.indexOf('.') > 0 && !FREE_MAIL.test(dom) ? 'https://' + dom : '';
  }
  function prefillReg() {
    var known = ss.get('onblue:email') || '';
    if (known && !regMail.value) { regMail.value = known; }
    if (!siteTyped && !regSite.value) { regSite.value = siteFrom(regMail.value); }
  }
  regSite.addEventListener('input', function () { siteTyped = regSite.value.trim() !== ''; });
  regMail.addEventListener('input', function () { if (!siteTyped) { regSite.value = siteFrom(regMail.value); } });
  function standInAgency() {
    var dom = ((ss.get('onblue:email') || '').split('@')[1] || '').split('.')[0];
    ss.set('onblue:agency', dom ? dom.charAt(0).toUpperCase() + dom.slice(1) : 'Acme Games');
    ss.set('onblue:agency-status', 'approved');
  }

  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    function fail(el, msg) {
      var slot = el.parentNode.querySelector('[data-msg]');
      if (slot) { slot.textContent = msg || ''; slot.classList.toggle('is-err', !!msg); }
      el.classList.toggle('is-bad', !!msg);
      return !!msg;
    }
    var bad = fail(regName, regName.value.trim() ? '' : 'Tell us what the agency is called.');
    bad = fail(regMail, !regMail.value.trim() ? 'Add the email we should reply to.'
      : !isEmail(regMail.value) ? 'That does not look like an email. Check for a typo.' : '') || bad;
    if (bad) { (regName.value.trim() ? regMail : regName).focus(); return; }
    ss.set('onblue:agency', regName.value.trim());
    ss.set('onblue:new', '1');
    ss.set('onblue:agency-status', 'review');
    ss.set('onblue:email', regMail.value.trim());
    if (regSite.value.trim()) { ss.set('onblue:site', regSite.value.trim()); }
    leave('app/campaigns.html');
  });

  gate.addEventListener('click', function (e) {
    if (e.target === gate) { close(); return; }   // the dialog itself is the backdrop
    var act = e.target.closest('[data-gate]');
    if (!act) { return; }
    var what = act.getAttribute('data-gate');
    if (what === 'close') { close(); }
    else if (what === 'signin') { open(true); }
    else if (what === 'email') { openMail(); }
    else if (what === 'continue') { proceed(); }
    else if (what === 'google') { ss.del('onblue:email'); toAgency(); }
  });
  gate.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  email.addEventListener('blur', function () { if (email.value.trim()) { var bad = check(); if (bad) { showError(bad); } } });
  email.addEventListener('input', clearError);
  email.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); proceed(); } });

  // every door into the product says so in its markup (data-gate); a modified click keeps the #post fallback
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-gate="open"], [data-gate="signin"]');
    if (!a || gate.open || gate.contains(a)) { return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) { return; }
    e.preventDefault();
    open(a.getAttribute('data-gate') === 'signin');
  });
})();
