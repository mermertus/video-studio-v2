import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");
const videoProduction = resolve(repositoryRoot, "video-production");
const template = resolve(videoProduction, "video-projects", "_maria-template");
const projectsRoot = resolve(videoProduction, "video-projects");
const applyScript = resolve(
  videoProduction,
  "scripts",
  "maria-v2",
  "apply-maria-pattern.mjs",
);
const validateScript = resolve(
  videoProduction,
  "scripts",
  "maria-v2",
  "validate-maria-patterns.mjs",
);
const promoteScript = resolve(
  videoProduction,
  "scripts",
  "maria-v2",
  "promote-master-candidate.mjs",
);

test("registry is valid and separates brand masters from motion patterns", () => {
  const result = spawnSync(process.execPath, [validateScript], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const registry = JSON.parse(
    readFileSync(
      resolve(repositoryRoot, "docs/adaptation-v2/maria-pattern-registry.v2.json"),
      "utf8",
    ),
  );
  assert.equal(registry.policy.brandComponentsRemainSeparate, true);
  assert.ok(registry.patterns.some((item) => item.kind === "root-recipe"));
  assert.ok(registry.patterns.some((item) => item.kind === "scene-blueprint"));
  assert.ok(registry.patterns.some((item) => item.status === "deferred"));
});

test("control project without V2 opt-in is left untouched", () => {
  const scratchRoot = mkdtempSync(resolve(tmpdir(), "maria-control-"));
  const control = resolve(projectsRoot, `.test-control-${process.pid}`);
  try {
    cpSync(template, control, { recursive: true });
    rmSync(resolve(control, "maria-studio.v2.json"));
    rmSync(resolve(control, "maria-patterns.json"));
    const result = spawnSync(process.execPath, [validateScript, control], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /workflow remains untouched/i);
    assert.equal(existsSync(resolve(control, "patterns")), false);
  } finally {
    if (existsSync(control)) rmSync(control, { recursive: true, force: true });
    rmSync(scratchRoot, { recursive: true, force: true });
  }
});

test("approved pattern installs as a frozen local copy", () => {
  const project = resolve(projectsRoot, `.test-v2-${process.pid}`);
  try {
    cpSync(template, project, { recursive: true });
    const apply = spawnSync(
      process.execPath,
      [
        applyScript,
        project,
        "accent-underline",
        "--source-gate",
        "--start",
        "4",
        "--duration",
        "1.5",
        "--reason",
        "Test",
      ],
      { cwd: repositoryRoot, encoding: "utf8" },
    );
    assert.equal(apply.status, 0, `${apply.stdout}\n${apply.stderr}`);
    const manifest = JSON.parse(
      readFileSync(resolve(project, "maria-patterns.json"), "utf8"),
    );
    assert.equal(manifest.installed.length, 1);
    assert.equal(manifest.installed[0].integrationStatus, "pending");
    assert.ok(
      existsSync(
        resolve(
          project,
          "patterns/maria-v2/accent-underline/1.0.0/pattern.json",
        ),
      ),
    );
    const validate = spawnSync(process.execPath, [validateScript, project], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });
    assert.equal(validate.status, 0, `${validate.stdout}\n${validate.stderr}`);
  } finally {
    if (existsSync(project)) rmSync(project, { recursive: true, force: true });
  }
});

test("real projects reject lab-only patterns", () => {
  const project = resolve(projectsRoot, `.test-lab-gate-${process.pid}`);
  try {
    cpSync(template, project, { recursive: true });
    const apply = spawnSync(
      process.execPath,
      [applyScript, project, "layered-subject-window", "--source-gate"],
      { cwd: repositoryRoot, encoding: "utf8" },
    );
    assert.notEqual(apply.status, 0);
    assert.match(apply.stderr, /requires an explicit --lab/i);
  } finally {
    if (existsSync(project)) rmSync(project, { recursive: true, force: true });
  }
});

test("economical profile prevents replacement and repeated QA loops", () => {
  const config = JSON.parse(
    readFileSync(resolve(template, "maria-studio.v2.json"), "utf8"),
  );
  assert.equal(config.coexistence.replaceExistingRules, false);
  assert.equal(config.coexistence.migrateLegacyProjectsImplicitly, false);
  assert.equal(config.visualBudget.heroCadenceApproxSeconds, 25);
  assert.equal(config.visualBudget.heroCadenceIsQuota, false);
  assert.equal(config.qaBudget.maxFullAudits, 1);
  assert.equal(config.qaBudget.maxGroupedFixPasses, 1);
  assert.equal(config.qaBudget.maxDeltaVerifications, 1);
  assert.equal(config.qaBudget.promoteApprovedCandidateWithoutRerender, true);
});

test("approved master candidate is promoted byte-identically without rerender", () => {
  const project = resolve(projectsRoot, `.test-promotion-${process.pid}`);
  try {
    cpSync(template, project, { recursive: true });
    const candidate = resolve(project, "renders", "master-candidate.mp4");
    mkdirSync(dirname(candidate), { recursive: true });
    writeFileSync(candidate, Buffer.from("test-candidate-content"));
    const result = spawnSync(
      process.execPath,
      [
        promoteScript,
        project,
        candidate,
        "--approved",
        "Prueba automatizada",
      ],
      { cwd: repositoryRoot, encoding: "utf8" },
    );
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const manifest = JSON.parse(
      readFileSync(resolve(project, "delivery-manifest.v2.json"), "utf8"),
    );
    assert.equal(manifest.method, "byte-identical-promotion-without-rerender");
    assert.equal(
      readFileSync(resolve(project, manifest.final), "utf8"),
      "test-candidate-content",
    );
  } finally {
    if (existsSync(project)) rmSync(project, { recursive: true, force: true });
  }
});
