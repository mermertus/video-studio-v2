# Spec â€” C1 (SFX sincronizados) + A1 (auto-QA visual) para video-studio

> Fecha: 2026-06-13 Â· Workspace: `video-production/`
> Origen: audit del pipeline de video contra el flujo del video de Nate Herk
> "Claude Fable 5 Made This Entire Video By Itself" (mismo autor del kit base).
> Objetivo: videos de mayor calidad con menos iteraciones.

## Contexto

El sistema es Hyperframes (HeyGen) HTML+GSAP. Hoy:
- Se construye sobre footage real de Maria (no avatar).
- La estÃ©tica estÃ¡ documentada al detalle en `MOTION_PHILOSOPHY.md` (es de primer nivel).
- El cuello de botella es la **cadena de producciÃ³n**, no la estÃ©tica.
- Faltan tres cosas que el flujo de referencia sÃ­ tiene: **SFX sincronizados**,
  **automatizaciÃ³n del QA visual**, y (fuera de este spec) avatar + voz generados.

Este spec cubre **solo C1 + A1**. Avatar (E2), voz (E1) y router de formatos (D1)
son sesiones aparte (ver "Diferido" abajo).

## Decisiones tomadas en el brainstorming

| Fork | DecisiÃ³n |
|---|---|
| A1 autonomÃ­a | **HÃ­brido**: auto-fix de defectos objetivos, reporte de los de gusto |
| C1 fuente de SFX | **HÃ­brido**: core curado (fase 1) + long-tail ElevenLabs (fase 2) |
| Empaquetado / invocaciÃ³n | **Default-automÃ¡tico con escape** (`--skip-qa`); subagente `video-qa` + recipe SFX dentro de `/hyperframes` |

Estado de accesos (verificado 2026-06-13):
- ElevenLabs key en `.env`, plan Creator, **scopes Sound Generation + Models YA habilitados**
  (`/v1/sound-generation` â†’ 422 con body vacÃ­o = auth OK; `/v1/models` â†’ 200).
- HeyGen key en `.env`, 2 avatares "Maria Bejarano" entrenados (para E2).
- Imagen/video generativo â†’ **Higgsfield** (CLI, OAuth, sin key). ElevenLabs Image&Video
  es web-UI only (sin API). Ver `context/infra-higgsfield.md`.

---

## Componente 1 â€” C1: librerÃ­a de SFX + sync al frame

### Estructura

Carpeta compartida en el root del workspace (no per-proyecto, como `assets/`):

```
assets/sfx/
â”œâ”€â”€ sfx-manifest.json
â”œâ”€â”€ whoosh-up.wav  whoosh-down.wav  swoosh.wav
â”œâ”€â”€ click.wav  pop.wav  tick.wav
â”œâ”€â”€ ding.wav  chime.wav  sparkle.wav
â”œâ”€â”€ impact-soft.wav  impact-hard.wav  thud.wav
â”œâ”€â”€ riser.wav  sub-drop.wav  boom.wav
â””â”€â”€ ... (~20-25 core curados, libres de licencia / CC0)
```

Cada proyecto que use un SFX **copia el sample a su propio `assets/`** (portabilidad,
misma regla que el resto de assets de marca). El manifest compartido es la fuente
de naming + offsets; los `.wav` se duplican al proyecto al usarse.

### El manifest (corazÃ³n del sync)

`sfx-manifest.json` â€” un entry por sample:

```json
{
  "whoosh-up": {
    "file": "whoosh-up.wav",
    "duration": 0.62,
    "transient_offset": 0.18,
    "category": "transition",
    "default_volume": 0.2,
    "use_for": ["whip-up", "scene-enter-from-below", "act-break-up"],
    "license": "CC0 / freesound #XXXX",
    "source": "curated"
  }
}
```

- `transient_offset` (segundos): cuÃ¡ndo arranca el GOLPE audible dentro del archivo
  (medido una vez al curar, vÃ­a detecciÃ³n de pico con ffmpeg `astats`/`silencedetect`).
  Es el dato que hace el sync exacto.
- `source`: `"curated"` (fase 1) o `"generated"` (promovido desde ElevenLabs, fase 2).

### La fÃ³rmula de sync

El problema: los SFX tienen silencio/ramp antes del golpe. Anclar el `data-start`
al inicio del archivo deja el golpe tarde. SoluciÃ³n determinista:

> **`audio data-start = (timestamp del peak visual de la transiciÃ³n) âˆ’ transient_offset`**

AsÃ­ el golpe del whoosh cae exactamente en el peak del whip, no al empezar el archivo.
Sin detecciÃ³n en cada render â€” el offset ya estÃ¡ medido en el manifest.

Ejemplo: whip-streak visual con peak a t=3.80s, `whoosh-up.transient_offset=0.18` â†’
`<audio src="assets/whoosh-up.wav" data-start="3.62" data-volume="0.2" data-track-index="40">`.

(Recordar: el `<audio>` no lleva `class="clip"`, regla 2 del render contract.
Tracks de SFX â‰¥ 40 para no pisar captions â‰¥ 20.)

### Recipe en `/hyperframes`

SecciÃ³n nueva en la skill `hyperframes` (no skill aparte â€” el sync es parte del
authoring). Documenta:
1. El contrato del manifest + la fÃ³rmula de colocaciÃ³n.
2. El mapeo "quÃ© SFX para quÃ© beat" (whipâ†’whoosh, card-landâ†’impact-soft,
   click UIâ†’click, revealâ†’ding/pop/sparkle, act-breakâ†’riser, drop dramÃ¡ticoâ†’sub-drop).
3. Los `data-volume` canÃ³nicos (ya en MOTION_PHILOSOPHY Â§2.7: VO 1.0 / pad 0.15 / SFX 0.2;
   colas de SFX pueden sangrar al beat siguiente).
4. CÃ³mo medir el `transient_offset` de un sample nuevo (comando ffmpeg).

### Fase 2 â€” generaciÃ³n ElevenLabs (gateada por sequencing, ya no por scope)

Helper `scripts/sfx-generate.mjs`:
- Input: prompt de texto (ej. "metallic chrome whoosh with sub bump") + nombre destino.
- Llama `POST /v1/sound-generation` (ElevenLabs), guarda el `.wav`.
- Mide su `transient_offset`, lo agrega al manifest con `source: "generated"`.
- Cachea por hash del prompt (no regenerar lo mismo).
- Se invoca solo cuando ningÃºn sample del core sirve.

Determinismo: el sample generado se versiona en `assets/sfx/` igual que un curado,
asÃ­ el render es reproducible (no se regenera en cada build).

---

## Componente 2 â€” A1: subagente `video-qa`

Archivo: `video-production/.claude/agents/video-qa.md`.

### Interfaz

- **Input**: project-slug, path al draft MP4, path al transcript/`captions.meta.json`,
  y los boundaries de escena (`data-start`/`data-duration` por sub-composiciÃ³n â€”
  extraÃ­bles del `index.html` + compositions).
- **Output**: reporte estructurado en markdown con:
  - Lo auto-fixeado (quÃ© defecto, quÃ© archivo/lÃ­nea, quÃ© cambiÃ³, re-render hecho).
  - Lo elevado a Maria (defectos de gusto), con los frames adjuntos vÃ­a `Read`.
  - Veredicto: `clean` / `needs-human` / `failed-to-converge`.

### ClasificaciÃ³n de checks

**AUTO-FIX (objetivos â€” patchea HTML + re-render draft + re-verifica, mÃ¡x 3 intentos):**
- Black-frame por timeline corto (Law #11: falta el anchor `tl.to({}, {duration}, 0)`).
- Texto fuera de caja / overflow / overlap no intencional.
- Cara cropeada en escena bottom-half (face-mode incorrecto).
- Escena que cae en la palabra equivocada (cruza transcript word-onset vs `data-start`).
- Timeline-duration diagnostic: gap donde `timeline.duration() < data-duration`.

**REPORTE (de gusto â€” se listan para que Maria decida, no se tocan):**
- Â¿El color del beat carga significado? (MOTION_PHILOSOPHY Â§2.3)
- Â¿El pacing aburre / hay dead-air > 1s fuera de los holds deliberados?
- Â¿La elecciÃ³n/sync de SFX pega con el beat?
- Â¿Falta callback / la pieza se siente "clips sueltos"?
- Cualquier duda subjetiva â†’ se eleva, no se adivina.

### Loop de auto-fix

```
extraer hero-frames (1 por escena + entradas/transiciones en riesgo)
  â†’ Read cada frame
  â†’ correr checklist
  â†’ para cada defecto AUTO-FIX:
       patchear HTML â†’ re-render draft â†’ re-extraer ese frame â†’ re-verificar
       (cortar a los 3 intentos; si no converge â†’ marcar needs-human + reportar)
  â†’ compilar reporte (auto-fixeado + elevado-a-Maria)
```

Reglas duras heredadas del workspace:
- Determinismo: nada de `Math.random()`/`Date.now()` en los fixes.
- Nunca tocar `.play()/.pause()/.currentTime` de media.
- El agente NO corre el render `--quality standard` final (eso queda tras el OK de Maria).

### ReutilizaciÃ³n (limpieza A2 del audit, oportunista)

Los `.mjs` que el agente necesita (frame-extract por escena, batch-scrub) se promueven
de `_maria_VSL-v3/scripts/` (bespoke) a `scripts/` compartido del workspace, en vez de
reinventarlos. Alcance acotado: solo los que `video-qa` consume. No es refactor general.

---

## Componente 3 â€” IntegraciÃ³n en el authoring loop

En el `CLAUDE.md` de video-studio, el loop pasa a:

```
editar â†’ preview localhost (Maria) â†’ draft render
  â†’ [NUEVO] video-qa corre solo: auto-fixea lo objetivo, reporta lo de gusto
  â†’ mostrar a Maria el MP4 ya auto-pulido + el reporte
  â†’ Maria decide â†’ render final --quality standard
```

- **Reemplaza** el "frame-verify a mano" actual (Gate de Visual Verification),
  que hoy lo hace la sesiÃ³n a pulso.
- **Mantiene** los dos gates de gusto de Maria (preview localhost + MP4 final).
- **Escape**: convenciÃ³n `--skip-qa` (o equivalente en el prompt) para retoques chicos
  donde no se quiere pagar el QA en tokens.

El doc del loop deja explÃ­cito el default-automÃ¡tico y el escape.

---

## Componente 4 â€” Auto-invocaciÃ³n de skills (triggering)

Agregado por Maria (2026-06-13). No modifica C1/C2/C3 â€” los complementa.

### Problema

Hoy las skills del workspace (`hyperframes`, `short-form-video`, `long-form-video`,
`split-screen-panels`, `make-a-video`, `website-to-hyperframes`, `gsap`,
`hyperframes-registry`) dependen de que se las nombre, o de `description`s que no
siempre disparan en el cue correcto. AdemÃ¡s, las piezas nuevas de este spec
(subagente `video-qa`, recipe de SFX) necesitan triggers claros para activarse solas.

### Alcance

Revisar y afinar el `description` (frontmatter) de cada skill del workspace para que
**auto-disparen en su cue correcto, sin pisarse entre sÃ­**, usando la metodologÃ­a de
`skill-creator` (description-optimization). En concreto:
- Cues especÃ­ficos caen en la skill exacta: "reel 9:16 talking-head" â†’ `short-form-video`;
  "VSL / video largo" â†’ `long-form-video`; "panel grande + cara" â†’ `split-screen-panels`;
  "URL a video" â†’ `website-to-hyperframes`.
- Cue ambiguo ("hacÃ© un video", "video desde cero") â†’ `make-a-video`.
- Triggers nuevos: el recipe de SFX dispara con "efecto de sonido / whoosh / SFX /
  sincronizar audio a transiciÃ³n"; el subagente `video-qa` se invoca desde el authoring
  loop (Componente 3) y con "verificÃ¡ el video / QA del draft".

### Fuera de alcance

El **router objetivoâ†’formato** completo (D1 del audit â€” presets por objetivo de negocio:
ad / VSL / explainer / reel) sigue **diferido**. Componente 4 es solo afinar disparadores
de las skills existentes, no construir un selector nuevo.

### Criterio de Ã©xito

Cada skill del workspace dispara en su cue sin solaparse con otra; los cues de prueba
(uno por skill + uno ambiguo) rutean a la skill esperada.

---

## QuÃ© NO entra (YAGNI / diferido)

- **E1 â€” pipeline de voz (ElevenLabs)**: TTS clon de Maria en espaÃ±ol, **chunked <1min**
  para que la voz no driftee, stitch con ffmpeg. SesiÃ³n aparte.
- **E2 â€” pipeline de avatar (HeyGen)**: **audio-driven lip-sync â€” se SUBE el audio de
  ElevenLabs a HeyGen, NO se usa el TTS interno de HeyGen** (mejor calidad de labios,
  control de voz). Chunked igual que E1. SesiÃ³n aparte.
  > Nota de diseÃ±o de Maria (2026-06-13): la generaciÃ³n de avatar sale mejor subiendo el
  > audio para el lip-sync; y cuanto mÃ¡s largo el audio, mÃ¡s variable la voz â†’ cortar en
  > pedazos cortos y generar por chunks es el path correcto. Registrar este orden
  > (ElevenLabsâ†’HeyGen audio-upload, chunked) al armar E1/E2.
- **D1 â€” router objetivoâ†’formato**: presets por objetivo (ad / VSL / explainer / reel).
- GeneraciÃ³n de mÃºsica ElevenLabs, dubbing, etc.

## Criterios de Ã©xito

1. Un SFX colocado con la fÃ³rmula tiene su golpe sobre el peak visual (verificable
   escuchando el draft + mirando el frame del peak).
2. `video-qa` corre sobre un draft real, auto-fixea al menos un defecto objetivo
   plantado a propÃ³sito (ej. timeline sin anchor), y reporta los subjetivos sin tocarlos.
3. El loop documentado en CLAUDE.md refleja el nuevo paso automÃ¡tico + el escape.
4. `.env` nunca se commitea (gitignore ya lo cubre). Los `.wav` curados SÃ se versionan
   en `assets/sfx/` (son chicos y deben ser deterministas); si algÃºn sample pesa de mÃ¡s,
   evaluar LFS, pero por defecto se commitean.
```

