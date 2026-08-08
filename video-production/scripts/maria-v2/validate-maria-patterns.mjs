import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
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

const projectInput = process.argv.slice(2).find((value) => !value.startsWith("--"));
const readyMode = process.argv.includes("--ready");
const errors = [];
const warnings = [];

function normalize(path) {
  return resolve(path).toLowerCase();
}

function isInside(parent, child) {
  return (
    normalize(child) === normalize(parent) ||
    normalize(child).startsWith(`${normalize(parent)}${sep}`)
  );
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

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
if (registry.schemaVersion !== 1 || !Array.isArray(registry.patterns)) {
  errors.push("Registry schema is invalid.");
}
const ids = new Set();
for (const pattern of registry.patterns ?? []) {
  const key = `${pattern.id}@${pattern.version}`;
  if (ids.has(key)) errors.push(`Duplicate registry item: ${key}`);
  ids.add(key);
  for (const field of [
    "id",
    "version",
    "kind",
    "status",
    "intensity",
    "fallback",
  ]) {
    if (!pattern[field]) errors.push(`${key} is missing ${field}`);
  }
  if (!Number.isInteger(pattern.maxPerReel) || pattern.maxPerReel < 0) {
    errors.push(`${key} has invalid maxPerReel`);
  }
}

if (projectInput) {
  const projectPath = resolve(projectInput);
  if (!isInside(projectsRoot, projectPath) || projectPath === projectsRoot) {
    errors.push(`Project must be a child of ${projectsRoot}`);
  } else if (!existsSync(projectPath)) {
    errors.push(`Project not found: ${projectPath}`);
  } else {
    const configPath = resolve(projectPath, "maria-studio.v2.json");
    if (!existsSync(configPath)) {
      console.log("V2 opt-in absent: existing/control workflow remains untouched.");
      process.exit(0);
    }
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.edition !== "MARIA-V2" || config.optIn !== true) {
      errors.push("Invalid MARIA-V2 opt-in.");
    }
    if (config.coexistence?.replaceExistingRules !== false) {
      errors.push("V2 must not replace existing edit rules.");
    }
    if (config.coexistence?.migrateLegacyProjectsImplicitly !== false) {
      errors.push("Implicit migration must remain disabled.");
    }

    const manifestPath = resolve(projectPath, "maria-patterns.json");
    if (!existsSync(manifestPath)) {
      errors.push("maria-patterns.json is missing.");
    } else {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      const installed = manifest.installed ?? [];
      const counts = new Map();
      const strong = [];
      for (const item of installed) {
        const key = `${item.id}@${item.version}`;
        const registered = registry.patterns.find(
          (pattern) => pattern.id === item.id && pattern.version === item.version,
        );
        if (!registered) {
          errors.push(`Installed pattern is not registered: ${key}`);
          continue;
        }
        if (
          config.patternPolicy?.approvedOnlyInRealProjects &&
          registered.status !== "approved"
        ) {
          errors.push(`Non-approved pattern in real project: ${key}`);
        }
        counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
        if ((counts.get(item.id) ?? 0) > registered.maxPerReel) {
          errors.push(`${item.id} exceeds maxPerReel=${registered.maxPerReel}`);
        }
        const localPath = resolve(projectPath, item.localPath ?? "");
        if (!isInside(projectPath, localPath) || !existsSync(localPath)) {
          errors.push(`Missing or unsafe local package for ${key}`);
        } else {
          if (directoryHash(localPath) !== item.packageSha256) {
            errors.push(`Frozen package hash mismatch for ${key}`);
          }
          for (const file of collectFiles(localPath)) {
            if (!/\.(html|css|js|mjs|md|json)$/i.test(file)) continue;
            const text = readFileSync(file, "utf8");
            if (/https?:\/\//i.test(text)) {
              errors.push(`External runtime reference found in ${relative(projectPath, file)}`);
            }
            if (readyMode && /\{\{[A-Z0-9_]+\}\}/.test(text)) {
              errors.push(`Unresolved placeholder in ${relative(projectPath, file)}`);
            }
          }
        }
        if (readyMode && item.integrationStatus !== "integrated") {
          errors.push(`Pattern integration is not complete: ${key}`);
        } else if (item.integrationStatus !== "integrated") {
          warnings.push(`Pattern integration pending: ${key}`);
        }
        if (registered.requiresSourceGate?.length && item.sourceGateSatisfied !== true) {
          errors.push(`Source gate not recorded for ${key}`);
        }
        if (["hero", "high"].includes(item.intensity)) {
          if (Number.isFinite(item.start) && Number.isFinite(item.duration)) {
            strong.push({ ...item, end: item.start + item.duration });
          } else {
            warnings.push(`Strong pattern lacks schedule: ${key}`);
          }
        }
      }

      strong.sort((left, right) => left.start - right.start);
      const minGap = config.visualBudget?.minSecondsBetweenStrongStimuli ?? 1.2;
      for (let index = 1; index < strong.length; index += 1) {
        const previous = strong[index - 1];
        const current = strong[index];
        if (current.start < previous.end) {
          errors.push(`Concurrent strong stimuli: ${previous.id} and ${current.id}`);
        } else if (current.start - previous.end < minGap) {
          errors.push(`Strong stimuli need ${minGap}s breathing room: ${previous.id} -> ${current.id}`);
        }
      }
      const highCount = installed.filter((item) => item.intensity === "high").length;
      if (
        !(config.visualBudget?.heroCadenceApproxSeconds > 0) ||
        config.visualBudget?.heroCadenceIsQuota !== false
      ) {
        errors.push("Hero cadence must remain a positive, non-quota guideline.");
      }
      if (highCount > config.visualBudget.maxHighStimuliPer60s) {
        errors.push("High stimulus budget exceeded.");
      }
    }
  }
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}
console.log(
  `Maria V2 pattern validation passed${projectInput ? ` for ${resolve(projectInput)}` : ""}.`,
);
