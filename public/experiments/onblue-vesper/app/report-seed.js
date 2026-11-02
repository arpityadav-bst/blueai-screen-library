/* Campaign report, part 1: the seeded sample-data kit.
   Every report is generated from its campaign's own id, so a reload shows the
   same posts, the same creators and the same numbers. Nothing here calls
   Math.random: two people reviewing the same link must see the same page. */
(function () {
  'use strict';

  var R = window.onblueRep = window.onblueRep || {};

  // mulberry32, the generator PM's report uses
  function rng(seed) {
    var s = seed | 0;
    return function () {
      s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // FNV-1a: turns a campaign id into a seed
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* Splits a whole number over weights so the parts add up to it exactly
     (largest remainder). This is what keeps "views = sum of the posts" true
     everywhere instead of drifting by rounding. */
  function spread(total, weights) {
    var sum = weights.reduce(function (s, w) { return s + w; }, 0);
    if (!total || !sum) { return weights.map(function () { return 0; }); }
    var raw = weights.map(function (w) { return total * w / sum; });
    var out = raw.map(Math.floor);
    var left = total - out.reduce(function (s, v) { return s + v; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; })
      .sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; })
      .slice(0, left)
      .forEach(function (x) { out[x[1]] += 1; });
    return out;
  }

  var ADJ = ['Quiet', 'Neon', 'Echo', 'Retro', 'Mellow', 'Cosmic', 'Pixel', 'Lucky', 'Golden', 'Midnight',
    'Sunny', 'Urban', 'Velvet', 'Bold', 'Tiny', 'Lazy', 'Wild', 'Cozy', 'Rapid', 'Silver', 'Paper', 'Coral'];
  var NOUN = ['Garage', 'Plays', 'Shorts', 'Den', 'Desk', 'Lounge', 'Hub', 'Kitchen', 'Studio', 'Corner',
    'Club', 'Lab', 'Diaries', 'Bytes', 'Journal', 'Table', 'Trail', 'Room', 'Notes', 'Crew', 'Reels', 'Days'];
  var EMOJI = ['🎮', '💻', '🌙', '⚡', '🤖', '🎧', '🍕', '😴',
    '📚', '💸', '🐱', '🐶', '🔥', '🧠', '⏰', '🏆'];

  var SHORT = ['POV: {p} does the boring part #shorts', 'When {p} works harder than you #funny', '{p} in 30 seconds',
    'Nobody told me {p} could do this', 'Day 3 with {p} #ad', 'My friends tried {p} for the first time',
    'Rating {p} honestly #shorts', 'The {p} trick I use every day', 'Is {p} worth it? #shorts', '{p} at 2am be like'];
  var LONG = ['I tried {p} for a week. Honest review', '{p} explained in 8 minutes', 'Setting up {p} from scratch',
    '{p}: everything I wish I knew first', 'A full day with {p}', 'Testing {p} so you do not have to'];
  var REEL = ['{p} changed my morning routine', 'Wait for the end #{t}', 'Rating {p} out of 10', 'Things I would buy again: {p}',
    'Small win today: {p}', 'Get ready with me, {p} edition', '3 ways I use {p}', 'Trying the {p} trend #{t}'];
  var QUOTES = ['The reveal at the end got me, did not expect that finish', 'Watched this twice, the pacing is so clean',
    'This is the kind of ad I actually finish', 'Okay the music on this is great', 'Saving this for later',
    'Did not know it could do that', 'The last shot is the best part', 'Clean edit, straight to the point',
    'My brother needs to see this', 'Short and it says everything'];
  var FAILS = ['Like action did not register on retry', 'Watch time under the minimum', 'Comment removed by the platform'];

  function pick(list, r) { return list[Math.floor(r() * list.length)]; }

  function title(kind, product, r) {
    var list = kind === 'wide' ? LONG : kind === 'reel' ? REEL : SHORT;
    var tag = String(product).toLowerCase().replace(/[^a-z0-9]/g, '');
    return pick(list, r).replace(/\{p\}/g, product).replace(/\{t\}/g, tag || 'new');
  }

  // a channel or account name, unique within one campaign
  function creator(plat, r, taken) {
    var name, n = 0;
    do {
      name = pick(ADJ, r) + ' ' + pick(NOUN, r);
      n++;
    } while (taken[name] && n < 40);
    if (taken[name]) { name += ' ' + n; }
    taken[name] = true;
    var slug = name.toLowerCase();
    return {
      name: name,
      handle: '@' + (plat === 'instagram' ? slug.replace(/\s+/g, '.') : slug.replace(/\s+/g, '-')),
      subs: Math.round(20 + Math.pow(r(), 3) * (plat === 'instagram' ? 60000 : 40000)),
      hue: Math.floor(r() * 360),
      plat: plat
    };
  }

  function videoId(r, len) {
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', s = '';
    for (var i = 0; i < (len || 11); i++) { s += abc.charAt(Math.floor(r() * abc.length)); }
    return s;
  }

  function urlOf(plat, shape, vid) {
    if (plat === 'instagram') { return 'https://www.instagram.com/reel/' + vid + '/'; }
    return shape === 'wide' ? 'https://www.youtube.com/watch?v=' + vid : 'https://www.youtube.com/shorts/' + vid;
  }

  function channelUrl(c) {
    return c.plat === 'instagram' ? 'https://www.instagram.com/' + c.handle.slice(1) + '/' : 'https://www.youtube.com/' + c.handle;
  }

  R.seed = {
    rng: rng, hash: hash, spread: spread, pick: pick, title: title, creator: creator,
    videoId: videoId, urlOf: urlOf, channelUrl: channelUrl, EMOJI: EMOJI, QUOTES: QUOTES, FAILS: FAILS
  };
})();
