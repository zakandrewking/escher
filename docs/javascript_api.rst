JavaScript API
==============

.. js:class:: escher.Builder(map_data, model_data, embedded_css, options)

    A Builder object contains all the UI and logic to generate a map builder or viewer.

    :param object map_data: The data for a map, to be passed to
                            escher.Map.from_data(). If null, then an empty
                            Builder is initialized

    :param object model_data: The data for a cobra model, to be passed to
                             escher.CobraModel(). Can be null.

    :param string embedded_css: The stylesheet for the SVG elements in the Escher map.

    :param object selection: (Optional, Default: In the body element) The d3
                             selection of an element to place the Builder
                             into. The selection cannot be inside an SVG
                             element.
                                
    :param object options: (Optional) An object defining any of the following
                           options:

        .. js:attribute:: options.unique_map_id

            A unique ID that will be used to UI elements don't interfere when
            multiple maps are in the same HTML document.

        .. js:attribute:: options.primary_metabolite_radius

            (Default: 15) The radius of primary metabolites, in px.

        .. js:attribute:: options.secondary_metabolite_radius

            (Default: 10) The radius of secondary metabolites, in px.

        .. js:attribute:: options.marker_radius

            (Default: 5) The radius of marker nodes, in px.

        .. js:attribute:: options.gene_font_size

            (Default: 18) The font size of the gene reaction rules, in px.

        .. js:attribute:: options.hide_secondary_nodes

            (Default: false) If true, then secondary nodes and segments are
            hidden. This is convenient for generating simplified map figures.

        .. js:attribute:: options.show_gene_reaction_rules

            (Default: false) If true, then show the gene reaction rules, even
            without gene data.

        .. js:attribute:: options.reaction_data

            An object with reaction ids for keys and reaction data points for values.

        .. js:attribute:: options.reaction_styles

        .. js:attribute:: options.reaction_compare_style

            (Default: 'diff') How to compare to datasets. Can be either 'fold, 'log2_fold', or 'diff'.

        .. js:attribute:: options.reaction_scale

        .. js:attribute:: options.reaction_no_data_color

        .. js:attribute:: options.reaction_no_data_size

        .. js:attribute:: options.gene_data

            An object with Gene ids for keys and gene data points for values.

        .. js:attribute:: options.and_method_in_gene_reaction_rule

            (Default: mean) When evaluating a gene reaction rule, use this function to evaluate AND rules. Can be 'mean' or 'min'.

        .. js:attribute:: options.metabolite_data

            An object with metabolite ids for keys and metabolite data points
            for values.

        .. js:attribute:: options.metabolite_compare_style

            (Default: 'diff') How to compare to datasets. Can be either 'fold',
            'log2_fold' or 'diff'.

        .. js:attribute:: options.metabolite_scale

        .. js:attribute:: options.metabolite_no_data_color

        .. js:attribute:: options.metabolite_no_data_size

        *View and build options*

        .. js:attribute:: options.identifiers_on_map

            Either 'bigg_id' (default) or 'name'.

        .. js:attribute:: options.highlight_missing

            (Default: false) If true, then highlight reactions that are not in
            the loaded model in red.

        .. js:attribute:: options.allow_building_duplicate_reactions

            (Default: true) If true, then building duplicate reactions is
            allowed. If false, then duplicate reactions are hidden in *Add
            reaction mode*.

        *Callbacks*

        .. js:attribute:: options.first_load_callback

            A function to run after loading the Builder. 

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

        :param Boolean should_update_data: (Default: true) Whether data should
                                           be applied to the map.

    .. js:function:: load_model(model_data, [should_update_data])
                      
        Load the cobra model from model data.

        :param model_data: The data for a Cobra model. (Parsing in done by
                           escher.CobraModel).

        :param Boolean should_update_data: (Default: true) Whether data should
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

        :param array data: An array of 1 or 2 objects, where each object has
                           keys that are reaction ID's and values that are data
                           points (numbers).
                      
    .. js:function:: set_metabolite_data(data)

        :param array data: An array of 1 or 2 objects, where each object has
                           keys that are metabolite ID's and values that are data
                           points (numbers).
                           
    .. js:function:: set_gene_data(data)
                      
        :param array data: An array of 1 or 2 objects, where each object has
                           keys that are gene ID's and values that are data
                           points (numbers).
