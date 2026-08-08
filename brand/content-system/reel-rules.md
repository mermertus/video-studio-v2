# Reglas de Reels

## Base

Los Reels deben tener presencia humana, claridad y capas útiles.

## Portadas

Modos aprobados:

- Titular editorial: 2 a 6 palabras, una destacada.
- Retrato + titular: María visible, rostro grande, titular en zona segura.
- Dato protagonista: la cifra manda; el contexto es secundario.
- Posicionamiento / venta: mensaje breve, merlot opcional y puntual.

## Edición

- Los subtítulos se muestran siempre en MAYÚSCULAS, manteniendo tildes, signos y transcripción literal.
- En un lienzo `1080x1920`, usar Work Sans a `56–68 px`, peso `700–800` e interlineado `1.08–1.18`. Nunca bajar de `52 px`: si una frase no cabe, dividirla en un bloque más corto de un máximo de dos líneas.
- Anclar cada bloque debajo de la barbilla y sobre la parte alta del pecho. La posición se calcula respecto al rostro de ese plano, no con una coordenada vertical genérica.
- Reservar como mínimo los `360 px` inferiores de un Reel `1080x1920` para captions, botones e interfaz de Meta y otras plataformas.
- Los destacados de subtítulos pueden combinar azul profundo `#4A7691` y Merlot `#5C1A2C`, siempre con texto blanco y nunca sombra gris. Como criterio base, cada bloque debe llevar una o dos palabras destacadas cuando la frase lo permita: azul para sostener la idea; Merlot para tensión, decisión, contraste o CTA.
- El subtítulo normal usa contraste adaptativo según el fondo real de cada beat:
  - `sobre-media`: texto blanco, con contorno negro muy fino solo si el vídeo o fondo complejo lo exige.
  - `sobre-claro`: texto tinta `#241E1B`, sin contorno, sombra, resplandor ni banda oscura, cuando el fondo sea crema, blanco, azul claro u otro campo luminoso.
- Está prohibido mantener texto blanco normal sobre un fondo claro y confiar en el contorno para hacerlo legible. Los destacados conservan fondo de marca, azul profundo `#4A7691` o Merlot `#5C1A2C`, con texto blanco en ambos modos.
- Si el fondo cambia durante un bloque, dividir el subtítulo o cambiar el modo exactamente en la transición. Cada beat del storyboard debe declarar `modo_subtitulo: sobre-media | sobre-claro`.
- Todo límite de fondo, layout o fase es también un límite obligatorio de subtítulo. La separación se aplica aunque el timestamp coincida exactamente con el final de una palabra; ningún bloque puede atravesar el corte con el modo de contraste anterior.
- En enumeraciones, cada numeral (`1.`, `2.`, `3.`...) abre un bloque nuevo. Nunca puede compartir subtítulo con la última palabra, cifra o signo del punto anterior. La frase anterior permanece completa en su fase y el numeral siguiente inicia la nueva.
- Los numerales pueden reforzarse durante unos instantes como marcadores editoriales grandes, conservando simultáneamente la literalidad del subtítulo y sin competir con otro estímulo protagonista.
- B-roll, imágenes tipo stock, capturas, mockups, gráficos y pantallas cuando aporten contexto.
- Los apoyos visuales pueden usar cuatro formatos: mitad superior, mitad inferior, pantalla completa o `pip-llamada`. En los formatos divididos, María se reencuadra proporcionalmente en la mitad complementaria; en pantalla completa, María se oculta temporalmente y el recurso ocupa todo el lienzo.
- Todo Reel comienza con un hook textual identificable en el audio o guion y preservado literalmente en subtítulos. Antes de una enumeración debe existir ese hook; el punto `1.` no puede sustituirlo.
- El hook textual se acompaña obligatoriamente de un hook visual creado para el concepto. Como mínimo debe incluir un sticker o ilustración contextual real en los primeros segundos, comprensible de un vistazo, con transición breve y SFX sutil.
- Regla de capas de stickers V2: el sticker del hook va grande, llamativo y por delante de la imagen para parar el scroll. En el cuerpo del vídeo, la mayoría de stickers relevantes deben ir grandes pero integrados detrás de la cabeza o del cuerpo mediante recorte/máscara cuando el plano lo permita, para dar profundidad sin mover ni tapar subtítulos.
- Cuando se usa un sticker, no puede quedar como icono mínimo en una esquina: debe tener jerarquía de recurso editorial, tamaño protagonista y lectura inmediata. Solo va por delante fuera del hook si no tapa cara, boca, manos, subtítulos ni información clave.
- Un sticker real es una ilustración, recorte u objeto gráfico con silueta propia; una tarjeta rectangular, panel, gráfica o caja con bordes redondeados no se valida como sticker por estar etiquetada así en el storyboard.
- En el hook, el sticker es obligatorio y debe sentirse como golpe visual principal: entrada con `pop`, escala, rotación leve, `wiggle` corto o efecto equivalente, duración `0,35–0,65 s` y SFX sincronizado. Puede tener movimiento tipo GIF si el bucle es finito, determinista, sutil y no distrae de la voz.
- Durante el resto del vídeo, los stickers e ilustraciones contextuales quedan aprobados como un recurso visual más para intercalar con capturas, mockups, b-roll, gráficos y pantallas. Se usan para convertir conceptos hablados en una imagen concreta, no como decoración, y se prioriza la capa detrás de María para aportar integración y profundidad.
- La cadencia recomendada es editorial: hook + 1-3 stickers intercalados en énfasis reales cuando aporten comprensión, retención o energía. No convertir todos los apoyos en stickers ni usarlos como decoración.
- Cada sticker o ilustración debe vincularse a una frase literal del transcript y declarar concepto representado, capa (`delante`, `detrás de cabeza/cuerpo` o `mixta`), posición, entrada, SFX y zona segura de subtítulos en el storyboard.
- Toda petición visual explícita de María se registra como requisito obligatorio del brief y del QA, con timestamp y evidencia renderizada. No basta con declararla en el storyboard.
- `pip-llamada` es un recurso opcional, no un uso permanente: el grafismo ocupa el protagonismo y María pasa a una ventana pequeña tipo llamada/WhatsApp abajo a la derecha, con proporción intacta, bordes redondeados, borde azul claro y sombra suave. Usarlo cuando conviene mantener presencia humana mientras un gráfico, captura, comparativa o proceso necesita más espacio. No usarlo en hooks emocionales, CTAs finales con follow card ni escenas ya cargadas.
- En `pip-llamada`, la transición debe mostrar la imagen principal reduciéndose y desplazándose a la esquina en `0,45–0,65 s`, con easing suave y sin rebote. SFX recomendado: `whoosh-tuck`.
- La ventana `pip-llamada` reserva su zona completa desde que empieza la transición hasta que María vuelve a plano principal o desaparece. Los subtítulos nunca pueden colocarse encima de esa ventana ni solaparla parcialmente; si no caben, subirlos a una franja central segura o dividir la frase.
- No encadenar los apoyos con un patrón fijo arriba/abajo/arriba/abajo. Mezclar los formatos según el contenido para crear ritmo sin un vaivén predecible o mareante.
- Cuando el apoyo visual ocupa la mitad superior, el reencuadre inferior debe mostrar completos pelo, cabeza, barbilla y parte alta del pecho, con un margen libre del `6–10 %` sobre el pelo. Si no cabe, reducir el apoyo al `45 %` o usar un reparto `40/60`; nunca resolverlo cortando la cabeza.
- Cada entrada de apoyo visual debe ir acompañada obligatoriamente de una transición visible y un SFX claramente audible.
- Cuando el recurso ocupa la pantalla completa, diseñar una zona segura específica para los subtítulos antes de componer el grafismo. El texto no puede tapar titulares, datos, diagramas, capturas ni elementos esenciales.
- Revisar el primer fotograma, el punto medio y el final de cada recurso claro o complejo. El texto normal debe alcanzar un contraste mínimo de `4.5:1`; si no lo alcanza, el vídeo no está listo para aprobar.
- Los subtítulos se recolocan en cada plano para conservar el anclaje barbilla/pecho sin tapar cara, manos o información del gráfico.
- No repetir `MARÍA BEJARANO` como rótulo o marca de agua.
- Movimiento calmado, funcional y acompañado de SFX audibles.
- Evitar deformación, textos solapados, transiciones agresivas o efectos que parezcan plantilla.

- En el cierre, buscar `sígueme` dentro de los últimos `10 s`. La CTA reutilizable de Instagram
  comienza exactamente `1,5 s` antes, permanece hasta el final y desplaza cualquier subtítulo fuera
  de su zona. Usar siempre el maestro de `brand/hyperframes/components/instagram-follow-card/`; la
  versión original aprobada se conserva en su subcarpeta `original/`.

## Para HyperFrames

Usar la marca como sistema de capas:

- Fondo claro o azul claro.
- Titular editorial.
- Subtítulos visibles con destacados en azul profundo y Merlot.
- Merlot reservado para acentos decisivos y palabras destacadas de subtítulo cuando refuercen tensión, contraste, decisión o CTA.
- Capturas, mockups y gráficos como apoyo.
- Anotaciones finas, líneas, flechas y datos.

## Regla de paneles, legibilidad facial y cierre

- No usar cartulinas flotantes que ocupen casi toda la pantalla sin llegar a ser pantalla completa. Si el contenido necesita esa escala, debe pasar a `completo`; si no, debe ser un panel compacto con una función y unos límites claros.
- No colocar paneles que tapen la cara o el cuerpo y dejen visibles únicamente tiras o fragmentos de vídeo sin utilidad narrativa.
- Todo texto pequeño o medio colocado sobre vídeo, foto, b-roll, captura o fondo con detalle necesita una base local sólida o semitransparente del `65–85 %`, limitada al bloque de información, salvo que se verifique contraste real `4.5:1` en el primer fotograma, punto medio y final del beat. No dejar titulares, subtítulos, etiquetas o diagramas flotando solo con contorno/sombra sobre imagen compleja.
- El subtítulo debe quedar por debajo de la barbilla, con aire visible, y nunca cubrir la boca.
- En el cierre no añadir titulares, palabras sueltas ni una segunda tarjeta que compitan con la CTA o la follow card principal.
- Esta regla no prohíbe los efectos aprobados: siguen disponibles pantalla completa, mitad real, `pip-llamada`, grafismo directo y panel compacto cuando cada formato está justificado.

## Evaluación de no regresión

Antes de incorporar una regla nueva al sistema:

- Identificar el defecto concreto que corrige y limitar la prohibición a ese defecto.
- Compararla con los formatos, efectos, transiciones, SFX y cierres ya aprobados.
- Clasificar su impacto como `conserva`, `limita` o `elimina`. Una regla no puede eliminar un recurso aprobado sin una indicación expresa de María.
- Confirmar que mantiene alternativas profesionales suficientes y no empobrece el ritmo, la variedad o la capacidad explicativa de la edición.
- Probarla primero sobre el caso que originó la corrección y revisar después al menos un beat de cada formato afectado.
- Si genera una contradicción, prevalece la solución que conserva lo aprobado y corrige únicamente el problema nuevo.
- En transiciones de fondo, layout o fase, revisar como mínimo el fotograma anterior, el fotograma exacto del límite y el fotograma posterior.
