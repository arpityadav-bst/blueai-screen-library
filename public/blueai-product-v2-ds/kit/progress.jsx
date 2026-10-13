/* BlueAI Product V2 Design System: progress and loading parts on window.V2Kit.
   ProgressBar (an amount done), Spinner (working, no shape yet), Skeleton (a placeholder in the
   shape of what arrives). Styles live in kit/feedback.css; the loops are kit/motion.css's
   .v2-anim-indet, .v2-anim-spin and .v2-anim-shimmer, so the one global reduced-motion rule covers
   them (the guide forces it with .v2-reduced-motion). Spec: design-md/20-progress-loading.md. */
(function () {
  const { useState, useEffect, useId } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function Ico({ name, size }) {
    const Icon = window.V2Kit && window.V2Kit.Icon;
    return Icon ? <Icon name={name} size={size || 16} /> : null;
  }

  /* ProgressBar: label row (name left, value right in tabular figures), a sunken rail, a fill.
     Determinate fills blue and turns green at max (reached); error freezes red; paused freezes
     grey; indeterminate slides a 40% segment (V2's 38% idea on the shared v2-indet loop).
     role=progressbar carries the value text. */
  function ProgressBar(props) {
    const { value, max, indeterminate, tone, size, label, valueText, paused, error, className } = props;
    const labelId = useId();
    const m = max > 0 ? max : 100;
    const v = Math.max(0, Math.min(m, Number(value) || 0));
    const pct = (v / m) * 100;
    const state = error ? 'error' : (paused ? 'paused' : (indeterminate ? 'indet'
      : (v >= m || tone === 'success' ? 'success' : 'blue')));
    const shown = valueText != null ? valueText : (indeterminate ? null : Math.round(pct) + '%');
    const extra = error ? 'failed' : (paused ? 'paused' : null);
    const spoken = [shown, extra && String(shown || '').toLowerCase().indexOf(extra) < 0 ? extra : null].filter(Boolean).join(', ');
    return (
      <div className={cx('v2-progress', 'v2-progress--' + (size === 4 ? 4 : 6), 'v2-progress--' + state, className)}>
        {label || shown ? (
          <div className="v2-progress-head">
            {label ? <span className="v2-progress-label" id={labelId}>{label}</span> : <span />}
            {shown ? <span className="v2-progress-value" aria-hidden="true">{shown}</span> : null}
          </div>
        ) : null}
        <div className="v2-progress-rail" role="progressbar"
          aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : props['aria-label']}
          aria-valuemin={0} aria-valuemax={m} aria-valuenow={indeterminate ? undefined : v}
          aria-valuetext={spoken || undefined}>
          <span className={cx('v2-progress-fill', indeterminate && 'v2-anim-indet')} style={indeterminate ? undefined : { width: pct + '%' }} />
        </div>
      </div>
    );
  }

  /* Spinner: one ring in currentColor at 12, 16 or 32. It waits (300ms by default) before it
     appears, so fast work never flashes, and holds its space meanwhile. done swaps it for a
     check in success green, so a finished step never reads as stuck. */
  const SPIN = [12, 16, 32];
  function Spinner({ size, label, delay, done, variant, className }) {
    const s = SPIN.indexOf(size) >= 0 ? size : 16;
    const wait = delay == null ? 300 : delay;
    const [shown, setShown] = useState(wait <= 0);
    useEffect(function () {
      if (wait <= 0) { setShown(true); return undefined; }
      setShown(false);
      const t = setTimeout(function () { setShown(true); }, wait);
      return function () { clearTimeout(t); };
    }, [wait]);
    const visible = shown || done;
    return (
      <span className={cx('v2-spinner', 'v2-spinner--' + s, variant === 'on-color' && 'v2-spinner--on-color',
        done && 'v2-spinner--done', !visible && 'is-waiting', className)}
        role={label ? 'status' : undefined} aria-hidden={label ? undefined : true}>
        {done ? <Ico name="check" size={s === 32 ? 24 : 16} /> : null}
        {!done && visible ? (
          <svg className="v2-anim-spin" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <circle className="v2-spinner-track" cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle className="v2-spinner-arc" cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeDasharray="10.2 30.6" />
          </svg>
        ) : null}
        {label && visible ? <span className="v2-sr-only">{done ? 'Done' : label}</span> : null}
      </span>
    );
  }

  /* Skeleton: sunken shapes with the shared shimmer, still under reduced motion. Compose them into the
     shape of what will arrive; a screen owns its composite (the worker home's lives in Home). */
  const SHAPES = ['line', 'title', 'circle', 'rect'];
  function dim(x) { return typeof x === 'number' ? x + 'px' : x; }
  function Skeleton({ shape, width, height, lines, className }) {
    if (lines > 1) {
      const rows = [];
      for (let i = 0; i < lines; i++) {
        rows.push(<span key={i} className="v2-skel v2-skel--line v2-anim-shimmer" style={i === lines - 1 ? { width: '60%' } : undefined} />);
      }
      return <span className={cx('v2-skel-lines', className)} aria-hidden="true">{rows}</span>;
    }
    const sh = SHAPES.indexOf(shape) >= 0 ? shape : 'line';
    const style = {};
    if (width != null) style.width = dim(width);
    if (height != null) style.height = dim(height);
    else if (sh === 'circle' && width != null) style.height = dim(width);
    return <span className={cx('v2-skel', 'v2-skel--' + sh, 'v2-anim-shimmer', className)} style={style} aria-hidden="true" />;
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { ProgressBar, Spinner, Skeleton });
})();
