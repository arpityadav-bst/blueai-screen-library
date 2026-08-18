/* ==========================================================================
   scroll.js — section reveals + the scroll-scrubbed word fill (§2)
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  /* ── Section reveals ────────────────────────────────────────────────── */

  var reveals = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── Closing video: slowed playback ─────────────────────────────────── */

  /* playbackRate rather than a re-encoded slow version — no extra bytes, and the
     rate is a data attribute so it's tunable without touching JS. At 0.5 the
     30fps source shows an effective 15fps; on a slow morph at half opacity that
     reads as smooth. If it ever judders, the fix is frame interpolation (RIFE) on
     the file, not a lower rate here. */
  var closer = document.querySelector(".closer-video-el");
  if (closer) {
    var rate = parseFloat(closer.dataset.rate || "0.5");
    var applyRate = function () {
      closer.playbackRate = rate;
    };
    applyRate();
    /* Some browsers reset the rate on (re)load, and looping can re-fire play. */
    closer.addEventListener("loadedmetadata", applyRate);
    closer.addEventListener("play", applyRate);
  }

  /* ── Closer clock ───────────────────────────────────────────────────── */

  /* "It's 4:12 pm. Your worker would be earning right now." — real time,
     refreshed every half-minute, because a checkable clock reads as a live
     product and a hardcoded one reads as a mockup the moment it's wrong. */
  var now = document.querySelector("[data-now]");
  if (now) {
    var tickClock = function () {
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      var ap = h >= 12 ? "pm" : "am";
      h = h % 12 || 12;
      now.textContent = h + ":" + (m < 10 ? "0" + m : m) + " " + ap;
    };
    tickClock();
    window.setInterval(tickClock, 30000);
  }

  /* ── Scroll-scrubbed word fill ──────────────────────────────────────── */

  /* Split on whitespace, wrap each word so it can be lit individually. The
     trailing text node keeps the words from running together and lets the
     paragraph wrap normally. */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      el.appendChild(span);
      el.appendChild(document.createTextNode(" "));
    });
    return Array.prototype.slice.call(el.querySelectorAll(".word"));
  }

  var track = document.querySelector("[data-scrub]");
  if (!track) return;

  var text = track.querySelector(".scrub-text");
  if (!text) return;

  var words = splitWords(text);

  if (reduceMotion) {
    words.forEach(function (w) {
      w.classList.add("lit");
    });
    return;
  }

  /* Progress 0→1 across the part of the track that actually scrolls past
     (its height minus one viewport, which the sticky stage occupies). */
  function progress() {
    var rect = track.getBoundingClientRect();
    var scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 1;
    return clamp(-rect.top / scrollable, 0, 1);
  }

  /* The fill completes at 0.82 of the track, so the finished sentence holds on
     screen for a beat before the section leaves — otherwise the last word lights
     up exactly as it scrolls away. */
  var COMPLETE_AT = 0.82;

  function paint() {
    var p = progress() / COMPLETE_AT;
    var lit = Math.floor(clamp(p, 0, 1) * words.length);
    for (var i = 0; i < words.length; i++) {
      var on = i < lit;
      if (on !== words[i].classList.contains("lit")) {
        words[i].classList.toggle("lit", on);
      }
    }
  }

  var queued = false;

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      paint();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  paint();
})();
