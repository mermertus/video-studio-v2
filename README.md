# Video Estudio Maria V2

Export limpio preparado para subir a GitHub el 8 de agosto de 2026.

## Que incluye

- `brand/`: identidad de marca, tokens, reglas editoriales y componentes reutilizables.
- `docs/adaptation-v2/`: documentacion del sistema V2.
- `tools/adaptation-v2/`: utilidades y verificaciones del flujo V2.
- `video-production/`: nucleo del estudio de video, scripts, patterns, assets comunes y plantillas base.
- `video-production/video-projects/_maria-template`: plantilla oficial para nuevos proyectos V2.
- `video-production/video-projects/_maria-video-2`: ejemplo ligero de estructura sin video fuente, renders ni caches.

## Que se ha dejado fuera

- `incoming/`
- proyectos activos de cliente y sus variaciones
- renders finales y previews locales
- videos fuente pesados
- caches de waveform, thumbnails y scratch
- `node_modules/`, `.git/`, `.claude/` y otros artefactos locales

## Nota de marca

La identidad de marca importante ya va integrada en `brand/`. Para evitar mezclar versiones, esta exportacion toma como base el workspace V2 y conserva sus reglas mas recientes de HyperFrames.

## Siguiente paso

Dentro de esta carpeta puedes inicializar el repo y subirlo:

```powershell
git init
git add .
git commit -m "Initial clean export of Maria Video Studio V2"
```
