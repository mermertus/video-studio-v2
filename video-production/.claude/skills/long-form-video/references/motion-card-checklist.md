# Motion card checklist (the s28â€“s31 pattern)

The motion card is the highest-leverage pattern in the v3 build. Card opens compact, expands as content fills. Apply this checklist verbatim when implementing it.

## HTML structure (required)

```html
<div id="sN-card" class="clip sN-card is-compact" data-start="..." data-duration="..." data-track-index="...">
  <div class="pilar-header">
    <div class="pilar-num">N</div>
    <div class="pilar-title">TÃ­tulo</div>
  </div>
  <div class="pilar-content">
    <!-- Section A (e.g. logos) -->
    <div class="pilar-logos">...</div>
    <!-- Section B (e.g. flow / mini-system) -->
    <!-- Section C (e.g. bullets) -->
    <div class="pilar-bullets">...</div>
    <!-- Section D (e.g. sub-card highlight, optional) -->
    <div class="sN-ghl">...</div>
  </div>
</div>
```

Note the `is-compact` class on the root â€” this is the initial state. Removed at the first morph.

## CSS (one-time, in the global styles block)

```css
/* Card base â€” applies across s28, s29, s30, s31 (the pilares) */
.s28-card, .s29-card, .s30-card, .s31-card {
  position: absolute;
  left: 660px; right: 60px;
  top: 110px; bottom: 130px;
  border-radius: 28px;
  padding: 36px 40px;
  box-sizing: border-box;
  background: rgba(20,55,46,0.46);
  backdrop-filter: blur(22px) saturate(1.35);
  border: 2px solid rgba(212,230,174,0.32);
  display: flex;
  flex-direction: column;
  gap: 26px;
  overflow: hidden;
  will-change: opacity, transform;
}

/* Compact state hides pilar-content so header centers via flex justify-content alone */
.s28-card.is-compact .pilar-content,
.s29-card.is-compact .pilar-content,
.s30-card.is-compact .pilar-content,
.s31-card.is-compact .pilar-content {
  display: none;
}

/* Bullet centering (s29, s30 only): bullet floats centered between previous section and card bottom */
#s29-card .pilar-content,
#s30-card .pilar-content {
  justify-content: flex-start;
}
#s29-b1, #s30-b1 {
  margin-top: auto;
  margin-bottom: auto;
}
```

## GSAP timeline (the morph state machine)

```js
// === Compact initial state ===
gsap.set('#sN-card', {
  opacity: 0, scale: 0.92,
  left: 960, right: 360, top: 470, bottom: 470  // small + centered on right panel
});
// Header transform-shift to APPEAR centered while flex layout puts it top-left
gsap.set('#sN-card .pilar-header', { x: X_OFFSET, y: -7 });
// Hide future content as opacity 0 (NOT display:none â€” keeps flex layout stable across morphs)
['#sN-l1','#sN-l2'].forEach(s => gsap.set(s, { opacity: 0, y: 24, scale: 0.7 }));
gsap.set('#sN-b1', { opacity: 0, y: 16 });

// === Entry (compact appearance) ===
tl.to('#sN-card', { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out' }, T_ENTRY);

// === Morph 1: compact â†’ logos state ===
// Remove the is-compact class atomically â€” pilar-content goes display:flex
tl.call(() => {
  const c = document.getElementById('sN-card');
  if (c) c.classList.remove('is-compact');
}, [], T_MORPH_1);
// Header transform compensates the flex layout snap
tl.to('#sN-card .pilar-header', { x: 0, y: 0, duration: 1.00, ease: 'power3.inOut' }, T_MORPH_1);
// Card slides + expands
tl.to('#sN-card', {
  left: 660, right: 60, top: 110, bottom: 580,  // medium height
  duration: 1.00, ease: 'power3.inOut'
}, T_MORPH_1);

// === Content reveal (sync to audio) ===
tl.to('#sN-l1', { opacity: 1, y: 0, scale: 1, duration: 0.50, ease: 'back.out(1.7)' }, T_LOGO_1);
tl.to('#sN-l2', { opacity: 1, y: 0, scale: 1, duration: 0.50, ease: 'back.out(1.7)' }, T_LOGO_2);

// === Morph 2: logos â†’ full state (adds bullet section) ===
tl.to('#sN-card', { bottom: 130, duration: 0.55, ease: 'power3.inOut' }, T_MORPH_2);
tl.to('#sN-b1', { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' }, T_BULLET);

// === Exit ===
tl.to('#sN-card', {
  opacity: 0, scale: 1.02, filter: 'blur(8px)',
  duration: 0.50, ease: 'power2.in', overwrite: 'auto'
}, T_EXIT);
```

## The X_OFFSET math

The header transform `x: X_OFFSET` makes the header appear visually centered in the compact card even though flex puts it top-left.

```
compact_width  = X (from gsap.set, e.g. 600 or 720)
content_width  = X âˆ’ 80 (padding 40 each side)
header_natural_width â‰ˆ 82 (badge) + 22 (gap) + title_width
X_OFFSET = (content_width âˆ’ header_natural_width) / 2
```

Examples from the v3 build:
- s28 "FORMACIÃ“N" (compact 600): header ~374 wide â†’ X_OFFSET = (520 âˆ’ 374)/2 = **73** (used 83 with some fudge)
- s29 "SOPORTE EN VIDEO" (compact 720): header ~584 wide â†’ X_OFFSET = (640 âˆ’ 584)/2 = **28**
- s30 "DIRECTO SEMANAL" (compact 700): header ~554 wide â†’ X_OFFSET = (620 âˆ’ 554)/2 = **33**
- s31 "TÃ‰CNICA" (compact 600): header ~314 wide â†’ X_OFFSET = (520 âˆ’ 314)/2 = **103** (used 83 â€” close enough)

Y is consistently `-7` (badge slightly taller than title baseline; nudge up to feel centered).

## State transitions cheat sheet

| State | left | right | top | bottom | width | height | When |
|---|---|---|---|---|---|---|---|
| Compact (s28/s31 short titles) | 960 | 360 | 470 | 470 | 600 | 140 | Initial |
| Compact (s29 long title) | 900 | 300 | 470 | 470 | 720 | 140 | Initial |
| Compact (s30 medium title) | 910 | 310 | 470 | 470 | 700 | 140 | Initial |
| Logos state | 660 | 60 | 110 | 580 | 1200 | 390 | After morph 1 |
| Flow state (s29) | 660 | 60 | 110 | 350 | 1200 | 620 | After morph 2 (s29 only) |
| Grid state (s30) | 660 | 60 | 110 | 350 | 1200 | 620 | After morph 1 (s30) |
| Full state (with bullets) | 660 | 60 | 110 | 130 | 1200 | 840 | After morph 2 |

Sub-card inside (s31 GHL) uses `width: 100%; max-width: 760px` with its own width animation `340 â†’ 760` for the horizontal expansion.

## Sub-card horizontal expansion (s31 GHL specific)

When a sub-section inside the card needs to expand horizontally (e.g. logo-only â†’ logo + price + INCLUIDO), animate the sub-card's own width and padding-left simultaneously:

```js
gsap.set('.sN-ghl', {
  opacity: 0, scaleX: 0, transformOrigin: 'center center',
  width: 340, paddingLeft: 125  // narrow + extra left padding to center the logo visually
});
gsap.set('.sN-ghl-price', { opacity: 0, scale: 0.7 });  // NOT display:none
gsap.set('.sN-ghl-incluido', { opacity: 0, scale: 0.5 });  // NOT display:none

// Sub-card extends from center (scaleX 0 â†’ 1) at first opportunity
tl.to('.sN-ghl', { opacity: 1, scaleX: 1, duration: 0.65, ease: 'power3.out' }, T_OPEN);
// Logo enters centered (in narrow sub-card)
tl.to('#sN-ghl-logo', { opacity: 1, scale: 1, duration: 0.60, ease: 'back.out(1.6)' }, T_LOGO);

// Later, when other elements ready: width expand + padding-left collapse
// (logo slides from sub-card-center to sub-card-left as the right side reveals)
tl.to('.sN-ghl', {
  width: 760, paddingLeft: 30,
  duration: 0.85, ease: 'sine.out'  // NOT power3.inOut â€” tail snap looks like a jump
}, T_EXPAND);

// Then reveal new content (already in layout, just opacity 0 â†’ 1)
tl.to('#sN-ghl-price', { opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out' }, T_PRICE);
```

CSS for the sub-card stability:

```css
#sN-card .sN-ghl {
  width: 100%;
  max-width: 760px;
  box-sizing: border-box;
  justify-content: flex-start;
  overflow: hidden;  /* clips overflowing items in narrow state */
}
#sN-card .sN-ghl-logo,
#sN-card .sN-ghl-price,
#sN-card .sN-ghl-incluido {
  flex-shrink: 0;  /* keeps natural widths despite overflow */
}
/* For logos with non-rectangular natural aspect: */
.sN-ghl-logo {
  height: 90px;
  width: auto;  /* shrink-to-fit the image's natural aspect ratio */
}
.sN-ghl-logo img {
  height: 100%;
  width: auto;
  object-fit: contain;
}
```

## Verification frames (run after every change)

```bash
node scripts/batch-scrub.mjs full-pt1 renders/frames/sN-motion \
  T_ENTRY+1 T_MORPH_1 T_MORPH_1+0.5 T_MORPH_1+1.0 T_LOGO_1+0.3 T_BULLET-0.2 T_BULLET+0.5
```

Read every frame. Check:
- Compact header centered horizontally + vertically âœ“
- Mid-morph: header sliding smoothly to top-left (no snap, no jump)
- Logos visible at logos-state, aligned to grid
- Bullet entry doesn't cause card to "snap" wider
- Sub-card expansion is smooth, logo doesn't jump at end of animation

## Common iteration bugs

1. **Header text wraps in compact** â†’ set `left: 0; right: 0; text-align: center` on the header instead of `left: 50%`. The 50% positioning creates a 50%-width container, which wraps long text.

2. **Header "jumps back" at morph start** â†’ forgot to set the GSAP `x` transform initial value. Or the X_OFFSET value is wrong. Recompute.

3. **Sub-card content shrinks weirdly in narrow state** â†’ missing `flex-shrink: 0` on the items.

4. **Sub-card right edge looks like a "snap" at the end of width animation** â†’ switch ease from `power3.inOut` to `sine.out`. Power3's tail is too slow and creates a perceived jump.

5. **Bullets not centered between previous section and card bottom (s29, s30)** â†’ check `justify-content: flex-start` on `.pilar-content` + `margin: auto` on the bullet. The default `justify-content: center` packs everything together.

6. **Card visual width changes after morph 2** â†’ unintended content overflow. Items inside need explicit widths or `max-content`. Or there's a stray padding/margin somewhere.

## When to NOT use this pattern

- If the scene only has 1 content section (header + a single list), a static card with flex-centered content is simpler and faster to render.
- If the scene is shorter than 8 seconds total, the morph reveals don't have time to breathe â€” collapse to a single state.
- If the user wants the card visible from the start of a longer narration (no compact reveal), skip Morph 1 and start in logos-state.

