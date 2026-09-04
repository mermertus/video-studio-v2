---
name: make-a-video
description: Beginner-friendly end-to-end video creator for HyperFrames. Use when the user says "make a video", "create a video", "new video", "build a video", "video from scratch", "I want to make a video", "help me create a video", or when someone who's never used HyperFrames before arrives with a concept, script, or rough idea and wants a finished MP4. Interviews the user in one pass, then builds the full video with mandatory preview and visual-verification gates. Para cues especificos de formato (reel 9:16 -> short-form-video; VSL/largo -> long-form-video; panel+cara -> split-screen-panels; URL -> website-to-hyperframes) usar esas skills directo; make-a-video es para el cue ambiguo 'hacer un video' sin formato decidido.
---

# Make a Video â€” The Beginner-to-Finished-MP4 Skill

Two phases, eight sequential gates. Every gate produces a concrete artifact the next gate consumes. Don't skip gates.

## When to use this skill â€” and when to hand off

**Use this skill when:**
- The user is new to HyperFrames and starting from a concept, script, or outline
- They want an end-to-end walkthrough, not framework reference material
- They haven't decided on format yet

**Hand off when:**
- The user pastes a URL and wants a video from that site â†’ invoke `/website-to-hyperframes`
- The user explicitly wants a 9:16 vertical talking-head with face-cam + scene overlays â†’ run Gates 1â€“4 here, then invoke `/short-form-video` from Gate 5 onward
- The user asks for framework rules, not a video â†’ invoke `/hyperframes`

## The two phases

- **Phase 1 â€” INTERVIEW (Gates 1â€“4):** one conversational pass to gather *everything* before touching code. Intent, format, script, voice, style, assets, pacing. Synthesize into a `BRIEF.md` and wait for explicit approval.
- **Phase 2 â€” BUILD (Gates 5â€“8):** scaffold â†’ storyboard â†’ compositions â†’ lint â†’ Studio preview â†’ draft render â†’ visual verification â†’ MP4 preview â†’ final render.

---

## Gate 1 Â· Intent & format

Ask one question at a time via `AskUserQuestion`, multiple-choice where possible.

1. What's this video for? (promo Â· social ad Â· launch teaser Â· product demo Â· tutorial Â· explainer Â· intro/outro card Â· other)
2. Who's the audience? (open-ended)
3. Target duration? (10â€“20s short Â· 20â€“45s promo Â· 45â€“90s explainer Â· 1.5â€“3 min lesson Â· custom)
4. Aspect ratio? (16:9 1920Ã—1080 Â· 9:16 1080Ã—1920 Â· 1:1 1080Ã—1080)
5. Frame rate? (30 default Â· 60 for crisp UI Â· 24 cinematic)
6. Platform / delivery constraints? (file size Â· deadline Â· where it'll play)

**Gate:** all six captured. If the answer is 9:16 + face-cam, plan to hand off to `/short-form-video` at Gate 5.

Full question bank: `Read: references/interview-questions.md`

---

## Gate 2 Â· Script & voice

1. Script source? (paste Â· outline â†’ I'll draft Â· I'll record Â· TTS from text Â· no narration)
2. If TTS: voice preference. Offer choices from `npx hyperframes tts --help`. Also capture pace.
3. If face-cam: recording path Â· full-screen or corner placement Â· need transcription? (`npx hyperframes transcribe <file> --model small.en --json`)
4. Captions? (off Â· hype Â· corporate Â· karaoke-word-by-word Â· minimal)

**Gate:** script captured (or drafted), audio plan captured, caption plan captured.

---

## Gate 3 Â· Style intake

**Before asking the user anything, inventory existing assets.** Check `<workspace-root>/assets/` and any project `assets/` folder. Don't ask for what's already there.

Then ask progressively â€” they don't need answers to all of these:

1. Style guide or brand doc? (paste/path Â· no)
2. Color palette? (hex codes Â· none â€” use MOTION_PHILOSOPHY defaults)
3. Fonts? (Google Fonts name(s) Â· file paths Â· none â€” use Inter + JetBrains Mono defaults)
4. Logo file? (path Â· none â€” use text wordmark instead)
5. Reference videos for vibe? (URLs/paths Â· none)
6. Other assets? (screenshots Â· product photos Â· b-roll Â· music â€” list paths)
7. MOTION_PHILOSOPHY aesthetic (black canvas Â· chrome type Â· perspective grid Â· whip transitions) or a different feel?
8. Pacing? (kinetic 1â€“2s Â· balanced 2â€“3s Â· relaxed 3â€“5s)
9. Music? (none Â· ambient pad 0.15 Â· music bed 0.4 Â· full 0.8 â€” file path if they have one)
10. Outro / call-to-action text?

**Never impose a brand on the user.** Fall back to MOTION_PHILOSOPHY defaults *only* when they explicitly decline to supply a style.

Full style flow + MOTION_PHILOSOPHY defaults: `Read: references/style-intake.md`

---

## Gate 4 Â· Brief synthesis (HARD-GATE before building)

1. **Read `MOTION_PHILOSOPHY.md`** if it exists in the workspace root â€” mandatory if present. If missing, proceed with the defaults in `references/style-intake.md` and note the absence in the brief.
2. **Ask where projects live** if it's not obvious:
   - If `video-projects/` exists â†’ use `video-projects/<slug>/`
   - Otherwise â†’ ask the user
3. **Write `<project-folder>/BRIEF.md`**:
   - slug Â· intent Â· audience Â· dimensions Â· fps Â· duration
   - script (full or outline)
   - voice choice Â· caption plan Â· face-cam plan
   - style profile: palette (hex), fonts, logo path, reference videos
   - pacing
   - asset inventory with paths
   - outro / CTA text
4. **Show the brief. WAIT for explicit approval.** Don't proceed to Gate 5 without a clear "yes, build it."

---

## Gate 5 Â· Scaffold & storyboard

### Handoff check first

If the brief describes a 9:16 vertical talking-head with face-cam + scene overlays, invoke `/short-form-video` NOW and hand off the brief. Its 4-layer scaffold is purpose-built for that format.

Otherwise continue:

### Scaffold

1. `mkdir <project-folder>`
2. If a sibling project with similar format exists, offer to copy its `hyperframes.json` + `meta.json` as a template. Otherwise from inside the folder: `npx hyperframes init`
3. Edit `meta.json` with the user's slug, dimensions, fps.
4. Copy supplied assets into `<project-folder>/assets/`.
5. Create `<project-folder>/assets/style-profile.md` from Gate 3 â€” single source of truth for palette/fonts/logo.

### Storyboard

Generate `<project-folder>/STORYBOARD.md` using the template in `references/storyboard-template.md`. Every beat gets:

```
Beat N â€” TITLE (startâ€“end, duration) â€” Concept in one sentence
Visual elements: [each element, size, animation, timing]
Motion language: [kind of motion]
Eases used: [3â€“4 distinct GSAP eases]
Exit: [transition into next beat]
Audio: [VO line / SFX / music layer]
```

Top of file: a timing table with scene Â· start Â· duration Â· composition file.

**Propose a rule-of-threes structure:**
- Act 1 (hook) â‰ˆ 20% of duration
- Act 2 (body) â‰ˆ 55%
- Act 3 (payoff + outro with 4â€“6 second hold) â‰ˆ 25%

(MOTION_PHILOSOPHY Â§0 Law 9, Â§1.)

**Map user intents â†’ catalog blocks:** `Read: references/catalog-intent-map.md`

**Gate:** show storyboard + timing table. Iterate until the user approves.

---

## Gate 6 Â· Build compositions

Invoke `/hyperframes` for framework rules. This skill owns the scaffold and discipline; `/hyperframes` enforces the rules.

### Scaffold every sub-composition

```html
<div data-composition-id="scene-name" data-start="..." data-duration="...">
  <style>[data-composition-id="scene-name"] { /* scoped */ }</style>
  <!-- DOM -->
  <script>
    (function(){
      const SLOT_DURATION = ...;
      const tl = gsap.timeline({ paused: true });
      // ... tweens ...
      tl.to({}, { duration: SLOT_DURATION }, 0);   // anchor â€” MOTION_PHILOSOPHY Law 11
      window.__timelines["scene-name"] = tl;
    })();
  </script>
</div>
```

Full boilerplate + captions pattern + ambient-bg pattern: `Read: references/composition-scaffold.md`

### Build rules

- **Ambient background** on `data-track-index="0"` for the full composition duration.
- **Kinetic-type openers:** per-word stagger 0.06â€“0.10s.
- **Captions** as body-level siblings of the root composition in `index.html`, each with `data-track-index â‰¥ 20`. Never inside scene timelines (MOTION_PHILOSOPHY Â§3.13).
- **Catalog blocks** installed via `npx hyperframes add <name>`. Immediately **scope the block's CSS** to `[data-composition-id="..."]` â€” catalog blocks ship with `html, body { ... }` rules that bleed into the parent document when loaded as sub-compositions.
- **Vertical + face-cam:** wrap native 1920Ã—1080 face in a transform (`translate` + `scale`) for bottom-half or full-screen mode. (If you end up here instead of `/short-form-video`, strongly consider the handoff.)
- **Apply ONLY what the user supplied.** Their palette, their fonts, their logo. Don't inject anything else. If they chose MOTION_PHILOSOPHY defaults, pull the palette + font pair from `references/style-intake.md`.

### Determinism

No `Math.random()`, no `Date.now()`, no render-time `fetch()`. Use seeded PRNGs or harmonic-sin hashes (MOTION_PHILOSOPHY Â§3.10).

---

## Gate 7 Â· Lint â†’ Studio preview (PREVIEW GATE 1 â€” MANDATORY)

1. `npx hyperframes lint` â€” fix all errors, triage warnings.
2. `npx hyperframes preview` in the background.
3. Wait for "Studio running" on `http://localhost:3002`.
4. Hand the user the URL **plus** individual composition URLs (`http://localhost:3002/?comp=<id>`). If the project has WebGL shader blocks, lead with the individual URLs â€” software WebGL fallback can stall the master composition.
5. **WAIT for explicit "looks good, render a draft"** before proceeding. Silence is not approval.

Hot reload is on â€” edits show up live.

---

## Gate 8 Â· Draft render â†’ visual verification â†’ MP4 preview â†’ final

### Draft render

```bash
npx hyperframes render --quality draft --output renders/<slug>-draft.mp4
```

### Visual verification (MANDATORY before delivery)

Lint passing â‰  design working. Extract frames and **view them**.

1. `mkdir -p renders/frames`
2. For every beat hero moment AND every transition:
   ```bash
   ffmpeg -y -ss <t> -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 renders/frames/t<t>.png
   ```
3. **Call the `Read` tool on every PNG.** The Read tool loads the image into context â€” don't just list filenames.
4. Confirm per frame: no cropped faces, correct face-mode per scene, text readable and on-palette, no overflow, transitions land on intended words, no blank frames.
5. If anything's wrong: fix â†’ re-render â†’ re-verify. Never ship a broken draft.

### MP4 preview (PREVIEW GATE 2 â€” MANDATORY)

```bash
npx serve renders -p 8080 -n
```

Do NOT use Python's `http.server` â€” it doesn't support HTTP Range requests, so scrubbing breaks.

Hand the user `http://localhost:8080/<slug>-draft.mp4`. **WAIT for explicit sign-off** on playback and audio sync.

### Final render

```bash
npx hyperframes render --quality standard --output renders/<slug>-final.mp4
```

Report the output path. Done.

Full preflight + pre-delivery checklist: `Read: references/build-checklist.md`

---

## Non-negotiables (load-bearing â€” do not soften)

- **DO NOT skip PREVIEW GATE 1 (Studio) or PREVIEW GATE 2 (rendered MP4).** Two gates per build, always.
- **DO NOT claim a render is done** until frames have been extracted AND Read via the Read tool.
- **DO NOT build anywhere but inside a dedicated project folder.** Never put `index.html` at the workspace root.
- **DO NOT ask the user for assets** before inventorying their workspace.
- **DO NOT skip the `tl.to({}, { duration: SLOT_DURATION }, 0)` anchor tween** at the end of every sub-composition timeline. MOTION_PHILOSOPHY Law 11.
- **DO NOT use `Math.random()` / `Date.now()`** inside render logic. Seeded hashes only.
- **DO NOT add `class="clip"` to `<video>` tags.** It breaks them.
- **DO NOT impose a brand on the user.** Ask first; fall back to MOTION_PHILOSOPHY defaults only when they explicitly decline.

---

## References

- `references/interview-questions.md` â€” full question bank by Gate
- `references/style-intake.md` â€” style interview + MOTION_PHILOSOPHY defaults
- `references/catalog-intent-map.md` â€” "user says X â†’ install Y"
- `references/storyboard-template.md` â€” beat-by-beat template + worked example
- `references/composition-scaffold.md` â€” scoped-styles + IIFE GSAP boilerplate
- `references/build-checklist.md` â€” preflight + pre-delivery gates

External (workspace-level):
- `MOTION_PHILOSOPHY.md` â€” the one external reference this skill assumes exists. Aesthetic baseline. Fallback lives in `references/style-intake.md` if the file is missing.

## Related skills

- `/hyperframes` â€” framework rules, invoke at Gate 6
- `/hyperframes-cli` â€” init Â· lint Â· preview Â· render Â· transcribe Â· tts
- `/hyperframes-registry` â€” installing catalog blocks
- `/gsap` â€” GSAP animation reference
- `/short-form-video` â€” hand off at Gate 5 for 9:16 talking-head format
- `/website-to-hyperframes` â€” hand off at Gate 1 if the starting input is a URL

