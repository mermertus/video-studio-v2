import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");

function read(relativePath) {
  return readFileSync(resolve(repositoryRoot, relativePath), "utf8");
}

const paths = {
  intake: "video-production/.claude/skills/maria-video-intake/SKILL.md",
  registry:
    "video-production/.claude/skills/maria-registry-curation/SKILL.md",
  website:
    "video-production/.claude/skills/maria-website-to-video/SKILL.md",
  readiness: "docs/adaptation-v2/long-form-readiness.v2.json",
  registryState: "docs/adaptation-v2/registry-curation.v2.json",
  orchestrator: ".claude/agents/video-orchestrator-maria-v2.md",
};

test("protected system remains unchanged", () => {
  const result = spawnSync(
    process.execPath,
    [resolve(toolDirectory, "verify-protected-baseline.mjs"), "verify"],
    { cwd: repositoryRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("long-form remains gated behind a real pilot", () => {
  const readiness = JSON.parse(read(paths.readiness));
  assert.equal(readiness.legacySkillAllowed, false);
  assert.equal(readiness.status, "blocked-until-real-case");
  assert.deepEqual(readiness.pilot.durationSeconds, [60, 90]);
  assert.equal(readiness.pilot.humanApprovalRequired, true);
});

test("intake uses known María brand and routes without editing", () => {
  const skill = read(paths.intake);
  assert.match(skill, /Never ask María to redefine her established brand/);
  assert.match(skill, /Do not create a project or edit media during intake/);
  assert.match(skill, /\$maria-website-to-video/);
  assert.match(skill, /\$maria-ad-reformat-v2/);
});

test("registry curation starts with zero approved items", () => {
  const state = JSON.parse(read(paths.registryState));
  assert.deepEqual(state.policy.approvedItems, []);
  assert.equal(state.policy.installIntoRealProjects, false);
  assert.equal(state.policy.labRequired, true);
  assert.equal(
    state.candidates.filter((item) => item.status === "candidate").length,
    4,
  );

  const skill = read(paths.registry);
  assert.match(skill, /Initial status is candidate, not approved/);
  assert.match(skill, /disposable laboratory project/);
});

test("website workflow keeps María identity and a factual ledger", () => {
  const skill = read(paths.website);
  assert.match(skill, /website as evidence and subject matter/);
  assert.match(skill, /Do not fabricate performance, testimonials, prices/);
  assert.match(skill, /Use María's colors, typography, captions/);
  assert.match(skill, /source-ledger\.md/);
});

test("orchestrator routes all four new phases", () => {
  const orchestrator = read(paths.orchestrator);
  for (const term of [
    "maria-video-intake",
    "maria-registry-curation",
    "maria-website-to-video",
    "long-form-readiness.v2.json",
  ]) {
    assert.ok(orchestrator.includes(term), `Missing route: ${term}`);
  }
});

test("new skills contain no inherited studio identity", () => {
  const combined = [
    read(paths.intake),
    read(paths.registry),
    read(paths.website),
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
