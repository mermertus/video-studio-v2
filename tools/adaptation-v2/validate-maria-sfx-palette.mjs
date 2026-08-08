import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolDirectory, "..", "..");
const sfxDirectory = resolve(repositoryRoot, "video-production", "assets", "sfx");
const manifestPath = resolve(sfxDirectory, "sfx-manifest.json");
const palettePath = resolve(sfxDirectory, "maria-palette.v2.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const palette = JSON.parse(readFileSync(palettePath, "utf8"));
const errors = [];
const events = new Set();
const referencedSamples = new Set();

if (!palette.policy?.preserveAllExistingSamples) {
  errors.push("Palette must preserve the full existing SFX library.");
}
if (!palette.policy?.humanListeningRequired) {
  errors.push("Palette must require human listening.");
}
if (!palette.policy?.fixedUniversalVolumeForbidden) {
  errors.push("Palette must forbid one universal fixed volume.");
}

for (const assignment of palette.assignments ?? []) {
  if (!assignment.event || events.has(assignment.event)) {
    errors.push(`Missing or duplicate event: ${assignment.event ?? "<empty>"}`);
  }
  events.add(assignment.event);

  const range = assignment.startingVolumeRange;
  if (
    !Array.isArray(range) ||
    range.length !== 2 ||
    !range.every((value) => Number.isFinite(value)) ||
    range[0] < 0 ||
    range[1] > 1 ||
    range[0] >= range[1]
  ) {
    errors.push(`Invalid startingVolumeRange for ${assignment.event}`);
  }

  for (const sampleName of [
    ...(assignment.preferred ?? []),
    ...(assignment.alternatives ?? []),
  ]) {
    referencedSamples.add(sampleName);
    const sample = manifest.samples?.[sampleName];
    if (!sample) {
      errors.push(`Unknown sample "${sampleName}" in ${assignment.event}`);
      continue;
    }
    if (!existsSync(resolve(sfxDirectory, sample.file))) {
      errors.push(`Missing audio file for sample "${sampleName}": ${sample.file}`);
    }
    if (!Number.isFinite(sample.transient_offset)) {
      errors.push(`Missing transient_offset for sample "${sampleName}"`);
    }
  }
}

if ((palette.assignments ?? []).length !== 9) {
  errors.push("Expected the nine approved María V2 sound-event mappings.");
}

if (errors.length) {
  console.error("María SFX palette validation FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `María SFX palette valid: ${palette.assignments.length} events, ${referencedSamples.size} existing samples referenced.`,
  );
  console.log(
    `Full library preserved: ${Object.keys(manifest.samples ?? {}).length} samples.`,
  );
}
