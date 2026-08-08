import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..", "..", "..");
const projectsRoot = resolve(repositoryRoot, "video-production", "video-projects");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalize(path) {
  return resolve(path).toLowerCase();
}

function isInside(parent, child) {
  return (
    normalize(child) === normalize(parent) ||
    normalize(child).startsWith(`${normalize(parent)}${sep}`)
  );
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const args = process.argv.slice(2);
const projectInput = args[0];
const candidateInput = args[1];
const approvedIndex = args.indexOf("--approved");
if (!projectInput || !candidateInput || approvedIndex === -1) {
  fail(
    "Usage: node promote-master-candidate.mjs <project> <candidate.mp4> --approved <approval-note> [--output <final.mp4>]",
  );
}
const approvalNote = args[approvedIndex + 1];
if (!approvalNote || approvalNote.startsWith("--")) fail("Approval note is required.");

const projectPath = resolve(projectInput);
if (!isInside(projectsRoot, projectPath) || projectPath === projectsRoot) {
  fail(`Project must be a child of ${projectsRoot}`);
}
if (!existsSync(resolve(projectPath, "maria-studio.v2.json"))) {
  fail("Only opt-in MARIA-V2 projects can promote a master candidate.");
}

const candidatePath = resolve(candidateInput);
if (!isInside(projectPath, candidatePath) || !existsSync(candidatePath)) {
  fail("Candidate must exist inside the project.");
}
if (statSync(candidatePath).size === 0) fail("Candidate is empty.");

const outputIndex = args.indexOf("--output");
const finalPath = outputIndex >= 0
  ? resolve(args[outputIndex + 1])
  : resolve(projectPath, "renders", "final-approved.mp4");
if (!isInside(projectPath, finalPath)) fail("Final output must remain inside the project.");
if (existsSync(finalPath)) {
  fail(`Final output already exists: ${finalPath}. Create a new version; do not overwrite.`);
}

mkdirSync(dirname(finalPath), { recursive: true });
copyFileSync(candidatePath, finalPath);
const candidateHash = sha256(candidatePath);
const finalHash = sha256(finalPath);
if (candidateHash !== finalHash) fail("Promotion hash mismatch.");

const manifest = {
  schemaVersion: 1,
  edition: "MARIA-V2",
  method: "byte-identical-promotion-without-rerender",
  approvalNote,
  candidate: relative(projectPath, candidatePath).replaceAll("\\", "/"),
  final: relative(projectPath, finalPath).replaceAll("\\", "/"),
  bytes: statSync(finalPath).size,
  sha256: finalHash,
};
writeFileSync(
  resolve(projectPath, "delivery-manifest.v2.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(`Approved candidate promoted without rerender: ${finalPath}`);
console.log(`SHA256 ${finalHash}`);
