---
name: split-screen-panels
description: Pattern for 9:16 short-form videos where a large motion graphic (data panel, rule card, stat grid, dashboard mock) needs to coexist with a talking-head avatar without covering the face. Use when the overlay would otherwise hide the speaker â€” switch the face to TOP_HALF mode and let the panel occupy the full bottom half. Invoke alongside /short-form-video or /hyperframes whenever a scene's main visual is a full-width card/panel taller than ~600px. NO usar para overlays chicos (chip/badge) ni hero/CTA donde la cara domina â€” eso es short-form-video FULL/PIP.
---

# Split-Screen Panels (9:16 vertical)

Pattern captured from `_maria-escalar-campaÃ±a`. Extends `/short-form-video`: same 4-layer scaffold (ambient-bg + face + scenes + captions), but introduces a **third face-mode (TOP_HALF)** so a full-width motion graphic can occupy the bottom half of the canvas while the avatar stays visible above it.

**Always invoke `/short-form-video` first.** This skill only adds the split-screen mode + panel recipe on top of that baseline.

## When this skill fires

- Scene's main visual is a **card/panel taller than ~600px** â€” it would cover the speaker's face in PIP-BL and feel noisy in FULL.
- Mock dashboard / data panel (Meta Ads Manager, GA4, Stripe, CRM screenshots styled as HTML).
- **Rule card / hero number card** (e.g. "REGLA 20/3-4", "â‚¬497", "x3.4 ROAS") with typography â‰¥180px.
- Stat grid or KPI table that fills more than ~40% of the vertical space.
- Alert/warning panel where the content is the hero, not a floating stamp.

## When NOT to use split

- **Small overlay** (chip, pill, stamp, single icon, badge): keep it floating, no split.
- **Center-stage diagrams that aren't cards** (concentric circles, kinetic typography hero, flowcharts drawn in SVG): use `PIP_BL` so the diagram owns the stage.
- **Hook or CTA scenes** where the avatar should dominate: stay in `FULL`.
- **Data chart that lives inside a panel you already showed in split**: stay in split (continuity), don't revert to FULL mid-panel.

## The pattern in one sentence

> Avatar centered in the top 1080Ã—960, panel filling the bottom 1080Ã—960, face transition `expo.inOut` 0.45s starting **0.20s before** the scene's `data-start`.

## The 3 face modes (copy-pasteable)

These constants assume the face video source is **1080Ã—1920 native vertical** (not the landscape 1920Ã—1080 assumed by the default `/short-form-video` playbook). If your source is landscape, use the BOTTOM/FULLSCREEN modes from `/short-form-video` instead.

```js
// Face wrapper sized at source native (1080Ã—1920). transform-origin: 0 0.
const FULL     = { x: 0,  y: 0,    scale: 1.0  }; // full canvas, avatar dominates
const TOP_HALF = { x: 0,  y: -480, scale: 1.0  }; // avatar centered in top 1080Ã—960
const PIP_BL   = { x: 60, y: 1248, scale: 0.35 }; // corner insert, bottom-left
const MODE_DUR = 0.45;
```

### Why `y: -480` for TOP_HALF

Source is 1080Ã—1920. The avatar's face sits around the vertical center (yâ‰ˆ960 in source space). Moving the wrapper `y: -480` shifts the face center to y=480 in canvas space â€” i.e. centered inside the top 960px half. The bottom 960px is then free for the panel.

**If the face ends up too high or too low** in the top half (depends on how the avatar was framed in the source):
- Face too low â†’ push wrapper further up: `y: -520` to `y: -560`
- Face too high / cropped at top â†’ relax: `y: -420` to `y: -440`

Preview ONE frame of `TOP_HALF` against the actual source video before committing the constant (individual composition URL in Studio is fastest).

## Panel CSS (canonical bottom-half)

```css
.panel-bottom-half {
  position: absolute;
  left: 0;
  right: 0;
  top: 960px;
  height: 960px;
  padding: 44px 56px 48px 56px;
  box-sizing: border-box;
  background: var(--brand-surface);          /* beige / off-white */
  border-top: 4px solid var(--brand-accent); /* ink or rojo â€” the seam */
  border-radius: 36px 36px 0 0;              /* only top corners */
  box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.55); /* shadow shoots UP, into the face half */
  opacity: 0;
  transform: translateY(120px);              /* starts 120px below, slides up */
  will-change: transform, opacity;
  overflow: hidden;                          /* clip any inner animation bleed */
}
```

Rationale â€” each line is load-bearing:
- `top: 960, height: 960` â€” exact bottom half at 1080Ã—1920, no math needed.
- `border-top only` + `border-radius: 36px 36px 0 0` â€” the panel reads as a card rising from the bottom, not a floating rectangle.
- `box-shadow: 0 -16px 40px` (negative Y) â€” shadow projects UP into the face half, giving the seam depth without breaking the top edge.
- `opacity: 0` + `transform: translateY(120px)` â€” the entrance state; timeline animates to `{ opacity: 1, y: 0 }`.
- `will-change: transform, opacity` â€” keeps the entrance smooth on the render path.
- `overflow: hidden` â€” animated inner elements (chart paths, count-ups) can't spill onto the face.

## Master-timeline choreography

The face transition fires **before** the new scene lands, so by the time the panel slides up, the avatar is already in TOP_HALF. Buffer: **0.20s**.

```js
// In index.html master timeline. Each entry drives a face-mode change when
// transitioning between scenes.
const MODE_DUR = 0.45;

// Scene N (FULL) â†’ Scene N+1 (split): drop face to TOP_HALF 0.20s early
mainTl.to(
  "#face-wrapper",
  { ...TOP_HALF, duration: MODE_DUR, ease: "expo.inOut" },
  sceneNextStart - 0.20,
);

// Split scene â†’ PIP scene: shrink face to corner + fade in PIP frame 0.10s later
mainTl.to(
  "#face-wrapper",
  { ...PIP_BL, duration: MODE_DUR, ease: "expo.inOut" },
  scenePipStart - 0.20,
);
mainTl.to(
  "#face-pip-frame",
  { opacity: 1, duration: 0.35, ease: "power2.out" },
  scenePipStart - 0.10,
);

// PIP â†’ next split: fade PIP frame out first, THEN ease face back to TOP_HALF
mainTl.to(
  "#face-pip-frame",
  { opacity: 0, duration: 0.35, ease: "power2.out" },
  sceneNextStart - 0.30,
);
mainTl.to(
  "#face-wrapper",
  { ...TOP_HALF, duration: MODE_DUR, ease: "expo.inOut" },
  sceneNextStart - 0.20,
);

// Split â†’ FULL (usually for the CTA): same 0.20s buffer
mainTl.to(
  "#face-wrapper",
  { ...FULL, duration: MODE_DUR, ease: "expo.inOut" },
  sceneCtaStart - 0.20,
);
```

See `references/top-half-choreography.md` for the full multi-scene chain and race-condition details.

## Panel entrance (scene-local timeline)

Inside each scene's own composition file, kick the panel entrance **~0.10â€“0.15s** into the scene so it lands AFTER the face-mode transition has settled:

```js
tl.to(
  scope + "#panel",
  { opacity: 1, y: 0, duration: 0.60, ease: "power3.out" },
  0.10,
);
```

Use `power3.out` (not `back.out`) â€” the panel is slab-like, a snappy linear-ish ease feels more substantial than a bouncy overshoot.

## Integration with other skills

- `/short-form-video` â†’ **always invoke first.** Owns the 4-layer scaffold, karaoke captions, ambient-bg, seam-treatment, lint/render/verify gates. This skill ADDS the TOP_HALF mode; it doesn't replace anything.
- `/hyperframes` â†’ framework rules (`window.__timelines`, `data-*`, composition registration). Non-negotiable.
- `/gsap` â†’ animation reference when tuning a new panel entrance or inner content stagger.

## Reference compositions

Everything here is extracted from `_maria-escalar-campaÃ±a`:

- **Master timeline with 4 transitions (FULL â†’ TOP_HALF â†’ PIP_BL â†’ TOP_HALF â†’ FULL):** `video-projects/_maria-escalar-campaÃ±a/index.html`
- **Dashboard-style panel (Meta Ads Manager mock, KPIs + chart):** `video-projects/_maria-escalar-campaÃ±a/compositions/scene2-setup.html`
- **Crash variant of the same panel (red chart nosedive + stamps):** `video-projects/_maria-escalar-campaÃ±a/compositions/scene3-golpe.html`
- **Rule card with hero number (REGLA 20/3-4):** `video-projects/_maria-escalar-campaÃ±a/compositions/scene6-regla.html`
- **PIP-BL with center-stage SVG diagram (contrast â€” when NOT to use split):** `video-projects/_maria-escalar-campaÃ±a/compositions/scene4-insight.html`

## References in this skill

- `references/top-half-choreography.md` â€” full master-timeline chain for multi-scene choreographies (FULL â†’ TOP_HALF â†’ PIP_BL â†’ TOP_HALF â†’ FULL), buffers, race conditions, how PIP frame opacity interacts with the wrapper transform.
- `references/panel-css-recipe.md` â€” three brand-neutral panel variants (dashboard, rule card, alert) with complete CSS tokenized to `var(--brand-*)` for any palette.

## Memory pointer

If this ships as a repeatable pattern across multiple shorts, save a feedback memory: **"Split-screen (TOP_HALF + bottom-half panel) is for motion graphics >600px tall. Small overlays stay floating. Center-stage non-card diagrams go PIP_BL."** Reason: the mistake is defaulting to FULL (face covers panel) or to PIP_BL (tiny face, panel feels empty). Save the rule so future shorts skip the iteration cycle.
