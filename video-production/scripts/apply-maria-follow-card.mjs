#!/usr/bin/env node

import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..", "..");
const MASTER_DIR = join(
  REPO_ROOT,
  "brand",
  "hyperframes",
  "components",
  "instagram-follow-card",
);
const MASTER_COMPONENT = join(MASTER_DIR, "maria-follow-profile-cta.html");
const MASTER_ASSETS = join(MASTER_DIR, "assets");
const START_MARKER = "<!-- MARIA_FOLLOW_CTA:START -->";
const END_MARKER = "<!-- MARIA_FOLLOW_CTA:END -->";
const STYLE_MARKER = "maria-follow-cta-caption-safety";
const LOOKBACK_SECONDS = 10;
const LEAD_SECONDS = 1.5;
const CLICK_LOCAL_TIME = 1.46;
const EXCLUSION_ZONE = Object.freeze({ x1: 56, y1: 1180, x2: 1024, y2: 1586 });

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readCompositionDuration(html) {
  const root = html.match(
    /<div\b[^>]*\bdata-composition-id\s*=\s*["'][^"']+["'][^>]*>/i,
  );
  if (!root) fail("No se encontró la composición raíz en index.html.");
  const duration = root[0].match(/\bdata-duration\s*=\s*["']([^"']+)["']/i);
  const parsed = duration ? number(duration[1]) : null;
  if (parsed === null || parsed <= 0) {
    fail("La composición raíz necesita un data-duration numérico.");
  }
  return parsed;
}

function readTranscriptFile(path) {
  const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "").trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
}

function collectTimedEntries(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectTimedEntries(item, output);
    return output;
  }
  if (!value || typeof value !== "object") return output;

  const text = value.word ?? value.text ?? value.token;
  const start = number(value.start ?? value.start_time ?? value.startTime);
  const end = number(value.end ?? value.end_time ?? value.endTime);
  if (typeof text === "string" && start !== null && end !== null) {
    output.push({ text, start, end });
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      !["word", "text", "token", "start", "end", "start_time", "end_time", "startTime", "endTime"].includes(
        key,
      )
    ) {
      collectTimedEntries(nested, output);
    }
  }
  return output;
}

function toSeconds(entries, compositionDuration) {
  const maxEnd = Math.max(...entries.map((entry) => entry.end), 0);
  const divisor = maxEnd > compositionDuration * 20 ? 1000 : 1;
  return entries.map((entry) => ({
    text: entry.text,
    start: entry.start / divisor,
    end: entry.end / divisor,
  }));
}

function findSiguemeStart(projectDir, compositionDuration, explicitTranscript) {
  const candidates = explicitTranscript
    ? [resolve(explicitTranscript)]
    : [
        join(projectDir, "transcript.words.json"),
        join(projectDir, "transcript.raw.json"),
        join(projectDir, "transcript.json"),
      ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const entries = toSeconds(collectTimedEntries(readTranscriptFile(path)), compositionDuration);
    const windowStart = Math.max(0, compositionDuration - LOOKBACK_SECONDS);
    const matches = entries.filter((entry) => {
      const normalized = normalizeText(entry.text);
      return (
        entry.end >= windowStart &&
        normalized.split(" ").includes("sigueme") &&
        (normalized === "sigueme" || !normalized.includes(" "))
      );
    });
    if (matches.length) {
      matches.sort((a, b) => a.start - b.start);
      return { path, start: matches.at(-1).start };
    }
  }

  fail(
    'No se encontró un timestamp de palabra para "sígueme" dentro de los últimos 10 segundos. La transcripción de edición debe conservar timestamps por palabra.',
  );
}

function readAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? match[1] : null;
}

function replaceOrAddClass(tag, className) {
  const classMatch = tag.match(/\bclass\s*=\s*(["'])([^"']*)\1/i);
  if (!classMatch) {
    return tag.replace(/>$/, ` class="${className}">`);
  }
  const classes = new Set(classMatch[2].split(/\s+/).filter(Boolean));
  classes.add(className);
  return tag.replace(classMatch[0], `class="${[...classes].join(" ")}"`);
}

function relocateOverlappingCaptions(html, overlayStart, compositionDuration) {
  return html.replace(/<(div|section)\b[^>]*>/gi, (tag) => {
    const classes = readAttr(tag, "class") ?? "";
    if (!classes.split(/\s+/).some((name) => /caption|subtitle/i.test(name))) return tag;
    const start = number(readAttr(tag, "data-start"));
    const duration = number(readAttr(tag, "data-duration"));
    if (start === null || duration === null) return tag;
    const overlaps = start < compositionDuration && start + duration > overlayStart;
    if (!overlaps) return tag;
    let updated = replaceOrAddClass(tag, "maria-follow-cta-caption-safe");
    if (!/\bdata-maria-follow-safe\s*=/.test(updated)) {
      updated = updated.replace(/>$/, ' data-maria-follow-safe="true">');
    }
    return updated;
  });
}

function clearCaptionSafety(html) {
  return html.replace(/<(div|section)\b[^>]*>/gi, (tag) =>
    tag
      .replace(/\sdata-maria-follow-safe\s*=\s*["']true["']/gi, "")
      .replace(/\bclass\s*=\s*(["'])([^"']*)\1/i, (_match, quote, classes) => {
        const cleaned = classes
          .split(/\s+/)
          .filter((name) => name && name !== "maria-follow-cta-caption-safe")
          .join(" ");
        return `class=${quote}${cleaned}${quote}`;
      }),
  );
}

function injectSafetyStyle(html) {
  if (html.includes(`id="${STYLE_MARKER}"`)) return html;
  const style = `
    <style id="${STYLE_MARKER}">
      .maria-follow-cta-caption-safe {
        top: 890px !important;
        bottom: auto !important;
        left: 70px !important;
        right: 70px !important;
        width: auto !important;
        max-width: 940px !important;
        z-index: 80 !important;
      }
    </style>
`;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${style}  </head>`);
  return html.replace(/<body\b[^>]*>/i, (bodyTag) => `${bodyTag}${style}`);
}

function findRootClosingDiv(html) {
  const rootMatch = /<div\b[^>]*\bdata-composition-id\s*=\s*["'][^"']+["'][^>]*>/i.exec(html);
  if (!rootMatch) fail("No se encontró la composición raíz.");
  const tokenPattern = /<\/?div\b[^>]*>/gi;
  tokenPattern.lastIndex = rootMatch.index;
  let depth = 0;
  let token;
  while ((token = tokenPattern.exec(html))) {
    if (/^<div\b/i.test(token[0])) depth += 1;
    else depth -= 1;
    if (depth === 0) return token.index;
  }
  fail("No se encontró el cierre de la composición raíz.");
}

function removeExistingBlock(html) {
  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER);
  if (start === -1 && end === -1) return html;
  if (start === -1 || end === -1 || end < start) {
    fail("Los marcadores de la CTA están incompletos en index.html.");
  }
  return `${html.slice(0, start)}${html.slice(end + END_MARKER.length)}`;
}

function maxTrackIndex(html) {
  const tracks = [...html.matchAll(/\bdata-track-index\s*=\s*["'](\d+)["']/gi)].map((m) =>
    Number(m[1]),
  );
  return Math.max(0, ...tracks);
}

function formatTime(value) {
  return Number(value.toFixed(3)).toString();
}

function buildBlock(start, duration, firstTrack) {
  const clickStart = start + CLICK_LOCAL_TIME;
  return `${START_MARKER}
      <div
        id="maria-follow-profile-cta-host"
        class="clip"
        data-maria-follow-cta="true"
        data-composition-id="maria-follow-profile-cta"
        data-composition-src="compositions/maria-follow-profile-cta.html"
        data-start="${formatTime(start)}"
        data-duration="${formatTime(duration)}"
        data-track-index="${firstTrack}"
        data-width="1080"
        data-height="1920"
        data-exclusion-zone="${EXCLUSION_ZONE.x1},${EXCLUSION_ZONE.y1},${EXCLUSION_ZONE.x2},${EXCLUSION_ZONE.y2}"
      ></div>
      <audio
        id="maria-follow-profile-cta-whoosh"
        src="assets/maria-follow-card/sfx/follow-whoosh.wav"
        data-start="${formatTime(start)}"
        data-duration="${formatTime(Math.min(1.5, duration))}"
        data-track-index="${firstTrack + 1}"
        data-volume="0.42"
      ></audio>
      <audio
        id="maria-follow-profile-cta-click"
        src="assets/maria-follow-card/sfx/follow-click.wav"
        data-start="${formatTime(clickStart)}"
        data-duration="${formatTime(Math.max(0.1, Math.min(0.8, start + duration - clickStart)))}"
        data-track-index="${firstTrack + 2}"
        data-volume="0.78"
      ></audio>
      ${END_MARKER}`;
}

function copyMaster(projectDir) {
  const compositionDir = join(projectDir, "compositions");
  const assetDir = join(projectDir, "assets", "maria-follow-card");
  mkdirSync(compositionDir, { recursive: true });
  mkdirSync(assetDir, { recursive: true });
  copyFileSync(MASTER_COMPONENT, join(compositionDir, "maria-follow-profile-cta.html"));
  cpSync(MASTER_ASSETS, assetDir, { recursive: true, force: true });
}

function parseArgs(argv) {
  const args = { project: null, transcript: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--transcript") {
      args.transcript = argv[index + 1];
      index += 1;
    } else if (!args.project) {
      args.project = argv[index];
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.project) {
    fail(
      "Uso: node scripts/apply-maria-follow-card.mjs <project-folder> [--transcript <archivo>]",
    );
  }
  if (!existsSync(MASTER_COMPONENT) || !existsSync(MASTER_ASSETS)) {
    fail(`No existe el componente maestro: ${MASTER_DIR}`);
  }

  const projectDir = resolve(args.project);
  const indexPath = join(projectDir, "index.html");
  if (!existsSync(indexPath)) fail(`No existe ${indexPath}`);

  let html = readFileSync(indexPath, "utf8");
  const compositionDuration = readCompositionDuration(html);
  const target = findSiguemeStart(projectDir, compositionDuration, args.transcript);
  const overlayStart = Math.max(0, target.start - LEAD_SECONDS);
  const overlayDuration = compositionDuration - overlayStart;

  html = removeExistingBlock(html);
  html = clearCaptionSafety(html);
  html = relocateOverlappingCaptions(html, overlayStart, compositionDuration);
  html = injectSafetyStyle(html);
  const trackIndex = maxTrackIndex(html) + 1;
  const insertionPoint = findRootClosingDiv(html);
  const block = `\n      ${buildBlock(overlayStart, overlayDuration, trackIndex)}\n`;
  html = `${html.slice(0, insertionPoint)}${block}${html.slice(insertionPoint)}`;

  copyMaster(projectDir);
  writeFileSync(indexPath, html, "utf8");
  writeFileSync(
    join(projectDir, "maria-follow-card.json"),
    `${JSON.stringify(
      {
        version: 1,
        trigger: "sígueme",
        transcript: basename(target.path),
        searchWindowSeconds: LOOKBACK_SECONDS,
        leadSeconds: LEAD_SECONDS,
        siguemeStart: Number(target.start.toFixed(3)),
        overlayStart: Number(overlayStart.toFixed(3)),
        overlayDuration: Number(overlayDuration.toFixed(3)),
        staysUntilVideoEnd: true,
        exclusionZone: EXCLUSION_ZONE,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(
    `✓ CTA aplicada: ${formatTime(overlayStart)}s → ${formatTime(compositionDuration)}s (sígueme: ${formatTime(target.start)}s)`,
  );
}

main();
