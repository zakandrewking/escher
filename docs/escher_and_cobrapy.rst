Escher, COBRA, and COBRApy
==========================

Escher can be used as an independent application, but it draws heavily on the
information in `COBRA`_ models. A COBRA model is a collection of all the
reactions, metabolites, and genes known to exist in an organism. (In the
literature, these are generally called genome-scale models (GEMs), but we refer
to them as COBRA models here to emphasize that Escher interoperates with models
that are exported from COBRApy_.)

By loading a COBRA model into the Escher interface, you have access to every
reaction and metabolite in that model. You also have the :ref:`gene reaction
rules <gene-reaction-rules>` for the reactions in the network, which allow you
to connect gene data to reactions and metabolites.

COBRApy_ is a software package for COBRA modeling written in Python. The Escher
Python package uses COBRApy package for reading and writing COBRA models.

Maps and models
---------------

In Escher, you will see references to *maps* and *models*.

A map contains the reactions and metabolites that you see in the Escher builder,
including their locations, text annotations, and the canvas.

A model (a COBRA model) contains reactions and metabolites that you have not
drawn yet. Thus, you can load a COBRA model when you want to draw new reactions
on the map.

What is JSON and why do we use it?
----------------------------------

Both Escher maps and COBRA models are stored as JSON_ files. JSON is a useful,
plain-text format for storing nested data structures. We use JSON much like the
SBML community uses XML. You may notice that SBML files have a .xml extension,
and Escher maps and COBRA models have a .json extension.

You can use Python to explore a JSON file like this::

    import json

    with open('map.json', 'r') as f:
	map_object = json.load(f)

    print map_object[0]
    print map_object[1]['reactions'].values()[0]

.. _JSON: http://www.wikiwand.com/en/JSON

Escher, SBML, and SBGN
----------------------

A tool has been developed for converting Escher maps to `SBML Layout`_ and
SBGN_, and it will be released soon.

COBRA models can be converted to SBML using COBRApy_.

.. _COBRA: http://opencobra.github.io/
.. _COBRApy: http://opencobra.github.io/cobrapy/
.. _`SBML Layout`: http://sbml.org/Community/Wiki/SBML_Level_3_Proposals/Layout
.. _SBGN: http://www.sbgn.org/
