# Uso de las fases 8 a 11 de Video Studio María V2

El plan original terminaba en la fase 8. Las fases 9–11 son una ampliación
aditiva basada en las capacidades restantes de la auditoría.

## 8. Preparación de vídeo largo

Documentos:

- `docs/adaptation-v2/LONG-FORM-READINESS.md`
- `docs/adaptation-v2/long-form-readiness.v2.json`

La antigua `long-form-video` no se modifica ni se utiliza para María. Hace falta
un caso real y un piloto de 60–90 segundos antes de crear
`maria-long-form-production`.

Prompt:

> Aplica la puerta de preparación de long-form a esta idea. No uses la skill
> heredada ni construyas todavía. Dime qué inputs faltan para un piloto de
> 60–90 segundos.

## 9. Intake de producción

Skill:

`video-production/.claude/skills/maria-video-intake/SKILL.md`

Recoge solo objetivo, audiencia, tipo de vídeo, material, duración/plataforma,
CTA, referencia y nivel de edición. No vuelve a preguntar colores, fuentes,
caption style o identidad.

Prompt:

> Usa $maria-video-intake para convertir esta idea en un brief mínimo. Revisa
> primero los archivos disponibles y no empieces a editar.

## 10. Catálogo curado

Skill:

`video-production/.claude/skills/maria-registry-curation/SKILL.md`

Configuración:

`docs/adaptation-v2/registry-curation.v2.json`

Actualmente no hay ningún componente aprobado. Hay cuatro candidatos de
laboratorio y uno aplazado. Un nombre del catálogo no se convierte en parte de
María hasta existir una versión adaptada, evidencia, QA y aprobación visual.

Prompt:

> Usa $maria-registry-curation para evaluar `<bloque>` en un laboratorio. No lo
> instales en proyectos reales y no lo marques como aprobado sin mi revisión.

## 11. Web o landing a vídeo

Skill:

`video-production/.claude/skills/maria-website-to-video/SKILL.md`

La página aporta hechos, capturas e interfaz. La identidad visual, captions,
movimiento, SFX y CTA siguen siendo los de María.

Prompt:

> Usa $maria-website-to-video con `<URL>`. Quiero un vídeo de `<duración/formato>`
> para `<objetivo>`. Usa la web como fuente factual, conserva mi identidad y
> continúa directamente hasta el draft sin pedirme aprobación del brief o
> storyboard.
