/* BlueAI Product V2 Design System: the composer (section 38).

   Composer       {value, defaultValue, onChange(text), onSend(text), onStop, running, awaiting,
                  costsDay, paidJob, confirming, disabledReason, placeholder, notice, maxRows,
                  className}
                  One field. Grows from 1 to maxRows (6) lines, then scrolls (V2 clipped at 120px).
                  Enter sends, Shift+Enter is a new line. While a run plays or waits on an answer
                  the field is read-only and Send becomes Stop; with costsDay (today is not counted
                  yet), Stop asks first and says what stopping costs: 'Today won't count toward
                  your 20 days.' paidJob also asks first, for a paid job already under way, and
                  adds that the job won't finish. The confirm is an alertdialog that takes focus
                  (Keep running), so it is heard; while it is open Stop only moves focus back to it,
                  so a double press never stops a paid run. disabledReason locks the field and
                  becomes its placeholder, neutral ('You can't send messages right now'); the
                  notice says why and until when (Out of AI credits until 5:30 am,
                  V2Kit.OOC_COPY.until, section 48).
                  Force focus for specimens with className 'is-focus'.
   ComposerNotice {tone: 'info'|'attention'|'neutral', icon, text, children, action: {label,
                  onClick}}  the slot above the field for a condition that holds before you type:
                  Automatic on, out of credits, BlueStacks needed, paused. V2's AutoRibbon,
                  generalised as the compact Banner: tone in the fill, edge and icon, words in ink,
                  the action is the shared Link.
   SendStop       {mode: 'send'|'stop', disabled, onClick, className}  36px round. */
(function () {
  const { useState, useRef, useLayoutEffect, useEffect, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  function Icon(props) { const I = K().Icon; return I ? <I {...props} /> : null; }

  const NOTICE_ICON = { info: 'info', attention: 'alert', neutral: 'pause' };

  function ComposerNotice({ tone, icon, text, children, action, id, className }) {
    const t = NOTICE_ICON[tone] ? tone : 'info';
    const L = K().Link;
    return (
      <div className={cx('v2-cnotice', 'v2-cnotice--' + t, className)} id={id}>
        <span className="v2-cnotice-icon" aria-hidden="true"><Icon name={icon || NOTICE_ICON[t]} size={16} /></span>
        <span className="v2-cnotice-text">{text || children}</span>
        {action && L ? <L standalone className="v2-cnotice-action" onClick={action.onClick}>{action.label}</L> : null}
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
    const { value, defaultValue, onChange, onSend, onStop, running, awaiting, costsDay, paidJob, confirming,
      disabledReason, placeholder, notice, maxRows, className } = props;
    const [draft, setDraft] = useState(defaultValue || '');
    const [confirm, setConfirm] = useState(!!confirming);
    const ta = useRef(null);
    const box = useRef(null);
    const ask = useRef(null);
    const asked = useRef(false); // the confirm was opened by a Stop press, so it takes focus
    const noticeId = useId();
    const askId = useId();
    const P = K();
    const controlled = value != null;
    const text = controlled ? value : draft;
    const busy = !!(running || awaiting);
    const locked = !busy && !!disabledReason;
    const rows = maxRows || 6;
    const asking = confirm && busy;

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
    // The run ended on its own: drop the question.
    useEffect(function () { if (!busy) { setConfirm(false); asked.current = false; } }, [busy]);
    // Opened by a press: focus the safe answer, so the question is announced with its role.
    useEffect(function () { if (asking && asked.current) focusIn(ask.current, 'button'); }, [asking]);

    function focusIn(root, sel) { const el = root && root.querySelector(sel); if (el) el.focus(); }
    function set(v) { if (!controlled) setDraft(v); if (onChange) onChange(v); }
    function send() {
      const t = text.trim();
      if (!t || busy || locked) return;
      if (onSend) onSend(t);
      if (!controlled) setDraft('');
    }
    // Stop: while today can still count the first press only asks; while asking, it goes back to
    // the question.
    function requestStop() {
      if (asking) { focusIn(ask.current, 'button'); return; }
      if (costsDay || paidJob) { asked.current = true; setConfirm(true); return; }
      if (onStop) onStop();
    }
    function keepRunning() { setConfirm(false); asked.current = false; focusIn(box.current, '.v2-sendstop'); }
    function stopRun() {
      setConfirm(false); asked.current = false;
      if (onStop) onStop();
      if (ta.current) ta.current.focus();
    }

    const ph = placeholder || (awaiting ? 'Answer with the buttons above'
      : (running ? 'BlueAI is working…' : (disabledReason || 'Type your message')));
    let noticeNode = null;
    if (notice) noticeNode = React.isValidElement(notice) ? notice : <ComposerNotice {...notice} id={noticeId} />;

    return (
      <div className={cx('v2-composer', className)}>
        {noticeNode}
        {asking ? (
          <div ref={ask} className="v2-stopconfirm" role="alertdialog" aria-labelledby={askId}>
            <p className="v2-stopconfirm-text" id={askId}>{paidJob ? 'Stop now? The paid job won’t finish and today won’t count.' : 'Stop now? Today won’t count toward your 20 days.'}</p>
            <div className="v2-stopconfirm-actions">
              {P.Button ? <P.Button variant="secondary" size="md" onClick={keepRunning}>Keep running</P.Button> : null}
              {P.Button ? <P.Button variant="danger" size="md" onClick={stopRun}>Stop run</P.Button> : null}
            </div>
          </div>
        ) : null}
        <div ref={box} className={cx('v2-composer-box', (busy || locked) && 'is-readonly')}>
          <textarea ref={ta} className="v2-composer-input" rows={1} value={text} placeholder={ph}
            readOnly={busy} disabled={locked} aria-label="Message BlueAI"
            aria-describedby={notice && !React.isValidElement(notice) ? noticeId : undefined}
            onChange={function (e) { set(e.target.value); }}
            onKeyDown={function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <SendStop mode={busy ? 'stop' : 'send'} disabled={busy ? false : (locked || !text.trim())}
            onClick={busy ? requestStop : send} />
        </div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Composer, ComposerNotice, SendStop });
})();
