/* Shared helpers for the onBlue for business overhaul: the film library, the
   icon set, small DOM helpers, and the session (who signed up, their report).
   Every page loads this before its own script. Exposes window.OB. */
(function () {
  'use strict';

  // 24 clips in business/films (6 s, 360 px, muted). "pm-" ones are the team's
  // own Blue AI Shorts (many art styles); the rest are Blue Pitch Kit stories.
  var FILMS = [
    ['pm-ai-drama-cat', 'Cat drama'], ['aquarium-night-diver', 'Animated story'], ['pm-evolution-counter', 'Isometric timeline'],
    ['pm-ai-drama-photoreal', 'Photoreal story'], ['dj-last-set-4am', 'Animated story'], ['pm-what-if-3d', '3D what-if'],
    ['pm-deal-reveal', 'Deal reveal'], ['pm-ai-drama-fruit', 'Fruit drama'], ['dragon-finally-naps', 'Animated story'],
    ['pm-then-vs-now', 'Then vs now'], ['pm-when-meme', 'Meme edit'], ['ferris-wheel-operator-midnight', 'Animated story'],
    ['pm-ai-micro-horror', 'Micro horror'], ['pm-price-counter', 'Price counter'], ['hot-air-balloon-dawn', 'Animated story'],
    ['pm-talking-pc', 'Talking product'], ['pm-2000s-real-time', 'Real-time retro'], ['frog-choir-night-concert', 'Animated story'],
    ['pm-lab-prank', 'Screen trick'], ['pirate-captain-perfect-sailor', 'Animated story'], ['storm-chaser-night-drive', 'Animated story'],
    ['comet-every-40-years', 'Animated story'], ['clock-tower-keeper', 'Animated story'], ['penguin-dad-polar-night', 'Animated story']
  ];

  function filmBase() {
    var s = document.currentScript || document.querySelector('script[src*="ob.js"]');
    var src = s ? s.getAttribute('src') : 'js/ob.js';
    return src.replace(/js\/ob\.js.*$/, '') + 'films/';
  }
  var BASE = filmBase();

  function film(i) {
    var f = FILMS[((i % FILMS.length) + FILMS.length) % FILMS.length];
    return { id: f[0], label: f[1], src: BASE + f[0] + '.mp4', poster: BASE + f[0] + '.jpg' };
  }
  // a clip index whose label matches a format name, when one exists
  function filmFor(format, salt) {
    var hits = [];
    FILMS.forEach(function (f, i) { if (f[1].toLowerCase() === String(format).toLowerCase()) { hits.push(i); } });
    var n = Math.abs(salt | 0);
    return hits.length ? hits[n % hits.length] : n % FILMS.length;
  }
  function videoTag(f, cls) {
    return '<video class="' + (cls || '') + '" src="' + f.src + '" poster="' + f.poster + '" muted loop playsinline preload="none" data-ob-film></video>';
  }
  // play only the clips on screen: cheap on a page with 24 of them
  function watchFilms(root) {
    var vids = (root || document).querySelectorAll('video[data-ob-film]');
    if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.play().catch(function () {}); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.preload = 'auto'; e.target.play().catch(function () {}); } else { e.target.pause(); }
      });
    }, { rootMargin: '120px' });
    vids.forEach(function (v) { if (!v.__obw) { v.__obw = 1; io.observe(v); } });
  }

  var P = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    spark: '<path d="M12 3c.6 4.2 2.3 6 6.5 6.7-4.2.7-5.9 2.5-6.5 6.7-.6-4.2-2.3-6-6.5-6.7C9.7 9 11.4 7.2 12 3Z" fill="currentColor"/><path d="M18.5 15.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" fill="currentColor"/>',
    arrow: '<path ' + P + ' d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path ' + P + ' d="m5 12.5 4.2 4L19 7"/>',
    close: '<path ' + P + ' d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path ' + P + ' d="M12 5v14M5 12h14"/>',
    globe: '<circle ' + P + ' cx="12" cy="12" r="8.5"/><path ' + P + ' d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5S14.4 18.1 12 20.5C9.6 18.1 8.5 15.3 8.5 12S9.6 5.9 12 3.5Z"/>',
    home: '<path ' + P + ' d="M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5Z"/>',
    plan: '<rect ' + P + ' x="4" y="5" width="16" height="15" rx="2.5"/><path ' + P + ' d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6"/>',
    studio: '<rect ' + P + ' x="3.5" y="5" width="17" height="14" rx="2.5"/><path ' + P + ' d="m10 9.5 5 2.5-5 2.5Z"/>',
    brand: '<path ' + P + ' d="M12 3.5 14.4 9l5.6.4-4.3 3.7 1.3 5.5L12 15.6l-5 3 1.3-5.5L4 9.4 9.6 9Z"/>',
    radar: '<circle ' + P + ' cx="12" cy="12" r="8.5"/><circle ' + P + ' cx="12" cy="12" r="4.5"/><path ' + P + ' d="M12 12 18 6"/>',
    chart: '<path ' + P + ' d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
    play: '<path d="M8 5.5v13l11-6.5Z" fill="currentColor"/>',
    send: '<path ' + P + ' d="M12 19V5M6 11l6-6 6 6"/>',
    redo: '<path ' + P + ' d="M19 12a7 7 0 1 1-2.1-5M19 4v4h-4"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor"/><path d="m10 9 5 3-5 3Z" fill="#fff"/>',
    mail: '<rect ' + P + ' x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path ' + P + ' d="m4.5 7 7.5 6 7.5-6"/>',
    google: '<path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2Z" fill="#4285F4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2Z" fill="#FBBC05"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 5.9 12 5.9Z" fill="#EA4335"/>',
    users: '<circle ' + P + ' cx="9" cy="8.5" r="3.2"/><path ' + P + ' d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.6c1.5.7 2.6 2.2 3 4.4"/>',
    logout: '<path ' + P + ' d="M14 5h4.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H14M10 8l-4 4 4 4M6 12h10"/>'
  };
  function icon(name, size) {
    var s = size || 18;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  // BlueAI's badge carries the onBlue mark itself (Appy: the generic sparkle pair read as off-brand)
  var MARK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z"/></svg>';
  function agent(lg) { return '<span class="ob-agent' + (lg ? ' ob-agent--lg' : '') + '" aria-hidden="true">' + MARK + '</span>'; }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function short(n) { return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(Math.round(n)); }

  function store(k, v) {
    try {
      if (v === undefined) { var r = window.localStorage.getItem(k); return r ? JSON.parse(r) : null; }
      if (v === null) { window.localStorage.removeItem(k); } else { window.localStorage.setItem(k, JSON.stringify(v)); }
    } catch (e) { return null; }
    return v;
  }
  function sess(k, v) {
    try {
      if (v === undefined) { return window.sessionStorage.getItem(k); }
      if (v === null) { window.sessionStorage.removeItem(k); } else { window.sessionStorage.setItem(k, v); }
    } catch (e) { return null; }
    return v;
  }

  // one short line at the bottom of the screen
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'ob-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = icon('check', 16) + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('is-on');
    window.clearTimeout(toastT);
    toastT = window.setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  // the onBlue spark, same drawing as the PM's site logo
  var LOGO_MARK = '<svg class="ob-logo-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z"/></svg>';

  // $8 per 1,000 US views: the one price (Ashish, 2026-11-03)
  var RATE = 8;

  window.OB = {
    FILMS: FILMS, film: film, filmFor: filmFor, videoTag: videoTag, watchFilms: watchFilms,
    icon: icon, agent: agent, esc: esc, hash: hash, fmt: fmt, short: short,
    store: store, sess: sess, toast: toast, RATE: RATE, logoMark: LOGO_MARK
  };
})();
