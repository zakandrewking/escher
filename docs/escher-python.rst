Escher in Python and Jupyter
----------------------------

In addition to the web application, Escher has a Python package that allows you
to generate maps from within Python and embed them in a Jupyter Notebook. The
Python package for Escher can be installed using pip::

  pip install escher

Depending on your installation of Python, you may need sudo::

  sudo pip install escher

Alternatively, one can download the `source files`_ and install the package
directly::

  python setup.py install

To install the Jupyter notebook extension::

  jupyter nbextension enable --py --sys-prefix escher # can be skipped for notebook 5.3 and above

To install the Jupyter Lab extension::

  jupyter labextension install @jupyter-widgets/jupyterlab-manager
  jupyter labextension install escher

Dependencies should install automatically, but they are:

- `Jinja2`_
- `COBRApy`_, 0.5.0 or later

Launching Escher in Python
==========================

The main entrypoint for Escher in Python is the Builder class. You can create a
new map by calling Builder::

  from escher import Builder
  b = Builder(map_name="iJO1366.Central metabolism")
  b.display_in_browser()

These commands will create a new builder instance, download a map from our
server, then launch a new browser tab to display the map.

The specific arguments available for `Builder` are described in the
:doc:`python_api`.

You can also pass a COBRApy model directly into the Builder::

  import cobra
  from escher import Builder
  my_cobra_model = cobra.io.read_sbml_model('model.xml')
  b = Builder(model=my_cobra_model)

Escher in the Jupyter Notebook
==============================

Once you have installed Escher locally, you can interact with Escher maps in a
Jupyter Notebook. The commands are the same as above, but instead of calling
`display_in_browser()`, call `display_in_notebook()`

Here are example notebooks to get started with:

- `COBRApy and Escher`_
- `JavaScript development and offline maps`_
- `Generate JSON models in COBRApy`_



.. _`source files`: https://github.com/zakandrewking/escher/releases
.. _`Jinja2`: http://jinja.pocoo.org
.. _`COBRApy`: https://github.com/opencobra/cobrapy
.. _`COBRApy and Escher`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/COBRApy%20and%20Escher.ipynb
.. _`JavaScript development and offline maps`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/JavaScript%20development%20and%20offline%20maps.ipynb
.. _`Generate JSON models in COBRApy`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/Generate%20JSON%20models%20in%20COBRApy.ipynb
