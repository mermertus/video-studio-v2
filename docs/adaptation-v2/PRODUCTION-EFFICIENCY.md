# Producción eficiente — Video Studio María V2

## Coexistencia

La V2 es opt-in por proyecto mediante `maria-studio.v2.json`. La ausencia de
ese archivo mantiene el flujo anterior. No existe migración automática ni
reemplazo de reglas. Cada patrón se instala como copia local congelada y un
vídeo antiguo nunca depende de un patrón compartido posterior.

## Perfil económico predeterminado

1. Analizar fuente, transcript y recursos una vez.
2. Redactar brief/storyboard internamente sin pedir aprobación previa.
3. Construir un único candidato completo a calidad final.
4. Ejecutar una auditoría agrupada con un presupuesto normal de diez frames
   representativos.
5. Corregir automáticamente una sola tanda de defectos objetivos.
6. Verificar únicamente los intervalos cambiados, sus límites y los efectos
   temporales de riesgo.
7. Presentar el candidato.
8. Si se aprueba sin cambios, promover el mismo MP4 byte a byte como final, sin
   un segundo render.

No repetir transcripción, inventario, storyboard, auditoría completa o render
cuando el material no ha cambiado.

## Muestreo visual

El muestreo base incluye hook, un frame estable por familia de layout, cada
transición realmente riesgosa, caption cercano a cara/borde, CTA y cierre.
Inicio/mitad/final de todos los elementos queda reservado para incidencias o
composiciones de riesgo. Máscaras y bordes alfa usan una ráfaga temporal corta
solo en su ventana.

## Límite de correcciones

Una auditoría completa, una corrección agrupada y una verificación delta. No
hay tercer ciclo automático. Si el arreglo complejo falla, se aplica el
fallback registrado. Una decisión creativa se presenta a María; un defecto
objetivo se corrige sin interrumpir el avance.

## Presupuesto de estímulos

- Aproximadamente un hero cada 25 segundos cuando el contenido lo justifique;
  es una orientación editorial, no una cuota ni una separación matemática.
- Hasta dos estímulos fuertes, nunca simultáneos.
- Al menos 1,2 segundos de respiración entre estímulos fuertes.
- Normalmente tres a cinco apoyos funcionales por minuto.
- Los nuevos patrones complementan los apoyos existentes; no los sustituyen.
- Sin SFX duplicado para microanimaciones dentro de una entrada que ya tiene
  sonido.
