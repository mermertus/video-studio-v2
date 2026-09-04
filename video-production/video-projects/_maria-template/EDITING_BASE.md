# Base de edición: María Bejarano

Estas reglas son obligatorias en cada Reel de talking-head. La referencia aprobada combina a María con apoyos gráficos dinámicos en la mitad superior, la mitad inferior, a pantalla completa o en `pip-llamada`. Si el material no permite cumplir una regla, hay que indicarlo antes de renderizar; no improvisar una solución que cambie este sistema.

## Jerarquía del montaje

- Formato vertical `9:16` y María como protagonista.
- Usar cuatro formatos de apoyo: mitad superior, mitad inferior, pantalla completa o `pip-llamada`. En los formatos divididos, el gráfico, b-roll, captura o mockup ocupa una mitad y María se reencuadra proporcionalmente en la mitad complementaria. En pantalla completa, María queda oculta temporalmente y el recurso ocupa todo el lienzo.
- Combinar los formatos con intención. No usar una secuencia mecánica arriba/abajo/arriba/abajo: resulta predecible y puede producir sensación de vaivén. La elección depende de la idea, el encuadre anterior, la cara, las manos, el contenido del gráfico y la zona segura de subtítulos.
- En formato dividido, el apoyo visual debe ocupar aproximadamente el `40–55 %` del lienzo. En formato completo, debe cubrir el `100 %` y justificar el cambio de escala por la importancia o densidad de la idea.
- No estirar, aplastar ni alterar la proporción del vídeo. Reencuadrar mediante recorte proporcional (`object-fit: cover` o recorte equivalente).
- No colocar tarjetones encima de la cara ni sustituir el apoyo visual por una caja de texto genérica.

## Recurso `pip-llamada`

- `pip-llamada` es un recurso ocasional para dar protagonismo a un grafismo sin perder del todo la presencia de María. No se usa por defecto ni en todos los apoyos.
- El plano principal de María se reduce y viaja hacia una ventana abajo a la derecha, estilo llamada/WhatsApp, mientras el grafismo ocupa el resto del lienzo.
- La ventana conserva proporción natural, no deforma el rostro y usa bordes redondeados, borde azul claro y sombra suave. Tamaño recomendado en `1080x1920`: `300–380 px` de ancho, con margen derecho `48–64 px`.
- La transición dura `0,45–0,65 s`, usa easing suave (`power2.inOut` o equivalente), sin bounce ni spring. SFX recomendado: `whoosh-tuck`.
- No usar `pip-llamada` en hooks donde la cara debe mandar, en CTAs finales con follow card, en escenas ya cargadas o cuando la ventana obligaría a reducir subtítulos por debajo del mínimo.
- A veces el grafismo debe ir solo y María debe desaparecer temporalmente. `pip-llamada` no sustituye al formato de pantalla completa.

## Reencuadre seguro de María

- El reencuadre se decide sobre el plano real: no aplicar a todos los clips el mismo `object-position`, escala o desplazamiento vertical.
- Cuando el apoyo visual está arriba y María ocupa la mitad inferior, deben verse completos el pelo, la cabeza, la barbilla y la parte alta del pecho.
- Dejar sobre el pelo un margen libre equivalente al `6–10 %` de la altura disponible para María. Las orejas y la barbilla tampoco pueden quedar cortadas.
- Si cabeza, pecho y subtítulo no caben en un reparto `50/50`, reducir el apoyo al `45 %` o usar un reparto `40/60` a favor de María. Nunca ganar espacio cortando la cabeza.
- Ajustar escala y posición del vídeo antes de usar `object-fit: cover`; si el recorte proporcional sigue siendo inseguro, usar un encuadre contenido con fondo de marca.

## Identificación y marca visible

- No escribir `MARÍA BEJARANO`, `MARIA BEJARANO` ni variantes del nombre en la esquina superior, dentro de los gráficos, en el pie de las tarjetas ni como marca de agua repetida.
- No añadir el nombre de otra persona, cliente o plantilla, como `Ana`, salvo que el guion pida identificar expresamente a esa persona.
- La marca debe reconocerse por paleta, tipografía y tratamiento editorial; no por repetir el nombre en pantalla.

## Subtítulos

- Transcribir literalmente lo que María dice. No resumir, pulir, completar ni reescribir frases.
- Corregir únicamente errores obvios de reconocimiento automático después de contrastarlos con el audio.
- Mostrar todos los subtítulos en MAYÚSCULAS, conservando las tildes, la `Ñ`, la puntuación y la literalidad de la transcripción. La mayúscula es un tratamiento visual; no justifica modificar las palabras.
- Usar como máximo dos líneas, con cortes de frase naturales y sincronización precisa con la voz.
- En `1080x1920`, usar Work Sans a `56–68 px`, peso `700–800` e interlineado `1.08–1.18`. Nunca reducir por debajo de `52 px`; si no cabe, dividir la frase en un bloque más corto.
- Anclar el bloque debajo de la barbilla y sobre la parte alta del pecho, adaptándolo a la cara de cada plano. No usar una coordenada vertical fija para todo el vídeo.
- "Debajo de la barbilla" no significa pegado a la cara: debe quedar aire visible entre la barbilla y la primera línea. En plano completo o cuando el apoyo visual está arriba y María ocupa la zona inferior, bajar el subtítulo hacia el pecho aproximadamente `0,75–1,25` alturas de línea respecto al borde inferior de la barbilla.
- Si al bajar el subtítulo invade los `360 px` inferiores de interfaz, ampliar la zona de María (`40/60` o equivalente) o acortar el bloque; nunca volver a pegarlo a la cara para hacerlo caber.
- Reservar como mínimo los `360 px` inferiores de un Reel `1080x1920` para captions, botones y elementos de interfaz que añaden Instagram, TikTok, YouTube Shorts u otras plataformas.
- Cuando aparece un apoyo gráfico, recolocar los subtítulos en una zona central segura que no corte la cara, la boca, el collar, las manos ni información del gráfico.
- Si el gráfico entra abajo, mantener el subtítulo bajo la barbilla y sobre el pecho dentro de la mitad superior. Si el gráfico entra arriba, mantener ese mismo anclaje facial dentro de la mitad inferior, sin invadir los `360 px` reservados por la plataforma.
- Si el recurso entra a pantalla completa, mover el subtítulo a una franja segura prevista dentro del propio diseño, fuera de los `360 px` inferiores de interfaz. Esa franja no puede coincidir con titulares, cifras, diagramas, capturas ni información esencial.
- Si se usa `pip-llamada`, reservar desde el inicio de la transición hasta el final del beat la caja de la ventana y una zona de exclusión alrededor. En `1080x1920`, usar como guía `x=620–1080`, `y=1180–1920`, o la caja real si la ventana cambia. Los subtítulos nunca pueden ponerse encima de la imagen tipo llamada/WhatsApp, ni tocarla, ni pasar por detrás de ella durante la transición.
- Durante `pip-llamada`, recolocar el subtítulo en una franja central segura o dividir la frase. Está prohibido resolver el problema bajando el tamaño por debajo de `52 px`.
- Reservar una separación visual mínima equivalente al alto de una línea de subtítulo respecto a la cara, la línea divisoria y cualquier elemento gráfico.
- Los destacados de palabras clave pueden usar azul profundo de marca `#4A7691` (`--maria-blue-deep` / `--caption-highlight-bg`) y Merlot `#5C1A2C` (`--maria-merlot` / `--caption-highlight-alt-bg`) con texto blanco.
- Como criterio base, cada bloque de subtítulo debe llevar una o dos palabras destacadas cuando la frase lo permita. Usar azul para sostener la idea y Merlot para tensión, decisión, contraste o CTA.
- Elegir el color normal por el fondo real de cada beat, nunca con un blanco global:
  - `caption--on-media`: texto blanco `#FFFFFF`, con contorno negro muy fino solo si un plano de vídeo o fondo complejo lo exige.
  - `caption--on-light`: texto tinta `#241E1B`, sin contorno, sombra, resplandor ni banda sobre crema, blanco, azul claro u otro campo luminoso.
- Está prohibido mantener texto blanco normal sobre un fondo claro y confiar en el contorno para hacerlo legible.
- Si el fondo cambia mientras el subtítulo está visible, dividir el clip o cambiar el modo exactamente en la transición. El storyboard debe declarar `modo_subtitulo: sobre-media | sobre-claro` para cada beat.
- No usar sombra gris, caja gris, resplandor gris ni banda oscura detrás de los subtítulos en ninguno de los dos modos.
- El color destacado nunca puede cambiar, resumir o sustituir las palabras literales.

## B-roll, imágenes y motion graphics

- En cada idea importante usar un gráfico explicativo, b-roll real, imagen tipo stock pertinente, captura real o mockup creíble.
- Priorizar visuales que expliquen: gráficos de datos, comparativas, diagramas, interfaces, procesos y objetos relacionados con la frase.
- Los apoyos gráficos, tanto arriba como abajo o a pantalla completa, deben tener movimiento funcional: trazado, conteo, aparición por capas, paneo o zoom suave.
- Usar la pantalla completa para ideas que necesiten protagonismo, densidad visual o un cambio de ritmo. Durante ese beat no debe verse a María, pero su voz y los subtítulos continúan.
- Diseñar primero la zona de subtítulos del recurso completo y después distribuir el resto del contenido alrededor de ella; nunca superponer el subtítulo al terminar.
- Alternar apoyos visuales y cortes del propio vídeo para mantener dinamismo sin convertirlo en una plantilla llamativa.
- Todo texto interno de un gráfico debe tener una zona propia. Etiquetas, titulares, ejes, leyendas, cifras y elementos ilustrados no pueden solaparse entre sí.
- No colocar mensajes secundarios encima de anillos, barras, iconos, fotografías o zonas de datos. Si no caben, simplificar el gráfico o mover el texto a una franja libre.
- Todo texto pequeño o medio sobre vídeo, foto, b-roll, captura o fondo con detalle debe llevar una placa local sólida o semitransparente del `65–85 %`, ajustada al bloque de información. Solo se puede omitir si el contraste real alcanza `4.5:1` en el primer fotograma, punto medio y final del beat.

## Movimiento y transiciones

- Cada entrada de un apoyo gráfico debe incluir obligatoriamente una transición visible y un SFX sincronizado. Nunca introducir un gráfico de forma estática o silenciosa.
- Introducir y retirar los apoyos visuales con corte motivado, wipe suave, desplazamiento de composición, máscara o transición de `0,35–0,65 s`.
- Variar de forma controlada entre apoyos arriba, abajo, completos y `pip-llamada`, usando entradas desde arriba, desde abajo, wipe lateral, cover, disolución o reducción hacia esquina según la posición final. La variedad afecta al formato, no solo a la dirección de entrada.
- Sincronizar cada transición con una palabra, cambio de idea o énfasis real del discurso.
- Aplicar punch-ins o cambios de plano suaves en el vídeo de María cuando ayuden al ritmo, siempre sin deformación.
- Evitar rebotes, springs, zooms bruscos y transiciones decorativas sin función.

## Sonido

- Mantener la voz como protagonista. Toda entrada de gráfico, b-roll, captura, imagen o mockup debe llevar un SFX claramente audible y sincronizado con su transición.
- La salida o sustitución del apoyo puede llevar un segundo SFX más ligero cuando ayude a entender el movimiento.
- Tipos preferidos: whoosh corto para transición, `whoosh-tuck` para reducción a `pip-llamada`, click para interfaz, impacto suave para conclusión y chime para CTA.
- Ajustar cada SFX para que se note sin tapar sílabas ni competir con la voz. Revisar con auriculares y también con altavoz de móvil.
- Si un SFX no se distingue en el MP4 final, aumentar su ganancia antes de entregar.

## Control obligatorio antes de renderizar

- Buscar visualmente y en el código cualquier aparición no solicitada de `MARÍA BEJARANO`, `MARIA BEJARANO`, nombres heredados o marcas de agua.
- Comparar audio y subtítulos en varios puntos: cada frase visible debe coincidir literalmente con la voz.
- Comprobar que todos los subtítulos están en mayúsculas, conservan tildes y signos, usan `56–68 px` y nunca bajan de `52 px`.
- Revisar el color de todos los destacados: azul profundo `#4A7691` y/o Merlot `#5C1A2C`, con texto blanco y sin sombra gris.
- Confirmar que cada bloque declara `caption--on-media` o `caption--on-light` y que no existe un color blanco global aplicado a todos los fondos.
- Revisar el primer fotograma, punto medio y final de cada recurso claro o complejo: texto normal tinta `#241E1B` sobre fondos claros, texto con placa local sobre fondos con detalle salvo contraste verificado, y contraste mínimo de `4.5:1`. Un fallo bloquea el render final.
- Revisar fotogramas con y sin gráfico: subtítulos bajo la barbilla y sobre el pecho, sin tapar cara, manos o información y fuera de los `360 px` inferiores reservados por la plataforma.
- En plano completo y en cada apoyo situado arriba, confirmar que hay aire visible entre barbilla y subtítulo y que el bloque descansa visualmente sobre el pecho, no pegado al rostro.
- Confirmar en el storyboard y en el render que cada apoyo gráfico tiene los tres elementos: formato `arriba`/`abajo`/`completo`/`pip-llamada` definido, transición visible y SFX audible.
- Confirmar que la secuencia no repite un patrón mecánico arriba/abajo y que incluye cambios de formato motivados por el contenido.
- En cada recurso completo, revisar que María queda oculta durante todo el beat y que el subtítulo permanece legible sin tapar ningún elemento esencial del grafismo.
- En cada `pip-llamada`, revisar primer fotograma, punto medio y final: la ventana de María no deforma el rostro y ningún subtítulo pisa su caja.
- Revisar el primer fotograma, el punto medio y el final de cada gráfico para detectar solapamientos internos.
- Confirmar que el vídeo de María conserva su proporción y que el reencuadre no deforma cara, hombros ni fondo.
- En el primer fotograma, punto medio y último fotograma de cada apoyo situado arriba, confirmar cabeza completa y un `6–10 %` de aire visible sobre el pelo.
- Reproducir el MP4 completo y comprobar movimiento real, variedad entre arriba/abajo/completo/pip-llamada, transiciones, sincronía y SFX audibles.
- No entregar si existe un solo texto pisado, elemento cortado, rótulo heredado o subtítulo fuera de su zona segura.
- No entregar con cartulinas flotantes casi a pantalla completa: convertirlas en `completo` o reducirlas a un apoyo compacto/dividido con función clara.
- No entregar con paneles que tapen cara o cuerpo y dejen visibles fragmentos de vídeo sin utilidad.
- Si un grafismo directo, subtítulo o texto interno pierde legibilidad sobre el metraje, añadir una base local sólida o semitransparente (`65–85 %`) ajustada al contenido. No aprobar texto flotando solo con sombra/contorno sobre fondos con detalle.
- Confirmar plano a plano que la primera línea del subtítulo queda bajo la barbilla y nunca cubre la boca.
- En el cierre, eliminar titulares o palabras sueltas que compitan con la CTA o la follow card principal.

## Control de no regresión al cambiar estas reglas

- Antes de añadir o endurecer una regla, escribir: `problema que corrige`, `recursos que conserva` e `impacto: conserva | limita | elimina`.
- Una modificación no puede eliminar un formato, efecto, transición, SFX o cierre aprobado salvo petición expresa de María.
- Limitar la norma al patrón defectuoso y conservar las alternativas profesionales que ya funcionan.
- Revisar el caso que provocó el cambio y al menos un ejemplo de cada formato afectado.
- No propagar la regla si reduce variedad, ritmo o capacidad explicativa sin aportar una mejora visual verificable.
# Gate estructural obligatorio

Antes de renderizar:

1. Completar `editorial-structure.json` con hook textual pronunciado, sticker real del hook, requisitos explícitos, enumeración y fases.
2. Separar todo numeral en un caption nuevo.
3. Cortar captions en cada cambio de fondo, layout, contraste o fase, incluida la igualdad exacta del timestamp.
4. Ejecutar `node ../../scripts/validate-editorial-structure.mjs .`.
5. Muestrear cada frontera en un frame antes, límite y un frame después.
