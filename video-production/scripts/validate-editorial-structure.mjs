#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const EPSILON = 1e-6;
const root = resolve(process.argv[2] ?? "");
const errors = [];

function load(name, required = true) {
  const path = resolve(root, name);
  if (!existsSync(path)) {
    if (required) errors.push(`Falta ${name}.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${name} no es JSON válido: ${error.message}`);
    return null;
  }
}

function start(caption) {
  return Number(caption.startSec ?? caption.start);
}

function end(caption) {
  return Number(caption.endSec ?? caption.end);
}

function mode(value) {
  return String(value ?? "").replace(/^caption--/, "");
}

if (!process.argv[2]) {
  console.error("Uso: node scripts/validate-editorial-structure.mjs <project-folder>");
  process.exit(2);
}

const manifest = load("editorial-structure.json");
const isTemplate = manifest?.status === "template";
const captions = load("caption-groups.json", !isTemplate);

if (manifest) {
  if (manifest.schemaVersion !== 1) errors.push("schemaVersion debe ser 1.");
  if (isTemplate && basename(root) !== "_maria-template") {
    errors.push('status "template" solo se admite en _maria-template.');
  }
  if (!isTemplate && manifest.status !== "production") {
    errors.push('status debe ser "production".');
  }

  if (!isTemplate) {
    const hook = manifest.hook ?? {};
    const visual = hook.visual ?? {};
    if (
      !String(hook.text ?? "").trim() ||
      (hook.spoken !== true && hook.sourceFallbackAuthorized !== true)
    ) {
      errors.push("Falta el hook textual pronunciado o su sustitución gráfica autorizada.");
    }
    if (!(Number(hook.endSec) > Number(hook.startSec))) {
      errors.push("El intervalo del hook no es válido.");
    }
    if (visual.type !== "sticker" || visual.realSticker !== true) {
      errors.push("El hook visual debe ser un sticker real verificable.");
    }
    if (!String(visual.selector ?? visual.asset ?? "").trim()) {
      errors.push("El sticker necesita selector o asset.");
    }
    if (!String(visual.motion ?? "").trim() || !String(visual.sfx ?? "").trim()) {
      errors.push("El sticker necesita movimiento y SFX.");
    }
    for (const requirement of manifest.explicitRequirements ?? []) {
      if (requirement.required === true && !String(requirement.evidence ?? "").trim()) {
        errors.push(`El requisito "${requirement.name ?? "sin nombre"}" no tiene evidencia.`);
      }
    }
  }
}

if (Array.isArray(captions) && manifest) {
  const byId = new Map(captions.map((caption) => [caption.id, caption]));
  for (const caption of captions) {
    const text = String(caption.text ?? "").trim();
    if (/\S.+\s+\d+[.)]\s/.test(text)) {
      errors.push(`Caption ${caption.id ?? "sin id"} mezcla texto anterior y numeral.`);
    }
  }
  for (const point of manifest.enumeration ?? []) {
    const caption = byId.get(point.captionId);
    const numeral = String(point.number ?? "");
    if (!caption) {
      errors.push(`El punto ${numeral} no referencia un caption válido.`);
      continue;
    }
    if (!String(caption.text ?? "").trim().startsWith(`${numeral}. `)) {
      errors.push(`El caption ${caption.id} debe comenzar por "${numeral}.".`);
    }
    if (Math.abs(start(caption) - Number(point.startSec)) > EPSILON) {
      errors.push(`El punto ${numeral} no coincide con ${caption.id}.`);
    }
  }
  for (const phase of manifest.phases ?? []) {
    const boundary = Number(phase.startSec);
    for (const caption of captions) {
      if (start(caption) < boundary - EPSILON && end(caption) > boundary + EPSILON) {
        errors.push(`Caption ${caption.id ?? "sin id"} cruza la frontera ${boundary}s.`);
      }
      if (
        start(caption) >= boundary - EPSILON &&
        phase.endSec != null &&
        start(caption) < Number(phase.endSec) - EPSILON &&
        phase.captionMode &&
        mode(caption.mode) !== mode(phase.captionMode)
      ) {
        errors.push(`Caption ${caption.id ?? "sin id"} usa un contraste incorrecto.`);
      }
    }
  }
  if (!isTemplate && manifest.hook?.text && manifest.hook.spoken === true) {
    const spoken = captions
      .filter(
        (caption) =>
          start(caption) < Number(manifest.hook.endSec) + EPSILON &&
          end(caption) > Number(manifest.hook.startSec) - EPSILON,
      )
      .map((caption) => caption.text)
      .join(" ")
      .normalize("NFKC")
      .toLocaleUpperCase("es");
    const hook = String(manifest.hook.text)
      .normalize("NFKC")
      .toLocaleUpperCase("es");
    if (!spoken.includes(hook)) {
      errors.push("El hook pronunciado no aparece literalmente en los captions.");
    }
  }
}

if (errors.length > 0) {
  console.error(`FAIL editorial structure: ${root}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS editorial structure: ${root}`);
