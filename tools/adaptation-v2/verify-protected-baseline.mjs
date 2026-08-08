import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");
const manifestPath = resolve(
  repositoryRoot,
  "docs",
  "adaptation-v2",
  "protected-baseline.sha256.json",
);

const protectedRoots = [
  "brand",
  "video-production/assets",
  "video-production/scripts",
  "video-production/video-projects",
  "video-production/.claude/skills/hyperframes",
  "video-production/.claude/skills/hyperframes-cli",
  "video-production/.claude/skills/hyperframes-registry",
  "video-production/.claude/skills/gsap",
  ".claude/agents/video-orchestrator.md",
  ".claude/agents/video-qa.md",
];

const ignoredDirectoryNames = new Set([
  ".git",
  ".thumbnails",
  ".waveform-cache",
  "dist",
  "node_modules",
  "renders",
]);

const mutableV2InstructionPaths = new Set([
  "brand/content-system/reel-rules.md",
  "brand/hyperframes/HYPERFRAMES-BRAND-RULES.md",
  "video-production/video-projects/_maria-template/BRIEF.md",
  "video-production/video-projects/_maria-template/EDITING_BASE.md",
  "video-production/video-projects/_maria-template/README.md",
  "video-production/video-projects/_maria-template/STORYBOARD.md",
  "video-production/video-projects/_maria-template/maria-patterns.json",
  "video-production/video-projects/_maria-template/maria-studio.v2.json",
]);

function normalizePath(path) {
  return path.split(sep).join("/");
}

function isMutableV2InstructionPath(path) {
  return mutableV2InstructionPaths.has(normalizePath(path));
}

function shouldIgnore(absolutePath) {
  const relativePath = normalizePath(relative(repositoryRoot, absolutePath));
  if (isMutableV2InstructionPath(relativePath)) {
    return true;
  }

  const parts = relativePath.split("/");
  return parts.some(
    (part) => ignoredDirectoryNames.has(part) || part.startsWith(".test-"),
  );
}

function collectFiles(absolutePath, output = []) {
  if (!existsSync(absolutePath) || shouldIgnore(absolutePath)) {
    return output;
  }

  const stats = lstatSync(absolutePath);
  if (stats.isSymbolicLink()) {
    return output;
  }
  if (stats.isFile()) {
    output.push(absolutePath);
    return output;
  }

  for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
    collectFiles(resolve(absolutePath, entry.name), output);
  }
  return output;
}

function fingerprint(absolutePath) {
  const contents = readFileSync(absolutePath);
  return {
    path: normalizePath(relative(repositoryRoot, absolutePath)),
    bytes: contents.byteLength,
    sha256: createHash("sha256").update(contents).digest("hex"),
  };
}

function currentEntries() {
  const files = protectedRoots.flatMap((root) =>
    collectFiles(resolve(repositoryRoot, root)),
  );
  return [...new Set(files)]
    .map(fingerprint)
    .sort((left, right) => left.path.localeCompare(right.path));
}

function createManifest() {
  const entries = currentEntries();
  const manifest = {
    schemaVersion: 1,
    purpose:
      "Freeze the working María video system before additive Video Studio V2 changes.",
    createdAt: new Date().toISOString(),
    repositoryRoot,
    protectedRoots,
    ignoredDirectoryNames: [...ignoredDirectoryNames].sort(),
    mutableV2InstructionPaths: [...mutableV2InstructionPaths].sort(),
    policy:
      "Existing protected files may not change or disappear. New files are allowed. V2 instruction/template files listed in mutableV2InstructionPaths are allowed to evolve and are not blocking.",
    entries,
  };

  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Baseline created: ${entries.length} protected files.`);
  console.log(manifestPath);
}

function verifyManifest() {
  if (!existsSync(manifestPath)) {
    console.error(`Baseline manifest not found: ${manifestPath}`);
    process.exitCode = 2;
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const currentByPath = new Map(
    currentEntries().map((entry) => [entry.path, entry]),
  );
  const missing = [];
  const changed = [];

  for (const expected of manifest.entries) {
    if (isMutableV2InstructionPath(expected.path)) {
      continue;
    }

    const actual = currentByPath.get(expected.path);
    if (!actual) {
      missing.push(expected.path);
      continue;
    }
    if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
      changed.push({
        path: expected.path,
        expectedBytes: expected.bytes,
        actualBytes: actual.bytes,
        expectedSha256: expected.sha256,
        actualSha256: actual.sha256,
      });
    }
  }

  if (missing.length || changed.length) {
    console.error("Protected baseline verification FAILED.");
    if (missing.length) {
      console.error(`Missing files (${missing.length}):`);
      for (const path of missing) console.error(`- ${path}`);
    }
    if (changed.length) {
      console.error(`Changed files (${changed.length}):`);
      for (const item of changed) console.error(`- ${item.path}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Protected baseline verified: ${manifest.entries.length} existing files unchanged.`,
  );
  console.log(
    "Additive files and mutable V2 instruction/template files are allowed and are not treated as regressions.",
  );
}

const command = process.argv[2] ?? "verify";
if (command === "create") {
  createManifest();
} else if (command === "verify") {
  verifyManifest();
} else {
  console.error("Usage: node verify-protected-baseline.mjs [create|verify]");
  process.exitCode = 2;
}
