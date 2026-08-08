import { spawnSync } from "node:child_process";

function probe(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", windowsHide: true });
  return {
    command,
    available: result.status === 0,
    detail: (result.stdout || result.stderr || "").split(/\r?\n/)[0],
  };
}

const ffmpeg = probe("ffmpeg", ["-version"]);
const ffprobe = probe("ffprobe", ["-version"]);
const pythonCandidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];
let python = null;
for (const command of pythonCandidates) {
  const candidate = probe(command, command === "py" ? ["-3", "--version"] : ["--version"]);
  if (candidate.available) {
    python = candidate;
    break;
  }
}

const result = {
  schemaVersion: 1,
  purpose: "Read-only capability gate for windowed subject mattes.",
  ffmpeg,
  ffprobe,
  python: python ?? { available: false, detail: "No Python runtime found." },
  readyForEncoding: ffmpeg.available && ffprobe.available,
  readyForSegmentation: false,
  note:
    "Segmentation remains false until a local model/runtime is explicitly selected and tested. Do not download or call an external service automatically.",
};
console.log(JSON.stringify(result, null, 2));
if (!result.readyForEncoding) process.exitCode = 1;
