# Instagram follow card

Componente maestro reutilizable para los cierres de vídeo de María Bejarano.

## Fuente de verdad

Esta carpeta es la única fuente editable del grafismo. No editar las copias generadas dentro de
`video-production/video-projects/*`.

Incluye:

- `maria-follow-profile-cta.html`: subcomposición HyperFrames.
- `original/`: versión original aprobada, conservada intacta y fuera del flujo de generación.
- `preview-seguir.png` y `preview-siguiendo.png`: fotogramas visuales verificados.
- `assets/maria-profile-reference.png`: referencia visual del perfil.
- `assets/fonts/`: tipografías congeladas.
- `assets/sfx/follow-whoosh.wav`: entrada del degradado y tarjeta.
- `assets/sfx/follow-click.wav`: clic del botón.

## Uso

Desde `video-production/`:

```powershell
node scripts/apply-maria-follow-card.mjs video-projects/<proyecto>
```

El automatismo busca `sígueme` en los últimos 10 segundos, coloca el grafismo 1,5 segundos antes,
lo mantiene hasta el último fotograma, copia una instancia renderizable al proyecto y desplaza los
subtítulos coincidentes fuera de la zona reservada.
