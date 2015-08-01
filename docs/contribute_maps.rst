Building and contributing maps
==============================

We are excited to collect pathway maps for every organism with a well
characterized metabolic network. This section describes the process of building
a new map, either from scratch or using a COBRA model with BiGG IDs.

Building from scratch
---------------------

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

5. (Optional) Once you have a set of subsystem maps, you can set up a local
   Escher server so that subsystem maps appear in the "quick jump" menu in the
   bottom right corner of the screen (as seen here_ for iJO1366). To set this
   up, you will need to start a local server as describe in
   :ref:`local-server`. Next, find your local cache directory by running this
   command in a terminal::

    python -c "import escher; print(escher.get_cache_dir(name='maps'))" 

   This will print the location of the local maps cache. Add your new subsystem
   maps to cache folder. Now, when you run the server (described in
   :ref:`local-server`), you should see that quick jump menu appear.

   NOTE: The cache directory is organized into folders for organisms. You can
   use these folder for filtering by organism on the local launch page, or you
   can place the maps in the top directory.

   NOTE 2: A similar approach can be used to access your models from the local
   launch page. Place maps in the folder indicated by::

    python -c "import escher; print(escher.get_cache_dir(name='models'))" 


Building from an existing map for a similar organism
----------------------------------------------------

Follow the instruction above, except, rather than starting from scratch, load an
existing Escher map for a different organism.

In the Settings menu, activate the **Highlight reactions not in model**
option. Reactions that do not match your loaded COBRA model turn red, and you
can delete these and replace them with appropriate reactions from the new model.

You can repeat this for as many subsystems as you like.

Submitting maps to the Escher website
-------------------------------------

If you would like to contribute maps to Escher, you can make a Pull Request to
the GitHub repository escher.github.io_. Make sure there is a folder with the
name of the organism in ``1-0-0/maps``. For example, a new yeast map goes in the
folder::

    1-0-0/maps/Saccharomyces cerevisiae/

Then, name your map by concatenating the model ID and the map name, separated by
a period. For example, a yeast map built with the genome-scale model iMM904
could be named::

    iMM904.Amino acid biosynthesis.json
   
Then, add the JSON file for the model to the Pull Request *if that model is not
already available*. As before, make a folder for your organism within
``1-0-0/models/``. The model filename is just the model ID.
 
In this example, a correct Pull Request would include the following files::

    1-0-0/maps/Saccharomyces cerevisiae/iMM904.Amino acid biosynthesis.json
    1-0-0/models/Saccharomyces cerevisiae/iMM904.json

.. _escher.github.io: https://www.github.com/escher/escher.github.io/
.. _`BiGG Database`: http://bigg.ucsd.edu
.. _here: http://escher.github.io/builder.html?map_name=iJO1366.Central%20metabolism&js_source=local&quick_jump[]=iJO1366.Central%20metabolism&quick_jump[]=iJO1366.Fatty%20acid%20beta-oxidation&quick_jump[]=iJO1366.Fatty%20acid%20biosynthesis%20(saturated)&quick_jump_path=1-0-0/maps/Escherichia%20coli
