Escher
======

A library of web-based maps and visualizations for systems biology.

See the [wiki](https://github.com/zakandrewking/escher/wiki) for some project info.


1) Installation[Download](https://github.com/zakandrewking/escher/releases)
=======


2) Running the server
=======

Load data dynamically using the included tornado server. To get started, go to the root escher directory and call:

```bash
python server/tornado_main.py
```

Should start a server at [localhost:7778](http://localhost:7778) with live plots and maps. Modify the data in the data/ directory to make your own plots and maps come to life!


3) Using the static javascript file
=======

You can include the escher-1.0.dev.js script in any html document. The only dependency is [d3.js](http://d3js.org/). Include them both like this:

```html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="escher-1.0.dev.js"> </script>
```


4) Building escher
=======

Install the [require.js optimizer](http://requirejs.org/docs/optimization.html) and run:

```bash
cd /path/to/escher/js
r.js -o build.js
r.js -o build.min.js
```

This builds both the uglified and non-uglified javascript files.
