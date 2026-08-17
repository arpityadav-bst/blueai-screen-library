/* ==========================================================================
   Intelligence Designed To Evolve — count-up stats + mobile menu
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ── Stat count-up ──────────────────────────────────────────────────── */

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* 41920 → "41,920". Only the integer part is grouped. */
  function group(str) {
    var parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function format(el, value) {
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var num = value.toFixed(decimals);
    if (el.dataset.group !== "false") num = group(num);
    el.textContent = prefix + num + suffix;
  }

  function countUp(el, index) {
    var target = parseFloat(el.dataset.target);
    var duration = 1500 + index * 80;
    var delay = 480 + index * 90;

    if (reduceMotion) {
      format(el, target);
      return;
    }

    window.setTimeout(function () {
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        format(el, target * easeOutCubic(t));
        if (t < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }, delay);
  }

  /* Any element carrying data-target counts up — the stats and the live pill. */
  var values = Array.prototype.slice.call(
    document.querySelectorAll("[data-target]")
  );

  values.forEach(function (el) {
    format(el, 0);
  });

  if (!("IntersectionObserver" in window)) {
    values.forEach(countUp);
  } else {
    var seen = new WeakSet();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          countUp(entry.target, values.indexOf(entry.target));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    values.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Mobile menu ────────────────────────────────────────────────────── */

  var burger = document.querySelector(".burger");
  var overlay = document.querySelector(".menu-overlay");
  var menu = document.querySelector(".mobile-menu");

  if (!burger || !overlay || !menu) return;

  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    overlay.hidden = !open;
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  function isOpen() {
    return burger.getAttribute("aria-expanded") === "true";
  }

  burger.addEventListener("click", function () {
    setMenu(!isOpen());
  });

  overlay.addEventListener("click", function () {
    setMenu(false);
  });

  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720 && isOpen()) setMenu(false);
  });

  setMenu(false);
})();
