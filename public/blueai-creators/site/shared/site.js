/* ============================================================
   Blue AI Creators — shared chrome + motion system
   One source for all 18 pages. Governed by ../DESIGN.md.
   Pages declare themselves:  <body class="zone-brand" data-page="brands-plan">
   and mount chrome with:     <header class="hd" data-chrome></header>
                              <footer class="ft" data-chrome></footer>
   depth prefix: pages in subfolders set <body data-depth="1">
   ============================================================ */
(function () {
  "use strict";
  // favicon — receipt-green coin glyph, one source for all pages
  var fav = document.createElement("link");
  fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0B7A48"/><text x="16" y="22.5" text-anchor="middle" font-family="monospace" font-size="17" font-weight="700" fill="#FAF8F2">$</text></svg>');
  document.head.appendChild(fav);

  // skip link — UI/UX Pro Max audit: none existed sitewide. Must be the first focusable
  // element in the document, ahead of even the header, or it doesn't do its job.
  var skip = document.createElement("a");
  skip.href = "#main-content";
  skip.className = "skip-link";
  skip.textContent = "Skip to main content";
  document.body.insertBefore(skip, document.body.firstChild);

  var body = document.body;
  var isBrand = body.classList.contains("zone-brand");
  var page = body.dataset.page || "";
  var P = "../".repeat(+(body.dataset.depth || 0)); // path prefix back to site root

  /* ---------------- header ---------------- */
  var NAV = isBrand
    ? [
        ["How it works", P + "brands/how-it-works.html", "brands-hiw"],
        ["Find creators", P + "brands/creators.html", "brands-creators"],
        ["Why it works", P + "brands/compare.html", "brands-compare"],
        ["FAQ", P + "faq.html", "faq"],
      ]
    : [
        ["How it works", P + "how-it-works.html", "hiw"],
        ["What you earn", P + "what-you-earn.html", "earn"],
        ["Coach", P + "coach.html", "coach"],
        ["FAQ", P + "faq.html", "faq"],
      ];
  var SWITCH = isBrand
    ? ["For creators", P + "index.html"]
    : ["For brands", P + "brands/index.html"];
  // CTA suppressed on the two conversion pages — the visitor already converted
  var CONVERTED = page === "waitlist" || page === "brands-reserve";
  var CTA = isBrand
    ? ["See who’s nearby", P + "brands/creators.html"]
    : ["Estimate earnings", P + "earnings.html"];

  var hd = document.querySelector("header[data-chrome]");
  if (hd) {
    hd.innerHTML =
      '<div class="in">' +
      '<a class="logo" href="' + (isBrand ? P + "brands/index.html" : P + "index.html") + '">bluestacks<b>.ai</b><span class="chip">' + (isBrand ? "BRANDS" : "CREATORS") + "</span></a>" +
      '<button class="menu-btn" aria-label="Menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h16M3 11h16M3 16h16"/></svg></button>' +
      "<nav>" +
      NAV.map(function (l) {
        var cur = l[2] === page ? ' aria-current="page" style="color:var(--ink)"' : "";
        return '<a href="' + l[1] + '"' + cur + ">" + l[0] + "</a>";
      }).join("") +
      '<a class="switch" href="' + SWITCH[1] + '">' + SWITCH[0] + "</a>" +
      (CONVERTED ? "" : '<a class="btn sm z" href="' + CTA[1] + '">' + CTA[0] + "</a>") +
      "</nav></div>";
    var mb = hd.querySelector(".menu-btn"),
      nav = hd.querySelector("nav");
    mb.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", open);
    });
  }

  /* ---------------- footer ---------------- */
  var ft = document.querySelector("footer[data-chrome]");
  if (ft) {
    ft.innerHTML =
      '<div class="wrap"><div class="cols">' +
      '<div><span style="font-family:var(--f-display);font-weight:400;font-size:20px;letter-spacing:-.005em">bluestacks<b style="color:var(--work)">.ai</b></span>' +
      '<p style="font-size:13.5px;margin-top:10px;color:var(--ink-3)">Blue AI — the marketplace where brands pay ordinary creators in cash for verified posts.</p></div>' +
      '<div><span class="m-label">For creators</span>' +
      '<a href="' + P + 'index.html">Earn with Blue AI</a>' +
      '<a href="' + P + 'how-it-works.html">How it works</a>' +
      '<a href="' + P + 'what-you-earn.html">What you earn</a>' +
      '<a href="' + P + 'earnings.html">Estimate your earnings</a>' +
      '<a href="' + P + 'coach.html">No audience yet?</a>' +
      '<a class="strong" style="color:var(--cash)" href="' + P + 'waitlist.html">Join the waitlist</a></div>' +
      '<div><span class="m-label">For brands</span>' +
      '<a href="' + P + 'brands/index.html">Hire creators</a>' +
      '<a href="' + P + 'brands/how-it-works.html">How it works</a>' +
      '<a href="' + P + 'brands/creators.html">Find creators near you</a>' +
      '<a href="' + P + 'brands/compare.html">Why it works</a>' +
      '<a href="' + P + 'brands/plan.html">Build a forecast</a>' +
      '<a class="strong" style="color:var(--work)" href="' + P + 'brands/reserve.html">Reserve a slot</a></div>' +
      '<div><span class="m-label">Company</span>' +
      '<a href="' + P + 'about.html">About</a>' +
      '<a href="' + P + 'faq.html">FAQ</a>' +
      '<a href="mailto:hello@bluestacks.ai">Contact</a></div>' +
      '<div><span class="m-label">Legal</span>' +
      '<a href="' + P + 'legal/terms.html">Terms</a>' +
      '<a href="' + P + 'legal/privacy.html">Privacy</a>' +
      '<a href="' + P + 'legal/creator-terms.html">Creator terms</a>' +
      '<a href="' + P + 'legal/verification.html">Verification &amp; disclosure</a></div>' +
      '</div><div class="fine"><span>Pre-launch. All figures are illustrative models built for design, not researched rate cards.</span>' +
      "<span>Blue AI · by now.gg, Inc.</span></div></div>";
  }

  // UI/UX Pro Max audit: no <main> landmark existed on any page — wrap everything between
  // the header and footer chrome into one, so the skip link above has a real target and
  // screen-reader users get a real landmark to jump between.
  if (hd && ft) {
    var main = document.createElement("main");
    main.id = "main-content";
    var node = hd.nextSibling;
    while (node && node !== ft) {
      var next = node.nextSibling;
      main.appendChild(node);
      node = next;
    }
    hd.parentNode.insertBefore(main, ft);
  }

  /* ---------------- product-URL fields ----------------
     `type="url"` earns its keep — real URL keyboard on mobile, real validation backstop —
     but on its own it rejects the exact thing these fields ask for. A box labelled "Product
     URL" gets `www.figma.com` typed into it, and two of the three placeholder `yourproduct.com`,
     a value the validator refuses outright. So prepend https:// for a bare domain BEFORE
     validation runs: on blur (covers clicking the submit button) and on Enter (implicit
     submission fires no blur, so blur alone would still leave the bubble showing). Anything
     not domain-shaped is left untouched, so the native message still does its job on real
     nonsense rather than being papered over. */
  var BARE_DOMAIN = /^(?!\w+:\/\/)[^\s/?#]+\.[a-z]{2,}(?:[/?#]\S*)?$/i;
  function normalizeUrlField(el) {
    var v = el.value.trim();
    if (v && BARE_DOMAIN.test(v)) el.value = "https://" + v;
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[type="url"]'), function (el) {
    el.addEventListener("blur", function () { normalizeUrlField(el); });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") normalizeUrlField(el); });
  });

  /* ---------------- motion system ---------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mechanism 4, public API for per-page inline scripts: "a number the user just caused
     to change tweens from old to new; a number that was always there doesn't." This is
     EVENT-driven (call it from a click/input handler), never ScrollTrigger — three of the
     pages that need this (earnings/creators/waitlist result states) are `hidden` at load,
     and a ScrollTrigger built against a hidden box computes against a zero-size rect and
     silently never fires. Keeps its own per-element tween state so rapid repeated calls
     (dragging a range input) continue smoothly from wherever the last tween was, instead
     of restarting from the stale displayed text every time. */
  window.BAI = window.BAI || {};
  (function () {
    var active = typeof WeakMap !== "undefined" ? new WeakMap() : null;
    window.BAI.tweenNumber = function (el, toValue, formatFn, opts) {
      opts = opts || {};
      if (reduced || !window.gsap || !active) { el.textContent = formatFn(toValue); return; }
      var prev = active.get(el);
      var fromValue = opts.from !== undefined ? opts.from
        : (prev ? prev.o.v : (parseFloat(String(el.textContent).replace(/[^0-9.-]/g, "")) || 0));
      if (prev && prev.tween) prev.tween.kill();
      var o = { v: fromValue };
      var tween = gsap.to(o, {
        v: toValue,
        duration: opts.duration || 0.35,
        ease: "power2.out",
        onUpdate: function () { el.textContent = formatFn(o.v); },
      });
      active.set(el, { o: o, tween: tween });
    };
  })();

  /* Mechanism 2's arming function, public for the same reason Mechanism 4 is event-driven:
     waitlist.html's .step-rail lives inside a `hidden` container, so at load its items are
     skipped (a ScrollTrigger built against a display:none box measures a zero-size rect and
     never fires) and the page arms them itself the moment it unhides. Only this function
     ever hides rail items, so a rail that is never armed just stays visible with no reveal
     — the safe failure, not a stuck-invisible one. */
  window.BAI.revealSteps = function (root) {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    var items = gsap.utils.toArray((root || document).querySelectorAll(".step-rail li"))
      .filter(function (el) { return !el.closest("[hidden]") && !el.dataset.baiArmed; });
    if (!items.length) return;
    items.forEach(function (el) { el.dataset.baiArmed = "1"; });
    gsap.set(items, { opacity: 0, y: 18 });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 });
      },
    });
    ScrollTrigger.refresh();
  };

  if (!reduced && window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* THE moment: hero prop-field assembles, then drifts. Props declare depth:
       <div class="prop" data-depth="0.6" data-rot="-8">
       Below-the-fold pages get the SAME props/depth/drift mechanism inside a
       .prop-band section, but deliberately WITHOUT the entrance or pointer-parallax —
       they just exist and drift, the way hero props behave after they've already
       assembled. This is the site's art direction continuing past the fold, not a new
       reveal system — do not add an entrance to .prop-band props. */
    var heroProps = gsap.utils.toArray(".hero-band .prop");
    var driftOnlyProps = gsap.utils.toArray(".prop-band .prop");
    var allDriftProps = heroProps.concat(driftOnlyProps);

    if (heroProps.length) {
      gsap.from(heroProps, {
        y: 90,
        opacity: 0,
        rotation: function (i, el) { return (+el.dataset.rot || 0) + 14; },
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.15,
        clearProps: "opacity",
      });
    }
    // scroll drift — every prop (hero + below-the-fold), each at its own depth-rated speed
    if (allDriftProps.length && window.ScrollTrigger) {
      allDriftProps.forEach(function (el) {
        var d = +el.dataset.depth || 0.5;
        gsap.to(el, {
          y: function () { return -110 * d; },
          ease: "none",
          scrollTrigger: { trigger: el.closest(".hero-band, .prop-band") || el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    }
    // pointer parallax, ≤6px — HERO ONLY. A below-the-fold prop reacting to pointer
    // movement anywhere on the page, long after it's scrolled past, would be wrong.
    if (heroProps.length) {
      var heroField = document.querySelector(".hero-band .propfield");
      if (heroField && matchMedia("(pointer:fine)").matches) {
        var qx = heroProps.map(function (el) {
          return gsap.quickTo(el, "x", { duration: 0.7, ease: "power2.out" });
        });
        window.addEventListener("pointermove", function (e) {
          var nx = e.clientX / innerWidth - 0.5;
          heroProps.forEach(function (el, i) { qx[i](nx * 12 * (+el.dataset.depth || 0.5)); });
        }, { passive: true });
      }
    }

    /* money counters:  <span class="m" data-count="188.40" [data-from="0"] [data-prefix] [data-suffix] [data-rate-group="name"]>
       - data-from: count FROM this value instead of zero — for "X → Y" copy (about.html's
         "3.1% → 19.9%") where counting from zero would discard the "up from" the sentence
         already states.
       - data-rate-group: counters sharing a group count at the SAME RATE, not the same
         duration. Without this, brands/index.html's ~4,400 vs ~770,000 (captioned "175x
         more") land at the same instant — equal duration visually asserts the two numbers
         are comparable in size, which is the opposite of the point. The small one in a
         group finishes fast and stops; the big one keeps climbing for the full stretch.
       Elements inside a currently-[hidden] ancestor are skipped — a ScrollTrigger built
       against a display:none box computes against a zero-size rect and never fires. */
    function decimalsOf(s) { return s && String(s).indexOf(".") > -1 ? String(s).split(".")[1].length : 0; }
    function rangeOf(el) {
      var end = parseFloat(el.dataset.count), from = el.dataset.from !== undefined ? parseFloat(el.dataset.from) : 0;
      return Math.abs(end - from) || 1;
    }
    var counters = gsap.utils.toArray("[data-count]").filter(function (el) { return !el.closest("[hidden]"); });
    var rateRanges = {};
    counters.forEach(function (el) {
      var g = el.dataset.rateGroup;
      if (g) { rateRanges[g] = Math.max(rateRanges[g] || 0, rangeOf(el)); }
    });
    var GROUP_ANCHOR_DURATION = 1.6;
    counters.forEach(function (el) {
      var end = parseFloat(el.dataset.count), from = el.dataset.from !== undefined ? parseFloat(el.dataset.from) : 0;
      var dec = decimalsOf(el.dataset.count); /* precision matches the END value only — a from-value with more decimals than the end would otherwise make the animated path land on a different string than the reduced-motion final-value path */
      var pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      var g = el.dataset.rateGroup;
      var duration = g ? Math.max(0.15, GROUP_ANCHOR_DURATION * (rangeOf(el) / rateRanges[g])) : 1.4;
      var o = { v: from };
      gsap.to(o, {
        v: end,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: function () {
          el.textContent = pre + o.v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
        },
      });
    });

    /* Mechanism 2 — sequence reveal, scoped to .step-rail ONLY. Do not generalize this
       to any other list/grid (priority actions, evidence cards, etc.) — .step-rail is a
       real ordered component (counter-reset/counter-increment numerals) on 4 pages, so
       revealing in order encodes information the content actually has. Anything without
       that ordinal structure does not get this treatment — see DESIGN.md Motion section.
       Rails inside a `hidden` container are skipped here and armed by their page on unhide,
       via window.BAI.revealSteps() above. */
    window.BAI.revealSteps(document);

    /* NOTE: no blanket scroll-reveal system, deliberately — DESIGN.md ban #13.
       The motion story is: hero props + scroll drift + money counters + the .step-rail
       sequence above + (added below) receipts/live-recalculation. Nothing else reveals
       on scroll — that line holds, the exceptions are named, not generalized. */
  } else {
    // reduced motion / no gsap: counters render final values
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var dec = (el.dataset.count.split(".")[1] || "").length;
      el.textContent = (el.dataset.prefix || "") + (+el.dataset.count).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || "");
    });
  }
})();
