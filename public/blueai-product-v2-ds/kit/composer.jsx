/* BlueAI Product V2 Design System: the composer (section 38).

   Composer       {value, defaultValue, onChange(text), onSend(text), onStop, running, awaiting,
                  paidJob, confirming, disabledReason, placeholder, notice, maxRows, className}
                  One field. Grows from 1 to maxRows (6) lines, then scrolls (V2 clipped at 120px).
                  Enter sends, Shift+Enter is a new line. While a run plays or waits on an answer
                  the field is read-only and Send becomes Stop; with paidJob, Stop asks first and
                  says what stopping costs. disabledReason locks the field and becomes its
                  placeholder ('Out of credits until 5:30 am'); pair it with a notice.
                  Force focus for specimens with className 'is-focus'.
   ComposerNotice {tone: 'info'|'attention'|'neutral', icon, text, children, action: {label,
                  onClick}}  the slot above the field for a condition that holds before you type:
                  Automatic on, out of credits, BlueStacks needed, paused. V2's AutoRibbon,
                  generalised.
   SendStop       {mode: 'send'|'stop', disabled, onClick, className}  36px round. */
(function () {
  const { useState, useRef, useLayoutEffect, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  function Icon(props) { const I = K().Icon; return I ? <I {...props} /> : null; }

  const NOTICE_ICON = { info: 'info', attention: 'alert', neutral: 'pause' };

  function ComposerNotice({ tone, icon, text, children, action, id, className }) {
    const t = NOTICE_ICON[tone] ? tone : 'info';
    return (
      <div className={cx('v2-cnotice', 'v2-cnotice--' + t, className)} id={id}>
        <span className="v2-cnotice-icon"><Icon name={icon || NOTICE_ICON[t]} size={16} /></span>
        <span className="v2-cnotice-text">{text || children}</span>
        {action ? <button type="button" className="v2-cnotice-action" onClick={action.onClick}>{action.label}</button> : null}
      </div>
    );
  }

  function SendStop({ mode, disabled, onClick, className }) {
    const stop = mode === 'stop';
    return (
      <button type="button" className={cx('v2-sendstop', stop ? 'v2-sendstop--stop' : 'v2-sendstop--send', className)}
        onClick={onClick} disabled={disabled} aria-label={stop ? 'Stop the run' : 'Send message'}>
        <Icon name={stop ? 'stop' : 'send'} size={16} />
      </button>
    );
  }

  function Composer(props) {
    const { value, defaultValue, onChange, onSend, onStop, running, awaiting, paidJob, confirming,
      disabledReason, placeholder, notice, maxRows, className } = props;
    const [draft, setDraft] = useState(defaultValue || '');
    const [confirm, setConfirm] = useState(!!confirming);
    const ta = useRef(null);
    const noticeId = useId();
    const P = K();
    const controlled = value != null;
    const text = controlled ? value : draft;
    const busy = !!(running || awaiting);
    const locked = !busy && !!disabledReason;
    const rows = maxRows || 6;

    useLayoutEffect(function () {
      const el = ta.current;
      if (!el) return;
      el.style.height = 'auto';
      const cs = getComputedStyle(el);
      const line = parseFloat(cs.lineHeight) || 21;
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const max = line * rows + pad;
      el.style.height = Math.min(el.scrollHeight, max) + 'px';
      el.style.overflowY = el.scrollHeight > max + 1 ? 'auto' : 'hidden';
    }, [text, rows]);

    function set(v) { if (!controlled) setDraft(v); if (onChange) onChange(v); }
    function send() {
      const t = text.trim();
      if (!t || busy || locked) return;
      if (onSend) onSend(t);
      if (!controlled) setDraft('');
    }
    function stop() {
      if (paidJob && !confirm) { setConfirm(true); return; }
      setConfirm(false);
      if (onStop) onStop();
    }

    const ph = placeholder || (awaiting ? 'Answer with the buttons above'
      : (running ? 'BlueAI is working…' : (disabledReason || 'Type your message')));
    let noticeNode = null;
    if (notice) noticeNode = React.isValidElement(notice) ? notice : <ComposerNotice {...notice} id={noticeId} />;

    return (
      <div className={cx('v2-composer', className)}>
        {noticeNode}
        {confirm && busy ? (
          <div className="v2-stopconfirm" role="group" aria-label="Stop the run?">
            <p className="v2-stopconfirm-text">Stop now? The paid job won’t finish and today won’t count.</p>
            <div className="v2-stopconfirm-actions">
              {P.Button ? <P.Button variant="secondary" size="md" onClick={function () { setConfirm(false); }}>Keep running</P.Button> : null}
              {P.Button ? <P.Button variant="danger" size="md" onClick={stop}>Stop run</P.Button> : null}
            </div>
          </div>
        ) : null}
        <div className={cx('v2-composer-box', (busy || locked) && 'is-readonly')}>
          <textarea ref={ta} className="v2-composer-input" rows={1} value={text} placeholder={ph}
            readOnly={busy} disabled={locked} aria-label="Message BlueAI"
            aria-describedby={notice && !React.isValidElement(notice) ? noticeId : undefined}
            onChange={function (e) { set(e.target.value); }}
            onKeyDown={function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <SendStop mode={busy ? 'stop' : 'send'} disabled={busy ? false : (locked || !text.trim())}
            onClick={busy ? stop : send} />
        </div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Composer, ComposerNotice, SendStop });
})();
