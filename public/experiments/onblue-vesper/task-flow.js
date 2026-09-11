// THE ECONOMY, RUNNING, as a terminal session. The illustration is a dark
// terminal with the agent reel underneath it, and this drives the terminal:
//
//   1. the command types into the bar under the title bar
//   2. onBlue takes it: the mark turns while it looks for an agent
//   3. it names the agent it assigned, and the mark stops turning
//   4. each step opens as running and closes as ok, the way a terminal
//      reports work: one line per step, in place, in order
//   5. it closes on how long the job took
//   6. the three outcomes print as the last block
//   7. a long beat, the screen clears, the next command starts
//
// ONE STREAM, TOP TO BOTTOM. It ran in three columns while the panel was
// cropped to a shallow strip and had no height to run a list down. Three
// columns also put the outcome level with the command, which says the two
// happened at once; a terminal says they happened in order.
//
// ONBLUE OPENS THE BLOCK AND EVERYTHING ELSE IS INDENTED UNDER IT. onBlue is
// what does the work here: it reads the job, picks the agent and reports back.
// A line that sat at the same indent as the command would read as the command's
// peer; under onBlue's mark it reads as onBlue's doing, which is the claim.
//
// WHY THE ASSIGNMENT COMES BEFORE THE STEPS: the agent has to be known before
// there is anything to report. Steps that arrive before the agent does are
// nobody's steps.
//
// WHY THE TASKS NAME THEIR AGENT: the runtime must assign the agent that really
// does that kind of work, so the pairing is data. The OUTCOMES are not, because
// every finished job produces all three: the job is done, its owner is paid,
// the agent is worth more.
//
// TIMINGS ARE DELIBERATELY SLOW. This runs unattended in a hero and a reader
// meeting it for the first time has to be able to follow every line without
// replaying it. Every delay here is set for a person reading at leisure, not
// for a demo that wants to look fast. Change one and change it upward.
//
// NOTHING HERE MEASURES OR SETS A WIDTH. The window is a fixed size and the
// lines are `white-space: pre` and clipped, so a long step name is cut off
// rather than allowed to widen the terminal or wrap the lines above it.

const TASKS = [
  { agent: 'creator-agent', kind: 'digital ai',
    text: 'generate 12 ad variations',
    log: ['reading brand kit', 'drafting concepts', 'rendering 1080x1350', 'scheduling posts'] },
  { agent: 'creator-agent', kind: 'digital ai',
    text: 'cut a 30s vertical edit',
    log: ['pulling source footage', 'cutting to beat', 'burning captions', 'exporting 9:16'] },
  { agent: 'test-agent', kind: 'digital ai',
    text: 'test checkout on android 14',
    log: ['installing build', 'running 214 checks', 'capturing traces', 'filing 3 issues'] },
  { agent: 'test-agent', kind: 'digital ai',
    text: 'find crashes in build 4.2',
    log: ['replaying 40 sessions', 'symbolicating stacks', 'grouping by cause', 'filing 2 issues'] },
  { agent: 'cleaning-robot', kind: 'physical ai',
    text: 'clean floor 3 at 18:00',
    log: ['mapping the floor', 'docking sensors', 'cleaning 240 sq m', 'writing report'] },
  { agent: 'cleaning-robot', kind: 'physical ai',
    text: 'sweep aisle 7, then report',
    log: ['routing to aisle 7', 'sweeping 62 sq m', 'checking spills', 'writing report'] },
  { agent: 'creator-agent', kind: 'digital ai',
    text: 'draft 5 launch posts',
    log: ['reading the brief', 'drafting 5 posts', 'checking the voice', 'queueing for review'] },
  { agent: 'test-agent', kind: 'digital ai',
    text: 'regression pass before release',
    log: ['restoring fixtures', 'running 512 checks', 'diffing snapshots', 'signing the build'] },
  { agent: 'growth-agent', kind: 'digital ai',
    text: 'grow the launch list this week',
    log: ['reading last week', 'picking 3 channels', 'running the tests', 'writing the readout'] },
  { agent: 'growth-agent', kind: 'digital ai',
    text: 'find where signups drop off',
    log: ['reading 9 funnels', 'ranking the leaks', 'drafting 2 fixes', 'queueing for review'] },
  { agent: 'research-agent', kind: 'digital ai',
    text: 'compare the top 5 competitors',
    log: ['reading 40 sources', 'checking the claims', 'building the table', 'writing the brief'] },
  { agent: 'robotaxi', kind: 'physical ai',
    text: 'take the 7:40 airport run',
    log: ['planning the route', 'picking up at gate 2', 'driving 24 km', 'closing the trip'] },
  { agent: 'warehouse-robot', kind: 'physical ai',
    text: 'move 40 pallets to bay 4',
    log: ['reading the manifest', 'lifting 40 pallets', 'stacking in bay 4', 'writing report'] },
  { agent: 'delivery-drone', kind: 'physical ai',
    text: 'deliver 6 parcels on route 12',
    log: ['loading 6 parcels', 'clearing the airspace', 'flying 11 km', 'confirming 6 drops'] },
];

// EACH OUTCOME CARRIES ITS OWN GLYPH AND ITS OWN COLOUR. Three lines that
// differed only by their words all opened with the same mark, and the mark is
// the fastest thing on a line to read.
const OUTCOMES = [
  { ico: 'done', text: 'job gets done', colour: '#62d29c' },
  { ico: 'earn', text: 'owner earns', colour: '#6f9dff' },
  { ico: 'grow', text: 'agent grows', colour: '#ef9a4a' },
];

const rand = (n) => Math.floor(Math.random() * n);

export function createTaskFlow(card) {
  // THE ONE ELEMENT THIS TOUCHES IS CHECKED HERE, and that check is the point.
  // A null slipped through once: an element was removed from the markup while
  // the sequencer still wrote to it, and because that call sat on the first
  // line of run(), nothing in the card ever started. Silent, and
  // indistinguishable from a card that simply renders static.
  const feed = card.querySelector('.term-feed');
  const bar = card.querySelector('.ti');
  const barText = card.querySelector('.ti-text');
  const icons = card.querySelector('#flow-icons');
  if (!feed || !bar || !barText || !icons) return null;

  const icon = (name) => {
    const src = icons.content.querySelector('[data-ico="' + name + '"]');
    return src ? src.cloneNode(true) : null;
  };

  let timers = [];
  let intervals = [];
  let stopped = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const every = (ms, fn) => { const id = setInterval(fn, ms); intervals.push(id); return id; };
  // TIMEOUTS AND INTERVALS ARE TRACKED SEPARATELY: they are cancelled by
  // different functions, and clearTimeout on an interval id is a silent no-op
  // that would leave a writer running against the same element every cycle.
  const clearAll = () => {
    timers.forEach(clearTimeout);
    intervals.forEach(clearInterval);
    timers = [];
    intervals = [];
  };

  const span = (text, cls) => {
    const el = document.createElement('span');
    if (cls) el.className = cls;
    el.textContent = text;
    return el;
  };

  // a line, appended at the foot of the stream
  function line(cls, parts) {
    const el = document.createElement('div');
    el.className = 'tl' + (cls ? ' ' + cls : '');
    parts.forEach((p) => el.append(typeof p === 'string' ? document.createTextNode(p) : p));
    feed.append(el);
    return el;
  }
  // a blank row between stages, so the stream has paragraphs rather than
  // twelve lines of the same weight
  const gap = () => {
    const el = document.createElement('div');
    el.className = 'tl-gap';
    feed.append(el);
  };

  // ONE CHARACTER A TICK, and slow, INTO THE BAR AT THE FOOT. This is the only
  // line the reader has to read before anything else happens, so it is paced to
  // be read rather than to look impressive. The bar empties when the command is
  // sent and the command becomes the first line of the stream: the bar is the
  // live edge, the stream is what has already happened.
  function type(str, done) {
    let i = 0;
    barText.textContent = '';
    bar.classList.add('is-empty');
    const tick = every(52, () => {
      i += 1;
      barText.textContent = str.slice(0, i);
      bar.classList.remove('is-empty');
      if (i >= str.length) {
        clearInterval(tick);
        at(900, () => {
          barText.textContent = '';
          bar.classList.add('is-empty');
          line('tl-cmd', [span('$', 'p'), ' ' + str]);
          done();
        });
      }
    });
  }

  let index = rand(TASKS.length);

  function run(task) {
    feed.replaceChildren();
    barText.textContent = '';
    bar.classList.add('is-empty');

    type(task.text, () => {
      at(700, () => {
        // ONBLUE FIRST. The mark turns while it reads the job and looks for
        // somebody to do it, and stops the moment it has chosen.
        const blue = line('tl-blue', [icon('spark'), span('onblue  matching agent')]);

        at(2600, () => {
          blue.classList.add('is-done');
          line('tl-pick tl-in', ['assigned  ', task.agent, '  [', task.kind, ']']);
          gap();

          // EACH STEP OPENS AS RUNNING AND CLOSES AS OK, in place. A step that
          // only ever appears finished never shows the work happening.
          let i = 0;
          const step = () => {
            if (i < task.log.length) {
              const mark = span('[ .. ]', 'd');
              line('tl-in', [mark, ' ' + task.log[i]]);
              i += 1;
              at(1100, () => {
                mark.className = 'g';
                mark.textContent = '[ ok ]';
                at(400, step);
              });
              return;
            }
            // a plausible duration rather than a fixed one, so the same task
            // does not report the same time every cycle
            line('tl-sys tl-in', ['done in ' + (2 + rand(7)) + 'm ' + (10 + rand(48)) + 's']);
            gap();

            // all three, in turn: a finished job is done, paid and banked
            OUTCOMES.forEach((o, n) => at(700 + n * 1200, () => {
              const el = line('tl-out tl-in', [icon(o.ico), span(o.text)]);
              el.style.setProperty('--oc', o.colour);
            }));
            at(700 + OUTCOMES.length * 1200 + 4200, next);
          };
          at(900, step);
        });
      });
    });
  }

  function next() {
    if (stopped) return;
    index = (index + 1) % TASKS.length;
    clearAll();
    run(TASKS[index]);
  }

  // REDUCED MOTION gets the END state, not a frozen start: a command, the agent
  // it was assigned to, every step closed and all three outcomes, so the still
  // screen says what the session says.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const task = TASKS[index];
    barText.textContent = '';
    bar.classList.add('is-empty');
    line('tl-cmd', [span('$', 'p'), ' ' + task.text]);
    const blue = line('tl-blue', [icon('spark'), span('onblue  matching agent')]);
    blue.classList.add('is-done');
    line('tl-pick tl-in', ['assigned  ', task.agent, '  [', task.kind, ']']);
    gap();
    task.log.forEach((l) => line('tl-in', [span('[ ok ]', 'g'), ' ' + l]));
    line('tl-sys tl-in', ['done in 4m 12s']);
    gap();
    OUTCOMES.forEach((o) => {
      const el = line('tl-out tl-in', [icon(o.ico), span(o.text)]);
      el.style.setProperty('--oc', o.colour);
    });
    return { destroy() {} };
  }

  // only runs while the card is on screen: an off-screen sequence is timers and
  // layout work nobody is watching
  let live = false;
  const io = new IntersectionObserver((entries) => {
    const visible = entries[entries.length - 1].isIntersecting;
    if (visible && !live) { live = true; run(TASKS[index]); }
    else if (!visible && live) { live = false; clearAll(); }
  }, { threshold: 0.15 });
  io.observe(card);

  return {
    destroy() {
      stopped = true;
      clearAll();
      io.disconnect();
    },
  };
}
