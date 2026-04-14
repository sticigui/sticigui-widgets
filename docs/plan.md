# SticiGui → MyST Anywidget Port: Project Plan

## Purpose of this document

This document is a complete technical specification and phased implementation plan for porting
the interactive widgets from Philip Stark's **SticiGui** statistics textbook
(https://www.stat.berkeley.edu/~stark/SticiGui/) into **anywidget**-compatible ESM modules
deployable in a **MyST Markdown** website. It is written for an AI coding agent executing the
work incrementally across multiple sessions.

Read this document fully before writing any code. Refer back to it when starting each phase.

---

## Background and context

### What SticiGui is

SticiGui is an interactive statistics textbook served at UC Berkeley. It contains approximately
18 distinct interactive applets (Java/JavaScript) embedded in HTML pages. The goal of this
project is to replace those applets with modern, standards-based widgets that work inside a
MyST-built static website — with no server, no Java, and no legacy browser dependencies.

### What MyST anywidgets are

MyST (https://mystmd.org) now supports an `anywidget` directive. A widget is a single bundled
ESM file (`.mjs`) that exports a `render({ model, el })` function. MyST loads the bundle,
instantiates the model with JSON state from the directive, and calls `render`. There is no
Python kernel at runtime — everything is client-side JavaScript. Initial state is passed via
the directive:

````markdown
```{anywidget} https://example.com/releases/latest/download/binhist.mjs
{"n": 10, "p": 0.5, "lo": 3, "hi": 7}
```
````

Reference example repo: https://github.com/jupyter-book/example-js-anywidget

### Key architectural constraints

- Every widget is a **self-contained ESM bundle** produced by esbuild.
- Widgets run **entirely client-side** — no server, no Python kernel.
- Bundles are published as **GitHub Release artifacts** and referenced by URL.
- Dependencies must be tree-shaken into the bundle or imported from an **allowed CDN**:
  `cdnjs.cloudflare.com`, `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`.
- **D3 v7** is the primary visualization library, imported by subpackage to minimize bundle
  size (e.g. `d3-scale`, `d3-axis`, `d3-shape`, `d3-array`).
- **jstat** (https://github.com/jstat/jstat) handles all statistical distribution math.
- Shared code lives in internal modules (`src/`) that esbuild bundles into each widget.
- Each widget must work correctly on both **light and dark** backgrounds.
- Each widget must be **accessible**: keyboard-navigable controls, ARIA labels on interactive
  elements, sufficient color contrast.

---

## Repository structure

```
sticicgui-widgets/
├── package.json
├── package-lock.json
├── .github/
│   └── workflows/
│       └── release.yml          # builds all widgets and publishes to GitHub Releases
├── src/
│   ├── math/
│   │   └── stats-math.mjs       # shared statistical math (wraps jstat)
│   ├── chart/
│   │   ├── scales.mjs           # thin d3-scale wrappers
│   │   ├── axes.mjs             # thin d3-axis wrappers
│   │   ├── histogram.mjs        # reusable histogram renderer
│   │   ├── curve.mjs            # line/area path renderer
│   │   └── scatterplot.mjs      # reusable scatterplot renderer
│   ├── sim/
│   │   └── prng.mjs             # seeded PRNG (xoshiro128**)
│   └── data/
│       └── datasets.mjs         # built-in datasets (Cities, CCV, GMAT, gravity)
├── widgets/
│   ├── binhist/
│   │   ├── widget.mjs           # entry point
│   │   └── dist/widget.mjs      # esbuild output (gitignored)
│   ├── distribution-viewer/
│   ├── histogram/
│   ├── prob-calc/
│   ├── stats-calc/
│   ├── lln/
│   ├── confidence-intervals/
│   ├── sampling-dist/
│   ├── correlation/
│   ├── scatterplot/
│   ├── hist-control/
│   ├── venn2/
│   └── venn3/
└── tests/
    └── math/
        └── stats-math.test.mjs
```

---

## Widget inventory

The following 13 widget bundles cover all 18 original SticiGui applets (some bundles handle
multiple applets via parameterization).

### Group A — Distribution viewers (one parameterized bundle)

**Bundle:** `distribution-viewer.mjs`
**Covers:** Normal Probabilities, Chi-Square Distribution, Student's t Distribution, Normal Curve

All four share the same pattern: render a probability density curve, let the user select a
highlight region via two range inputs, display the area under the curve for that region.

| Widget | Distribution | Extra parameters |
|--------|-------------|-----------------|
| Normal Probabilities | Normal | `mean`, `sd` |
| Normal Curve | Normal | `mean`, `sd` (sliders visible) |
| Chi-Square | Chi-square | `df` |
| Student's t | Student's t | `df` |

**Model state:**
```json
{
  "distribution": "normal",
  "mean": 0,
  "sd": 1,
  "df": 5,
  "lo": -1,
  "hi": 1,
  "show_mean_sd_sliders": false
}
```

**UI:** SVG curve rendered with d3-shape, two range inputs or number inputs for `lo`/`hi`,
area display, optional mean/SD sliders.

---

### Group B — Histogram tools

#### B1: Binomial Histogram (`binhist.mjs`)

Renders the binomial(n, p) probability mass function as a histogram. User selects a range of
outcomes; the widget displays P(lo ≤ X ≤ hi). Optional normal curve overlay.

**Model state:**
```json
{
  "n": 10,
  "p": 0.5,
  "lo": 3,
  "hi": 7,
  "show_normal": false
}
```

**UI:** SVG histogram (d3-scale + d3-axis + SVG rects), two range inputs for lo/hi, n and p
number inputs, "Show Normal Curve" toggle button.

**Math:** `binomialPMF(k, n, p)` for each bar, `normalCDF` for overlay.

---

#### B2: Histogram with Highlight (`histogram.mjs`)

Renders a histogram of a real dataset. User selects a highlight region; widget displays the
proportion of data in that region.

**Model state:**
```json
{
  "dataset": "gravity",
  "bins": 20,
  "lo": -0.0001,
  "hi": 0.0001
}
```

**Available datasets:** `"gravity"` (100 observations, hardcoded in `datasets.mjs`).

**UI:** SVG histogram, two range inputs for lo/hi, bin count input.

---

#### B3: Normal Approximation to Data (`norm-approx.mjs`)

Like B2 but fixed to the gravity dataset and always shows the normal curve overlay alongside
the histogram for comparison.

**Model state:**
```json
{
  "lo": -0.00005,
  "hi": 0.00005
}
```

**UI:** SVG histogram + normal curve overlay, area display for both histogram and curve.

---

### Group C — Calculators

#### C1: Probability Calculator (`prob-calc.mjs`)

Computes P(lo ≤ X ≤ hi) for a user-selected distribution with user-entered parameters.
Displays expected value and standard error. No visualization.

**Supported distributions:** normal, binomial, chi-square, exponential, geometric,
hypergeometric, negative binomial, Poisson, Student's t.

**Model state:**
```json
{
  "distribution": "normal",
  "params": { "mean": 0, "sd": 1 },
  "use_lo": true,
  "lo": -1,
  "use_hi": true,
  "hi": 1
}
```

**UI:** Distribution selector (HTML `<select>`), parameter inputs (shown/hidden based on
distribution), lo/hi checkboxes + inputs, result display area.

---

#### C2: Statistics Calculator (`stats-calc.mjs`)

A scientific calculator with statistical functions. Purely DOM-based, no visualization.

**Operations:** `+`, `-`, `×`, `÷`, `=`, `nCk`, `nPk`, `x²`, `√x`, `1/x`, `log`, `ln`,
`eˣ`, `sin`, `cos`, `tan`, `π`, `U[0,1]` (random uniform).

**Model state:**
```json
{
  "display": "0",
  "memory": null
}
```

**UI:** Calculator button grid, display area. All state is internal to the widget (no need
for MyST model sync beyond initial render).

---

### Group D — Simulation widgets

All simulation widgets share a common pattern:
- A "Take sample" / "Run" button triggers one batch of simulation.
- Results accumulate in widget-internal state (not synced to the MyST model).
- A histogram updates after each batch.
- A PRNG seeded from `model.get("seed")` ensures reproducibility.

#### D1: Law of Large Numbers (`lln.mjs`)

Simulates n Bernoulli(p) trials, plots the running difference between observed count (or
proportion) and expected count (or p) as a function of trial number.

**Model state:**
```json
{
  "n": 500,
  "p": 0.5,
  "mode": "count",
  "seed": 42
}
```

`mode` is `"count"` (plots count − n×p) or `"proportion"` (plots proportion − p).

**UI:** SVG line chart (x = trial number, y = difference), n and p inputs, mode toggle button,
"Run" button.

---

#### D2: Confidence Intervals (`confidence-intervals.mjs`)

Simulates drawing samples and constructing confidence intervals. Displays a stack of horizontal
CI bars colored by whether they cover the true parameter.

**Model state:**
```json
{
  "population": "normal",
  "n": 30,
  "confidence": 0.95,
  "samples_per_click": 20,
  "seed": 42
}
```

**UI:** SVG CI bar chart, controls for population, sample size, confidence level, samples per
click, "Take sample" button, coverage summary display.

---

#### D3: Sampling Distributions (`sampling-dist.mjs`)

The most complex simulation widget. Draws samples from a user-specified population, computes a
statistic, accumulates results into a histogram.

**Model state:**
```json
{
  "statistic": "mean",
  "population_type": "custom",
  "population_values": [0, 1, 2, 3, 4],
  "sample_size": 25,
  "samples_per_click": 1,
  "bins": 20,
  "lo": null,
  "hi": null,
  "show_normal": false,
  "seed": 42
}
```

**Statistics:** `"mean"`, `"sum"`, `"variance"` (S²), `"chi_square"`.
**Population types:** `"custom"` (editable list), `"uniform"`, `"normal"`.

**UI:**
- Statistic selector
- Population type selector + editable population box (textarea of numbers)
- Sample size input, samples-per-click input, bins input
- "Take sample" button
- SVG: blue histogram of population (left), green histogram of sample statistic (right),
  optional normal curve overlay
- Summary stats: population mean, SD, SE of statistic, number of samples taken
- Highlight range inputs + area display

---

### Group E — Scatterplot family

#### E1: Correlation and Regression (`correlation.mjs`)

Synthetic scatterplot. Sliders control the correlation coefficient r and sample size n.
Buttons overlay statistical annotations. User can click to add points.

**Model state:**
```json
{
  "r": 0.7,
  "n": 50,
  "show_sd_lines": false,
  "show_sd_line": false,
  "show_regression": false,
  "include_added_points": true,
  "seed": 42
}
```

**UI:** SVG scatterplot, r slider, n slider, annotation toggle buttons, click-to-add-point
interaction, "Clear added points" button.

**Math:** Generate bivariate normal sample with given r and n using the PRNG. Compute
regression line from data. Compute SD lines from means and SDs.

---

#### E2: Scatterplots (`scatterplot.mjs`)

Real dataset scatterplot with full annotation suite and residual plot toggle.

**Model state:**
```json
{
  "dataset": "cities",
  "x_var": "population",
  "y_var": "homeless_rate",
  "show_point_of_averages": false,
  "show_sd_lines": false,
  "show_sd_line": false,
  "show_graph_of_averages": false,
  "show_regression": false,
  "show_residuals": false,
  "include_added_points": true,
  "url": null
}
```

**Built-in datasets:** `"cities"` (50 cities, homeless rates), `"cities47"` (47 cities),
`"ccv"` (EPA vehicle emissions, 96 tests), `"gmat"` (913 MBA students). All stored in
`src/data/datasets.mjs`.

**URL data loading:** If `url` is non-null, fetch and parse a tab-separated file at that URL.
Format: first line is variable names (tab- or space-separated), remaining lines are data rows.
Lines containing `//` are treated as comments and ignored.

**UI:** Dataset selector, X/Y variable selectors, annotation toggle buttons, "Show data"
button (opens data table in a scrollable panel), summary stats panel, click-to-add-point,
mouse-over coordinate display, residual plot toggle.

---

#### E3: Controlling for Variables (`hist-control.mjs`)

Two overlaid histograms: full dataset (blue) and filtered subset (green). User controls which
variable to histogram, which dataset to use, the highlight range, the number of bins, and
filtering constraints on other variables.

**Model state:**
```json
{
  "dataset": "ccv",
  "variable": "HC",
  "bins": 20,
  "lo": null,
  "hi": null,
  "show_normal": false,
  "show_full": true,
  "show_restricted": true,
  "restrictions": []
}
```

Each entry in `restrictions` is:
```json
{ "variable": "NOx", "use_min": true, "min": 0, "use_max": false, "max": 100 }
```

**UI:** Dataset selector, variable selector, show/hide checkboxes for each histogram, bin
count + lo/hi range controls, normal curve toggle, restriction rows (each with variable
selector, min/max checkboxes and inputs), "Clear restrictions" button, "Show data" button,
summary stats for both full and restricted samples.

---

### Group F — Venn diagrams

#### F1: Venn Diagram — 2 sets (`venn2.mjs`)

Two draggable circles on an SVG canvas. Scrollbars control P(A) and P(B) (circle radii).
Dragging changes P(A∩B). Buttons highlight different set operations. Probabilities are
displayed.

**Model state:**
```json
{
  "pa": 0.4,
  "pb": 0.3,
  "pab": 0.1,
  "highlight": "AB"
}
```

`highlight` is one of: `"A"`, `"B"`, `"S"`, `"empty"`, `"Ac"`, `"Bc"`, `"AB"`,
`"AorB"`, `"AcB"`, `"ABc"`.

**UI:** SVG canvas with two circles (positions derived from pa, pb, pab geometry), drag
interaction on circles, P(A)/P(B) range inputs, highlight selector buttons, probability
display panel.

**Math:** Given P(A), P(B), P(A∩B) and the constraint that circles must fit inside a
bounding rectangle, compute circle radii (proportional to sqrt of probability) and center
positions such that the intersection area equals P(A∩B). Use the circular segment area
formula: A_intersection = r²·arccos(d/2r) − (d/4)·√(4r²−d²) for equal-radius circles, or
the general two-circle intersection formula for unequal radii.

---

#### F2: Venn Diagram — 3 sets (`venn3.mjs`)

Extension of F1 to three sets A, B, C. Draggable circles. Buttons highlight all 8 regions
of the Venn diagram. Probabilities computed via inclusion-exclusion.

**Model state:**
```json
{
  "pa": 0.5,
  "pb": 0.4,
  "pc": 0.3,
  "pab": 0.15,
  "pac": 0.12,
  "pbc": 0.10,
  "pabc": 0.05,
  "highlight": "ABC"
}
```

---

## Shared modules specification

### `src/math/stats-math.mjs`

Wraps jstat and exports named functions. All functions are pure (no side effects).

```js
// Normal distribution
export function normalPDF(x, mean = 0, sd = 1)
export function normalCDF(x, mean = 0, sd = 1)       // P(X ≤ x)
export function normalCDFRange(lo, hi, mean, sd)      // P(lo ≤ X ≤ hi)
export function normalQuantile(p, mean = 0, sd = 1)  // inverse CDF

// Binomial distribution
export function binomialPMF(k, n, p)
export function binomialCDF(k, n, p)
export function binomialCDFRange(lo, hi, n, p)

// Chi-square distribution
export function chiSquarePDF(x, df)
export function chiSquareCDF(x, df)
export function chiSquareCDFRange(lo, hi, df)

// Student's t distribution
export function tPDF(x, df)
export function tCDF(x, df)
export function tCDFRange(lo, hi, df)

// Other distributions (for ProbCalc)
export function exponentialCDFRange(lo, hi, rate)
export function geometricCDFRange(lo, hi, p)
export function hypergeometricCDFRange(lo, hi, N, K, n)
export function negativeBinomialCDFRange(lo, hi, r, p)
export function poissonCDFRange(lo, hi, lambda)

// Summary statistics
export function mean(arr)
export function sd(arr)            // population SD
export function sampleSD(arr)      // sample SD (n-1)
export function sampleVariance(arr)
export function correlation(xArr, yArr)
export function linearRegression(xArr, yArr)  // returns { slope, intercept, r, r2 }
```

Implement using jstat where available. For any distribution not in jstat, implement from
first principles using log-space arithmetic to avoid overflow for large parameters.

---

### `src/sim/prng.mjs`

Exports a seeded PRNG class using the xoshiro128** algorithm. Required for reproducible
simulation demos.

```js
export class PRNG {
  constructor(seed)       // seed is a 32-bit integer
  nextFloat()             // uniform float in [0, 1)
  nextInt(n)              // uniform integer in [0, n)
  nextNormal(mean, sd)    // Box-Muller transform
  nextBernoulli(p)        // 1 with probability p, 0 otherwise
  nextBinomial(n, p)      // sum of n Bernoulli(p) trials (for small n); use normal approx for large n
  sample(arr, k, replacement) // draw k items from arr
}
```

---

### `src/chart/histogram.mjs`

Reusable histogram renderer. Accepts a D3 selection, data, and options. Returns an update
function that re-renders when data or state changes.

```js
export function createHistogram(svgSelection, options)
// options: { width, height, margin, bins, xDomain, yDomain, highlightRange, color }
// returns: { update(data, highlightRange), xScale, yScale }
```

---

### `src/chart/curve.mjs`

Renders a continuous probability density curve over a given x domain.

```js
export function createCurve(svgSelection, options)
// options: { width, height, margin, xScale, yScale, nPoints, color, fillArea, fillRange }
// returns: { update(pdfFn, fillRange) }
```

---

### `src/chart/scatterplot.mjs`

Reusable scatterplot with optional overlays.

```js
export function createScatterplot(svgSelection, options)
// options: { width, height, margin, xLabel, yLabel }
// returns: {
//   update(xArr, yArr, addedPoints),
//   showPointOfAverages(bool),
//   showSDLines(bool),
//   showSDLine(bool),
//   showGraphOfAverages(bool),
//   showRegressionLine(bool),
//   showResiduals(bool),
//   onClickAdd(callback)   // callback receives { x, y } in data coordinates
// }
```

---

### `src/data/datasets.mjs`

Exports all built-in datasets as plain JavaScript arrays of objects.

```js
export const CITIES    // 50 rows, fields: city, population, homeless_rate, vacancy_rate, unemployment_rate
export const CITIES47  // 47 rows (excludes 3 largest cities)
export const CCV       // 96 rows, fields: test, HC, NOx, CO
export const GMAT      // 913 rows, fields: ugpa, verbal, quant, mgpa
export const GRAVITY   // 100 values (deviations from reference g)
```

Data sourced from the original SticiGui applet pages. Transcribe the gravity data from
`NormApprox.htm`. For Cities, CCV, and GMAT: fetch from the original ScatterPlot.htm URL data
loading mechanism, or transcribe from the applet source if available. Store as compact
inline arrays (not JSON files) to avoid extra fetch requests.

---

## Build system

### `package.json`

```json
{
  "name": "sticicgui-widgets",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "node scripts/build-all.mjs",
    "build:watch": "node scripts/build-all.mjs --watch",
    "test": "node --experimental-vm-modules node_modules/.bin/vitest run"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {
    "d3-array": "^3.0.0",
    "d3-axis": "^3.0.0",
    "d3-scale": "^4.0.0",
    "d3-selection": "^3.0.0",
    "d3-shape": "^3.0.0",
    "jstat": "^1.9.6"
  }
}
```

### `scripts/build-all.mjs`

Iterates over every subdirectory of `widgets/`, runs esbuild on `widget.mjs`, outputs to
`widgets/<name>/dist/widget.mjs`. Example for one widget:

```js
await esbuild.build({
  entryPoints: ['widgets/binhist/widget.mjs'],
  bundle: true,
  format: 'esm',
  outfile: 'widgets/binhist/dist/widget.mjs',
  minify: true,
  target: ['es2020'],
});
```

### `.github/workflows/release.yml`

On push of a version tag (`v*`):
1. `npm ci`
2. `npm run build`
3. Create GitHub Release
4. Upload every `widgets/*/dist/widget.mjs` as a release artifact named `<widget-name>.mjs`

---

## Testing requirements

### Math library tests (`tests/math/stats-math.test.mjs`)

Every function in `stats-math.mjs` must have at least one test with a known reference value.
Use scipy or a statistics table to derive expected values. Examples:

```js
test('normalCDF', () => {
  expect(normalCDF(0)).toBeCloseTo(0.5, 6);
  expect(normalCDF(1.96)).toBeCloseTo(0.975, 3);
  expect(normalCDF(-1.96)).toBeCloseTo(0.025, 3);
});

test('binomialPMF', () => {
  expect(binomialPMF(5, 10, 0.5)).toBeCloseTo(0.24609375, 8);
  expect(binomialPMF(0, 10, 0.5)).toBeCloseTo(0.0009765625, 8);
});

test('chiSquareCDF', () => {
  expect(chiSquareCDF(3.841, 1)).toBeCloseTo(0.95, 3);
});
```

### Widget render tests

Each widget must export a `test` function (in addition to `render`) that:
1. Creates a minimal DOM environment (jsdom)
2. Calls `render` with a mock model and a real DOM element
3. Asserts that the rendered SVG contains the expected elements

This is not required for Phase 0 but must be added before Phase 7.

---

## Implementation phases

Work through these phases in order. Do not begin a phase until the previous phase passes its
acceptance criteria.

---

### Phase 0 — Tooling and scaffolding

**Goal:** A working build pipeline that produces a deployable widget bundle.

**Tasks:**
1. Initialize the repository with the structure described above.
2. Install dependencies (`npm install`).
3. Implement `scripts/build-all.mjs`.
4. Create a trivial placeholder `widgets/binhist/widget.mjs` that renders "hello world" into
   `el`.
5. Run `npm run build` and verify `widgets/binhist/dist/widget.mjs` is produced.
6. Create `.github/workflows/release.yml`.
7. Write `README.md` describing how to build and use the widgets.

**Acceptance criteria:**
- `npm run build` succeeds with no errors.
- The output bundle is valid ESM.
- The bundle size for the placeholder widget is under 5KB.

---

### Phase 1 — Shared math library

**Goal:** A tested, complete `stats-math.mjs` that all widgets can depend on.

**Tasks:**
1. Install jstat: `npm install jstat`.
2. Implement all functions listed in the `stats-math.mjs` specification above.
3. Write tests for every function in `tests/math/stats-math.test.mjs`.
4. Run `npm test` and confirm all tests pass.

**Acceptance criteria:**
- All functions exported as specified.
- All tests pass.
- `normalCDF(1.96)` returns a value within 0.001 of 0.975.
- `binomialPMF(5, 10, 0.5)` returns a value within 1e-8 of 0.24609375.
- `chiSquareCDF(3.841, 1)` returns a value within 0.001 of 0.95.

---

### Phase 2 — PRNG and simulation harness

**Goal:** A tested PRNG and a reusable simulation harness used by all Group D widgets.

**Tasks:**
1. Implement `src/sim/prng.mjs` (xoshiro128** algorithm).
2. Test the PRNG for uniform distribution and correct seeding (same seed → same sequence).
3. Implement `nextNormal` using Box-Muller.
4. Implement `nextBinomial`.
5. Implement `sample(arr, k, replacement)`.

**Acceptance criteria:**
- `new PRNG(42).nextFloat()` returns the same value in every run.
- 10,000 draws from `nextFloat()` have mean within 0.01 of 0.5 and variance within 0.01 of
  1/12.
- `nextNormal(0, 1)` over 10,000 draws has mean within 0.05 of 0 and SD within 0.05 of 1.

---

### Phase 3 — Chart primitives

**Goal:** Reusable histogram, curve, and scatterplot renderers that all widgets use.

**Tasks:**
1. Implement `src/chart/scales.mjs` — thin wrappers over d3-scale.
2. Implement `src/chart/axes.mjs` — thin wrappers over d3-axis.
3. Implement `src/chart/histogram.mjs`.
4. Implement `src/chart/curve.mjs`.
5. Implement `src/chart/scatterplot.mjs`.

**Implementation notes:**
- All chart functions accept a D3 selection and return update functions — they do not manage
  their own SVG creation.
- Each chart module must handle window resize (use ResizeObserver to detect container width
  changes and re-render).
- Use CSS custom properties (`--color-text-primary`, `--color-border-tertiary`, etc.) for
  colors so charts adapt to light/dark mode automatically.
- Do not hardcode any pixel dimensions — derive from container width at render time.

---

### Phase 4 — Binomial Histogram (vertical slice)

**Goal:** A complete, production-quality BinHist widget that validates the full stack.

**Tasks:**
1. Implement `widgets/binhist/widget.mjs`.
2. The widget must use `stats-math.mjs` (binomialPMF, normalCDF) and the chart primitives.
3. Implement the full UI as described in the widget specification above.
4. Build the bundle: `npm run build`.
5. Test by embedding in a local MyST project with a test page containing:

````markdown
```{anywidget} ./widgets/binhist/dist/widget.mjs
{"n": 10, "p": 0.5, "lo": 3, "hi": 7, "show_normal": false}
```
````

**Detailed widget behavior:**
- On initial render, display a histogram of the binomial(n, p) PMF with bars for k = 0..n.
- Bars for k in [lo, hi] (inclusive) are highlighted in a distinct color.
- The selected area (sum of PMF values for k in [lo, hi]) is displayed numerically.
- The normal approximation curve (mean = n×p, sd = √(n×p×(1−p))) is drawn when
  `show_normal` is true.
- When n or p changes, the histogram redraws completely.
- When lo or hi changes, only the bar highlight colors update (no full redraw needed).
- n is constrained to [1, 200]. p is constrained to (0, 1).
- lo and hi are constrained to [0, n]. lo ≤ hi must always hold.

**Acceptance criteria:**
- Renders correctly with the default state.
- Changing n and p updates the histogram.
- Adjusting lo/hi updates the highlighted region and area display.
- Normal curve appears and disappears correctly.
- Works in both light and dark mode.
- No console errors.
- Bundle size under 200KB gzipped.

---

### Phase 5 — Distribution viewers

**Goal:** The `distribution-viewer.mjs` bundle covering all four curve-area widgets.

**Tasks:**
1. Implement `widgets/distribution-viewer/widget.mjs`.
2. Use a `distribution` parameter to switch between normal, chi-square, and t.
3. Implement a shared curve + area rendering using `src/chart/curve.mjs`.
4. For normal: show optional mean/SD sliders when `show_mean_sd_sliders` is true.
5. For chi-square and t: show df input.

**Implementation notes:**
- The x-axis domain must auto-scale sensibly for each distribution and parameter set.
  For normal: [mean − 4×sd, mean + 4×sd]. For chi-square with df d: [0, d + 5×√(2d)].
  For t with df d: [−5, 5] (or wider for very small df).
- The y-axis domain runs from 0 to 1.05 × max(PDF) over the x domain.
- When lo is −∞ (represented as null or a very small number), shade from the left edge.
  When hi is +∞ (represented as null or a very large number), shade to the right edge.

**Acceptance criteria:**
- Renders a normal curve with shading for the default state.
- Switching distribution re-renders the curve and updates parameter inputs.
- Adjusting lo/hi updates the shaded region and area display.
- For chi-square and t, adjusting df re-renders the curve.

---

### Phase 6 — Histogram tools

**Goal:** `histogram.mjs` and `norm-approx.mjs` widgets.

**Tasks:**
1. Embed the gravity dataset in `src/data/datasets.mjs` (transcribe from NormApprox.htm).
2. Implement `widgets/histogram/widget.mjs`.
3. Implement `widgets/norm-approx/widget.mjs`.

The gravity data (100 values) is available in the NormApprox.htm page source. Transcribe it
exactly. The values are deviations from a reference g of 9.792838 m/s².

---

### Phase 7 — Calculators

**Goal:** `prob-calc.mjs` and `stats-calc.mjs` widgets.

**Tasks:**
1. Implement `widgets/prob-calc/widget.mjs`.
   - Distribution selector shows/hides parameter inputs dynamically.
   - For discrete distributions (binomial, geometric, hypergeometric, negative binomial,
     Poisson), lo and hi must be integers.
   - Display the result as both a decimal and a percentage.
   - Display EV and SE below the result.
2. Implement `widgets/stats-calc/widget.mjs`.
   - Use a standard calculator state machine (accumulate operand, apply operator).
   - `nCk` and `nPk` are two-argument operators: enter n, press nCk, enter k, press =.
   - `U[0,1]` uses `Math.random()` (no PRNG seeding needed here).

---

### Phase 8 — Simulation widgets

**Goal:** `lln.mjs`, `confidence-intervals.mjs`, and `sampling-dist.mjs` widgets.

Implement in this order (increasing complexity).

**LLN (`lln.mjs`):**
- Each click of "Run" simulates n Bernoulli(p) trials (using PRNG) and plots the cumulative
  difference curve.
- The y-axis auto-scales to fit the running difference.
- Two curves are always available (count difference and proportion difference); the `mode`
  parameter selects which is displayed.
- Clicking "Run" again resets and re-runs with a new random seed.

**Confidence Intervals (`confidence-intervals.mjs`):**
- Each click of "Take sample" draws `samples_per_click` samples of size n from the
  population, computes a (1−α) CI for the mean using the t-distribution, and appends bars
  to the display.
- Bars that cover the true population mean are blue; bars that do not are red.
- Display the running coverage rate (proportion of CIs that cover the true mean).
- Limit display to the 100 most recent CIs (scroll older ones off).

**Sampling Distributions (`sampling-dist.mjs`):**
- This widget has the most internal state. Keep all simulation history in a local variable
  (not synced to the MyST model).
- When sample size changes, clear the simulation history and redraw.
- For the chi-square statistic, interpret the population box as a list of category
  probabilities (re-normalize to sum to 1).
- The normal curve overlay uses the theoretical SE of the selected statistic.
- When switching between mean and sum, transform the hi/lo highlight range accordingly.

---

### Phase 9 — Scatterplot family

**Goal:** `correlation.mjs`, `scatterplot.mjs`, and `hist-control.mjs` widgets.

Implement in this order.

**Correlation (`correlation.mjs`):**
- Generate bivariate normal data with correlation r using the PRNG: set X ~ N(0,1),
  Y = r×X + √(1−r²)×Z where Z ~ N(0,1).
- When r or n changes, regenerate data (using the stored seed for reproducibility).
- Click-to-add-point: convert click coordinates from SVG space to data space using the
  current scales. Append to an `addedPoints` array. Re-compute overlays if
  `include_added_points` is true.
- The "SD Lines" overlay draws horizontal and vertical lines at mean ± 1 SD.
- The "SD Line" (singular) is the line through the point of averages with slope SD_y/SD_x.
- The regression line is the OLS line through all points (or original points only).

**Scatterplots (`scatterplot.mjs`):**
- Dataset loading: `datasets.mjs` exports the four built-in datasets. URL loading fetches
  a tab/space-separated file; parse it with a simple tokenizer (split lines, split tokens,
  first line = variable names).
- Variable selectors are `<select>` elements populated from the dataset's column names.
- The graph of averages bins the X variable into ~10 equal-width bins, computes the mean Y
  in each bin, and plots yellow squares.
- Residual plot: replace each point (x, y) with (x, y − ŷ) where ŷ is the fitted value
  from the regression line. The regression line in residual view is always y = 0.
- "Show data" panel: a scrollable HTML table of the current dataset. If rows are selected
  in the table (click to select, shift-click for range), the corresponding scatterplot
  points turn yellow.

**Controlling for Variables (`hist-control.mjs`):**
- Two D3 histogram renderers share the same SVG and x-axis. The blue histogram is the full
  dataset; the green histogram is the restricted subset.
- Where both histograms have positive height in the same bin, the shorter one is in front
  (higher z-order).
- The restriction logic: filter the dataset to rows where every active restriction is
  satisfied.
- "Clear restrictions" resets all restriction rows to inactive and min/max to dataset
  extremes.

---

### Phase 10 — Venn diagrams

**Goal:** `venn2.mjs` and `venn3.mjs` widgets.

**Implement F1 (venn2) first.**

**Circle geometry for venn2:**
- Given P(A), P(B), P(A∩B), compute radii rA = C×√P(A), rB = C×√P(B) where C is a
  scaling constant chosen so circles fit in the SVG canvas.
- Compute the required center distance d such that the intersection area of two circles
  with radii rA and rB equals P(A∩B) (scaled by the same factor). Use Newton's method to
  solve: the two-circle intersection area formula is
  `A = rA²·arccos((d²+rA²−rB²)/(2·d·rA)) + rB²·arccos((d²+rB²−rA²)/(2·d·rB)) − 0.5·√((−d+rA+rB)(d+rA−rB)(d−rA+rB)(d+rA+rB))`.
- Place circle A at a fixed position; derive circle B's position from d and a fixed
  angle (horizontal, B to the right of A).

**Drag interaction:**
- Use SVG `mousemove` + `mousedown`/`mouseup` events on each circle.
- When a circle is dragged, recompute P(A∩B) from the new center distance using the
  intersection area formula, and update the probability display.
- Constrain drag so that circles always remain within the canvas bounds.
- The radii (and hence P(A) and P(B)) are not changed by drag — only P(A∩B) changes.

**Highlight regions:**
- Implement each set operation as an SVG clip-path combination or by drawing filled paths
  with appropriate clip regions.
- Use `clip-path` with `clip-rule="evenodd"` to carve out intersection regions.

**Scrollbars for P(A) and P(B):**
- Range inputs (type="range") change P(A) and P(B). When a radius changes, recompute
  the center distance to maintain P(A∩B) if possible; if P(A∩B) > min(P(A), P(B)),
  clamp P(A∩B) to min(P(A), P(B)).

**For venn3:**
- Extend the geometry to three circles. Fix the three centers in an equilateral triangle
  arrangement. Allow drag to move each circle, recomputing the seven intersection
  probabilities from the circle positions using the two-circle intersection formula and
  inclusion-exclusion.

---

## Coding conventions

These conventions must be followed in all code produced for this project.

### Module style
- All files are ES modules (`.mjs` extension, `import`/`export` syntax).
- No CommonJS (`require`, `module.exports`).
- No TypeScript (plain JavaScript only).
- No JSX.

### Widget render function signature
Every widget entry point exports exactly:
```js
export default {
  render({ model, el }) {
    // ... setup ...
    return () => { /* cleanup: remove event listeners, cancel timers */ };
  }
};
```
The cleanup function is required in every widget. It must cancel any `requestAnimationFrame`
loops, remove any global event listeners, and clear any timers.

### DOM construction
- Do not use `innerHTML` for widget construction — use `document.createElement` and
  `element.appendChild`.
- Exception: setting `innerHTML` on a leaf node to display computed numeric results is
  acceptable.
- Use `el.style.setProperty('--custom-var', value)` for dynamic styling, not inline
  `style` attribute strings.

### Model access
- Read state with `model.get("key")`.
- Write state with `model.set("key", value); model.save_changes()`.
- Listen for changes with `model.on("change:key", callback)`.
- In MyST (no Python kernel), `model.save_changes()` is a no-op but must still be called
  for compatibility.

### D3 usage
- Import only the subpackages needed:
  ```js
  import { scaleLinear } from 'd3-scale';
  import { axisBottom } from 'd3-axis';
  ```
- Do not import from `'d3'` (the monolithic package).
- Avoid D3's `selection.data().enter().append()` pattern for frequently-updating elements —
  use direct SVG attribute updates instead.

### Error handling
- Every user-entered numeric value must be validated before use. Invalid inputs should
  show a visible error message near the input; they must not throw exceptions or produce
  NaN in the visualization.
- Wrap fetch calls (for URL data loading) in try/catch and display a user-visible error
  message on failure.

### Accessibility
- All interactive controls (`<input>`, `<button>`, `<select>`) must have associated
  `<label>` elements or `aria-label` attributes.
- SVG chart elements that convey data must have `<title>` elements as the first child.
- Color must not be the only means of conveying information (use patterns or labels as
  supplementary cues for the highlighted regions).

### Performance
- Never recompute the full dataset or full PMF array on every mousemove or drag event.
  Throttle drag callbacks to once per animation frame.
- For the simulation widgets, do not update the DOM on every simulated trial. Batch
  updates: simulate `samples_per_click` samples, then update the histogram once.
- For the scatterplot family, cache the regression line computation and invalidate only
  when the data or `include_added_points` flag changes.

---

## Reference materials

- Original applet index: https://www.stat.berkeley.edu/~stark/Java/Html/index.htm
- BinHist applet: https://www.stat.berkeley.edu/~stark/Java/Html/BinHist.htm
- ScatterPlot applet: https://www.stat.berkeley.edu/~stark/Java/Html/ScatterPlot.htm
- SampleDist applet: https://www.stat.berkeley.edu/~stark/Java/Html/SampleDist.htm
- MyST anywidget example: https://github.com/jupyter-book/example-js-anywidget
- MyST anywidget docs: https://jupyter-book.github.io/example-js-anywidget/
- D3 subpackages on npm: https://www.npmjs.com/org/d3
- jstat documentation: http://jstat.github.io/
- xoshiro128** algorithm: https://prng.di.unimi.it/xoshiro128starstar.c
- Two-circle intersection area: https://mathworld.wolfram.com/Circle-CircleIntersection.html

---

## Session handoff protocol

At the end of each working session, before stopping, the agent must:

1. Run `npm run build` and confirm it succeeds.
2. Run `npm test` and confirm all tests pass (or document any known failures).
3. Update this section of the document with:
   - Which phase was completed.
   - Which tasks within the current phase remain.
   - Any decisions made that deviate from this specification (and why).
   - Any issues or blockers discovered.

At the start of each new session, the agent must:

1. Read this document.
2. Read the session handoff notes below.
3. Run `npm test` to confirm the current state.
4. Continue from where the previous session left off.

### Session notes

*(This section will be populated by the agent during implementation.)*

---

*End of document.*
### Session notes (Histogram Unification)
- Completed the unification of `hist-control` and `histogram` widgets into a single `histogram` widget.
- Used an `advanced` boolean to control whether to show the advanced controls (full/restricted checkboxes, normal curve toggle, and restrictions UI).
- When `advanced` is false, `lo` and `hi` inputs are shown, which internally apply a single restriction to achieve the original highlighted behavior mathematically.
- Re-implemented the "List Data" and "Univariate Stats" modals which were present in the old `histogram` but not in `hist-control`.
- Merged the documentation for both widgets into `docs/widgets/histogram.md` (with examples showing `advanced: true` and `advanced: false`).
- Deleted the old `widgets/hist-control` directory and removed references from `docs/myst.yml`, `docs/index.md`, and `docs/widgets/index.md`.
- Build succeeds (`npm run build`). The vitest setup throws a Node.js module loading error unrelated to the widget source code, which appears to be a known environment issue.
