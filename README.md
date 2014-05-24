Escher
======

A web-based tool to build, view, share, and embed metabolic maps.

See the [wiki](https://github.com/zakandrewking/escher/wiki) for documentation, examples, and developer information.

**NOTE**: Escher is still a Beta release, so please be patient with the early version as you may encounter bugs and other unexpected behavior. The documentation is also unfinished. Feel free to submit bugs and feature requests as Issues, or, better yet, Pull Requests.

The easiest way to use Escher it to try our [live demo](http://zak.ucsd.edu:7778). 

1) Using the Escher web tool
======

When you open the [live demo](http://zak.ucsd.edu:7778), you will see a few options:

- Model: Choose a COBRA model to load, for building reactions. You can also load your own model after you launch the tool.
- Map: Try viewing and editing a pre-built map, or start from scratch with the Empty Builder
- Options:
    1. The Viewer allows you to pan and zoom the map, and to assign data to reactions and metabolites.
    2. The Builder, in addition to the Viewer features, allows you to add reactions, move and rotate existing reactions, and adjust the map canvas.
    3. The Dev mode utilizes local javascript files and is useful if you are editing the Escher source code.

## Supported browsers

We test Escher on the latest versions of Chrome, Firefox, and Safari on Mac and Windows, and Safari on iOS. Other modern browsers should mostly work.

We recommend using Chrome for optimal performance and consistency.

## Uploading a custom model

Generating COBRA models that can be imported into Escher requires a specific, pre-release version of COBRApy which can be found here:

https://github.com/aebrahim/cobrapy/tree/v0.3_dev

You can keep an eye on this [pull request](https://github.com/opencobra/cobrapy/pull/91) to follow the progress on the latest version of COBRApy, which will be release along with Escher v1.0.

Once you have COBRApy v0.3_dev installed, then you can generate a JSON model by following this example code:

http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/json_models_in_cobrapy.ipynb

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

2) Installing, and using Escher in the IPython Notebook
======

You can download the source files and install by running:

```shell
python setup.py install
```

(Soon, you will be able to download directly from pip).

Once you have installed Escher locally, you can interact with Escher maps in an IPython Notebook. This example notebook outlines the basic idea:

http://nbviewer.ipython.org/github/zakandrewking/escher/blob/master/docs/notebooks/multiple-maps.ipynb

3) Running a local server
=======

You can run your own local server if you want to modify the Escher code. To get started, go to the root escher directory and call:

```shell
python escher/server.py
```

Alternatively, you can launch the server from any directory by calling:

```shell
python -m escher.server
```

This start a server at [localhost:7778](http://localhost:7778).

4) Using the static javascript files
=======

You can include the escher-1.0.dev.js script in any html document. The only dependencies are [d3.js](http://d3js.org/) and [Twitter Bootstrap](http://getbootstrap.com).

5) Building and testing escher
=======

Build:

```shell
python setup.py build
```

This builds both the minified and non-minified javascript files.

Test:

```shell
python setup.py test
```
