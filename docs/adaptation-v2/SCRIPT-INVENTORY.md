# Inventario de scripts — Video Studio María V2

Generado: 2026-07-29T00:12:59.764Z

Esta fase no mueve, renombra, modifica ni elimina scripts.

## Resumen

| Estado | Cantidad | Uso |
| --- | ---: | --- |
| Activo | 8 | Flujo habitual o mantenimiento directo del sistema |
| Activo V2 | 4 | Flujo opt-in, patrones y eficiencia de María V2 |
| Prueba | 6 | Regresión automatizada; fuera de una edición normal |
| Disponible | 6 | Herramienta válida bajo demanda |
| Experimental | 3 | Prueba, debug o dependencia externa |
| Legacy HeyGen | 52 | Conservado, fuera del flujo normal de María |
| Desconocido | 0 | Requiere investigación |
| **Total** | **79** | |

## Flujo normal simplificado

1. Follow card
2. Preflight
3. Captions
4. Frame capture/extraction
5. SFX manifest and timing
6. Music bed
7. Staged render
8. QA

## Clasificación completa

| Script | Estado | Motivo |
| --- | --- | --- |
| `__tests__/apply-maria-follow-card.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `__tests__/music-bed.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `__tests__/sfx-generate.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `__tests__/sfx-manifest.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `__tests__/sfx-measure.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `__tests__/stage-render.test.mjs` | Prueba | Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal. |
| `_debug-knobs.mjs` | Experimental | Herramienta de depuración; no forma parte del flujo. |
| `apply-maria-follow-card.mjs` | Activo | Inserta o actualiza el cierre oficial de seguimiento antes del preflight. |
| `debug-s1-paraTi.mjs` | Experimental | Depuración ligada a una escena/caso concreto; no reutilizable por defecto. |
| `extract-frames.mjs` | Activo | Extrae evidencia visual de un MP4 para QA posterior al render. |
| `frame.mjs` | Disponible | Diagnóstico puntual de un frame durante authoring. |
| `generate-captions.mjs` | Activo | Genera la capa de captions a partir de la transcripción del proyecto. |
| `heygen-addscene.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-apply-audio.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio-probe.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio3.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio4.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-audio5.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-check.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-checkproj.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-chip.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-del-s1.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-delremove.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-editor-explore.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-engine-v.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-explore.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-explore2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-explore3.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-find-drafts.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-gen2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-gen3.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-generate.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-leftmap.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-leftpanel.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-login.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-probe-dropdowns.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-setup-look.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-setup2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-upload-modal.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `heygen-verify-headed.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-audio.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-audio2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-draft-menu.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-editor.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-engine.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-engine2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-fileinput.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-full.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-generate.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-hamburger.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-headed-edit.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-left.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-open-draft.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-open2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-quick.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-studio-open.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-swap.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-swap2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-topmenu.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-upload.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-upload2.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `hg-upload3.mjs` | Legacy HeyGen | Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María. |
| `maria-v2/apply-maria-pattern.mjs` | Activo V2 | Herramienta aditiva y opt-in de patrones, validación, capacidades o promoción eficiente de María V2. |
| `maria-v2/check-matte-capability.mjs` | Activo V2 | Herramienta aditiva y opt-in de patrones, validación, capacidades o promoción eficiente de María V2. |
| `maria-v2/promote-master-candidate.mjs` | Activo V2 | Herramienta aditiva y opt-in de patrones, validación, capacidades o promoción eficiente de María V2. |
| `maria-v2/validate-maria-patterns.mjs` | Activo V2 | Herramienta aditiva y opt-in de patrones, validación, capacidades o promoción eficiente de María V2. |
| `music-bed.mjs` | Activo | Construye la cama musical definida por el plan local del proyecto. |
| `preflight.mjs` | Activo | Comprueba el proyecto antes de preview/render. |
| `quick-frame.mjs` | Disponible | Captura rápida opcional para diagnóstico. |
| `scrub-crop.mjs` | Disponible | Inspección opcional de crop/reencuadre. |
| `scrub-standalone.mjs` | Disponible | Inspección opcional de una composición independiente. |
| `scrub-wrapper.mjs` | Disponible | Inspección opcional mediante wrapper de preview. |
| `sfx-generate.mjs` | Experimental | Generación externa de SFX; requiere credenciales y aprobación separada. |
| `sfx-manifest.mjs` | Activo | Valida y mantiene el manifiesto compartido de efectos. |
| `sfx-measure.mjs` | Activo | Mide el transient offset necesario para sincronizar efectos nuevos. |
| `stage-render.mjs` | Activo | Apoya el render por etapas del flujo HyperFrames actual. |
| `verify-wrapper.mjs` | Disponible | Verificación auxiliar del wrapper de composición. |

El hash de cada archivo se conserva en `script-inventory.json` para poder
demostrar que inventariar no ha modificado su contenido.
