Tutorial: Custom tooltips
-------------------------

In this tutorial, we will learn to build custom tooltips for Escher.

There is a live demo of the custom tooltips here:

  https://escher.github.io/escher-demo/custom_tooltips

Getting ready to develop with Escher
====================================

Before you can make any changes to an Escher map, you will download some source
code an set up a local web server. Here, I will give some simple instructions
with a basic static file server.

NOTE: If you already have experience with JavaScript development, you might want
to download Escher from NPM (as `escher-vis`). If you like Webpack, check out
the `escher-test`_ repository.

The Escher demos have some instructions on running a local server, but I will
provide a little more detail.

To get started, clone this repository using git, or download this `ZIP file`_.

Then, in your favorite terminal, navigate to the folder that contains this
README, and run one of the following commands to start a web server::

    # python 2
    python -c "import SimpleHTTPServer; m = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map; m[''] = 'text/plain'; m.update(dict([(k, v + ';charset=UTF-8') for k, v in m.items()])); SimpleHTTPServer.test();"

    # python 3
    python -m http.server

    # node.js
    http-server -p 8000

`-p` specifies a port

This will start a unicode-friendly Python web
server. Open [http://localhost:8000/](http://localhost:8000/) to see the demos.

Try editing the `minimal_embedded_map/index.html` file, then reload your web
browser to see what you've changed. You can see what's happening under the hood
by opening your Developer tools
([Chrome](https://developer.chrome.com/devtools),
[Firefox](https://developer.mozilla.org/en-US/docs/Tools)). Next, have a look at
the Escher [JavaScript documentation](http://escher.readthedocs.org/) to learn
about the Builder class and its options and methods.

.. _`escher-test`: https://github.com/escher/escher-test
.. _`ZIP file`: https://github.com/escher/escher-demo/archive/master.zip

Method 1: Callback function
===========================

Here is the code.

.. code-block:: javascript

    var tooltips_1 = function (args) {
        if (args.el.childNodes.length === 0) {
            var node = document.createTextNode('Hello ')
            args.el.appendChild(node)
            Object.keys(tooltip_style).map(function (key) {
                args.el.style[key] = tooltip_style[key]
            })
        }
        args.el.childNodes[0].textContent = 'Hello ' + args.state.biggId
    }

Method 2: Callback function with Tinier for rendering
=====================================================

`Tinier`_

Here is the code.

.. code-block:: javascript

     var tooltips_2 = function (args) {
       tinier.render(
         args.el,
         tinier.createElement(
           'div', { style: tooltip_style},
           'Hello tinier ' + args.state.biggId
         )
       )
     }

In place of Tinier, you could also use a library like JQuery here.



Method 3: Tinier Component with state
=====================================

Here is the code.

.. code-block:: javascript

     var tooltips_3 = tinier.createComponent({
       init: function () {
         return {
           biggId: '',
           name: '',
           loc: { x: 0, y: 0 },
           data: null,
           type: null,
           // custom data
           count: 0,
         }
       },

       reducers: {
         setContainerData: function (args) {
           return Object.assign({}, args.state, {
             biggId: args.biggId,
             name: args.name,
             loc: args.loc,
             data: args.data,
             type: args.type,
             count: args.state.count + 1,
           })
         },
       },

       render: function (args) {
         tinier.render(
           args.el,
           tinier.createElement(
             'div', { style: tooltip_style },
             'Hello tinier ' + args.state.biggId + ' ' + args.state.count
           )
         )
       }
     })

state === memory

.. _`Tinier`: https://github.com/zakandrewking/tinier
