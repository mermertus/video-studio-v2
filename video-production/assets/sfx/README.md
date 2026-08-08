# LibrerÃ­a de SFX compartida â€” video-studio

Source of truth de naming + `transient_offset` de cada efecto. Los `.wav` se
**copian** al `assets/` de cada proyecto al usarse (portabilidad); este manifest
es el Ã­ndice compartido.

## Schema de `sfx-manifest.json`

`samples[<id>]`:
- `file` (string): nombre del archivo en esta carpeta.
- `duration` (number, s): duraciÃ³n total del sample.
- `transient_offset` (number, s): cuÃ¡ndo arranca el golpe audible dentro del archivo.
  Es el dato que hace el sync exacto. Medido con `scripts/sfx-measure.mjs`.
- `category` (string): `transition | impact | reveal | ui | riser | drop`.
- `default_volume` (number): 0.2 default para SFX (ver MOTION_PHILOSOPHY Â§2.7).
- `use_for` (string[]): cues donde aplica (whip-up, card-land, etc.).
- `license` (string): origen + licencia (CC0 / freesound id).
- `source` (string): `curated` | `generated`.

## FÃ³rmula de sync

audio `data-start` = (timestamp del peak visual de la transiciÃ³n) âˆ’ `transient_offset`

El `<audio>` NO lleva `class="clip"`. Track index â‰¥ 40.

## SFX de recursos especÃ­ficos

- `whoosh-tuck`: transiciÃ³n `pip-llamada`; acompaÃ±a la reducciÃ³n de la imagen principal de MarÃ­a hacia una ventana abajo derecha tipo llamada/WhatsApp. Usar corto, audible y sin tapar sÃ­labas. El golpe debe caer cuando la ventana termina de encajar.

