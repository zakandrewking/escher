Convert Maps
============

Any Escher maps built with pre-release versions of Escher will not load right
away in the stable v1.0 release. To convert pre-release maps to the new format,
follow these steps:

1. Install Escher::

    pip install escher

2. Find a COBRA model for your maps. This COBRA model will be used to update the
   content of the map in order to support all the new Escher features. You can
   use a COBRA model encoded as SBML or JSON (generated with COBRApy v0.3.0b4 or
   later). The COBRA models currently available on the Escher website can be
   downloaded here:

https://github.com/escher/escher.github.io/tree/master/1-0-0/models

   For a refresher on the distinction between Escher maps, COBRA models, and
   their file types (SBML, JSON, SBML Layout), see :doc:`escher_and_cobrapy`.

3. Run the ``convert_map`` script to convert your existing Escher map
   (my_old_map.json) to the new format, using a COBRA model (model_file.json or
   model_file.xml in these examples)::

    # With a JSON file model
    python -m escher.convert_map my_old_map.json path/to/model_file.json

    # With an SBML model
    python -m escher.convert_map my_old_map.json path/to/model_file.xml
    
Those commands will generate a new map called ``my_old_map_converted.json`` that
will load in Escher v1.0 and later.

If that doesn't work, and you were a Beta user for Escher v1, you can DM
`@zakandrewking`_ with a link to a broken Escher map (using Pastbin, Dropbox, or
similar) and the COBRA model you used to generate the map. As a thank you for
helping out with Escher development, I will run the ``convert_map`` script and
send you back a new, valid map. -Zak

.. _`@zakandrewking`: http://twitter.com/zakandrewking
