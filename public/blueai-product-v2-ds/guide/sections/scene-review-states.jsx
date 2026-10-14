/* Section 72: Review states (URL params and Preview panel) (shell slice). Parts: State catalogue,
   Preview panel (both In V2). The specimen index of V2: every state, its canonical URL, which
   params only work together, and which states only the Preview panel reaches.
   Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;

  // [param, values, needs, opens, Copy link carries it, refs, canonical URL]
  const PARAMS = [
    ['(bare URL)', '', '', 'BlueAI alone, signed out: the welcome with the first-run terms sheet', 'n/a', 'shell.params.bare', 'index.html'],
    ['?start', 'worker | signin', '', 'worker: the worker home, signed in as a new partner. signin is the default cold start', 'yes', 'shell.params.start', 'index.html?start=worker'],
    ['?day', 'next', 'implies start=worker', 'the next day’s run plays after boot (returning was removed 2026-10-14; old links land on the worker home)', 'yes', 'shell.params.day', 'index.html?day=next'],
    ['?end', 'job | nojob | day20 | failed', 'implies day=next', 'how today’s run ends: the day-done card and the toast', 'yes', 'shell.params.end', 'index.html?end=nojob'],
    ['?mode', 'auto', 'start=worker', 'YouTube starts on Automatic; the consent dialog is skipped (the Mode row does the same)', 'yes', 'shell.params.mode', 'index.html?start=worker&mode=auto'],
    ['?signin', 'browser', '', 'straight to the sign-in handoff, the browser beside the app', 'yes', 'shell.params.signin', 'index.html?signin=browser'],
    ['?player', 'out | accepted | other', 'other acts only with signin=browser', 'the App Player account on this PC', 'yes', ['shell.params.player', 'shell.params.player-other'], 'index.html?signin=browser&player=other'],
    ['?browser', 'accepted | other | out', 'signin=browser', 'what bluestacks.ai holds when the browser opens', 'yes', 'shell.params.browser', 'index.html?signin=browser&browser=out'],
    ['?cases', 'signin', '', 'the one sign-in case (an account that isn’t enrolled) as a bar; no Preview panel', 'no', 'shell.params.cases', 'index.html?cases=signin'],
    ['?case', 'player | browser', 'cases=signin', 'where the not-enrolled sign-in came from', 'no', 'shell.params.case', 'index.html?cases=signin&case=browser'],
    ['?ask', 'any text', 'waits for sign-in', 'auto-sends that message once signed in', 'no', 'shell.params.ask', 'index.html?start=worker&ask=Hi'],
    ['?credits', '0', 'signed in to see it', 'zero credits: the chip at 0, the banner, the popup on send', 'no', 'shell.params.credits', 'index.html?start=worker&credits=0'],
    ['?bs', '1', '', 'BlueStacks installed too', 'yes', 'shell.params.bs', 'index.html?bs=1'],
    ['?bai', '0', 'bs=1 (alone it is forced back on)', 'BlueAI not installed', 'yes', ['shell.params.bai', 'shell.params.guard'], 'index.html?bs=1&bai=0'],
    ['?dlg', 'blueai', 'bs=1 and bai=0', 'opens Flow A’s installer', 'no', ['shell.params.dlg', 'shell.params.dlg-guard'], 'index.html?bs=1&bai=0&dlg=blueai'],
  ];

  // [row, options, shown when, refs]
  const ROWS = [
    ['Installed', 'BlueStacks, BlueAI', 'always', 'shell.params.row-installed'],
    ['Start at', 'Sign in, Worker home', 'BlueAI installed', 'shell.params.row-start'],
    ['Session', 'Onboarding, Default, BlueAI worker', 'BlueAI installed', 'shell.params.row-session'],
    ['Terms', 'First run, Terms update, Off', 'BlueAI installed', 'shell.params.row-terms'],
    ['App Player', 'Signed out, Accepted account, Other account', 'signed out, or App Player not signed out', 'shell.params.row-player'],
    ['Browser', 'Accepted account, Other account, Signed out', 'same as App Player', 'shell.params.row-browser'],
    ['Chat states', 'Off, On', 'the chat tab', 'shell.params.row-chat-states'],
    ['Scheduled job', 'Off, Out of credits', 'the chat tab', 'shell.params.row-scheduled'],
    ['Mode', 'Always ask, Automatic', 'the worker chat, signed in', 'shell.params.row-mode'],
    ['Worker', 'Day 1, Next day', 'the worker chat, signed in', 'shell.params.row-worker'],
    ['Day end', 'Job done, No job, Day 20, Failed', 'the worker chat, signed in', ['shell.params.row-day-end', 'shell.params.ends']],
    ['Hardware', 'Yes, No', 'the Settings tab', 'shell.params.row-hardware'],
    ['AI conflict', 'None, Detected', 'the Settings tab', 'shell.params.row-conflict'],
    ['Credits', 'Full, Empty', 'signed in, own key off', 'shell.params.row-credits'],
  ];

  function Catalogue() {
    const [url, setUrl] = useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
        <div className="g-table-wrap">
          <table className="g-table">
            <thead><tr><th scope="col">Param</th><th scope="col">Values</th><th scope="col">Needs</th><th scope="col">Opens</th><th scope="col">Copy link</th><th scope="col">V2 source</th><th scope="col">State</th></tr></thead>
            <tbody>
              {PARAMS.map(function (p) {
                return (
                  <tr key={p[0]}>
                    <td><code className="g-code">{p[0]}</code></td><td>{p[1]}</td><td>{p[2]}</td><td>{p[3]}</td><td>{p[4]}</td>
                    <td><G.RefCell refs={p[5]} /></td>
                    <td><button type="button" className="g-btn" aria-pressed={url === p[6]} onClick={function () { setUrl(p[6]); }}>Show</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {url ? (
          <div className="g-frame">
            <iframe key={url} className="g-frame-iframe" src={url} title={'V2 at ' + url} style={{ height: '720px' }} />
            <div className="g-frame-foot">
              <code className="g-code">{url}</code>
              <a className="g-link" href={url} target="_blank" rel="noopener">Open in a new tab</a>
            </div>
          </div>
        ) : <p className="g-muted" style={{ margin: 0 }}>Pick a row's Show to load that V2 state here. Nothing loads until you do.</p>}
      </div>
    );
  }

  function ReviewStatesSection() {
    return (
      <G.Section id="review-states">
        <G.Part name="State catalogue" status="in_v2" role="Every V2 URL param, what it opens, what it needs, and whether Copy link carries it.">
          <Catalogue />
          <G.Warn>Three params only work together (?bai needs ?bs, ?dlg needs both, ?player=other needs ?signin=browser) and ?ask waits silently for sign-in. Copy link writes the install and sign-in params, and the worker params only on the signed-in worker home (<G.RefCell refs="shell.params.copy-link-worker" />); it drops credits, ask, dlg and cases. R46: Copy link should carry every state, and each param should stand alone.</G.Warn>
          <G.SpecDrawer title="V2 sources" rows={[
            { part: 'Parsing', token: 'none (tooling)', value: 'read once at load', ref: 'shell.params.link' },
            { part: 'Copy link', token: 'none (tooling)', value: 'builds the query from the screen', ref: ['shell.params.copy-link', 'shell.params.copy-label'] },
          ]} />
        </G.Part>

        <G.Part name="Preview panel" status="in_v2" role="V2's dark review dock: the only door to about a third of V2's states. Tooling, never product.">
          <G.FrameState url="index.html" label="V2 with the Preview panel (bottom left)" height={720} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Row</th><th scope="col">Options</th><th scope="col">Shown when</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{ROWS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><G.RefCell refs={r[3]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <G.Note>Its dark palette is a tool's, chosen so it reads as a tool on the desktop. It follows the onBlue site's review-dock convention (onblue-dev.js) and contributes no tokens.</G.Note>
          <G.SpecDrawer title="V2 sources" rows={[
            { part: 'Purpose', token: 'none (tooling)', value: 'dark on purpose', ref: 'shell.params.preview-dark' },
            { part: 'Palette', token: 'none (tooling)', value: 'tool surface and line', ref: 'shell.params.dev-palette' },
            { part: 'Placement', token: 'none (tooling)', value: 'fixed bottom left, 300 wide', ref: 'shell.params.dev-pos' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('review-states', ReviewStatesSection);
})();
