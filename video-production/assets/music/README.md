# MÃºsica de fondo (underscore/pad) â€” video-studio

Capa distinta de los SFX: `data-volume` ~0.15 (MOTION_PHILOSOPHY Â§2.7), va por debajo
de la voz. **Los `.wav` estÃ¡n gitignored** (audio pesado, local/Drive); este
`music-manifest.json` SÃ se versiona como Ã­ndice.

## Schema de `music-manifest.json`

`tracks[<id>]`: `file`, `duration` (s), `mood`, `energy` (low|mid|high),
`bpm` (number|null), `loopable` (bool), `use_for` (string[]), `license`, `source`.

## Multi-track por proyecto + crossfades

Un video puede usar varios tracks segÃºn el momento. NO se automatiza volumen en el
engine â€” se **hornea un bed Ãºnico** con ffmpeg. Cada proyecto declara su plan en
`<proyecto>/music-plan.json`:

```json
[ { "track": "majestic-harmony", "start": 0,  "fade_in": 1.5, "fade_out": 2 },
  { "track": "epic-inspire",     "start": 28, "fade_in": 2,   "fade_out": 3 } ]
```

`node scripts/music-bed.mjs --plan <proyecto>/music-plan.json --out <proyecto>/assets/music-bed.wav`
produce un solo `.wav`. Dos tracks que se solapan con `fade_out`/`fade_in` matcheados =
crossfade. Ese bed entra como UN `<audio data-volume="0.15" data-layer="music">`.

