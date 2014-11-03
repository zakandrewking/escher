[![DOI](https://zenodo.org/badge/6078/zakandrewking/escher.png)](http://dx.doi.org/10.5281/zenodo.11712)

Escher
======

Escher is a web-based tool to build, view, share, and embed metabolic maps.

See the [wiki](https://github.com/zakandrewking/escher/wiki) for documentation, examples, and developer information. And follow [@zakandrewking](https://twitter.com/zakandrewking) for Escher updates. <!-- , and ask for help on Stack Overflow with the [Escher](http://stackoverflow.com/questions/tagged/escher) tag -->

**NOTE**: Escher is still a Beta release, so please be patient with the early version as you may encounter bugs and other unexpected behavior. The documentation is also unfinished. Feel free to submit bugs and feature requests as Issues, or, better yet, Pull Requests.

The easiest way to use Escher is to browse or build maps on the  [Escher website](http://zakandrewking.github.io/escher/).

### Supported browsers

We recommend using Google Chrome for optimal performance and consistency, but Escher will also run in the latest versions of Firefox, Internet Explorer, and Safari (including mobile Safari).

1) Using the Escher web tool
======

When you open [Escher](http://zakandrewking.github.io/escher/), you will see a few options:

- Filter by organism: Choose an organism to filter the Maps and Models.
- Map: Try viewing and editing a pre-built map, or start from scratch with an empty builder by choosing None.
- Model (Optional): Choose a COBRA model to load, for building reactions. You can also load your own model after you launch the tool.
- Options:
    1. The Viewer allows you to pan and zoom the map, and to assign data to reactions and metabolites.
    2. The Builder, in addition to the Viewer features, allows you to add reactions, move and rotate existing reactions, and adjust the map canvas.
    3. Local modes are available if you download Escher and run the local server (see below). These let you view and build Escher maps offline.

## Loading reaction and metabolite data

Currently, data must be in a JSON format. This code snippet provides an example of generating the proper format for single reaction data values and for reaction data comparisons:

```python
import json

# save a single flux vector as JSON
flux_dictionary = {'asdf': 2}
with open('out.json', 'w') as f:
    json.dump(flux_dictionary, f) 
	
# save a flux comparison as JSON 
flux_comp = [{'GAPD': 3}, {'GAPD': 4}] 
with open('out_comp.json', 'w') as f: 
    json.dump(flux_comp, f)
```

Once you have saved your data as a JSON file, you can load the files using the Data menu in the Escher tool.

## Uploading a custom model

Generating COBRA models that can be imported into Escher requires the latest beta version of COBRApy which can be found here:

https://github.com/opencobra/cobrapy/releases

You can keep an eye on that GitHub repository to follow the progress on the latest version of COBRApy, which will be release along with Escher v1.0.

Once you have COBRApy v0.3.0b1 (or later) installed, then you can generate a JSON model by following this example code:

http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/json_models_in_cobrapy.ipynb

2) Installing, and using Escher in the IPython Notebook
======

The Python package for _Escher_ can be installed using pip:

```shell
pip install escher --pre
```

Alternatively, one can download the [source files](https://github.com/zakandrewking/escher/releases) and install the package directly:

```shell
python setup.py install
```

Once you have installed Escher locally, you can interact with Escher maps in an IPython Notebook. This example notebook outlines the basic idea:

http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/multiple_maps.ipynb

Dependencies:
- [Jinja2](http://jinja.pocoo.org/)
- [tornado](http://www.tornadoweb.org/en/stable/)
- [COBRApy](https://github.com/opencobra/cobrapy), 0.3.0b1 or later


3) Running a local server
=======

You can run your own local server if you want to modify the Escher code, or use Escher offline. To get started, install the Python package and run from any directory by calling:

```shell
python -m escher.server
```

This starts a server at [localhost:7778](http://localhost:7778). You can also choose another port:

```shell
python -m escher.server --port=8005
```

4) Using the static javascript files
=======

You can include the compiled Escher javascript file in any html document. The only dependencies are [d3.js](http://d3js.org/), and [Twitter Bootstrap](http://getbootstrap.com) if you are using the option menu='all'.

These files can be found in `escher/lib`.

5) Building and testing escher
=======

Build:

```shell
python setup.py buildjs
```

This builds both the minified and non-minified javascript files.

Test:

```shell
python setup.py test
```
