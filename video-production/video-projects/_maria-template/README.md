# Maria Bejarano - Project Template

Proyecto base para editar vídeos verticales de María con la marca y el lenguaje de montaje ya definidos.

## Cómo clonarlo para un vídeo nuevo

```bash
# Desde la raíz de video-production
cp -r video-projects/_maria-template video-projects/_maria-mi-video
cd video-projects/_maria-mi-video
# Editar meta.json: id, name, dimensiones y fps
# Sustituir el vídeo fuente, transcribir literalmente y construir el timeline
```

Luego:

```bash
npx hyperframes lint
npx hyperframes preview
npx hyperframes render --quality draft --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4
```

## Qué trae listo

- `assets/maria-tokens.css`: paleta, tipografías y tokens azul/Merlot para destacados de subtítulos.
- `EDITING_BASE.md`: especificación completa del montaje aprobado y checklist obligatorio.
- `BRIEF.md`: estructura base del encargo.
- `STORYBOARD.md`: storyboard vacío para cada vídeo.
- Dimensiones por defecto: `1080x1920`, `30 fps`.

## Resultado visual que se debe conservar

- María protagonista y sin deformación.
- Cuando hay apoyo gráfico: combinar cuatro formatos —mitad superior, mitad inferior, pantalla completa y `pip-llamada`— según el contenido, sin un patrón mecánico arriba/abajo. En formato dividido, María ocupa la mitad complementaria con reencuadre proporcional. Con apoyo arriba, deben verse la cabeza completa, la parte alta del pecho y un `6–10 %` de aire sobre el pelo. En formato completo, María queda oculta temporalmente. En `pip-llamada`, María se reduce a una ventana abajo derecha y el grafismo toma protagonismo.
- Todo recurso completo reserva una zona segura para subtítulos que no tapa titulares, cifras, diagramas, capturas ni información esencial.
- Toda ventana `pip-llamada` reserva su caja completa como zona prohibida para subtítulos. El texto nunca puede ponerse encima de la imagen tipo llamada/WhatsApp; se sube, se mueve a una franja segura o se divide.
- Cada entrada de gráfico/b-roll/captura/mockup incluye transición visible y SFX claramente audible.
- Subtítulos literales en MAYÚSCULAS, Work Sans `56–68 px` (mínimo absoluto `52 px`), anclados bajo la barbilla y sobre el pecho, fuera de los `360 px` inferiores reservados por la plataforma. En plano completo o con apoyo arriba, deben bajar hacia el pecho y dejar `0,75–1,25` alturas de línea de aire bajo la barbilla; nunca quedar pegados a la cara.
- Contraste adaptativo por bloque: `caption--on-media` usa texto blanco sobre vídeo/fondo complejo; `caption--on-light` usa tinta `#241E1B` sin contorno sobre crema, blanco o azul claro. Nunca blanco global.
- Palabras destacadas en azul profundo `#4A7691` y/o Merlot `#5C1A2C`, con texto blanco y sin sombra gris, en ambos modos.
- Gráficos animados que apoyan lo dicho, con todos sus textos internos separados y legibles.
- Transiciones funcionales y efectos de sonido que se oyen claramente.
- Ningún rótulo repetido con `MARÍA BEJARANO`, ningún nombre heredado y ninguna marca de agua automática.

## Qué cambiar en cada proyecto

1. `meta.json`: id, name, width, height y fps.
2. Vídeo fuente y duración real.
3. Transcripción literal y tiempos de subtítulos.
4. Gráficos, imágenes, b-roll, capturas y mockups específicos del guion.
5. Timeline, transiciones y SFX sincronizados con el discurso.

## Qué no cambiar sin pedirlo

- Color azul/Merlot de los destacados de subtítulos.
- Selección explícita del modo de contraste según el fondo y revisión mínima de `4.5:1` en escenas claras o complejas.
- Ausencia de rótulos o marcas de agua con el nombre.
- Mayúsculas, tamaño mínimo, anclaje barbilla/pecho y exclusión de los `360 px` inferiores para los subtítulos.
- Sistema de cuatro formatos para apoyos gráficos: arriba, abajo, pantalla completa o `pip-llamada`, combinados con intención y sin vaivén automático.
- Emparejamiento obligatorio de cada entrada gráfica con transición y SFX.
- Uso de `whoosh-tuck` como SFX recomendado cuando la imagen principal se reduce hacia la ventana `pip-llamada`.
- Reencuadre proporcional de María y cabeza completa con margen superior cuando el apoyo aparece arriba.
- Controles de solapamiento y audibilidad de SFX.

## Guía estética

Leer antes de construir:

- `../../DESIGN.maria-brand.md`
- `../../MOTION_PHILOSOPHY.md`
- `../../../brand/hyperframes/HYPERFRAMES-BRAND-RULES.md`
- `EDITING_BASE.md`

La marca manda sobre el sistema técnico y `EDITING_BASE.md` manda sobre el montaje talking-head.

## Checklist de entrega

Antes del render final, completar íntegramente la sección `Control obligatorio antes de renderizar` de `EDITING_BASE.md`. No entregar con subtítulos no literales, rótulos heredados, deformación, textos pisados, destacados fuera de marca, apoyos gráficos sin transición o SFX imperceptibles.

También bloquean la entrega las cartulinas flotantes casi a pantalla completa, los paneles que tapan a María dejando restos inútiles de vídeo, los subtítulos sobre la boca, los titulares de cierre que compiten con la CTA y cualquier texto pequeño/medio flotando sobre foto, vídeo, b-roll o captura compleja sin base local ni contraste `4.5:1` verificado. Un grafismo compacto debe llevar una base local sólida o semitransparente cuando el fondo tenga detalle.
# Archivo estructural obligatorio

Todo proyecto derivado de esta plantilla debe completar
`editorial-structure.json`. El archivo convierte en verificables el hook
pronunciado, el sticker real obligatorio, las enumeraciones, las fases de
contraste y las peticiones explícitas. Antes del render:

```bash
node ../../scripts/validate-editorial-structure.mjs .
```
