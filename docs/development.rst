Developing with Escher
----------------------

Using the static javascript files
=================================

You can include the compiled Escher javascript file in any html document. The
only dependencies are `d3.js`_, and `Twitter Bootstrap`_ if you are using the
option menu='all'.

These files can be found in ``escher/lib``.

Running the local server
========================

You can run your own local server if you want to modify the Escher code, or use
Escher offline. To get started, install the Python package and run from any
directory by calling::

    python -m escher.server

This starts a server at `localhost:7778`_. You can also choose another port::

    python -m escher.server --port=8005

Building and testing Escher
===========================

Build the minified and non-minified javascript files::

    python setup.py buildjs

Test Python and start Jasmine for JavaScript testing::

    python setup.py test

Build the static website::

    python setup.py buildgh

Clear static website files::

    python setup.py clean

The Escher file format
======================

.. _`d3.js`: http://d3js.org/
.. _`Twitter Bootstrap`: http://getbootstrap.com
.. _`localhost:7778`: http://localhost:7778
