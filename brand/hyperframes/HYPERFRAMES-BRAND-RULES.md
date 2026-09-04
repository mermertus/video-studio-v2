# HyperFrames Brand Rules

Reglas para adaptar composiciones de HyperFrames a la marca María Bejarano.

## Principio

HyperFrames aporta técnica, ritmo y estructura. La marca decide color, tono, jerarquía y sensación final.

## Lienzo recomendado

- Instagram Reels: `9:16`.
- Carruseles: `1080x1350` o formato horizontal interno si se trata de prototipo.
- Web o decks: adaptar desde tokens, no desde estilos genéricos.

## Tokens obligatorios

- Fondo: `#FDFBF8` o `#C9E1EA`.
- Texto principal: `#241E1B`.
- Texto secundario: `#6E625D`.
- Acento decisivo general: `#5C1A2C`.
- Azul marca: `#96BFD4`.
- Azul profundo para destacados de subtítulos: `#4A7691`.
- Merlot para destacados decisivos de subtítulos: `#5C1A2C`.

## Tipografía

- Titulares: Source Serif 4.
- Cuerpo y subtítulos: Work Sans.
- Etiquetas, datos y numerales secundarios: IBM Plex Mono.

## Motion

- Calmo, editorial y funcional.
- Duraciones cortas: 120–180 ms para microinteracciones; movimientos de escena sin rebote.
- Evitar bounce, spring, efectos de plantilla y transiciones llamativas sin función.

## Para vídeos con talking head

- La persona no debe quedar subordinada a los gráficos ni deformada por el reencuadre.
- Los apoyos visuales tienen cuatro formatos aprobados: media pantalla arriba, media pantalla abajo, pantalla completa o `pip-llamada`. En media pantalla, la persona ocupa la mitad complementaria sin deformación; en pantalla completa, María desaparece temporalmente y el recurso visual ocupa todo el lienzo.
- `pip-llamada` es un recurso de variedad, no el formato base: el grafismo ocupa casi todo el lienzo y María se transforma desde plano principal a una ventana flotante abajo a la derecha, estilo llamada/WhatsApp, con proporción intacta, bordes redondeados, borde azul claro y sombra suave.
- La transición `pip-llamada` dura `0,45–0,65 s`, usa `transform`/`scale`/`opacity` sobre wrappers, easing `power2.inOut` o equivalente, sin bounce/spring. El SFX recomendado es `whoosh-tuck` desde `video-production/assets/sfx/whoosh-tuck.wav`.
- Zona reservada para `pip-llamada` en `1080x1920`: orientar la ventana a `300–380 px` de ancho, margen derecho `48–64 px`, y declarar una exclusión aproximada `x=620–1080`, `y=1180–1920` o la caja real de la ventana si cambia. Ningún subtítulo puede entrar, tocar o quedar por encima de esa zona mientras la ventana esté visible.
- No repetir un patrón mecánico arriba/abajo/arriba/abajo. Combinar los formatos según la idea, el encuadre anterior y el siguiente beat para evitar una oscilación predecible o mareante. Ejemplos válidos: `abajo → completo → pip-llamada → arriba`, `arriba → completo → abajo` o variaciones justificadas por el contenido.
- Si el apoyo está arriba, el vídeo inferior debe conservar completos pelo, cabeza, barbilla y parte alta del pecho, con un margen libre del `6–10 %` sobre el pelo. Ajustar escala y `object-position` a partir del plano real; no reutilizar un desplazamiento genérico. Si el encuadre no cabe, reducir el apoyo al `45 %` o pasar a un reparto `40/60` antes de recortar la cabeza.
- Cada entrada de apoyo visual incluye obligatoriamente una transición visible y un SFX audible sincronizado.
- En un apoyo a pantalla completa, reservar desde el diseño una franja segura propia para subtítulos. El subtítulo permanece visible, pero nunca tapa titulares, diagramas, cifras, capturas ni información esencial del recurso.
- En `pip-llamada`, los subtítulos se recolocan en una franja central o lateral segura fuera de la ventana. Está prohibido usar la esquina inferior derecha para subtítulos durante ese beat aunque el texto siga siendo legible.
- Subtítulos visibles siempre en MAYÚSCULAS, sin perder tildes, signos ni literalidad. En `1080x1920`: Work Sans `56–68 px`, peso `700–800`, interlineado `1.08–1.18` y máximo dos líneas; nunca bajar de `52 px`, sino acortar el bloque.
- Anclar el subtítulo debajo de la barbilla y sobre la parte alta del pecho, calculando la posición respecto al rostro de cada plano. Reservar al menos los `360 px` inferiores para captions, botones e interfaz de Meta y otras plataformas.
- Highlights de subtítulos en azul profundo `#4A7691` y/o Merlot `#5C1A2C`, con texto blanco y sin sombra gris. Cada bloque debe llevar una o dos palabras destacadas cuando la frase lo permita: azul para sostener la idea; Merlot para tensión, decisión, contraste o CTA.
- El color del subtítulo normal nunca es global ni fijo: cada clip declara uno de estos modos según el fondo que realmente queda detrás del texto:
  - `caption--on-media`: blanco `#FFFFFF`; contorno negro muy fino únicamente si un plano de vídeo o fondo complejo lo necesita.
  - `caption--on-light`: tinta `#241E1B`; sin contorno, sombra, resplandor ni banda cuando el fondo sea crema, blanco, azul claro u otro campo luminoso.
- Está prohibido usar texto blanco normal sobre fondo claro y confiar en el contorno para recuperar legibilidad. El `mark` destacado no cambia entre modos: azul profundo `#4A7691` o Merlot `#5C1A2C`, siempre con texto blanco.
- Si una transición cambia el tipo de fondo durante un subtítulo, dividir el clip o cambiar de modo en ese límite; no dejar un único tratamiento atravesando fondos incompatibles.
- No mostrar `MARÍA BEJARANO` como rótulo persistente, pie de gráfico o marca de agua.
- B-roll, capturas, imágenes tipo stock y mockups deben explicar o reforzar la idea.
- Usar anotaciones, líneas y zooms con intención. La transición y el SFX no son opcionales cuando entra un apoyo gráfico.
- Ningún texto interno puede pisar datos, anillos, barras, iconos u otras etiquetas.

## CTA de seguimiento de Instagram

- El componente maestro reusable vive en
  `brand/hyperframes/components/instagram-follow-card/`; es la única fuente editable.
- La versión original aprobada se conserva intacta en `original/`.
- No guardar el componente maestro dentro de `_maria-template` ni reconstruirlo para cada vídeo.
- En cada cierre, localizar `sígueme` dentro de los últimos `10 s` y comenzar el degradado y la
  tarjeta exactamente `1,5 s` antes.
- La tarjeta permanece hasta el último fotograma. La entrada lleva whoosh; el cursor hace clic y el
  botón cambia de `SEGUIR` a `SIGUIENDO`.
- La zona `x=56–1024`, `y=1180–1586` queda reservada desde la entrada hasta el final. Los subtítulos
  coincidentes se desplazan por encima; nunca se ocultan ni se colocan sobre el grafismo.
- Aplicar con `video-production/scripts/apply-maria-follow-card.mjs`, que genera una copia
  renderizable dentro del proyecto y conserva intacta la fuente maestra.

## Checklist antes de aprobar

- Se reconoce la marca aunque no aparezca el nombre ni el logo.
- Los destacados de subtítulos combinan azul profundo y Merlot cuando la frase lo pide, siempre con texto blanco y sin sombra gris.
- Cada subtítulo declara `caption--on-media` o `caption--on-light`; no existe un blanco global para todos los fondos.
- En fondos crema, blancos o azul claro, el texto normal es tinta `#241E1B`; en vídeo o fondo complejo puede ser blanco con contorno negro muy fino.
- El primer fotograma, punto medio y final de cada recurso claro o complejo mantienen un contraste mínimo de `4.5:1`. Un fallo de contraste bloquea la aprobación.
- El azul sostiene continuidad y el merlot queda para otros acentos editoriales puntuales.
- Los subtítulos están en mayúsculas, no bajan de `52 px` y conservan tildes y signos.
- Cada subtítulo queda bajo la barbilla y sobre el pecho, fuera de los `360 px` inferiores reservados para la interfaz de plataforma.
- Todos los apoyos gráficos tienen formato definido (`arriba`, `abajo`, `completo` o `pip-llamada`), transición y SFX verificados.
- La secuencia mezcla formatos con intención y no produce un vaivén predecible arriba/abajo.
- En cada recurso a pantalla completa, María queda oculta durante ese beat y el subtítulo ocupa una zona segura que no pisa el contenido del grafismo.
- En cada `pip-llamada`, la ventana de María queda libre de subtítulos durante todo el beat y el SFX `whoosh-tuck` se oye sin tapar la voz.
- La persona conserva proporción natural; con apoyo arriba, la cabeza aparece completa y mantiene margen visible sobre el pelo.
- No hay nombres heredados, marcas de agua ni textos solapados.
- Los SFX se distinguen sin tapar la voz.
- No parece una plantilla de agencia.
- La referencia original no domina sobre la marca.
- La CTA empieza `1,5 s` antes de `sígueme`, termina con el vídeo, cambia a `SIGUIENDO` tras el
  clic y no colisiona con ningún subtítulo.

## Prohibición de formato ambiguo

- Prohibidas las cartulinas flotantes casi a pantalla completa. Un recurso grande debe ocupar el `100 %`; un recurso parcial debe ser una mitad real, un `pip-llamada`, un grafismo integrado o un panel compacto.
- Prohibidos los paneles que ocultan cara o cuerpo y dejan alrededor restos de vídeo sin valor visual.
- Sobre vídeo, foto, b-roll, captura o cualquier fondo con detalle, las letras pequeñas o medias, diagramas y subtítulos necesitan una placa local sólida o semitransparente (`65–85 %`) salvo que el contraste real `4.5:1` quede verificado en el primer fotograma, punto medio y final del beat. La placa se ajusta al contenido y no se convierte en una cartulina casi completa.
- La caja de cada subtítulo se calcula respecto al rostro: primera línea por debajo de la barbilla y nunca sobre la boca.
- El cierre tiene una sola jerarquía: no se permiten titulares o palabras sueltas arriba que compitan con la CTA o la follow card.
- Pantalla completa, formatos divididos, `pip-llamada`, grafismos directos y paneles compactos siguen autorizados cuando cumplen su función y las zonas seguras.

## Puerta de no regresión para reglas nuevas

- Toda regla nueva debe declarar qué defecto corrige y qué recursos aprobados conserva.
- Evaluar su impacto como `conserva`, `limita` o `elimina`. `Elimina` requiere aprobación expresa; por defecto solo se permite limitar el patrón defectuoso.
- Comprobar compatibilidad con pantalla completa, formatos divididos, `pip-llamada`, grafismos directos, paneles compactos, transiciones, SFX y CTA.
- La nueva regla debe mejorar legibilidad, jerarquía, ritmo o seguridad visual sin reducir injustificadamente la variedad profesional.
- Validar el caso corregido y una muestra de cada formato relacionado antes de propagarla a la plantilla.
# Fronteras editoriales verificables

Todo Reel de María declara su estructura en `editorial-structure.json` y pasa
`node scripts/validate-editorial-structure.mjs <project-folder>`.

- Hook textual obligatorio antes de la lista y hook visual obligatorio mediante sticker real.
- Sticker real: ilustración, objeto o recorte con contorno propio. No se acepta como sticker una card, panel, gráfico, tabla o texto en caja.
- La animación del sticker puede ser un bucle corto o movimiento tipo GIF, pero debe ser finita y determinista.
- Los numerales siempre comienzan un caption nuevo.
- Las fronteras de fondo, layout, modo de contraste y fase dividen captions incluso con igualdad exacta de timestamp.
- Toda petición explícita del usuario requiere evidencia en el manifiesto y bloquea QA si falta.
- Se muestrean las transiciones en `límite - 1 frame`, `límite` y `límite + 1 frame`.
