# Maria Video Production - Workspace Guide

Workspace de produccion de video/HyperFrames para Maria Bejarano.

Este sistema esta adaptado desde `by-maria-bejarano`, pero la fuente de verdad de marca es:

`../brand/`

## Prioridad

Cada video debe convertir. Si no ayuda a captar atencion, explicar mejor o empujar accion, se simplifica.

Antes de crear o adaptar cualquier pieza, leer:

1. `DESIGN.maria-brand.md`
2. `MOTION_PHILOSOPHY.md`
3. `../brand/BRAND-MASTER.md`
4. `../brand/hyperframes/HYPERFRAMES-BRAND-RULES.md`

## Workspace Layout

```text
video-production/
â”œâ”€â”€ CLAUDE.md
â”œâ”€â”€ DESIGN.maria-brand.md
â”œâ”€â”€ MOTION_PHILOSOPHY.md
â”œâ”€â”€ README.md
â”œâ”€â”€ assets/
â”‚   â””â”€â”€ maria-tokens.css
â”œâ”€â”€ .claude/
â”‚   â””â”€â”€ skills/
â””â”€â”€ video-projects/
    â””â”€â”€ _maria-template/
```

## Skills

Usar siempre la skill adecuada antes de escribir o modificar composiciones. Las skills bloqueadas en `skills-lock.json` son:

- `hyperframes`: composiciones, timings, captions, HTML y render contract.
- `hyperframes-cli`: init, lint, preview, render, transcribe, doctor.
- `hyperframes-registry`: bloques/componentes de catalogo.
- `gsap`: timelines y animacion.
- `website-to-hyperframes`: web o landing a video.

Si una pieza futura necesita otra skill especializada, instalarla y actualizar `skills-lock.json` antes de documentarla como parte del flujo habitual.

## Authoring Loop

1. Leer `MOTION_PHILOSOPHY.md`.
2. Confirmar formato, objetivo, audio y assets.
3. Clonar `video-projects/_maria-template/`.
4. Escribir `BRIEF.md`.
5. Crear o adaptar composicion.
6. Ejecutar `node scripts/apply-maria-follow-card.mjs <project-folder>`.
7. Ejecutar `node scripts/preflight.mjs <project-folder>`.
8. Ejecutar `npx hyperframes check`.
9. Abrir preview local antes de render.
10. Render draft.
11. Extraer frames y revisar visualmente.
12. Render final solo tras aprobacion.

## Naming

- Template: `_maria-template`.
- Proyectos nuevos: `_maria-<slug>`.
- Assets de marca: `assets/maria-tokens.css`.

## Reglas de marca

- Fondo claro o azul claro como base.
- Merlot una vez por pantalla.
- Titulares con Source Serif 4.
- Captions y cuerpo con Work Sans.
- Labels/datos con IBM Plex Mono.
- Movimiento medido, sin ruido.

## CTA automática de cierre

- La fuente de verdad vive en `../brand/hyperframes/components/instagram-follow-card/`.
- La versión original aprobada permanece guardada en la subcarpeta `original/`.
- Se aplica durante la edición; no forma parte del proyecto `_maria-template`.
- Buscar `sígueme` únicamente en los últimos `10 s` de la transcripción con timestamp de palabra.
- Empezar el degradado y la animación exactamente `1,5 s` antes de la palabra.
- Mantener el grafismo hasta el último fotograma; no añadir animación de salida.
- Reproducir el whoosh de entrada y el clic que cambia `SEGUIR` por `SIGUIENDO`.
- No permitir subtítulos, textos, rostro, manos ni información gráfica dentro de su zona reservada.
- Ejecutar siempre `scripts/apply-maria-follow-card.mjs`; una segunda ejecución actualiza la instancia
  existente y nunca crea un duplicado.

## Recurso `pip-llamada`

- Es un formato opcional de edición, no una regla permanente.
- Usarlo cuando el grafismo necesita protagonismo pero conviene mantener a María visible.
- La imagen principal de María se reduce hacia una ventana abajo derecha tipo llamada/WhatsApp en `0,45–0,65 s`.
- SFX recomendado: `assets/sfx/whoosh-tuck.wav`.
- Los subtítulos nunca pueden pisar, tocar ni pasar por detrás de esa ventana. Reservar su caja desde el inicio de la transición hasta el final del beat.
- Si el texto no cabe fuera de la ventana, subirlo a una franja central segura o dividir la frase; nunca reducirlo por debajo de `52 px`.

## Render Contract

- Cada timed element usa `class="clip"`, salvo `video` y `audio`.
- Cada timeline se registra en `window.__timelines["<composition-id>"]`.
- No usar `Math.random()` ni `Date.now()` en render.
- No llamar `.play()` ni `.pause()` en media.
- No declarar terminado sin mirar frames.


