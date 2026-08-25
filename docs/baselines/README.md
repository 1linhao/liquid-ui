# Implementation baselines

## Material baseline

- Upstream: `leefanv/liqui-design`
- Commit: `db2f98a436ad4ed47a713938ae3f4ca9a7880599`
- License at that commit: MIT
- Reviewed sources: Glass handbook, `packages/glass`, and `apps/www/e2e/glass.ts`

The implementation preserves these architectural invariants:

1. blur/saturation and displacement use separate backdrop layers;
2. tint, specular, shine, and content are explicit layers;
3. filters are registered once per document and deduplicated;
4. maps and filters use bounded LRU caches;
5. layout dimensions come from `offsetWidth`/`ResizeObserver`, never a
   transformed bounding rectangle;
6. Chromium refraction is progressive enhancement over a readable frost
   fallback;
7. large surfaces and dispersion are opt-in through semantic surface budgets.

## Functional baseline

- Trojan Panel parent: `eca21520031e733b234d7a5e7aedbb96274d3b81`
- Trojan Panel UI: `1d4e286b3395354ca956b7e4ac6bef8af764b5df`
- Viewports: 1440x900, 768x1024, 390x844
- Themes: light/dark by system or runtime selection
- Palettes: blue, violet, emerald, amber (palette only is persisted)

Trojan Panel supplies content, routes, permissions, and account actions through
an adapter. It is not a visual reference for the material renderer.
