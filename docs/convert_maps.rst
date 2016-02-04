Validate and convert maps
-------------------------

Validate an Escher map
======================

Escher maps follow a specification using the `JSON Schema`_ format. Therefore,
any JSON Schema validator can be used to validate an Escher map by comparing it
to the latest schema file. For example, the current schema is located here:

https://github.com/zakandrewking/escher/blob/master/escher/jsonschema/1-0-0

To make this easier, the Escher Python package includes a validation script. To
validate a map, first install Escher::

  pip install escher

Then call the validator::

  python -m escher.validate my_map.json

Any errors in the map will print to the console.

Convert or upgrade an Escher map
================================

Any Escher maps built with pre-release versions of Escher will not load right
away in the stable v1.0 release. To convert pre-release maps to the new format,
follow these steps:

1. Install Escher::

    pip install escher

2. Find a COBRA model for your maps. This COBRA model will be used to update the
   content of the map in order to support all the new Escher features. You can
   use a COBRA model encoded as SBML or JSON (generated with COBRApy v0.3.0b4 or
   later). The COBRA models currently available on the Escher website can be
   downloaded from the BiGG Models website:

   http://bigg.ucsd.edu

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

.. _`JSON Schema`: http://json-schema.org/
