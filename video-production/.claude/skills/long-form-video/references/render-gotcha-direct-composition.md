# Render gotcha: render direct, not via index.html

**Symptom**: rendering the master `index.html` (which embeds `compositions/full-pt1.html` as a `<template data-composition-src>` sub-composition) produces an MP4 with all blank frames. Render logs show:

```
[Browser:PAGEERROR] Cannot read properties of null (reading 'appendChild')
[FrameCapture] Sub-composition timelines not registered after 45000ms: full-pt1.
Compositions that load data asynchronously (e.g. fetch) must register window.__timelines[id] after setup completes.
```

The renderer waits 45s for `window.__timelines['full-pt1']` to register, never sees it, then captures whatever the initial DOM state was (paused-at-zero, mostly invisible elements). The output file exists at the expected size for video header + raw frame data but every frame is the bg color.

## Root cause

When Hyperframes expands the sub-composition during render, the script in `full-pt1.html` runs in a context where `document.getElementById('captions-host')` (and similar lookups) returns `null` â€” the sub-composition's DOM hasn't been fully injected into the live document by the time the IIFE runs. The script then calls `appendChild` on null, throws, and never reaches the line that registers the timeline.

Studio preview at `?comp=full-pt1` does NOT have this problem because the URL loads the composition's HTML directly as a top-level page â€” no template expansion, no timing race.

## Workaround (always use)

```bash
npx hyperframes render --quality draft --composition compositions/full-pt1.html --output renders/full-pt1-draft.mp4
```

The `--composition` flag tells Hyperframes to render that specific composition file directly, as if it were the master. Sub-compositions that DOES embed nothing (or only static blocks) work fine; the issue is specifically about templated sub-compositions whose scripts depend on DOM elements injected at runtime.

## What NOT to do

- Don't add `setTimeout` / polling to wait for the captions-host. Even when the element eventually appears, the renderer has already timed out waiting for the timeline.
- Don't try to inline the captions JSON to skip the fetch. The fetch itself is fine; the failure is the DOM lookup AFTER the fetch.
- Don't suppress the appendChild error and hope the timeline registers. The captions are visible in the final composition; you need them.

## When you'd want to render via index.html anyway

If you have a true multi-composition reel (full-pt1 + testimonios + outro joined together as one master timeline), you need to render `index.html` to get the joined output. In that case, you must:

1. Refactor every sub-composition's script to be defensive against null DOM lookups, AND
2. Wait for the elements explicitly (use `MutationObserver` or `requestAnimationFrame` polling with a budget under 45s), AND
3. Register the timeline EVEN IF some elements are missing (so the runtime doesn't time out).

This is a Hyperframes framework limitation. File an issue upstream rather than fighting it scene-by-scene.

## Verification after every render

```bash
mkdir -p renders/verify-draft
for t in 5 50 100 200 350 410 460 510 540 550; do
  ffmpeg -y -ss $t -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 "renders/verify-draft/t${t}.png"
done
```

Then **Read** every PNG via the Read tool. A render with bg-color-only frames is the failure mode. Don't ship that.

