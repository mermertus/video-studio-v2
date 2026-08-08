# Uso de las fases 4 a 7 de Video Studio María V2

Estas fases añaden capacidades paralelas. No reemplazan
`split-screen-panels`, los scripts existentes, la biblioteca completa de SFX ni
ningún proyecto aprobado.

## 4. Layouts de apoyo

Skill:

`video-production/.claude/skills/maria-support-layouts/SKILL.md`

Invocación:

> Usa $maria-support-layouts para decidir el apoyo visual de este beat. Elige
> entre apoyo superior, inferior, pantalla completa, pip-llamada, grafismo
> directo o panel compacto según la intención de la frase. No añadas un apoyo
> si solo repite el subtítulo.

## 5. Inventario de scripts

Documentos:

- `docs/adaptation-v2/SCRIPT-INVENTORY.md`
- `docs/adaptation-v2/script-inventory.json`

Regeneración:

```powershell
node .\tools\adaptation-v2\inventory-production-scripts.mjs
```

Estado actual:

- 69 scripts.
- 8 activos.
- 6 disponibles.
- 3 experimentales.
- 52 Legacy HeyGen conservados.
- 0 desconocidos.

No se ha movido, renombrado, modificado ni eliminado ningún script.

## 6. Paleta sonora María

Configuración:

`video-production/assets/sfx/maria-palette.v2.json`

Validación:

```powershell
node .\tools\adaptation-v2\validate-maria-sfx-palette.mjs
```

La paleta recomienda nueve tipos de evento, pero conserva toda la biblioteca.
El inventario real actual contiene 25 muestras WAV: las 24 de la biblioteca de
referencia más `whoosh-tuck`, creado específicamente para `pip-llamada`.

Los rangos de volumen son puntos de partida. La voz siempre manda y la mezcla
necesita escucha humana.

## 7. Reformato seguro

Skill:

`video-production/.claude/skills/maria-ad-reformat-v2/SKILL.md`

Primer caso recomendado:

> Usa $maria-ad-reformat-v2 para crear una copia 4:5 de este proyecto aprobado:
> `<ruta>`. No modifiques el origen. Conserva audio, copy, timing, SFX y marca;
> adapta únicamente geometría, captions, apoyos y la instancia local de follow
> card. Quiero revisar el draft antes del final.

Ratios previstos:

- 4:5 — 1080 × 1350; primera validación.
- 1:1 — 1080 × 1080.
- 16:9 — 1920 × 1080.

Cada ratio requiere su propio preview, draft, QA y aprobación.
