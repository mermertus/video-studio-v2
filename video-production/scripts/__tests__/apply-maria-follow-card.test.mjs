import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import test from "node:test";

const VIDEO_PRODUCTION = resolve(import.meta.dirname, "..", "..");
const SCRIPT = join(VIDEO_PRODUCTION, "scripts", "apply-maria-follow-card.mjs");
const PREFLIGHT = join(VIDEO_PRODUCTION, "scripts", "preflight.mjs");

test("aplica la CTA 1,5 s antes de sígueme, hasta el final y sin duplicarla", () => {
  const projectDir = mkdtempSync(join(tmpdir(), "maria-follow-card-"));
  try {
    writeFileSync(
      join(projectDir, "index.html"),
      `<!doctype html>
<html><head></head><body>
<div id="root" data-composition-id="test" data-width="1080" data-height="1920" data-duration="48">
  <div class="clip caption cap-lower" data-start="46" data-duration="2" data-track-index="4">SÍGUEME</div>
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({paused:true});
tl.to({}, {duration:48}, 0);
window.__timelines["test"] = tl;
</script>
</body></html>`,
      "utf8",
    );
    writeFileSync(
      join(projectDir, "transcript.raw.json"),
      `${JSON.stringify({ start: 47080, end: 47440, text: "sígueme." })}\n`,
      "utf8",
    );

    const first = spawnSync(process.execPath, [SCRIPT, projectDir], { encoding: "utf8" });
    assert.equal(first.status, 0, first.stderr);
    const once = readFileSync(join(projectDir, "index.html"), "utf8");
    assert.match(once, /data-start="45\.58"/);
    assert.match(once, /data-duration="2\.42"/);
    assert.match(once, /maria-follow-cta-caption-safe/);
    assert.match(once, /data-maria-follow-safe="true"/);
    assert.match(once, /maria-follow-profile-cta-whoosh/);
    assert.match(once, /maria-follow-profile-cta-click/);

    const second = spawnSync(process.execPath, [SCRIPT, projectDir], { encoding: "utf8" });
    assert.equal(second.status, 0, second.stderr);
    const twice = readFileSync(join(projectDir, "index.html"), "utf8");
    assert.equal((twice.match(/MARIA_FOLLOW_CTA:START/g) ?? []).length, 1);
    assert.equal((twice.match(/id="maria-follow-profile-cta-host"/g) ?? []).length, 1);

    const preflight = spawnSync(process.execPath, [PREFLIGHT, projectDir], { encoding: "utf8" });
    assert.equal(preflight.status, 0, `${preflight.stdout}\n${preflight.stderr}`);
    assert.match(preflight.stdout, /maria_follow_cta_lead/);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
});
