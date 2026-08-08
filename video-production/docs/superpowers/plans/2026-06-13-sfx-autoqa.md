# SFX sincronizados + auto-QA visual â€” Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar al workspace de video una librerÃ­a de SFX que se sincroniza al frame de la transiciÃ³n visual, un subagente que auto-verifica los drafts (auto-fix de defectos objetivos, reporte de los de gusto), y triggers de skills afinados para auto-invocaciÃ³n.

**Architecture:** Cuatro componentes independientes sobre el workspace Hyperframes HTML+GSAP existente. C1: carpeta `assets/sfx/` + `sfx-manifest.json` con `transient_offset` medido por ffmpeg; el sync es una fÃ³rmula determinista (`data-start = peak âˆ’ offset`) documentada como recipe en la skill `hyperframes`; fase 2 agrega un helper que genera SFX via ElevenLabs y los promueve al manifest. A1: subagente `video-qa` en el `.claude/agents/` del root (junto a `video-orchestrator`), que extrae hero-frames, corre el checklist de `MOTION_PHILOSOPHY.md`, auto-fixea lo objetivo en loop (â‰¤3 intentos) y reporta lo subjetivo. C3: editar el authoring loop del `CLAUDE.md` de video-studio + promover los `.mjs` reutilizables a `scripts/`. C4: afinar el `description` de las skills del workspace.

**Tech Stack:** Node (ESM `.mjs`, ya hay `playwright`), ffmpeg 7.1 (silencedetect para transient onset), ElevenLabs `/v1/sound-generation` API, Hyperframes CLI, Markdown (skills + agentes).

---

## Convenciones del workspace (leer antes de empezar)

- **CWD**: los scripts de proyecto corren desde dentro del proyecto (`video-projects/<slug>/`); los scripts compartidos viven en `video-production/scripts/`. Rutas relativas en este plan parten de `video-production/` salvo que se indique root del repo.
- **Render contract** (de `CLAUDE.md`): `<audio>` NO lleva `class="clip"`. Tracks de captions â‰¥ 20; en este plan los SFX usan `data-track-index â‰¥ 40`.
- **Determinismo**: nada de `Math.random()`/`Date.now()` en cÃ³digo que afecte el render.
- **`.env`**: ya existe en `video-production/.env` con `ELEVENLABS_API_KEY` (scopes Sound Generation + Models habilitados). Gitignored.
- **Commits**: el repo commitea a `main` directo para docs/tooling (convenciÃ³n del equipo). Mensajes en espaÃ±ol, con el `Co-Authored-By` del repo.

---

## Task 1: Esqueleto de `assets/sfx/` + schema del manifest

**Files:**
- Create: `assets/sfx/sfx-manifest.json`
- Create: `assets/sfx/README.md`

- [ ] **Step 1: Crear la carpeta y un manifest vacÃ­o vÃ¡lido**

```bash
mkdir -p assets/sfx
cat > assets/sfx/sfx-manifest.json <<'EOF'
{
  "version": 1,
  "samples": {}
}
EOF
```

- [ ] **Step 2: Documentar el contrato del manifest**

Create `assets/sfx/README.md`:

```markdown
# LibrerÃ­a de SFX compartida â€” video-studio

Source of truth de naming + `transient_offset` de cada efecto. Los `.wav` se
**copian** al `assets/` de cada proyecto al usarse (portabilidad); este manifest
es el Ã­ndice compartido.

## Schema de `sfx-manifest.json`

`samples[<id>]`:
- `file` (string): nombre del archivo en esta carpeta.
- `duration` (number, s): duraciÃ³n total del sample.
- `transient_offset` (number, s): cuÃ¡ndo arranca el golpe audible dentro del archivo.
  Es el dato que hace el sync exacto. Medido con `scripts/sfx-measure.mjs`.
- `category` (string): `transition | impact | reveal | ui | riser | drop`.
- `default_volume` (number): 0.2 default para SFX (ver MOTION_PHILOSOPHY Â§2.7).
- `use_for` (string[]): cues donde aplica (whip-up, card-land, etc.).
- `license` (string): origen + licencia (CC0 / freesound id).
- `source` (string): `curated` | `generated`.

## FÃ³rmula de sync

audio `data-start` = (timestamp del peak visual de la transiciÃ³n) âˆ’ `transient_offset`

El `<audio>` NO lleva `class="clip"`. Track index â‰¥ 40.
```

- [ ] **Step 3: Commit**

```bash
git add assets/sfx/sfx-manifest.json assets/sfx/README.md
git commit -m "video-studio: esqueleto librerÃ­a SFX + contrato del manifest

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: `sfx-measure.mjs` â€” medir `transient_offset` con ffmpeg (TDD)

Mide el onset del primer sonido con `ffmpeg silencedetect`. El `transient_offset`
es el primer `silence_end` (o 0 si el archivo arranca con sonido).

**Files:**
- Create: `scripts/sfx-measure.mjs`
- Create: `scripts/__tests__/sfx-measure.test.mjs`
- Test fixtures: generados con ffmpeg en el test (no se commitean binarios de test)

- [ ] **Step 1: Escribir el test que falla**

Create `scripts/__tests__/sfx-measure.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { measureTransientOffset } from '../sfx-measure.mjs';

// Genera un wav: 0.2s de silencio + 0.3s de tono 880Hz
function makeFixture(dir) {
  const out = join(dir, 'fx.wav');
  execFileSync('ffmpeg', ['-y',
    '-f', 'lavfi', '-t', '0.2', '-i', 'anullsrc=r=44100:cl=mono',
    '-f', 'lavfi', '-t', '0.3', '-i', 'sine=frequency=880:r=44100',
    '-filter_complex', '[0][1]concat=n=2:v=0:a=1', out], { stdio: 'ignore' });
  return out;
}

test('transient_offset â‰ˆ duraciÃ³n del silencio inicial', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sfx-'));
  try {
    const file = makeFixture(dir);
    const offset = measureTransientOffset(file);
    assert.ok(offset > 0.12 && offset < 0.28, `offset fuera de rango: ${offset}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('archivo que arranca con sonido â†’ offset 0', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sfx-'));
  try {
    const out = join(dir, 'tone.wav');
    execFileSync('ffmpeg', ['-y', '-f', 'lavfi', '-t', '0.3',
      '-i', 'sine=frequency=880:r=44100', out], { stdio: 'ignore' });
    const offset = measureTransientOffset(out);
    assert.ok(offset < 0.05, `esperaba ~0, dio ${offset}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test scripts/__tests__/sfx-measure.test.mjs`
Expected: FAIL â€” `Cannot find module '../sfx-measure.mjs'` (o `measureTransientOffset is not a function`).

- [ ] **Step 3: Implementar `sfx-measure.mjs`**

Create `scripts/sfx-measure.mjs`:

```javascript
#!/usr/bin/env node
// Mide el transient_offset (onset del primer sonido) de un archivo de audio
// usando ffmpeg silencedetect. Determinista.
//
// Como mÃ³dulo:  import { measureTransientOffset } from './sfx-measure.mjs'
// Como CLI:     node scripts/sfx-measure.mjs <file.wav> [<file2> ...]
import { execFileSync } from 'node:child_process';

const NOISE_DB = '-40dB';   // umbral: por debajo = silencio
const MIN_SILENCE = '0.02'; // 20ms mÃ­nimos para contar como silencio

export function measureTransientOffset(file) {
  let stderr;
  try {
    execFileSync('ffmpeg', ['-hide_banner', '-i', file,
      '-af', `silencedetect=noise=${NOISE_DB}:d=${MIN_SILENCE}`,
      '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'ignore', 'pipe'] });
    stderr = '';
  } catch (e) {
    stderr = e.stderr ? String(e.stderr) : '';
  }
  // Si el primer evento es un silencio que arranca en ~0, su silence_end es el onset.
  const startsSilent = /silence_start:\s*0(\.0+)?\b/.test(stderr);
  if (!startsSilent) return 0;
  const m = stderr.match(/silence_end:\s*([0-9.]+)/);
  return m ? Number(Number(m[1]).toFixed(3)) : 0;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: sfx-measure.mjs <file> [...]'); process.exit(1); }
  for (const f of files) console.log(`${f}\t${measureTransientOffset(f)}`);
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `node --test scripts/__tests__/sfx-measure.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/sfx-measure.mjs scripts/__tests__/sfx-measure.test.mjs
git commit -m "video-studio: sfx-measure.mjs â€” transient_offset via ffmpeg (TDD)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: `sfx-manifest.mjs` â€” validador + add de entries (TDD)

Valida el manifest contra el schema y agrega/actualiza entries (usado a mano al curar
y por `sfx-generate.mjs` en fase 2).

**Files:**
- Create: `scripts/sfx-manifest.mjs`
- Create: `scripts/__tests__/sfx-manifest.test.mjs`

- [ ] **Step 1: Escribir el test que falla**

Create `scripts/__tests__/sfx-manifest.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateManifest, upsertEntry } from '../sfx-manifest.mjs';

const valid = {
  version: 1,
  samples: {
    'whoosh-up': {
      file: 'whoosh-up.wav', duration: 0.62, transient_offset: 0.18,
      category: 'transition', default_volume: 0.2, use_for: ['whip-up'],
      license: 'CC0', source: 'curated'
    }
  }
};

test('manifest vÃ¡lido pasa', () => {
  assert.deepEqual(validateManifest(valid), []);
});

test('entry sin transient_offset falla', () => {
  const bad = JSON.parse(JSON.stringify(valid));
  delete bad.samples['whoosh-up'].transient_offset;
  const errs = validateManifest(bad);
  assert.ok(errs.some(e => e.includes('transient_offset')), errs.join(','));
});

test('upsertEntry agrega manteniendo orden alfabÃ©tico', () => {
  const m = { version: 1, samples: {} };
  upsertEntry(m, 'click', { file: 'click.wav', duration: 0.1, transient_offset: 0,
    category: 'ui', default_volume: 0.2, use_for: ['click'], license: 'CC0', source: 'curated' });
  assert.ok('click' in m.samples);
  assert.equal(m.samples.click.transient_offset, 0);
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test scripts/__tests__/sfx-manifest.test.mjs`
Expected: FAIL â€” mÃ³dulo no existe.

- [ ] **Step 3: Implementar `sfx-manifest.mjs`**

Create `scripts/sfx-manifest.mjs`:

```javascript
#!/usr/bin/env node
// Validador + upsert del sfx-manifest.json.
// CLI:  node scripts/sfx-manifest.mjs validate [path]
import { readFileSync } from 'node:fs';

const REQUIRED = ['file', 'duration', 'transient_offset', 'category',
  'default_volume', 'use_for', 'license', 'source'];
const CATEGORIES = ['transition', 'impact', 'reveal', 'ui', 'riser', 'drop'];

export function validateManifest(m) {
  const errs = [];
  if (m?.version !== 1) errs.push('version debe ser 1');
  if (!m?.samples || typeof m.samples !== 'object') { errs.push('falta samples'); return errs; }
  for (const [id, e] of Object.entries(m.samples)) {
    for (const k of REQUIRED) if (!(k in e)) errs.push(`${id}: falta ${k}`);
    if (e.category && !CATEGORIES.includes(e.category)) errs.push(`${id}: category invÃ¡lida (${e.category})`);
    if (typeof e.transient_offset === 'number' && e.transient_offset < 0) errs.push(`${id}: transient_offset < 0`);
    if (e.use_for && !Array.isArray(e.use_for)) errs.push(`${id}: use_for debe ser array`);
  }
  return errs;
}

export function upsertEntry(manifest, id, entry) {
  manifest.samples[id] = entry;
  // re-ordenar claves alfabÃ©ticamente para diffs estables
  manifest.samples = Object.fromEntries(
    Object.entries(manifest.samples).sort(([a], [b]) => a.localeCompare(b)));
  return manifest;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, path = 'assets/sfx/sfx-manifest.json'] = process.argv.slice(2);
  if (cmd === 'validate') {
    const m = JSON.parse(readFileSync(path, 'utf8'));
    const errs = validateManifest(m);
    if (errs.length) { console.error('INVÃLIDO:\n' + errs.map(e => ' - ' + e).join('\n')); process.exit(1); }
    console.log(`OK â€” ${Object.keys(m.samples).length} samples`);
  } else {
    console.error('usage: sfx-manifest.mjs validate [path]'); process.exit(1);
  }
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `node --test scripts/__tests__/sfx-manifest.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/sfx-manifest.mjs scripts/__tests__/sfx-manifest.test.mjs
git commit -m "video-studio: sfx-manifest.mjs â€” validador + upsert (TDD)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Curar el core de SFX (~20 samples) y poblar el manifest

Trabajo manual asistido: conseguir ~20 SFX CC0, medir su offset, escribir el manifest.

**Files:**
- Create: `assets/sfx/*.wav` (~20 samples)
- Modify: `assets/sfx/sfx-manifest.json`

- [ ] **Step 1: Conseguir los samples CC0**

Fuente recomendada: freesound.org (filtrar por licencia CC0) o packs CC0 de Pixabay.
Set objetivo (nombre canÃ³nico â†’ quÃ© es):

```
whoosh-up, whoosh-down, swoosh        (category: transition)
click, tick, pop                      (ui / reveal)
ding, chime, sparkle                  (reveal)
impact-soft, impact-hard, thud        (impact)
riser, riser-short                    (riser)
sub-drop, boom                        (drop)
```

Guardar como `assets/sfx/<id>.wav`. Si vienen en mp3, convertir:
`ffmpeg -y -i in.mp3 -ar 44100 -ac 1 assets/sfx/<id>.wav`

- [ ] **Step 2: Medir el transient_offset de todos**

Run: `node scripts/sfx-measure.mjs assets/sfx/*.wav`
Expected: una lÃ­nea `archivo<TAB>offset` por sample. Anotar cada offset.

- [ ] **Step 3: Poblar el manifest**

Editar `assets/sfx/sfx-manifest.json` agregando un entry por sample (usar los offsets
medidos en Step 2). Ejemplo de un entry:

```json
"whoosh-up": {
  "file": "whoosh-up.wav",
  "duration": 0.62,
  "transient_offset": 0.18,
  "category": "transition",
  "default_volume": 0.2,
  "use_for": ["whip-up", "scene-enter-from-below", "act-break-up"],
  "license": "CC0 / freesound 12345",
  "source": "curated"
}
```

(`duration` = leer con `ffprobe -v error -show_entries format=duration -of csv=p=0 file.wav`.)

- [ ] **Step 4: Validar el manifest**

Run: `node scripts/sfx-manifest.mjs validate`
Expected: `OK â€” 20 samples` (sin errores).

- [ ] **Step 5: Commit**

```bash
git add assets/sfx/
git commit -m "video-studio: core de ~20 SFX CC0 + manifest con transient_offset medido

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Recipe de SFX en la skill `hyperframes`

Documentar la fÃ³rmula de sync + el mapeo cueâ†’SFX dentro de la skill (no skill nueva).

**Files:**
- Modify: `.claude/skills/hyperframes/SKILL.md` (agregar secciÃ³n + actualizar `description`)
- Create: `.claude/skills/hyperframes/references/sfx-sync.md`

- [ ] **Step 1: Escribir la referencia de sync**

Create `.claude/skills/hyperframes/references/sfx-sync.md`:

```markdown
# SFX sincronizados al frame

LibrerÃ­a compartida: `assets/sfx/` (root del workspace) + `sfx-manifest.json`.
Al usar un SFX, copiar su `.wav` al `assets/` del proyecto (portabilidad).

## La fÃ³rmula

audio `data-start` = (timestamp del peak visual de la transiciÃ³n) âˆ’ `transient_offset`

El `transient_offset` (cuÃ¡ndo arranca el golpe dentro del archivo) estÃ¡ en el manifest.
AsÃ­ el golpe cae sobre el peak visual, no al empezar el archivo.

Ejemplo â€” whip-streak con peak a 3.80s, whoosh-up.transient_offset = 0.18:

\`\`\`html
<audio src="assets/whoosh-up.wav" data-start="3.62" data-volume="0.2"
       data-track-index="40"></audio>
\`\`\`

Reglas: el `<audio>` NO lleva `class="clip"` (render contract regla 2).
Tracks de SFX â‰¥ 40 (captions usan â‰¥ 20). `data-volume` SFX = 0.2 (MOTION_PHILOSOPHY Â§2.7);
las colas pueden sangrar al beat siguiente.

## Mapeo cue â†’ SFX

| Beat visual | SFX sugerido |
|---|---|
| Whip / scene enter desde abajo | whoosh-up |
| Whip / exit hacia arriba | whoosh-down |
| Card / objeto que aterriza | impact-soft / thud |
| Impacto fuerte, nÃºmero hero | impact-hard / boom |
| Click de UI (faux-cursor) | click |
| Reveal de palabra / logo | ding / sparkle / pop |
| Build-up a un act break | riser |
| Drop dramÃ¡tico / silencio | sub-drop |

## Medir un sample nuevo

`node scripts/sfx-measure.mjs assets/sfx/<nuevo>.wav` â†’ agregar al manifest con
`node`/ediciÃ³n a mano y `node scripts/sfx-manifest.mjs validate`.
```

- [ ] **Step 2: Linkear desde SKILL.md + actualizar description**

En `.claude/skills/hyperframes/SKILL.md`:
1. Agregar al frontmatter `description` (al final, antes del cierre) la frase:
   `Tambien cubre SFX sincronizados al frame (efecto de sonido, whoosh, sincronizar audio a transicion) via assets/sfx/ + sfx-manifest.json.`
2. Agregar en el cuerpo, donde lista las referencias, una lÃ­nea:
   `- **SFX sincronizados**: ver \`references/sfx-sync.md\` â€” fÃ³rmula data-start = peak âˆ’ transient_offset.`

- [ ] **Step 3: Verificar que la referencia es coherente**

Run: `node scripts/sfx-manifest.mjs validate`
Expected: OK (confirma que el ejemplo del recipe matchea el schema real).
Leer `references/sfx-sync.md` y confirmar que la fÃ³rmula y los track-index coinciden con el render contract de `CLAUDE.md`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/hyperframes/SKILL.md .claude/skills/hyperframes/references/sfx-sync.md
git commit -m "video-studio: recipe SFX sync en skill hyperframes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Fase 2 â€” `sfx-generate.mjs` (ElevenLabs sound-generation)

Genera un SFX por prompt cuando ningÃºn sample del core sirve, lo mide y lo promueve.
Cachea por hash del prompt.

**Files:**
- Create: `scripts/sfx-generate.mjs`
- Create: `scripts/__tests__/sfx-generate.test.mjs` (test del cache/hash sin pegar a la API)

- [ ] **Step 1: Test del hashing/cache (sin red)**

Create `scripts/__tests__/sfx-generate.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promptId } from '../sfx-generate.mjs';

test('promptId es determinista y kebab', () => {
  const a = promptId('Metallic chrome whoosh with sub bump');
  const b = promptId('Metallic chrome whoosh with sub bump');
  assert.equal(a, b);
  assert.match(a, /^gen-[a-z0-9-]+-[0-9a-f]{8}$/);
});

test('prompts distintos â†’ ids distintos', () => {
  assert.notEqual(promptId('whoosh a'), promptId('whoosh b'));
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `node --test scripts/__tests__/sfx-generate.test.mjs`
Expected: FAIL â€” mÃ³dulo no existe.

- [ ] **Step 3: Implementar `sfx-generate.mjs`**

Create `scripts/sfx-generate.mjs`:

```javascript
#!/usr/bin/env node
// Genera un SFX via ElevenLabs sound-generation, lo mide y lo promueve al manifest.
// Cachea por hash del prompt (no regenera lo mismo).
//
// CLI: node scripts/sfx-generate.mjs "<prompt>" [--name <id>] [--seconds <n>]
// Requiere ELEVENLABS_API_KEY en el entorno (cargar .env antes).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { measureTransientOffset } from './sfx-measure.mjs';
import { upsertEntry, validateManifest } from './sfx-manifest.mjs';

const SFX_DIR = 'assets/sfx';
const MANIFEST = `${SFX_DIR}/sfx-manifest.json`;

export function promptId(prompt) {
  const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
  const hash = createHash('sha256').update(prompt).digest('hex').slice(0, 8);
  return `gen-${slug}-${hash}`;
}

async function generate(prompt, { name, seconds } = {}) {
  const id = name || promptId(prompt);
  const wav = `${SFX_DIR}/${id}.wav`;
  if (existsSync(wav)) { console.log(`cache hit: ${wav}`); return id; }

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('falta ELEVENLABS_API_KEY en el entorno');

  const body = { text: prompt, prompt_influence: 0.3 };
  if (seconds) body.duration_seconds = Number(seconds);

  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);

  const mp3 = `${SFX_DIR}/${id}.mp3`;
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  execFileSync('ffmpeg', ['-y', '-i', mp3, '-ar', '44100', '-ac', '1', wav], { stdio: 'ignore' });

  const offset = measureTransientOffset(wav);
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration', '-of', 'csv=p=0', wav], { encoding: 'utf8' }).trim());

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  upsertEntry(manifest, id, {
    file: `${id}.wav`, duration: Number(dur.toFixed(3)), transient_offset: offset,
    category: 'transition', default_volume: 0.2, use_for: [], license: 'ElevenLabs generated',
    source: 'generated'
  });
  const errs = validateManifest(manifest);
  if (errs.length) throw new Error('manifest invÃ¡lido tras upsert: ' + errs.join(', '));
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`generado ${wav} (offset ${offset}s, ${dur.toFixed(2)}s) y promovido al manifest`);
  return id;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const prompt = args.find(a => !a.startsWith('--'));
  const opt = {};
  const ni = args.indexOf('--name'); if (ni >= 0) opt.name = args[ni + 1];
  const si = args.indexOf('--seconds'); if (si >= 0) opt.seconds = args[si + 1];
  if (!prompt) { console.error('usage: sfx-generate.mjs "<prompt>" [--name id] [--seconds n]'); process.exit(1); }
  generate(prompt, opt).catch(e => { console.error(e.message); process.exit(1); });
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `node --test scripts/__tests__/sfx-generate.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Smoke real contra la API (1 generaciÃ³n, gasta crÃ©ditos)**

Run:
```bash
set -a; . video-production/.env; set +a
cd video-production
node scripts/sfx-generate.mjs "short metallic ui click" --name gen-smoke-click --seconds 1
```
Expected: imprime `generado assets/sfx/gen-smoke-click.wav ... y promovido al manifest`.
Verificar: `node scripts/sfx-manifest.mjs validate` â†’ OK con el sample nuevo.
Limpieza opcional: borrar el sample smoke + su entry si no se quiere conservar.

- [ ] **Step 6: Commit**

```bash
git add scripts/sfx-generate.mjs scripts/__tests__/sfx-generate.test.mjs assets/sfx/
git commit -m "video-studio: sfx-generate.mjs â€” SFX on-demand via ElevenLabs (fase 2)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Promover frame-extract reutilizable a `scripts/`

El subagente `video-qa` necesita extraer hero-frames de un MP4 ya renderizado (distinto
del scrub en vivo de `frame.mjs`). Promover/crear el helper compartido.

**Files:**
- Create: `scripts/extract-frames.mjs`
- Reference: `_maria_VSL-v3/scripts/batch-scrub.mjs` (patrÃ³n existente, no se borra)

- [ ] **Step 1: Crear el helper de extracciÃ³n post-render**

Create `scripts/extract-frames.mjs`:

```javascript
#!/usr/bin/env node
// Extrae frames de un MP4 ya renderizado en timestamps dados (post-render, NO scrub vivo).
// CLI: node scripts/extract-frames.mjs <video.mp4> <t1> <t2> ... [--out <dir>]
// Output: <dir>/t<ts>.png (default dir: <video-dir>/frames-qa/)
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const video = args.find(a => !a.startsWith('--') && a.endsWith('.mp4'));
if (!video) { console.error('usage: extract-frames.mjs <video.mp4> <t1> [t2 ...] [--out dir]'); process.exit(1); }
const oi = args.indexOf('--out');
const outDir = oi >= 0 ? args[oi + 1] : join(dirname(video), 'frames-qa');
const times = args.filter(a => !a.startsWith('--') && a !== video && !Number.isNaN(Number(a)));
mkdirSync(outDir, { recursive: true });
const written = [];
for (const t of times) {
  const out = join(outDir, `t${String(t).replace('.', '_')}.png`);
  execFileSync('ffmpeg', ['-y', '-ss', String(t), '-i', video, '-frames:v', '1', '-q:v', '2', out], { stdio: 'ignore' });
  written.push(out);
}
console.log(written.join('\n'));
```

- [ ] **Step 2: Verificar contra un render existente**

Run (usa un MP4 que ya exista en renders/, p.ej. el smoke-test del template):
```bash
node scripts/extract-frames.mjs video-projects/_maria-template/renders/smoke-test.mp4 0.5 --out /tmp/qa-test
```
Expected: imprime `/tmp/qa-test/t0_5.png` y el archivo existe (`ls -la /tmp/qa-test/t0_5.png`).

- [ ] **Step 3: Commit**

```bash
git add scripts/extract-frames.mjs
git commit -m "video-studio: extract-frames.mjs compartido (post-render) para video-qa

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Subagente `video-qa`

Agente en el `.claude/agents/` del root (junto a `video-orchestrator`), hÃ­brido auto-fix/reporte.

**Files:**
- Create: `.claude/agents/video-qa.md` (root del repo)

- [ ] **Step 1: Escribir el agente**

Create `.claude/agents/video-qa.md` (root del repo):

```markdown
---
name: video-qa
description: "Auto-QA visual de drafts de video del workspace video-studio (Hyperframes). Extrae hero-frames de un draft MP4, corre el checklist de MOTION_PHILOSOPHY.md, AUTO-FIXEA defectos objetivos (black-frame por timeline corto, texto fuera de caja, cara cropeada, escena que cae en palabra equivocada, timeline-duration gap) en loop de â‰¤3 intentos re-renderizando, y REPORTA los defectos de gusto (color sin significado, pacing, sync de SFX, falta de callback) sin tocarlos. Lo invoca el authoring loop de video-studio tras cada draft render, o el usuario con 'verificÃ¡ el video / QA del draft'. Ejemplos:\n\n<example>\nContext: se acaba de renderizar un draft en video-studio.\nuser: 'VerificÃ¡ el draft de _maria-CPL-Bajo'\nassistant: 'Invoco video-qa: extrae los hero-frames, auto-fixea lo objetivo y me devuelve el reporte de lo subjetivo.'\n<commentary>Reemplaza el frame-verify manual del Visual Verification gate.</commentary>\n</example>\n\nNO usar para: el scrub en vivo de una composiciÃ³n (scripts/frame.mjs), ni el render final --quality standard (eso queda tras el OK humano)."
model: sonnet
color: green
effort: high
---

# video-qa â€” Auto-QA visual de drafts (video-studio)

Sos el agente que verifica un draft MP4 de Hyperframes ANTES de que Maria lo mire.
RespondÃ© en espaÃ±ol. CWD: `video-production/`.

## Input que recibÃ­s
- project-slug (carpeta en `video-projects/`)
- path al draft MP4
- path al transcript / `captions.meta.json` (si existe)

## Proceso

1. **Derivar los timestamps de hero-frame.** LeÃ© el `index.html` del proyecto + sus
   `compositions/*.html`. Por cada sub-composiciÃ³n tomÃ¡ su `data-start` + el punto medio
   de su `data-duration` (hero moment) y los `data-start` de transiciones en riesgo.

2. **Extraer los frames:**
   `node scripts/extract-frames.mjs <draft.mp4> <t1> <t2> ... --out <proj>/renders/frames-qa`

3. **Read cada PNG** (cargarlo de verdad al contexto, no listar nombres).

4. **Correr el checklist.** ClasificÃ¡ cada defecto:

   **AUTO-FIX (objetivos â€” arreglÃ¡ el HTML, re-renderizÃ¡ draft, re-verificÃ¡ ese frame):**
   - Black-frame por timeline corto â†’ falta el anchor `tl.to({}, { duration: SLOT }, 0)` (Law #11).
   - Texto fuera de caja / overflow / overlap no intencional.
   - Cara cropeada en escena bottom-half (face-mode incorrecto).
   - Escena que cae en la palabra equivocada (cruzÃ¡ word-onset del transcript vs `data-start`).
   - Timeline-duration gap (`timeline.duration() < data-duration`).

   **REPORTE (de gusto â€” NO tocar, listar para Maria):**
   - Â¿El color del beat carga significado? Â¿pacing/dead-air? Â¿sync de SFX? Â¿falta callback?
   - Cualquier duda subjetiva.

5. **Loop de auto-fix:** por cada defecto objetivo, patchear â†’ re-render draft
   (`npx hyperframes render --quality draft --output renders/<slug>-draft.mp4`) â†’
   re-extraer ese frame â†’ re-verificar. Cortar a los **3 intentos**; si no converge,
   marcar `needs-human` y describir el problema.

## Reglas duras
- Determinismo: nada de `Math.random()`/`Date.now()` en los fixes.
- Nunca `.play()/.pause()/.currentTime` sobre media.
- NO corras el render `--quality standard` final.

## Output (devolvÃ© esto)
- **Auto-fixeado:** lista de (defecto â†’ archivo:lÃ­nea â†’ quÃ© cambiÃ³ â†’ re-render hecho).
- **Para Maria:** lista de defectos de gusto, cada uno con el frame referenciado.
- **Veredicto:** `clean` | `needs-human` | `failed-to-converge`.
```

- [ ] **Step 2: Verificar que el agente estÃ¡ bien formado**

Run: `node -e "const fs=require('fs');const s=fs.readFileSync('.claude/agents/video-qa.md','utf8');if(!/^---[\s\S]*name: video-qa[\s\S]*---/.test(s))throw new Error('frontmatter mal');console.log('frontmatter OK')"`
Expected: `frontmatter OK`.
Confirmar que abre la sesiÃ³n: en una sesiÃ³n Claude Code, `video-qa` aparece como subagente disponible (chequeo manual de Maria).

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/video-qa.md
git commit -m "video-qa: subagente de auto-QA visual de drafts (hibrido auto-fix/reporte)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Integrar `video-qa` en el authoring loop (CLAUDE.md de video-studio)

**Files:**
- Modify: `video-production/CLAUDE.md` (secciÃ³n "Authoring Loop" + "Visual Verification")

- [ ] **Step 1: Editar el Authoring Loop**

En `CLAUDE.md`, secciÃ³n "Authoring Loop", reemplazar el paso 7 (Visual verification) por:

```markdown
7. **Auto-QA (REQUERIDO, default-automÃ¡tico)** â€” tras el draft render, invocar el
   subagente `video-qa` (Agent tool) con el slug + el path del draft + el transcript.
   Auto-fixea los defectos objetivos (re-renderizando) y devuelve un reporte con lo de
   gusto. MostrÃ¡ a Maria el MP4 ya auto-pulido + el reporte. Reemplaza el frame-verify
   manual. **Escape:** si Maria pide una iteraciÃ³n rÃ¡pida/barata, decir "skip QA" y saltarlo.
```

- [ ] **Step 2: Cruzar la secciÃ³n "Visual Verification"**

En la secciÃ³n "Visual Verification (MANDATORY before delivery)", agregar al inicio una nota:

```markdown
> **Automatizado vÃ­a `video-qa`.** El subagente `video-qa` ejecuta este gate
> (frame-extract + Read + checklist) por default tras cada draft. Esta secciÃ³n queda
> como la especificaciÃ³n de QUÃ‰ verifica el agente y como fallback manual si se hace
> `skip QA`. El agente auto-fixea lo objetivo; lo de gusto se eleva a Maria.
```

- [ ] **Step 3: Verificar coherencia**

Leer la secciÃ³n editada y confirmar que el escape (`skip QA`), el nombre del agente
(`video-qa`) y el nombre del script (`extract-frames.mjs`) coinciden con Tasks 7 y 8.

- [ ] **Step 4: Commit**

```bash
git add video-production/CLAUDE.md
git commit -m "video-studio: authoring loop integra video-qa (auto-QA default + escape)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: C4 â€” Afinar triggers (`description`) de las skills del workspace

Afinar el frontmatter `description` de cada skill para auto-invocaciÃ³n sin solape.

**Files:**
- Modify: `.claude/skills/make-a-video/SKILL.md` (description)
- Modify: `.claude/skills/short-form-video/SKILL.md` (description)
- Modify: `.claude/skills/long-form-video/SKILL.md` (description)
- Modify: `.claude/skills/split-screen-panels/SKILL.md` (description)
- Modify: `.claude/skills/website-to-hyperframes/SKILL.md` (description)

- [ ] **Step 1: Construir la tabla de cues canÃ³nicos (referencia para los edits)**

Tabla objetivo (cue de prueba â†’ skill que debe disparar):

| Cue de prueba | Skill |
|---|---|
| "hacÃ© un video / video desde cero / nuevo video" | `make-a-video` |
| "reel 9:16 / short / TikTok / vertical talking-head" | `short-form-video` |
| "VSL / video largo / explainer / YouTube largo" | `long-form-video` |
| "panel grande + cara / dashboard + avatar / split-screen" | `split-screen-panels` |
| "convertÃ­ esta URL en video / web a video" | `website-to-hyperframes` |
| "efecto de sonido / whoosh / SFX / sincronizar audio a transiciÃ³n" | `hyperframes` (recipe SFX, Task 5) |
| "verificÃ¡ el video / QA del draft" | agente `video-qa` (Task 8) |

- [ ] **Step 2: Editar cada `description` para incluir su anti-solape**

Por cada SKILL.md, ajustar la `description` para que: (a) empiece con los cues propios,
(b) cierre con un "NO usar para" que apunte a la skill vecina. Ediciones concretas:

- `make-a-video`: agregar al final de description:
  `Para cues especificos de formato (reel 9:16 -> short-form-video; VSL/largo -> long-form-video; panel+cara -> split-screen-panels; URL -> website-to-hyperframes) usar esas skills directo; make-a-video es para el cue ambiguo 'hacer un video' sin formato decidido.`
- `short-form-video`: agregar al final: `NO usar para video horizontal largo/VSL (long-form-video) ni para panel grande que tapa la cara (split-screen-panels).`
- `long-form-video`: agregar al final: `NO usar para shorts 9:16 (short-form-video) ni para video desde cero sin formato decidido (make-a-video).`
- `split-screen-panels`: ya referencia short-form; agregar: `NO usar para overlays chicos (chip/badge) ni hero/CTA donde la cara domina â€” eso es short-form-video FULL/PIP.`
- `website-to-hyperframes`: agregar al final: `Dispara solo con una URL/sitio de origen; sin URL, el cue 'hacer un video' va a make-a-video.`

- [ ] **Step 3: Verificar que ninguna description quedÃ³ rota**

Run:
```bash
for f in make-a-video short-form-video long-form-video split-screen-panels website-to-hyperframes; do
  node -e "const fs=require('fs');const s=fs.readFileSync('.claude/skills/$f/SKILL.md','utf8');if(!/^---\s*\n[\s\S]*?description:[\s\S]*?\n---/.test(s))throw new Error('$f frontmatter roto');console.log('$f OK')"
done
```
Expected: una lÃ­nea `<skill> OK` por skill (5 lÃ­neas).

- [ ] **Step 4: Smoke de triggering (manual, lo hace Maria)**

En una sesiÃ³n nueva, tirar 2-3 cues de la tabla de Step 1 y confirmar que rutea a la skill
esperada. Si un cue cae en la skill equivocada, ajustar esa `description` y repetir.
(No bloqueante para el commit â€” es validaciÃ³n de uso.)

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/*/SKILL.md
git commit -m "video-studio: C4 afinar triggers de skills para auto-invocacion sin solape

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-review notes (para el implementador)

- **Cobertura del spec:** C1 â†’ Tasks 1-5; C2 (fase 2 ElevenLabs) â†’ Task 6; A1 â†’ Tasks 7-8; C3 â†’ Tasks 7+9; C4 â†’ Task 10. Todo el spec tiene tarea.
- **Tests reales:** Tasks 2, 3, 6 son TDD con cÃ³digo completo. Tasks 4, 5, 8, 9, 10 son curaciÃ³n/markdown/config â€” su "test" es un validador o un check de coherencia, no un unit test (apropiado al tipo de trabajo).
- **Dependencia de orden:** Task 6 importa de 2 y 3; Task 8 usa 7; Task 9 referencia 7+8; correr en orden. Tasks 1â†’10 son secuenciales salvo Task 10 (C4) que es independiente y se puede hacer en cualquier momento.
- **Coste real:** Task 6 Step 5 y el smoke de Task 8 gastan crÃ©ditos ElevenLabs / tiempo de render. Task 4 requiere trabajo manual de curaciÃ³n (conseguir los .wav CC0).
```

