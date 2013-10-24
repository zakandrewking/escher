visbio
======

Visual biology -- a library of web-based visualizations for systems biology.

See the [wiki](https://github.com/zakandrewking/visbio/wiki) for some project info.


running the server
=======

Load data dynamically using the included tornado server. To get started:

```bash
python server/tornado_main.py
```

Should start a server at localhost:7777 with live plots and maps. Modify the data in the data/ directory to make your own plots and maps come to life!


using the static javascript file
=======

You can include the visbio.js script in any html document. The only dependency is [d3.js](http://d3js.org/). Include them both like this:

```html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="visbio.min.js"> </script>
```

Note: this has not been thoroughly tested.

building visbio.js
=======

Install the [require.js optimizer](http://requirejs.org/docs/optimization.html) and run:

```bash
cd /path/to/visbio/js
r.js -o build.js
r.js -o build.min.js
```

This builds both the uglified and non-uglified javascript files.
