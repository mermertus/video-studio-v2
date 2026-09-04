# Video Estudio Maria V2

Repositorio de trabajo remoto del estudio de video de Maria Bejarano, sincronizado con el workspace local `by-maria-bejarano`.

## Que incluye

- `brand/`: identidad de marca, tokens, reglas editoriales, voz y tono, y componentes reutilizables (incluye el componente "follow card" de Instagram con su imagen de referencia).
- `video-production/`: nucleo del estudio de video.
  - `.claude/skills/`: skills de Claude (HyperFrames, GSAP, short/long-form video, split-screen, etc.) — las reglas con las que se edita cada proyecto.
  - `assets/`, `docs/`, `references/`, `scripts/`: recursos y utilidades comunes.
  - `video-projects/_maria-template/`: plantilla oficial para nuevos proyectos.
  - `video-projects/_maria-video-2/`: ejemplo ligero de estructura sin video fuente, renders ni caches.

## Que se ha dejado fuera

- `incoming/`
- Proyectos activos de cliente y sus variaciones (contenido de campana real: guiones, audio, video final)
- `node_modules/`: carpeta de dependencias de Node.js — no se sube nunca a git porque es pesada y se regenera con `npm install` a partir de `package.json`
- `renders/`: videos renderizados finales — pesados, se regeneran desde el proyecto fuente
- Videos fuente pesados, caches de waveform/thumbnails/scratch
- Credenciales y sesiones locales (`.env`, `.heygen-auth.json`, `.heygen-profile/`, `.playwright-profile/`)

## Para empezar a editar

```powershell
git clone https://github.com/mermertus/video-studio-v2.git
cd video-studio-v2/video-production
npm install
```
