[![PyPi](https://img.shields.io/pypi/v/escher.svg)](https://pypi.python.org/pypi/Escher)
[![NPM](https://img.shields.io/npm/v/escher.svg)](https://www.npmjs.com/package/escher)
[![Gitter.im](https://img.shields.io/gitter/room/zakandrewking/gitter.svg?color=orange)](https://gitter.im/zakandrewking/escher)
[![Documentation Status](https://readthedocs.org/projects/escher/badge/?version=latest)](https://escher.readthedocs.io/en/latest/?badge=latest)
[![MIT](https://img.shields.io/pypi/l/escher.svg?color=blueviolet)](https://github.com/zakandrewking/escher/blob/master/LICENSE)

# Escher

Escher is a web-based tool to build, view, share, and embed metabolic maps. The
easiest way to use Escher is to browse or build maps on the
[Escher website](http://escher.github.io/).

Visit the [documentation](http://escher.readthedocs.org/) to get started with
Escher and explore the API.

Check out the
[developer docs](https://escher.readthedocs.org/en/latest/development.html),
the [Gitter chat room](https://gitter.im/zakandrewking/escher), and the
[Development Roadmap](https://github.com/zakandrewking/escher/wiki/Development-Roadmap) for information
on Escher development. Feel free to submit bugs and feature requests as Issues,
or, better yet, Pull Requests.

Follow [@zakandrewking](https://twitter.com/zakandrewking) for Escher updates.

You can help support Escher by citing our publication when you use Escher or
EscherConverter:

Zachary A. King, Andreas Dräger, Ali Ebrahim, Nikolaus Sonnenschein, Nathan
E. Lewis, and Bernhard O. Palsson (2015) *Escher: A web application for
building, sharing, and embedding data-rich visualizations of biological
pathways*, PLOS Computational Biology 11(8):
e1004321. doi:[10.1371/journal.pcbi.1004321](http://dx.doi.org/10.1371/journal.pcbi.1004321)

Escher was developed at [SBRG](http://systemsbiology.ucsd.edu/). Funding was
provided by [The National Science Foundation Graduate Research Fellowship](https://www.nsfgrfp.org)
under Grant no. DGE-1144086, The European Commission as part of a Marie Curie
International Outgoing Fellowship within the EU 7th Framework Program for
Research and Technological Development ([EU project AMBiCon, 332020](http://ec.europa.eu/research/mariecurieactions/node_en)),
and [The Novo Nordisk Foundation](http://novonordiskfonden.dk/)
through [The Center for Biosustainability](https://www.biosustain.dtu.dk/)
at the Technical University of Denmark (NNF10CC1016517)

# Installing the Python package

```bash
pip install escher
```

Escher uses [anywidget](https://anywidget.dev) to render maps in notebooks, so
no separate Jupyter extensions are required. The widget works in JupyterLab 4,
Jupyter Notebook 7, VS Code, Cursor, Google Colab, and Marimo.

# Basic usage

```python
import escher

# Display a map in a notebook
builder = escher.Builder(map_name='e_coli_core.Core metabolism')
builder

# Overlay reaction flux data
builder.reaction_data = {'PFK': 1.5, 'PYK': 0.8}

# React to map clicks in Python
builder.observe(
    lambda change: print(change['new']['bigg_id']),
    names='selected_reaction_event',
)
```

To overlay flux from a [COBRApy](https://github.com/opencobra/cobrapy) model:

```python
import cobra
import escher

model = cobra.io.load_model('textbook')
solution = model.optimize()

builder = escher.Builder(
    map_name='e_coli_core.Core metabolism',
    model=model,
    reaction_data=solution.fluxes.to_dict(),
)
builder
```

The COBRA model is synced into the widget so build mode can add reactions
directly from it. FBA itself runs in Python.

Map names must match the names in the Escher map index. To inspect available
maps:

```python
escher.list_available_maps()
```

# Building and testing Escher

The build toolchain uses [Vite](https://vitejs.dev) for the JavaScript
bundles, [Vitest](https://vitest.dev) for JS tests, and
[uv](https://github.com/astral-sh/uv) for the Python package.

## Requirements

- [Node.js](https://nodejs.org) 18+
- [Yarn](https://yarnpkg.com) (classic / v1) — `yarn.lock` is checked in
- Python 3.8+
- [uv](https://github.com/astral-sh/uv)
- [Pandoc](https://pandoc.org/installing.html) for building the docs notebooks

## JavaScript

```bash
yarn install          # install dependencies
yarn build            # produce dist/escher.js, dist/escher.min.js,
                      # dist/escher-widget.js, and dist/escher.css
yarn test             # run JS tests
yarn copy             # copy build artifacts to py/escher/static/
```

For live development:

```bash
yarn watch            # rebuild on source changes
yarn start            # start the Vite dev server
```

## Python

The JavaScript build artifacts must be present in `py/escher/static/` before
installing the Python package from source. After running `yarn build && yarn copy`:

```bash
cd py
uv sync --extra dev   # install package and dev dependencies
uv run pytest         # run Python tests
```

## Jupyter

For notebook use, run Jupyter from the Python package directory so `uv` uses the
Escher project environment:

```bash
cd py
uv run --with jupyter jupyter lab
```

For local development, first rebuild and copy the JavaScript assets into the
Python package, then run Jupyter with the local package installed in editable
mode:

```bash
yarn build && yarn copy
cd py
uv run --with-editable . --with jupyter jupyter lab
```

That Jupyter session imports Escher from the local `py/escher/` source tree, so
Python changes are picked up from the checkout. When changing JavaScript or CSS,
rerun `yarn build && yarn copy` before restarting or refreshing the notebook
widget.

## Full clean build from a fresh checkout

```bash
yarn install && yarn build && yarn copy
cd py && uv sync --extra dev && uv run pytest
```

## Docs

The docs are built with Sphinx and nbsphinx. The Python docs dependencies are
declared in `py/pyproject.toml` under the `docs` extra, and `docs/build_docs`
will run Sphinx through `uv` when `uv` is available.

Pandoc must also be installed separately because nbsphinx uses it to convert
notebooks. On macOS:

```bash
brew install pandoc
```

```bash
cd docs
./build_docs          # installs/uses py[docs] through uv, then builds HTML
cd _build/html
python3 -m http.server
```
