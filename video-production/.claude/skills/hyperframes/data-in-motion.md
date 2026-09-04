# Data in Motion

Light guidance for data and stats in video compositions. The [house style](./house-style.md) handles aesthetics â€” this just addresses data-specific pitfalls.

## Visual Continuity

When successive stats belong to the same concept (Q1 â†’ Q2 â†’ Q3 â†’ Q4, or three metrics for the same product), keep them in the same visual space with the same aesthetic. Only the VALUE changes. An aesthetic change should signal a new concept, not just a new number.

## Numbers Need Visual Weight

A number on its own floats in empty space. Pair every metric with a visual element that gives it presence â€” a proportional fill bar, a background color shift, a shape that represents the value, a progress ring. The visual doesn't need to be a chart â€” it just needs to fill the frame and make the data feel tangible rather than just text on a background.

## Avoid Web Patterns

- **No pie charts** â€” hard to compare, looks like PowerPoint
- **No multi-axis charts** â€” viewer can't study intersections in a 3-second window
- **No 6-panel dashboards** â€” 2-3 related metrics side-by-side is fine, 6+ is a web pattern
- **No gridlines, tick marks, or legends** â€” visual noise that adds nothing in motion
- **No chart library output** â€” build with GSAP + SVG/CSS, not D3 or Chart.js

