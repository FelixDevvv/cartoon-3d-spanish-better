# Claude Animated Shorts

La skill gratuita de Claude del vídeo **"How to Make Viral Animated Shorts Using Claude (Full Workflow)"**.

Crea cortos animados verticales de historia de 55-70 s: personajes 2D en un mundo 3D colorido, con contornos de tinta, un pueblo pintado, desenfoque de lente, cámaras deslizantes, una partitura de marcha y efectos de sonido. Todo se renderiza con three.js dentro de Remotion en tu propio PC, sin generador de vídeo con IA.

Probado en **The Bridge That Fell for a Song**, un corto de 67 s sobre el puente de Broughton de 1831.

## Qué contiene

| Ruta | Qué es |
|---|---|
| `SKILL.md` | La skill: el pipeline completo, cada regla, cada corrección y los valores finales del look |
| `templates/bridge/` | El código fuente completo del corto del puente: mundo, personajes, tinta, desenfoque de lente, etalonaje, historia/cámara |
| `templates/audio/` | El sonido sintetizado: SFX, música de marcha, la mezcla con ducking y sonoridad |
| `templates/scripts/` | Stills, hojas comparativas lado a lado, fusión de tomas y ayudas de control de calidad fotograma a fotograma |
| `references/STYLE_BIBLE.md` | La fórmula de guion y visual medida a partir de 20 cortos de referencia |
| `references/reports/` | Siete informes medidos: movimiento, profundidad, texturas, personajes, iluminación, contornos, etalonaje |
| `references/frames/` | 38 fotogramas de referencia a tamaño completo (540x960) para comparar con tus fotogramas |
| `references/sheets/` | 20 hojas de contacto, una por corto de referencia, 60 fotogramas cada una (1.200 fotogramas) |

## Instalación

1. Copia esta carpeta a `~/.claude/skills/cartoon-3d-short/` (clónala ahí o descarga el ZIP).
2. Necesitas [Remotion](https://www.remotion.dev/) con `@remotion/three`, además de Node, Python 3 y ffmpeg.
3. En Claude Code, di: *"Use the cartoon short skill and make a short about …"*.

Claude entonces sigue `SKILL.md`: tema y datos, luego guion, luego voz, luego el plan de planos en `story.ts`, luego stills, luego renders. Los agentes comparan tus fotogramas con los informes y los fotogramas, y obtienes el render final en 2K y la mezcla de sonido.

## Notas

- Configura `REMOTION_TMP` a una carpeta en un disco grande. Cada bundle de Remotion copia `public/` (~1,3 GB) a la carpeta temporal.
- La historia, los personajes y la voz siempre deben ser tuyos. Usa las referencias para el look, no para el contenido.

## Licencia

El código y la documentación son MIT (ver `LICENSE`). Los fotogramas de referencia se incluyen solo para estudio de estilo.
