import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");

const files = {
  skill: resolve(
    repositoryRoot,
    "video-production",
    ".claude",
    "skills",
    "maria-reel-production",
    "SKILL.md",
  ),
  qa: resolve(repositoryRoot, ".claude", "agents", "video-qa-maria.md"),
  orchestrator: resolve(
    repositoryRoot,
    ".claude",
    "agents",
    "video-orchestrator-maria-v2.md",
  ),
};

function contents(path) {
  return readFileSync(path, "utf8");
}

test("protected legacy baseline remains unchanged", () => {
  const result = spawnSync(
    process.execPath,
    [resolve(toolDirectory, "verify-protected-baseline.mjs"), "verify"],
    { cwd: repositoryRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("new skill declares its identity and human approval gates", () => {
  const skill = contents(files.skill);
  assert.match(skill, /^---\r?\nname: maria-reel-production\r?\n/m);
  assert.match(
    skill,
    /explicit human approval before the final\s+(render|promotion)/i,
  );
  assert.match(skill, /verify-protected-baseline\.mjs verify/);
  assert.match(skill, /video-qa-maria/);
});

test("QA is read-only by default and cannot render the final", () => {
  const qa = contents(files.qa);
  assert.match(qa, /`audit` es el modo predeterminado/);
  assert.match(qa, /`fix-objective` solo se activa/);
  assert.match(qa, /Nunca produzcas el render final/);
  assert.match(qa, /clean`, `needs-fix`, `needs-human` o `failed/);
});

test("orchestrator preserves old system and uses dynamic discovery", () => {
  const orchestrator = contents(files.orchestrator);
  assert.match(orchestrator, /Descubre, no codifiques supuestos/);
  assert.match(orchestrator, /CONTROL-ANTIGUO/);
  assert.match(orchestrator, /MARIA-V2/);
  assert.match(orchestrator, /espera aprobación humana/);
});

test("an explicit edit request proceeds to draft without storyboard approval", () => {
  const skill = contents(files.skill);
  const orchestrator = contents(files.orchestrator);
  assert.match(skill, /do not pause for their approval/i);
  assert.doesNotMatch(
    skill,
    /Request explicit approval of the brief\/storyboard/i,
  );
  assert.match(
    orchestrator,
    /No pidas aprobación del\s+brief o storyboard/i,
  );
  assert.match(orchestrator, /draft antes del render\s+final/i);
});

test("new files contain no known inherited identity or stale absolute path", () => {
  const combined = Object.values(files).map(contents).join("\n");
  for (const forbidden of [
    "/Users/lio",
    "Adscelerator",
    "Playfair",
    "Geomanist",
    "_maria_VSL-v3",
    "_maria-CPL-Bajo",
  ]) {
    assert.equal(
      combined.includes(forbidden),
      false,
      `Forbidden inherited term found: ${forbidden}`,
    );
  }
});
