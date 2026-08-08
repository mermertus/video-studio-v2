# Brief - Video 2

Estado: en edicion, a partir de `assets/source/source.mp4` (talking head real de Maria).

## Objetivo

Editar el talking head sobre "por que no vende tu campana de Meta Ads" con overlays de marca y subtitulos, sin tapar el rostro. Tipo B (espejo + alta conversion): diagnostico directo de las causas reales de que una campana no convierta.

## Formato

- Canvas: 1080x1920.
- FPS: 25 (nativo del video fuente).
- Duracion: 64.56s.
- Uso: Reel / Short vertical.

## Fuente

- Video: `assets/source/source.mp4` (plano unico, talking head, 1080x1920, 25fps).
- Transcripcion: generada con faster-whisper (medium, es) para subtitulos verbatim.

## Marca

- Fuente de verdad: `../../DESIGN.maria-brand.md`.
- Tokens: `assets/maria-tokens.css`.
- Reglas HyperFrames: `../../../brand/hyperframes/HYPERFRAMES-BRAND-RULES.md`.

## Estructura (segun transcripcion real, modelo medium)

1. Hook (0-4.12s): "Tus campañas no venden y Meta seguramente no sea el problema."
2. Desarrollo (4.68-39.36s): el error comun es tocar segmentacion primero. Recorre las 4 causas reales: audiencia/oferta, mensaje, camino de compra (creatividad + landing + leads), oferta.
3. Prueba / Metodo (40.08-59.58s): checklist de revision antes de tocar campana (oferta, mensaje, creatividades, proceso de compra, tecnica).
4. CTA (60.06-63.76s): "Si quieres aprender como hacerlo bien y escalar tu negocio, sigueme."

## Edicion aplicada (v3 - split-screen, segun skill split-screen-panels)

- Face-wrapper con 2 modos: FULL (hook 0-4.7s, verdict+CTA 57.3-64.56s, cara ocupa todo el frame) y TOP_HALF (11.04-57.12s, cara centrada en el 1080x960 superior). Transicion expo.inOut 0.45s, disparada 0.20s antes de cada escena (choreography del skill local).
- 5 paneles "media pantalla" (bottom-half, 1080x960, mockups tipo dashboard con datos ficticios ilustrativos, no capturas reales del cliente):
  1. Audiencia (Meta Ads Manager: alcance/CTR/compras).
  2. Mensaje (comparacion "dices" vs "el necesita").
  3. Camino de compra (embudo con barras: alcance -> clics -> leads -> ventas, leads en Merlot).
  4. Oferta (dos preguntas sin respuesta clara).
  5. Checklist de 5 puntos ("Revisa esto primero").
- Subtitulos: rail completo abajo en escenas FULL; en escenas TOP_HALF, franja compacta con scrim justo en el borde superior del panel (no flota sobre el collar). Verbatim (sin fabricar texto), con acentos de color (mark Merlot / span azul) puntuales.
- SFX: swoosh en cada transicion de modo de cara y en cambios de panel grandes, pop en cambios menores, ding en el verdict (volumen 0.35-0.4, formula start = peak - transient_offset).
- Brand tag + barra de progreso persistentes arriba.
- Paletas y tipografia: Source Serif 4 (titulares), Work Sans (captions), IBM Plex Mono (labels/dashboard), colores maria-tokens.css.

## Nota sobre los paneles

Los mockups de dashboard (Meta Ads Manager, embudo) usan datos ilustrativos genericos para representar el concepto, no metricas reales de ningun cliente. Si se dispone de capturas reales de campana, se recomienda sustituir estos mockups por las capturas reales.

## Pendiente

- [ ] Aprobacion de la consultora antes de render final.
