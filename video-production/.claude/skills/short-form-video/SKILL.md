---
name: short-form-video
description: Build and iterate short-form vertical (9:16) videos in Hyperframes â€” TikTok/Reels/Shorts style. Use when the user asks for "short-form video", "vertical video", "TikTok/Reels/Shorts", "make a short", "talking-head + motion graphics", or when the target is a 1080x1920 composition with face video + synced scene overlays + karaoke captions. Encodes the full short-form playbook: face-mode choreography, audio-synced scene timing, karaoke captions, and the 10-rule quality checklist. NO usar para video horizontal largo/VSL (long-form-video) ni para panel grande que tapa la cara (split-screen-panels).
---

# Short-Form Vertical Video (Hyperframes)

Short-form = 1080x1920 vertical, 10â€“30s, talking-head face + motion-graphic scene overlays + karaoke captions. Everything in this skill is distilled from short-form iteration autopsies (v1 â†’ vN) and should be applied on every new short.

**Always invoke `/hyperframes` first.** This skill sits on top of it â€” it does not replace the framework rules (`data-*` attributes, `window.__timelines`, composition structure). Those are non-negotiable regardless of the format.

## When this skill fires

- "Make a short-form video", "TikTok post", "Reels", "Shorts", "vertical video"
- Any build starting from a talking-head recording + script/transcript intended for social
- Retiming, recutting, or re-syncing an existing short
- Adding karaoke captions synced to a voiceover

## The playbook (high-level)

### Contrato María: hook, sticker y listas

En todos los vídeos de María, detectar y preservar primero el hook textual
pronunciado. Antes de la enumeración debe existir además un hook visual creado
con un sticker real: ilustración, objeto o recorte con silueta propia, nunca una
card, panel, chart o caja de texto. El sticker puede moverse tipo GIF de forma
finita y determinista, con SFX sincronizado.

Cada numeral inicia un caption nuevo. Todo cambio de fondo, layout, contraste o
fase fuerza otro caption, incluso si el timestamp es exactamente igual al final
de una palabra. Las peticiones explícitas son requisitos bloqueantes. Ejecutar
`node scripts/validate-editorial-structure.mjs <project-folder>` y comprobar cada
frontera un frame antes, en el límite y un frame después.

1. **Audio is source of truth.** Edit audio FIRST (cut retakes, pauses). Save as `<name>-edit.mp4`. Measure exact duration with `ffprobe` â€” this is the composition's `data-duration`.
2. **Transcribe the edited audio** with `npx hyperframes transcribe <edit>.mp4 --model small.en --json`, or if retiming an existing build with a `shift()` function in captions, keep the existing captions and just shift scene starts.
3. **Author scene boundaries in edited-time** â€” NEVER mix original-time and edited-time anchors in the same file. See "Audio-sync protocol" below.
4. **Build the composition scaffold** (4 layers: ambient-bg, seam-treatment, captions, face) â€” see "Composition scaffold" below.
5. **Author scenes with LOCAL offsets** relative to each scene's `data-start`. Each scene is its own sub-composition under `compositions/scene<N>-<label>.html`.
6. **Lint â†’ draft render â†’ word-exact frame verification â†’ final render.** This is the verification gate. Never skip step 3 (frame verification).

## Composition scaffold (the 4 always-on layers)

Every short-form vertical has these four sub-compositions under `compositions/`, loaded on shared tracks:

```
index.html (root, 1080x1920, data-composition-id="main")
â”œâ”€â”€ ambient-bg.html        track-index="3" â€” radial gradient + drift grid + particles + vignette
â”œâ”€â”€ face-wrapper + <video> track-index="0" â€” talking head (see face-mode choreography)
â”œâ”€â”€ seam-treatment.html    track-index="5" â€” feathers y=960 edge (bottom-half scenes only)
â”œâ”€â”€ scene1-<label>.html    track-index="1" â€” scene overlays (back-to-back, no gaps)
â”œâ”€â”€ scene2-<label>.html    track-index="1"
â”œâ”€â”€ â€¦
â””â”€â”€ captions.html          track-index="2" â€” karaoke captions, word-synced
```

- `data-duration` is identical across root, ambient-bg, seam-treatment, face-video, face-audio, captions. Only scene overlays change over time.
- `<audio>` for the face is a SEPARATE element (mixer needs it), never use the video's own audio track.
- `class="clip"` goes on timed divs â€” NEVER on `<video>` or `<audio>`.

## Face-mode choreography (the signature move of short-form)

The face lives in a wrapper div sized at the source's native landscape (1920x1080). GSAP animates the WRAPPER (never the video element â€” animating `<video>` dimensions freezes frames).

Two modes:

```js
const BOTTOM     = { x: 0,       y: 1136, scale: 0.5625 }; // bottom-half, full landscape visible
const FULLSCREEN = { x: -1166.5, y: 0,    scale: 1.7778 }; // cropped-cover, fills 1080x1920
const MODE_DUR = 0.32;
```

`BOTTOM` renders the 1920x1080 source at 1080x607.5 centered in the bottom 960px. `FULLSCREEN` crops horizontally to fill the portrait frame.

**Transition 0.15s BEFORE the new scene's content lands**, using `ease: "expo.inOut"`:

```js
[
  { t: <scene-4-start>, mode: FULLSCREEN },
  { t: <scene-5-start>, mode: BOTTOM },
  â€¦
].forEach(({ t, mode }) => {
  mainTl.to("#face-wrapper", { ...mode, duration: MODE_DUR, ease: "expo.inOut" }, t - 0.15);
});
```

A face that snaps modes instantly is the single most jarring frame in a vertical video. Always interpolate.

### Face grading (every short, no exceptions)

```css
#face-video {
  filter: contrast(1.08) saturate(1.08) brightness(0.97);
}
```

Plus a subtle 1.00 â†’ 1.025 Ken Burns zoom over the full duration (`ease: "none"`) and a side-vignette `::after` pseudo-element so the face sinks into the surrounding navy instead of butting against a razor edge.

### Seam treatment (required for bottom-half scenes)

A navyâ†’transparent gradient band (60â€“100px) at y=960 plus a 2px accent scan line with soft glow. Draw it AFTER the face so it sits on top; full-screen scenes will cover it when they take over. Razor-sharp y=960 cuts are the #2 tell for AI-edited content (after background flatness).

## Audio-sync protocol (DO NOT skip)

**Problem:** if audio is edited (retakes/pauses removed), timestamps in the source transcript no longer match the edited video. Scene starts authored in original-time will fire late.

**The rule:** ALL timing lives in edited-time. Never mix.

**Verification procedure for any short-form retime:**

1. Measure both audio files:
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/original.mp4
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/<name>-edit.mp4
   ```
   Difference = total cut time.
2. If using a `shift()` function in `captions.html` to map transcript words, treat that as the source of truth. The map `shift(originalTime) = editedTime` applies to EVERY scene `data-start` too.
3. Scene internal offsets (inside `compositions/sceneN.html`) are LOCAL relative to the scene's `data-start`. If a scene's parent `data-start` is correct in edited-time, internal offsets stay correct WITHOUT modification â€” UNLESS a scene straddles a cut, in which case both the parent duration AND internal offsets shift.
4. Face-mode transition array times MUST use edited-time. They are NOT automatically shifted.

**Plan format for retimes** (use this table structure every time):

| Scene | Current start | Current dur | New start | New dur | Rationale |
|-------|---------------|-------------|-----------|---------|-----------|
| ...   | ...           | ...         | ...       | ...     | ...       |

Then the face-mode array, then any internal-offset changes, then frame-verification list.

## Scene authoring

One scene = one sub-composition file. Scenes sit on the same `data-track-index` back-to-back (no gaps). Inside each scene:

- `data-duration` matches the parent's slot exactly
- All GSAP anchors are LOCAL (0-based from scene start)
- Use `tl.set({}, {}, <data-duration>)` to pad the timeline so GSAP `tl.duration()` matches `data-duration`

### Scene pacing rules (from the 10 principles)

- **No dead frames.** Every 100ms has â‰¥1 animating element. Offset first entrance 0.1â€“0.3s, not t=0.
- **Payoff â‰¥ 1s hold.** The "big reveal" of the scene (stamp, number lock, punchline) must have â‰¥1s on screen, ideally 1.5s. Budget scenes by reveal time, not total time.
- **Motion through full duration.** If entrance anims all land by local 2s on a 4s scene, add secondary motion: underline sweeps, checkmark pops, ambient drift on cards, small oscillating glows on pills. Dead pacing = swipe-away.
- **Vary eases.** At least 3 different eases per scene across entrances.
- **One jaw-dropper per 5s of runtime.** Typography slam, glitch/chromatic reveal, whip-pan, audio-sync slam. Without these, the video reads as "labeled talking head" â€” correct but forgettable.

## Captions (karaoke style)

- Montserrat 900, 46â€“58px (for 1080 width), 100% white base
- Active word: scale-1.08 pop + color change to brand accent (Maria: verde-lima `#c8e500` or rojo `#e63946` â€” see `DESIGN.maria-brand.md`; adapt for client brands)
- Stroke via layered `text-shadow`, NEVER `-webkit-text-stroke` (renders inconsistently in Chromium render)
- Drop the rgba background pill â€” let the stroke hold readability. Captions should feel like graffiti on the frame, not a subtitle track.
- For retimes, use a `shift()` function inside `captions.html` to map transcript word timestamps â†’ edited-time. This keeps the transcript JSON untouched and makes retimes mechanical.

See `references/captions.md` under `/hyperframes` for the full karaoke implementation. TL;DR: per-word `<span>` elements with `data-word-start`, GSAP tweens scoped to each span, tight 0.08â€“0.12s pop durations.

## Ambient background (never ship flat navy)

Minimum viable background stack:

1. **Radial gradient base** (center lighter than edges by 15â€“20%)
2. **Animated noise/grain overlay** at 8â€“12% opacity
3. **4â€“8 drifting particle dots** or grid traces
4. **Subtle vignette**

`background: #07121c` alone is a placeholder, not a design. For techy/control-room aesthetic, use the 6-layer stack from `feedback_techy_background_layers.md` (HUD grid masked to vignette + circuit traces + pulse nodes + scan beam + telemetry ticker + corner mono labels).

## Audio reactivity

- Headlines pulse 3â€“6% on beat. Backgrounds can go 10â€“30% on bass.
- Text reactivity kept subtle (3â€“6%) so captions stay readable; backgrounds can push harder.
- Use a SEEDED offline analyser (pre-compute the audio feature track) so renders are deterministic. Do NOT use `AnalyserNode` in the render path â€” `Math.random()` and real-time audio nodes break determinism.

## Transitions

- **Rotate flavors.** No two consecutive transitions the same type. Six hard cuts in a row is the #1 tell for AI editing.
- Face-mode transitions (`BOTTOM â†” FULLSCREEN`) double as scene transitions when the mode changes between scenes.
- For pure overlay scene-to-scene, install from registry: `push-up`, `flash-through-white`, `sdf-iris`, or the full shader-transitions pack. `npx hyperframes catalog --type block` to browse.

## The verification gate (mandatory â€” DO NOT ship without)

Lint passing â‰  design working. Never report a short-form render done until you have extracted frames at word-exact timestamps and READ every PNG.

### Step 1 â€” draft render

```bash
cd video-projects/<slug>
npx hyperframes lint
npx hyperframes render --quality draft --output renders/<slug>-vN-draft.mp4
```

### Step 2 â€” word-exact frame extraction

Pick 8â€“15 timestamps that each correspond to a SPOKEN WORD where a specific visual should be on-screen. Not round numbers. Not mid-scene. The exact word.

```bash
mkdir -p renders/frames-vN
for pair in "<t>:<label>" "<t>:<label>" ...; do
  t="${pair%%:*}"; label="${pair##*:}"
  ffmpeg -y -ss "$t" -i renders/<slug>-vN-draft.mp4 \
    -frames:v 1 -q:v 2 "renders/frames-vN/t${t}-${label}.png"
done
```

### Step 3 â€” Read every PNG

Call `Read` on every PNG so the image loads into context. Do NOT just list filenames. For each frame confirm:

- The expected visual is on-screen at the expected moment (not 1s late, not early)
- Speaker's face is not cropped in any bottom-half scene
- Full-screen vs bottom-half face mode is correct for that scene
- Captions are on-brand, readable, not overflowing
- No blank frames, no unintentional overlap, no text-off-canvas

### Step 4 â€” if anything fails, fix + re-verify. Never ship broken.

### Step 5 â€” final render

```bash
npx hyperframes render --quality standard --output renders/<slug>-vN.mp4
```

Spot-check 3â€“4 frames from the final render (same timestamps, different folder `frames-vN-final/`) to confirm the standard-quality encode didn't change anything.

## The 10 rules (quality checklist â€” run BEFORE first draft)

Every short-form build. Run this list during authoring, not after.

1. **No dead frames.** Every 100ms has an animating element.
2. **Scene payoff â‰¥ 1s hold.** Budget by reveal time, not total time.
3. **Face is a character.** Grade + Ken Burns + side vignette.
4. **No hard seams.** Feather y=960 with gradient + scan line.
5. **One jaw-dropper per 5s.** Typography slam, glitch, whip-pan, audio slam.
6. **Audio reactivity non-negotiable.** 3â€“6% text, 10â€“30% background.
7. **Rotate transition flavors.** No two consecutive the same.
8. **Captions pop, don't politely label.** Stroke not pill. Scale + color on active word.
9. **Motion through full scene duration.** Secondary motion if entrances land early.
10. **Background is a layer, not a color.** Radial + noise + particles + vignette minimum.
11. **Slam/stamp overlays land AFTER target text is fully visible.** Reveal logic > word-sync. Stamp `t` â‰¥ target-visible `t` + 0.10â€“0.25s. Otherwise the punchline lands before the setup.

## Project structure (every short-form project)

```
video-projects/<slug>/
â”œâ”€â”€ hyperframes.json
â”œâ”€â”€ meta.json                    (id, name, dimensions 1080x1920, fps 30)
â”œâ”€â”€ index.html                   (root composition, the 4-layer scaffold)
â”œâ”€â”€ compositions/
â”‚   â”œâ”€â”€ ambient-bg.html
â”‚   â”œâ”€â”€ seam-treatment.html
â”‚   â”œâ”€â”€ captions.html            (with shift() function if retiming)
â”‚   â”œâ”€â”€ scene1-<label>.html
â”‚   â”œâ”€â”€ scene2-<label>.html
â”‚   â””â”€â”€ ...
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ <name>.mp4               (original recording)
â”‚   â”œâ”€â”€ <name>-edit.mp4          (edited â€” cuts removed â€” this is what the comp uses)
â”‚   â”œâ”€â”€ transcript.json          (whisper output)
â”‚   â””â”€â”€ brand assets (logo, maria-tokens.css, background music)
â””â”€â”€ renders/
    â”œâ”€â”€ <slug>-v1-draft.mp4
    â”œâ”€â”€ frames-v1/
    â”œâ”€â”€ <slug>-v1.mp4
    â””â”€â”€ ...
```

## Retime protocol (when audio is re-edited or timestamps drift)

1. Measure old and new edited audio durations with `ffprobe`. Delta = total cut time.
2. Identify cut window(s): which seconds were removed, from where.
3. Write the Plan table: every scene `data-start`, `data-duration`, every face-mode transition `t`, any scene whose internal offsets straddle a cut.
4. For each scene that straddles a cut, both its parent duration AND its internal offsets change. Scenes entirely on one side of the cut just need parent `data-start` shifted.
5. Lint â†’ draft render â†’ word-exact frame verify â†’ final render. No shortcuts.

## What NOT to do in short-form

- Don't animate `<video>` element dimensions â€” freezes frames. Animate wrapper div.
- Don't use `repeat: -1` on any timeline â€” breaks the capture engine. Finite counts only.
- Don't use `Math.random()` or `Date.now()` â€” breaks determinism. Seeded PRNG if pseudo-random needed.
- Don't use `<br>` inside captions â€” natural wrapping + `<br>` produces extra unwanted breaks.
- Don't skip the frame verification gate. Lint exit code is not visual truth.
- Don't author in original-time if the audio is edited. Edited-time or nothing.
- Don't leave `background: #07121c` flat. Layer it.
- Don't hard-cut between scenes. Rotate transition flavors.
- Don't polite-caption. Pop them.
- Don't let the face sit still. Grade + Ken Burns always.

## Lessons from past short-form iterations (v1 â†’ v2)

Distilled from the 4 concrete problems v1 renders tend to have and what fixes them in v2. Apply these on every new short.

### 1. Slam/stamp timing â€” reveal logic beats word-sync

A SLAM/STAMP overlay (KILLED, DEAD, STOP, etc.) lands AFTER its target text is fully visible, **not** during the spoken word. Example case study: a v1 scene pitched two products as opponents â€” the KILLED stamp fired at local 0.46s while the second product name didn't appear until 0.66s, so viewers saw "Product A â€¦ KILLED" with no visible target. The joke collapsed.

**Rule:** `stamp_t â‰¥ target-text-visible_t + 0.10â€“0.25s`. The "visible" timestamp is the END of the target's entrance animation, not its start. Word-sync is a guideline; visual reveal order is the constraint.

### 2. BOTTOM face-mode scale â€” don't ship the default

Default `BOTTOM = { x: 0, y: 1136, scale: 0.5625 }` (exact horizontal fit for a 1920Ã—1080 source) leaves empty studio background flanking the speaker if they occupy <70% of the source frame. Past v1 builds shipped this default and had visible dead space left and right of the speaker in every BOTTOM scene.

**Rule:** prefer `BOTTOM = { x: -180, y: 1110, scale: 0.75 }` â€” crops 180px each side, bottom-anchors to y=1920. Preview ONE frame of BOTTOM mode against the actual source video before committing the constant. If the source speaker is tight-framed already, scale 0.65 may be enough; if the source is wide studio framing, push to scale 0.80 and re-tune x.

Always keep HIDDEN's `x`, `y`, `scale` identical to BOTTOM â€” they only differ in `opacity` â€” so the opacity-fade scenes don't drift geometrically mid-fade.

### 3. Face-mode transitions â€” three things at once, not one

When the face changes mode between adjacent scenes, a bare 0.15s pre-roll + 0.32s duration `expo.inOut` on just the face wrapper reads as rigid â€” the outgoing scene's panels are still fully opaque behind the morphing face, so the eye sees two things fighting instead of a crossfade.

**Rule:** for any "hero" scene-to-scene face-mode change (especially BOTTOM â†” FULLSCREEN), do all three:
1. Extend that specific transition's duration to 0.45â€“0.55s (not the default 0.32s)
2. Start it 0.25â€“0.30s before the new scene's `data-start` (not the default 0.15s)
3. Fade + blur the outgoing scene's panel wrapper to `opacity: 0, filter: blur(6px)` over 0.20â€“0.25s, starting 0.25s before scene end

Implementation-wise, promote the face-mode transition array to per-entry `dur` so one transition can be longer than the others:
```js
[ { t: 2.06, mode: FULLSCREEN, dur: 0.50 }, { t: 3.71, mode: HIDDEN, dur: 0.32 }, ... ]
  .forEach(({ t, mode, dur }) => mainTl.to("#face-wrapper", { ...mode, duration: dur, ease: "expo.inOut" }, t));
```

Three simultaneous changes = "a real editor edited this." Any one alone = rigid.

### 4. Data-feel scenes beat decoration scenes mid-video

For scenes 3â€“5 of a 15â€“20s short (the "middle grind" where attention drops the hardest), lean on visuals that read as information â€” bar races, stat grids with counting numbers, heatmaps, sparklines, flowcharts, dashboard chrome with telemetry ticking, pain-point grids that flash red in sequence. Past case study: a v1 middle scene built around radar-rings + terminal-chip + sparks read as functional but decorative â€” feedback came back as "bland." v2 replaced it with a 3Ã—3 pain-point grid lighting up red-orange in sequence + a sparkline stroke-drawing with a YOU-ARE-HERE marker + the payoff slam â€” same time budget, much higher engagement.

**Rule:** pure typography-plus-icon scenes feel like slides. Data-feel scenes feel like evidence. When a middle scene feels bland, replace the decoration with something that reads as *information*: a small number ticking up, a bar filling, a chart stroking in, a grid flashing in sequence.

## Reference compositions (Maria canon)

- `video-projects/_maria-template/` â€” canonical starting scaffold for new shorts (1080x1920, 4-layer structure, brand assets pre-wired). Clone this when starting a new project.
- `video-projects/_maria-C2-comenta-ayuda/` â€” gold-standard Maria short for text + motion graphics on 9:16. Reference for caption pacing, hold times, and CTA execution.
- `video-projects/_maria-CPL-Bajo/` â€” reference for liquid-glass cards (backdrop-filter verde-botella) + split-screen calibrated (SPLIT_Y=-440, panel top:1040/height:880) + comparativa two-cards with VS badge.
- `video-projects/_maria-C1_ABO-vs-CBO/` â€” reference for split-screen with face-wrapper translateY re-centering of the speaker, plus raw with title baked-in + CTA widget IG.
- `video-projects/_maria-C2-DM/` â€” reference for split-screen pedagÃ³gico where motion explains without saturating with copy; text only on final CTA + 1-word labels.

Read `index.html` and the `compositions/scene*.html` files of the closest reference before authoring a new short.

## Related skills (invoke in addition)

- `/hyperframes` â€” framework rules (always first)
- `/hyperframes-cli` â€” CLI commands (init, lint, preview, render)
- `/gsap` â€” animation library reference
- `/hyperframes-registry` â€” installing transition blocks
- `/seedance-loop-prompt` â€” if the short needs an AI-generated looping background video

## Memory pointers (relevant feedback entries)

- `feedback_short_form_principles.md` â€” the 10 rules, full rationale
- `feedback_contrast_technique.md` â€” glow localization + text-shadow halos + brightening dim text
- `feedback_techy_background_layers.md` â€” 6-layer control-room background stack
- `feedback_visual_verification.md` â€” the verification gate
- `DESIGN.maria-brand.md` (workspace root) â€” Maria brand spec (hex codes, fonts, logo, motion patterns)

