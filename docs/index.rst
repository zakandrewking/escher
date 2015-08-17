.. Escher documentation master file, created by sphinx-quickstart on Mon Nov 10
   13:25:01 2014.  You can adapt this file completely to your liking, but it
   should at least contain the root `toctree` directive.

Welcome to the documentation for **Escher**
===========================================

Escher is a web-based tool for building, viewing, and sharing visualizations of
biological pathways. These 'pathway maps' are a great way to contextualize
biological datasets. The easiest way to use Escher is to browse and build maps
on the `Escher website`_. New users may be interested in the
:doc:`getting_started` guide.

Escher in 3 minutes
-------------------

.. raw:: html
              
         <iframe width="100%" height="315" src="https://www.youtube.com/embed/qUipX-xzZjQ" frameborder="0" allowfullscreen></iframe><br/><br/>

Help! I just upgraded to v1.2 and my map and model caches are empty!
--------------------------------------------------------------------

Starting with Escher v1.2, the maps and models available from the Escher website
are versioned. Each time you upgrade Escher, you will have access to the new
versions of the Escher maps and models. Any maps and models you were using
before are still saved in the Escher cache in case you need them. For more
details on finding, managing, and clearing the cache, see :ref:`the Python cache
functions<cache>`.

Also starting with Escher v1.2, the maps and models in Escher are the same as
those in the `BiGG Database`_.

Features
--------

#. View pathway maps in any modern web browser
#. :ref:`Build maps <editing-and-building>` using the content of genome-scale metabolic models
#. :ref:`Visualize data <loading-reaction-gene-and-metabolite-data>` on
   reactions, genes, and metabolites
#. Full text search
#. Detailed options for changing colors, sizes, and more, all from the web
   browser
#. View maps :doc:`inside the IPython Notebook <ipython_notebook>`
#. :doc:`Embed maps <development>` within any website, with minimal dependencies
   (escher.js, d3.js, and optionally Twitter Bootstrap)

Supported browsers
------------------

We recommend using Google Chrome for optimal performance, but Escher will also
run in the latest versions of Firefox, Internet Explorer, and Safari (including
mobile Safari).

Installation
------------

Escher can be used without any installation by visiting the `Escher
website`_. However, you can install escher if you would like to (1) run Escher
offline, (2) include your own maps and models in the launch page, (3) view Escher maps
in an IPython Notebook, or (4) modify the source code. 

To install the latest stable version of Escher, run::

    pip install escher

For more information, see the documentation on :doc:`ipython_notebook` and
:doc:`development`.

Citing Escher
-------------

You can help support Escher by citing our publication when you use Escher or
EscherConverter:

Zachary A. King, Andreas Dräger, Ali Ebrahim, Nikolaus Sonnenschein,
Nathan E. Lewis, and Bernhard O. Palsson (2015) *Escher: A web application for
building, sharing, and embedding data-rich visualizations of biological
pathways*, PLOS Computational Biology, May 2015. Accepted for publication.

Contents
--------

.. toctree::
   :maxdepth: 2
   :numbered:

   getting_started
   escher_and_cobrapy
   ipython_notebook
   convert_maps
   contribute_maps
   development
   escherconverter
   javascript_api
   python_api
   license
   
* :ref:`genindex`

.. _`Escher website`: http://escher.github.io
.. _`BiGG Database`: http://bigg.ucsd.edu
