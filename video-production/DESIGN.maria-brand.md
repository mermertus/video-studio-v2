# DESIGN - Maria Bejarano Brand

Fuente principal: `../brand/`.

Este documento adapta el sistema de video/HyperFrames a la identidad de Maria Bejarano: consultora de marketing digital especializada en redes sociales, Meta Ads y contenido para infoproductores.

## Style Prompt

Maria Bejarano comunica estrategia con claridad. La marca debe sentirse editorial, directa y humana: una consultora que mira el sistema completo, no solo el anuncio visible. El objetivo de las piezas no es decorar, es captar atencion, sostener lectura y empujar conversion.

Tono visual: claro, sofisticado, profesional y cercano. Nada de plantillas frias de agencia. Nada de humo. Nada de efectos sin funcion.

## Conversion Lens

- Si el video no captura en los primeros 3 segundos, se reescribe.
- Si el concepto no ayuda a CTR, lectura o conversion, se simplifica.
- Si una pieza promete resultado, debe sonar concreta.
- Referencia de performance: pensar en CTR 7%+ como estandar de ambicion, no como claim garantizado.

## Colors

| Token | Hex | Rol |
|---|---|---|
| `--maria-cream-bg` | `#FDFBF8` | Lienzo principal, fondo claro |
| `--maria-cream-surface` | `#F4EEE3` | Superficies secundarias, descanso |
| `--maria-ink` | `#241E1B` | Texto principal, estructura |
| `--maria-ink-muted` | `#6E625D` | Texto secundario, captions |
| `--maria-border` | `#E8DED0` | Bordes finos |
| `--maria-blue-pastel` | `#96BFD4` | Identidad de marca |
| `--maria-blue-light` | `#C9E1EA` | Fondo alternativo, secciones |
| `--maria-blue-deep` | `#4A7691` | Contraste sobre azul |
| `--maria-merlot` | `#5C1A2C` | Acento decisivo, CTAs, palabras clave |
| `--caption-fg-on-media` | `#FFFFFF` | Subtítulo normal sobre vídeo o fondo complejo |
| `--caption-fg-on-light` | `#241E1B` | Subtítulo normal sobre crema, blanco o azul claro |
| `--caption-highlight-bg` | `#4A7691` | Fondo principal de palabra destacada en subtítulos |
| `--caption-highlight-alt-bg` | `#5C1A2C` | Fondo alternativo para palabra destacada decisiva en subtítulos |

## Color Rules

- El azul sostiene. El Merlot decide.
- Fondo claro o azul claro como campo dominante.
- Merlot una vez por pantalla: palabra, CTA, dato o cierre.
- No usar texto blanco sobre azul pastel.
- La crema calida es un matiz, no una base dominante.
- Los subtítulos usan contraste adaptativo por beat, nunca un blanco global: `caption--on-media` en vídeo/fondo complejo y `caption--on-light` en crema, blanco, azul claro u otro fondo luminoso.
- `caption--on-media` usa blanco y admite solo un contorno negro muy fino si el plano lo exige. `caption--on-light` usa tinta `#241E1B` sin contorno, sombra, resplandor ni banda.
- Los destacados de subtítulos pueden combinar azul profundo `#4A7691` y Merlot `#5C1A2C`, siempre con texto blanco y sin sombra gris. Como criterio base, cada bloque debe tener una o dos palabras destacadas cuando la frase lo permita: azul para sostener la idea, Merlot para tensión, decisión, contraste o CTA. Si el fondo cambia durante el bloque, dividir el subtítulo o cambiar el modo exactamente en la transición.
- La revisión del primer fotograma, punto medio y final de cada recurso claro o complejo debe confirmar un contraste mínimo de `4.5:1`. Sobre vídeo, foto, captura o b-roll con detalle, el texto pequeño/medio necesita placa local sólida o semitransparente `65–85 %`, salvo contraste verificado.

## Typography

- Titulares: `Source Serif 4`, con fallback a Iowan Old Style / Charter / Georgia.
- Cuerpo y captions: `Work Sans`, con fallback a Avenir Next / system-ui.
- Datos, labels y numeracion: `IBM Plex Mono`.

## Motion Rules

- Movimiento calmado, editorial y funcional.
- Nada de bounce/spring por defecto.
- Entradas rapidas y limpias: 0.25s-0.55s.
- Transiciones: 0.35s-0.75s, con blur, cover, push o dissolve.
- Cada escena debe tener una idea principal.
- Las capas visuales deben explicar, no adornar.

## Social Video

Los Reels y shorts deben poder leerse en movil:

- Subtitulos grandes.
- Subtítulos normales con modo de contraste explícito según el fondo; nunca blanco sobre crema o azul claro.
- Highlights de subtítulos en azul profundo `#4A7691` y/o Merlot `#5C1A2C`, con texto blanco y sin sombra gris.
- Capturas, mockups y b-roll cuando aporten contexto.
- Rostro de Maria visible cuando el video depende de autoridad/presencia.
- No tapar la cara con titulares.
- Combinar cuatro formatos de apoyo: mitad superior, mitad inferior, pantalla completa y `pip-llamada`. Evitar el patrón mecánico arriba/abajo/arriba/abajo.
- En los apoyos a pantalla completa, Maria se oculta temporalmente y el diseño reserva una zona de subtitulos que no pisa titulares, datos, diagramas ni capturas.
- `pip-llamada` se usa solo cuando un grafismo necesita protagonismo pero conviene mantener presencia humana: Maria se reduce desde el plano principal a una ventana tipo llamada/WhatsApp abajo a la derecha, con bordes redondeados, borde azul claro y sombra suave.
- Durante `pip-llamada`, los subtitulos nunca pueden ir encima de la ventana ni tocar su caja. Reservar la esquina inferior derecha y recolocar el texto a una franja central segura o dividir la frase.
- SFX recomendado para la reduccion hacia esquina: `whoosh-tuck`, corto y editorial.

## What NOT to Do

1. No usar fondos oscuros como base habitual.
2. No convertir cada video en una plantilla de agencia.
3. No saturar de efectos si no mejoran retencion.
4. No poner tarjetas blancas flotantes sobre fotos de Maria.
5. No usar colores fuera de paleta sin razon documentada.

## Jerarquía de soportes

- Evitar cualquier cartulina que quede entre panel y pantalla completa. Si ocupa casi todo el lienzo, convertirla en una escena completa; si es un apoyo, reducirla a una zona compacta y útil.
- Un panel nunca puede tapar la cara o el cuerpo dejando trozos residuales de vídeo alrededor.
- El texto integrado sobre vídeo, foto, captura o b-roll con detalle debe llevar una base local sólida o con `65–85 %` de opacidad salvo que el contraste real `4.5:1` esté verificado en frames. Esta base sirve a grafismos compactos, no a cartulinas flotantes.
- Los subtítulos se sitúan debajo de la barbilla y nunca sobre la boca.
- En el cierre, una sola pieza manda: CTA o follow card, sin titulares sueltos arriba.


# Hook visual y sticker obligatorio

Todo vídeo de María incorpora al menos un sticker real en el hook visual. Debe
ser una ilustración, objeto o recorte de silueta independiente, relacionado con
el contenido. Una tarjeta, panel, chart o bloque de texto no es un sticker. Puede
tener una animación breve tipo GIF, siempre determinista, y un SFX sincronizado.
El hook textual precede a cualquier enumeración y conserva literalmente la frase
pronunciada.
