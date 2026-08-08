#!/usr/bin/env node
// generate-captions.mjs â€” desde un transcript whisper-cli, produce caption blocks
// listos para inyectar en una composition Hyperframes. Salida = HTML blocks +
// JSON metadata.
//
// Usage:
//   node scripts/generate-captions.mjs <transcript.json> <out-blocks.html> <out-meta.json>

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const [, , inPath, outHtml, outMeta] = process.argv;
if (!inPath || !outHtml || !outMeta) {
  console.error('Usage: generate-captions.mjs <transcript.json> <out.html> <out.json>');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(inPath), 'utf8'));

// --- Tunable params ---
const MAX_WORDS_PER_BLOCK    = 6;
const MIN_WORDS_PER_BLOCK    = 2;
const MAX_BLOCK_DURATION_S   = 3.2;
const MIN_BLOCK_DURATION_S   = 0.6;
const BREAK_PUNCTS           = /[.?!]/;        // hard break
const SOFT_BREAK_PUNCTS      = /,/;             // break if block has >=3 words

// Emphasis (Merlot/editorial highlight): sustantivos clave, conceptos del framework
const EMPHASIS = new Set([
  'administrador','anuncios','anuncio','pregunta','dinero','campaÃ±as','campaÃ±a',
  'audiencia','presupuesto','landing','webinar','embudo','sistema','trÃ¡fico',
  'meta','google','youtube','google ads','meta ads','youtube ads',
  'diagnosticar','diagnosticas','diagnÃ³stico','intervenir','intervienes','medir',
  'mides','intervenciÃ³n','mediciÃ³n','marco','ojo','clÃ­nico','clÃ­nica',
  'criterio','academia','pilar','formaciÃ³n','formaciones','soporte','loom',
  'directo','semanal','sesiÃ³n','goHighlevel','vimeo','metricas','mÃ©tricas',
  'leads','venta','ventas','CTR','CPL','conversiÃ³n','conversiones',
  'cuello','botella','bloqueo','botÃ³n','botones','ti','infoproductor',
  'infoproductores','negocio','negocios','automatizaciones','automatizaciÃ³n',
  'formulario','formularios','email','emails','llamada','reuniÃ³n'
]);

// Punch (rojo gradient): palabras-bomba / emocionales
const PUNCH = new Set([
  'c*Ã±o','coÃ±o','caos','pÃ¡nico','mÃ¡gica','mÃ¡gico','mÃ¡gicos','mÃ¡gicas','magia',
  'mierda','m*erda','ansiedad','desastre','desastres','chino','chinos',
  'catastrÃ³fico','catastrÃ³fica','mata','matas','mato','matar','quemar','queman','quemado',
  'flauta','blitz','ruido','peor','horror','frustra','frustraciÃ³n','frustrante',
  'apaga','apagas','dispara','disparas','disparado','disparados',
  'bloqueo','bloqueos','bloqueado','bloqueada','dudas',
  'gastar','gastas','perdiendo','perder','perdÃ©s','perdiste',
  'errores','error','riesgo','riesgoso','riesgosa','hacks','humo','crap',
  'improvisar','improvisas','improvisaciÃ³n','disaster','dolor','rotos','roto'
]);

// Censura: palabras a mostrar con asterisco en el OUTPUT (mantienen tag punch).
const CENSOR_MAP = new Map([
  ['coÃ±o','c*Ã±o'],
  ['mierda','m*erda'],
]);

function censorOutput(rawWord) {
  // Strip ALL punctuation from edges, censor the core, reattach lead/trail.
  const leadMatch = rawWord.match(/^[^A-Za-zÃ-Ã¿Ã±Ã‘]*/);
  const trailMatch = rawWord.match(/[^A-Za-zÃ-Ã¿Ã±Ã‘]*$/);
  const lead = leadMatch ? leadMatch[0] : '';
  const trail = trailMatch ? trailMatch[0] : '';
  const core = rawWord.slice(lead.length, rawWord.length - trail.length);
  const repl = CENSOR_MAP.get(core.toLowerCase());
  if (!repl) return rawWord;
  const cased = core[0] === core[0].toUpperCase() ? repl[0].toUpperCase() + repl.slice(1) : repl;
  return lead + cased + trail;
}

// Words a NUNCA tratar como emphasis (palabras tipo conector)
const STOPWORDS = new Set([
  'el','la','los','las','un','una','unos','unas','y','o','pero','si','no',
  'que','de','del','al','a','en','con','por','para','sin','sobre',
  'es','son','estÃ¡','estÃ¡n','ser','estar','tiene','tienen','hay','hace',
  'lo','le','les','me','te','se','su','sus','tu','tus','mi','mis',
  'esto','eso','ese','esa','este','esta','estos','estas','aquÃ­','ahÃ­',
  'cuando','donde','cÃ³mo','quÃ©','quiÃ©n','cuÃ¡l','vale','pues','ya','tambiÃ©n'
]);

function normalize(w) {
  return w.toLowerCase().replace(/[Â¿?Â¡!.,:;"'()]/g, '').trim();
}

function classifyWord(rawWord) {
  const norm = normalize(rawWord);
  if (PUNCH.has(norm)) return 'punch';
  if (STOPWORDS.has(norm)) return '';
  if (EMPHASIS.has(norm)) return 'emphasis';
  // ALL-CAPS hint (e.g., "MIRAR MEJOR") â€” skip if already covered
  if (rawWord === rawWord.toUpperCase() && rawWord.length > 3 && /[A-Z]/.test(rawWord)) return 'emphasis';
  return '';
}

// Walk segments â†’ split each into words â†’ assign per-word linear timing
function extractWords() {
  const out = [];
  for (const seg of data.transcription) {
    const text = (seg.text || '').trim();
    if (!text) continue;
    const start = seg.offsets.from / 1000;
    const end = seg.offsets.to / 1000;
    const dur = Math.max(0.05, end - start);
    const tokens = text.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const perWord = dur / tokens.length;
    for (let i = 0; i < tokens.length; i++) {
      const wStart = start + i * perWord;
      const wEnd   = start + (i + 1) * perWord;
      out.push({ text: tokens[i], start: wStart, end: wEnd });
    }
  }
  return out;
}

// Group words into caption blocks
function buildBlocks(words) {
  const blocks = [];
  let cur = [];
  const flush = (reason) => {
    if (cur.length === 0) return;
    if (cur.length < MIN_WORDS_PER_BLOCK && blocks.length > 0) {
      // append leftover to previous block if too short
      const prev = blocks[blocks.length - 1];
      prev.words.push(...cur);
      prev.end = cur[cur.length - 1].end;
    } else {
      blocks.push({
        words: cur.slice(),
        start: cur[0].start,
        end: cur[cur.length - 1].end,
        breakReason: reason
      });
    }
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    cur.push(w);
    const isHard = BREAK_PUNCTS.test(w.text.slice(-1));
    const isSoft = SOFT_BREAK_PUNCTS.test(w.text.slice(-1));
    const blockDur = cur[cur.length - 1].end - cur[0].start;
    if (isHard) flush('hard-punct');
    else if (isSoft && cur.length >= 3) flush('soft-punct');
    else if (cur.length >= MAX_WORDS_PER_BLOCK) flush('max-words');
    else if (blockDur >= MAX_BLOCK_DURATION_S) flush('max-duration');
  }
  flush('end');
  return blocks;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
}

function renderBlock(b, idx) {
  const startStr = b.start.toFixed(3);
  const durStr = Math.max(0.4, b.end - b.start + 0.1).toFixed(3); // small tail
  const trackIdx = 100 + (idx % 60); // rotate track indices to avoid collisions
  const spans = b.words.map(w => {
    const cls = classifyWord(w.text);
    const text = escapeHtml(censorOutput(w.text));
    return cls
      ? `<span class="cap-word ${cls}">${text}</span>`
      : `<span class="cap-word">${text}</span>`;
  }).join('\n      ');
  return `<div class="clip cap" id="cap${idx + 1}" data-start="${startStr}" data-duration="${durStr}" data-track-index="${trackIdx}">
    <div class="cap-inner">
      ${spans}
    </div>
  </div>`;
}

function renderTimelineSnippet(blocks) {
  const lines = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const dur = b.end - b.start;
    lines.push(`  // cap${i + 1} @ ${b.start.toFixed(2)} (+${dur.toFixed(2)}s) â€” "${b.words.map(w => w.text).join(' ')}"`);
    lines.push(`  gsap.set("#cap${i + 1} .cap-inner", { opacity: 1, yPercent: 0 });`);
    lines.push(`  gsap.set("#cap${i + 1} .cap-word",  { opacity: 0, y: 18, scale: 0.92, filter: "blur(6px)" });`);
    lines.push(`  tl.to("#cap${i + 1} .cap-word", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.22, ease: "expo.out", stagger: 0.05 }, ${b.start.toFixed(3)});`);
    lines.push(`  tl.to("#cap${i + 1} .cap-inner", { opacity: 0, yPercent: -25, duration: 0.28, ease: "power2.in" }, ${(b.end - 0.18).toFixed(3)});`);
  }
  return lines.join('\n');
}

// --- Main ---
const words = extractWords();
const blocks = buildBlocks(words);

const html = blocks.map((b, i) => renderBlock(b, i)).join('\n\n');
const tlScript = renderTimelineSnippet(blocks);

writeFileSync(outHtml, html, 'utf8');
writeFileSync(outMeta, JSON.stringify({
  wordCount: words.length,
  blockCount: blocks.length,
  totalDuration: words[words.length - 1]?.end || 0,
  blocks: blocks.map(b => ({
    start: b.start, end: b.end,
    text: b.words.map(w => w.text).join(' '),
    nWords: b.words.length,
  })),
  timelineScript: tlScript
}, null, 2), 'utf8');

console.log(`[captions] ${words.length} words â†’ ${blocks.length} blocks`);
console.log(`[captions] HTML â†’ ${outHtml}`);
console.log(`[captions] meta â†’ ${outMeta}`);


