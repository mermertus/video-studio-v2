# Capas de audio + modo de producciÃ³n por etapas (step-by-step)

Tres capas de audio, de mayor a menor prioridad de mezcla:

| Capa | Elemento | `data-volume` | `data-layer` |
|---|---|---|---|
| Voz (VO) | `<audio>` narraciÃ³n | 1.0 | (sin `data-layer`) |
| SFX | `<audio>` efectos (ver `sfx-sync.md`) | 0.2 | `data-layer="sfx"` |
| MÃºsica | `<audio>` bed Ãºnico | 0.15 | `data-layer="music"` |

**Regla:** todo `<audio>` de SFX o mÃºsica lleva su `data-layer`. La VO NO lleva `data-layer`
(siempre presente). Track index: VO/SFX â‰¥ 40, mÃºsica puede ir en 49.

## Modo de producciÃ³n

Al arrancar el proyecto se elige el modo (el `video-orchestrator` lo pregunta):

- **`ready-to-publish`** â€” se construye todo y se gatea una vez al final.
- **`step-by-step` (sbs)** â€” 3 etapas, cada una con render + OK explÃ­cito de Maria:
  1. **visual** â€” video + motion graphics + subtÃ­tulos + VO. Sin SFX ni mÃºsica.
  2. **sfx** â€” se agregan los SFX sincronizados.
  3. **music** â€” se agrega el bed de mÃºsica con fades.

En cualquier gate Maria puede tomar el render de esa etapa y terminar el audio a mano.

### Render por etapa

```bash
# desde el root del workspace
node scripts/stage-render.mjs <project-slug> visual   # sin sfx ni mÃºsica
node scripts/stage-render.mjs <project-slug> sfx      # con sfx, sin mÃºsica
node scripts/stage-render.mjs <project-slug> music    # todo (= full)
```

`stage-render.mjs` saca del `index.html` los `<audio data-layer>` de las capas que todavÃ­a
no tocan, renderiza un draft de esa etapa, y restaura el `index.html` original (backup +
finally). No toca la VO.

## MÃºsica multi-track (bed horneado)

El engine no automatiza volumen â†’ se hornea un bed Ãºnico con ffmpeg. Plan por proyecto en
`<proyecto>/music-plan.json` (array de `{ track, start, fade_in?, fade_out?, duration? }`).
Dos tracks que se solapan con `fade_out`/`fade_in` matcheados = crossfade.

```bash
node scripts/music-bed.mjs --plan video-projects/<slug>/music-plan.json \
  --out video-projects/<slug>/assets/music-bed.wav
```

El bed entra como UN elemento: `<audio src="assets/music-bed.wav" data-volume="0.15" data-layer="music"></audio>`.
CatÃ¡logo de tracks + moods: `assets/music/music-manifest.json`.

