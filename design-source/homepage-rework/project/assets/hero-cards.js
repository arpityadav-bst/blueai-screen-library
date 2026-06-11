/* ============================================================================
   BlueAI Hero — Agent card inner animations
   Each agent is a self-contained module: build<Name>(root) returns
     { tl, setEndState, name }
   - tl          : a paused GSAP timeline that plays the agent's "process"
   - setEndState : snaps the scene to its finished frame (used for
                   reduced-motion and for inactive cards)
   Refine any one card without touching the others.
   ============================================================================ */
(function () {
  const G = window.gsap;
  const EASE = 'power3.out';

  // tiny number formatter
  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  /* --------------------------------------------------------------------------
     CAREER — Auto-apply
     Rich (Stage layout): type a search → scan results → select one →
       slide to form → auto-fill fields → attach CV + cover letter →
       Submit pulse → "Applied ✓" + counter.
     Legacy (3-card layout): job card → fields fill → submit → applied.
     One builder, branches on whether the multi-scene markup is present.
     -------------------------------------------------------------------------- */
  function buildCareer(root) {
    const rich = root.querySelector('.cr-find');
    return rich ? buildCareerRich(root) : buildCareerLegacy(root);
  }

  function buildCareerRich(root) {
    const find    = root.querySelector('.cr-find');
    const apply   = root.querySelector('.cr-apply');
    const query   = root.querySelector('.cr-query');
    const caret   = root.querySelector('.cr-caret');
    const results = root.querySelectorAll('.cr-result');
    const pick    = root.querySelector('.cr-result[data-pick="1"]');
    const fills   = root.querySelectorAll('.cr-fill');
    const chips   = root.querySelectorAll('.cr-chip');
    const btn     = root.querySelector('.cr-submit');
    const ripple  = root.querySelector('.cr-ripple');
    const done    = root.querySelector('.cr-applied');
    const count   = root.querySelector('.cr-count');
    const QUERY   = 'Product Manager · Remote';
    const typer   = { i: 0 };
    const counter = { v: 23 };

    function setEndState() {
      G.set(find,  { xPercent: -100, opacity: 0 });
      G.set(apply, { xPercent: 0, opacity: 1 });
      G.set(fills, { scaleX: 1 });
      G.set(chips, { opacity: 1, scale: 1 });
      G.set(btn,   { opacity: 0, display: 'none' });
      G.set(ripple,{ opacity: 0, scale: 0 });
      G.set(done,  { opacity: 1, y: 0 });
      query.textContent = QUERY;
      G.set(caret, { opacity: 0 });
      count.textContent = '24';
    }

    const tl = G.timeline({ paused: true });
    // --- prime ---
    tl.set(find,  { xPercent: 0, opacity: 1 })
      .set(apply, { xPercent: 100, opacity: 0 })
      .set(results, { opacity: 0, y: 8 })
      .set(pick, { '--pick': 0 })
      .set(fills, { scaleX: 0, transformOrigin: 'left center' })
      .set(chips, { opacity: 0, scale: 0.7, transformOrigin: 'left center' })
      .set(btn, { display: 'flex', opacity: 1, scale: 1 })
      .set(ripple, { opacity: 0, scale: 0, xPercent: -50, yPercent: -50 })
      .set(done, { opacity: 0, y: 6 })
      .call(() => { query.textContent = ''; })
      .set(caret, { opacity: 1 });

    // 1 — type the search query (finite caret blink keeps tl.duration finite)
    tl.to(caret, { opacity: 0.15, duration: 0.4, repeat: 5, yoyo: true, ease: 'steps(1)' }, 0);
    tl.to(typer, { i: QUERY.length, duration: 1.0, ease: 'none', snap: { i: 1 }, lazy: false,
      onUpdate: () => { query.textContent = QUERY.slice(0, typer.i); } }, 0.15);

    // 2 — results scan in
    tl.to(results, { opacity: 1, y: 0, duration: 0.34, stagger: 0.12, ease: EASE }, 1.2);

    // 3 — select the top match
    tl.add(() => pick.classList.add('is-pick'), 1.95)
      .fromTo(pick, { scale: 1 }, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 1.95)
      .to(results, { opacity: (i, t) => (t === pick ? 1 : 0.4), duration: 0.25 }, 1.95);

    // 4 — slide find → apply
    tl.to(find,  { xPercent: -100, opacity: 0, duration: 0.42, ease: 'power3.out' }, 2.35)
      .fromTo(apply, { xPercent: 100, opacity: 1 }, { xPercent: 0, opacity: 1, duration: 0.42, ease: 'power3.out' }, 2.35)
      .set(caret, { opacity: 0 }, 2.35);

    // 5 — auto-fill the form fields
    tl.to(fills, { scaleX: 1, duration: 0.34, stagger: 0.2, ease: 'power2.out' }, 2.8);

    // 6 — attach CV + cover letter
    tl.to(chips, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.18, ease: 'back.out(2)' }, 3.35);

    // 7 — submit pulse → ripple → Applied + counter
    tl.to(btn, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 3.85)
      .set(ripple, { scale: 0, opacity: 0.55 }, 4.0)
      .to(ripple, { scale: 1, opacity: 0, duration: 0.5, ease: 'power2.out' }, 4.0)
      .to(btn, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 4.05)
      .set(btn, { display: 'none' }, 4.25)
      .fromTo(done, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.32, ease: 'back.out(1.7)' }, 4.2)
      .fromTo(counter, { v: 23 }, { v: 24, duration: 0.45, ease: 'power1.out', snap: { v: 1 }, lazy: false,
        onUpdate: () => { count.textContent = fmt(counter.v); } }, 4.2)
      .to({}, { duration: 0.5 }); // brief hold

    return { tl, setEndState, name: 'career' };
  }

  function buildCareerLegacy(root) {
    const job   = root.querySelector('.cr-job');
    const fills  = root.querySelectorAll('.cr-fill');
    const btn   = root.querySelector('.cr-submit');
    const ripple = root.querySelector('.cr-ripple');
    const done  = root.querySelector('.cr-applied');
    const count = root.querySelector('.cr-count');
    const counter = { v: 23 };

    function setEndState() {
      G.set(job, { y: 0, opacity: 1 });
      G.set(fills, { scaleX: 1 });
      G.set(btn, { opacity: 0, scale: 0.9, display: 'none' });
      G.set(ripple, { opacity: 0, scale: 0 });
      G.set(done, { opacity: 1, y: 0 });
      count.textContent = '24';
    }

    const tl = G.timeline({ paused: true });
    tl.set([done], { opacity: 0, y: 6 })
      .set(btn, { display: 'flex', opacity: 1, scale: 1 })
      .set(ripple, { opacity: 0, scale: 0 })
      .set(fills, { scaleX: 0, transformOrigin: 'left center' })
      .fromTo(job, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: EASE })
      .to(fills, { scaleX: 1, duration: 0.4, stagger: 0.22, ease: 'power2.out' }, '-=0.1')
      .to(btn, { scale: 1.05, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '+=0.15')
      .set(ripple, { scale: 0, opacity: 0.5, xPercent: -50, yPercent: -50 })
      .to(ripple, { scale: 1, opacity: 0, duration: 0.5, ease: 'power2.out' }, '<')
      .to(btn, { opacity: 0, scale: 0.92, duration: 0.2, ease: 'power2.in' }, '-=0.12')
      .set(btn, { display: 'none' })
      .fromTo(done, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' })
      .fromTo(counter, { v: 23 }, {
        v: 24, duration: 0.5, ease: 'power1.out', snap: { v: 1 },
        onUpdate: () => { count.textContent = fmt(counter.v); }
      }, '<')
      .to({}, { duration: 0.9 }); // hold

    return { tl, setEndState, name: 'career' };
  }

  /* --------------------------------------------------------------------------
     CREATOR — Faceless video
     Rich (Stage): write a script → set style / template / length →
       Generate → 3 variations render → select one → views climb.
     Legacy (3-card): trending → script lines → storyboard → play → views.
     Branches on whether the multi-scene markup is present.
     -------------------------------------------------------------------------- */
  function buildCreator(root) {
    const rich = root.querySelector('.cv-brief');
    return rich ? buildCreatorRich(root) : buildCreatorLegacy(root);
  }

  function buildCreatorRich(root) {
    const brief   = root.querySelector('.cv-brief');
    const render  = root.querySelector('.cv-render');
    const typed   = root.querySelector('.cv-typed');
    const caret   = root.querySelector('.cv-caret');
    const sets    = root.querySelectorAll('.cv-set');
    const gen     = root.querySelector('.cv-generate');
    const spin    = root.querySelector('.cv-spin');
    const lbl     = root.querySelector('.cv-render-lbl');
    const preview = root.querySelector('.cv-preview');
    const play    = root.querySelector('.cv-play');
    const caps    = root.querySelectorAll('.cv-cap');
    const steps   = root.querySelectorAll('.cv-step');
    const deliver = root.querySelector('.cv-deliver-card');
    const TOPIC   = 'Daily stoic philosophy — calm, cinematic shorts';
    const typer   = { i: 0 };

    function setEndState() {
      G.set(brief,  { xPercent: -100, opacity: 0 });
      G.set(render, { xPercent: 0, opacity: 1 });
      sets.forEach(s => s.classList.add('is-set'));
      G.set(spin, { display: 'none' });
      G.set(play, { opacity: 1, scale: 1 });
      G.set(caps, { scaleX: 1, opacity: 1 });
      steps.forEach(s => s.classList.add('is-done'));
      G.set(deliver, { opacity: 1, y: 0 });
      lbl.textContent = 'Video ready';
      typed.textContent = TOPIC;
      G.set(caret, { opacity: 0 });
    }

    const tl = G.timeline({ paused: true });
    // --- prime ---
    tl.set(brief,  { xPercent: 0, opacity: 1 })
      .set(render, { xPercent: 100, opacity: 0 })
      .set(sets, { opacity: 1 })
      .set(spin, { display: 'block', opacity: 1, rotate: 0 })
      .set(play, { opacity: 0, scale: 0 })
      .set(caps, { scaleX: 0, opacity: 0, transformOrigin: 'left center' })
      .set(deliver, { opacity: 0, y: 10 })
      .call(() => { typed.textContent = ''; sets.forEach(s => s.classList.remove('is-set')); steps.forEach(s => s.classList.remove('is-done')); lbl.textContent = 'Creating your video…'; })
      .set(caret, { opacity: 1 });

    // 1 — STEP 1 "You describe it": type the topic / theme
    tl.to(caret, { opacity: 0.15, duration: 0.4, repeat: 5, yoyo: true, ease: 'steps(1)' }, 0);
    tl.to(typer, { i: TOPIC.length, duration: 1.3, ease: 'none', snap: { i: 1 }, lazy: false,
      onUpdate: () => { typed.textContent = TOPIC.slice(0, typer.i); } }, 0.15);

    // 2 — lock in style / platforms / length (each pops as it's chosen)
    sets.forEach((s, k) => {
      tl.add(() => s.classList.add('is-set'), 1.6 + k * 0.26)
        .fromTo(s, { scale: 1 }, { scale: 1.05, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 1.6 + k * 0.26);
    });

    // 3 — Create video
    tl.set(caret, { opacity: 0 }, 2.55)
      .to(gen, { scale: 1.05, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 2.55);

    // 4 — slide brief → render
    tl.to(brief,  { xPercent: -100, opacity: 0, duration: 0.42, ease: 'power3.out' }, 2.95)
      .fromTo(render, { xPercent: 100, opacity: 1 }, { xPercent: 0, opacity: 1, duration: 0.42, ease: 'power3.out' }, 2.95);

    // 5 — STEP 2 "It creates the video": spinner turns, build steps tick off, preview assembles
    tl.to(spin, { rotate: 360, duration: 0.95, ease: 'none', repeat: 1 }, 3.1);
    steps.forEach((s, k) => {
      tl.add(() => s.classList.add('is-done'), 3.4 + k * 0.45)
        .fromTo(s, { x: -4 }, { x: 0, duration: 0.25, ease: 'power2.out' }, 3.4 + k * 0.45);
    });
    // captions paint onto the preview as the visuals build
    tl.to(caps, { scaleX: 1, opacity: 1, duration: 0.3, stagger: 0.16, ease: 'power2.out' }, 3.6);

    // 6 — video ready → play appears
    tl.add(() => { lbl.textContent = 'Video ready'; G.set(spin, { display: 'none' }); }, 4.85)
      .to(play, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 4.85);

    // 7 — STEP 3 + 4 "You get a link" / "Run the channel": delivered + scheduled
    tl.fromTo(deliver, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.6)' }, 5.2)
      .to({}, { duration: 0.5 });

    return { tl, setEndState, name: 'creator' };
  }

  function buildCreatorLegacy(root) {
    const trend  = root.querySelector('.cv-trend');
    const lines  = root.querySelectorAll('.cv-line');
    const frames = root.querySelectorAll('.cv-frame');
    const play   = root.querySelector('.cv-play');
    const views  = root.querySelector('.cv-count');
    const counter = { v: 0 };

    function setEndState() {
      G.set(trend, { opacity: 1, y: 0, scale: 1 });
      G.set(lines, { scaleX: 1 });
      G.set(frames, { opacity: 1, scale: 1, y: 0 });
      G.set(play, { opacity: 1, scale: 1 });
      views.textContent = '12.4K';
    }

    const tl = G.timeline({ paused: true });
    tl.set(lines, { scaleX: 0, transformOrigin: 'left center' })
      .set(frames, { opacity: 0, scale: 0.6, y: 10 })
      .set(play, { opacity: 0, scale: 0 })
      .fromTo(trend, { opacity: 0, y: -10, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' })
      .to(lines, { scaleX: 1, duration: 0.32, stagger: 0.2, ease: 'steps(14)' }, '+=0.05')
      .to(frames, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.14, ease: 'back.out(1.6)' }, '+=0.1')
      .to(play, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, '-=0.1')
      .fromTo(counter, { v: 0 }, {
        v: 12400, duration: 1.0, ease: 'power2.out',
        onUpdate: () => {
          const v = counter.v;
          views.textContent = v >= 1000 ? (v / 1000).toFixed(1) + 'K' : fmt(v);
        }
      }, '-=0.15')
      .to({}, { duration: 0.7 });

    return { tl, setEndState, name: 'creator' };
  }

  /* --------------------------------------------------------------------------
     FINANCE — AI analysis (data only, no buy/sell calls)
     Rich (Stage): upload/ask → pull live data (metrics scan in under a sweep) →
       runs the numbers position by position → analysis delivered by email.
     Legacy (3-card): ticker sweep → chart draws → marker → portfolio counts.
     Branches on whether the multi-scene markup is present.
     -------------------------------------------------------------------------- */
  function buildFinance(root) {
    const rich = root.querySelector('.fn-gather');
    return rich ? buildFinanceRich(root) : buildFinanceLegacy(root);
  }

  function buildFinanceRich(root) {
    const gather  = root.querySelector('.fn-gather');
    const deliver = root.querySelector('.fn-deliver');
    const askq    = root.querySelector('.fn-ask-q');
    const caret   = root.querySelector('.fn-caret');
    const dataTxt = root.querySelector('.fn-data-txt');
    const spin    = root.querySelector('.fn-spin');
    const metrics = root.querySelectorAll('.fn-metric');
    const sweep   = root.querySelector('.fn-sweep');
    const gline   = root.querySelector('.fn-gline');
    const garea   = root.querySelector('.fn-garea');
    const glen    = gline ? gline.getTotalLength() : 0;
    const positions = root.querySelectorAll('.fn-pos');
    const email   = root.querySelector('.fn-email');
    const QUESTION = 'How are my holdings doing?';
    const typer   = { i: 0 };

    function setEndState() {
      G.set(gather,  { xPercent: -100, opacity: 0 });
      G.set(deliver, { xPercent: 0, opacity: 1 });
      G.set(metrics, { opacity: 1, y: 0 });
      G.set(sweep, { opacity: 0 });
      G.set(spin, { opacity: 0 });
      G.set(gline, { strokeDasharray: glen, strokeDashoffset: 0 });
      G.set(garea, { opacity: 1 });
      G.set(positions, { opacity: 1, y: 0 });
      G.set(email, { opacity: 1, y: 0 });
      askq.textContent = QUESTION;
      dataTxt.textContent = 'Live data pulled';
      G.set(caret, { opacity: 0 });
    }

    const tl = G.timeline({ paused: true });
    // --- prime ---
    tl.set(gather,  { xPercent: 0, opacity: 1 })
      .set(deliver, { xPercent: 100, opacity: 0 })
      .set(metrics, { opacity: 0, y: 6 })
      .set(sweep, { opacity: 0, xPercent: -120 })
      .set(spin, { opacity: 1, rotate: 0 })
      .set(gline, { strokeDasharray: glen, strokeDashoffset: glen })
      .set(garea, { opacity: 0 })
      .set(positions, { opacity: 0, y: 8 })
      .set(email, { opacity: 0, y: 10 })
      .call(() => { askq.textContent = ''; dataTxt.textContent = 'Pulling live data…'; })
      .set(caret, { opacity: 1 });

    // 1 — upload holdings + type the question
    tl.to(caret, { opacity: 0.15, duration: 0.4, repeat: 4, yoyo: true, ease: 'steps(1)' }, 0);
    tl.to(typer, { i: QUESTION.length, duration: 0.95, ease: 'none', snap: { i: 1 }, lazy: false,
      onUpdate: () => { askq.textContent = QUESTION.slice(0, typer.i); } }, 0.2);

    // 2 — pull live data: sweep scans, metric tiles populate, price graph draws itself
    tl.set(caret, { opacity: 0 }, 1.25)
      .fromTo(sweep, { xPercent: -120, opacity: 1 }, { xPercent: 360, duration: 1.2, ease: 'power1.inOut' }, 1.3)
      .to(metrics, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: EASE }, 1.35)
      .to(gline, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut' }, 1.6)
      .to(garea, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 2.1)
      .set(sweep, { opacity: 0 }, 2.7)
      .add(() => { dataTxt.textContent = 'Live data pulled'; G.set(spin, { opacity: 0 }); }, 2.7);

    // 3 — slide gather → deliver
    tl.to(gather,  { xPercent: -100, opacity: 0, duration: 0.42, ease: 'power3.out' }, 3.0)
      .fromTo(deliver, { xPercent: 100, opacity: 1 }, { xPercent: 0, opacity: 1, duration: 0.42, ease: 'power3.out' }, 3.0);

    // 4 — runs the numbers, position by position (all four)
    tl.to(positions, { opacity: 1, y: 0, duration: 0.32, stagger: 0.26, ease: EASE }, 3.45);

    // 5 — delivered by email (after the last position reads)
    tl.fromTo(email, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.6)' }, 4.75)
      .to({}, { duration: 0.5 });

    return { tl, setEndState, name: 'finance' };
  }

  function buildFinanceLegacy(root) {
    const sweep  = root.querySelector('.fn-sweep');
    const ticks  = root.querySelectorAll('.fn-tick');
    const path   = root.querySelector('.fn-line');
    const area   = root.querySelector('.fn-area');
    const marker = root.querySelector('.fn-marker');
    const val    = root.querySelector('.fn-val');
    const len    = path ? path.getTotalLength() : 0;
    const counter = { v: 0 };

    function setEndState() {
      G.set(sweep, { opacity: 0 });
      G.set(ticks, { opacity: 1, color: '' });
      G.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
      G.set(area, { opacity: 1 });
      G.set(marker, { opacity: 1, scale: 1, y: 0 });
      val.textContent = '12,480';
    }

    const tl = G.timeline({ paused: true });
    tl.set(path, { strokeDasharray: len, strokeDashoffset: len })
      .set(area, { opacity: 0 })
      .set(marker, { opacity: 0, scale: 0, y: -14 })
      .set(ticks, { opacity: 0.45 })
      .fromTo(sweep, { xPercent: -120, opacity: 1 }, { xPercent: 320, duration: 0.85, ease: 'power1.inOut' })
      .to(ticks, { opacity: 1, duration: 0.25, stagger: 0.12 }, 0.1)
      .set(sweep, { opacity: 0 })
      .to(path, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut' }, '-=0.25')
      .to(area, { opacity: 1, duration: 0.5, ease: 'power1.out' }, '-=0.7')
      .fromTo(marker, { opacity: 0, scale: 0, y: -16 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.15')
      .fromTo(counter, { v: 9850 }, {
        v: 12480, duration: 0.9, ease: 'power2.out', snap: { v: 1 },
        onUpdate: () => { val.textContent = fmt(counter.v); }
      }, '-=0.5')
      .to({}, { duration: 0.7 });

    return { tl, setEndState, name: 'finance' };
  }

  window.BlueAIHeroCards = { buildCareer, buildCreator, buildFinance };
})();
