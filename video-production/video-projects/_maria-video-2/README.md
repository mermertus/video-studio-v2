# Maria Bejarano - Project Template

Proyecto base para empezar cualquier video nuevo de Maria sin tener que adaptar marca a mano.

## Como clonarlo para un video nuevo

```bash
# Desde la raiz de video-production
cp -r video-projects/_maria-template video-projects/_maria-mi-video
cd video-projects/_maria-mi-video
# Editar meta.json: id, name, dimensiones y fps
# Editar index.html: copy, escenas y timeline
```

Luego:

```bash
npx hyperframes lint
npx hyperframes preview
npx hyperframes render --quality draft --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4
```

## Que trae listo

- `assets/maria-tokens.css`: paleta y tipografias de Maria.
- `index.html`: escena hero vertical de ejemplo con timeline GSAP pausada.
- `BRIEF.md`: estructura base de briefing.
- `STORYBOARD.md`: storyboard vacio para primer video.
- Dimensiones por defecto: 1080x1920, 30 fps.

## Que cambiar en cada proyecto

1. `meta.json`: id, name, width, height y fps.
2. `index.html`: `data-composition-id` y key de `window.__timelines`.
3. Copy: hook, cuerpo, prueba y CTA.
4. Assets: audio, capturas, mockups o footage real.

## Guia estetica

Leer antes de construir:

- `../../DESIGN.maria-brand.md`
- `../../MOTION_PHILOSOPHY.md`
- `../../../brand/hyperframes/HYPERFRAMES-BRAND-RULES.md`

La marca manda sobre el sistema tecnico.
