Tutorial: Custom tooltips
-------------------------

We designed Escher to be easily extended by anyone willing to learn a little
JavaScript. A few extensions to Escher already exist; you can check out our
`demos`_ and see Escher in action on the `Protein Data Bank`_. Escher uses
standard web technologies (JavaScript, CSS, HTML, SVG), so you can embed it in
any web page. We also hope to see users extend the maps by integrating plots,
dynamic interactions, and more.

In this tutorial, I will introduce a new extension mechanism in Escher: custom
tooltips. The tooltips are already available on Escher maps when you hover over
a reaction, metabolite, or gene. The default tooltips provide some information
about the object you are hovering over, but any text, links, or pictures could
potentially be displayed there.

With a little bit of JavaScript, you can add your own content to the
tooltips. In this tutorial, we will add custom text, images, and then plots with
`D3.js`_ to the tooltips. Here's what were are building up to (`live demo`_):

.. image:: _static/tooltip_bar.png

To follow along with this tutorial, you will need a basic understanding of HTML,
CSS, JavaScript, and SVG. If you have never used these before, check out
`codecademy`_.

On the other hand, if you already know JavaScript and the basic Escher API, you
can skip to the section :ref:`custom-tooltips`.

Getting ready to develop with Escher
====================================

Before you can make any changes to an Escher map, you will download some source
code and set up a local web server. Your local version of Escher will have all
of the features from the main website, but you will be able to modify the
visualizations and add your own content. First we need to start up a basic
static file server.

NOTE: If you already have experience with JavaScript development, you might want
to download Escher from NPM (as ``escher``). If you like Webpack, check out
the `escher-test`_ repository.

To get started, download this `ZIP file`_. If you prefer to use **git** for version
control, you can also clone the `source code from GitHub`_.

Then, in your favorite terminal, navigate to into the folder (the one that
contains ``README.md``), and run one of the following commands to start a web
server. You will need to have Python or node.js installed first; if you don't
have either, `get started with Python`_ first.

.. code-block:: shell

    # python 2
    python -c "import SimpleHTTPServer; m = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map; m[''] = 'text/plain'; m.update(dict([(k, v + ';charset=UTF-8') for k, v in m.items()])); SimpleHTTPServer.test();"

    # python 3
    python -m http.server

    # node.js
    http-server -p 8000

Open http://localhost:8000/ to see the your web server in action. It should look
just like the site here: https://escher.github.io/escher-demo/.

Now, any changes you make to the code in that folder will be reflected next time
you refresh you browser! Try editing the file ``embedded_map_builder/index.html``,
then reload your web browser to see what you've changed.

You can see what's happening under the hood by opening your *developer tools*
(`Chrome`_, `Firefox`_) where you can debug your code and check for error
messages.

How does Escher work?
=====================

The starting point for an Escher map is the **Builder** class. When you create a
Builder, you pass in options that define how the map will render: what to
display, whether to allow editing, how to style the map, and more. These options
are documented in the :doc:`javascript_api`.

The most basic demo is in the folder ``embedded_map_builder``. Look for the
``main.js`` file that contains a section of JavaScript code that looks like
this:

.. code-block:: javascript

    d3.json('e_coli.iJO1366.central_metabolism.json', function (e, data) {
      if (e) console.warn(e);
      var options = { menu: 'all', fill_screen: true };
      var b = escher.Builder(data, null, null, d3.select('#map_container'), options);
    });

That code does three things. First, it uses D3 to load a file (the one that ends
in ``.json``) that contains the layout for a pathway map. Second, it defines
some options for the map. And third, it creates a new ``Builder``, passing in
the loaded data. Escher needs to know where to render the map, so the fourth
argument points to a location on the page (a DOM element) using D3. Check the
HTML in ``index.html`` and you will find the line ``<div
id="map_container"></div>``. This is where Escher lives.

To test your setup, change the ``menu`` option from ``all`` to ``zoom``, reload
the page, and see what happens.

Now you are ready to extend Escher!

.. _custom-tooltips:

Custom tooltips
===============

We've designed the tooltip customization process to be as easy and modular as
possible. The Builder will generate a ``div`` element to display your tooltip
whenever you mouse over a label or map object associated with a reaction or
metabolite. The only consideration that must be made is that a getSize function
that returns an object with both height and width properties should be implemented
within the tooltip. Otherwise the Builder willa assume that your tooltip is 270px
wide and 100px tall. We'll start with a a basic tooltip that includes a random
picture. You can view your currently deployad code at:
http://localhost:8000/custom_tooltips.

Method 1: Tooltip with random pics
==================================

To start, we'll just display a simple tooltip with a random image from unsplash.
Change the tooltip_component option at the bottom of the file to ``Tooltip1``
which looks like this:

.. code-block:: javascript

  const Tooltip1 = props => {
    return (
      // Style the text based on our tooltip_style object
      h('div', { style: tooltipStyle},
        // Update the text to read out the identifier biggId
        'Hello tinier ' + props.biggId,
        // Line break
        h('br'),
        // Add a picture. Get a random pic from unsplash, with ID between 0 and 1000.
        h('img', { src: 'https://unsplash.it/100/100?image=' +  Math.floor(Math.random() * 1000) })
      )
    );
  };

Try it out! You should get a tooltip like this, with a different picture every
time:


Method 2: Tooltip with a D3 plot
================================

What if we want a data plot in the tooltip? `D3.js`_ is great for creating
custom plots, so let's start with this example of a bar plot in D3:

https://bl.ocks.org/mbostock/3310560

D3 takes a little while to learn, so, if you are interested in expanding on what
we show here, I recommend you read through some D3 `tutorials`_. I will only
explain the main points here, and you can work through the details as you learn
D3.

The complete code for ``Tooltip2`` with bar charts is in
``custom_tooltips/main.js``.

.. code-block:: javascript

  var tooltips_4 = function (args) {
    // Use the tinier.render function to render any changes each time the
    // tooltip gets called
    tinier.render(
      args.el,
      // Create a new div element inside args.el
      tinier.createElement(
        'div',
        // Style the text based on our tooltip_style object
        { style: tooltip_style }
      )
    )
    ...

So we still create and style a tooltip, but now we are going to fill it with a
plot. Next, we take the biggID for our reaction, metabolite, or gene, and we
calculate the frequency of each letter.

.. code-block:: javascript

  // Let's calculate the frequency of letters in the ID
  var letters = calculateLetterFrequency(args.state.biggId)

You can look at the ``calculateLetterFrequency`` function; basic JavaScript.

.. code-block:: javascript

  function calculateLetterFrequency (s) {
    var counts = {}
    s.toUpperCase().split('').map(function (c) {
      if (!(c in counts)) {
        counts[c] = 1
      } else {
        counts[c] += 1
      }
    })
    return Object.keys(counts).map(function (k) {
      return { letter: k, frequency: counts[k] }
    })
  }

The rest of ``Tooltip2`` takes our frequency data and turns it into a bar
chart. This code is just an adaptation of the example we mentioned above:

https://bl.ocks.org/mbostock/3310560

For the details on how this works, check out the `tutorials`_ called "How to build
a bar chart." The end result looks like this:

.. image:: _static/tooltip_bar.png

Pretty cool! This is also the version that's live on the `demo website`_, so you
can see it in action there as well.
.. image:: _static/tooltip_image.png

Method 2: Callback function with Tinier for rendering
=====================================================

The shortcuts we will use are part a the `Tinier`_ library. Tinier looks a lot
like the popular JavaScript framework `React`_, but it is meant to be tiny (get
it?) and modular so you can use it just to render a few DOM elements inside a
tooltip. (In place of Tinier, you could also use a library like JQuery. That's
not a bad idea if you alreay have experience with it.)

The reasons for using Tinier will be a lot more obvious if we look at the second
tooltip. Here is the code. NOTE: If you look at the code in escher-demo,
``tooltip_2`` is more complicated. We are working up to that version.

.. code-block:: javascript

  var tooltips_2 = function (args) {
    // Use the tinier.render function to render any changes each time the
    // tooltip gets called
    tinier.render(
      args.el,
      // Create a new div element inside args.el
      tinier.createElement(
        'div',
        // Style the text based on our tooltip_style object
        { style: tooltip_style},
        // Update the text to read out the identifier biggId
        'Hello tinier ' + args.state.biggId
      )
    )
  }

OK, let's compare ``tooltips_2`` to ``tooltips_1``. Both functions take
``args``, and both function render something inside of ``args.el``. The new
function uses two pieces of Tinier. First, ``tinier.render`` will take a
location on the page (``args.el``) and render a Tinier element. Second,
``tinier.createElement`` defines a Tinier version of a DOM element, in this case
a ``div``. To create an Alement, you pass in a tag name, an object with
attributes for the element like styles, and any children of the ``div``. In this
case, the only child is some text that says 'Hello tinier' with the biggId.

If you compare ``tootips_2`` and ``tooltips_1`` in detail, you might notice that
``tooltips_2`` does not have any ``if`` statements. That's becuase Tinier lets
you define your interface once, up front, and then it will determine whether any
changes need to be made. If a ``div`` already exists, Tinier will just modify it
instead of creating a new one. In the old version, we would have to use ``if``
to check whether changes are necessary.

Change ``tooltips_1`` to ``tooltips_2`` in this block, and refresh to see our
new tooltip in action.

.. code-block:: javascript

  var options = {
    menu: 'zoom',
    fill_screen: true,
    // --------------------------------------------------
    // CHANGE ME
    tooltip_component: tooltips_2,
    // --------------------------------------------------
  }

.. _`demos`: https://escher.github.io/escher-demo
.. _`Protein Data Bank`: http://www.rcsb.org/pdb/secondary.do?p=v2/secondary/visualize.jsp#visualize_pathway
.. _`example gallery`: https://github.com/d3/d3/wiki/Gallery
.. _`get started with Python`: https://www.python.org/about/gettingstarted/
.. _`D3.js`: https://d3js.org
.. _`codecademy`: https://www.codecademy.com
.. _`source code from GitHub`: https://github.com/escher/escher-demo
.. _`escher-test`: https://github.com/escher/escher-test
.. _`ZIP file`: https://github.com/escher/escher-demo/archive/master.zip
.. _`Chrome`: https://developer.chrome.com/devtools
.. _`Firefox`: https://developer.mozilla.org/en-US/docs/Tools
.. _`MDN`: https://developer.mozilla.org/
.. _`React`: https://facebook.github.io/react/
.. _`tutorials`: https://github.com/d3/d3/wiki/Tutorials
.. _`demo website`: http://escher.github.io/escher-demo/custom_tooltips/
.. _`live demo`: http://escher.github.io/escher-demo/custom_tooltips/
.. _`Redux`: http://redux.js.org
