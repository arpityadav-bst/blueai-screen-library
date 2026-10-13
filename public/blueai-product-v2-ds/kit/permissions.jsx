/* BlueAI Product V2 Design System: Always ask and Automatic (section 46).
   The PM's per-app model (agent_permissions.jsx:1-26): each app is Always ask or Automatic, a new
   app starts on Always ask, and turning Automatic on is consent, asked every time.

   ModeRows {worker | apps, modes, onChange(appId, mode), beforeChange(appId, mode), onConnect, note}
     One ListRow per app: mark, name, account, and a Segmented 'Always ask' / 'Automatic'. Picking
     Automatic goes through beforeChange (open the ConsentDialog, resolve true on agree). An app
     that is not live yet shows 'Coming soon' with no switch (R40); one not connected offers Connect.
     It lives in Settings > Worker (section 62). The ribbon's Change opens that screen (Chat's
     onChangeMode), so the mode has one home and the consent dialog never stacks over a float.
   ConsentDialog {app, open, busy, error, onAgree, onCancel, worker, preview}
     V2's consent title and button (agent_permissions.jsx:160-165), on the one Dialog with focus
     management, plus where to turn it off. Cancel leaves the question waiting. error (the
     agreement was not saved) shows a danger Banner in the body; 'I agree, turn on' is the retry.
     Its first line is the Dialog's description (aria-describedby), so what the partner agrees to
     is read with the dialog. It names every action a job on that app can include
     (WORKER_APPS[].actions: watch, like, comment, subscribe), never a fixed list, and is proposed
     copy for the PM and legal to confirm (R51, section 73): V2's 'including posting videos'
     names an action the worker never takes and leaves out the ones it does. On
     Automatic the job preview never appears, so this line is the partner's only notice of what
     will be done in their name.
   PermissionRequest {app, state, lines, busy, onAllow, onNotNow, decidedOn}
     state asked | allowed | notnow | revoked. Asks before reading watch history and subscriptions
     (V2 reads them unasked: worker_flow.jsx:80, 161). The worker speaks as 'I' throughout, as in
     the thread. Proposed copy, a PM decision (R18).
   autoNotice(worker, onChange)  the ComposerNotice object for the Automatic ribbon, or null. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const NOTE = 'Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask.';
  const OPTIONS = [{ value: 'always', label: 'Always ask', icon: 'shield-check' }, { value: 'auto', label: 'Automatic', icon: 'zap' }];

  // Apps with their live status and mode, from a Worker record or from explicit props.
  function appList(worker, apps, modes) {
    const base = K().WORKER_APPS;
    if (!worker && !apps) worker = K().workerFixtures.verified;
    return (apps || base).map(function (a) {
      const rec = worker && worker.apps ? (worker.apps[a.id] || {}) : {};
      return Object.assign({}, a, rec, a.status ? { status: a.status } : {}, modes && modes[a.id] ? { mode: modes[a.id] } : {});
    });
  }
  const listNames = (apps) => apps.map(function (a) { return a.name; }).join(apps.length === 2 ? ' and ' : ', ');

  function ModeRows({ worker, apps, modes, onChange, beforeChange, onConnect, note }) {
    const list = appList(worker, apps, modes);
    const P = K();
    return (
      <div className="v2-moderows">
        {list.map(function (a, i) {
          const leading = <span className="v2-moderows-app"><P.Icon name={a.icon} size={20} /></span>;
          let description = a.handle || null;
          let trailing;
          if (a.status === 'coming-soon') {
            description = a.name + ' jobs aren’t available yet.';
            trailing = <P.Badge tone="neutral">Coming soon</P.Badge>;
          } else if (a.status === 'not-connected') {
            description = 'Not connected';
            trailing = <P.Button variant="secondary" size="sm" onClick={function () { if (onConnect) onConnect(a.id); }}>Connect</P.Button>;
          } else {
            trailing = (
              <P.Segmented size="md" options={OPTIONS} value={a.mode || 'always'} ariaLabel={a.name + ' paid jobs'}
                onChange={function (m) { if (onChange) onChange(a.id, m); }}
                beforeChange={beforeChange ? function (m) { return beforeChange(a.id, m); } : undefined} />
            );
          }
          return <P.ListRow key={a.id} leading={leading} label={a.name} description={description} trailing={trailing} divider={i > 0} />;
        })}
        {note === false ? null : <p className="v2-moderows-note v2-text-caption">{note || NOTE}</p>}
      </div>
    );
  }

  // What a paid job can do on an app, in the partner's terms, from every action its jobs can
  // include (WORKER_APPS[].actions, the job model's list, section 45). Proposed copy.
  const ACT_WORDS = { watch: 'watching', like: 'liking', comment: 'posting comments', subscribe: 'subscribing to channels' };
  function consentLine(a) {
    const acts = ((a && a.actions) || []).map(function (x) { return ACT_WORDS[x]; }).filter(Boolean);
    const did = acts.length > 1 ? acts.slice(0, -1).join(', ') + ' and ' + acts[acts.length - 1] : (acts[0] || 'everything its paid jobs include');
    return 'BlueAI will take ' + a.name + ' jobs and do them on your account without asking first: ' + did + ' in your name.';
  }

  // The body under the consent line (the Dialog's description): the per-app table and the way out.
  function ConsentBody({ app, worker }) {
    const list = appList(worker);
    const a = list.find(function (x) { return x.id === app; }) || list[0];
    const I = K().Icon;
    return (
      <div className="v2-consent">
        <div>
          <div className="v2-consent-table">
            {list.map(function (x) {
              const soon = x.status === 'coming-soon';
              const auto = !soon && (x.id === a.id || x.mode === 'auto');
              return (
                <div key={x.id} className={cx('v2-consent-row', x.id === a.id && 'is-target')}>
                  <I name={x.icon} size={16} />
                  <span className="v2-consent-app">{x.name}</span>
                  <span className={cx('v2-consent-mode', auto && 'v2-consent-mode--auto')}>
                    {soon ? 'Coming soon' : <React.Fragment><I name={auto ? 'zap' : 'shield-check'} size={16} />{auto ? 'Automatic' : 'Always ask'}</React.Fragment>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="v2-consent-note v2-consent-note--under v2-text-caption">Each app has its own setting. The others stay on Always ask until you switch them.</p>
        </div>
        <p>By turning this on, you agree to let BlueAI do this for you on {a.name}. You can turn it off anytime.</p>
        <p className="v2-consent-note v2-text-caption">Turn it off in Settings &gt; Worker, or with Change above the chat.</p>
      </div>
    );
  }

  // The kit Dialog's consent variant: close button, no scrim dismiss, busy holds Esc and the scrim.
  // The agreement is the button; there is no checkbox to tick first (V2's choice, kept).
  function ConsentDialog(props) {
    const app = props.app || 'youtube';
    const list = appList(props.worker);
    const a = list.find(function (x) { return x.id === app; }) || list[0];
    const D = K().Dialog;
    const Ban = K().Banner;
    if (!(props.open || props.preview)) return null;
    return (
      <D open variant="consent" size="md" preview={props.preview} title={'Run ' + a.name + ' jobs automatically?'}
        description={consentLine(a)} busy={props.busy} onClose={props.onCancel}
        actions={[{ label: 'Cancel', variant: 'secondary', onClick: props.onCancel }, { label: 'I agree, turn on', variant: 'primary', onClick: props.onAgree }]}>
        {props.error && Ban ? <Ban tone="danger">Not saved, nothing changed. Try again.</Ban> : null}
        <ConsentBody app={app} worker={props.worker} />
      </D>
    );
  }

  const ACCESS = [
    { icon: 'eye', text: 'Your watch history' },
    { icon: 'bell', text: 'Your subscriptions' },
    { icon: 'activity', text: 'Your channel’s joined date and stats' },
  ];
  function PermissionRequest({ app, state, lines, busy, onAllow, onNotNow, decidedOn }) {
    const a = K().WORKER_APPS.find(function (x) { return x.id === (app || 'youtube'); }) || K().WORKER_APPS[0];
    const I = K().Icon;
    const B = K().Button;
    const mark = <span className="v2-permreq-mark" aria-hidden="true"><I name={a.icon} size={16} /></span>;
    const s = state || 'asked';
    if (s !== 'asked') {
      const text = {
        allowed: 'I can see your ' + a.name + ' watch history. Turn it off anytime in Connected apps.',
        notnow: 'Not allowed. I’ll watch general videos instead of what you’re into.',
        revoked: 'You turned off watch history' + (decidedOn ? ' on ' + decidedOn : '') + '. I’ll watch general videos until you allow it again.',
      }[s];
      return (
        <div className="v2-permreq v2-permreq--compact" role="status">
          {mark}
          <p className="v2-permreq-note v2-text-body-sm">{text}</p>
          {s !== 'allowed' ? <B variant="secondary" size="sm" onClick={onAllow}>Allow</B> : null}
        </div>
      );
    }
    return (
      <section className="v2-permreq" aria-label={'I’d like to see your ' + a.name + ' activity'}>
        <p className="v2-permreq-head v2-text-title-sm">{mark}I’d like to see</p>
        <ul className="v2-permreq-list">
          {(lines || ACCESS).map(function (l) { return <li key={l.text}><I name={l.icon} size={16} /><span>{l.text}</span></li>; })}
        </ul>
        <p className="v2-text-body-sm">So I can watch what you’re into and pick jobs that fit. If you choose Not now, I’ll still run, with general videos.</p>
        <div className="v2-permreq-actions">
          <B variant="secondary" size="md" disabled={busy} onClick={onNotNow}>Not now</B>
          <B variant="primary" size="md" loading={busy} onClick={onAllow}>Allow</B>
        </div>
        <p className="v2-text-meta v2-permreq-revoke">You can turn this off anytime in Connected apps.</p>
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
