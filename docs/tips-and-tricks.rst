Tips and Tricks
===============

Building a map from scratch
---------------------------

To build a map from scratch, you will first need a COBRA model for your map. See
the section :doc:`escher_and_cobrapy` for some background information on COBRA
models.

If you would like to eventually contribute your map to the Escher website, it is
important that your COBRA model adheres to the identifiers in the `BiGG Database`_. Escher and
BiGG are being developed together, and we want to maintain consistency and
interoperability between them.

Once you have a COBRA model, you can follow these steps:

1. Load your model in the Escher Builder.

2. Begin building new reactions. If you are familiar with the genes in your
   organism, then try search for new reactions by their gene IDs.

3. Limit each map to ~200 reactions. Maps larger than this will slow down the
   Escher viewer, especially on old browsers. Rather than building one giant
   map, Escher is designed for building many, smaller subsystem maps.

4. When you have built a map for your a subsystem, save the map as JSON with a
   name that includes the model ID, followed by a period, followed by the name
   of the subsystem. For example::

    iMM904.Amino acid biosynthesis.json


Building from an existing map for a similar organism
----------------------------------------------------

Follow the instruction above, except, rather than starting from scratch, load an
existing Escher map for a different organism.

Once you have the new model loaded, use the **Update names and gene reaction
rules using model** button in the Model menu to convert all descriptive names
and gene reaction rules in the model to those in the map. Reactions that do not
match the model will be highlighted in red. (This can be turned off again in the
settings menu by deselecting *Highlight reactions not in model*.)

Now, visit each highlighted reaction and see if you can replace it with an
equivalent biochemical pathway from the model. If not, then delete the reaction
and move on.

Finally, when there are no highlighted reactions left, you can repeat this for
other subsystems.

.. _escher.github.io: https://www.github.com/escher/escher.github.io/
.. _`BiGG Database`: http://bigg.ucsd.edu

Escher performance with large maps
----------------------------------

Escher works best with maps that have less than about 200 reactions. If you are
working with more reactions, we recommend splitting your map into multiple small
maps. A trick for splitting up a map is to first select the reactions you want
to keep, then choose "Edit > Invert Selection" and then "Edit > Delete".

If you really want to work with larger maps, the following can help improve
performance:

- Turn off tooltips in the settings menu, especially tooltips over Objects
- Try the "Use 3D Transform" option in the settings menu. Depending on your
  browser, this can increase responsiveness when moving around the map.
- Turn off labels, gene reaction rules, and/or secondary metabolites in the
  settings menu.

We are always trying to make Escher faster, so let us know if you find any
unexpected performance issues.
