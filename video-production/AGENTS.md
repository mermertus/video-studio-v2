# HyperFrames Composition Project

## Skills

This project uses AI agent skills for framework-specific patterns. Install them if not already present:

```bash
npx skills add heygen-com/hyperframes
```

Skills encode patterns like `window.__timelines` registration, `data-*` attribute semantics, and shader-compatible CSS rules that are not in generic web docs. Using them produces correct compositions from the start.

## Commands

```bash
npx hyperframes preview      # preview in browser (studio editor)
npx hyperframes render       # render to MP4
npx hyperframes lint         # validate compositions (errors + warnings)
npx hyperframes lint --json  # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

## Project Structure

- `index.html` â€” main composition (root timeline)
- `compositions/` â€” sub-compositions referenced via `data-composition-src`
- `assets/` â€” media files (video, audio, images)
- `meta.json` â€” project metadata (id, name)
- `transcript.json` â€” whisper word-level transcript (if generated)

## Linting â€” Always Run After Changes

After creating or editing any `.html` composition, run the linter before considering the task complete:

```bash
npx hyperframes lint
```

Fix all errors before presenting the result.

## Key Rules

1. Every timed element needs `data-start`, `data-duration`, and `data-track-index`
2. Visible timed elements **must** have `class="clip"` â€” the framework uses this for visibility control
3. GSAP timelines must be paused and registered on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"`
6. Only deterministic logic â€” no `Date.now()`, no `Math.random()`, no network fetches

## Cierre de Instagram obligatorio para María

Esta regla pertenece al flujo global de edición, no al proyecto `_maria-template`.

Antes del preflight de cualquier Reel de María:

```bash
node scripts/apply-maria-follow-card.mjs <project-folder>
```

El script usa el componente maestro de
`../brand/hyperframes/components/instagram-follow-card/`, busca `sígueme` en los últimos
`10 s`, inicia el degradado y la tarjeta exactamente `1,5 s` antes y los mantiene hasta el último
fotograma. También copia los SFX, evita duplicados y desplaza los subtítulos coincidentes a la zona
segura superior. No recrear ni editar la animación dentro de un proyecto de vídeo.

## Documentation

Full docs: https://hyperframes.heygen.com/introduction

Machine-readable index for AI tools: https://hyperframes.heygen.com/llms.txt

## Gate editorial de María

Todo Reel debe completar `editorial-structure.json` y pasar:

```bash
node scripts/validate-editorial-structure.mjs <project-folder>
```

El agente bloquea el render cuando falta el hook textual antes de una
enumeración, el sticker real del hook, una petición explícita, la separación de
un numeral o el corte de caption en una frontera de fondo, layout, contraste o
fase. Cada frontera se verifica un frame antes, en el límite y un frame después.

