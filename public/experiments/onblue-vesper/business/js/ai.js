/* "Use with AI": the BlueAI MCP set-up page (Appy, 2026-11-17: "like Magnific's
   own MCP page"). One card: a tab per AI client, its few steps, the server
   address with a copy button; then a prompt ready to send; then what it can do
   and what it never does. The server is real: src/app/api/mcp/route.ts. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var main = document.querySelector('[data-main]');
  var URL = window.location.origin + '/api/mcp';
  var site = r.site || 'yourbrand.com';

  var CLIENTS = [
    ['claude', 'Claude', ['Open Settings, then Connectors', 'Click Add custom connector', 'Name it BlueAI, paste the address below, and click Add']],
    ['code', 'Claude Code', ['Run this in your terminal', 'Then ask Claude Code for a brand report'], 'claude mcp add --transport http blueai ' + URL],
    ['chatgpt', 'ChatGPT', ['Open Settings, then Apps and Connectors', 'Turn on Developer mode under Advanced, then click Create', 'Name it BlueAI, paste the address below, and save']],
    ['cursor', 'Cursor', ['Open Cursor Settings, then MCP', 'Click Add new MCP server and paste this', 'Save, then ask Cursor for a brand report'], '{\n  "mcpServers": {\n    "blueai": { "url": "' + URL + '" }\n  }\n}'],
    ['vscode', 'VS Code', ['Open the Command Palette and run MCP: Add Server', 'Pick HTTP, paste the address below', 'Name it blueai and choose where to save it']]
  ];
  var tab = 'claude';
  // the budget the brand's own draft carries, so the prompt never disagrees with it
  var draft = OB.store('onblue-draft'), budget = draft && draft.site === (r.site || '') && draft.budget ? draft.budget : 2000;
  var PROMPT = 'Use BlueAI to build the brand report for ' + site + '. Then draft a first campaign from it with a $' + OB.fmt(budget) + ' budget, keeping the video ideas you think fit best, and give me the link to review it.';

  function copyBox(label, value, mono) {
    return '<div class="ob-ai-copy' + (mono ? ' is-mono' : '') + '"><span class="ob-ai-copy-l">' + e(label) + '</span><pre>' + e(value) + '</pre>' +
      '<button class="ob-btn ob-btn--sm" type="button" data-copy="' + e(value) + '">Copy</button></div>';
  }

  function render() {
    var c = CLIENTS.filter(function (x) { return x[0] === tab; })[0];
    main.innerHTML =
      '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Use BlueAI with your AI</h1><p class="ob-p-lede">Connect once. Then ask Claude, ChatGPT or Cursor for a brand report or a campaign draft, right from the chat.</p></div></header>' +
      '<div class="ob-ai">' +
      '<section class="ob-card ob-card--lit ob-ai-card"><div class="ob-ai-tabs" role="tablist">' + CLIENTS.map(function (x) {
        return '<button type="button" role="tab" aria-selected="' + (x[0] === tab) + '" data-tab="' + x[0] + '">' + e(x[1]) + '</button>';
      }).join('') + '</div>' +
      '<ol class="ob-ai-steps">' + c[2].map(function (s) { return '<li>' + e(s) + '</li>'; }).join('') + '</ol>' +
      (c[3] ? copyBox(c[0] === 'code' ? 'Command' : 'Add this', c[3], true) : copyBox('Server address', URL, true)) +
      '</section>' +
      '<section class="ob-card ob-ai-card">' + copyBox('Copy this and send it to your AI', PROMPT) + '</section>' +
      '<section class="ob-ai-two"><div class="ob-card"><h2 class="ob-pg-h3">What it can do</h2><ul class="ob-ai-list">' +
        '<li><b>Brand report</b><span>The same report as the website: your brand, real competitors, their real Shorts numbers and best Shorts, what wins, video ideas.</span></li>' +
        '<li><b>Draft a campaign</b><span>A draft with your budget, dates and ideas, opened here in onBlue for you to check.</span></li></ul></div>' +
      '<div class="ob-card"><h2 class="ob-pg-h3">What it never does</h2><ul class="ob-ai-list">' +
        '<li><b>Submit or spend</b><span>Your AI drafts. You submit, here in onBlue, and nothing is charged before that.</span></li>' +
        '<li><b>Touch your account</b><span>It works from public data and a link to your draft.</span></li></ul></div></section>' +
      '</div>';
  }

  main.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-tab]');
    if (t) { tab = t.getAttribute('data-tab'); render(); main.querySelector('[data-tab="' + tab + '"]').focus(); return; }
    var c = ev.target.closest('[data-copy]');
    if (c) {
      var done = function () { c.textContent = 'Copied'; window.setTimeout(function () { c.textContent = 'Copy'; }, 1400); };
      try { navigator.clipboard.writeText(c.getAttribute('data-copy')).then(done, done); } catch (err) { done(); }
    }
  });
  main.addEventListener('keydown', function (ev) {
    var t = ev.target.closest('[data-tab]'); if (!t || (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft')) { return; }
    var i = CLIENTS.map(function (x) { return x[0]; }).indexOf(tab) + (ev.key === 'ArrowRight' ? 1 : -1);
    tab = CLIENTS[(i + CLIENTS.length) % CLIENTS.length][0]; render(); main.querySelector('[data-tab="' + tab + '"]').focus();
  });

  render();
})();
