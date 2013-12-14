visbio
======

Visual biology -- a library of web-based visualizations for systems biology.

See the [wiki](https://github.com/zakandrewking/visbio/wiki) for some project info.


1) [Download](https://github.com/zakandrewking/visbio/releases)
=======


2) Running the server
=======

Load data dynamically using the included tornado server. To get started, go to the root visbio directory and call:

```bash
python server/tornado_main.py
```

Should start a server at [localhost:7777](http://localhost:7777) with live plots and maps. Modify the data in the data/ directory to make your own plots and maps come to life!


3) View maps in python
=======

Go to the root directory and install the python package:

```bash
python setup.py install
```

In python, you can:

```python
import visbio
map = visbio.Map()
map.create_standalone_html()
map.view_browser()
```

Or, in an IPython notebook, just call:

```python
import visbio
visbio.Map(flux=flux_dictionary)
```


4) Using the static javascript file
=======

You can include the visbio.js script in any html document. The only dependency is [d3.js](http://d3js.org/). Include them both like this:

```html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="visbio.min.js"> </script>
```


building visbio.js
=======

Install the [require.js optimizer](http://requirejs.org/docs/optimization.html) and run:

```bash
cd /path/to/visbio/js
r.js -o build.js
r.js -o build.min.js
```

This builds both the uglified and non-uglified javascript files.
