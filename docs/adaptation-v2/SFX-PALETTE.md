# Paleta sonora María V2

La biblioteca completa se conserva: ningún efecto se elimina ni se renombra.
La paleta V2 es únicamente una capa de recomendación para evitar elegir sonidos
al azar.

Fuente:

`video-production/assets/sfx/maria-palette.v2.json`

| Evento | Preferido | Alternativas |
| --- | --- | --- |
| Transición general | `swoosh` | `swipe` |
| `pip-llamada` | `whoosh-tuck` | — |
| Panel/captura lateral | `swipe` | `swoosh` |
| Acción de interfaz | `click` | — |
| Icono/elemento pequeño | `telop` | `pop` |
| Conclusión/card | `impact-soft` | `thud` |
| Resultado positivo/CTA | `chime` | `ding` |
| Captura/prueba | `camera-shutter` | `shutter-release` |
| Problema/alerta | `subtle-warning` | — |

Cada asignación incluye un rango inicial orientativo, nunca un volumen
universal. La voz manda y la mezcla final requiere escucha humana.

El `transient_offset` del manifiesto se usa para que el golpe perceptivo coincida
con el aterrizaje visual:

```text
inicio del audio = momento visual - transient_offset
```

Validación:

```powershell
node .\tools\adaptation-v2\validate-maria-sfx-palette.mjs
```
