# SFX sincronizados al frame

LibrerÃ­a compartida: `assets/sfx/` (root del workspace) + `sfx-manifest.json`.
Al usar un SFX, copiar su `.wav` al `assets/` del proyecto (portabilidad).

## La fÃ³rmula

audio `data-start` = (timestamp del peak visual de la transiciÃ³n) âˆ’ `transient_offset`

El `transient_offset` (cuÃ¡ndo arranca el golpe dentro del archivo) estÃ¡ en el manifest.
AsÃ­ el golpe cae sobre el peak visual, no al empezar el archivo.

Ejemplo â€” whip-streak con peak a 3.80s, whoosh-up.transient_offset = 0.18:

```html
<audio src="assets/whoosh-up.wav" data-start="3.62" data-volume="0.2"
       data-track-index="40"></audio>
```

Reglas: el `<audio>` NO lleva `class="clip"` (render contract regla 2).
Tracks de SFX â‰¥ 40 (captions usan â‰¥ 20). `data-volume` SFX = 0.2 (MOTION_PHILOSOPHY Â§2.7);
las colas pueden sangrar al beat siguiente.

## Mapeo cue â†’ SFX

| Beat visual | SFX sugerido |
|---|---|
| Whip / scene enter desde abajo | whoosh-up |
| Whip / exit hacia arriba | whoosh-down |
| Card / objeto que aterriza | impact-soft / thud |
| Impacto fuerte, nÃºmero hero | impact-hard / boom |
| Click de UI (faux-cursor) | click |
| Reveal de palabra / logo | ding / sparkle / pop |
| Build-up a un act break | riser |
| Drop dramÃ¡tico / silencio | sub-drop |

## Medir un sample nuevo

`node scripts/sfx-measure.mjs assets/sfx/<nuevo>.wav` â†’ agregar al manifest con
ediciÃ³n a mano (o `sfx-generate.mjs` para los generados) y validar con
`node scripts/sfx-manifest.mjs validate`.

