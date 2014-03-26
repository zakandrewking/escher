define(["vis/utils", "lib/d3", "builder/draw", "builder/Behavior", "builder/Scale", "builder/DirectionArrow", "builder/build", "builder/UndoStack", "vis/CallbackManager"], function(utils, d3, draw, Behavior, Scale, DirectionArrow, build, UndoStack, CallbackManager) {
    /** Defines the metabolic map data, and manages drawing and building.

     Map(selection, defs, zoom_container, height, width, flux, node_data, cobra_model)

     selection: A d3 selection for a node to place the map inside. Should be an SVG element.

     behavior: A Behavior object which defines the interactivity of the map.

     */

    var Map = utils.make_class();
    // static methods
    Map.from_data = from_data;
    // instance methods
    Map.prototype = { init: init,
		      select_metabolite: select_metabolite,
		      new_reaction_from_scratch: new_reaction_from_scratch,
		      new_reaction_for_metabolite: new_reaction_for_metabolite,
		      setup_containers: setup_containers,
		      reset_containers: reset_containers,
		      has_flux: has_flux,
		      has_node_data: has_node_data,
		      draw_everything: draw_everything,
		      draw_these_reactions: draw_these_reactions,
		      draw_these_nodes: draw_these_nodes,
		      apply_flux_to_map: apply_flux_to_map,
		      apply_flux_to_reactions: apply_flux_to_reactions,
		      apply_node_data_to_map: apply_node_data_to_map,
		      apply_node_data_to_nodes: apply_node_data_to_nodes,
		      select_metabolite_with_id: select_metabolite_with_id,
		      get_selected_node_ids: get_selected_node_ids,
		      toggle_beziers: toggle_beziers,
		      hide_beziers: hide_beziers,
		      show_beziers: show_beziers,
		      zoom_extent: zoom_extent,
		      save: save,
		      map_for_export: map_for_export,
		      save_svg: save_svg };

    return Map;

    function init(selection, defs, zoom_container, height, width, flux, node_data, cobra_model) {
	// TODO make these inputs optional when possible

	// defaults
	var default_angle = 90; // degrees
	this.reaction_arrow_displacement = 35;

	this.setup_containers(selection);
	this.sel = selection;
	this.defs = defs;
	this.zoom_container = zoom_container;

	this.flux = flux;
	this.node_data = node_data;
	this.cobra_model = cobra_model;

	this.map_info = { max_map_w: width * 10, max_map_h: height * 10 };
	this.map_info.largest_ids = { reactions: -1,
				      nodes: -1,
				      segments: -1 };

	// make the scale
	this.scale = new Scale(this.map_info.max_map_w, this.map_info.max_map_h,
			       width, height);

	// make the undo/redo stack
	this.undo_stack = new UndoStack();

	// make a behavior object
	this.behavior = new Behavior(this, this.undo_stack);

	// deal with the window
	var window_translate = {'x': 0, 'y': 0},
	    window_scale = 1;

	// hide beziers
	this.beziers_enabled = false;

	// set up the reaction direction arrow
	this.direction_arrow = new DirectionArrow(selection);
	this.direction_arrow.set_rotation(default_angle);

	// set up the callbacks
	this.callback_manager = new CallbackManager();

	// these will be filled
	this.arrowheads_generated = [];
	
	this.nodes = {};
	this.reactions = {};
	this.membranes = [];
	this.text_labels = {};
	this.info = {};

	// performs some extra checks
	this.debug = false;
    };

    // -------------------------------------------------------------------------
    // Import

    function from_data(map_data, selection, defs, zoom_container, height, width, flux,
		       node_data, cobra_model) {
	map_data = check_map_data(map_data);
	
	var map = new Map(selection, defs, zoom_container, height, width, flux, node_data, cobra_model);
	if (map_data.reactions) map.reactions = map_data.reactions;
	if (map_data.nodes) map.nodes = map_data.nodes;
	if (map_data.membranes) map.membranes = map_data.membranes;
	if (map_data.text_labels) map.text_labels = map_data.text_labels;
	if (map_data.info) map.info = map_data.info;

	// get largest ids for adding new reactions, nodes, text labels, and segments
	map.map_info.largest_ids.reactions = get_largest_id(map.reactions);
	map.map_info.largest_ids.nodes = get_largest_id(map.nodes);
	map.map_info.largest_ids.text_labels = get_largest_id(map.text_labels);

	var largest_segment_id = 0;
	for (var id in map.reactions) {
	    largest_segment_id = get_largest_id(map.reactions[id].segments, largest_segment_id);
	}
	map.map_info.largest_ids.segments = largest_segment_id;

	// flux onto existing map reactions
	if (flux) map.apply_flux_to_map();
	if (node_data) map.apply_node_data_to_map();

	return map;

	// definitions
	function get_largest_id(obj, current_largest) {
	    /** Return the largest integer key in obj, or current_largest, whichever is bigger. */
	    if (current_largest===undefined) current_largest = 0;
	    if (obj===undefined) return current_largest;
	    return Math.max.apply(null, Object.keys(obj).map(function(x) { return parseInt(x); }).concat([current_largest]));
	}
    }

    function check_map_data(map_data) {
	/*
	 * Load a json map and add necessary fields for rendering.
	 *
	 * The returned value will be this.reactions.
	 */
	if (this.debug) {
	    var required_node_props = ['node_type', 'x', 'y',
				       'connected_segments'],
		required_reaction_props = ["segments", 'name', 'direction', 'abbreviation'],
		required_segment_props = ['from_node_id', 'to_node_id'],
		required_text_label_props = ['text', 'x', 'y'];
	    for (var node_id in map_data.nodes) {
		var node = map_data.nodes[node_id];
		node.selected = false; node.previously_selected = false;
		required_node_props.map(function(req) {
		    if (!node.hasOwnProperty(req)) console.error("Missing property " + req);
		});
	    }
	    for (var reaction_id in map_data.reactions) {
		var reaction = map_data.reactions[reaction_id];
		required_reaction_props.map(function(req) {
		    if (!reaction.hasOwnProperty(req)) console.error("Missing property " + req);
		});
		for (var segment_id in reaction.segments) {
		    var metabolite = reaction.segments[segment_id];
		    required_segment_props.map(function(req) {
			if (!metabolite.hasOwnProperty(req)) console.error("Missing property " + req);
		    });
		}
	    }
	    for (var text_label_id in map_data.text_labels) {
		var text_label = map_data.text_labels[text_label_id];
		required_text_label_props.map(function(req) {
		    if (!text_label.hasOwnProperty(req)) console.error("Missing property " + req);
		});
	    }
	}
	return map_data;
    }

    // ---------------------------------------------------------------------
    // Drawing

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
	d3.select('#membranes')
            .selectAll('.membrane')
            .remove();
	d3.select('#reactions')
            .selectAll('.reaction')
            .remove();
	d3.select('#nodes')
            .selectAll('.node')
            .remove();
	d3.select('#text-labels')
            .selectAll('.text-label')
            .remove();
    }
    function has_flux() {
	return Boolean(this.flux);
    }
    function has_node_data() {
	return Boolean(this.node_data);
    }
    function draw_everything() {
        /** Draw the reactions and membranes

         */
	var membranes = this.membranes,
	    scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    text_labels = this.text_labels,
	    arrow_displacement = this.reaction_arrow_displacement,
	    defs = this.defs,
	    arrowheads = this.arrowheads_generated,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    node_click_fn = this.behavior.node_click,
	    node_drag_behavior = this.behavior.node_drag,
	    node_data_style = this.node_data_style,
	    has_flux = this.has_flux(),
	    has_node_data = this.has_node_data(),
	    beziers_enabled = this.beziers_enabled;

	utils.draw_an_array('#membranes' ,'.membrane', membranes, draw.create_membrane,
			    function(sel) { return draw.update_membrane(sel, scale); });

	utils.draw_an_object('#reactions', '.reaction', reactions,
			     'reaction_id', draw.create_reaction, 
			     function(sel) { return draw.update_reaction(sel, scale, 
									 nodes,
									 beziers_enabled, 
									 arrow_displacement,
									 defs, arrowheads,
									 default_reaction_color,
									 has_flux,
									 bezier_drag_behavior); });

	utils.draw_an_object('#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return draw.create_node(sel, scale, nodes, reactions,
								     node_click_fn, node_drag_behavior); },
			     function(sel) { return draw.update_node(sel, scale, has_node_data, node_data_style); });

	utils.draw_an_object('#text-labels', '.text-label', text_labels,
			     'text_label_id', draw.create_text_label, 
			     function(sel) { return draw.update_text_label(sel, scale); });


    }
    function draw_these_reactions(reaction_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    arrow_displacement = this.reaction_arrow_displacement,
	    defs = this.defs,
	    arrowheads = this.arrowheads_generated,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    has_flux = this.has_flux(),
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
        var sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(utils.make_array(reaction_subset, 'reaction_id'),
                      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(draw.create_reaction);

        // update: update when necessary
        sel.call(function(sel) { return draw.update_reaction(sel, scale, 
							     nodes,
							     beziers_enabled, 
							     arrow_displacement,
							     defs, arrowheads,
							     default_reaction_color,
							     has_flux,
							     bezier_drag_behavior); });

        // exit
        sel.exit();
    }
    function draw_these_nodes(node_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    node_click_fn = this.behavior.node_click,
	    node_drag_behavior = this.behavior.node_drag,
	    node_data_style = this.node_data_style,
	    has_node_data = this.has_node_data();

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
        var sel = d3.select('#nodes')
                .selectAll('.node')
                .data(utils.make_array(node_subset, 'node_id'),
                      function(d) { return d.node_id; });

        // enter: generate and place node
        sel.enter().call(function(sel) { return draw.create_node(sel, scale, nodes, reactions, 
							    node_click_fn, node_drag_behavior); });

        // update: update when necessary
        sel.call(function(sel) { return draw.update_node(sel, scale, has_node_data, node_data_style); });

        // exit
        sel.exit();
    }
    function apply_flux_to_map() {
	this.apply_flux_to_reactions(this.reactions);
    }
    function apply_flux_to_reactions(reactions) {
	for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id];
	    if (reaction.abbreviation in this.flux) {
		var flux = parseFloat(this.flux[reaction.abbreviation]);
		reaction.flux = flux;
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.flux = flux;
		}
	    } else {
		var flux = 0.0;
		reaction.flux = flux;
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.flux = flux;
		}
	    }
	}
    }
    function apply_node_data_to_map() {
	this.apply_node_data_to_nodes(this.nodes);
    }
    function apply_node_data_to_nodes(nodes) {
	var vals = [];
	for (var node_id in nodes) {
	    var node = nodes[node_id], data = 0.0;
	    if (node.bigg_id_compartmentalized in this.node_data) {
		data = parseFloat(this.node_data[node.bigg_id_compartmentalized]);
	    }
	    vals.push(data);
	    node.data = data;
	}
	var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
	this.scale.node_size.domain([min, max]);
	this.scale.node_color.domain([min, max]);
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
	d3.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_node_ids.push(d.node_id); });
	return selected_node_ids;
    }
    function get_selected_nodes() {
	var selected_nodes = {},
	    self = this;
	d3.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_nodes[d.node_id] = self.nodes[d.node_id]; });
	return selected_nodes;
    }	
    function select_metabolite_with_id(node_id) {
	var node_selection = this.sel.select('#nodes').selectAll('.node'),
	    coords,
	    scale = this.scale;
	node_selection.classed("selected", function(d) {
	    var selected = String(d.node_id) == String(node_id);
	    if (selected)
		coords = { x: scale.x(d.x), y: scale.y(d.y) };
	    return selected;
	});
	this.direction_arrow.set_location(coords);
	this.direction_arrow.show();
	this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	this.callback_manager.run('select_metabolite_with_id');
    }
    function select_metabolite(sel, d) {
	var node_selection = this.sel.select('#nodes').selectAll('.node'), 
	    shift_key_on = this.shift_key_on;
	if (shift_key_on) d3.select(sel.parentNode)
	    .classed("selected", !d3.select(sel.parentNode).classed("selected"));
        else node_selection.classed("selected", function(p) { return d === p; });
	var selected_nodes = d3.select('.selected'),
	    count = 0,
	    coords,
	    scale = this.scale;
	selected_nodes.each(function(d) {
	    coords = { x: scale.x(d.x), y: scale.y(d.y) };
	    count++;
	});
	this.callback_manager.run('select_metabolite', count);
	if (count == 1) {
	    this.direction_arrow.set_location(coords);
	    this.direction_arrow.show();
	} else {
	    this.direction_arrow.hide();
	}
	this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
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

    function new_reaction_from_scratch(starting_reaction, coords) {
	/** Draw a reaction on a blank canvas.

	 starting_reaction: bigg_id for a reaction to draw.
	 coords: coordinates to start drawing

	 */
	
        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].abbreviation == starting_reaction) {             
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// If there is no cobra model, error
	if (!this.cobra_model) console.error('No CobraModel. Cannot build new reaction');

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[starting_reaction]);

	// create the first node
	for (var metabolite_id in cobra_reaction.metabolites) {
	    var metabolite = cobra_reaction.metabolites[metabolite_id];
	    if (metabolite.coefficient < 0) {
		var selected_node_id = ++this.map_info.largest_ids.nodes,
		    label_d = { x: 30, y: 10 },
		    selected_node = { connected_segments: [],
				      x: coords.x,
				      y: coords.y,
				      node_is_primary: true,
				      compartment_name: metabolite.compartment,
				      label_x: coords.x + label_d.x,
				      label_y: coords.y + label_d.y,
				      metabolite_name: metabolite.name,
				      bigg_id: metabolite.bigg_id,
				      bigg_id_compartmentalized: metabolite.bigg_id_compartmentalized,
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
	    delete_nodes(new_nodes);
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
	this.new_reaction_for_metabolite(starting_reaction, selected_node_id);

        // definitions
	function extend_and_draw_metabolite(new_nodes, selected_node_id) {
	    utils.extend(this.nodes, new_nodes);
	    this.draw_these_nodes([selected_node_id]);
	}
    }
    
    function new_reaction_for_metabolite(reaction_abbreviation, selected_node_id) {
	/** Build a new reaction starting with selected_met.

	 Undoable

	 */

        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].abbreviation == reaction_abbreviation) {
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// get the metabolite node
	var selected_node = this.nodes[selected_node_id];

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[reaction_abbreviation]);

	// build the new reaction
	var out = build.new_reaction(reaction_abbreviation, cobra_reaction,
				     selected_node_id, utils.clone(selected_node),
				     this.map_info.largest_ids, this.cobra_model.cofactors,
				     this.direction_arrow.get_rotation()),
	    new_nodes = out.new_nodes,
	    new_reactions = out.new_reactions;

	// add the flux
	if (this.flux) this.apply_flux_to_reactions(new_reactions);
	if (this.node_data) this.apply_node_data_to_nodes(new_nodes);

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
	    delete_nodes(new_nodes);
	    delete_reactions(new_reactions);
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
	    utils.extend(this.reactions, new_reactions);
	    // remove the selected node so it can be updated
	    delete this.nodes[selected_node_id];
	    utils.extend(this.nodes, new_nodes);

	    // draw new reaction and (TODO) select new metabolite
	    this.draw_these_nodes(Object.keys(new_nodes));
	    this.draw_these_reactions(Object.keys(new_reactions));

	    // select new primary metabolite
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_is_primary && node_id!=selected_node_id) {
		    this.select_metabolite_with_id(node_id);
		    var new_coords = { x: node.x, y: node.y };
		    if (this.zoom_container)
			this.zoom_container.translate_off_screen(new_coords, this.scale.x, this.scale.y);
		}
	    }
	}
	
    }

    function segments_and_reactions_for_nodes(nodes) {
	/** Get segments and reactions that should be deleted with node deletions
	 */
	var segment_objs_w_segments = [],
	    these_reactions = {},
	    nodes_for_reactions = {},
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
		if (!(segment_obj.reaction_id in nodes_for_reactions))
		    nodes_for_reactions[segment_obj.reaction_id] = 0;
		nodes_for_reactions[segment_obj.reaction_id]++;
	    });
	}
	// find the reactions that should be deleted because they have no segments left
	for (var reaction_id in nodes_for_reactions) {
	    var reaction = reactions[reaction_id];
	    if (Object.keys(reaction.segments).length == nodes_for_reactions[reaction_id])
		these_reactions[reaction_id] = reaction;
	}
	return { segment_objs_w_segments: segment_objs_w_segments, reactions: these_reactions };
    }
    function delete_nodes(nodes) {
	/** delete nodes
	 */
	for (var node_id in nodes) {
	    delete this.nodes[node_id];
	}
    }
    function delete_nodes_by_id(node_ids) {
	/** delete nodes for an array of ids
	 */
	var nodes = this.nodes;
	node_ids.forEach(function(node_id) {
	    delete nodes[node_id];
	});
    }

    function delete_segments(segment_objs) {
	/** Delete segments, and update connected_segments in nodes. Also
	 deletes any reactions with 0 segments.
	 
	 segment_objs: Array of objects with { reaction_id: "123", segment_id: "456" }
	 
	 */
	var reactions = this.reactions,
	    nodes = this.nodes;
	segment_objs.forEach(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id],
		segment = reaction.segments[segment_obj.segment_id];

	    // updated connected nodes
	    [segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		if (!(node_id in nodes)) return;
		var node = nodes[node_id],
		    connected_segments = node.connected_segments;
		connected_segments = connected_segments.filter(function(so) {
		    return so.segment_id != segment_obj.segment_id;				
		});
	    });

	    delete reaction.segments[segment_obj.segment_id];
	});
    }
    function delete_reactions(reactions) {
	/** delete reactions
	 */
	for (var reaction_id in reactions) {
	    delete this.reactions[reaction_id];
	}
    }

    function set_status(status) {
        // TODO put this in js/metabolic-map/utils.js
        var t = d3.select('body').select('#status');
        if (t.empty()) t = d3.select('body')
            .append('text')
            .attr('id', 'status');
        t.text(status);
        return this;
    }

    function zoom_extent(margin) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins.

	 */

	// optional args
	if (margin===undefined) margin = 180;

	// get the extent of the nodes
	var min = { x: null, y: null }, // TODO make infinity?
	    max = { x: null, y: null }; 
	for (var node_id in this.nodes) {
	    var node = this.nodes[node_id];
	    if (min.x===null) min.x = this.scale.x(node.x);
	    if (min.y===null) min.y = this.scale.y(node.y);
	    if (max.x===null) max.x = this.scale.x(node.x);
	    if (max.y===null) max.y = this.scale.y(node.y);

	    min.x = Math.min(min.x, this.scale.x(node.x));
	    min.y = Math.min(min.y, this.scale.y(node.y));
	    max.x = Math.max(max.x, this.scale.x(node.x));
	    max.y = Math.max(max.y, this.scale.y(node.y));
	}
	// set the zoom
        var new_zoom = Math.min((this.width - margin*2) / (max.x - min.x),
				(this.height - margin*2) / (max.y - min.y)),
	    new_pos = { x: - (min.x * new_zoom) + margin + ((this.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			y: - (min.y * new_zoom) + margin + ((this.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	this.zoom_container.scale(new_zoom);
	this.zoom_container.translate(new_pos);
	// this.zoom_container.window_scale = new_zoom;
        // this.zoom_container.window_translate = new_pos;
        // go();

	// // definitions
        // function go() { // TODO move some of this zoom container
        //     this.zoom_container.translate([this.zoom_container.window_translate.x,
	// 				   this.zoom_container.window_translate.y]);
        //     this.zoom_container.scale(this.zoom_container.window_scale);
        //     this.sel.transition()
        //         .attr('transform', 'translate('+this.zoom_container.window_translate+')scale('+this.zoom_container.window_scale+')');
        // };
    }

    function save() {
        console.log("Saving");
        utils.download_json(this.map_for_export(), "saved_map");
    }
    function map_for_export() {
	console.error('not implemented');
    }
    function save_svg() {
        console.log("Exporting SVG");
	// o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');	    
	// o.direction_arrow.hide();
	this.callback_manager.run('before_svg_export');
        utils.export_svg("saved_map", "svg");
	this.callback_manager.run('after_svg_export');
    }
});
