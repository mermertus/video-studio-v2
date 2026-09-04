# TOP_HALF choreography â€” full master-timeline chain

Reference for multi-scene compositions that cycle between `FULL`, `TOP_HALF`, and `PIP_BL` face modes. Extracted from `_maria-escalar-campaÃ±a/index.html` (7 scenes, 4 face transitions).

## The 3 modes (recap)

```js
const FULL     = { x: 0,  y: 0,    scale: 1.0  };
const TOP_HALF = { x: 0,  y: -480, scale: 1.0  };
const PIP_BL   = { x: 60, y: 1248, scale: 0.35 };
const MODE_DUR = 0.45;
```

`transform-origin: 0 0` on `#face-wrapper`. All three constants assume source is 1080Ã—1920 native.

## The buffer rule

Every face-mode transition fires **0.20s BEFORE** the `data-start` of the scene it's transitioning INTO. This is the key to not feeling rigid â€” the eye sees the face move, then the new scene's content lands on top of an already-settled face.

```
t - 0.20 : face transition starts (0.45s expo.inOut)
t + 0.25 : face has landed in new mode
t        : new scene's data-start (panel/diagram begins its entrance)
```

If the face transition starts AT `t` or AFTER, the viewer sees panel + face moving simultaneously â€” feels jittery, like two things fighting for attention.

## The PIP frame stagger

When transitioning INTO `PIP_BL`, the lime-green frame around the corner insert fades in **0.10s AFTER** the wrapper transform starts:

```js
mainTl.to("#face-wrapper",   { ...PIP_BL, duration: 0.45, ease: "expo.inOut" }, t - 0.20);
mainTl.to("#face-pip-frame", { opacity: 1, duration: 0.35, ease: "power2.out" }, t - 0.10);
```

Reason: the wrapper takes ~0.25s to visibly land in the corner. Fading the frame in at the SAME time looks like the frame is floating in empty space â€” lingering halfway through the shrink. Starting it 0.10s later lets the face arrive first, then the frame "snaps" into place around it.

**Exiting PIP** (going back to TOP_HALF or FULL): reverse the order. Fade the frame OUT first, THEN start the wrapper transform:

```js
mainTl.to("#face-pip-frame", { opacity: 0, duration: 0.35, ease: "power2.out" }, t - 0.30);
mainTl.to("#face-wrapper",   { ...TOP_HALF, duration: 0.45, ease: "expo.inOut" }, t - 0.20);
```

Same reason in reverse â€” a frame sitting around a growing/moving face looks like the frame is being stretched.

## Full 7-scene chain example (from `_maria-escalar-campaÃ±a`)

Times are `data-start` of each scene in seconds. The chain below is the exact master-timeline sequence.

```
Scene 1 hook       (t=0.00,  FULL)       â€” starts in FULL. No transition needed.
Scene 2 setup      (t=8.00,  TOP_HALF)   â€” fires at t=7.80.
Scene 3 golpe      (t=24.65, TOP_HALF)   â€” no transition, same mode.
Scene 4 insight    (t=35.68, PIP_BL)     â€” wrapper at t=35.48, PIP frame at t=35.58.
Scene 5 fase       (t=52.28, PIP_BL)     â€” no transition, same mode.
Scene 6 regla      (t=65.63, TOP_HALF)   â€” PIP frame out at t=65.33, wrapper at t=65.43.
Scene 7 CTA        (t=77.88, FULL)       â€” wrapper at t=77.68.
```

GSAP code equivalent:

```js
// Scene 1 â†’ 2: FULL â†’ TOP_HALF
mainTl.to("#face-wrapper", { ...TOP_HALF, duration: MODE_DUR, ease: "expo.inOut" }, 7.80);

// Scene 3 â†’ 4: TOP_HALF â†’ PIP_BL + frame fade-in
mainTl.to("#face-wrapper",   { ...PIP_BL, duration: MODE_DUR, ease: "expo.inOut" }, 35.48);
mainTl.to("#face-pip-frame", { opacity: 1, duration: 0.35, ease: "power2.out" },    35.58);

// Scene 5 â†’ 6: PIP_BL â†’ TOP_HALF, frame fade-out FIRST
mainTl.to("#face-pip-frame", { opacity: 0, duration: 0.35, ease: "power2.out" },       65.33);
mainTl.to("#face-wrapper",   { ...TOP_HALF, duration: MODE_DUR, ease: "expo.inOut" }, 65.43);

// Scene 6 â†’ 7: TOP_HALF â†’ FULL
mainTl.to("#face-wrapper", { ...FULL, duration: MODE_DUR, ease: "expo.inOut" }, 77.68);
```

## Race conditions to watch

### 1. Two face tweens overlapping

If two consecutive scenes have different modes AND their `data-start` values are less than ~0.6s apart, the two `mainTl.to(#face-wrapper, ...)` calls will overlap and the second will pick up the interpolated mid-state of the first. **Always merge them into a single `.to()` or space the transitions by â‰¥0.6s.**

### 2. PIP frame visible during TOP_HALF

If you forget to set PIP frame `opacity: 0` at t=0, it shows through every non-PIP scene. Always:

```js
mainTl.set("#face-pip-frame", { opacity: 0 }, 0);
```

at the very start of the master timeline.

### 3. Ken Burns zoom vs wrapper transform

A separate zoom tween on the inner `<video>` element (not the wrapper) runs independently of mode transitions and is correct:

```js
mainTl.to(
  "#face-video",
  { scale: 1.03, duration: 85.70, ease: "none" },
  0,
);
```

Apply to `#face-video` (inner), NOT `#face-wrapper` (outer). The wrapper owns mode, the video owns ambient aliveness. If you scale the wrapper, mode math breaks.

### 4. Panel entrance racing the face

If the panel starts entering at scene-local `t=0` AND the face hasn't fully landed in TOP_HALF yet, the panel feels like it's chasing the face. Kick the panel entrance at scene-local `t=0.10` (or `t=0.15` if the face transition is still visible). See SKILL.md's "Panel entrance" section.

## Why not animate everything on the master timeline?

Each scene's internal content (panel entrance, chart draws, stamps, count-ups) belongs to that scene's LOCAL timeline. The master timeline owns ONLY:

1. Face wrapper mode transitions
2. PIP frame opacity
3. Optional Ken Burns on `#face-video`
4. Ambient-bg parallax (if used)

Keeping scene-internal animations in scene-local timelines makes retimes mechanical â€” change the scene's `data-start` and everything inside moves with it. If you mix master-timeline anchors with local ones, a retime becomes a manual hunt.

