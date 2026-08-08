# Seguridad facial humana y centrado de captions — Video Studio María V2

Estado: regla normativa V2.

## Propósito y precedencia

Esta regla corrige la ambigüedad de las expresiones `cara`, `rostro`,
`face-safe` y `no tapar caras` en los manuales generales.

En producciones `MARIA-V2`, esas expresiones se refieren a **caras humanas**.
Para seguridad facial y centrado de captions, este documento prevalece sobre
cualquier redacción genérica anterior. El flujo `CONTROL-ANTIGUO` no cambia.

## Regla

- La primera zona de exclusión es la cara humana de María: pelo, frente, ojos,
  nariz, boca y barbilla. Si aparecen otras personas, sus caras humanas también
  se protegen según su importancia en el plano.
- Animales, mascotas, estatuas, ilustraciones, juguetes, objetos y elementos
  con apariencia de cara no crean por sí solos una zona de exclusión facial.
- Un animal u objeto no justifica desplazar horizontalmente un caption ni
  descentrar una composición. Puede quedar detrás del caption si la lectura y
  la jerarquía siguen siendo correctas.
- Excepción: si el brief declara expresamente que un animal u objeto es el
  protagonista narrativo de un beat, puede reservarse como sujeto compositivo.
  La excepción debe constar en el storyboard y no se denomina `face-safe`.

## Centrado de captions

- Cuando María está visible como talking head, el caption parte de un centrado
  óptico respecto al lienzo o a la franja útil. Es un criterio compositivo, no
  una coordenada matemática obligatoria.
- Su posición vertical se calcula respecto a la cara humana de María: primera
  línea bajo la barbilla, con aire visible, y bloque sobre la parte alta del
  pecho.
- Puede desplazarse lo necesario para conservar ese anclaje humano, evitar otra
  cara humana, una zona de `pip-llamada`, la follow card, la interfaz reservada
  de plataforma o información gráfica esencial.
- No se desplaza para proteger la cara de un caballo u otro animal.
- Si hay varias caras humanas, se centra dentro de la zona útil que quede libre
  y se documenta la exclusión en el storyboard.
- Cuando María queda oculta por un apoyo a pantalla completa, el caption usa la
  zona segura diseñada para ese grafismo. No tiene que imitar la posición que
  ocupaba debajo de su cara.
- Durante la transición entre María y una pantalla completa, el caption puede
  mantenerse en una franja coherente, dividirse o usar una placa local para
  conservar la lectura en ambos fondos.

## QA

- Un desplazamiento claro respecto al centro óptico debe responder a una
  necesidad humana, gráfica o de interfaz permitida por esta regla.
- Es un defecto objetivo descentrar un caption únicamente para no cubrir un
  animal u objeto.
- No describir como `ambas caras` un plano con una persona y un animal. Debe
  distinguirse `cara humana` de `animal presente en el encuadre`.

## Alcance no afectado

Esta precisión no autoriza cubrir caras humanas, bocas, manos, zonas de CTA,
`pip-llamada`, datos esenciales ni los `360 px` inferiores reservados. Tampoco
modifica literalidad, tipografía, tamaño, color, contraste o sincronización de
captions.
