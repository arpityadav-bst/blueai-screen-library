/* The app's sample data. Rows are PM's (campaign-report/campaigns.js,
   f457309): the real onblue.ai rows of 2026-10-22 and his foobar demo rows,
   every field kept. Added for the revamp: `platforms`. YOUTUBE ONLY for now
   (Appy, 2026-11-03): Instagram is out until it is a real integration, so
   every row runs on YouTube and nothing in the app offers a platform choice.
   The six samples' end dates follow the PM's dashboard on main (campaign.html),
   whose reports they open, so a row and its report agree (Appy, 2026-11-03).
   The samples keep PM's `note` (his Fill-cell state note, "target met"). */
(function () {
  'use strict';

  var MINE = [
    { id: 'a667ef59', title: 'BlueAIGoLive_promo_Oct1', product: 'BlueAI', platforms: ['youtube'], geo: 'WORLDWIDE', done: 96954, target: 83333, spent: '$1.93', budget: '$100', status: 'live', left: '10 days left', report: true, ends: 'Nov 1, 2026' },
    { id: 'f0a1b2c3', title: 'Foobar1_launch_reel', product: 'foobar1', kind: 'engagement', platforms: ['youtube'], geo: 'US', done: 640, target: 1000, spent: '$640', budget: '$1,000', status: 'live', left: '6 days left', ends: 'Oct 28, 2026' },
    { id: '9d4e7a10', title: 'Foobar2_creator_wave', product: 'foobar2', platforms: ['youtube'], geo: 'WORLDWIDE', done: 18450, target: 41666, spent: '$22.14', budget: '$50', status: 'live', left: '24 days left', ends: 'Nov 15, 2026' },
    { id: '5b2c8e47', title: 'Foobar3_holiday_teaser', product: 'foobar3', kind: 'engagement', platforms: ['youtube'], geo: 'IN', done: 0, target: 500, spent: '$0', budget: '$500', status: 'review', ends: 'Nov 30, 2026' },
    { id: 'e83f4c15', title: 'Foobar6_summer_push', product: 'foobar6', platforms: ['youtube'], geo: 'WORLDWIDE', done: 152300, target: 250000, spent: '$182.76', budget: '$300', status: 'live', left: '17 days left', ends: 'Nov 8, 2026' },
    { id: 'c7e19f02', title: 'Foobar4_how_it_works', product: 'foobar4', platforms: ['youtube'], geo: 'US', done: 1240000, target: 1000000, spent: '$1,200', budget: '$1,200', status: 'completed', ends: 'Oct 12, 2026' },
    { id: '7f0d2b68', title: 'Foobar7_brand_story', product: 'foobar7', platforms: ['youtube'], geo: 'US', done: 9870, target: 20833, spent: '$11.84', budget: '$25', status: 'completed', ends: 'Oct 5, 2026' },
    { id: '2a6d0b9e', title: 'Foobar5_short_series', product: 'foobar5', platforms: ['youtube'], geo: 'IN', done: 4310, target: 16666, spent: '$5.17', budget: '$20', status: 'completed', ends: 'Sep 18, 2026' },
    { id: '3e74345b', title: 'India_test_16Oct', product: 'BlueAI', platforms: ['youtube'], geo: 'IN', done: 25, target: 41666, spent: '$0.01', budget: '$50', status: 'live', left: '10 days left', ends: 'Nov 1, 2026' },
    { id: '160442a8', title: 'testBlueAIPost2', product: 'BlueAI', platforms: ['youtube'], geo: 'IN', done: 14, target: 16666, spent: '$0.00', budget: '$20', status: 'completed', ends: 'Oct 3, 2026' },
    { id: 'b35577de', title: 'testBlueAIpost', product: 'BlueAI', platforms: ['youtube'], geo: 'IN', done: 0, target: 16666, spent: '$0', budget: '$20', status: 'completed', ends: 'Oct 2, 2026' },
    { id: '74584e4f', title: 'IndiaBlueAI_Promo_30Sep2026', product: 'BlueAI', platforms: ['youtube'], geo: 'IN', done: 59, target: 16666, spent: '$0.01', budget: '$20', status: 'completed', ends: 'Oct 1, 2026' },
    { id: 'eee2ed33', title: 'IndiaBlueAI_Promo_30Sep2026', product: 'BlueAI', platforms: ['youtube'], geo: 'IN', done: 0, target: 16666, spent: '$0', budget: '$20', status: 'rejected', reason: 'incorrect timing', ends: 'Oct 1, 2026' },
    { id: '6284790f', title: 'postVideo_BlueStacks_23Sep', product: 'BlueStacks', platforms: ['youtube'], geo: 'WORLDWIDE', done: 0, target: 20833, spent: '$0', budget: '$25', status: 'completed', ends: 'Sep 30, 2026' }
  ];

  var SAMPLES = [
    { id: '7c2d91e4', title: 'Spring Launch: Product Reveal Short', product: 'Airtap', kind: 'engagement', platforms: ['youtube'], geo: 'US', done: 212, target: 500, spent: '$212', budget: '$500', note: '7 days left', status: 'live', left: '7 days left', ends: 'Sep 24, 2026' },
    { id: '4b0a63f7', title: 'Creator Collab Teaser', product: 'Airtap', kind: 'engagement', platforms: ['youtube'], geo: 'US', done: 118, target: 150, spent: '$118', budget: '$150', note: '3 days left', status: 'live', left: '3 days left', ends: 'Sep 20, 2026' },
    { id: 'd21e88ac', title: 'July Brand Anthem', product: 'Fernweh Coffee', kind: 'engagement', platforms: ['youtube'], geo: 'US', done: 300, target: 300, spent: '$300', budget: '$300', note: 'target met', status: 'completed', ends: 'Aug 31, 2026' },
    { id: '09c4b3d5', title: 'Summer Drop Part 1', product: 'Fernweh Coffee', kind: 'engagement', platforms: ['youtube'], geo: 'US', done: 96, target: 200, spent: '$96', budget: '$200', note: 'make-good applied', status: 'under', ends: 'Sep 6, 2026' },
    { id: 'a15d7f22', title: 'Airtap: format tests', product: 'Airtap', kind: 'growth', platforms: ['youtube'], geo: 'US', done: 102000, target: 300000, spent: '$510', budget: '$1,500', note: '6 videos live', status: 'live', left: '8 days left', ends: 'Sep 30, 2026' },
    { id: '3e81b0c5', title: 'Fernweh Coffee: category films', product: 'Fernweh Coffee', kind: 'growth', platforms: ['youtube'], geo: 'Worldwide', done: 0, target: 400000, spent: '$0', budget: '$2,000', note: 'brief with our team', status: 'review', ends: 'Oct 14, 2026' }
  ];

  var STATUS = {
    live: ['Live', 'live'],
    review: ['In review', 'review'],
    completed: ['Completed', 'done'],
    under: ['Under target', 'under'],
    rejected: ['Rejected', 'rejected']
  };


  /* WHAT THE AGENCY MAKES IN THIS PROTOTYPE, kept in localStorage so the wizard,
     the list and the report agree. Submitted campaigns use the row shape above
     plus `brief` (everything the wizard asked) and `createdAt`; their status is
     'review'. Drafts
     are { id, step, updatedAt, brief }. Both lists are newest first. */
  var K_CAMPAIGNS = 'onblue-app-campaigns', K_DRAFTS = 'onblue-app-drafts';
  function read(k) { try { return JSON.parse(window.localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function write(k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off: nothing persists */ } }
  function upsert(k, item) { var list = read(k).filter(function (x) { return x.id !== item.id; }); list.unshift(item); write(k, list); }
  function remove(k, id) { write(k, read(k).filter(function (x) { return x.id !== id; })); }

  // the agency's own submitted campaigns lead the list, as the newest
  var OWN = read(K_CAMPAIGNS);
  // campaigns filed while Instagram was offered run on YouTube now; and one filed
  // while an agency in review could still create (it waited) is simply in review
  OWN.forEach(function (c) { c.platforms = ['youtube']; if (c.status === 'waiting') { c.status = 'review'; } });
  MINE = OWN.concat(MINE);
  STATUS.draft = ['Draft', 'draft'];

  /* ONE BILLING RULE for the list and the report: the agency's price is
     budget / target (per 1,000 views for growth, per completion for
     engagement), and spend is the work done times that price. The stored
     `spent` string stays as PM's raw field only. */
  function amount(s) { return parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0; }
  function rateOf(c) {
    var growth = c.kind !== 'engagement';
    return c.target ? Math.round(amount(c.budget) / c.target * (growth ? 1000 : 1) * 100) / 100 : 0;
  }
  function spentOf(c) { return (c.done || 0) * rateOf(c) / (c.kind !== 'engagement' ? 1000 : 1); }

  window.onblueData = {
    MINE: MINE, OWN: OWN, SAMPLES: SAMPLES, STATUS: STATUS, TODAY: new Date(2026, 9, 22),
    find: function (id) { return MINE.concat(SAMPLES).filter(function (c) { return c.id === id; })[0] || null; },
    isSample: function (c) { return SAMPLES.indexOf(c) >= 0; },
    newId: function () { return Math.random().toString(16).slice(2, 10).padEnd(8, '0'); },
    saveCampaign: function (c) { upsert(K_CAMPAIGNS, c); },
    drafts: function () { return read(K_DRAFTS); },
    saveDraft: function (d) { upsert(K_DRAFTS, d); },
    deleteDraft: function (id) { remove(K_DRAFTS, id); },
    rateOf: rateOf, spentOf: spentOf
  };
})();
