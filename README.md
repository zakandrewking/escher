[![PyPi](https://img.shields.io/pypi/v/Escher.svg)](https://pypi.python.org/pypi/Escher)
[![NPM](https://img.shields.io/npm/v/escher.svg)](https://www.npmjs.com/package/escher)
[![Gitter.im](https://img.shields.io/gitter/room/zakandrewking/escher.svg)](https://gitter.im/zakandrewking/escher)
[![MIT](https://img.shields.io/pypi/l/Escher.svg)](https://github.com/zakandrewking/escher/blob/master/LICENSE)
[![Documentation Status](https://readthedocs.org/projects/escher/badge/?version=stable)](https://escher.readthedocs.io/en/stable/?badge=stable)
[![Travis](https://img.shields.io/travis/zakandrewking/escher/master.svg)](https://travis-ci.org/zakandrewking/escher)
[![Coverage Status](https://img.shields.io/coveralls/zakandrewking/escher/master.svg)](https://coveralls.io/github/zakandrewking/escher?branch=master)

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

# Building and testing Escher

## JavaScript

First, install dependencies with [npm](https://www.npmjs.com) (or you can use
[yarn](https://yarnpkg.com)):

```
npm install
```

Escher uses webpack to manage the build process. To run typical build steps, just run:

```
npm run build
```

You can run a development server with:

```
npm run start
# or for live updates when the source code changes:
npm run watch
```

To test the JavaScript files, run:

```
npm run test
```

## Python

Escher has a Python package for generating Escher visualizations from within a
Python data anlaysis session. To learn more about using the features of the
Python package, check out the documentation:

https://escher.readthedocs.io/en/latest/escher-python.html

You can install it with pip:

```
pip install escher
```

## Jupyter extensions

To install the Jupyter lab extension, simple install Escher with pip:

```bash
pip install escher
jupyter labextension install @jupyter-widgets/jupyterlab-manager
jupyter labextension install escher
```

To install the Jupyter notebook extension, run the following:

```bash
pip install escher
jupyter nbextension install --py --sys-prefix escher
jupyter nbextension enable --py --sys-prefix escher
```

## Python/Jupyter Development

For development of the Python package, first build the JavaScript package and
copy it over to the `py` directory with these commands in the Escher root:

```
npm install
npm run build
npm run copy
```

Then in the `py` directory, install the Python package:

```
cd py
pip install -e . # installs escher in develop mode and dependencies
```

For Python testing, run this in the `py` directory:

```
cd py
pytest
```

To develop the Jupyter notebook and Jupyter Lab extensions, you will need
install them with symlinks (the typical installation is describe in the
[docs](https://escher.readthedocs.io/en/latest/escher-python.html)).

First, install the Python package for development as described above.

For the Jupyter notebooks, run:

```
cd py
jupyter nbextension install --py --symlink --sys-prefix escher
jupyter nbextension enable --py --sys-prefix escher
```

When you make changes, you will need to `yarn copy` and refresh notebook browser
tab.

For Jupyter Lab, run (in the root directory):

```
yarn watch # keep this running as a separate process
jupyter labextension install @jupyter-widgets/jupyterlab-manager
jupyter labextension link
jupyter lab --watch
```

If you don't see changes when you edit the code, try refreshing or restarting
`jupyter lab --watch`.

## Docs

Build and run the docs::

```
cd docs
make html
cd _build/html
python -m SimpleHTTPServer # python 2
python -m http.server # python 3
```
