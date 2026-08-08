# Uso de las primeras cuatro fases de Video Studio V2

Estas piezas son nuevas y conviven con el flujo antiguo. No reemplazan ni
modifican los agentes, skills o proyectos que ya funcionaban.

## 0. Línea base protegida

Archivo:
`tools/adaptation-v2/verify-protected-baseline.mjs`

Comprobación:

```powershell
node .\tools\adaptation-v2\verify-protected-baseline.mjs verify
```

El resultado correcto indica que los 418 archivos congelados siguen intactos.

## 1. Skill de producción María

Archivo:
`video-production/.claude/skills/maria-reel-production/SKILL.md`

Nombre para invocarla: `$maria-reel-production`

Ejemplo:

> Usa $maria-reel-production para editar este Reel en la variante MARIA-V2.
> Lee primero todas las reglas canónicas, prepara BRIEF y STORYBOARD
> internamente y continúa directamente hasta el draft. El vídeo fuente está en:
> `<ruta>`.

## 2. Agente de QA

Archivo:
`.claude/agents/video-qa-maria.md`

Nombre: `video-qa-maria`

Ejemplo de auditoría sin cambios:

> Usa video-qa-maria en modo audit para revisar este draft: `<ruta al MP4>`.
> Dame evidencia por timestamp y no modifiques nada.

Ejemplo de corrección limitada:

> Usa video-qa-maria en modo fix-objective para corregir únicamente los
> bloqueos objetivos del informe anterior. No cambies decisiones creativas y no
> renderices el final.

## 3. Orquestador V2

Archivo:
`.claude/agents/video-orchestrator-maria-v2.md`

Nombre: `video-orchestrator-maria-v2`

Ejemplo completo:

> Usa video-orchestrator-maria-v2 para crear la variante MARIA-V2 de este Reel.
> Trabaja solo en la copia V2, conserva intacto lo anterior y usa este vídeo:
> `<ruta>`. No me pidas aprobación del BRIEF o STORYBOARD; continúa hasta el
> draft y enséñamelo antes del render final.

Para una comparativa:

> Usa video-orchestrator-maria-v2 para organizar una prueba A/B entre
> CONTROL-ANTIGUO y MARIA-V2 con el mismo vídeo fuente. No modifiques el control.
> Separa los resultados medibles de las preferencias creativas.

## Dónde está cada cosa

Desde la raíz de
`C:\Users\maria\Documents\Codex\workspaces\by-maria-bejarano-adaptacion-v2`:

```text
docs/adaptation-v2/
  BASELINE.md
  protected-baseline.sha256.json
  USO-FASES-0-3.md
tools/adaptation-v2/
  verify-protected-baseline.mjs
.claude/agents/
  video-qa-maria.md
  video-orchestrator-maria-v2.md
video-production/.claude/skills/maria-reel-production/
  SKILL.md
  agents/openai.yaml
  references/layout-decision-matrix.md
  references/delivery-gates.md
```
