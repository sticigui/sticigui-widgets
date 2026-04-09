# SticiGui Widgets

This repository contains interactive statistics widgets ported from Philip Stark's [SticiGui](https://www.stat.berkeley.edu/~stark/SticiGui/) textbook. They are anywidget-compatible ESM bundles for 14 interactive statistics applets. The widgets are designed to work in MyST Markdown websites.

## Overview

- Interactive widgets for statistics education
- Built with D3.js and jstat, bundled as ES modules
- Runs in the browser (no server required)
- Some support for light/dark themes
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

## Usage in MyST

Once built, widgets can be embedded in MyST Markdown using the `anywidget` directive:

```markdown
\```{anywidget} ./widgets/binhist/dist/widget.mjs
{"n": 10, "p": 0.5, "lo": 3, "hi": 7, "show_normal": false}
\```
```

## Documentation

The widget inventory can be browsed in this repository's [MyST documentation](https://sticigui.github.io/sticigui-widgets).


## References

- [Original SticiGui](https://www.stat.berkeley.edu/~stark/SticiGui/)
- [MyST Markdown](https://mystmd.org)
- [MyST anywidget example](https://github.com/jupyter-book/example-js-anywidget)
- [D3](https://d3js.org)
- [jstat](http://jstat.github.io/)
