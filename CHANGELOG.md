# Changelog

All notable changes to Escher will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] — Unreleased

This release modernizes the Escher toolchain so the package installs and
runs cleanly in current Python and notebook environments. The widget
delivery layer is rewritten on top of [anywidget](https://anywidget.dev),
which removes the Jupyter extension install step and makes the widget
work in JupyterLab 4, Jupyter Notebook 7, VS Code, Cursor, Marimo, and
Google Colab.

### Breaking changes

- **Notebook widget API** — `Builder` is now an `anywidget.AnyWidget`
  subclass. The widget no longer relies on the `ipywidgets` ≤7
  RequireJS/nbextension delivery model. Existing user code that
  constructs `Builder` and assigns `reaction_data` / `metabolite_data` /
  `gene_data` continues to work; code that imports widget internals
  (e.g. `escher.widget`) will need to be updated.
- **Removed Jupyter extension installs** — `jupyter nbextension install
  --py escher` and `jupyter labextension install escher` are no longer
  needed and no longer supported. Just `pip install escher`.
- **Dropped `setup.py`** — the Python package is now built from
  `pyproject.toml` (PEP 621). `pip install escher` is unchanged for end
  users.
- **Python 3.8+** required.

### Added

- `pyproject.toml` and `uv.lock` for reproducible Python installs with
  [uv](https://github.com/astral-sh/uv).
- `vite.widget.config.js` — separate Vite config that produces a
  self-contained ESM widget bundle (`dist/escher-widget.js`).
- `src/escher-widget.js` — anywidget render function.
- COBRA model sync to the widget so Build mode can add reactions
  directly from the loaded model. FBA itself still runs in Python.

### Changed

- **JS build**: Webpack 4 → [Vite](https://vitejs.dev). Webpack 4 was
  unmaintained and pinned to old Node toolchains. Vite gives ESM-native
  builds and a maintained toolchain.
- **JS test runner**: `mochapack` → [Vitest](https://vitest.dev). All
  19 suites / 159 tests pass.
- **Python packaging**: `setup.py` → `pyproject.toml` + uv.
- **Widget**: `ipywidgets` → `anywidget`. Display options collapse into
  a single `_options_json` traitlet rather than ~30 individual traitlets.
- **CSS delivery**: extracted to `dist/escher.css` and served by
  anywidget with the JupyterLab CSP nonce, so styles render reliably
  inside notebook frontends.

### Fixed

- **Drag-drop node merge** ([#396](https://github.com/zakandrewking/escher/issues/396),
  [opencobra/escher#22](https://github.com/opencobra/escher/issues/22))
  — merging metabolite nodes by drag-drop was silently broken in modern
  browsers. D3's drag behavior calls `setPointerCapture` on the dragged
  element, which prevented `mouseover`-based detection from firing.
  Replaced with active hit-testing via `document.elementFromPoint`.
- **Installation on Python 3.12+** ([#389](https://github.com/zakandrewking/escher/issues/389))
  — narrow dependency pins (`ipywidgets<8`, `Jinja2<3`, etc.) prevented
  installation in modern environments. New `pyproject.toml` opens the
  pins.
- **Widget rendering in JupyterLab** ([#397](https://github.com/zakandrewking/escher/issues/397))
  — the legacy ipywidgets/RequireJS delivery does not work in JupyterLab
  3+. Replaced with anywidget.
- **Widget container sizing in JupyterLab** — `height: 100%` did not
  reliably resolve inside anywidget's mount point, so the map
  rendered into a near-zero-sized container. Switched to an explicit
  pixel height and deferred the initial zoom-to-fit with
  `requestAnimationFrame` so layout has run before
  `getBoundingClientRect()` is read.
- **Build mode "Cannot add: No model"** — the COBRA model was loaded
  into a private Python attribute used only by `save_html` and never
  reached the JS Builder. Added a synced `model_json` traitlet.

### Removed

- `webpack.common.js` / `webpack.dev.js` / `webpack.prod.js` /
  `webpack.test.js`
- `py/setup.py`
- `src/widget.js`
- `jupyter/lab-extension.js`
- `jupyter/notebook-extension.js`

[2.0.0]: https://github.com/zakandrewking/escher/releases/tag/v2.0.0
