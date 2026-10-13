/* BlueAI Product V2 Design System: Always ask and Automatic (section 46).
   The PM's per-app model (agent_permissions.jsx:1-26): each app is Always ask or Automatic, a new
   app starts on Always ask, and turning Automatic on is consent, asked every time.

   ModeRows {worker | apps, modes, onChange(appId, mode), beforeChange(appId, mode), onConnect, note}
     One ListRow per app: mark, name, account, and a Segmented 'Always ask' / 'Automatic'. Picking
     Automatic goes through beforeChange (open the ConsentDialog, resolve true on agree). An app
     that is not live yet shows 'Coming soon' with no switch (R40); one not connected offers Connect.
     The ribbon's Change opens it inside the kit Popover (<Popover><ModeRows /></Popover>), which
     owns Esc, outside click and focus; ModeRows draws no float surface of its own.
   ConsentDialog {app, open, busy, onAgree, onCancel, worker, preview}
     V2's consent structure (agent_permissions.jsx:159-179), on the one Dialog with focus
     management, plus where to turn it off. Cancel leaves the question waiting. Its first line is
     proposed copy for the PM and legal to confirm (section 73): V2's 'including posting videos and other
     content' names an action the worker never takes and leaves out the one it does. On Automatic
     the job preview never appears, so this line is the partner's only notice that comments will
     be posted in their name.
   PermissionRequest {app, state, lines, busy, onAllow, onNotNow, decidedOn}
     state asked | allowed | notnow | revoked. Asks before reading watch history and subscriptions
     (V2 reads them unasked: worker_flow.jsx:80, 161). Proposed copy, a PM decision (R18).
   autoNotice(worker, onChange)  the ComposerNotice object for the Automatic ribbon, or null. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const NOTE = 'Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask.';
  const OPTIONS = [{ value: 'always', label: 'Always ask' }, { value: 'auto', label: 'Automatic' }];

  // Apps with their live status and mode, from a Worker record or from explicit props.
  function appList(worker, apps, modes) {
    const base = K().WORKER_APPS || [];
    if (!worker && !apps) worker = (K().workerFixtures || {}).verified;
    return (apps || base).map(function (a) {
      const rec = worker && worker.apps ? (worker.apps[a.id] || {}) : {};
      return Object.assign({}, a, rec, a.status ? { status: a.status } : {}, modes && modes[a.id] ? { mode: modes[a.id] } : {});
    });
  }
  const listNames = (apps) => apps.map(function (a) { return a.name; }).join(apps.length === 2 ? ' and ' : ', ');

  function ModeRows({ worker, apps, modes, onChange, beforeChange, onConnect, note }) {
    const list = appList(worker, apps, modes);
    const I = K().Icon;
    const Row = K().ListRow;
    const Seg = K().Segmented;
    const Badge = K().Badge;
    const B = K().Button;
    return (
      <div className="v2-moderows">
        {list.map(function (a, i) {
          const leading = <span className="v2-moderows-app">{I ? <I name={a.icon} size={20} /> : null}</span>;
          let description = a.handle || null;
          let trailing = null;
          if (a.status === 'coming-soon') {
            description = a.name + ' jobs aren’t available yet.';
            trailing = Badge ? <Badge tone="neutral">Coming soon</Badge> : 'Coming soon';
          } else if (a.status === 'not-connected') {
            description = 'Not connected';
            trailing = B ? <B variant="secondary" size="sm" onClick={function () { if (onConnect) onConnect(a.id); }}>Connect</B> : null;
          } else if (Seg) {
            trailing = (
              <Seg size="md" options={OPTIONS} value={a.mode || 'always'} ariaLabel={a.name + ' paid jobs'}
                onChange={function (m) { if (onChange) onChange(a.id, m); }}
                beforeChange={beforeChange ? function (m) { return beforeChange(a.id, m); } : undefined} />
            );
          }
          return Row
            ? <Row key={a.id} leading={leading} label={a.name} description={description} trailing={trailing} divider={i > 0} />
            : <div key={a.id}>{a.name} {trailing}</div>;
        })}
        {note === false ? null : <p className="v2-moderows-note">{note || NOTE}</p>}
      </div>
    );
  }

  // What a paid job does on each app, in the partner's terms (WORKER_JOB.actions: watch, like,
  // comment). Proposed copy; Instagram's waits for its job type.
  const ACTS = { youtube: 'watching, liking and posting comments in your name' };

  function ConsentBody({ app, worker }) {
    const list = appList(worker);
    const a = list.find(function (x) { return x.id === app; }) || list[0];
    const I = K().Icon;
    return (
      <div className="v2-consent">
        <p>BlueAI will take {a.name} jobs and do them on your account without asking first: {ACTS[a.id] || ACTS.youtube}.</p>
        <div>
          <div className="v2-consent-table">
            {list.map(function (x) {
              const soon = x.status === 'coming-soon';
              const auto = !soon && (x.id === a.id || x.mode === 'auto');
              return (
                <div key={x.id} className={cx('v2-consent-row', x.id === a.id && 'is-target')}>
                  {I ? <I name={x.icon} size={16} /> : null}
                  <span className="v2-consent-app">{x.name}</span>
                  <span className={cx('v2-consent-mode', auto && 'v2-consent-mode--auto')}>
                    {soon ? 'Coming soon' : <React.Fragment>{I ? <I name={auto ? 'zap' : 'shield-check'} size={16} /> : null}{auto ? 'Automatic' : 'Always ask'}</React.Fragment>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="v2-consent-note v2-consent-note--under">Each app has its own setting. The others stay on Always ask until you switch them.</p>
        </div>
        <p>By turning this on, you agree to let BlueAI do this for you on {a.name}. You can turn it off anytime.</p>
        <p className="v2-consent-note">Turn it off in Settings &gt; Worker, or with Change above the chat.</p>
      </div>
    );
  }

  // The kit Dialog's consent variant: close button, no scrim dismiss, busy holds Esc and the scrim.
  // The agreement is the button; there is no checkbox to tick first (V2's choice, kept).
  function ConsentDialog(props) {
    const app = props.app || 'youtube';
    const a = appList(props.worker).find(function (x) { return x.id === app; }) || { name: 'YouTube' };
    const D = K().Dialog;
    if (!D || !(props.open || props.preview)) return null;
    return (
      <D open variant="consent" size="md" preview={props.preview} title={'Run ' + a.name + ' jobs automatically?'}
        busy={props.busy} onClose={props.onCancel}
        actions={[{ label: 'Cancel', variant: 'secondary', onClick: props.onCancel }, { label: 'I agree, turn on', variant: 'primary', onClick: props.onAgree }]}>
        <ConsentBody app={app} worker={props.worker} />
      </D>
    );
  }

  const ACCESS = [
    { icon: 'eye', text: 'See your watch history' },
    { icon: 'bell', text: 'See your subscriptions' },
    { icon: 'activity', text: 'See your channel’s joined date and stats' },
  ];
  function PermissionRequest({ app, state, lines, busy, onAllow, onNotNow, decidedOn }) {
    const a = (K().WORKER_APPS || []).find(function (x) { return x.id === (app || 'youtube'); }) || { name: 'YouTube', icon: 'youtube' };
    const I = K().Icon;
    const B = K().Button;
    const mark = <span className="v2-permreq-mark" aria-hidden="true">{I ? <I name={a.icon} size={16} /> : null}</span>;
    const s = state || 'asked';
    if (s !== 'asked') {
      const text = {
        allowed: 'BlueAI can see your ' + a.name + ' watch history. Turn it off anytime in Connected apps.',
        notnow: 'Not allowed. I’ll watch general videos instead of what you’re into.',
        revoked: 'You turned off watch history' + (decidedOn ? ' on ' + decidedOn : '') + '. I’ll watch general videos until you allow it again.',
      }[s];
      return (
        <div className="v2-permreq v2-permreq--compact" role="status">
          {mark}
          <p className="v2-w-note">{text}</p>
          {s !== 'allowed' && B ? <B variant="secondary" size="sm" onClick={onAllow}>Allow</B> : null}
        </div>
      );
    }
    return (
      <section className="v2-permreq" aria-label={'BlueAI wants to see your ' + a.name + ' activity'}>
        <p className="v2-permreq-head">{mark}BlueAI wants to</p>
        <ul className="v2-permreq-list">
          {(lines || ACCESS).map(function (l) { return <li key={l.text}>{I ? <I name={l.icon} size={16} /> : null}<span>{l.text}</span></li>; })}
        </ul>
        <p className="v2-w-note">So I watch what you’re actually into and pick jobs that fit. If you choose Not now, I’ll still run, with general videos.</p>
        <div className="v2-permreq-actions">
          {B ? <B variant="secondary" size="md" disabled={busy} onClick={onNotNow}>Not now</B> : null}
          {B ? <B variant="primary" size="md" loading={busy} onClick={onAllow}>Allow</B> : null}
        </div>
        <p className="v2-w-meta v2-permreq-revoke">You can turn this off anytime in Connected apps.</p>
      </section>
    );
  }

  // The ribbon as a ComposerNotice (V2 copy, agent_permissions.jsx:197). null while every app asks.
  function autoNotice(worker, onChange) {
    const auto = appList(worker).filter(function (a) { return a.mode === 'auto' && a.status === 'connected'; });
    if (!auto.length) return null;
    return {
      tone: 'info', icon: 'zap',
      text: 'Automatic is on for ' + listNames(auto) + '. BlueAI takes paid ' + (auto.length === 1 ? auto[0].name + ' ' : '') + 'jobs without asking.',
      action: { label: 'Change', onClick: onChange },
    };
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { ModeRows, ConsentDialog, PermissionRequest, autoNotice });
})();
