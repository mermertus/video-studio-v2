---
name: long-form-video
description: Build and iterate long-form horizontal videos in Hyperframes â€” VSL Adscelerator (5â€“12 min), YouTube explainers, lessons, webinar trailers. Use when the user asks for "VSL", "video largo", "YouTube video", "explainer", "long-form", or when the target is a 1920x1080 composition with face video + dynamic motion graphics + multi-layer captions over many scenes. Encodes the full long-form playbook: scene-variety library, motion-card morphs, 3-layer caption coexistence, retention discipline, and Maria shrink/grow choreography distilled from the VSL Adscelerator v3 build. NO usar para shorts 9:16 (short-form-video) ni para video desde cero sin formato decidido (make-a-video).
---

# Long-Form Horizontal Video (Hyperframes)

Long-form = 1920x1080 horizontal, 5â€“12 min, face-cam (Maria) + dynamic motion graphics + 3-layer captions, structured around a thesis-driven narrative with high pattern variety to sustain retention.

**Always invoke `/hyperframes` first.** This skill sits on top of it â€” it does not replace the framework rules. The 11 motion philosophy laws (`MOTION_PHILOSOPHY.md`) and the data-attribute contract still apply.

## When this skill fires

- "Make/iterate a VSL", "video de ventas", "YouTube explainer", "video largo"
- Any 1920x1080 build longer than 2 minutes with a thesis + supporting scenes
- Versioning an existing long-form (re-cuts, audio re-record, copy variant)
- Adding a new scene type that should match the existing visual language
- Reviewing a draft for retention issues / static stretches

## North Star: the Adscelerator v3 build

Every concrete recipe in this skill is distilled from `video-projects/_maria_VSL-v3/compositions/full-pt1.html` â€” go there for live, working examples of every pattern. Search by `s<N>-` prefix to find each scene type. This skill is the index; that file is the source of truth.

## The playbook (high-level)

1. **Audio is source of truth.** Final voiceover comes first. Transcribe with `npx hyperframes transcribe`. Save as `captions-pt1.meta.json`.
2. **Mark beat structure on the transcript.** Identify thesis beats (~5â€“10 across the script). Each beat becomes a scene zone. This is the macro pacing.
3. **Pick scene types per beat from the pattern library** (below). Aim for VARIETY â€” repeating the same pattern back-to-back kills retention. Sequence: kinetic-type â†’ flow-diagram â†’ counter â†’ quote-takeover â†’ motion-card â†’ testimonios â†’ quote.
4. **Build scenes from the inside out.** Per scene: write HTML structure â†’ CSS layout â†’ GSAP timeline tweens â†’ frame verification.
5. **Compose the 3-caption layer system** (rail + hero + screen) carefully â€” they must not pisar-se.
6. **Choreograph Maria's frame** â€” shrink at thesis pivot, grow back at proof/CTA. Frees the canvas for full-width motion when needed.
7. **Render direct.** ALWAYS render with `--composition compositions/<file>.html` (not via `index.html` sub-composition). Sub-composition expansion has timing/null-element bugs in the render context. See "Render gotcha" below.
8. **Verify by frame extraction + Read.** Never claim done until frames are extracted and viewed. The MP4 preview gate is mandatory.

## The render gotcha (LEARN THIS FIRST)

In the v3 build, rendering `index.html` (which embeds `full-pt1.html` as a `<template data-composition-src>` sub-composition) produced **blank frames**. The script in the sub-composition fails to find `captions-host` and `appendChild`s on null, the `window.__timelines['full-pt1']` never registers, and the renderer falls back to a paused-at-zero capture.

**Always render directly with `--composition`:**

```bash
npx hyperframes render --quality draft --composition compositions/full-pt1.html --output renders/full-pt1-draft.mp4
```

This bypasses the sub-composition expansion and renders the composition's own HTML/DOM/script as a standalone page. Studio preview at `?comp=full-pt1` uses the same path and works.

If you must use the master `index.html` (multi-composition reels), expect to debug template expansion issues and add defensive null guards everywhere DOM access happens. Document the workaround in BRIEF.md.

## The 3-layer caption system

Long-form ALWAYS has these three caption layers. They must coexist without overlapping.

### Layer 1 â€” Rail captions (default, ALL audio literal)

- Position: bottom bar (`#captions-host` + `#cap-scrim`), `top: 970px; height: 100px;` in 1920x1080
- Content: literal transcript of every word Maria says, loaded from `captions-pt1.meta.json` via fetch
- Track index: 20 (rail itself) + 100+ (each caption div on its own track)
- Word-by-word entry: `expo.out` 0.22s + 0.05s stagger
- Exit: `power2.in` 0.24s starting at `b.end - 0.24`
- Hidden during hero takeovers via the `HERO_WINDOWS` mechanism (see below)
- Swiped out via `tl.to(['#captions-host','#cap-scrim'], {y:110, opacity:0,...})` when a takeover scene wants the bottom clean

### Layer 2 â€” Hero captions (takeover, when literal sync is needed)

- Position: panel-center, big â€” 96â€“180px Playfair italic 900 with gradient text
- Content: the same words Maria says, but rendered as a takeover (NOT in the rail)
- When Maria says it â‰¥85% literally â†’ silence the rail with a `HERO_WINDOWS` entry
- Pattern: per-word stagger (kinetic), per-frase chunks (rhythm), or single line w-b-w
- Lives inside scene-specific containers (`s10-stage`, `s22-pills-headline`, `s26-magia`, etc.)

```css
/* Hero text base â€” never crop descenders/ascenders */
.scn-hero {
  font-family: "Playfair Display", serif;
  font-weight: 900;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.022em;
  padding: 0.10em 0.06em 0.20em 0.06em;  /* â† prevents p/g/q/y/j descender clipping */
  background: linear-gradient(180deg, var(--maria-beige) 0%, var(--maria-verde-lima) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  filter: drop-shadow(0 18px 28px rgba(20,55,46,0.5));
}
```

**Gradient text + background-clip:text must be applied at the WORD or LINE level, never a multi-line parent** â€” descender clipping is a fixed-rect concern. If the parent box is taller than one line, the gradient stretches and visually breaks.

### Layer 3 â€” Screen captions (persistent annotations under a graphic)

- Position: floating beneath a diagram, mini-system, or sub-card
- Content: condensed paraphrases or sub-points that build up as Maria talks
- Style: italic Playfair 42â€“44px, color `rgba(239,234,213,0.82)` (beige at 82%), key words wrapped in `<em>` with lime gradient
- Pattern: stagger entries 1.5â€“3s apart, persist on screen, then dim to `opacity: 0.30` when next content takes focus
- Used in: s23 (Phase A setup), s26 (under "el sistema" diagram), s32 (testimonios buildup)

```css
.s32-cap {
  font-family: "Playfair Display", serif;
  font-style: italic;
  font-weight: 700;
  font-size: 44px;
  line-height: 1.15;
  color: rgba(239,234,213,0.82);
  letter-spacing: -0.01em;
  opacity: 0;
}
.s32-cap em {
  font-weight: 900;
  background: linear-gradient(178deg, var(--maria-beige) 0%, var(--maria-verde-lima) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  padding: 0 4px;
}
```

### Coexistence rules

| Situation | Layer 1 (rail) | Layer 2 (hero) | Layer 3 (screen caps) |
|---|---|---|---|
| Default narration | ON | OFF | OFF |
| Hero is â‰¥85% literal | OFF (HERO_WINDOWS) | ON | OFF |
| Hero is paraphrase / motion-graphic with no text | ON | OFF | optional ON for sub-points |
| Persistent caps building up under a diagram | optionally OFF (HERO_WINDOWS) | OFF | ON |
| Takeover quote (s10-style) | OFF (rail swipe-down) | ON (qt-stage) | OFF |
| Cards/testimonios with names visible | OFF | OFF | optionally persistent |

**HERO_WINDOWS** â€” array of `[start, end]` pairs where the rail is suppressed:

```js
const HERO_WINDOWS = [
  [29.70, 35.85],   // s4 heroes literal
  [103.50, 118.90], // s10 quote takeover
  [317.80, 326.40], // s23 phase A captions persistentes
  [362.50, 377.30], // s26 + s26bis: campaÃ±a mÃ¡gica â†’ entender vs aplicarla
  [538.50, 556.00], // s32 caps persistentes + cards testimonios
  // s25 NOT here â€” Maria wanted rail visible
  // s27 NOT here â€” Maria wanted rail accompanying Academia
];
function inHeroWindow(b) {
  return HERO_WINDOWS.some(([s, e]) => Math.min(b.end, e) - Math.max(b.start, s) > 0.30);
}
```

Rail swipe-down/up choreography (separate from HERO_WINDOWS, controls VISIBLE chrome):

```js
// Swipe DOWN (off canvas)
tl.to(['#captions-host', '#cap-scrim'], { y: 110, opacity: 0, duration: 0.35, ease: 'power2.in' }, T);
// Swipe UP (back in)
tl.to(['#captions-host', '#cap-scrim'], { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, T);
```

Triggered when transitioning into/out of takeover sections OR around Maria's shrink (rail goes off â†’ only hero) and grow (rail comes back).

### Caption drift correction (Whisper offset)

Whisper transcripts can drift ahead of audio. The v3 build uses a +0.4s offset for captions after timestamp 403.9:

```js
const CAPTION_DRIFT_OFFSET = 0.4;
const CAPTION_DRIFT_THRESHOLD = 403.9;
// Inside the captions loop:
const offset = b.start >= CAPTION_DRIFT_THRESHOLD ? CAPTION_DRIFT_OFFSET : 0;
tl.to(`${sel} .cap-word`, {...}, b.start + offset);
tl.to(`${sel} .cap-inner`, {...}, b.end - 0.24 + offset);
```

If you hear "the caption is ahead" during review, apply or tune this offset. It's per-block â€” different thresholds and offsets can coexist.

## Scene variety / pattern library

Long-form retention dies when consecutive scenes look the same. Always alternate. The v3 build uses **18+ distinct scene types**, none used twice in a row.

### Pattern 1 â€” Kinetic-type opener / hero w-b-w

Big italic display text, words enter in stagger. Used for thesis beats and pivots.

```js
gsap.set('#s1-hero .word', { opacity: 0, y: 18, scale: 0.92, filter: 'blur(6px)' });
tl.to('#s1-hero .word', {
  opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
  duration: 0.42, ease: 'expo.out', stagger: 0.06
}, T);
```

### Pattern 2 â€” Quote takeover (`qt-stage`)

Maria shrinks, the right panel expands to fullframe, multi-frase quote enters phrase-by-phrase, each phrase fades to next. Used for thesis pivots that need full reader focus.

- Class `qt-stage` (line ~1978 in v3)
- Per-phrase containers (`qt-phrase`) absolutely centered, opacity-faded between
- Optional motion icons at the end of a phrase (`s10-motion-panic`, `s10-motion-check`)

### Pattern 3 â€” Caption-Focus intermediate (s26bis)

Variant of Pattern 2 where the takeover is BRIDGE content (not a pivot), placed between two main scenes to fill a transition. Smaller font than quote takeover (~72px), 2 phrases, word-by-word.

- Use when there's a 5â€“10s audio segment that doesn't fit the previous or next scene's visual logic
- Use a sub-card with subtle vignette + border, not fullframe panel

### Pattern 4 â€” Pills cascade / pills row

Pills enter staggered, sync to a list of words Maria says. Used for enumerations ("hacks, atajos, mÃ¡gica" / "anuncios, audiencias, estructuras" / "Landing, Formularios, Emails, Automatizaciones").

```js
['#p1','#p2','#p3','#p4'].forEach((sel, i) => {
  tl.to(sel, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, T + i * 0.55);
});
```

Pulse the group together on a unifying beat ("Y eso amigo mÃ­oâ€¦"):

```js
tl.to(['#p1','#p2','#p3','#p4'], {
  scale: 1.06, duration: 0.40, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: 0.05
}, T);
```

### Pattern 5 â€” Motion card (multi-state, the big one)

**The most important long-form pattern.** Used for the 4 pillars (s28â€“s31). Card starts compact (just header), expands as content fills it up.

States:
1. **Compact** â€” card is narrow + short, header centered H+V
2. **Morph 1** â€” card slides to position + expands vertically for first content block (e.g. logos)
3. **Content state 1** â€” first content visible
4. **Morph 2** â€” card expands further for second content block (e.g. bullets)
5. **Content state 2** â€” all content visible
6. **(Optional) Morph 3** â€” for third content block (e.g. GHL sub-card)
7. **Exit**

**The HARD-EARNED lessons** from the v3 motion card iteration:

#### Header centering during compact

`pilar-content` has `flex:1` which fights with `justify-content: center` on the card. Solution: hide `pilar-content` entirely during compact, use the `is-compact` class:

```css
.s28-card.is-compact .pilar-content,
.s29-card.is-compact .pilar-content,
.s30-card.is-compact .pilar-content,
.s31-card.is-compact .pilar-content {
  display: none;
}
```

#### Header reseating during morph (the "jump" problem)

When the `is-compact` class is removed (at morph start), the header's flex position changes from "centered in card" to "top-left of card". That's an instant snap.

**The smooth fix is GSAP-driven transform compensation:**

```js
// Initial: header transformed to APPEAR centered, even though flex layout puts it top-left
gsap.set('#s28-card .pilar-header', { x: 83, y: -7 });

// At morph start: remove is-compact class (display:none â†’ flex on pilar-content)
tl.call(() => {
  const c = document.getElementById('s28-card');
  if (c) c.classList.remove('is-compact');
}, [], MORPH_START);

// Same instant: animate header transform back to 0,0 over the morph duration
tl.to('#s28-card .pilar-header', {
  x: 0, y: 0,
  duration: 1.00, ease: 'power3.inOut'
}, MORPH_START);
```

The visual flow: at MORPH_START, the flex position instantly snaps to top-left, but the transform offsets it back to the centered position visually. Then the transform animates to (0,0) smoothly, revealing the natural top-left position.

Compute the `x` offset based on:
- Card content width = compact_width âˆ’ padding_total
- Header content width â‰ˆ badge_width (82) + gap (22) + title_text_width
- `x = (card_content_width âˆ’ header_content_width) / 2`

`y = -7` is a vertical fudge for the badge being slightly taller than the title text x-height.

#### Width/padding animation for sub-card states

When the card has a sub-section that needs to expand horizontally (e.g. s31 GHL sub-card going from logo-only-width to full-width with price/incluido):

- Set explicit initial width via GSAP (`gsap.set('.sub', { width: 340 })`)
- Animate to final width (`tl.to('.sub', { width: 760 }, T)`)
- Use `box-sizing: border-box` so padding is inside the width
- Animate `paddingLeft` together with `width` if the content needs to slide within (e.g. logo moves from sub-card-center to sub-card-left as the card expands rightward)

Ease: `sine.out` or `power2.inOut` â€” deceleration without a hard stop. Avoid `power3.inOut` for width because the very-slow tail can look like a perceived "jump" at the end.

#### Stable layout via `display:block + opacity:0` (not `display:none`)

When you have items that enter later (e.g. price + "incluido" appearing after the logo in the GHL sub-card), keep them in the flex layout with `opacity:0` from the start instead of `display:none`. This prevents the layout from reflowing when they become visible.

Combine with:
- `flex-shrink: 0` on each item (so they keep their natural widths)
- `overflow: hidden` on the sub-card (so items extending past the narrow state are clipped, not visible at opacity:0 with weird positioning)

```css
#s31-card .s31-ghl {
  overflow: hidden;
  justify-content: flex-start;  /* anchor first item to a stable position */
}
#s31-card .s31-ghl-logo,
#s31-card .s31-ghl-price,
#s31-card .s31-ghl-incluido {
  flex-shrink: 0;
}
```

This eliminated the "jump just before final position" that kept reappearing across 6 iterations during the v3 build.

### Pattern 6 â€” Counter (animated number)

Used for "cada cambio cuesta â‚¬1000 â†’ -â‚¬500" (s5), or "ROAS â‚¬500 â†’ â‚¬20.403" (s12), or "â‚¬500 / â‚¬25k" avatar grid (s30).

```js
// Numeric counter animation
const target = { val: 1000 };
tl.to(target, {
  val: -500, duration: 3.20, ease: 'power2.inOut',
  onUpdate: () => { counterEl.textContent = `â‚¬ ${Math.round(target.val).toLocaleString('es-ES')}`; }
}, T);
```

### Pattern 7 â€” Flow diagram (nodes + arrows)

For pipeline metaphors: "anuncio â†’ landing â†’ email â†’ cierre" or "Landing / Formularios / Emails / Automatizaciones". Nodes enter staggered, arrows enter BETWEEN node mentions (not all at once at scene start).

```js
// Nodes enter at their audio cues
tl.to('#s31-fn1', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, T1); // landing mention
tl.to('#s31-fn2', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, T2); // formulario mention
// Arrow between nodes 1 and 2 enters BETWEEN their mentions
tl.to('#s31-ar1', { opacity: 1, scaleX: 1, duration: 0.40, ease: 'power2.out' }, (T1+T2)/2);
```

Color the nodes red ("problem" state) when introduced, switch to lime ("solved" state) when the corresponding bullet enters:

```js
tl.call(() => document.getElementById('s31-fn1').classList.add('problem'), [], T1 + 0.30);
// Later:
tl.call(() => {
  const n = document.getElementById('s31-fn1');
  if (n) { n.classList.remove('problem'); n.classList.add('solved'); }
}, [], T_BULLET_1);
```

### Pattern 8 â€” Magnifier (lupa) sweeping over nodes

A magnifier SVG hovers over each node sequentially, communicating "examination" / "reading the system" / "criterio".

```html
<div class="s26-lupa" id="s26-lupa">
  <svg viewBox="0 0 100 100"><circle cx="40" cy="40" r="26"/><line x1="59" y1="59" x2="86" y2="86"/></svg>
</div>
```

Animate `left` between sub-card-relative positions to sweep across the diagram:

```js
gsap.set('#s26-lupa', { opacity: 0, scale: 0.6, left: 604 });
tl.to('#s26-lupa', { opacity: 1, scale: 1, duration: 0.40, ease: 'back.out(1.7)' }, T_NODE1);
tl.to('#s26-lupa', { left: 764, duration: 0.35, ease: 'power2.inOut' }, T_NODE2);
tl.to('#s26-lupa', { left: 924, duration: 0.35, ease: 'power2.inOut' }, T_NODE3);
tl.to('#s26-lupa', { left: 1084, duration: 0.35, ease: 'power2.inOut' }, T_NODE4);
tl.to('#s26-lupa', { opacity: 0, duration: 0.50, ease: 'power2.in' }, T_END);
```

**Lens-vs-node centering math**: in the SVG `viewBox="0 0 100 100"` the lens center is at (40, 40). In a 140px container that's (56px, 56px) from the container's top-left. To center the lens visually on a target at wrap_x = N: `lupa.left = N - 56`.

If the SVG sub-system uses `preserveAspectRatio` and the container/viewBox aspect ratios mismatch, there's a "meet" padding to account for. **Force matching aspect ratios** (e.g. set the container width to match viewBox width) to keep the math simple.

### Pattern 9 â€” Avatars grid (s30 directos semanales)

3Ã—2 grid of avatar circles, each labeled with a budget ("â‚¬500", "tu caso", "â‚¬2.5k"...). Used to communicate "you'll see others' real cases".

- Grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px 40px;`
- Highlight the "you" avatar with a red border + box-shadow ring
- Pulse individual avatars on their mentions ("compaÃ±eros que invierten 500", "otros que invierten 10.000")

### Pattern 10 â€” Logo trio (s28 Meta/Google/YouTube, s29 Loom/Vimeo)

Real platform logos in `pilar-logo` boxes, entering staggered on the audio cue for each platform's name.

- `.pilar-logo` is `230x130` box, image fits via `max-width: 100%; object-fit: contain`
- Logo image natural aspect varies (Meta, Google Ads, YouTube all different) â€” DO NOT add background to the box, let images breathe naturally
- Entry: `back.out(1.7)` 0.50s, exact sync with the platform-name word

For GoHighLevel-style square logos used inside a sub-card (s31), DON'T use fixed `width: 280` on the container â€” use `height: 90; width: auto` so the container shrinks to the image's natural aspect ratio:

```css
.s31-ghl-logo {
  height: 90px;
  width: auto;
}
.s31-ghl-logo img {
  height: 100%;
  width: auto;
  object-fit: contain;
}
```

A 280-wide container with a square logo creates a 170px gap on each side that looks broken.

### Pattern 11 â€” Hero stack (multi-line title) (s26 "cuando sabes leer / el sistema", s27 "Academia / Adscelerator")

Two stacked lines, top line smaller + subtle, bottom line big + bold + gradient + rotation.

```html
<div class="s26-leer-wrap">
  <span class="s26-leer-line1">cuando sabes leer</span>
  <span class="s26-leer-line2">el sistema</span>
</div>
```

Layout: flex column, `align-items: center`, tiny gap. Line 2 gets `transform: rotate(-2deg)` and gradient text. Line 1 stays straight + lighter color.

### Pattern 12 â€” Orbiting icons (s27 4 pilares around hero)

Icons orbiting at the 4 corners around the central hero, communicating "the whole system surrounds this concept". Used as preview of upcoming pilar scenes.

```css
.s27-pilar {
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(20,55,46,0.50);
  border: 2px solid rgba(212,230,174,0.32);
  backdrop-filter: blur(14px);
}
#s27-pilar-formacion { top: 130px; left: 160px; }
#s27-pilar-soporte   { top: 130px; right: 160px; left: auto; }
#s27-pilar-directos  { bottom: 130px; left: 160px; top: auto; }
#s27-pilar-tecnica   { bottom: 130px; right: 160px; left: auto; top: auto; }
```

Subtle drift yoyo for life:

```js
tl.to('#s27-pilar-formacion', { y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: 4 }, T);
// (different amplitudes per pilar â€” 12, -10, 14 â€” so they don't move in sync)
```

### Pattern 13 â€” Pre-headline + hero reveal (s27)

A small italic pre-headline appears first ("y precisamente por eso hemos creado..."), fades out as the main hero ("Academia Adscelerator") reveals. Used to lead into a name/brand reveal.

```js
// Pre-headline enters
tl.to('#s27-pre-headline', { opacity: 0.85, y: 0, duration: 0.50, ease: 'expo.out' }, 387.50);
// Pre-headline exits just before main hero
tl.to('#s27-pre-headline', { opacity: 0, y: -10, duration: 0.40, ease: 'power2.in' }, 389.80);
// Main hero reveal
tl.to('#s27-hero-stack', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out' }, 390.00);
```

### Pattern 14 â€” Testimonials bridge (s32)

Video thumbnails of real testimonial cases, framed like preview cards, with names + sub-labels underneath.

- Extract a frame from the actual testimonial video with `ffmpeg`: pick a clean face shot, ~5â€“10s into the testimonial composition
- `aspect-ratio: 16/9` on the thumb wrapper, `object-fit: cover` on the image
- For 9:16 portrait source videos in a 16:9 thumb, use `object-position: center N%` where N is tuned (try 8% â†’ 22% range) to bring the face into frame with appropriate padding
- Frame styling: border 2px lime-translucent + double box-shadow (drop + outer ring)

```css
.s32-card-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 auto 18px;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid rgba(212,230,174,0.45);
  box-shadow: 0 10px 26px rgba(0,0,0,0.50), 0 0 0 4px rgba(20,55,46,0.45);
}
#s32-c2 .s32-card-thumb img {
  object-position: center 22%;  /* per-card tuning */
}
```

### Pattern 15 â€” Cards with strike + replacement (s31 GHL)

To communicate "the X you'd pay â†’ INCLUDED for you", show a price, draw a red strike through it, then reveal "INCLUIDO" next to it. Visual proof of value.

```html
<div class="s31-ghl-price">
  $97/mes
  <div class="s31-ghl-price-strike"></div>
</div>
<div class="s31-ghl-incluido">incluido</div>
```

```css
.s31-ghl-price-strike {
  position: absolute;
  left: -10px; right: -10px;
  top: 50%;
  height: 5px;
  background: var(--maria-rojo);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left center;
}
```

```js
// Price enters
tl.to('#s31-ghl-price', { opacity: 1, scale: 1, duration: 0.50, ease: 'back.out(1.6)' }, T_PRICE);
// Strike draws (sync on the "AquÃ­ la tienes incluida")
tl.to('#s31-ghl-strike', { scaleX: 1, duration: 0.50, ease: 'power2.out' }, T_STRIKE);
// "INCLUIDO" reveals + pulse
tl.to('#s31-ghl-incluido', { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, T_INCLUIDO);
tl.to('#s31-ghl-incluido', { scale: 1.10, duration: 0.40, ease: 'sine.inOut', yoyo: true, repeat: 1 }, T_INCLUIDO + 0.50);
```

### Pattern 16 â€” TelaraÃ±a / chips shake (s14 "tocar todo a la vez")

5 chips in a chaotic cluster, each shaking slightly out of phase, communicating "intervening everywhere at once â†’ caos".

```js
['#s14-c1','#s14-c2','#s14-c3','#s14-c4','#s14-c5'].forEach((sel, i) => {
  tl.to(sel, { x: 'random(-6, 6)', duration: 0.06, ease: 'sine.inOut',
               yoyo: true, repeat: 14 }, T_SHAKE + i * 0.04);
});
```

### Pattern 17 â€” Phase-D cap rotator (s19 DIM letras + phase headers)

A single text element rotates between sub-phase labels via `tl.call(() => el.textContent = '...')`. Used inside a longer hold scene to keep visual change happening without re-entering new elements.

```js
tl.call(() => { phaseEl.textContent = 'Primero diagnosticas'; }, [], 246.00);
tl.call(() => { phaseEl.textContent = 'Luego intervenir'; }, [], 264.50);
tl.call(() => { phaseEl.textContent = 'DespuÃ©s medir'; }, [], 277.60);
```

### Pattern 18 â€” Side-by-side panels (split-screen comparativa)

Two panels side-by-side comparing two scenarios (antes/despuÃ©s, no-es-para/sÃ­-es-para, perder/aprender).

- Use the `split-screen-panels` skill for the heavier visual variant
- For long-form, simpler version: two equal-width cards with X / âœ“ icon header, list of bullets each

## Maria shrink/grow choreography

In the v3 build, Maria (face video) starts BIG on the left half of the canvas. At a thesis pivot ("Eso no existe", 365.50), he shrinks to a corner. At the pilares CTA section start (407.67, end of "trabajamos cuatro piezas"), he grows back.

```js
// Set transform origin at the corner he'll shrink TO
gsap.set('#julio-wrap', { transformOrigin: 'left bottom' });

// SHRINK at the pivot
tl.set('#julio-wrap', { zIndex: 200 }, T_SHRINK);
tl.to('#julio-wrap', { scale: 0.42, duration: 0.80, ease: 'power3.inOut' }, T_SHRINK);

// GROW back at the CTA pivot
tl.to('#julio-wrap', { scale: 1, duration: 0.80, ease: 'power3.inOut' }, T_GROW);
tl.set('#julio-wrap', { zIndex: 1 }, T_GROW + 0.85);
```

When Maria shrinks, content can use the full canvas (panel `left: 60` instead of `left: 606`). When he grows back, content goes back to the right panel (`left: 606` or pillar-card `left: 660`).

For scenes spanning the shrink moment, animate the panel's `left` property in parallel:

```js
tl.to('#s26-hero-wrap', { left: 60, duration: 0.80, ease: 'power3.inOut' }, T_SHRINK);
```

This is the v3's most cinematic move â€” used SPARINGLY (twice total) for thesis-level pivots.

## Retention discipline (do not be static)

The audit autopsy of the v3 first draft found ~30 seconds of dead-static screen time across 4 scenes. Always apply these rules:

1. **Never let a hero stand alone >5s without secondary motion.** If it must hold, add a yoyo `scale: 1.04` pulse every ~3s, OR a sutil background drift, OR an accompanying caption/icon.
2. **Pattern-interrupt every 5â€“8s.** New element entry, layout change, color shift, audio-synced pulse â€” something must change.
3. **Avoid back-to-back scenes of the same pattern type.** Alternate cascading pills â†’ flow diagram â†’ quote takeover â†’ motion card. Repeating "card with bullets" 4Ã— kills retention.
4. **The 17.4s gap (s29 v1) and 11.9s gap (s32 v1) were both fixed by adding interim caption builds.** When a section's audio runs long, generate visual increments (`tl.to(`#capN`, {...}, +1.7s)`) on every audio sub-phrase.
5. **Mid-scene pulses are mandatory** for cards that hold >10s. Add `tl.to(items, { scale: 1.05, yoyo:true, repeat:1 }, ...)` at the strong audio beats.
6. **First entry stagger is not enough.** After all elements enter, plan at least one motion event mid-scene (a node pulse, a chip shake, a counter pop).

## Timing discipline (audio sync)

### Use literal audio timestamps from the JSON

```js
// From captions-pt1.meta.json:
// 410.94 "Meta Ads" â†’ logo Meta enters at 410.90
// 411.50 "Google Ads" â†’ logo Google enters at 411.55
// 412.76 "YouTube Ads" â†’ logo YouTube enters at 412.80
```

Always cite the audio block in a code comment. Future-you in 3 weeks will not remember WHY a tween fires at 412.80.

### tl.set hard kills for non-linear seek

The HyperFrames runtime caches DOM state per render worker. If a scene exits via a fade and a user seeks BACK before the fade, GSAP leaves elements at opacity 0 â€” they don't reappear. Protect with `tl.set` hard kills at the boundaries:

```js
// Hard kill: at scene start, force initial state
tl.set('#s26-magia', { opacity: 0, scale: 0.65, filter: 'blur(18px)' }, 362.50);
// (Then animate normally)
tl.to('#s26-magia', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.65 }, 362.70);
```

The lint rule `gsap_exit_missing_hard_kill` will warn about exit tweens that end at the clip boundary without a matching set. Triage these â€” if the element re-enters in the same render, add the set; if it's truly gone, suppress.

### Sub-pixel "jump" artifacts at animation end

`power3.inOut` has very slow tail behavior. The eased value approaches 100% slowly, and the browser may snap to the integer pixel at the final frame. This can create a perceived "jump" right before the end of motion.

Use `sine.out`, `power2.inOut`, or just `none` (linear) for width/position animations if the user reports a "jump at the end". The Adscelerator GHL sub-card iteration found `sine.out` over a slightly longer duration (0.75-0.85s) eliminated the artifact.

## Layout math reference

```
1920x1080 canvas
.julio-wrap (full size):     left: 60, top: 60, width: 580, height: 960
.julio-wrap (shrunk 0.42):   bottom-left corner (~244x404)
.scn-hero-wrap (right panel, Maria big):  left: 606, right: 60, top: 60, height: 920
.scn-hero-wrap (full canvas, Maria shrunk):  left: 60, right: 60, top: 60, height: 920 (animated)
.s28-card (pilar card):      left: 660, right: 60, top: 110, bottom: 130 (= 1200x840)
.s28-card.is-compact (motion card initial):  left: 960, right: 360, top: 470, bottom: 470 (= 600x140)
.s31-ghl (sub-card, narrow): width: 340 (animates to 760)
.cap-scrim / #captions-host: left: 50, right: 50, top: 970, height: 100
.logo-wm (FJ watermark):      right: 32, bottom: 16 â†’ equidistante issue, use right:72 bottom:32 for proper centering
```

Compact card centered horizontally on the right panel center (pilar-content center â‰ˆ 1260): `left = 1260 âˆ’ width/2`.

## Brand discipline (Maria palette + fonts)

CSS variables defined in `assets/maria-tokens.css` and CLAUDE.md:

```css
--maria-verde-botella: #14372E;  /* canvas, deep bg, panels */
--maria-verde-lima:    #D4E6AE;  /* emphasis, gradient lime, lime borders */
--maria-beige:         #EFEAD5;  /* main text, gradient start, default beige */
--maria-rojo:          #FB4B2D;  /* problems, "antes", strike-throughs, urgency */
```

- Hero text: Playfair Display italic 900, gradient beigeâ†’lime (or beigeâ†’rojo for problems)
- Captions/pills/labels: Playfair Display italic 700 (subtler) OR Geomanist 700 uppercase letter-spaced
- Pill backgrounds: `rgba(20,55,46,0.55)` with `backdrop-filter: blur(14px)` for liquid-glass
- Drop-shadows: heavy `0 18px 28px rgba(20,55,46,0.5)` on heroes; lighter `0 6px 14px` on smaller elements
- Borders for cards/pills: `rgba(212,230,174,0.32â€“0.45)` (lime semi-translucent)

The brand is consistent across the v3 build â€” match it for every new long-form, no exceptions unless the user explicitly approves a deviation.

## Anti-patterns (do not do these)

1. **Hero alone for >5s without secondary motion** â€” kills retention.
2. **Repeating the same pattern in adjacent scenes** â€” looks lazy.
3. **Rail captions visible during a literal hero takeover** â€” duplicates the message, looks broken. Use `HERO_WINDOWS`.
4. **Cards with placeholder SVG icons** â€” for testimonios, USE the actual video frame as a thumbnail (extract with `ffmpeg`).
5. **Logo container wider than the logo's natural aspect** â€” creates apparent gaps. Use `width: auto` + fixed height.
6. **Animating layout properties via class swap (`is-compact` removal)** without compensating transforms â€” produces perceptible "snaps".
7. **`power3.inOut` on width / position animations >0.50s** â€” the slow tail looks jumpy. Use `sine.out` or `power2.inOut`.
8. **Mixing `display: none` and `display: flex` on flex items that should be in stable layout** â€” reflows kill the perceived smoothness. Use `opacity: 0` + `flex-shrink: 0` + `overflow: hidden` instead.
9. **Rendering via the master `index.html`** â€” sub-composition expansion has timing/null-element bugs. Always `--composition compositions/<file>.html` direct.
10. **Forgetting to read frames via the `Read` tool after rendering** â€” never claim done until you've looked at the output.

## Skill-driven iteration loop

When iterating with the user scene-by-scene on a long-form review:

1. **Refer to scenes by first-and-last visible element**, not timestamps. ("Escena que va de 'campaÃ±a mÃ¡gica' hasta '(no existe)' / chips") See [[feedback-scene-naming-by-elements]] for the rationale. Timestamps OK for technical citations (`data-start`, GSAP tween anchors).
2. **Apply ALL of the user's changes for one scene before moving to the next.** Don't batch across scenes.
3. **After each change, capture frames with `scripts/batch-scrub.mjs <comp> renders/frames/<batch> <t1> <t2>...` and Read the relevant ones** â€” every change must be visually verified.
4. **Run `npx hyperframes lint`** after each batch â€” keep at 0 errors.
5. **When stuck on a perceived "jump" or layout artifact**, recall the v3 lessons in this skill: it's almost always layout reflow during a `display` change OR easing tail. The fixes are documented above.
6. **For complex multi-state morphs, expect 5â€“10 iterations.** That's normal. Each iteration locks in one observable behavior.
7. **Only render once the user has finished scene-by-scene review** â€” render is expensive (~9min for 9-min comp). Save it for the green light.

## The render gate (NEVER SKIP)

Two preview gates per build, both mandatory:

**Gate 1 (Studio preview, before any render):**
```bash
npx hyperframes preview  # background, port 3002
```
Share `http://localhost:3002/?comp=<comp-id>` with the user. Wait for explicit "render a draft" / "looks good".

**Gate 2 (Rendered MP4, before delivery):**
```bash
npx hyperframes render --quality draft --composition compositions/<file>.html --output renders/<slug>-draft.mp4
mkdir -p renders/verify-draft
for t in 5 50 100 200 350 410 460 510 540 550; do
  ffmpeg -y -ss $t -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 "renders/verify-draft/t${t}.png"
done
# Read every frame via the Read tool. Verify nothing is blank, cropped, off-brand.
```

Then serve for the user:
```bash
cd <project-dir> && nohup npx serve renders -p 8080 -n > /tmp/serve8080.log 2>&1 &
```

Share `http://localhost:8080/<slug>-draft.mp4`. WAIT for explicit sign-off before the standard render.

**Final render:**
```bash
npx hyperframes render --quality standard --composition compositions/<file>.html --output renders/<slug>-final.mp4
```

## References (deep dives)

- `references/render-gotcha-direct-composition.md` â€” the index.html sub-composition rendering bug + workaround
- `references/caption-3-layer-coexistence.md` â€” full table of caption layer rules with audio-sync examples
- `references/motion-card-morph-patterns.md` â€” every state machine variant used in s28-s31
- `references/scene-pattern-library.md` â€” full catalog with copy-paste skeletons for all 18 patterns
- `references/julio-shrink-grow-choreography.md` â€” the timing rules + math for the canvas reclaim

## Related skills

- `/hyperframes` â€” framework rules (mandatory first)
- `/gsap` â€” animation API reference
- `/hyperframes-cli` â€” `init Â· lint Â· preview Â· render Â· transcribe Â· tts Â· doctor`
- `/hyperframes-registry` â€” catalog blocks (mostly for short-form, but `grain-overlay` + transition packs work in long-form too)
- `/make-a-video` â€” the beginner-to-finished workflow; this skill is the advanced iteration playbook
- `/short-form-video` â€” sibling for 9:16 vertical formats
- `/split-screen-panels` â€” split-screen heavy variants of Pattern 18

