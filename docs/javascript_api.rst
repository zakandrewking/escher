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
                                
    :param object options: (Optional) An object defining any of the following options:

       .. js:attribute:: options.menu

	  (Default: 'all') The type of menu that will be displayed. Can be 'all'
	  for the full menu or 'zoom' for just zoom buttons. The 'all' option
	  requires the full set of Escher dependencies (D3.js, JQuery, and
	  Bootstrap), while the 'zoom' option requires only D3.js. For more
	  details, see :doc:`development`.

       .. js:attribute:: options.scroll_behavior

	  (Default: 'pan') This option determines the effect that the scroll
	  wheel will have on an Escher map. Can be 'pan' to pan the map or
	  'zoom' to zoom the map when the user moves the scroll wheel.

       .. js:attribute:: options.enable_editing

	  (Default: true) If true then display the map editing functions. If
	  false, then hide them and only allow the user to view the map.

       .. js:attribute:: option.enable_keys

	  (Default: true) If true then enable keyboard shortcuts.
			 
       .. js:attribute:: options.enable_search

	  (Default: true) If true, then enable indexing of the map for
	  search. Use false to disable searching and potentially improve the map
	  performance.
					   
       .. js:attribute:: options.fill_screen

	  (Default: false) Use true to fill the screen when an Escher Builder is
	  placed in a top-level container (e.g. a div in the body element).
	  
       *Map, model, and styles*

       .. js:attribute:: options.starting_reaction

	  (Default: null) The ID (as a string) of a reaction to draw when the
	  Builder loads.
	  
       .. js:attribute:: options.never_ask_before_quit

	  (Default: false) If false, then display a warning before the user
	  closes an Escher map. If true, then never display the warning. This
	  options is only respected if options.enable_editing == true. If
	  enable_editing is false, then the warnings are not displayed.
					   
       .. js:attribute:: options.unique_map_id

	  (Default: null) A unique ID that will be used to UI elements don't
	  interfere when multiple maps are in the same HTML document.

       .. js:attribute:: options.primary_metabolite_radius

	  (Default: 15) The radius of primary metabolites, in px.

       .. js:attribute:: options.secondary_metabolite_radius

	  (Default: 10) The radius of secondary metabolites, in px.

       .. js:attribute:: options.marker_radius

	  (Default: 5) The radius of marker nodes, in px.

       .. js:attribute:: options.gene_font_size

	  (Default: 18) The font size of the gene reaction rules, in px.

       .. js:attribute:: options.hide_secondary_metabolites

	  (Default: false) If true, then secondary nodes and segments are
	  hidden. This is convenient for generating simplified map figures.

       .. js:attribute:: options.show_gene_reaction_rules

	  (Default: false) If true, then show the gene reaction rules, even
	  without gene data.

       *Applied data*

       .. js:attribute:: options.reaction_data

	  (Default: null) An object with reaction ids for keys and reaction data
	  points for values.

       .. js:attribute:: options.reaction_styles
			 
	  (Default: ['color', 'size', 'text']) An array of style types. The
	  array can contain any of the following: 'color', 'size', 'text',
	  'abs'. The 'color' style means that the reactions will be colored
	  according to the loaded dataset. The 'size' style means that the
	  reactions will be sized according to the loaded dataset. The 'text'
	  style means that the data values will be displayed in the reaction
	  labels. The 'abs' style means the the absolute values of reaction
	  values will be used for data visualization.

       .. js:attribute:: options.reaction_compare_style

	  (Default: 'diff') How to compare to datasets. Can be either 'fold,
	  'log2_fold', or 'diff'.

       .. js:attribute:: options.reaction_scale
			 
	  (Default: [{ type: 'min', color: '#c8c8c8', size: 12 }, { type:
	  'median', color: '#9696ff', size: 20 }, { type: 'max', color:
	  '#ff0000', size: 25 }])

       .. js:attribute:: options.reaction_no_data_color
			 
	  (Default: '#dcdcdc') The color of reactions with no data value.

       .. js:attribute:: options.reaction_no_data_size
			 
	  (Default: 8) The size of reactions with no data value.

       .. js:attribute:: options.gene_data

	  (Default: null) An object with Gene ids for keys and gene data points
	  for values.

       .. js:attribute:: options.and_method_in_gene_reaction_rule

	  (Default: mean) When evaluating a gene reaction rule, use this
	  function to evaluate AND rules. Can be 'mean' or 'min'.

       .. js:attribute:: options.metabolite_data

	  (Default: null) An object with metabolite ids for keys and metabolite
	  data points for values.

       .. js:attribute:: options.metabolite_styles
			 
	  (Default: ['color', 'size', 'text']) An array of style types. The
	  array can contain any of the following: 'color', 'size', 'text',
	  'abs'. The 'color' style means that the metabolites will be colored
	  according to the loaded dataset. The 'size' style means that the
	  metabolites will be sized according to the loaded dataset. The 'text'
	  style means that the data values will be displayed in the metabolite
	  labels. The 'abs' style means the the absolute values of metabolite
	  values will be used for data visualization.

       .. js:attribute:: options.metabolite_compare_style

	  (Default: 'diff') How to compare to datasets. Can be either 'fold',
	  'log2_fold' or 'diff'.

       .. js:attribute:: options.metabolite_scale
			 
	  (Default: [ { type: 'min', color: '#fffaf0', size: 20 }, { type:
	  'median', color: '#f1c470', size: 30 }, { type: 'max', color:
	  '#800000', size: 40 } ])

       .. js:attribute:: options.metabolite_no_data_color
			 
	  (Default: '#ffffff') The color of metabolites with no data value.

       .. js:attribute:: options.metabolite_no_data_size

	  (Default: 10) The size of metabolites with no data value.

       *View and build options*

       .. js:attribute:: options.identifiers_on_map

	  (Default: 'bigg_id') The identifiers that will be displayed in
	  reaction, metabolite, and gene labels. Can be 'bigg_id' or 'name'.

       .. js:attribute:: options.highlight_missing

	  (Default: false) If true, then highlight in red reactions that are not
	  in the loaded COBRA model.

       .. js:attribute:: options.allow_building_duplicate_reactions

	  (Default: true) If true, then building duplicate reactions is
	  allowed. If false, then duplicate reactions are hidden in *Add
	  reaction mode*.

       *Callbacks*

       .. js:attribute:: options.first_load_callback

	  A function to run after loading the Builder. 

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
