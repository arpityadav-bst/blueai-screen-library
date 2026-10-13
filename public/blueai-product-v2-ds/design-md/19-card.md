## 19 Card and stat card

**Status:** Card: Changed from V2. StatCard: Changed from V2.

**Why:** BlueAI is a quiet control room: the surfaces should separate content and get out of the way, the way the onBlue site's 1px lines do; the site also adds a faint resting cast, which the product drops (section 02, P6). V2's in-flow cards carry seven shadow strengths over a different line on each (settings.jsx:25, profile.jsx:30, index.html:441, worker_day_done.jsx:176), and its one important figure, the credits balance, is 54/800 brand gradient (index.html:527). The partner returns to the site to cash out; the same figure should look the same in both places.

### Card (Changed from V2)

**Purpose.** The one surface for grouped content: a settings group, the worker card, a list of rows, a run. Static unless the whole card goes somewhere.

**Anatomy.** `--v2-surface`, 1px `--v2-line`, radius 16 (`--v2-radius-lg`, the site's card radius), padding 16, no shadow (`--v2-shadow-0`).

**Variants.** Static (div, never answers hover). Pressable (a real button or link; the line firms up on hover). Inset panel (the panel step inside a card: `--v2-surface-panel`, `--v2-line-hair`, radius 10, padding 12).

**Sizes.** Padding md 16 (default), sm 12, none (for a list of rows; the card clips them to its radius).

**States.**
- Static: V2 Settings tab (BlueStacks, Telegram cards).
- Pressable hover: line to `--v2-line-hover`. Pressed: a `--v2-wash-press` layer. Focus-visible: 2px blue outline, offset 2. All new (V2 cards are not pressable).

**Props.** `Card { as = 'div' | 'button' | 'a', pressable, inset, padding = 'md' | 'sm' | 'none', href, external, onClick, className, children }`. `onClick` or `pressable` makes a button; `href` makes a link.

**Motion.** Line colour `--v2-dur-1`. None under reduced motion.

**Accessibility.** A pressable card is a single button or link whose accessible name is its content; never put another control inside it. Static cards are not focusable.

**Responsive.** Full width of the content band (419 minus the 16 gutter each side). Stack 12 apart.

**Do / Don't.** Do stack cards 12 apart on `--v2-canvas`. Do make the whole card the target when it opens one place. Don't add a shadow to anything in the flow. Don't nest cards: use the inset panel. Don't add hover to a static card.

### StatCard (Changed from V2)

**Purpose.** One figure that matters, with the words that make it mean something: AI credits left today, your 20 days, the next run. Credits are an allowance and money is a figure; both stay in ink. Green means a state was reached.

**Anatomy.** A Card containing:
1. Label: mini-title 13/600 ink, sentence case, 0.02em (`.v2-text-mini-title`; the site's `.mini-title`, onblue.css:1935-1942). One label style per card (the site's mini-title rule, onblue/apply.html:1358).
2. Figure: optional icon (the credits glyph), value 40/600 `--v2-ink`, tabular, `--v2-tracking-display`; optional unit 14/500 `--v2-ink-3`.
3. Context: one line, 13 `--v2-ink-3`; figures inside it bold ink ("**13** to go").
4. Action (optional): one link or quiet button (Earnings opens the site).

**Variants.** Display (figure 40). Compact (figure 20, `--v2-tracking-title`, tighter gaps).

**Sizes.** Display and compact; full width.

**States.**
- Value: V2 opens the AI Credits screen from the credits pill (`?start=worker`).
- Zero: same size as any value; the Banner above says why. V2 shrinks the figure to 38 (`?start=worker&credits=0`, then the pill).
- Loading: label stays, figure and context become skeletons, `aria-busy`. New.
- Replaced (own key): the figure becomes "Running on your own key" with V2's line "No BlueAI credits are consumed while this is on." (index.html:482-485; Preview "Own key: On").
- Compact: V2's EarningsStrip (`?day=returning`).

**Props.** `StatCard { label, value (number formats as 2,000), unit, context, action, icon, loading, size = 'display' | 'compact', className }`, plus any Card prop.

**Motion.** None. Loading uses the shared shimmer.

**Accessibility.** Reads in order: label, figure, unit, context. Figures are text, never images. Context is 6.0:1.

**Responsive.** Left-aligned; the figure never wraps. Long text values (own key) use compact.

**Do / Don't.** Do keep one figure per card. Do keep the figure's size at zero. Do say credits as "left today". Don't paint figures in the gradient or green. Don't use two label styles in one card. Don't say "earn" or "balance" for credits.
