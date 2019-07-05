.. Escher documentation master file, created by sphinx-quickstart on Mon Nov 10
   13:25:01 2014.  You can adapt this file completely to your liking, but it
   should at least contain the root `toctree` directive.

Welcome to the documentation for **Escher**
===========================================

Escher is a web-based tool for building, viewing, and sharing visualizations of
metabolic pathways. These 'pathway maps' are a great way to contextualize
metabolic datasets. The easiest way to use Escher is to browse and build maps
on the `Escher website`_. New users may be interested in the
:doc:`getting_started` guide. Escher also has a :doc:`Python package
<escher-python>` and, for developers, a :doc:`NPM package <development>`.

Escher in 3 minutes
-------------------

.. raw:: html

         <iframe width="100%" height="315" src="https://www.youtube.com/embed/qUipX-xzZjQ" frameborder="0" allowfullscreen></iframe><br/><br/>

Features
--------

#. View pathway maps in any modern web browser
#. :ref:`Build maps <editing-and-building>` using the content of genome-scale metabolic models
#. :ref:`Visualize data <loading-reaction-gene-and-metabolite-data>` on
   reactions, genes, and metabolites
#. Full text search
#. Detailed options for changing colors, sizes, and more, all from the web
   browser
#. View maps :doc:`inside a Jupyter Notebook with Python <escher-python>`
#. :doc:`Embed maps <development>` within any website, with minimal dependencies
   (escher.js, d3.js, and optionally Twitter Bootstrap)

Supported browsers
------------------

We recommend using Google Chrome for optimal performance, but Escher will also
run in the latest versions of Firefox, Internet Explorer, and Safari (including
mobile Safari).

Citing Escher
-------------

Please consider supporting Escher by citing our publication when you use Escher
or EscherConverter:

Zachary A. King, Andreas Dräger, Ali Ebrahim, Nikolaus Sonnenschein,
Nathan E. Lewis, and Bernhard O. Palsson (2015) *Escher: A web application for
building, sharing, and embedding data-rich visualizations of biological
pathways*, PLOS Computational Biology 11(8): e1004321.
doi:`10.1371/journal.pcbi.1004321`_

Contents
--------

.. toctree::
   :maxdepth: 1
   :numbered:

   getting_started
   tips-and-tricks
   escher_and_cobrapy
   escher-python
   convert_maps
   development
   developer-tutorial
   escherconverter
   javascript_api
   python_api
   license

* :ref:`genindex`

.. _`Escher website`: http://escher.github.io
.. _`BiGG Database`: http://bigg.ucsd.edu
.. _`10.1371/journal.pcbi.1004321`: http://dx.doi.org/10.1371/journal.pcbi.1004321
