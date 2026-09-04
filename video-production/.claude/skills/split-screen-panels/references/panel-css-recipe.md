# Panel CSS â€” three variants

Brand-neutral recipes. Tokenized to `var(--brand-*)` so they drop into any palette. Each variant shares the same geometry (top: 960, height: 960, border-top only, radius only on top corners, shadow projecting up) â€” they differ in surface color, border accent, and typography scale.

## Tokens expected

```css
/* In your brand tokens file or at :root */
:root {
  --brand-ink:     #14372E; /* deepest color, usually the canvas background */
  --brand-accent:  #FB4B2D; /* primary accent (warning, CTA) */
  --brand-surface: #EFEAD5; /* panel background, off-white/beige */
  --brand-hot:     #FB4B2D; /* alert / high-energy */
  --brand-cool:    #D4E6AE; /* positive / calm */
}
```

Replace with your own token names if the codebase uses different variables.

---

## Variant A â€” Dashboard panel (data / mock UI)

Meta Ads Manager, GA4, Stripe dashboard mocks. Beige surface + ink border + KPI row.

```css
.panel-dashboard {
  position: absolute;
  left: 0;
  right: 0;
  top: 960px;
  height: 960px;
  padding: 44px 56px 48px 56px;
  box-sizing: border-box;
  background: var(--brand-surface);
  border-top: 4px solid var(--brand-ink);
  border-radius: 36px 36px 0 0;
  box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  gap: 28px;
  opacity: 0;
  transform: translateY(120px);
  will-change: transform, opacity;
  overflow: hidden;
}

.panel-dashboard .dash-head {
  display: flex;
  align-items: center;
  gap: 18px;
}
.panel-dashboard .dash-head .dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--brand-accent);
  box-shadow: 0 0 10px rgba(251, 75, 45, 0.6);
}
.panel-dashboard .dash-head .title {
  font-family: var(--brand-font-display);
  font-weight: 500;
  font-size: 38px;
  color: var(--brand-ink);
  flex: 1;
}
.panel-dashboard .dash-head .status {
  font-family: var(--brand-font-display);
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.14em;
  color: var(--brand-accent);
}

.panel-dashboard .kpis {
  display: flex;
  gap: 26px;
}
.panel-dashboard .kpi {
  flex: 1;
  background: var(--brand-surface);
  border: 2px solid rgba(20, 55, 46, 0.2); /* subtle tint of brand-ink */
  border-radius: 20px;
  padding: 18px 20px;
}
.panel-dashboard .kpi-label {
  font-family: var(--brand-font-display);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0.14em;
  color: var(--brand-ink);
  opacity: 0.7;
}
.panel-dashboard .kpi-val {
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 56px;
  color: var(--brand-ink);
  font-variant-numeric: tabular-nums;
  line-height: 1.05;
}
.panel-dashboard .kpi-val.hot { color: var(--brand-hot); }
```

HTML skeleton:

```html
<div class="panel-dashboard" id="panel">
  <div class="dash-head">
    <div class="dot"></div>
    <div class="title">Meta Ads Manager</div>
    <div class="status">â— 3 DÃAS DESPUÃ‰S</div>
  </div>

  <div class="chart-wrap"><!-- SVG chart goes here --></div>

  <div class="kpis">
    <div class="kpi">
      <div class="kpi-label">CPA</div>
      <div class="kpi-val"><span id="cpa-num">4.28</span>â‚¬</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">ROAS</div>
      <div class="kpi-val"><span id="roas-num">3.1</span></div>
    </div>
    <div class="kpi">
      <div class="kpi-label">IMPRESIONES</div>
      <div class="kpi-val"><span id="imp-num">124.5</span>K</div>
    </div>
  </div>
</div>
```

**When to use:** scene needs to feel like a real platform screenshot. Don't use a real screenshot â€” recreate with tokens so it lives in the brand palette.

---

## Variant B â€” Rule card (hero number / principle)

One big number, short label, "ni mÃ¡s Â· ni menos" tagline. The number is the hero â€” font-size â‰¥180px so it reads at thumbnail size.

```css
.panel-rule {
  position: absolute;
  left: 0;
  right: 0;
  top: 960px;
  height: 960px;
  padding: 54px 72px 60px 72px;
  box-sizing: border-box;
  background: var(--brand-surface);
  border-top: 4px solid var(--brand-accent); /* accent-colored seam, different from dashboard */
  border-radius: 36px 36px 0 0;
  box-shadow:
    0 -16px 40px rgba(0, 0, 0, 0.55),
    inset 0 0 0 2px rgba(20, 55, 46, 0.08); /* subtle inner tint â€” screenshot-y, not a pure slab */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  opacity: 0;
  transform: translateY(120px);
  will-change: transform, opacity;
  overflow: hidden;
}

.panel-rule .card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-rule .brand-pill {
  padding: 10px 22px;
  background: var(--brand-accent);
  color: var(--brand-surface);
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 28px;
  letter-spacing: 0.14em;
  border-radius: 999px;
}
.panel-rule .logo { width: 80px; height: 80px; }

.panel-rule .title-hero {
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 240px;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--brand-ink);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.panel-rule .title-hero .sep,
.panel-rule .title-hero .dash {
  color: var(--brand-accent);
}

.panel-rule .divider {
  height: 4px;
  background: var(--brand-accent);
  border-radius: 2px;
  margin: 4px 0;
  transform-origin: 0 50%;
  transform: scaleX(0); /* timeline scales to 1 */
}

.panel-rule .rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 64px;
  color: var(--brand-ink);
  text-align: center;
}
.panel-rule .row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  opacity: 0;
  transform: translateY(16px);
}
.panel-rule .row .tick,
.panel-rule .row .num {
  color: var(--brand-accent);
  font-variant-numeric: tabular-nums;
}
.panel-rule .footer {
  font-family: var(--brand-font-display);
  font-weight: 500;
  font-size: 36px;
  color: var(--brand-ink);
  opacity: 0;
  text-align: center;
  letter-spacing: 0.1em;
}
```

**When to use:** the payoff of the whole video is ONE principle/number. The card needs to hold for â‰¥3 seconds â€” use entrance stagger (title count-up â†’ divider scaleX â†’ rows pop) to keep motion alive during the hold.

---

## Variant C â€” Alert panel (high-energy warning)

Inverted palette: accent surface, brand-surface text. Use sparingly â€” max once per short.

```css
.panel-alert {
  position: absolute;
  left: 0;
  right: 0;
  top: 960px;
  height: 960px;
  padding: 54px 72px 60px 72px;
  box-sizing: border-box;
  background: var(--brand-hot);
  border-top: 4px solid var(--brand-surface);
  border-radius: 36px 36px 0 0;
  box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.70);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  opacity: 0;
  transform: translateY(120px);
  will-change: transform, opacity;
  overflow: hidden;
}

.panel-alert .alert-head {
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 44px;
  letter-spacing: 0.2em;
  color: var(--brand-surface);
  text-align: center;
  text-transform: uppercase;
  opacity: 0.85;
}

.panel-alert .alert-hero {
  font-family: var(--brand-font-display);
  font-weight: 900;
  font-size: 180px;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--brand-surface);
  text-align: center;
  text-shadow:
    -3px -3px 0 var(--brand-ink), 3px -3px 0 var(--brand-ink),
    -3px  3px 0 var(--brand-ink), 3px  3px 0 var(--brand-ink);
}

.panel-alert .alert-sub {
  font-family: var(--brand-font-display);
  font-weight: 500;
  font-size: 44px;
  color: var(--brand-surface);
  text-align: center;
  opacity: 0.85;
}
```

**When to use:** a "this is the problem" moment mid-video. One alert per short â€” if you use it twice, neither hits. Pair with a red caption up top, not inside the panel (overkill).

---

## Entrance tween (same for all three variants)

```js
// Inside the scene's local timeline.
tl.to(
  scope + "#panel",
  { opacity: 1, y: 0, duration: 0.60, ease: "power3.out" },
  0.10, // 0.10s into the scene â€” AFTER face-mode transition settles
);
```

Don't use `back.out` â€” the panel is a slab. `power3.out` is substantial, not springy.

## Exit tween (if the scene is not the last one)

Panels usually don't need an explicit exit â€” they get covered by the next scene (also a split panel) or replaced when the face transitions back to FULL. If you DO need an explicit exit:

```js
tl.to(
  scope + "#panel",
  { opacity: 0, y: 80, duration: 0.40, ease: "power2.in" },
  SLOT_DURATION - 0.45,
);
```

## Don'ts

- **Don't animate `.panel` width or height.** It's a slab. Inner content moves, the panel doesn't.
- **Don't apply `filter: blur()` to the panel to "de-emphasize" it** â€” filters on a panel with inner absolute-positioned SVGs cause GPU layer thrash. Use `opacity` or a scrim div.
- **Don't stack two split-panels at the same time.** If you need a "next panel" feel, either cross-fade them (old at z=1 fading to 0, new at z=2 fading to 1) or hard-cut via track-index â€” never both visible in their entrance states.
- **Don't forget `overflow: hidden`.** Inner count-ups, chart paths, stamps will leak onto the face half without it.

