/* Campaign report, part 4: formatting, icons and the small pieces every
   section draws (thumbnails in their true shape, avatars, platform words). */
(function () {
  'use strict';

  var R = window.onblueRep, D = window.onblueData, esc = window.onblueApp.esc;

  function num(n) { return Number(Math.round(n)).toLocaleString('en-US'); }
  function money(n) { return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // "97K", "1.24M": the headline size; exact figures go in the title and the accounting
  function compact(v) {
    v = Math.round(v);
    var one = function (x) { return String(Math.round(x * 10) / 10); };
    if (v < 1000) { return String(v); }
    if (v < 10000) { return one(v / 1000) + 'K'; }
    if (Math.round(v / 1000) < 1000) { return Math.round(v / 1000) + 'K'; }
    return String(Math.round(v / 1e4) / 100) + 'M';
  }
  function pct(x) { return !isFinite(x) ? '0%' : (x > 0 && x < 0.01 ? '<1' : String(Math.round(x * 100))) + '%'; }
  function plural(n, w) { return num(n) + ' ' + w + (Math.round(n) === 1 ? '' : 's'); }
  function dateF(t) { return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function dayF(t) { return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  function timeF(t) { return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function initials(name) { return String(name).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase(); }

  function ic(d, size, sw) {
    var s = size || 16;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8)
      + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var IC = {
    more: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5.5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="18.5" r="1.6"/></svg>',
    lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
    link: ic('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
    check: ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 16, 2.2),
    search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    refresh: ic('<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>'),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    caret: ic('<path d="m7 10 5 5 5-5"/>', 14, 2),
    close: ic('<path d="M6 6l12 12M18 6 6 18"/>', 16), // the app's close: 16px, stroke 1.8, as shell.js
    chev: ic('<path d="m9 6 6 6-6 6"/>', 16),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>'),
    alert: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V13M12 16.4v.1"/>'),
    clock: ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    ext: ic('<path d="M8 16 16 8M9 8h7v7"/>', 14),
    down: ic('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    play: ic('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>'),
    posts: ic('<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>', 24, 1.5),
    back: ic('<path d="m15 6-6 6 6 6"/>')
  };

  var PL = {
    youtube: { name: 'YouTube', audience: 'subscriber', open: 'Open on YouTube', channel: 'Open channel', copyCh: 'Copy channel link' },
    instagram: { name: 'Instagram', audience: 'follower', open: 'Open on Instagram', channel: 'Open profile', copyCh: 'Copy profile link' }
  };
  function formatOf(p) { return p.plat === 'instagram' ? 'Reel' : p.shape === 'wide' ? 'Video' : 'Short'; }

  /* THE POST AS IT LOOKS WHERE IT LIVES: Shorts and Reels stand up (9:16), a
     YouTube video lies down (16:9). The real thumbnail when the platform has
     one; the coloured tile underneath shows if it fails to load. */
  function thumb(p, size, opts) {
    var o = opts || {};
    var src = p.th ? (size === 'lg' ? p.th : 'https://i.ytimg.com/vi/' + p.vid + '/hqdefault.jpg') : '';
    return '<span class="rp-thumb rp-thumb--' + (p.shape === 'wide' ? 'wide' : 'tall') + (size ? ' rp-thumb--' + size : '') + '" style="--h:' + p.hue + '" aria-hidden="true">'
      + '<span class="rp-thumb-em">' + p.emoji + '</span>'
      + (src ? '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">' : '')
      + (o.mark ? '<span class="rp-thumb-mark">' + D.marks([p.plat]) + '</span>' : '')
      + (o.removed ? '<span class="rp-thumb-flag">Removed</span>' : '')
      + '</span>';
  }

  function avatar(c, size) {
    return '<span class="rp-av' + (size ? ' rp-av--' + size : '') + '" style="--h:' + (c.hue || 210) + '" aria-hidden="true">' + esc(initials(c.name)) + '</span>';
  }

  function seg(items, cur, attr, label) {
    return '<div class="rp-seg" role="group" aria-label="' + label + '">' + items.map(function (it) {
      return '<button type="button" ' + attr + '="' + it[0] + '" aria-pressed="' + (it[0] === cur) + '">' + it[1] + '</button>';
    }).join('') + '</div>';
  }

  R.ui = {
    num: num, money: money, compact: compact, pct: pct, plural: plural, dateF: dateF, dayF: dayF, timeF: timeF,
    IC: IC, PL: PL, formatOf: formatOf, thumb: thumb, avatar: avatar, seg: seg, esc: esc
  };
})();
