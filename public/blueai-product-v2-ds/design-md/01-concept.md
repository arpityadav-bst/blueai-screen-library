## 01 The product concept

**Status:** Meta (no parts).

**Why:** The frame every decision in this system is judged against. A part that does not serve it does not get built.

### The concept

BlueAI is a paid worker that lives on the partner's Windows PC. A partner is accepted on the onBlue Agentic site, installs BlueAI, signs in with the account they applied with, sets the worker up once in a short conversation, and from then on the worker runs once a day on its own: it warms up the partner's YouTube account (Instagram next), checks the jobs board, takes a paid job (asking first on Always ask, on its own on Automatic), and submits it.

Every successful day is checked within a day: one tick while pending, two ticks once verified. Each verified day counts toward a 20-day program that ends on Nov 1, with cash out on the site's dashboard. AI credits, granted every day, are the worker's fuel, not money.

So the product is not a chat assistant with a worker bolted on. It is a small, quiet control room for an agent acting on the partner's own accounts.

### The partner journey

Site, app daily, site. The app is the middle of a loop, so it has to look and speak like the two ends.

1. **The site (onBlue Agentic):** the partner applies and is accepted, then installs BlueAI from the dashboard link.
2. **The app, every day:** signs in with the account they applied with, sets the worker up once, then the worker runs daily on its own. Each day shows one tick while pending, two once verified.
3. **The site again (the dashboard):** days and money read the same as in the app; cash out happens here, never in the app.

### The product's three jobs

Everything else (chat, settings, credits) serves these. A feature that serves none of them needs a reason before it gets a screen.

| Job | Where the system does it |
|---|---|
| Show what the worker is doing today and whether the day counts. | 57 Home, 42 Worker card, 36 Run card, 43 Program progress, 58 Activity |
| Keep the partner in control: consent per app, pause, disconnect, see exactly what was posted. | 46 Always ask and Automatic, 45 Job preview, 62 Worker settings, 63 Connected apps, 59 Run detail |
| Make money and days read the same in the app and on the site. | 41 The Worker record, 44 Day done, 47 Credits balance, 70 Copy and voice |

### The numbers, as V2 has them today

The system reads these from one Worker record (section 41), never from a second constant.

| What | V2 today | Source |
|---|---|---|
| Program | 20 days, ends Nov 1, $1 per verified day, $10 day-20 bonus | `worker_day_done.jsx:38` |
| Money rule note | $1 credited at the end of each successful day (under review) | `worker_day_done.jsx:5` |
| Cash out | From $10, after the period ends; under $10 the balance carries over (the site's dashboard says the same: "Payment minimum: $10") | `worker_day_done.jsx:6`; `onblue/apply.html:1360, 2292-2293` |
| The site's program | At least 20 days each month to earn $30 | `onblue/apply.html:1285` |
| AI credits | 2,000 granted every day | `index.html:720` |
| Modes | Always ask and Automatic, per app | `blueai/worker_flow.jsx:78` |
| Ticks | Pending verification, then verified | `blueai/worker_day_done.jsx:97` |

The money model is decision D3: the app's $1 a day plus a $10 bonus, or the site's $30 for 20 days. Until the PM picks one, the system shows days, not dollars (section 73). The $10 cash-out minimum holds under both, so it is stated wherever cash out is: a line that says cash out is open is shown only when the site says this partner can cash out (`cashOutOpen` true, section 41); its under-the-minimum answer (false) gets the site's own words, and while it has not answered (null) the line only says where to look: 'See your balance and cash out on Earnings.'
