# Línea base protegida de Video Studio V2

Esta línea base congela el sistema de vídeo que ya funcionaba antes de añadir
las herramientas V2. La adaptación es aditiva: los archivos anteriores no se
modifican ni se eliminan.

## Crear la fotografía inicial

Ejecutar una sola vez, antes de implementar las nuevas piezas:

```powershell
node .\tools\adaptation-v2\verify-protected-baseline.mjs create
```

## Comprobar que lo anterior sigue intacto

Ejecutar antes y después de cada fase:

```powershell
node .\tools\adaptation-v2\verify-protected-baseline.mjs verify
```

La comprobación protege la marca, los recursos, los scripts, los proyectos y
plantillas de vídeo, las skills técnicas existentes y los dos agentes antiguos.
Ignora únicamente salidas generadas y dependencias reconstruibles, como
`renders`, `node_modules`, `dist`, miniaturas y cachés de ondas de audio.

Los archivos nuevos están permitidos. Si un archivo protegido cambia o
desaparece, la comprobación falla y muestra su ruta.
