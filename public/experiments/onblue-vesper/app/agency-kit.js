/* What the agency pages share: the email test, the free-mail list, the
   website guessed from a work email, and the agency avatar (site favicon,
   initials while it loads or when it fails). Used by settings.js. Registering
   happens in the homepage gate (brands.html), which keeps its own copy of the
   email test and the free-mail rule. */
(function () {
  'use strict';

  // character for character the test brands.html and apply.html use
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); }

  // personal inboxes: their domain says nothing about the agency, so no website guess
  var FREE = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'yahoo.com', 'ymail.com', 'rocketmail.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com',
    'proton.me', 'protonmail.com', 'pm.me', 'zoho.com', 'zohomail.com', 'gmx.com', 'gmx.net',
    'mail.com', 'yandex.com', 'yandex.ru', 'rediffmail.com', 'hey.com', 'fastmail.com',
    'tutanota.com', 'qq.com', '163.com', 'naver.com'];
  // the same brands under country domains (yahoo.co.in, hotmail.co.uk, outlook.fr...)
  var FREE_FAMILY = /^(yahoo|hotmail|outlook|live|gmx|yandex|rediffmail)\.[a-z.]+$/;

  function domainOf(email) {
    var v = String(email || '').trim().toLowerCase();
    var at = v.lastIndexOf('@');
    return at > 0 ? v.slice(at + 1) : '';
  }
  function isFreeMail(email) {
    var d = domainOf(email);
    return FREE.indexOf(d) !== -1 || FREE_FAMILY.test(d);
  }
  // "you@acmegames.com" gives "https://acmegames.com"; free mail or a bad address gives ''
  function siteFromEmail(email) {
    if (!isEmail(email) || isFreeMail(email)) { return ''; }
    return 'https://' + domainOf(email);
  }

  // the bare host of whatever was typed, or '' when it cannot be a website
  function hostOf(url) {
    var v = String(url || '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '');
    v = v.split(/[\/?#]/)[0].replace(/^www\./, '').replace(/:\d+$/, '');
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v) ? v : '';
  }

  function initial(name) { return String(name || '').trim().charAt(0).toUpperCase(); }

  // per host: true once a real favicon loaded, false once it failed
  var known = {};

  /* Paints a 24px avatar into el: the initial right away, the favicon when it
     arrives. Google answers an unknown site with a 16px globe, so anything
     that small counts as no icon and the initial stays. */
  function paintAvatar(el, name, site) {
    if (!el) { return; }
    var host = hostOf(site);
    el.setAttribute('data-host', host);
    if (host && known[host] === true) { setIcon(el, host); return; }
    var ch = initial(name);
    el.textContent = ch;
    el.classList.toggle('is-empty', !ch);
    el.classList.remove('has-icon');
    // no site, a failed one, or one already on its way: the initial is the answer for now
    if (!host || known[host] !== undefined) { return; }
    known[host] = 'loading';
    var img = new Image();
    img.onload = function () {
      known[host] = img.naturalWidth > 16;
      if (known[host] && el.getAttribute('data-host') === host) { setIcon(el, host); }
    };
    img.onerror = function () { known[host] = false; };
    img.src = iconUrl(host);
  }
  function iconUrl(host) { return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64'; }
  function setIcon(el, host) {
    el.innerHTML = '<img src="' + iconUrl(host) + '" alt="" width="24" height="24">';
    el.classList.add('has-icon');
    el.classList.remove('is-empty');
  }

  // sessionStorage, wrapped: a private window or blocked storage must not break the page
  function get(k) { try { return window.sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) {
    try {
      if (v) { window.sessionStorage.setItem(k, v); } else { window.sessionStorage.removeItem(k); }
      return true;
    } catch (e) { return false; }
  }

  // the field error slot: text, red border, and the input says why it is invalid
  function fieldError(input, msg) {
    var slot = document.getElementById(input.id + '-msg');
    if (slot) { slot.textContent = msg || ''; slot.hidden = !msg; }
    input.classList.toggle('is-bad', !!msg);
    if (msg) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    return !!msg;
  }

  window.onblueAgency = {
    isEmail: isEmail,
    isFreeMail: isFreeMail,
    siteFromEmail: siteFromEmail,
    hostOf: hostOf,
    paintAvatar: paintAvatar,
    get: get,
    set: set,
    fieldError: fieldError,
    // PM's strings, quoted from the register pane in brands.html
    ERR: {
      name: 'Tell us what the agency is called.',
      mailEmpty: 'Add the email we should reply to.',
      mailBad: 'That does not look like an email. Check for a typo.'
    }
  };
})();
