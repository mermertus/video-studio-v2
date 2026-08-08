import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");
const scriptsDirectory = resolve(repositoryRoot, "video-production", "scripts");
const outputDirectory = resolve(repositoryRoot, "docs", "adaptation-v2");

const active = new Map([
  [
    "apply-maria-follow-card.mjs",
    "Inserta o actualiza el cierre oficial de seguimiento antes del preflight.",
  ],
  [
    "extract-frames.mjs",
    "Extrae evidencia visual de un MP4 para QA posterior al render.",
  ],
  [
    "generate-captions.mjs",
    "Genera la capa de captions a partir de la transcripción del proyecto.",
  ],
  [
    "music-bed.mjs",
    "Construye la cama musical definida por el plan local del proyecto.",
  ],
  ["preflight.mjs", "Comprueba el proyecto antes de preview/render."],
  [
    "sfx-manifest.mjs",
    "Valida y mantiene el manifiesto compartido de efectos.",
  ],
  [
    "sfx-measure.mjs",
    "Mide el transient offset necesario para sincronizar efectos nuevos.",
  ],
  [
    "stage-render.mjs",
    "Apoya el render por etapas del flujo HyperFrames actual.",
  ],
]);

const available = new Map([
  ["frame.mjs", "Diagnóstico puntual de un frame durante authoring."],
  ["quick-frame.mjs", "Captura rápida opcional para diagnóstico."],
  ["scrub-crop.mjs", "Inspección opcional de crop/reencuadre."],
  [
    "scrub-standalone.mjs",
    "Inspección opcional de una composición independiente.",
  ],
  ["scrub-wrapper.mjs", "Inspección opcional mediante wrapper de preview."],
  ["verify-wrapper.mjs", "Verificación auxiliar del wrapper de composición."],
]);

const experimental = new Map([
  ["_debug-knobs.mjs", "Herramienta de depuración; no forma parte del flujo."],
  [
    "debug-s1-paraTi.mjs",
    "Depuración ligada a una escena/caso concreto; no reutilizable por defecto.",
  ],
  [
    "sfx-generate.mjs",
    "Generación externa de SFX; requiere credenciales y aprobación separada.",
  ],
]);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function classify(name, relativeScriptPath) {
  if (relativeScriptPath.startsWith("maria-v2/")) {
    return {
      status: "Activo V2",
      rationale:
        "Herramienta aditiva y opt-in de patrones, validación, capacidades o promoción eficiente de María V2.",
    };
  }
  if (relativeScriptPath.startsWith("__tests__/")) {
    return {
      status: "Prueba",
      rationale:
        "Test automatizado de un script existente; se ejecuta para regresión y no durante una edición normal.",
    };
  }
  if (active.has(name)) {
    return { status: "Activo", rationale: active.get(name) };
  }
  if (available.has(name)) {
    return { status: "Disponible", rationale: available.get(name) };
  }
  if (experimental.has(name)) {
    return { status: "Experimental", rationale: experimental.get(name) };
  }
  if (/^(heygen-|hg-)/.test(name)) {
    return {
      status: "Legacy HeyGen",
      rationale:
        "Automatización heredada de HeyGen; se conserva, pero queda fuera del flujo normal de María.",
    };
  }
  return {
    status: "Desconocido",
    rationale: "Necesita investigación antes de incorporarlo o archivarlo.",
  };
}

function collectMjs(directory, output = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      collectMjs(path, output);
    } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
      output.push(path);
    }
  }
  return output;
}

function buildInventory() {
  const entries = collectMjs(scriptsDirectory)
    .sort((left, right) => left.localeCompare(right))
    .map((path) => {
      const scriptPath = relative(scriptsDirectory, path).replaceAll("\\", "/");
      const name = scriptPath.split("/").at(-1);
      const classification = classify(name, scriptPath);
      return {
        name: scriptPath,
        path: relative(repositoryRoot, path).replaceAll("\\", "/"),
        status: classification.status,
        rationale: classification.rationale,
        bytes: statSync(path).size,
        sha256: sha256(path),
      };
    });

  const counts = Object.fromEntries(
    [
      "Activo",
      "Activo V2",
      "Prueba",
      "Disponible",
      "Experimental",
      "Legacy HeyGen",
      "Desconocido",
    ].map((status) => [
      status,
      entries.filter((entry) => entry.status === status).length,
    ]),
  );

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    policy:
      "Inventory only: no script is moved, renamed, deleted, or edited by this phase.",
    normalFlow: [
      "Follow card",
      "Preflight",
      "Captions",
      "Frame capture/extraction",
      "SFX manifest and timing",
      "Music bed",
      "Staged render",
      "QA",
    ],
    counts: { Total: entries.length, ...counts },
    entries,
  };
}

function renderMarkdown(inventory) {
  const lines = [
    "# Inventario de scripts — Video Studio María V2",
    "",
    `Generado: ${inventory.generatedAt}`,
    "",
    "Esta fase no mueve, renombra, modifica ni elimina scripts.",
    "",
    "## Resumen",
    "",
    "| Estado | Cantidad | Uso |",
    "| --- | ---: | --- |",
    `| Activo | ${inventory.counts.Activo} | Flujo habitual o mantenimiento directo del sistema |`,
    `| Activo V2 | ${inventory.counts["Activo V2"]} | Flujo opt-in, patrones y eficiencia de María V2 |`,
    `| Prueba | ${inventory.counts.Prueba} | Regresión automatizada; fuera de una edición normal |`,
    `| Disponible | ${inventory.counts.Disponible} | Herramienta válida bajo demanda |`,
    `| Experimental | ${inventory.counts.Experimental} | Prueba, debug o dependencia externa |`,
    `| Legacy HeyGen | ${inventory.counts["Legacy HeyGen"]} | Conservado, fuera del flujo normal de María |`,
    `| Desconocido | ${inventory.counts.Desconocido} | Requiere investigación |`,
    `| **Total** | **${inventory.counts.Total}** | |`,
    "",
    "## Flujo normal simplificado",
    "",
    ...inventory.normalFlow.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Clasificación completa",
    "",
    "| Script | Estado | Motivo |",
    "| --- | --- | --- |",
    ...inventory.entries.map(
      (entry) =>
        `| \`${entry.name}\` | ${entry.status} | ${entry.rationale} |`,
    ),
    "",
    "El hash de cada archivo se conserva en `script-inventory.json` para poder",
    "demostrar que inventariar no ha modificado su contenido.",
    "",
  ];
  return lines.join("\n");
}

const inventory = buildInventory();
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
  resolve(outputDirectory, "script-inventory.json"),
  `${JSON.stringify(inventory, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "SCRIPT-INVENTORY.md"),
  renderMarkdown(inventory),
  "utf8",
);

console.log(JSON.stringify(inventory.counts));
if (inventory.counts.Desconocido > 0) {
  console.error("Inventory contains unknown scripts; investigate before use.");
  process.exitCode = 1;
}
