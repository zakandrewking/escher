Tutorials
=========

Visualizing RNA-seq data on human metabolic pathways
----------------------------------------------------

In this tutorial, we will grab a public RNA-seq dataset, format it for Escher,
and visualize it on a number of human metabolic pathway maps.

First, the dataset we are interested in this paper:

Donohoe, D. R., Collins, L. B., Wali, A., Bigler, R., Sun, W., &
Bultman, S. J. (2012). **The Warburg Effect Dictates the Mechanism of Butyrate
Mediated Histone Acetylation and Cell Proliferation**. Molecular Cell, 48(4),
612–626. `http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3513569/`_

The raw data from this paper can be found on GEO, here_. This `R script`_ will
grab the raw data and run a quick normalization. You'll need to install
GEOquery_, `org.Hs.eg.db`_, and limma_ if you haven't aleady.

If you like, you can skip the R script step and download my `normalized data`_
output.

.. _here: http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE41113
.. _`R script`: _static/data/tutorial.r
.. _`normalized data`: _static/data/donohoe.csv
.. _GEOquery: http://www.bioconductor.org/packages/release/bioc/html/GEOquery.html
.. _`org.Hs.eg.db`: http://www.bioconductor.org/packages/release/data/annotation/html/org.Hs.eg.db.html
.. _limma: http://www.bioconductor.org/packages/release/bioc/html/limma.html

Visualizing FBA fluxes for *Escherichia coli*
---------------------------------------------

In this tutorial, we will generate a predicted flux state using COBRApy and FBA,
and we will visualize the fluxes on the metabolic maps of *Escherichia coli*.

If you have never used the `COBRA toolbox`_ or COBRApy_, this tutorial may be
a little confusing. But you will still get to see the options for flux
visualization in Escher, so don't be perturbed. In fact, if you are totally
uninterested in COBRA modeling, skip ahead to :ref:`visualizing-flux`.

.. _`COBRA toolbox`: http://opencobra.github.io/
.. _COBRApy: http://opencobra.github.io/cobrapy/

Generate a flux vector using COBRApy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. _visualizing-flux:

Visualizing flux on the Escher map
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- discuss foward and reverse flux visualization, and the effect of absolute value
- show differential flux vs. options
  + mention the current bug

Visualizing yeast metabolomics data
-----------------------------------

Coming soon.

.. _`http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3513569/`: http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3513569/ 
