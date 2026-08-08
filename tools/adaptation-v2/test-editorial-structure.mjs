import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { validateProject } from "../../video-production/scripts/validate-editorial-structure.mjs";

function fixture({ broken = false } = {}) {
  const root = mkdtempSync(resolve(tmpdir(), "maria-editorial-"));
  const captions = [
    {
      id: "hook",
      start: 0,
      end: 2,
      mode: "caption--on-media",
      text: "5 FORMAS DE ARRUINAR TU CUENTA DE META ADS",
    },
    {
      id: "point-1",
      start: 2,
      end: broken ? 3.5 : 3,
      mode: broken ? "caption--on-media" : "caption--on-light",
      text: broken ? "ADS. 1. APAGAR" : "1. APAGAR",
    },
    {
      id: "detail",
      start: 3,
      end: 4,
      mode: "caption--on-light",
      text: "LOS ANUNCIOS",
    },
  ];
  const manifest = {
    schemaVersion: 1,
    status: "production",
    fps: 30,
    hook: {
      text: "5 FORMAS DE ARRUINAR TU CUENTA DE META ADS",
      spoken: true,
      startSec: 0,
      endSec: 2,
      visual: {
        type: "sticker",
        realSticker: !broken,
        selector: "#hook-sticker",
        motion: "finite-gif-like",
        sfx: "assets/sticker-pop.wav",
      },
    },
    explicitRequirements: [
      { name: "stickers", required: true, evidence: broken ? "" : "#hook-sticker" },
    ],
    enumeration: [{ number: 1, startSec: 2, captionId: "point-1" }],
    phases: [
      { name: "hook", startSec: 0, endSec: 2, captionMode: "on-media" },
      { name: "support", startSec: 2, endSec: 4, captionMode: "on-light" },
    ],
  };
  writeFileSync(resolve(root, "caption-groups.json"), JSON.stringify(captions));
  writeFileSync(resolve(root, "editorial-structure.json"), JSON.stringify(manifest));
  writeFileSync(resolve(root, "index.html"), '<div id="hook-sticker"></div>');
  return root;
}

test("accepts a hook, real sticker, separated numeral and phase-safe captions", () => {
  const result = validateProject(fixture());
  assert.equal(result.ok, true, result.errors.join("\n"));
});

test("blocks fake stickers, unmet requests, mixed numerals and phase errors", () => {
  const result = validateProject(fixture({ broken: true }));
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /sticker real/);
  assert.match(result.errors.join("\n"), /no tiene evidencia/);
  assert.match(result.errors.join("\n"), /mezcla el numeral/);
  assert.match(result.errors.join("\n"), /cruza la frontera|fase exige/);
});
