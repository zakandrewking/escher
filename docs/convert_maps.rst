Convert Maps
============

Any Escher maps built with pre-release versions of Escher will not load right
away in the stable v1.0 release. To convert pre-release maps to the new format,
follow these steps:

1. Install Escher::

    pip install escher

2. Find a COBRA model for your maps. You can use a SBML file or a JSON file
generated with COBRApy v0.3.0b4 or later. The COBRA models currently available
on the Escher website can be downloaded here:

https://github.com/escher/escher.github.io/tree/master/1-0-0/models

3. Run the ``convert_map`` script to generate a new map::

    # With a JSON file model
    python -m escher.convert_map my_old_map.json path/to/model_file.json

    # With an SBML model
    python -m escher.convert_map my_old_map.json path/to/model_file.SBML
    
Those commands will generate a new map called ``my_old_map_converted.json`` that
will load in Escher v1.0 and later.

If that doesn't work, and you were a Beta user for Escher v1, you can DM
`@zakandrewking`_ with a link to a broken Escher map (using Pastbin, Dropbox, or
similar) and the COBRA model you used to generate the map. As a thank you for
helping out with Escher development, I will run the ``convert_map`` script and
send you back a new, valid map. -Zak

.. _`@zakandrewking`: http://twitter.com/zakandrewking
