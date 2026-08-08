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
- Todo cambio de fondo, layout o fase fuerza un corte de caption, incluso si el timestamp coincide exactamente con el final de una palabra. Validar el fotograma anterior, el límite y el posterior.
- En una enumeración, cada numeral empieza un caption nuevo. Está prohibido unir la última palabra del punto anterior con `1.`, `2.`, `3.` o cualquier numeral siguiente. Los numerales pueden aparecer además como marcadores editoriales grandes y breves.
- No mostrar `MARÍA BEJARANO` como rótulo persistente, pie de gráfico o marca de agua.
- B-roll, capturas, imágenes tipo stock y mockups deben explicar o reforzar la idea.
- Hook obligatorio: todo vídeo empieza con un hook textual identificable y literal, acompañado por un hook visual creado. El punto `1.` de una enumeración nunca funciona como sustituto del hook.
- Sticker obligatorio de hook: todo Reel incluye como mínimo un sticker o ilustración contextual real en los primeros segundos. Debe resumir visualmente la tensión, promesa o contradicción inicial, ir grande y por delante de la imagen, entrar pronto con transición y SFX, y no tapar cara ni subtítulo de forma que perjudique la lectura.
- Jerarquía y capas de sticker V2: un sticker aprobado no es un icono pequeño perdido en esquina. Debe ocupar una zona predominante y leerse como recurso editorial. En el hook se prioriza capa frontal; en el cuerpo se prioriza integración detrás de cabeza/cuerpo mediante recorte o máscara, sin tapar cara, boca, manos ni información clave.
- Definición verificable: un sticker tiene silueta propia de ilustración, recorte u objeto gráfico. Un panel, tarjeta, gráfica o caja rectangular no cuenta como sticker aunque el código o storyboard lo denominen así.
- Movimiento de sticker V2: entrada `0,35–0,65 s` con `pop`, escala, rotación leve, `wiggle` corto o equivalente; SFX sincronizado; salida limpia antes del siguiente recurso si hay riesgo de solape. Puede moverse como un GIF mediante un ciclo finito y determinista.
- Stickers e ilustraciones contextuales son un formato de apoyo aprobado junto a capturas, mockups, b-roll, gráficos y pantallas. Representan conceptos hablados de forma literal o metafórica clara; no sustituyen al subtítulo ni repiten sus palabras. En desarrollo, la mayoría deben quedar detrás de la silueta si el plano permite un recorte limpio.
- Cadencia: valorar sticker protagonista en el hook y después intercalar 1-3 stickers en énfasis reales del desarrollo cuando aporten comprensión, retención o energía. No reemplazan todos los paneles/capturas/b-roll.
- Todo sticker o ilustración debe quedar inventariado por beat: frase literal, concepto representado, archivo/fuente si existe, capa, posición, transición, SFX, zona segura de subtítulo y salida. Si no aporta comprensión, retención o énfasis editorial, no se usa.
- Una petición explícita de recursos, como “poner stickers”, se convierte en requisito bloqueante del brief y del QA y necesita evidencia en el render.
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
- El hook conserva el texto literal pronunciado y contiene un sticker/ilustración contextual real y visible.
- Los stickers/ilustraciones usados dentro del vídeo están justificados por frase y tienen concepto, transición, SFX y zona segura documentados.
- Todo sticker visible tiene tamaño protagonista y capa definida: frontal en hook, preferentemente detrás de cabeza/cuerpo en desarrollo, salvo motivo editorial explícito.
- Ningún sticker queda reducido a mini-icono decorativo en esquina.
- Ninguna tarjeta, panel o gráfica se contabiliza como sticker sin silueta propia.
- Ningún numeral de una enumeración comparte caption con la última palabra del punto anterior.
- Todo cambio de fondo, layout o fase corta el caption y pasa la revisión `fotograma anterior / límite / fotograma posterior`.
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
