#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const EPSILON = 1e-6;

function readJson(path, errors) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${basename(path)} no es JSON válido: ${error.message}`);
    return null;
  }
}

function captionStart(caption) {
  return Number(caption.startSec ?? caption.start);
}

function captionEnd(caption) {
  return Number(caption.endSec ?? caption.end);
}

function normalizeMode(mode) {
  return String(mode ?? "").replace(/^caption--/, "");
}

function containsLiteral(haystack, needle) {
  return String(haystack)
    .normalize("NFKC")
    .toLocaleUpperCase("es")
    .includes(String(needle).normalize("NFKC").toLocaleUpperCase("es"));
}

export function validateProject(projectDirectory) {
  const root = resolve(projectDirectory);
  const errors = [];
  const manifestPath = resolve(root, "editorial-structure.json");
  const captionsPath = resolve(root, "caption-groups.json");

  if (!existsSync(manifestPath)) {
    return {
      ok: false,
      errors: ["Falta editorial-structure.json."],
      root,
    };
  }

  const manifest = readJson(manifestPath, errors);
  const captions = existsSync(captionsPath)
    ? readJson(captionsPath, errors)
    : null;
  if (!manifest) return { ok: false, errors, root };

  const isTemplate = manifest.status === "template";
  if (manifest.schemaVersion !== 1) {
    errors.push("schemaVersion debe ser 1.");
  }
  if (!isTemplate && manifest.status !== "production") {
    errors.push('status debe ser "production" (o "template" solo en la plantilla).');
  }
  if (isTemplate && basename(root) !== "_maria-template") {
    errors.push('status "template" solo se admite en _maria-template.');
  }

  if (!isTemplate) {
    const hook = manifest.hook ?? {};
    const visual = hook.visual ?? {};
    if (!String(hook.text ?? "").trim()) {
      errors.push("El hook textual es obligatorio.");
    }
    if (hook.spoken !== true && hook.sourceFallbackAuthorized !== true) {
      errors.push(
        "El hook debe ser pronunciado o tener una sustitución gráfica autorizada por falta de fuente.",
      );
    }
    if (!(Number(hook.endSec) > Number(hook.startSec))) {
      errors.push("El intervalo del hook no es válido.");
    }
    if (visual.type !== "sticker" || visual.realSticker !== true) {
      errors.push("El hook visual debe ser un sticker real verificable.");
    }
    if (!String(visual.selector ?? visual.asset ?? "").trim()) {
      errors.push("El sticker del hook necesita selector o asset verificable.");
    }
    if (!String(visual.motion ?? "").trim()) {
      errors.push("El sticker del hook necesita movimiento definido.");
    }
    if (!String(visual.sfx ?? "").trim()) {
      errors.push("El sticker del hook necesita SFX sincronizado.");
    }

    const htmlPath = resolve(root, "index.html");
    if (existsSync(htmlPath) && visual.selector) {
      const html = readFileSync(htmlPath, "utf8");
      const selector = String(visual.selector);
      const token = selector.startsWith("#")
        ? `id="${selector.slice(1)}"`
        : selector.startsWith(".")
          ? selector.slice(1)
          : selector;
      if (!html.includes(token)) {
        errors.push(`No se encuentra el sticker ${selector} en index.html.`);
      }
    }

    for (const requirement of manifest.explicitRequirements ?? []) {
      if (requirement.required !== true) continue;
      if (!String(requirement.evidence ?? "").trim()) {
        errors.push(
          `El requisito explícito "${requirement.name ?? "sin nombre"}" no tiene evidencia.`,
        );
      }
    }
  }

  if (!isTemplate && !Array.isArray(captions)) {
    errors.push("Falta caption-groups.json o no contiene una lista.");
  }

  if (Array.isArray(captions)) {
    for (const caption of captions) {
      const start = captionStart(caption);
      const end = captionEnd(caption);
      if (!(end > start)) {
        errors.push(`Caption ${caption.id ?? "sin id"} tiene tiempos inválidos.`);
      }
      const text = String(caption.text ?? "").trim();
      if (/\S.+\s+\d+[.)]\s/.test(text)) {
        errors.push(
          `Caption ${caption.id ?? "sin id"} mezcla el numeral de un punto nuevo con texto anterior: "${text}".`,
        );
      }
    }

    const byId = new Map(captions.map((caption) => [caption.id, caption]));
    const enumeration = manifest.enumeration ?? [];
    for (const point of enumeration) {
      const numeral = String(point.number ?? "");
      const caption = byId.get(point.captionId);
      if (!caption) {
        errors.push(`El punto ${numeral || "sin número"} no referencia un caption válido.`);
        continue;
      }
      const pattern = new RegExp(`^${numeral.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[.)]\\s`);
      if (!pattern.test(String(caption.text ?? "").trim())) {
        errors.push(`El caption ${caption.id} debe comenzar por "${numeral}.".`);
      }
      if (Math.abs(captionStart(caption) - Number(point.startSec)) > EPSILON) {
        errors.push(`El punto ${numeral} no coincide con el inicio de ${caption.id}.`);
      }
    }

    if (!isTemplate && enumeration.length > 0) {
      const firstPoint = Math.min(...enumeration.map((point) => Number(point.startSec)));
      if (Number(manifest.hook?.endSec) > firstPoint + EPSILON) {
        errors.push("El hook debe terminar antes de comenzar la enumeración.");
      }
    }

    for (const phase of manifest.phases ?? []) {
      const boundary = Number(phase.startSec);
      if (!Number.isFinite(boundary)) {
        errors.push(`La fase "${phase.name ?? "sin nombre"}" no tiene startSec válido.`);
        continue;
      }
      for (const caption of captions) {
        const start = captionStart(caption);
        const end = captionEnd(caption);
        if (start < boundary - EPSILON && end > boundary + EPSILON) {
          errors.push(
            `Caption ${caption.id ?? "sin id"} cruza la frontera de fase ${boundary}s.`,
          );
        }
        if (
          start >= boundary - EPSILON &&
          phase.endSec != null &&
          start < Number(phase.endSec) - EPSILON &&
          phase.captionMode &&
          normalizeMode(caption.mode) !== normalizeMode(phase.captionMode)
        ) {
          errors.push(
            `Caption ${caption.id ?? "sin id"} usa modo ${caption.mode}; la fase exige ${phase.captionMode}.`,
          );
        }
      }
    }

    if (!isTemplate && manifest.hook?.text && manifest.hook.spoken === true) {
      const hookCaptions = captions
        .filter(
          (caption) =>
            captionStart(caption) < Number(manifest.hook.endSec) + EPSILON &&
            captionEnd(caption) > Number(manifest.hook.startSec) - EPSILON,
        )
        .map((caption) => caption.text)
        .join(" ");
      if (!containsLiteral(hookCaptions, manifest.hook.text)) {
        errors.push("El hook marcado como pronunciado no aparece literalmente en los captions.");
      }
    }
  }

  return { ok: errors.length === 0, errors, root };
}

function runCli() {
  const projectDirectory = process.argv[2];
  if (!projectDirectory) {
    console.error("Uso: node scripts/validate-editorial-structure.mjs <project-folder>");
    process.exitCode = 2;
    return;
  }
  const result = validateProject(projectDirectory);
  if (!result.ok) {
    console.error(`FAIL editorial structure: ${result.root}`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS editorial structure: ${result.root}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) runCli();
