Run Escher locally and in IPython
---------------------------------

To run Escher on a local computer or to use Escher in Python/IPython, first
install it. The Python package for Escher can be installed using pip::

  pip install escher

Depending on your installation of Python, you may need sudo::

  sudo pip install escher

Alternatively, one can download the `source files`_ and install the package
directly::

  python setup.py install

Escher in the IPython Notebook
==============================

Once you have installed Escher locally, you can interact with Escher maps in an
IPython Notebook.

Here are example notebooks to get started with:

- `COBRApy and Escher`_
- `JavaScript development and offline maps`_
- `Generate JSON models in COBRApy`_

Dependencies:

- `Jinja2`_
- `Tornado`_
- `COBRApy`_, 0.3.0 or later

.. _`local-server`:

Running the local server
========================

You can run your own local server if you want to use Escher offline or explore
your own maps with the homepage browser. To get started, install the Python
package and run from any directory by calling::

  python -m escher.server

This starts a server at http://localhost:7778. You can also choose another port::

  python -m escher.server --port=8005


.. _`source files`: https://github.com/zakandrewking/escher/releases
.. _`Jinja2`: http://jinja.pocoo.org
.. _`Tornado`: http://www.tornadoweb.org/en/stable
.. _`COBRApy`: https://github.com/opencobra/cobrapy
.. _`COBRApy and Escher`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/COBRApy%20and%20Escher.ipynb
.. _`JavaScript development and offline maps`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/JavaScript%20development%20and%20offline%20maps.ipynb
.. _`Generate JSON models in COBRApy`: http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/Generate%20JSON%20models%20in%20COBRApy.ipynb
