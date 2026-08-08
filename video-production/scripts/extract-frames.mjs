#!/usr/bin/env node
// Extrae frames de un MP4 ya renderizado en timestamps dados (post-render, NO scrub vivo).
// CLI: node scripts/extract-frames.mjs <video.mp4> <t1> <t2> ... [--out <dir>]
// Output: <dir>/t<ts>.png (default dir: <video-dir>/frames-qa/)
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const video = args.find(a => !a.startsWith('--') && a.endsWith('.mp4'));
if (!video) { console.error('usage: extract-frames.mjs <video.mp4> <t1> [t2 ...] [--out dir]'); process.exit(1); }
const oi = args.indexOf('--out');
const outDir = oi >= 0 ? args[oi + 1] : join(dirname(video), 'frames-qa');
const times = args.filter(a => !a.startsWith('--') && a !== video && !Number.isNaN(Number(a)));
mkdirSync(outDir, { recursive: true });
const written = [];
for (const t of times) {
  const out = join(outDir, `t${String(t).replace('.', '_')}.png`);
  execFileSync('ffmpeg', ['-y', '-ss', String(t), '-i', video, '-frames:v', '1', '-q:v', '2', out], { stdio: 'ignore' });
  written.push(out);
}
console.log(written.join('\n'));

