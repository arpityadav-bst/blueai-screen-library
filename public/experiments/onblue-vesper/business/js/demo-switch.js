/* Prototype shortcut (Appy): a small pill in the website's bottom-left corner
   that skips the free report and the sign-up. It builds a finished report for
   a dummy brand (Northline Coffee), signs in as it, marks the tour as seen and
   opens the dashboard at either prototype stage: Day 1 (just signed up) or
   Week 2 (two weeks in). Not part of the product; delete this file and its
   <script> tag to remove it. */
(function () {
  'use strict';
  var OB = window.OB;
  var SITE = 'northline-coffee.com', EMAIL = 'sam@northline-coffee.com';

  var css = '.ob-demo{position:fixed;left:max(1rem,env(safe-area-inset-left));bottom:max(1rem,env(safe-area-inset-bottom));z-index:90;font:500 0.8125rem/1.3 var(--font)}' +
    /* at rest: tiny and dim, so it never competes with the page; full on hover, focus or open */
    '.ob-demo-pill{position:relative;display:inline-flex;align-items:center;gap:0.3125rem;height:1.375rem;padding:0 0.5rem;border:1px solid rgba(255,255,255,0.12);border-radius:999px;background:#0b0b0a;color:#f2f2ec;font:500 0.6875rem/1 var(--font);cursor:pointer;opacity:0.18;transition:opacity 0.2s ease}' +
    '.ob-demo-pill::before{content:"";width:0.3125rem;height:0.3125rem;border-radius:50%;background:#c6f432}' +
    '.ob-demo-pill::after{content:"";position:absolute;inset:-0.75rem}' +
    '.ob-demo:hover .ob-demo-pill,.ob-demo-pill:focus-visible,.ob-demo.is-open .ob-demo-pill{opacity:1;outline:0}' +
    '.ob-demo-menu{position:absolute;left:0;bottom:calc(100% + 0.625rem);width:16.5rem;padding:0.5rem;border:1px solid rgba(10,10,9,0.08);border-radius:0.875rem;background:#fff;box-shadow:0 1.25rem 2.5rem -1rem rgba(10,10,9,0.35);opacity:0;transform:translateY(0.5rem);pointer-events:none;transition:opacity 0.2s ease,transform 0.2s ease}' +
    '.ob-demo.is-open .ob-demo-menu{opacity:1;transform:none;pointer-events:auto}' +
    '.ob-demo-menu p{margin:0;padding:0.5rem 0.625rem 0.375rem;color:#77776f;font:400 0.75rem/1.4 var(--font)}' +
    '.ob-demo-menu button{display:grid;gap:0.125rem;width:100%;padding:0.625rem;border:0;border-radius:0.5625rem;background:none;color:#0a0a09;font:500 0.875rem/1.25 var(--font);text-align:left;cursor:pointer}' +
    '.ob-demo-menu button small{color:#77776f;font:400 0.75rem/1.3 var(--font)}' +
    '.ob-demo-menu button:hover,.ob-demo-menu button:focus-visible{outline:0;background:#f3f3ee}' +
    '@media (max-width:700px){.ob-demo-menu button{min-height:2.75rem}}' +
    '@media (prefers-reduced-motion:reduce){.ob-demo-menu,.ob-demo-pill{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('div');
  box.className = 'ob-demo';
  box.innerHTML = '<div class="ob-demo-menu" role="menu"><p>Skip the report and sign-up. Opens the dashboard as Northline Coffee.</p>' +
    '<button type="button" role="menuitem" data-demo="new">Dashboard, Day 1<small>Just signed up, first videos making</small></button>' +
    '<button type="button" role="menuitem" data-demo="running">Dashboard, Week 2<small>Two weeks in, videos live</small></button></div>' +
    '<button class="ob-demo-pill" type="button" aria-haspopup="menu" aria-expanded="false">Prototype</button>';
  document.body.appendChild(box);
  var pill = box.querySelector('.ob-demo-pill');

  function show(on) { box.classList.toggle('is-open', on); pill.setAttribute('aria-expanded', String(on)); }
  function go(stage) {
    var r = OB.report.make({ site: SITE });
    r.done = 6; r.email = EMAIL; r.name = 'Sam'; r.today = 'Sometimes';
    OB.report.save(r);
    OB.sess('onblue:signedin', '1'); OB.sess('onblue:email', EMAIL); OB.sess('onblue:site', SITE);
    OB.sess('onblue:agency', r.brand); OB.sess('onblue:agency-status', 'approved');
    OB.store('onblue-tour-done', 1); OB.store('onblue-app-new', null); OB.store('onblue-app-running', null);
    OB.store('onblue-app-stage', stage);
    window.location.href = 'app/home.html';
  }
  pill.addEventListener('click', function () { show(!box.classList.contains('is-open')); });
  box.addEventListener('click', function (ev) { var b = ev.target.closest('[data-demo]'); if (b) { go(b.getAttribute('data-demo')); } });
  document.addEventListener('click', function (ev) { if (!box.contains(ev.target)) { show(false); } });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && box.classList.contains('is-open')) { show(false); pill.focus(); } });
})();
