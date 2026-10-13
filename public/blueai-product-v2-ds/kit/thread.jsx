/* BlueAI Product V2 Design System: the chat thread and its messages (sections 34 and 35).

   Thread        {steps, renderStep, stickToBottom, unseen, onJump, label, empty, className}
                 role=log, aria-live=polite, bottom-anchored. Sticks to the bottom only while the
                 reader is there; otherwise counts what arrived and shows JumpToLatest.
   DaySeparator  {label}                  'Today', 'Yesterday', 'Oct 12' (chatTime.day builds it).
   JumpToLatest  {count, onClick}         renders nothing at 0.
   MessageBubble {from: 'user'|'worker', time, groupStart, children}
   NoticeBubble  {kind: 'info'|'success'|'attention'|'danger'|'neutral', title, lines, children,
                 action, feedback, time}  kind is one of the five token tones; neutral surface, the
                 icon carries the tone. Aliases: 'headsup' is attention, 'fail' is danger, and
                 'needsInput' is attention with the PM's yellow as the one attention fill.
   renderMessage(step, i, steps)          the canonical message kinds (V2's role map plus run and
                 notice): separator, user, status, thinking, plan, warning, final, notice, ask,
                 needsbs, installing-bs, run, daydone. Shows one time per message group.
   chatTime      {day(date, now), time(date)}  real times: '11:03 am', 'Today', 'Oct 12'. */
(function () {
  const { useState, useRef, useLayoutEffect, useEffect } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chatTime = {
    time: function (d) {
      const h = d.getHours(), m = d.getMinutes();
      return (h % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h < 12 ? ' am' : ' pm');
    },
    day: function (d, now) {
      const n = now || new Date();
      const start = function (x) { return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); };
      const diff = Math.round((start(n) - start(d)) / 86400000);
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      return MONTHS[d.getMonth()] + ' ' + d.getDate();
    },
  };


  function Icon(props) {
    const I = K().Icon;
    return I ? <I {...props} /> : null;
  }

  function DaySeparator({ label }) {
    return <div className="v2-day-sep"><span>{label}</span></div>;
  }

  function JumpToLatest({ count, onClick, className }) {
    if (!count) return null;
    return (
      <button type="button" className={cx('v2-jump', className)} onClick={onClick}>
        <Icon name="chevron-down" size={16} />
        <span>{count === 1 ? '1 new message' : count + ' new messages'}</span>
      </button>
    );
  }

  function MessageBubble({ from, time, groupStart, children, className }) {
    const user = from === 'user';
    return (
      <div className={cx('v2-msg', user ? 'v2-msg--user' : 'v2-msg--worker', groupStart && 'is-group-start', className)}>
        <div className={cx('v2-bubble', user ? 'v2-bubble--user' : 'v2-bubble--worker')}>
          <span className="v2-chat-sr">{user ? 'You: ' : 'BlueAI: '}</span>
          {children}
        </div>
        {time ? <span className="v2-msg-time v2-text-meta">{time}</span> : null}
      </div>
    );
  }

  // Keyed by the five token tones. DependencyCard (kit/ask.jsx) and older callers pass the aliases.
  const NOTICE = {
    info: { icon: 'info', tone: 'info', sr: 'Info' },
    success: { icon: 'check', tone: 'success', sr: 'Done' },
    attention: { icon: 'alert', tone: 'attention', sr: 'Heads up' },
    danger: { icon: 'x-circle', tone: 'danger', sr: 'Did not finish' },
    neutral: { icon: 'info', tone: 'neutral', sr: 'Note' },
  };
  const ALIAS = {
    headsup: NOTICE.attention,
    fail: NOTICE.danger,
    needsInput: { icon: 'help', tone: 'attention', sr: 'Needs your input', fill: true },
  };

  function NoticeBubble({ kind, title, lines, children, action, feedback, time, groupStart, className }) {
    const k = NOTICE[kind] || ALIAS[kind] || NOTICE.attention;
    const body = lines ? lines : (children != null ? [children] : []);
    return (
      <div className={cx('v2-msg', 'v2-msg--worker', groupStart && 'is-group-start', className)}>
        <div className={cx('v2-notice', 'v2-notice--' + k.tone, k.fill && 'v2-notice--fill')}>
          <div className="v2-notice-row">
            <span className={'v2-notice-icon v2-chat-tone--' + k.tone}><Icon name={k.icon} size={16} /></span>
            <div className="v2-notice-body">
              {title ? <p className="v2-notice-title">{title}</p> : <span className="v2-chat-sr">{k.sr}: </span>}
              {body.map(function (line, i) { return <p key={i} className="v2-notice-text">{line}</p>; })}
            </div>
          </div>
          {action ? <div className="v2-notice-action">{action}</div> : null}
        </div>
        {feedback || null}
        {time ? <span className="v2-msg-time v2-text-meta">{time}</span> : null}
      </div>
    );
  }

  function Thinking() {
    const S = K().Spinner;
    return (
      <div className="v2-msg v2-msg--worker">
        <div className="v2-bubble v2-bubble--worker v2-thinking">
          {S ? <S size={16} delay={0} /> : null}
          <span>Working on it…</span>
        </div>
      </div>
    );
  }

  const sender = function (s) { return !s ? null : (s.role === 'user' ? 'user' : (s.role === 'separator' ? 'sep' : 'worker')); };

  function renderMessage(step, i, steps) {
    const P = K();
    const list = steps || [step];
    const prev = list[i - 1], next = list[i + 1];
    const groupStart = !!prev && sender(prev) !== 'sep' && sender(prev) !== sender(step);
    const time = step.time && (!next || sender(next) !== sender(step) || next.time !== step.time) ? step.time : null;
    const key = step.key || i;
    const lines = Array.isArray(step.content) ? step.content : (step.content != null ? [step.content] : []);
    const fb = step.feedback && P.FeedbackThumbs ? <P.FeedbackThumbs {...step.feedback} /> : null;
    switch (step.role) {
      case 'separator': return <DaySeparator key={key} label={step.label} />;
      case 'user': return <MessageBubble key={key} from="user" time={time} groupStart={groupStart}>{step.content}</MessageBubble>;
      case 'status': return <MessageBubble key={key} from="worker" time={time} groupStart={groupStart}>{step.content}</MessageBubble>;
      case 'thinking': return i === list.length - 1 ? <Thinking key={key} /> : null;
      case 'plan':
        return (
          <MessageBubble key={key} from="worker" time={time} groupStart={groupStart}>
            <p className="v2-bubble-title">{step.title || 'Plan'}</p>
            {step.summary ? <p className="v2-bubble-p">{step.summary}</p> : null}
            {step.items ? <ol className="v2-bubble-list">{step.items.map(function (t) { return <li key={t}>{t}</li>; })}</ol> : null}
          </MessageBubble>
        );
      case 'warning': return <NoticeBubble key={key} kind="headsup" title={step.title} lines={lines} time={time} groupStart={groupStart} />;
      case 'final': return <NoticeBubble key={key} kind={step.tone} title={step.title} lines={lines} feedback={fb} time={time} groupStart={groupStart} />;
      case 'notice': return <NoticeBubble key={key} kind={step.kind} title={step.title} lines={lines} time={time} groupStart={groupStart} />;
      case 'ask': return P.AskCard ? <P.AskCard key={key} step={step} answer={step.answer} onAnswer={step.onAnswer} tone={step.tone} /> : null;
      case 'needsbs': return P.DependencyCard ? <P.DependencyCard key={key} app={step.app} phase="needs" onGet={step.onGet} /> : null;
      case 'installing-bs': return P.DependencyCard ? <P.DependencyCard key={key} app={step.app} phase={step.phase || 'installing'} progress={step.progress} /> : null;
      case 'run': return P.RunCard ? <P.RunCard key={key} run={step.run} state={step.state} feedback={fb} onAction={step.onAction} onOpenDetail={step.onOpenDetail} /> : null;
      case 'daydone': return null; /* said by RunCard's day line and the DayDone moment (section 44) */
      default: return null;
    }
  }

  function Thread({ steps, renderStep, stickToBottom, unseen, onJump, label, empty, className, children }) {
    const list = steps || [];
    const stick = stickToBottom !== false;
    const ref = useRef(null);
    const atBottom = useRef(stick);
    const prevLen = useRef(list.length);
    const [fresh, setFresh] = useState(0);
    const render = renderStep || renderMessage;

    useLayoutEffect(function () {
      const el = ref.current;
      const added = Math.max(0, list.length - prevLen.current);
      prevLen.current = list.length;
      if (!el) return;
      if (stick && atBottom.current) { el.scrollTop = el.scrollHeight; setFresh(0); }
      else if (added) setFresh(function (n) { return n + added; });
    }, [list.length]);

    function onScroll() {
      const el = ref.current;
      if (!el) return;
      atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      if (atBottom.current && fresh) setFresh(0);
    }
    function jump() {
      const el = ref.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: window.V2Kit.reducedMotion() ? 'auto' : 'smooth' });
      atBottom.current = true;
      setFresh(0);
      if (onJump) onJump();
    }
    useEffect(function () { if (!stick) atBottom.current = false; }, [stick]);

    const count = unseen != null ? unseen : fresh;
    return (
      <div className={cx('v2-thread', className)}>
        <div className="v2-thread-scroll" ref={ref} onScroll={onScroll} tabIndex={0}
          role="log" aria-live="polite" aria-relevant="additions text" aria-label={label || 'Conversation with BlueAI'}>
          <div className={cx('v2-thread-list', !list.length && 'is-empty')}>
            {list.length ? list.map(function (s, i) { return render(s, i, list); }) : (empty || null)}
            {children}
          </div>
        </div>
        <JumpToLatest count={count} onClick={jump} />
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, {
    Thread, DaySeparator, JumpToLatest, MessageBubble, NoticeBubble, renderMessage, chatTime,
  });
})();
