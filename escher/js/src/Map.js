define(["utils", "draw", "Behavior", "Scale", "build", "UndoStack", "CallbackManager", "KeyManager", "Canvas", "data_styles", "SearchIndex"], function(utils, draw, Behavior, Scale, build, UndoStack, CallbackManager, KeyManager, Canvas, data_styles, SearchIndex) {
    /** Defines the metabolic map data, and manages drawing and building.

     Arguments
     ---------
     selection: A d3 selection for a node to place the map inside. Should be an SVG element.
     behavior: A Behavior object which defines the interactivity of the map.

     */

    var Map = utils.make_class();
    // static methods
    Map.from_data = from_data;
    // instance methods
    Map.prototype = {
	// setup
	init: init,
	// more setup
	setup_containers: setup_containers,
	reset_containers: reset_containers,
	// scales
	get_scale: get_scale,
	set_scale: set_scale,
	// appearance
	set_status: set_status,
	set_model: set_model,
	set_reaction_data: set_reaction_data,
	set_metabolite_data: set_metabolite_data,
	clear_map: clear_map,
	// selection
	select_none: select_none,
	select_metabolite: select_metabolite,
	select_metabolite_with_id: select_metabolite_with_id,
	select_single_node: select_single_node,
	deselect_nodes: deselect_nodes,
	select_text_label: select_text_label,
	deselect_text_labels: deselect_text_labels,
	// build
	new_reaction_from_scratch: new_reaction_from_scratch,
	new_reaction_for_metabolite: new_reaction_for_metabolite,
	cycle_primary_node: cycle_primary_node,
	make_selected_node_primary: make_selected_node_primary,
	extend_nodes: extend_nodes,
	extend_reactions: extend_reactions,
	// delete
	delete_selected: delete_selected,
	delete_nodes: delete_nodes,
	delete_text_labels: delete_text_labels,
	delete_node_data: delete_node_data,
	delete_segment_data: delete_segment_data,
	delete_reaction_data: delete_reaction_data,
	delete_text_label_data: delete_text_label_data,
	// find
	get_selected_node_ids: get_selected_node_ids,
	get_selected_nodes: get_selected_nodes,
	get_selected_text_label_ids: get_selected_text_label_ids,
	get_selected_text_labels: get_selected_text_labels,
	segments_and_reactions_for_nodes: segments_and_reactions_for_nodes,
	// draw
	has_reaction_data: has_reaction_data,
	has_metabolite_data: has_metabolite_data,
	draw_everything: draw_everything,
	draw_all_reactions: draw_all_reactions,
	draw_these_reactions: draw_these_reactions,
	draw_all_nodes: draw_all_nodes,
	draw_these_nodes: draw_these_nodes,
	draw_these_text_labels: draw_these_text_labels,
	apply_reaction_data_to_map: apply_reaction_data_to_map,
	apply_reaction_data_to_reactions: apply_reaction_data_to_reactions,
	update_reaction_data_domain: update_reaction_data_domain,
	apply_metabolite_data_to_map: apply_metabolite_data_to_map,
	apply_metabolite_data_to_nodes: apply_metabolite_data_to_nodes,
	update_metabolite_data_domain: update_metabolite_data_domain,
	get_selected_node_ids: get_selected_node_ids,
	toggle_beziers: toggle_beziers,
	hide_beziers: hide_beziers,
	show_beziers: show_beziers,
	// zoom
	zoom_extent_nodes: zoom_extent_nodes,
	zoom_extent_canvas: zoom_extent_canvas,
	_zoom_extent: _zoom_extent,
	get_size: get_size,
	zoom_to_reaction: zoom_to_reaction,
	zoom_to_node: zoom_to_node,
	highlight_reaction: highlight_reaction,
	highlight_node: highlight_node,
	highlight: highlight,
	// io
	save: save,
	map_for_export: map_for_export,
	save_svg: save_svg
    };

    return Map;

    // -------------------------------------------------------------------------
    // setup

    function init(svg, css, selection, zoom_container, auto_set_data_domain,
		  reaction_data, reaction_data_styles, metabolite_data,
		  metabolite_data_styles, cobra_model, canvas_size_and_loc,
		  enable_search) {
	if (canvas_size_and_loc===null) {
	    var size = zoom_container.get_size();
	    canvas_size_and_loc = {x: -size.width, y: -size.height,
				   width: size.width*3, height: size.height*3};
	}

	// defaults
	this.default_reaction_color = '#334E75',

	// set up the defs
	this.svg = svg;
	this.defs = utils.setup_defs(svg, css);

	// make the canvas
	this.canvas = new Canvas(selection, canvas_size_and_loc);

	this.setup_containers(selection);
	this.sel = selection;
	this.zoom_container = zoom_container;

	this.auto_set_data_domain = auto_set_data_domain;

	// check and load data
	this.reaction_data_object = data_styles.import_and_check(reaction_data,
								 reaction_data_styles,
								 'reaction_data');
	this.reaction_data_styles = reaction_data_styles;
	this.metabolite_data_object = data_styles.import_and_check(metabolite_data,
								   metabolite_data_styles,
								   'metabolite_data');
	this.metabolite_data_styles = metabolite_data_styles;

	// set the model AFTER loading the datasets
	this.set_model(cobra_model);

	this.largest_ids = { reactions: -1,
			     nodes: -1,
			     segments: -1 };

	// make the scales
	this.scale = new Scale();

	// make the undo/redo stack
	this.undo_stack = new UndoStack();

	// make a behavior object
	this.behavior = new Behavior(this, this.undo_stack);

	// make a key manager
	this.key_manager = new KeyManager();

	// make the search index
	this.enable_search = enable_search;
	this.search_index = new SearchIndex();

	// deal with the window
	var window_translate = {'x': 0, 'y': 0},
	    window_scale = 1;

	// hide beziers
	this.beziers_enabled = false;

	// set up the callbacks
	this.callback_manager = new CallbackManager();
	
	this.nodes = {};
	this.reactions = {};
	this.membranes = [];
	this.text_labels = {};
	this.info = {};

	// rotation mode off
	this.rotation_on = false;

	// performs some extra checks
	this.debug = false;
    };

    // -------------------------------------------------------------------------
    // Import

    function from_data(map_data, svg, css, selection, zoom_container,
		       auto_set_data_domain, reaction_data, reaction_data_styles,
		       metabolite_data, metabolite_data_styles, cobra_model,
		       enable_search) {
	/** Load a json map and add necessary fields for rendering.
	 
	 */
	utils.check_undefined(arguments, ['map_data', 'svg', 'css', 'selection',
					  'zoom_container', 'auto_set_data_domain',
					  'reaction_data', 'reaction_data_styles',
					  'metabolite_data', 'metabolite_data_styles',
					  'cobra_model', 'enable_search']);

	if (this.debug) {
	    d3.json('map_spec.json', function(error, spec) {
		if (error) {
		    console.warn(error);
		    return;
		}
		utils.check_r(map_data, spec.spec, spec.can_be_none);
	    });
	}
	
	var canvas = map_data.canvas,
	    map = new Map(svg, css, selection, zoom_container, auto_set_data_domain,
			  reaction_data, reaction_data_styles, metabolite_data,
			  metabolite_data_styles, cobra_model, canvas,
			  enable_search);

	map.reactions = map_data.reactions;
	map.nodes = map_data.nodes;
	map.membranes = map_data.membranes;
	map.text_labels = map_data.text_labels;
	map.info = map_data.info;

	// propogate coefficients and reversbility, and populate the search index
	for (var r_id in map.reactions) {
	    var reaction = map.reactions[r_id];
	    if (enable_search) {
		map.search_index.insert('r'+r_id, { 'name': reaction.bigg_id,
						    'data': { type: 'reaction',
							      reaction_id: r_id }});
	    }
	    for (var s_id in reaction.segments) {
		var segment = reaction.segments[s_id];
		segment.reversibility = reaction.reversibility;
		var from_node_bigg_id = map.nodes[segment.from_node_id].bigg_id;
		if (from_node_bigg_id in reaction.metabolites) {
		    segment.from_node_coefficient = reaction.metabolites[from_node_bigg_id].coefficient;
		}
		var to_node_bigg_id = map.nodes[segment.to_node_id].bigg_id;
		if (to_node_bigg_id in reaction.metabolites) {
		    segment.to_node_coefficient = reaction.metabolites[to_node_bigg_id].coefficient;
		}
		// if metabolite without beziers, then add them
		var start = map.nodes[segment.from_node_id],
		    end = map.nodes[segment.to_node_id];
		if (start['node_type']=='metabolite' || end['node_type']=='metabolite') {
		    var midpoint = utils.c_plus_c(start, utils.c_times_scalar(utils.c_minus_c(end, start), 0.5));
		    if (segment.b1 === null) segment.b1 = midpoint;
		    if (segment.b2 === null) segment.b2 = midpoint;
		}

	    }
	}
	if (enable_search) {
	    for (var node_id in map.nodes) {
		var node = map.nodes[node_id];
		if (node.node_type!='metabolite') continue;
		map.search_index.insert('n'+node_id, { 'name': node.bigg_id,
						       'data': { type: 'metabolite',
								 node_id: node_id }});
	    }
	}
	// get largest ids for adding new reactions, nodes, text labels, and
	// segments
	map.largest_ids.reactions = get_largest_id(map.reactions);
	map.largest_ids.nodes = get_largest_id(map.nodes);
	map.largest_ids.text_labels = get_largest_id(map.text_labels);

	var largest_segment_id = 0;
	for (var id in map.reactions) {
	    largest_segment_id = get_largest_id(map.reactions[id].segments,
						largest_segment_id);
	}
	map.largest_ids.segments = largest_segment_id;

	// reaction_data onto existing map reactions
	map.apply_reaction_data_to_map();
	map.apply_metabolite_data_to_map();

	return map;

	// definitions
	function get_largest_id(obj, current_largest) {
	    /** Return the largest integer key in obj, or current_largest, whichever is bigger. */
	    if (current_largest===undefined) current_largest = 0;
	    if (obj===undefined) return current_largest;
	    return Math.max.apply(null, Object.keys(obj).map(function(x) {
		return parseInt(x);
	    }).concat([current_largest]));
	}
    }

    // ---------------------------------------------------------------------
    // more setup

    function setup_containers(sel) {
        sel.append('g')
	    .attr('id', 'membranes');
        sel.append('g')
	    .attr('id', 'reactions');
        sel.append('g')
	    .attr('id', 'nodes');
        sel.append('g')
	    .attr('id', 'text-labels');
    }
    function reset_containers() {
	this.sel.select('#membranes')
	    .selectAll('.membrane')
	    .remove();
	this.sel.select('#reactions')
	    .selectAll('.reaction')
	    .remove();
	this.sel.select('#nodes')
	    .selectAll('.node')
	    .remove();
	this.sel.select('#text-labels')
	    .selectAll('.text-label')
	    .remove();
    }

    // -------------------------------------------------------------------------
    // Scales

    function get_scale(data, type) {
	/** Get a reaction or metabolite scale.

	 Arguments
	 ---------
	 
	 data: The type of data. Options are 'reaction' or 'metabolite'.

	 type: The type of scale to set. Options are 'size' and 'color'.

	 */

	if (data=='reaction' && type=='size') {
	    return this.scale.reaction_size;
	} else if (data=='reaction' && type=='color') {
	    return this.scale.reaction_color;
	} else if (data=='metabolite' && type=='size') {
	    return this.scale.metabolite_size;
	} else if (data=='metabolite' && type=='color') {
	    return this.scale.metabolite_color;
	} else {
	    throw Error('Bad value for data or type: ' + data + ', ' + type);
	}
    }

    function set_scale(data, type, domain, range) {
	/** Set a reaction or metabolite scale.

	 Arguments
	 ---------
	 
	 data: The type of data. Options are 'reaction' or 'metabolite'.

	 type: The type of scale to set. Options are 'size' and 'color'.

	 domain: The new scale domain. If domain is *null*, then the existing
	 domain is used. If *Builder.options.auto_set_data_domain* is true,
	 then, this input is ignored.

	 */

	if (domain===undefined) domain = null;
	if (range===undefined) range = null;

	if (domain !== null && this.auto_set_data_domain==true) {
	    console.warn('Cannot set domain manually if auto_set_data_domain is true');
	    domain = null;
	}

	if (data=='reaction' && type=='size') {
	    set_this_scale(this.scale.reaction_size, domain, range);
	} else if (data=='reaction' && type=='color') {
	    set_this_scale(this.scale.reaction_color, domain, range);
	} else if (data=='metabolite' && type=='size') {
	    set_this_scale(this.scale.metabolite_size, domain, range);
	} else if (data=='metabolite' && type=='color') {
	    set_this_scale(this.scale.metabolite_color, domain, range);
	} else {
	    throw Error('Bad value for data or type: ' + data + ', ' + type);
	}

	function set_this_scale(a_scale, a_domain, a_range) {
	    if (a_domain !== null) a_scale.domain(a_domain);
	    if (a_range !== null) a_scale.range(a_range);
	}
    }

    // -------------------------------------------------------------------------
    // Appearance

    function set_status(status) {
	this.status = status;
	this.callback_manager.run('set_status', status);
    }
    function set_model(model) {
	/** Change the cobra model for the map.

	 */
	this.cobra_model = model;
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_reaction_data(this.reaction_data_object,
						 this.reaction_data_styles);
	    this.cobra_model.apply_metabolite_data(this.metabolite_data_object,
						   this.metabolite_data_styles);
	}
    }
    function set_reaction_data(reaction_data) {
	/** Set a new reaction data, and redraw the map.

	 Pass null to reset the map and draw without reaction data.

	 */
	this.reaction_data_object = data_styles.import_and_check(reaction_data,
								 this.reaction_data_styles,
								 'reaction_data');
	this.apply_reaction_data_to_map();
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_reaction_data(this.reaction_data_object,
						 this.reaction_data_styles);
	}
	this.draw_all_reactions();
    }
    function set_metabolite_data(metabolite_data) {
	/** Set a new metabolite data, and redraw the map.

	 Pass null to reset the map and draw without metabolite data.

	 */
	this.metabolite_data_object = data_styles.import_and_check(metabolite_data,
								   this.metabolite_data_styles,
								   'metabolite_data');
	this.apply_metabolite_data_to_map();
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_metabolite_data(this.metabolite_data_object,
						   this.metabolite_data_styles);
	}
	this.draw_all_nodes();
    }
    function clear_map() {
	this.reactions = {};
	this.nodes = {};
	this.membranes = [];
	this.text_labels = {};
	// reaction_data onto existing map reactions
	this.apply_reaction_data_to_map();
	this.apply_metabolite_data_to_map();
	this.draw_everything();
    }
    function has_reaction_data() {
	return (this.reaction_data_object!==null);
    }
    function has_metabolite_data() {
	return (this.metabolite_data_object!==null);
    }
    function draw_everything() {
        /** Draw the reactions and membranes

         */
	var sel = this.sel,
	    membranes = this.membranes,
	    scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    text_labels = this.text_labels,
	    defs = this.defs,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    node_click_fn = this.behavior.node_click,
	    node_mouseover_fn = this.behavior.node_mouseover,
	    node_mouseout_fn = this.behavior.node_mouseout,
	    node_drag_behavior = this.behavior.node_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    text_label_click = this.behavior.text_label_click,
	    text_label_drag = this.behavior.text_label_drag,
	    has_reaction_data = this.has_reaction_data(),
	    reaction_data_styles = this.reaction_data_styles,
	    has_metabolite_data = this.has_metabolite_data(),
	    metabolite_data_styles = this.metabolite_data_styles,
	    beziers_enabled = this.beziers_enabled;

	utils.draw_an_array(sel, '#membranes' ,'.membrane', membranes,
			    draw.create_membrane,
			    draw.update_membrane);

	utils.draw_an_object(sel, '#reactions', '.reaction', reactions,
			     'reaction_id',
			     draw.create_reaction, 
			     function(sel) { return draw.update_reaction(sel,
									 scale, 
									 nodes,
									 beziers_enabled, 
									 defs,
									 default_reaction_color,
									 has_reaction_data,
									 reaction_data_styles,
									 bezier_drag_behavior,
									 reaction_label_drag); });

	utils.draw_an_object(sel, '#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return draw.create_node(sel, nodes, reactions); },
			     function(sel) { return draw.update_node(sel, scale,
								     has_metabolite_data,
								     metabolite_data_styles,
								     node_click_fn,
								     node_mouseover_fn,
								     node_mouseout_fn,
								     node_drag_behavior,
								     node_label_drag); });

	utils.draw_an_object(sel, '#text-labels', '.text-label', text_labels,
			     'text_label_id',
			     function(sel) { return draw.create_text_label(sel); }, 
			     function(sel) { return draw.update_text_label(sel,
									   text_label_click,
									   text_label_drag); });


    }
    function draw_all_reactions() {
	var reaction_ids = [];
	for (var reaction_id in this.reactions) {
	    reaction_ids.push(reaction_id);
	}
	this.draw_these_reactions(reaction_ids);
    }
    function draw_these_reactions(reaction_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    defs = this.defs,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    has_reaction_data = this.has_reaction_data(),
	    reaction_data_styles = this.reaction_data_styles,
	    beziers_enabled = this.beziers_enabled;

        // find reactions for reaction_ids
        var reaction_subset = {},
	    i = -1;
        while (++i<reaction_ids.length) {
	    reaction_subset[reaction_ids[i]] = utils.clone(reactions[reaction_ids[i]]);
        }
        if (reaction_ids.length != Object.keys(reaction_subset).length) {
	    console.warn('did not find correct reaction subset');
        }

        // generate reactions for o.drawn_reactions
        // assure constancy with cobra_id
        var sel = this.sel.select('#reactions')
                .selectAll('.reaction')
                .data(utils.make_array(reaction_subset, 'reaction_id'),
		      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(draw.create_reaction);

        // update: update when necessary
        sel.call(function(sel) { return draw.update_reaction(sel, scale, 
							     nodes,
							     beziers_enabled, 
							     defs,
							     default_reaction_color,
							     has_reaction_data,
							     reaction_data_styles,
							     bezier_drag_behavior,
							     reaction_label_drag); });

        // exit
        sel.exit();
    }
    function draw_all_nodes() {
	var node_ids = [];
	for (var node_id in this.nodes) {
	    node_ids.push(node_id);
	}
	this.draw_these_nodes(node_ids);
    }
    function draw_these_nodes(node_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    node_click_fn = this.behavior.node_click,
	    node_mouseover_fn = this.behavior.node_mouseover,
	    node_mouseout_fn = this.behavior.node_mouseout,
	    node_drag_behavior = this.behavior.node_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    metabolite_data_styles = this.metabolite_data_styles,
	    has_metabolite_data = this.has_metabolite_data();

	// find nodes for node_ids
        var node_subset = {},
	    i = -1;
        while (++i<node_ids.length) {
	    node_subset[node_ids[i]] = utils.clone(nodes[node_ids[i]]);
        }
        if (node_ids.length != Object.keys(node_subset).length) {
	    console.warn('did not find correct node subset');
        }

        // generate nodes for o.drawn_nodes
        // assure constancy with cobra_id
        var sel = this.sel.select('#nodes')
                .selectAll('.node')
                .data(utils.make_array(node_subset, 'node_id'),
		      function(d) { return d.node_id; });

        // enter: generate and place node
        sel.enter().call(function(sel) { return draw.create_node(sel, nodes, reactions); });

        // update: update when necessary
        sel.call(function(sel) { return draw.update_node(sel, scale, has_metabolite_data, metabolite_data_styles, 
							 node_click_fn,
							 node_mouseover_fn,
							 node_mouseout_fn,
							 node_drag_behavior,
							 node_label_drag); });

        // exit
        sel.exit();
    }
    function draw_these_text_labels(text_label_ids) {
	var text_labels = this.text_labels,
	    text_label_click = this.behavior.text_label_click,
	    text_label_drag = this.behavior.text_label_drag;

	// find text labels for text_label_ids
        var text_label_subset = {},
	    i = -1;
        while (++i<text_label_ids.length) {
	    text_label_subset[text_label_ids[i]] = utils.clone(text_labels[text_label_ids[i]]);
        }
        if (text_label_ids.length != Object.keys(text_label_subset).length) {
	    console.warn('did not find correct text label subset');
        }

        // generate text for this.text_labels
        var sel = this.sel.select('#text-labels')
                .selectAll('.text-label')
                .data(utils.make_array(text_label_subset, 'text_label_id'),
		      function(d) { return d.text_label_id; });

        // enter: generate and place label
        sel.enter().call(function(sel) {
	    return draw.create_text_label(sel);
	});

        // update: update when necessary
        sel.call(function(sel) {
	    return draw.update_text_label(sel, text_label_click, text_label_drag);
	});

        // exit
        sel.exit();
    }
    function apply_reaction_data_to_map() {
	/**  Returns True if the scale has changed.

	 */
	return this.apply_reaction_data_to_reactions(this.reactions);
    }
    function apply_reaction_data_to_reactions(reactions) {
	/**  Returns True if the scale has changed.

	 */
	if (!this.has_reaction_data()) {
	    for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id];
		reaction.data = null;
		reaction.data_string = '';
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.data = null;
		}
	    }
	    return false;
	}
	// grab the data
	var data = this.reaction_data_object,
	    styles = this.reaction_data_styles;
	// apply the datasets to the reactions	
	for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id],
		d = (reaction.bigg_id in data ? data[reaction.bigg_id] : null),
		f = data_styles.float_for_data(d, styles),
		s = data_styles.text_for_data(d, styles);
	    reaction.data = f;
	    reaction.data_string = s;
	    // apply to the segments
	    for (var segment_id in reaction.segments) {
		var segment = reaction.segments[segment_id];
		segment.data = f;
	    }
	}
	return this.update_reaction_data_domain();
    }
    function update_reaction_data_domain() {
	/**  Returns True if the scale has changed.

	 */

	if (!this.auto_set_data_domain) return false;

	// default min and max
	var vals = [];
	for (var reaction_id in this.reactions) {
	    var reaction = this.reactions[reaction_id];
	    if (reaction.data!==null) {
		vals.push(reaction.data);
	    }
	}
	
	var old_domain = this.scale.reaction_color.domain(),
	    new_domain, new_color_range, new_size_range;
	    
	if (this.reaction_data_styles.indexOf('Abs') != -1) {
	    var min = 0, max = 0;
	    if (vals.length > 0) {
		vals = vals.map(function(x) { return Math.abs(x); });
		min = Math.min.apply(null, vals),
		max = Math.max.apply(null, vals);
	    } 
	    if (max==0) max = min = 10;
	    if (min==max) min = max/2;
	    new_domain = [-max, -min, 0, min, max];
	    new_color_range = ["red", "blue", "rgb(200,200,200)", "blue", "red"];
	    new_size_range = [12, 6, 6, 6, 12];
	} else {
	    var min = 0, max = 0;
	    vals.push(0);
	    if (vals.length > 0) {
		min = Math.min.apply(null, vals),
		max = Math.max.apply(null, vals);
	    }
	    new_domain = [min, max];
	    new_color_range = ["blue", "red"];
	    new_size_range = [6, 12];
	}
	this.scale.reaction_color.domain(new_domain).range(new_color_range);
	this.scale.reaction_size.domain(new_domain).range(new_size_range);
	// run the callback
	this.callback_manager.run('update_reaction_data_domain');
	// compare arrays
	return !utils.compare_arrays(old_domain, new_domain);
    }
    function apply_metabolite_data_to_map() {
	/**  Returns True if the scale has changed.

	 */
	return this.apply_metabolite_data_to_nodes(this.nodes);
    }
    function apply_metabolite_data_to_nodes(nodes) {
	/**  Returns True if the scale has changed.

	 */
	if (!this.has_metabolite_data()) {
	    for (var node_id in nodes) {
		nodes[node_id].data = null;
		nodes[node_id].data_string = '';
	    }
	    return false;
	}
	// grab the data
	var data = this.metabolite_data_object,
	    styles = this.metabolite_data_styles;
	for (var node_id in nodes) {
	    var node = nodes[node_id],
		d = (node.bigg_id in data ? data[node.bigg_id] : null),
		f = data_styles.float_for_data(d, styles),
		s = data_styles.text_for_data(d, styles);
	    node.data = f;
	    node.data_string = s;
	}
	return this.update_metabolite_data_domain();
    }
    function update_metabolite_data_domain() {
	/**  Returns True if the scale has changed.

	 */

	if (!this.auto_set_data_domain) return false;

	// default min and max
	var min = 0, max = 0, vals = [];
	for (var node_id in this.nodes) {
	    var node = this.nodes[node_id];
	    if (node.data!==null)
		vals.push(node.data);
	}
	if (vals.length > 0) {
	    min = Math.min.apply(null, vals),
	    max = Math.max.apply(null, vals);
	} 
	var old_domain = this.scale.metabolite_size.domain(),
	    new_domain, new_color_range, new_size_range;

	if (this.metabolite_data_styles.indexOf('Abs') != -1) {
	    var min = 0, max = 0;
	    if (vals.length > 0) {
		vals = vals.map(function(x) { return Math.abs(x); });
		min = Math.min.apply(null, vals),
		max = Math.max.apply(null, vals);
	    } 
	    if (max==0) max = min = 10;
	    if (min==max) min = max/2;
	    new_domain = [-max, -min, 0, min, max];
	    new_color_range = ["red", "white", "white", "white", "red"];
	    new_size_range = [15, 8, 8, 8, 18];
	} else {
	    var min = 0, max = 0;
	    vals.push(0);
	    if (vals.length > 0) {
		min = Math.min.apply(null, vals),
		max = Math.max.apply(null, vals);
	    }
	    new_domain = [min, max];
	    new_color_range = ["white", "red"];
	    new_size_range = [8, 15];
	}
	this.scale.metabolite_color.domain(new_domain).range(new_color_range);
	this.scale.metabolite_size.domain(new_domain).range(new_size_range);
	// run the callback
	this.callback_manager.run('update_metabolite_data_domain');
	// compare arrays
	return !utils.compare_arrays(old_domain, new_domain);
    }

    // ---------------------------------------------------------------------
    // Node interaction
    
    function get_coords_for_node(node_id) {
        var node = this.nodes[node_id],
	    coords = {'x': node.x, 'y': node.y};
        return coords;
    }
    function get_selected_node_ids() {
	var selected_node_ids = [];
	this.sel.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_node_ids.push(d.node_id); });
	return selected_node_ids;
    }
    function get_selected_nodes() {
	var selected_nodes = {},
	    self = this;
	this.sel.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_nodes[d.node_id] = self.nodes[d.node_id]; });
	return selected_nodes;
    }	
    function get_selected_text_label_ids() {
	var selected_text_label_ids = [];
	this.sel.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_label_ids.push(d.text_label_id); });
	return selected_text_label_ids;
    }	
    function get_selected_text_labels() {
	var selected_text_labels = {},
	    self = this;
	this.sel.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_labels[d.text_label_id] = self.text_labels[d.text_label_id]; });
	return selected_text_labels;
    }	

    function select_none() {
	this.sel.selectAll('.selected')
	    .classed('selected', false);
    }

    function select_metabolite_with_id(node_id) {
	// deselect all text labels
	this.deselect_text_labels();

	var node_selection = this.sel.select('#nodes').selectAll('.node'),
	    coords,
	    selected_node;
	node_selection.classed("selected", function(d) {
	    var selected = String(d.node_id) == String(node_id);
	    if (selected) {
		selected_node = d;
		coords = { x: d.x, y: d.y };
	    }
	    return selected;
	});
	this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	this.callback_manager.run('select_metabolite_with_id', selected_node, coords);
    }
    function select_metabolite(sel, d) {
	// deselect all text labels
	this.deselect_text_labels();
	
	var node_selection = this.sel.select('#nodes').selectAll('.node'), 
	    shift_key_on = this.key_manager.held_keys.shift;
	if (shift_key_on) {
	    d3.select(sel.parentNode)
		.classed("selected", !d3.select(sel.parentNode).classed("selected"));
	}
        else node_selection.classed("selected", function(p) { return d === p; });
	var selected_nodes = this.sel.select('#nodes').selectAll('.selected'),
	    count = 0,
	    coords,
	    selected_node;
	selected_nodes.each(function(d) {
	    selected_node = d;
	    coords = { x: d.x, y: d.y };
	    count++;
	});
	this.callback_manager.run('select_metabolite', count, selected_node, coords);
    }
    function select_single_node() {
	/** Unselect all but one selected node, and return the node.

	 If no nodes are selected, return null.

	 */
	var out = null,
	    self = this,
	    node_selection = this.sel.select('#nodes').selectAll('.selected');
	node_selection.classed("selected", function(d, i) {
	    if (i==0) {
		out = d;
		return true;
	    } else {
		return false;
	    }
	});
	return out;		   
    }
    function deselect_nodes() {
	var node_selection = this.sel.select('#nodes').selectAll('.node');
	node_selection.classed("selected", false);
    }
    function select_text_label(sel, d) {
	// deselect all nodes
	this.deselect_nodes();
	// find the new selection
	// Ignore shift key and only allow single selection for now
	var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
	text_label_selection.classed("selected", function(p) { return d === p; });
	var selected_text_labels = this.sel.select('#text-labels').selectAll('.selected'),
	    coords;
	selected_text_labels.each(function(d) {
	    coords = { x: d.x, y: d.y };
	});
	this.callback_manager.run('select_text_label');
    }
    function deselect_text_labels() {
	var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
	text_label_selection.classed("selected", false);
    }

    // ---------------------------------------------------------------------
    // Delete

    function delete_selected() {
	/** Delete the selected nodes and associated segments and reactions, and selected labels.

	 Undoable.

	 */
	var selected_nodes = this.get_selected_nodes();
	if (Object.keys(selected_nodes).length >= 1)
	    this.delete_nodes(selected_nodes);
	
	var selected_text_labels = this.get_selected_text_labels();
	if (Object.keys(selected_text_labels).length >= 1)
	    this.delete_text_labels(selected_text_labels);
    }
    function delete_nodes(selected_nodes) {
	/** Delete the nodes and associated segments and reactions.

	 Undoable.

	 */
	var out = this.segments_and_reactions_for_nodes(selected_nodes),
	    reactions = out.reactions,
	    segment_objs_w_segments = out.segment_objs_w_segments;

	// copy nodes to undelete
	var saved_nodes = utils.clone(selected_nodes),
	    saved_segment_objs_w_segments = utils.clone(segment_objs_w_segments),
	    saved_reactions = utils.clone(reactions),
	    delete_and_draw = function(nodes, reactions, segment_objs) {
		// delete nodes, segments, and reactions with no segments
  		this.delete_node_data(Object.keys(selected_nodes));
		this.delete_segment_data(segment_objs);
		this.delete_reaction_data(Object.keys(reactions));
		// redraw
		// TODO just redraw these nodes and segments
		this.draw_everything();
	    }.bind(this);

	// delete
	delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // redraw the saved nodes, reactions, and segments

	    this.extend_nodes(saved_nodes);
	    this.extend_reactions(saved_reactions);
	    var reactions_to_draw = Object.keys(saved_reactions);
	    saved_segment_objs_w_segments.forEach(function(segment_obj) {
		var segment = segment_obj.segment;
		this.reactions[segment_obj.reaction_id]
		    .segments[segment_obj.segment_id] = segment;

		// updated connected nodes
		[segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		    // not necessary for the deleted nodes
		    if (node_id in saved_nodes) return;
		    var node = this.nodes[node_id];
		    node.connected_segments.push({ reaction_id: segment_obj.reaction_id,
						   segment_id: segment_obj.segment_id });
		}.bind(this));

		if (reactions_to_draw.indexOf(segment_obj.reaction_id)==-1)
		    reactions_to_draw.push(segment_obj.reaction_id);
	    }.bind(this));
	    this.draw_these_nodes(Object.keys(saved_nodes));
	    this.draw_these_reactions(reactions_to_draw);
	    // copy nodes to re-delete
	    selected_nodes = utils.clone(saved_nodes);
	    segment_objs_w_segments = utils.clone(saved_segment_objs_w_segments);
	    reactions = utils.clone(saved_reactions);
	}.bind(this), function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);
	}.bind(this));
    }
    function delete_text_labels(selected_text_labels) {
	/** Delete the text_labels.

	 Undoable.

	 */
	// copy text_labels to undelete
	var saved_text_labels = utils.clone(selected_text_labels),
	    self = this,
	    delete_and_draw = function(text_labels) {
		// delete text_labels, segments, and reactions with no segments
  		self.delete_text_label_data(Object.keys(selected_text_labels));
		// redraw
		// TODO just redraw these text_labels
		self.draw_everything();
	    };

	// delete
	delete_and_draw(selected_text_labels);

	// add to undo/redo stack
	this.undo_stack.push(function() { // undo
	    // redraw the saved text_labels, reactions, and segments
	    utils.extend(self.text_labels, saved_text_labels);
	    self.draw_these_text_labels(Object.keys(saved_text_labels));
	    // copy text_labels to re-delete
	    selected_text_labels = utils.clone(saved_text_labels);
	}, function () { // redo
	    // clone the text_labels
	    delete_and_draw(selected_text_labels);
	});
    }
    function delete_node_data(node_ids) {
	/** Delete nodes, and remove from search index.
	 */
	node_ids.forEach(function(node_id) {
	    if (this.enable_search && this.nodes[node_id].node_type=='metabolite') {
		var found = this.search_index.remove('n'+node_id);
		if (!found)
		    console.warn('Could not find deleted metabolite in search index');
	    }
	    delete this.nodes[node_id];
	}.bind(this));
    }
    function delete_segment_data(segment_objs) {
	/** Delete segments, and update connected_segments in nodes. Also
	 deletes any reactions with 0 segments.
	 
	 segment_objs: Array of objects with { reaction_id: "123", segment_id: "456" }
	 
	 */
	segment_objs.forEach(function(segment_obj) {
	    var reaction = this.reactions[segment_obj.reaction_id];

	    // segment already deleted
	    if (!(segment_obj.segment_id in reaction.segments)) return;
	    
	    var segment = reaction.segments[segment_obj.segment_id];
	    // updated connected nodes
	    [segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		if (!(node_id in this.nodes)) return;
		var node = this.nodes[node_id];
		node.connected_segments = node.connected_segments.filter(function(so) {
		    return so.segment_id != segment_obj.segment_id;				
		});
	    }.bind(this));

	    delete reaction.segments[segment_obj.segment_id];
	}.bind(this));
    }
    function delete_reaction_data(reaction_ids) {
	/** Delete reactions and remove from search index.
	 
	 */
	reaction_ids.forEach(function(reaction_id) {
	    delete this.reactions[reaction_id];
	    var found = this.search_index.remove('r'+reaction_id);
	    if (!found)
		console.warn('Could not find deleted reaction in search index');
	}.bind(this));
    }
    function delete_text_label_data(text_label_ids) {
	/** delete text labels for an array of ids
	 */
	text_label_ids.forEach(function(text_label_id) {
	    delete this.text_labels[text_label_id];
	}.bind(this));
    }
    function show_beziers() {
	this.toggle_beziers(true);
    }
    function hide_beziers() {
	this.toggle_beziers(false);
    }
    function toggle_beziers(on_off) {
	if (on_off===undefined) this.beziers_enabled = !this.beziers_enabled;
	else this.beziers_enabled = on_off;
	this.draw_everything();
	this.callback_manager.run('toggle_beziers', this.beziers_enabled);
    }

    // ---------------------------------------------------------------------
    // Building

    function new_reaction_from_scratch(starting_reaction, coords, direction) {
	/** Draw a reaction on a blank canvas.

	 starting_reaction: bigg_id for a reaction to draw.
	 coords: coordinates to start drawing

	 */
	
        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].bigg_id == starting_reaction) {             
		console.warn('reaction is already drawn');
                return null;
	    }
        }

	// If there is no cobra model, error
	if (!this.cobra_model) return console.error('No CobraModel. Cannot build new reaction');

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[starting_reaction]);

	// create the first node
	for (var metabolite_id in cobra_reaction.metabolites) {
	    var coefficient = cobra_reaction.metabolites[metabolite_id],
		metabolite = this.cobra_model.metabolites[metabolite_id];
	    if (coefficient < 0) {
		var selected_node_id = String(++this.largest_ids.nodes),
		    label_d = { x: 30, y: 10 },
		    selected_node = { connected_segments: [],
				      x: coords.x,
				      y: coords.y,
				      node_is_primary: true,
				      label_x: coords.x + label_d.x,
				      label_y: coords.y + label_d.y,
				      name: metabolite.name,
				      bigg_id: metabolite_id,
				      node_type: 'metabolite' },
		    new_nodes = {};
		new_nodes[selected_node_id] = selected_node;
		break;
	    }
	}

	// draw
	extend_and_draw_metabolite.apply(this, [new_nodes, selected_node_id]);

	// clone the nodes and reactions, to redo this action later
	var saved_nodes = utils.clone(new_nodes),
	    map = this;

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // get the nodes to delete
	    map.delete_node_data(Object.keys(new_nodes));
	    // save the nodes and reactions again, for redo
	    new_nodes = utils.clone(saved_nodes);
	    // draw
	    map.draw_everything();
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    extend_and_draw_metabolite.apply(map, [new_nodes, selected_node_id]);
	});
	
	// draw the reaction
	this.new_reaction_for_metabolite(starting_reaction, selected_node_id, direction);
	
	return null;

        // definitions
	function extend_and_draw_metabolite(new_nodes, selected_node_id) {
	    this.extend_nodes(new_nodes);
	    if (this.has_metabolite_data()) {
		var scale_changed = this.apply_metabolite_data_to_nodes(new_nodes);
		if (scale_changed) this.draw_all_nodes();
		else this.draw_these_nodes([selected_node_id]);
	    } else {
		this.draw_these_nodes([selected_node_id]);
	    }
	}
    }
    
    function extend_nodes(new_nodes) {
	/** Add new nodes to data and search index.

	 */
	if (this.enable_search) {
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_type!='metabolite') continue;
		this.search_index.insert('n'+node_id, { 'name': node.bigg_id,
							'data': { type: 'metabolite',
								  node_id: node_id }});
	    }
	}
	utils.extend(this.nodes, new_nodes);
    }
    function extend_reactions(new_reactions) {
	/** Add new reactions to data and search index.

	 */
	for (var r_id in new_reactions) {
	    var reaction = new_reactions[r_id];
	    if (this.enable_search) {
		this.search_index.insert('r'+r_id, { 'name': reaction.bigg_id,
						     'data': { type: 'reaction',
							       reaction_id: r_id }});
	    }
	}
	utils.extend(this.reactions, new_reactions);
    }

    function new_reaction_for_metabolite(reaction_bigg_id, selected_node_id, direction) {
	/** Build a new reaction starting with selected_met.

	 Undoable

	 */

        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].bigg_id == reaction_bigg_id) {
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// get the metabolite node
	var selected_node = this.nodes[selected_node_id];

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = this.cobra_model.reactions[reaction_bigg_id];

	// build the new reaction
	var out = build.new_reaction(reaction_bigg_id, cobra_reaction,
				     this.cobra_model.metabolites,
				     selected_node_id,
				     utils.clone(selected_node),
				     this.largest_ids,
				     this.cobra_model.cofactors,
				     direction),
	    new_nodes = out.new_nodes,
	    new_reactions = out.new_reactions;

	// draw
	extend_and_draw_reaction.apply(this, [new_nodes, new_reactions, selected_node_id]);

	// clone the nodes and reactions, to redo this action later
	var saved_nodes = utils.clone(new_nodes),
	    saved_reactions = utils.clone(new_reactions),
	    map = this;

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // get the nodes to delete
	    delete new_nodes[selected_node_id];
	    map.delete_node_data(Object.keys(new_nodes));
	    map.delete_reaction_data(Object.keys(new_reactions));
	    select_metabolite_with_id.apply(map, [selected_node_id]);
	    // save the nodes and reactions again, for redo
	    new_nodes = utils.clone(saved_nodes);
	    new_reactions = utils.clone(saved_reactions);
	    // draw
	    map.draw_everything();
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    extend_and_draw_reaction.apply(map, [new_nodes, new_reactions, selected_node_id]);
	});

	// definitions
	function extend_and_draw_reaction(new_nodes, new_reactions, selected_node_id) {
	    this.extend_reactions(new_reactions);
	    // remove the selected node so it can be updated
	    this.delete_node_data([selected_node_id]); // TODO this is a hack. fix
	    this.extend_nodes(new_nodes);

	    // apply the reaction and node data
	    // if the scale changes, redraw everything
	    if (this.has_reaction_data()) {
		var scale_changed = this.apply_reaction_data_to_reactions(new_reactions);
		if (scale_changed) this.draw_all_reactions();
		else this.draw_these_reactions(Object.keys(new_reactions));
	    } else {
		this.draw_these_reactions(Object.keys(new_reactions));
	    }		
	    if (this.has_metabolite_data()) {
		var scale_changed = this.apply_metabolite_data_to_nodes(new_nodes);
		if (scale_changed) this.draw_all_nodes();
		else this.draw_these_nodes(Object.keys(new_nodes));
	    } else {
		this.draw_these_nodes(Object.keys(new_nodes));
	    }

	    // select new primary metabolite
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_is_primary && node_id!=selected_node_id) {
		    this.select_metabolite_with_id(node_id);
		    var new_coords = { x: node.x, y: node.y };
		    if (this.zoom_container)
			this.zoom_container.translate_off_screen(new_coords);
		}
	    }
	}
	
    }
    function cycle_primary_node() {
	var selected_nodes = this.get_selected_nodes();
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id],
	    reactions = this.reactions,
	    nodes = this.nodes;
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [],
	    reactions_to_draw;
	nodes[node_id].connected_segments.forEach(function(segment_info) {
	    reactions_to_draw = [segment_info.reaction_id];
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
	    connected_anchor_ids.push(segment.from_node_id==node_id ?
				      segment.to_node_id : segment.from_node_id);
	});
	// can only be connected to one anchor
	if (connected_anchor_ids.length != 1)
	    return console.error('Only connected nodes with a single reaction can be selected');
	var connected_anchor_id = connected_anchor_ids[0];
	// 2. find nodes connected to the anchor that are metabolites
	var related_node_ids = [node_id];
	var segments = [];
	nodes[connected_anchor_id].connected_segments.forEach(function(segment_info) { // deterministic order
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		conn_met_id = segment.from_node_id == connected_anchor_id ? segment.to_node_id : segment.from_node_id,
		conn_node = nodes[conn_met_id];
	    if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		related_node_ids.push(String(conn_met_id));
	    }
	});
	// 3. make sure they only have 1 reaction connection, and check if
	// they match the other selected nodes
	for (var i=0; i<related_node_ids.length; i++) {
	    if (nodes[related_node_ids[i]].connected_segments.length > 1)
		return console.error('Only connected nodes with a single reaction can be selected');
	}
	for (var a_selected_node_id in selected_nodes) {
	    if (a_selected_node_id!=node_id && related_node_ids.indexOf(a_selected_node_id) == -1)
		return console.warn('Selected nodes are not on the same reaction');
	}
	// 4. change the primary node, and change coords, label coords, and beziers
	var nodes_to_draw = [],
	    last_i = related_node_ids.length - 1,
	    last_node = nodes[related_node_ids[last_i]],
	    last_is_primary = last_node.node_is_primary,
	    last_coords = { x: last_node.x, y: last_node.y,
			    label_x: last_node.label_x, label_y: last_node.label_y },
	    last_segment_info = last_node.connected_segments[0], // guaranteed above to have only one
	    last_segment = reactions[last_segment_info.reaction_id].segments[last_segment_info.segment_id],
	    last_bezier = { b1: last_segment.b1, b2: last_segment.b2 },
	    primary_node_id;
	related_node_ids.forEach(function(related_node_id) {
	    var node = nodes[related_node_id],
		this_is_primary = node.node_is_primary,
		these_coords = { x: node.x, y: node.y,
				 label_x: node.label_x, label_y: node.label_y },
		this_segment_info = node.connected_segments[0],
		this_segment = reactions[this_segment_info.reaction_id].segments[this_segment_info.segment_id],
		this_bezier = { b1: this_segment.b1, b2: this_segment.b2 };
	    node.node_is_primary = last_is_primary;
	    node.x = last_coords.x; node.y = last_coords.y;
	    node.label_x = last_coords.label_x; node.label_y = last_coords.label_y;
	    this_segment.b1 = last_bezier.b1; this_segment.b2 = last_bezier.b2;
	    last_is_primary = this_is_primary;
	    last_coords = these_coords;
	    last_bezier = this_bezier;
	    if (node.node_is_primary) primary_node_id = related_node_id;
	    nodes_to_draw.push(related_node_id);
	});
	// 5. cycle the connected_segments array so the next time, it cycles differently
	var old_connected_segments = nodes[connected_anchor_id].connected_segments,
	    last_i = old_connected_segments.length - 1,
	    new_connected_segments = [old_connected_segments[last_i]];
	old_connected_segments.forEach(function(segment, i) {
	    if (last_i==i) return;
	    new_connected_segments.push(segment);
	});
	nodes[connected_anchor_id].connected_segments = new_connected_segments;	    
	// 6. draw the nodes
	this.draw_these_nodes(nodes_to_draw);
	this.draw_these_reactions(reactions_to_draw);
	// 7. select the primary node
	this.select_metabolite_with_id(primary_node_id);
    }
    function make_selected_node_primary() {
	var selected_nodes = this.get_selected_nodes(),
	    reactions = this.reactions,
	    nodes = this.nodes;	    
	// can only have one selected
	if (Object.keys(selected_nodes).length != 1)
	    return console.error('Only one node can be selected');
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id];
	// make it primary
	nodes[node_id].node_is_primary = true;
	var nodes_to_draw = [node_id];
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [];
	nodes[node_id].connected_segments.forEach(function(segment_info) {
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
	    connected_anchor_ids.push(segment.from_node_id==node_id ?
				      segment.to_node_id : segment.from_node_id);
	});
	// 2. find nodes connected to the anchor that are metabolites
	connected_anchor_ids.forEach(function(anchor_id) {
	    var segments = [];
	    nodes[anchor_id].connected_segments.forEach(function(segment_info) {
		var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		    conn_met_id = segment.from_node_id == anchor_id ? segment.to_node_id : segment.from_node_id,
		    conn_node = nodes[conn_met_id];
		if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		    conn_node.node_is_primary = false;
		    nodes_to_draw.push(conn_met_id);
		}
	    });
	});
	// draw the nodes
	this.draw_these_nodes(nodes_to_draw);
    }

    function segments_and_reactions_for_nodes(nodes) {
	/** Get segments and reactions that should be deleted with node deletions
	 */
	var segment_objs_w_segments = [],
	    these_reactions = {},
	    segment_ids_for_reactions = {},
	    reactions = this.reactions;
	// for each node
	for (var node_id in nodes) {
	    var node = nodes[node_id];
	    // find associated segments and reactions	    
	    node.connected_segments.forEach(function(segment_obj) {
		var reaction = reactions[segment_obj.reaction_id],
		    segment = reaction.segments[segment_obj.segment_id],
		    segment_obj_w_segment = utils.clone(segment_obj);
		segment_obj_w_segment['segment'] = utils.clone(segment);
		segment_objs_w_segments.push(segment_obj_w_segment);
		if (!(segment_obj.reaction_id in segment_ids_for_reactions))
		    segment_ids_for_reactions[segment_obj.reaction_id] = [];
		segment_ids_for_reactions[segment_obj.reaction_id].push(segment_obj.segment_id);
	    });
	}
	// find the reactions that should be deleted because they have no segments left
	for (var reaction_id in segment_ids_for_reactions) {
	    var reaction = reactions[reaction_id],
		these_ids = segment_ids_for_reactions[reaction_id],
		has = true;
	    for (var segment_id in reaction.segments) {
		if (these_ids.indexOf(segment_id)==-1) has = false;
	    }
	    if (has) these_reactions[reaction_id] = reaction;
	}
	return { segment_objs_w_segments: segment_objs_w_segments, reactions: these_reactions };
    }
    function set_status(status) {
        // TODO make this a class, and take out d3.select('body')
        var t = d3.select('body').select('#status');
        if (t.empty()) t = d3.select('body')
	    .append('text')
	    .attr('id', 'status');
        t.text(status);
        return this;
    }

    // -------------------------------------------------------------------------
    // Zoom

    function zoom_extent_nodes(margin) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins as a fraction of height.

	 Returns error if one is raised.

	 */
	this._zoom_extent(margin, 'nodes');
    }
    function zoom_extent_canvas(margin) {
	/** Zoom to fit the canvas.

	 margin: optional argument to set the margins as a fraction of height.

	 Returns error if one is raised.

	 */
	this._zoom_extent(margin, 'canvas');
    }
    function _zoom_extent(margin, mode) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins.
	 mode: Values are 'nodes', 'canvas'.

	 Returns error if one is raised.

	 */

	// optional args
	if (margin===undefined) margin = (mode=='nodes' ? 0.2 : 0);
	if (mode===undefined) mode = 'canvas';

	var new_zoom, new_pos,
	    size = this.get_size();
	// scale margin to window size
	margin = margin * size.height;

	if (mode=='nodes') {
	    // get the extent of the nodes
	    var min = { x: null, y: null }, // TODO make infinity?
		max = { x: null, y: null };
	    for (var node_id in this.nodes) {
		var node = this.nodes[node_id];
		if (min.x===null) min.x = node.x;
		if (min.y===null) min.y = node.y;
		if (max.x===null) max.x = node.x;
		if (max.y===null) max.y = node.y;

		min.x = Math.min(min.x, node.x);
		min.y = Math.min(min.y, node.y);
		max.x = Math.max(max.x, node.x);
		max.y = Math.max(max.y, node.y);
	    }
	    // set the zoom
	    new_zoom = Math.min((size.width - margin*2) / (max.x - min.x),
				(size.height - margin*2) / (max.y - min.y));
	    new_pos = { x: - (min.x * new_zoom) + margin + ((size.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			y: - (min.y * new_zoom) + margin + ((size.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	} else if (mode=='canvas') {
	    // center the canvas
	    new_zoom =  Math.min((size.width - margin*2) / (this.canvas.width),
				 (size.height - margin*2) / (this.canvas.height));
	    new_pos = { x: - (this.canvas.x * new_zoom) + margin + ((size.width - margin*2 - this.canvas.width*new_zoom) / 2),
			y: - (this.canvas.y * new_zoom) + margin + ((size.height - margin*2 - this.canvas.height*new_zoom) / 2) };
	} else {
	    return console.error('Did not recognize mode');
	}
	this.zoom_container.go_to(new_zoom, new_pos);
	return null;
    }

    function get_size() {
	return this.zoom_container.get_size();
    }

    function zoom_to_reaction(reaction_id) {
	var reaction = this.reactions[reaction_id],
	    new_zoom = 0.6,
	    size = this.get_size(),
	    new_pos = { x: - reaction.label_x * new_zoom + size.width/2,
			y: - reaction.label_y * new_zoom + size.height/2 };
	this.zoom_container.go_to(new_zoom, new_pos);
    }

    function zoom_to_node(node_id) {
	var node = this.nodes[node_id],
	    new_zoom = 0.6,
	    size = this.get_size(),
	    new_pos = { x: - node.label_x * new_zoom + size.width/2,
			y: - node.label_y * new_zoom + size.height/2 };
	this.zoom_container.go_to(new_zoom, new_pos);
    }

    function highlight_reaction(reaction_id) {
	this.highlight(this.sel.selectAll('#r'+reaction_id).selectAll('text'));
    }
    function highlight_node(node_id) {
	this.highlight(this.sel.selectAll('#n'+node_id).selectAll('text'));
    }
    function highlight(sel) {
	this.sel.selectAll('.highlight')
	    .classed('highlight', false);
	if (sel!==null) {
	    sel.classed('highlight', true);
	}
    }

    // -------------------------------------------------------------------------
    // IO

    function save() {
        console.log("Saving");
        utils.download_json(this.map_for_export(), "saved_map");
    }
    function map_for_export() {
	var out = { reactions: utils.clone(this.reactions),
		    nodes: utils.clone(this.nodes),
		    membranes: utils.clone(this.membranes),
		    text_labels: utils.clone(this.text_labels),
		    canvas: this.canvas.size_and_location() };

	// remove extra data
	for (var r_id in out.reactions) {
	    var reaction = out.reactions[r_id];
	    delete reaction.data;
	    delete reaction.data_string;
	    for (var s_id in reaction.segments) {
		var segment = reaction.segments[s_id];
		delete segment.reversibility;
		delete segment.from_node_coefficient;
		delete segment.to_node_coefficient;
		delete segment.data;
	    }
	}
	for (var n_id in out.nodes) {
	    var node = out.nodes[n_id];
	    delete node.data;
	    delete node.data_string;
	}

	if (this.debug) {
	    d3.json('map_spec.json', function(error, spec) {
		if (error) {
		    console.warn(error);
		    return;
		}
		utils.check_r(out, spec.spec, spec.can_be_none);
	    });
	}

	return out;
    }
    function save_svg() {
        console.log("Exporting SVG");
	this.callback_manager.run('before_svg_export');
	// turn of zoom and translate so that illustrator likes the map
	var window_scale = this.zoom_container.window_scale,
	    window_translate = this.zoom_container.window_translate,
	    canvas_size_and_loc = this.canvas.size_and_location(),
	    mouse_node_size_and_trans = { w: this.canvas.mouse_node.attr('width'),
					  h: this.canvas.mouse_node.attr('height'),
				          transform:  this.canvas.mouse_node.attr('transform')};
	this.zoom_container.go_to(1.0, {x: -canvas_size_and_loc.x, y: -canvas_size_and_loc.y}, false);
	this.svg.attr('width', canvas_size_and_loc.width);
	this.svg.attr('height', canvas_size_and_loc.height);
	this.canvas.mouse_node.attr('width', '0px');
	this.canvas.mouse_node.attr('height', '0px');
	this.canvas.mouse_node.attr('transform', null);
        utils.export_svg("saved_map", this.svg, true);
	this.zoom_container.go_to(window_scale, window_translate, false);
	this.svg.attr('width', null);
	this.svg.attr('height', null);
	this.canvas.mouse_node.attr('width', mouse_node_size_and_trans.w);
	this.canvas.mouse_node.attr('height', mouse_node_size_and_trans.h);
	this.canvas.mouse_node.attr('transform', mouse_node_size_and_trans.transform);
	this.callback_manager.run('after_svg_export');
    }
});
