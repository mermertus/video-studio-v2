import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..", "..", "..");
const projectsRoot = resolve(repositoryRoot, "video-production", "video-projects");
const registryPath = resolve(
  repositoryRoot,
  "docs",
  "adaptation-v2",
  "maria-pattern-registry.v2.json",
);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalize(path) {
  return resolve(path).toLowerCase();
}

function isInside(parent, child) {
  const parentPath = `${normalize(parent)}${sep}`;
  const childPath = normalize(child);
  return childPath === normalize(parent) || childPath.startsWith(parentPath);
}

function parseArgs(argv) {
  const positional = [];
  const flags = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }
    const name = value.slice(2);
    if (["lab", "source-gate"].includes(name)) {
      flags.set(name, true);
      continue;
    }
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) fail(`Missing value for --${name}`);
    flags.set(name, next);
    index += 1;
  }
  return { positional, flags };
}

function collectFiles(path, output = []) {
  const stat = lstatSync(path);
  if (stat.isFile()) {
    output.push(path);
    return output;
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    collectFiles(resolve(path, entry.name), output);
  }
  return output;
}

function directoryHash(path) {
  const hash = createHash("sha256");
  for (const file of collectFiles(path).sort()) {
    hash.update(relative(path, file).replaceAll("\\", "/"));
    hash.update(readFileSync(file));
  }
  return hash.digest("hex");
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [projectInput, patternId] = positional;
if (!projectInput || !patternId) {
  fail(
    "Usage: node apply-maria-pattern.mjs <project> <pattern-id> [--version x] [--start s --duration s] [--reason text] [--source text] [--source-gate] [--lab]",
  );
}

const projectPath = resolve(projectInput);
if (!isInside(projectsRoot, projectPath) || projectPath === projectsRoot) {
  fail(`Project must be a child of ${projectsRoot}`);
}
if (!existsSync(projectPath)) fail(`Project not found: ${projectPath}`);

const configPath = resolve(projectPath, "maria-studio.v2.json");
if (!existsSync(configPath)) {
  fail("V2 opt-in missing. Existing/control projects are never migrated implicitly.");
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
if (config.edition !== "MARIA-V2" || config.optIn !== true) {
  fail("Invalid or disabled MARIA-V2 project configuration.");
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const requestedVersion = flags.get("version");
const pattern = registry.patterns.find(
  (item) =>
    item.id === patternId &&
    (!requestedVersion || item.version === requestedVersion),
);
if (!pattern) fail(`Pattern not found: ${patternId}`);
if (["deferred", "rejected"].includes(pattern.status)) {
  fail(`Pattern ${pattern.id} is ${pattern.status} and cannot be installed.`);
}
if (pattern.status !== "approved" && !flags.get("lab")) {
  fail(`Pattern ${pattern.id} requires an explicit --lab installation.`);
}
if (
  config.patternPolicy.autoEligibleOnlyByDefault &&
  pattern.autoEligible !== true &&
  !flags.get("lab")
) {
  fail(`Pattern ${pattern.id} is not auto-eligible.`);
}
if (pattern.requiresSourceGate?.length && !flags.get("source-gate")) {
  fail(`Pattern ${pattern.id} requires --source-gate after checking its conditions.`);
}

const sourcePath = resolve(repositoryRoot, pattern.packagePath);
if (!pattern.packagePath || !existsSync(sourcePath)) {
  fail(`Pattern package is unavailable: ${pattern.packagePath || "(none)"}`);
}

const localRelative = `patterns/maria-v2/${pattern.id}/${pattern.version}`;
const destinationPath = resolve(projectPath, localRelative);
if (!isInside(projectPath, destinationPath)) fail("Unsafe destination path.");

const sourceHash = directoryHash(sourcePath);
if (existsSync(destinationPath)) {
  if (directoryHash(destinationPath) !== sourceHash) {
    fail(
      `A different local copy already exists at ${destinationPath}. Install a new version instead of overwriting it.`,
    );
  }
} else {
  mkdirSync(dirname(destinationPath), { recursive: true });
  cpSync(sourcePath, destinationPath, { recursive: true, errorOnExist: true });
}

const manifestPath = resolve(projectPath, "maria-patterns.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { schemaVersion: 1, edition: "MARIA-V2", installed: [] };

const existing = manifest.installed.find(
  (item) => item.id === pattern.id && item.version === pattern.version,
);
const start = flags.has("start") ? Number(flags.get("start")) : null;
const duration = flags.has("duration") ? Number(flags.get("duration")) : null;
if ((start !== null && !Number.isFinite(start)) || (duration !== null && !(duration > 0))) {
  fail("Invalid --start or --duration.");
}

const record = {
  id: pattern.id,
  version: pattern.version,
  kind: pattern.kind,
  statusAtInstall: pattern.status,
  autoEligible: pattern.autoEligible,
  intensity: pattern.intensity,
  localPath: localRelative,
  packageSha256: sourceHash,
  integrationStatus: "pending",
  sourceGateSatisfied: Boolean(flags.get("source-gate")),
  start,
  duration,
  reason: flags.get("reason") ?? "",
  factualSource: flags.get("source") ?? "",
  fallback: pattern.fallback,
};

if (existing) {
  Object.assign(existing, record);
} else {
  manifest.installed.push(record);
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Installed frozen local copy: ${pattern.id}@${pattern.version}`);
console.log(destinationPath);
console.log("Integration remains pending until placeholders and timeline wiring are completed.");
