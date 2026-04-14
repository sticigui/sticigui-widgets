---
title: SticiGui Interactive Widgets
---

This repository contains a collection of interactive widgets to help the reader explore statistical concepts through hands-on visualization and experimentation. These widgets are part of [SticiGui](https://www.stat.berkeley.edu/~start/SticiGui), an interactive statistics textbook developed by Philip Stark. The original widgets have been reimagined as modern web components using anywidget.

## Features

- Interactively adjust parameters and see results update in real-time
- Built with ES modules, D3.js, and web standards
- Keyboard navigable with proper ARIA labels
- Seeded random number generators for consistent results
- Automatically adapt to light/dark mode

## Using the Widgets

### In MyST Markdown

````markdown
```{anywidget} ./sticigui-widgets/widgets/binhist/dist/widget.mjs
{
  "n": 20,
  "p": 0.5
}
```
````

### In HTML

```html
<script type="module">
  import widget from './sticigui-widgets/widgets/binhist/dist/widget.mjs';
  widget.render({ model, el: document.getElementById('container') });
</script>
```

## Widgets

### Distributions

::::{grid} 1 1 2 3

:::{card} Binomial Histogram
:link: widgets/binhist.md
Binomial distribution probability mass function with optional normal approximation overlay.
:::

:::{card} Distribution Viewer
:link: widgets/distribution-viewer.md
Normal, t, chi-square, and F distributions with adjustable parameters.
:::

:::{card} Normal Approximation
:link: widgets/norm-approx.md
Side-by-side comparison of binomial and normal distributions.
:::

::::

### Data Visualization

::::{grid} 1 1 2 3

:::{card} Histogram
:link: widgets/histogram.md
Data histogram with adjustable bin width and optional normal overlay.
:::

:::{card} Histogram Control
:link: widgets/hist-control.md
Histogram with data filtering and subset comparison.
:::

:::{card} Scatterplot
:link: widgets/scatterplot.md
Bivariate data plots with regression lines and residual plots. Supports external datasets.
:::

:::{card} Correlation
:link: widgets/correlation.md
Generate bivariate normal data with specified correlation coefficient.
:::

::::

### Inference

::::{grid} 1 1 2 3

:::{card} Confidence Intervals
:link: widgets/confidence-intervals.md
Repeated sampling simulation showing confidence interval coverage rates.
:::

:::{card} Sampling Distribution
:link: widgets/sampling-dist.md
Sampling distribution of the mean with various population shapes.
:::

::::

### Probability

::::{grid} 1 1 2 3

:::{card} Venn Diagram
:link: widgets/venn.md
Probability visualization with two or three draggable sets.
:::

:::{card} Probability Calculator
:link: widgets/prob-calc.md
Compute probabilities and quantiles for common distributions.
:::

::::

### Simulations

::::{grid} 1 1 2 3

:::{card} Law of Large Numbers
:link: widgets/lln.md
Convergence of sample proportion to true probability.
:::

::::

### Calculators

::::{grid} 1 1 2 3

:::{card} Statistics Calculator
:link: widgets/stats-calc.md
Scientific calculator with combinatorics and statistical functions.
:::

::::

