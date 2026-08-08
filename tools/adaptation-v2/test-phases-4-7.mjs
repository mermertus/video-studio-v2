import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");

function read(path) {
  return readFileSync(path, "utf8");
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const supportSkillPath = resolve(
  repositoryRoot,
  "video-production/.claude/skills/maria-support-layouts/SKILL.md",
);
const reformatSkillPath = resolve(
  repositoryRoot,
  "video-production/.claude/skills/maria-ad-reformat-v2/SKILL.md",
);
const inventoryPath = resolve(
  repositoryRoot,
  "docs/adaptation-v2/script-inventory.json",
);
const sfxDirectory = resolve(
  repositoryRoot,
  "video-production/assets/sfx",
);
const palettePath = resolve(sfxDirectory, "maria-palette.v2.json");
const manifestPath = resolve(sfxDirectory, "sfx-manifest.json");

test("protected baseline remains unchanged after phases 4-7", () => {
  const result = spawnSync(
    process.execPath,
    [resolve(toolDirectory, "verify-protected-baseline.mjs"), "verify"],
    { cwd: repositoryRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("support-layout skill includes all María formats and safety rules", () => {
  const skill = read(supportSkillPath);
  for (const term of [
    "Support above",
    "Support below",
    "Full-screen support",
    "`pip-llamada`",
    "Direct graphic",
    "Compact panel",
    "maria-palette.v2.json",
  ]) {
    assert.ok(skill.includes(term), `Missing support contract: ${term}`);
  }
});

test("script inventory covers every MJS without changing its hash", () => {
  const inventory = JSON.parse(read(inventoryPath));
  function collectMjs(directory, output = []) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) collectMjs(path, output);
      else if (entry.isFile() && entry.name.endsWith(".mjs")) output.push(path);
    }
    return output;
  }
  const actualScripts = collectMjs(
    resolve(repositoryRoot, "video-production/scripts"),
  ).sort();

  assert.equal(inventory.counts.Total, actualScripts.length);
  assert.ok(inventory.counts["Activo V2"] >= 4);
  assert.equal(inventory.counts["Legacy HeyGen"], 52);
  assert.equal(inventory.counts.Desconocido, 0);

  for (const entry of inventory.entries) {
    assert.equal(
      entry.sha256,
      sha256(resolve(repositoryRoot, entry.path)),
      `Script changed after inventory: ${entry.name}`,
    );
  }
});

test("María sound palette uses real samples and preserves the full library", () => {
  const palette = JSON.parse(read(palettePath));
  const manifest = JSON.parse(read(manifestPath));
  assert.equal(palette.assignments.length, 9);
  assert.equal(palette.policy.preserveAllExistingSamples, true);
  assert.equal(palette.policy.humanListeningRequired, true);
  assert.equal(Object.keys(manifest.samples).length, 25);

  const result = spawnSync(
    process.execPath,
    [resolve(toolDirectory, "validate-maria-sfx-palette.mjs")],
    { cwd: repositoryRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("reformat skill is copy-only and gates every ratio", () => {
  const skill = read(reformatSkillPath);
  assert.match(skill, /Never merge into or overwrite it/);
  assert.match(skill, /4:5 as the first validated case/);
  assert.match(skill, /video-qa-maria/);
  assert.match(skill, /explicit human approval/);
});

test("new phase files contain no Flor/Julio inherited identity", () => {
  const combined = [
    read(supportSkillPath),
    read(reformatSkillPath),
    read(palettePath),
  ].join("\n");
  for (const forbidden of [
    "Flor y Julio",
    "Adscelerator",
    "Playfair",
    "Geomanist",
    "/Users/lio",
    "_fyj-",
  ]) {
    assert.equal(
      combined.includes(forbidden),
      false,
      `Inherited identity found: ${forbidden}`,
    );
  }
});
