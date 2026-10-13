/* BlueAI Product V2 Design System: the job preview (section 45, New, proposal R07).
   JobPreviewCard {job, mode, waitingSince, expiresAt, expired, doneAt, taking, verify, ranOn,
                   onTake, onSkip, onStopAsking, onChangeMode}
     job    { app, label, video: {title, channel, duration, thumb}, actions: [watch|like|comment|
            subscribe], comment }  (V2Kit.WORKER_JOB is the fixture). A flat {title, channel,
            thumb, duration} also works.
     mode   'ask' (Always ask: before anything runs on the partner's account) or 'receipt'
            (the same facts after the fact).
     verify the receipt's tick: 'pending' (default) | 'late' | 'verified' | 'rejected', or null
            for none (Run detail passes null: its Verification card says the day, once).
     ranOn  the mode this job ran under, from the run record: 'auto' (default) offers 'Switch
            back to Always ask'; 'ask' offers nothing (the partner already approved this one).
     States: ask (just found), waiting (waitingSince set: the partner was away), expired (the
            window closed, today did not count), receipt.
   Before a paid job runs under the partner's name it says which video, which channel, what will
   be done (including the exact comment) and what skipping costs, on the buttons themselves. The
   mode controls name the mode they switch to: 'Switch YouTube to Automatic' (zap, opens the
   consent) and 'Switch back to Always ask'.
   V2 shows only 'Watch the video and provide feedback.' and tells the cost of 'Not now' afterwards
   (worker_flow.jsx:119-121, 149). The PM's own job ask stays in the AskCard (section 37).

   DAY_COPY  the day's deadline lines, one string per state, so AskCard, RunCard, WorkerCard, this
             card, Activity, the inbox and the Stop confirm say the same words (proposed copy):
             notCounted, stopped(by), failed(by), expiredTitle, expired(by), stopAsk(paidJob, by).
             by is the record's deadline ('9 pm' when absent), always written 'by 9 pm'. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const DO = {
    watch: ['eye', 'Watch the whole video', 'Watched the whole video'],
    like: ['thumb-up', 'Like it', 'Liked it'],
    comment: ['chat', 'Post this comment', 'Posted this comment'],
    subscribe: ['bell', 'Subscribe to the channel', 'Subscribed to the channel'],
  };
  let seq = 0;
  // One skip label everywhere (this card, section 52, R06): the action, then what it costs.
  const SKIP = 'Skip: today won’t count';
  const BY = function (by) { return by || '9 pm'; };
  const DAY_COPY = {
    notCounted: 'Today doesn’t count toward your 20 days.',
    stopped: function (by) { return 'Today doesn’t count yet. Run again by ' + BY(by) + '.'; },
    failed: function (by) { return 'Today doesn’t count yet. Try again by ' + BY(by) + '.'; },
    expiredTitle: 'No answer, job skipped',
    expired: function (by) { return 'No answer by ' + BY(by) + ', so I skipped the job.'; },
    stopAsk: function (paidJob, by) {
      return 'Stop now? ' + (paidJob ? 'The paid job won’t finish. ' : '') + 'Today counts only if you run again by ' + BY(by) + '.';
    },
  };

  function JobPreviewCard(props) {
    const job = props.job || K().WORKER_JOB || {};
    const v = job.video || { title: job.title, channel: job.channel, duration: job.duration, thumb: job.thumb };
    const app = (K().WORKER_APPS || []).find(function (a) { return a.id === (job.app || 'youtube'); }) || { name: 'YouTube', icon: 'youtube' };
    const state = props.mode === 'receipt' ? 'receipt' : (props.expired ? 'expired' : (props.waitingSince ? 'waiting' : 'ask'));
    const past = state === 'receipt';
    const by = props.expiresAt || '9 pm';
    const I = K().Icon;
    const B = K().Button;
    const T = K().StatusTick;
    const ic = (name, size) => (I ? <I name={name} size={size || 16} /> : null);
    const [id] = React.useState(function () { seq += 1; return 'v2-job-' + seq; });
    const verify = props.verify === undefined ? 'pending' : props.verify;
    const tick = past && verify && T ? <T status={verify} size={14} label /> : null;
    const back = past && props.ranOn !== 'ask' && B
      ? <B variant="quiet" size="md" icon="shield-check" onClick={props.onChangeMode}>Switch back to Always ask</B> : null;

    const head = {
      ask: [job.label || 'Paid job available', 'Just now'],
      waiting: [job.label || 'Paid job available', 'Since ' + props.waitingSince],
      expired: [DAY_COPY.expiredTitle, 'At ' + by],
      receipt: ['Paid job done', props.doneAt ? 'At ' + props.doneAt : null],
    }[state];

    return (
      <article className={cx('v2-job', 'v2-job--' + state)} aria-labelledby={id}>
        <header className="v2-job-head">
          {ic(app.icon)}
          <span className="v2-job-head-text" id={id}>{head[0]}</span>
          {head[1] ? <span className="v2-text-meta">{head[1]}</span> : null}
        </header>
        <div className="v2-job-body">
          <div className="v2-job-thumb">
            {v.thumb ? <img src={v.thumb} alt="" /> : ic('play', 24)}
            {v.duration ? <span className="v2-job-dur">{v.duration}</span> : null}
          </div>
          <div className="v2-job-video">
            <p className="v2-job-title">{v.title}</p>
            <p className="v2-job-channel">{v.channel} on {app.name}</p>
          </div>
          <ul className="v2-job-do" aria-label={past ? 'What I did' : 'What I’ll do'}>
            {(job.actions || []).map(function (a) {
              const d = DO[a];
              return d ? <li key={a}>{ic(d[0])}<span>{past ? d[2] : d[1]}</span></li> : null;
            })}
          </ul>
          {job.comment && (job.actions || []).indexOf('comment') >= 0 ? <blockquote className="v2-job-quote">{job.comment}</blockquote> : null}

          {state === 'ask' || state === 'waiting' ? (
            <React.Fragment>
              <p className="v2-job-consequence">{ic('clock')}<span>Answer by {by} or today won’t count.</span></p>
              <div className="v2-job-actions">
                {B ? <B variant="primary" size="md" full loading={props.taking} onClick={props.onTake}>Take this job</B> : null}
                {B ? <B variant="secondary" size="md" full disabled={props.taking} onClick={props.onSkip}>{SKIP}</B> : null}
                {B ? <B variant="quiet" size="md" full icon="zap" disabled={props.taking} onClick={props.onStopAsking}>Switch {app.name} to Automatic</B> : null}
              </div>
            </React.Fragment>
          ) : null}

          {state === 'expired' ? (
            <p className="v2-job-consequence">{T ? <T status="notcounted" size={14} /> : null}<span>{DAY_COPY.expired(by) + ' ' + DAY_COPY.notCounted}</span></p>
          ) : null}

          {state === 'receipt' && (tick || back) ? <div className="v2-job-foot">{tick}{back}</div> : null}
        </div>
      </article>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { JobPreviewCard, DAY_COPY });
})();
