JavaScript API
==============

.. js:class:: escher.Builder(map_data, model_data, embedded_css, selection, options)

    A Builder object contains all the UI and logic to generate a map builder or viewer.

    :param object map_data: The data for an Escher map layout. Optional: Pass
                            ``null`` to load an empty Builder.

    :param object model_data: The data for a Cobra model that will be used with
                              the Add Reaction tool to build a layout. Optional:
                              Pass ``null`` to load the Builder without a model.

    :param string embedded_css: The stylesheet for the SVG elements in the
                                Escher map. Optional: Pass ``null`` to use the
                                default style.

    :param object selection: The D3 selection of a HTML element that will hold
                             the Builder, or a reference to a DOM element
                             (e.g. the result of ``document.getElementById``).
                             The selection cannot be a SVG element. Optional:
                             Pass ``null`` to load the Builder in the HTML body.

    :param object options: An object defining any of the following
                           options. Optional: Pass ``null`` to use all default
                           options.

       .. js:attribute:: options.menu

          (Default: ``'all'``) The type of menu that will be displayed. Can be
          'all' for the full menu or 'zoom' for just zoom buttons. The 'all'
          option requires the full set of Escher dependencies (D3.js, JQuery,
          and Bootstrap), while the 'zoom' option requires only D3.js. For more
          details, see :doc:`development`.

       .. js:attribute:: options.scroll_behavior

          (Default: ``'pan'``) This option determines the effect that the scroll
          wheel will have on an Escher map. Can be 'pan' to pan the map or
          'zoom' to zoom the map when the user moves the scroll wheel.

       .. js:attribute:: options.use_3d_transform

          (Default: false) If true, then use CSS3 3D transforms to speed up
          panning and zooming. This feature will only work on browsers that
          `support the 3D transforms`_. In general, this is no longer necessary
          for modern browsers and hardware with small to medium sized maps.

       .. js:attribute:: options.enable_editing

          (Default: ``true``) If true then display the map editing functions. If
          false, then hide them and only allow the user to view the map.

       .. js:attribute:: option.enable_keys

          (Default: ``true``) If true then enable keyboard shortcuts.

       .. js:attribute:: options.enable_search

          (Default: ``true``) If true, then enable indexing of the map for
          search. Use false to disable searching and potentially improve the map
          performance.

       .. js:attribute:: options.fill_screen

          (Default: ``false``) Use true to fill the screen when an Escher
          Builder is placed in a top-level container (e.g. a div in the body
          element).

       .. js:attribute:: options.zoom_to_element

          (Default: ``null``) A reference to an element on the map that will be
          centered after the map loads. The value should be an object with the
          following form, where the type is either ``'reaction'`` or
          ``'node'`` and the element ID refers to the ID of the drawn
          element in the Escher map (not the BiGG ID):

            ``{ type: <TYPE>, id: <ELEMENT ID> }``

       .. js:attribute:: options.full_screen_button

          (Default: ``false``) If the value is ``true``, include a button in the
          user interface for entering full screen mode. Full-screen mode will
          fill the current browser window.

          If the value is an object, it can have the following options to
          activate additional features in full-screen model:

          ``menu``, ``scroll_behavior``, ``enable_editing``, ``enable_keys``,
          ``enable_tooltips``

          These new options will take effect when the user enters full-screen
          mode. When the user exits full-screen mode, the options will revert to
          the values they had when the user entered full-screen mode.

       .. js:attribute:: options.ignore_bootstrap

          (Default: ``false``) Deprecated. Bootstrap is not longer used in Escher.

       **Map, model, and styles**

       .. js:attribute:: options.starting_reaction

          (Default: ``null``) The ID (as a string) of a reaction to draw when
          the Builder loads.

       .. js:attribute:: options.never_ask_before_quit

          (Default: ``false``) If false, then display a warning before the user
          closes an Escher map. If true, then never display the warning. This
          options is only respected if options.enable_editing == true. If
          enable_editing is false, then the warnings are not displayed.

       .. js:attribute:: options.unique_map_id

          (Default: ``null``) Deprecated. Unique map IDs are no longer needed.

       .. js:attribute:: options.primary_metabolite_radius

          (Default: ``15``) The radius of primary metabolites, in px.

       .. js:attribute:: options.secondary_metabolite_radius

          (Default: ``10``) The radius of secondary metabolites, in px.

       .. js:attribute:: options.marker_radius

          (Default: ``5``) The radius of marker nodes, in px.

       .. js:attribute:: options.gene_font_size

          (Default: ``18``) The font size of the gene reaction rules, in px.

       .. js:attribute:: options.hide_secondary_metabolites

          (Default: ``false``) If true, then secondary nodes and segments are
          hidden. This is convenient for generating simplified map figures.

       .. js:attribute:: options.show_gene_reaction_rules

          (Default: ``false``) If true, then show the gene reaction rules, even
          without gene data.

       .. js:attribute:: options.hide_all_labels

          (Default: ``false``) If checked, hide all reaction, gene, and metabolite labels

       .. js:attribute:: options.canvas_size_and_loc

          (Default: ``null``) An object with attributes x, y, width, and height.

       **Applied data**

       .. js:attribute:: options.reaction_data

          (Default: ``null``) An object with reaction ids for keys and reaction
          data points for values.

       .. js:attribute:: options.reaction_styles

          Default: ``['color', 'size', 'text']``

          An array of style types. The array can contain any of the following:
          'color', 'size', 'text', 'abs'. The 'color' style means that the
          reactions will be colored according to the loaded dataset. The
          'size' style means that the reactions will be sized according to the
          loaded dataset. The 'text' style means that the data values will be
          displayed in the reaction labels. The 'abs' style means the the
          absolute values of reaction values will be used for data
          visualization.

       .. js:attribute:: options.reaction_compare_style

          (Default: ``'diff'``) How to compare to datasets. Can be either 'fold,
          'log2_fold', or 'diff'.

       .. js:attribute:: options.reaction_scale

          Default: ``null`` (``options.reaction_scale_preset`` used instead)

          An array of objects that define stops on the data scale.

          Each stop is an object with a type attribute. Types can be 'min', 'max',
          'mean', 'Q1' (first quartile), 'median', 'Q3' (third quartile), or
          'value'. Each point can have a color attribute that specifies a color with
          a string (any CSS color specification is allowed, including hex, rgb, and
          rgba). Each stop can have a size attribute that specifies a reaction
          thickness as a number. Finally, points with type 'value' can have a value
          attribute that specifies an exact number for the stop in the scale.

          NOTE: The scale must have at least 2 stops.

          Here are examples of each type:

          ``{ type: 'min', color: 'red', size: 12 }`` Specifies that reactions
          near the minimum value are red and have thickness 12.

          ``{ type: 'Q1', color: 'rgba(100, 100, 50, 0.5)', size: 12 }``
          Specifies that reactions near the first quartile have the given
          color, opacity, and thickness.

          ``{ type: 'mean', color: 'rgb(100, 100, 50)', size: 50 }`` Specifies
          that reactions near the mean value have the given color and
          thickness.

          ``{ type: 'value', value: 8.5, color: '#333', size: 50 }`` Specifies
          that reactions near 8.5 value have the given color and size.

       .. js:attribute:: options.reaction_scale_preset

          (Default:: ``'GaBuGeRd'``) A preset metabolite scale that will set
          ``options.reaction_scale`` for you. The available scales are here:

          https://github.com/zakandrewking/escher/blob/master/src/scalePresets.js

       .. js:attribute:: options.reaction_no_data_color

          (Default: ``'#dcdcdc'``) The color of reactions with no data value.

       .. js:attribute:: options.reaction_no_data_size

          (Default: ``8``) The size of reactions with no data value.

       .. js:attribute:: options.gene_data

          (Default: ``null``) An object with Gene ids for keys and gene data
          points for values.

       .. js:attribute:: options.and_method_in_gene_reaction_rule

          (Default: ``mean``) When evaluating a gene reaction rule, use this
          function to evaluate AND rules. Can be 'mean' or 'min'.

       .. js:attribute:: options.metabolite_data

          (Default: ``null``) An object with metabolite ids for keys and
          metabolite data points for values.

       .. js:attribute:: options.metabolite_styles

          Default: ``['color', 'size', 'text']``

          An array of style types. The array can contain any of the following:
          'color', 'size', 'text', 'abs'. The 'color' style means that the
          metabolites will be colored according to the loaded dataset. The
          'size' style means that the metabolites will be sized according to the
          loaded dataset. The 'text' style means that the data values will be
          displayed in the metabolite labels. The 'abs' style means the the
          absolute values of metabolite values will be used for data
          visualization.

       .. js:attribute:: options.metabolite_compare_style

          (Default: ``'diff'``) How to compare to datasets. Can be either 'fold',
          'log2_fold' or 'diff'.

       .. js:attribute:: options.metabolite_scale

          Default: ``null`` (``options.metabolite_scale_preset`` used instead)

          An array of objects that define stops on the data scale. See the
          description of **options.reaction_scale** for an explanation of the
          format.

       .. js:attribute:: options.metabolite_scale_preset

          (Default: ``'WhYlRd'``) A preset metabolite scale that will set
          ``options.metabolite_scale`` for you. The available scales are here:

          https://github.com/zakandrewking/escher/blob/master/src/scalePresets.js

       .. js:attribute:: options.metabolite_no_data_color

          (Default: ``'#ffffff'``) The color of metabolites with no data value.

       .. js:attribute:: options.metabolite_no_data_size

          (Default: ``10``) The size of metabolites with no data value.

       **View and build options**

       .. js:attribute:: options.identifiers_on_map

          (Default: ``'bigg_id'``) The identifiers that will be displayed in
          reaction, metabolite, and gene labels. Can be 'bigg_id' or 'name'.

       .. js:attribute:: options.highlight_missing

          (Default: ``false``) If true, then highlight in red reactions that are
          not in the loaded COBRA model.

       .. js:attribute:: options.allow_building_duplicate_reactions

          (Default: ``true``) If true, then building duplicate reactions is
          allowed. If false, then duplicate reactions are hidden in *Add
          reaction mode*.

       .. js:attribute:: options.cofactors

          (Default: ``['atp', 'adp', 'nad', 'nadh', 'nadp', 'nadph', 'gtp',
          'gdp', 'h', 'coa', 'ump', 'h20', 'ppi']``) A list of metabolite IDs to
          treat as cofactors. These will be secondary metabolites in new
          reactions.

       .. js:attribute:: options.tooltip_component

          (Default: ``escher.Tooltip.DefaultTooltip``) A `Preact`_ Component to
          show when hoving over reactions, metabolites, and genes. See
          ``escher.Tooltip.DefaultTooltip`` in the source code for an example of
          a Preact component that defines the default tooltips. And see the
          :doc:`Tooltip Tutorial <developer-tutorial>` for more tips on
          getting started with custom tooltips.

          For correct placement of the tooltip, the tooltip component should
          implement a ``get_size`` function that returns the size of the tooltip
          in pixes with the form: ``{ width: 300, height: 400 }``. Otherwise the
          Builder will assume that your tooltip is 270px wide and 100px tall.

       .. js:attribute:: options.enable_tooltips

          (Default: ``['label']``) Determines the mouseover or touch
          event required to show the related tooltip.['label'] will show
          tooltips upon mouseover or touch of the reaction or metabolite labels
          whereas ['object'] will show the the tooltips over the reaction line
          segments and metabolite circles. Can be set as an empty array to
          disable tooltips or can have both options passed in to enable tooltips
          over both labels and objects.

       .. js:attribute:: options.enable_keys_with_tooltip

          (Default: ``true``) Set this to ``false`` to disallow non-prefixed
          (i.e. not starting with ctrl or cmd) keyboard shortcuts when the
          tooltip is visible. This is useful if your tooltip has text inputs.

       **Callbacks**

       .. js:attribute:: options.first_load_callback

          A function to run after loading the Builder. The Builder instance is
          passed as a single argument to the callback.

    ..
       **Callbacks**

       .. code:: javascript

       this.callback_manager.run('view_mode');
       this.callback_manager.run('build_mode');
       this.callback_manager.run('brush_mode');
       this.callback_manager.run('zoom_mode');
       this.callback_manager.run('rotate_mode');
       this.callback_manager.run('text_mode');
       this.callback_manager.run('load_model', null, model_data, should_update_data);
       this.callback_manager.run('update_data', null, update_model, update_map, kind, should_draw);

    .. js:function:: load_map(map_data, [should_update_data])

       Load a map for the loaded data. Also reloads most of the Builder content.

       :param map_data: The data for a map.

       :param Boolean should_update_data: (Default: ``true``) Whether data
                                          should be applied to the map.

    .. js:function:: load_model(model_data, [should_update_data])

       Load the cobra model from model data.

       :param model_data: The data for a Cobra model. (Parsing in done by
                          escher.CobraModel).

       :param Boolean should_update_data: (Default: ``true``) Whether data should
                                          be applied to the model.

    .. js:function:: view_mode()

       Enter view mode.

    .. js:function:: build_mode()

       Enter build mode.

    .. js:function:: brush_mode()

       Enter brush mode.

    .. js:function:: zoom_mode()

       Enter zoom mode.

    .. js:function:: rotate_mode()

       Enter rotate mode.

    .. js:function:: text_mode()

       Enter text mode.

    .. js:function:: set_reaction_data(data)

       :param array data: An array of 1 or 2 objects, where each object has keys
                          that are reaction ID's and values that are data points
                          (numbers).

       :param Boolean set_in_settings: (Optional, Default: ``true``) Used
                                       internally to set the data from the
                                       Settings class.

    .. js:function:: set_metabolite_data(data)

       :param array data: An array of 1 or 2 objects, where each object has keys
                          that are metabolite ID's and values that are data
                          points (numbers).

       :param Boolean set_in_settings: (Optional, Default: ``true``) Used
                                       internally to set the data from the
                                       Settings class.

    .. js:function:: set_gene_data(data, clear_gene_reaction_rules)

       :param array data: An array of 1 or 2 objects, where each object has keys
                          that are gene ID's and values that are data points
                          (numbers).

       :param Boolean clear_gene_reaction_rules: (Optional, Default: ``false``)
                                                 In addition to setting the
                                                 data, also turn of the
                                                 gene_reaction_rules.

       :param Boolean set_in_settings: (Optional, Default: ``true``) Used
                                       internally to set the data from the
                                       Settings class.

.. _`support the 3D transforms`: http://caniuse.com/#feat=transforms3d
.. _`Preact`: https://preactjs.com/
