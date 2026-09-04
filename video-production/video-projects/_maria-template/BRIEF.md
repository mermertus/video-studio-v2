# Brief - Maria Template

Estado: plantilla base.

## Objetivo

Usar este proyecto como punto de partida para vídeos verticales de marketing de María Bejarano con un montaje talking-head dinámico, claro y editorial.

## Formato por defecto

- Canvas: `1080x1920` (`9:16`).
- FPS: `30`, salvo que la fuente exija conservar otro valor.
- Uso: Reel / Short / vídeo vertical.

## Marca

- Fuente de verdad: `../../DESIGN.maria-brand.md`.
- Tokens: `assets/maria-tokens.css`.
- Paleta: `.claude/skills/hyperframes/palettes/maria-brand.md`.
- Excepción específica para vídeo: los destacados de subtítulos pueden combinar azul profundo `#4A7691` y Merlot `#5C1A2C`, siempre con texto blanco y sin sombra gris.
- Contraste adaptativo obligatorio: cada bloque declara `caption--on-media` o `caption--on-light`; el subtítulo normal nunca usa blanco global.
- No mostrar el nombre `MARÍA BEJARANO` como rótulo, firma repetida o marca de agua.

## Estructura visual por defecto

1. Hook en menos de 3 segundos con María como protagonista.
2. Desarrollo con subtítulos literales en MAYÚSCULAS, Work Sans `56–68 px` (mínimo `52 px`), anclados debajo de la barbilla y sobre el pecho, y fuera de los `360 px` inferiores reservados por las plataformas. En plano completo o con el apoyo visual arriba, bajar el bloque hacia el pecho y dejar `0,75–1,25` alturas de línea de aire visible bajo la barbilla.
   - Sobre vídeo o fondo complejo: blanco, con contorno negro muy fino solo si hace falta.
   - Sobre crema, blanco, azul claro u otro fondo luminoso: tinta `#241E1B`, sin contorno ni sombra.
   - Si el fondo cambia durante el bloque, dividirlo o cambiar de modo exactamente en la transición.
3. Ideas importantes apoyadas con gráfico, b-roll, captura, imagen tipo stock o mockup, combinando cuatro formatos: mitad superior, mitad inferior, pantalla completa y `pip-llamada`. No usar un patrón fijo arriba/abajo; ordenar los formatos según el contenido y el ritmo.
4. En formato dividido, María se reencuadra proporcionalmente en la mitad complementaria, sin deformación. Cuando el apoyo esté arriba, mostrar cabeza y parte alta del pecho completas, con un `6–10 %` de aire sobre el pelo. En formato completo, María queda oculta temporalmente y el recurso reserva una zona propia para subtítulos sin pisar información esencial. En `pip-llamada`, María se reduce a una ventana abajo derecha con SFX `whoosh-tuck`; los subtítulos nunca pueden pisar esa ventana.
5. Cada entrada de apoyo gráfico lleva obligatoriamente una transición visible y un SFX claramente audible, sincronizados con el discurso.
6. Cierre claro con acción o conclusión.
7. Cada apoyo debe declarar un formato inequívoco: mitad real, pantalla completa, `pip-llamada`, grafismo directo o panel compacto. No usar cartulinas casi completas ni paneles que tapen a María dejando restos inútiles de vídeo.
8. Si el grafismo directo no se entiende sobre el metraje, añadir una base local sólida o semitransparente (`65–80 %`). Los subtítulos deben quedar bajo la barbilla, nunca sobre la boca, y el cierre no admite titulares secundarios que compitan con la CTA.
9. Si este proyecto introduce una regla nueva, completar antes una evaluación de no regresión: problema concreto, recursos aprobados que se conservan, impacto `conserva | limita | elimina` y muestras que se revisarán. `Elimina` requiere aprobación expresa de María.

## Reglas de edición obligatorias

Leer y aplicar `EDITING_BASE.md` antes de crear, revisar o renderizar el vídeo. Su checklist es una puerta de aprobación: si falla un punto, el vídeo todavía no está listo para entregar.
# Requisitos editoriales bloqueantes

- Hook textual exacto antes de cualquier enumeración.
- Hook visual creado mediante sticker real obligatorio.
- Un sticker real tiene silueta propia; card, panel, chart o caja de texto no cuentan.
- Registrar toda petición visual explícita como `required: true` y añadir evidencia.
- Completar y validar `editorial-structure.json`; un fallo bloquea el render.
