Contributing Maps
=================

If you would like to contribute maps to Escher, you can make a Pull Request to the GitHub
repository escher.github.io_. Make sure there is a folder with the name of the
organism in ``1-0-0/maps``. For example, a new yeast map goes in the folder::

    1-0-0/maps/Saccharomyces cerevisiae/

Then, name your map by concatenating the model ID and the map name, separated by a
period. For example, a yeast map built with the genome-scale model iMM904 could
be named::

    iMM904.Amino acid biosynthesis.json
   
Then, add the JSON file for the model to the Pull Request *if that model is not
already available*. As before, make a folder for your organism within
``1-0-0/models/``. The model filename is just the model ID.
 
In this example, a correct Pull Request would include the following files::

    1-0-0/maps/Saccharomyces cerevisiae/iMM904.Amino acid biosynthesis.json
    1-0-0/models/Saccharomyces cerevisiae/iMM904.json

.. _escher.github.io: https://www.github.com/escher/escher.github.io/
