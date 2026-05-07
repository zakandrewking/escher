# Contributing to Escher

Thanks for your interest in contributing to Escher! This document describes
the build setup and the architecture of the Python/JavaScript bridge so you
can find your way around the codebase.

## Build setup

The repository contains two independent parts:

- **JavaScript frontend** (`src/`) — the D3-based SVG map renderer. Built
  with [Vite](https://vitejs.dev). Output goes to `dist/` and is then
  copied into `py/escher/static/` (via `yarn copy`) for the Python package
  to bundle.
- **Python package** (`py/`) — installs as `escher` and provides the
  `Builder` API for use in Jupyter notebooks. Uses
  [anywidget](https://anywidget.dev) to render the map in any modern
  notebook frontend.

The JavaScript build must run before the Python package is installed from
source. PyPI installs already include the built artifacts.

See the README for the full build/test command sequence.

## Architecture

### Widget (`Builder`)

`Builder` (`py/escher/plots.py`) inherits from `anywidget.AnyWidget`. It
synchronizes a small set of traitlets across the Python ↔ JavaScript
bridge — most importantly `map_json`, `model_json`, the
`reaction/metabolite/gene_data` JSON traitlets, and `_options_json`
(display options packed into a single traitlet rather than ~30
individual ones). The widget mounts via the ESM render function in
`src/escher-widget.js`.

Because anywidget ships ESM directly to the notebook frontend, no Jupyter
extensions are required. The same widget runs in JupyterLab 4, Jupyter
Notebook 7, VS Code, Cursor, Marimo, and Google Colab.

### Widget bundle

`src/escher-widget.js` is built by `vite.widget.config.js` into
`dist/escher-widget.js` — a self-contained ESM bundle separate from the
main UMD bundle (`dist/escher.js` / `escher.min.js`) used for embedded
HTML pages.

### CSS delivery

Vite extracts all CSS to `dist/escher.css`. `yarn copy` places it under
`py/escher/static/`, and `plots.py` sets `_css = pathlib.Path(...escher.css)`
so anywidget injects it with the JupyterLab CSP nonce. The SVG-scoped
styles in `Builder-embed.css` are imported with `?raw` and embedded inside
the SVG `<defs>` separately so the saved/exported SVG carries its own
styles.

### Data flow

`map_json`, lightweight flux/data dicts, and the serialized COBRA model
cross the Python/JS bridge. The model is synced into the widget so build
mode can add reactions, but FBA itself stays in Python — the JS side does
not solve the model.

### Drag-drop merge

Drag-drop merge between matching metabolites is implemented in
`src/Behavior.js` using `document.elementFromPoint` for hit-testing
during the drag. D3's drag behavior calls `setPointerCapture` on the
dragged element, which prevents pointer events from firing on any other
element during the drag, so listener-based detection (the original
approach) doesn't work. Instead, after each position update, the drag
handler temporarily disables pointer-events on the dragged circle, calls
`elementFromPoint`, reads the `data-bigg-id` attribute on the element
underneath, and toggles the `.node-to-combine` class accordingly.

## Style

- Use [Standard JS style](http://standardjs.com)

## Tests

- JS: `yarn test` (Vitest, 19 suites)
- Python: `cd py && uv run pytest` (22 tests)
