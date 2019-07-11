Validate Escher maps
--------------------

Escher maps follow a specification using the `JSON Schema`_ format. Therefore,
any JSON Schema validator can be used to validate an Escher map by comparing it
to the latest schema file. For example, the current schema is located here:

https://github.com/zakandrewking/escher/blob/master/jsonschema/1-0-0

To make this easier, the Escher Python package includes a validation script. To
validate a map, first install Escher::

  pip install escher

Then call the validator::

  python -m escher.validate my_map.json

Any errors in the map will print to the console.

.. _`JSON Schema`: http://json-schema.org/
