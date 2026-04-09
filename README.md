# SticiGui Widgets

This repository contains interactive statistics widgets ported from Philip Stark's [SticiGui](https://www.stat.berkeley.edu/~stark/SticiGui/) textbook. They are anywidget-compatible ESM bundles for 14 interactive statistics applets. The widgets are designed to work in MyST Markdown websites.

## Overview

- 14 interactive widgets for statistics education
- Built with D3.js and jstat, bundled as ES modules
- Runs entirely in the browser (no server required)
- Supports keyboard navigation and light/dark themes
- Uses seeded random number generation for reproducibility

## Building

### Install dependencies

```bash
npm install
```

### Build all widgets

```bash
npm run build
```

This produces optimized ESM bundles in `widgets/*/dist/widget.mjs`.

### Build in watch mode (coming soon)

```bash
npm run build:watch
```

### Run tests

```bash
npm test
```

## Usage in MyST

Once built, widgets can be embedded in MyST Markdown using the `anywidget` directive:

```markdown
\```{anywidget} ./widgets/binhist/dist/widget.mjs
{"n": 10, "p": 0.5, "lo": 3, "hi": 7, "show_normal": false}
\```
```

## Widget Inventory

### Distribution Viewers
- `distribution-viewer.mjs` — Normal, Chi-Square, and t-distribution probability calculators

### Histogram Tools
- `binhist.mjs` — Binomial distribution histogram with normal approximation
- `histogram.mjs` — Data histogram with highlight regions
- `norm-approx.mjs` — Normal approximation to data

### Calculators
- `prob-calc.mjs` — Multi-distribution probability calculator
- `stats-calc.mjs` — Scientific calculator with statistical functions

### Simulations
- `lln.mjs` — Law of Large Numbers demonstration
- `confidence-intervals.mjs` — Confidence interval simulation
- `sampling-dist.mjs` — Sampling distribution simulator

### Scatterplot Family
- `correlation.mjs` — Correlation and regression explorer
- `scatterplot.mjs` — Dataset scatterplot with annotations
- `hist-control.mjs` — Variable control histogram

### Venn Diagrams
- `venn2.mjs` — Two-set Venn diagram
- `venn3.mjs` — Three-set Venn diagram

## References

- [Original SticiGui](https://www.stat.berkeley.edu/~stark/SticiGui/)
- [MyST Markdown](https://mystmd.org)
- [MyST anywidget example](https://github.com/jupyter-book/example-js-anywidget)
- [D3](https://d3js.org)
- [jstat](http://jstat.github.io/)
