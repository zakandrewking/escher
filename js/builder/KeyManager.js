define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** 
     */

    var KeyManager = utils.make_class();
    KeyManager.prototype = { init: init };

    return KeyManager;

    // definitions
    function init() {
	/** Assign keys for commands.

	 */
        var held_keys = reset_held_keys(),
            modifier_keys = { command: 91,
                              control: 17,
                              option: 18,
                              shift: 16 },
	    assigned_keys = {
                hide_show_input_key: { key: 191, // forward slash '/'
				       fn: cmd_hide_show_input },
                save_key: { key: 83, modifiers: { control: true }, // ctrl-s
			    fn: cmd_save },
                // save_key_cmd: { key: 83, modifiers: { command: true }, // command-s
		// 		       fn: cmd_save },
                save_svg_key: { key: 83, modifiers: { control: true, shift: true }, // ctrl-Shift-s
				fn: cmd_save_svg },
                load_key: { key: 79, modifiers: { control: true }, // ctrl-o
			    fn: cmd_load },
		load_flux_key: { key: 70, modifiers: { control: true }, // ctrl-f
				 fn: cmd_load_flux },
		toggle_beziers_key: { key: 66,
				      fn: cmd_toggle_beziers,
				      ignore_with_input: true  }, // b
		pan_and_zoom_key: { key: 90, // z 
				    fn: cmd_zoom_on,
				    ignore_with_input: true },
		brush_key: { key: 86, // v
			     fn: cmd_zoom_off,
			     ignore_with_input: true },
		rotate_key: { key: 82, // r
			      fn: cmd_rotate_selected_nodes,
			      ignore_with_input: true },
		delete_key: { key: 8, // del
			      fn: cmd_delete_selected_nodes,
			      ignore_with_input: true },
		extent_key: { key: 48, modifiers: { control: true }, // ctrl-0
			      fn: cmd_zoom_extent },
		make_primary_key: { key: 80, // p
				    fn: cmd_make_selected_node_primary,
				    ignore_with_input: true },
		cycle_primary_key: { key: 67, // c
				     fn: cmd_cycle_primary_node,
				     ignore_with_input: true },
		direction_arrow_right: { key: 39, // right
					 fn: cmd_direction_arrow_right,
					 ignore_with_input: true },
		direction_arrow_down: { key: 40, // down
					fn: cmd_direction_arrow_down,
					ignore_with_input: true },
		direction_arrow_left: { key: 37, // left
					fn: cmd_direction_arrow_left,
					ignore_with_input: true },
		direction_arrow_up: { key: 38, // up
				      fn: cmd_direction_arrow_up,
				      ignore_with_input: true },
		undo_key: { key: 90, modifiers: { control: true },
			    fn: cmd_undo },
		redo_key: { key: 90, modifiers: { control: true, shift: true },
			    fn: cmd_redo }
	    };

        d3.select(window).on("keydown", function() {
            var kc = d3.event.keyCode,
                reaction_input_visible = input.is_visible(o.reaction_input),
		meaningless = true;
            held_keys = toggle_modifiers(modifier_keys, held_keys, kc, true);
	    o.shift_key_on = held_keys.shift;
	    for (var key_id in assigned_keys) {
		var assigned_key = assigned_keys[key_id];
		if (check_key(assigned_key, kc, held_keys)) {
		    meaningless = false;
		    if (!(assigned_key.ignore_with_input && reaction_input_visible)) {
			assigned_key.fn();
			// prevent browser action
			d3.event.preventDefault();
		    }
		}
	    }
	    // Sometimes modifiers get 'stuck', so reset them once in a while.
	    // Only do this when a meaningless key is pressed
	    for (var k in modifier_keys)
		if (modifier_keys[k] == kc) meaningless = false;
	    if (meaningless) 
		held_keys = reset_held_keys();
        }).on("keyup", function() {
            held_keys = toggle_modifiers(modifier_keys, held_keys,
					 d3.event.keyCode, false);
	    o.shift_key_on = held_keys.shift;
        });

        function reset_held_keys() {
            return { command: false,
                     control: false,
                     option: false,
                     shift: false };
        }
        function toggle_modifiers(mod, held, kc, on_off) {
            for (var k in mod)
                if (mod[k] == kc)
                    held[k] = on_off;
            return held;
        }
        function check_key(key, pressed, held) {
            if (key.key != pressed) return false;
            var mod = key.modifiers;
            if (mod === undefined)
                mod = { control: false,
                        command: false,
                        option: false,
                        shift: false };
            for (var k in held) {
                if (mod[k] === undefined) mod[k] = false;
                if (mod[k] != held[k]) return false;
            }
            return true;
        }
    }
    
    function add_escape_listener(callback) {
	/** Call the callback when the escape key is pressed, then
	 unregisters the listener.

	 */
	var selection = d3.select(window);
	selection.on('keydown.esc', function() {
	    if (d3.event.keyCode==27) { // esc
		callback();
		selection.on('keydown.esc', null);
	    }
	});
	return { clear: function() { selection.on('keydown.esc', null); } };
    }

    function toggle_start_reaction_listener(on_off) {
	if (on_off===undefined) {
	    o.start_reaction_listener = !o.start_reaction_listener;
	} else if (o.start_reaction_listener==on_off) {
	    return;
	} else {
	    o.start_reaction_listener = on_off;
	}
	if (o.start_reaction_listener) {
	    o.sel.on('click.start_reaction', function() {
		console.log('clicked for new reaction');
		// reload the reaction input
		var coords = { x: o.scale.x_size.invert(d3.mouse(this)[0]), 
			       y: o.scale.y_size.invert(d3.mouse(this)[1]) };
		// unselect metabolites
		d3.selectAll('.selected').classed('selected', false);
		input.reload_at_point(o.reaction_input, coords, o.scale.x, o.scale.y, o.window_scale, 
				      o.window_translate, o.width, o.height, o.flux, 
				      o.drawn_reactions, o.cobra_reactions,
				      new_reaction_from_scratch);
		var s = o.sel.selectAll('.start-reaction-target').data([12, 5]);
		s.enter().append('circle')
		    .classed('start-reaction-target', true)
		    .attr('r', function(d) { return o.scale.x_size(d); })
		    .style('stroke-width', o.scale.x_size(4));
		s.style('visibility', 'visible')
		    .attr('transform', 'translate('+o.scale.x(coords.x)+','+o.scale.y(coords.y)+')');
	    });
	    o.sel.classed('start-reaction-cursor', true);
	} else {
	    o.sel.on('click.start_reaction', null);
	    o.sel.classed('start-reaction-cursor', false);
	    o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	}
    }

    // ---------------------------------------------------------------------
    // Commands
    
    function cmd_hide_show_input() {
        if (input.is_visible(o.reaction_input)) cmd_hide_input();
        else cmd_show_input();
    }
    function cmd_hide_input() {
	toggle_start_reaction_listener(false);
        o.reaction_input.selection.style("display", "none");
        o.reaction_input.completely.input.blur();
        o.reaction_input.completely.hideDropDown();
    }
    function cmd_show_input() {
	cmd_zoom_on();
	toggle_start_reaction_listener(true);
	input.reload_at_selected(o.reaction_input, o.scale.x, o.scale.y, o.window_scale, 
				 o.window_translate, o.width, o.height, o.flux, 
				 o.drawn_reactions, o.cobra_reactions,
				 new_reaction_for_metabolite);
    }
    function cmd_save() {
        console.log("Saving");
        utils.download_json(map_for_export(), "saved_map");
    }
    function cmd_save_svg() {
        console.log("Exporting SVG");
	o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');	    
	o.direction_arrow.hide();
        utils.export_svg("saved_map", "svg");
    }
    function cmd_load() {
        console.log("Loading");
        o.load_input_click_fn();
    }
    function cmd_load_flux() {
	console.log("Loading flux");
	o.load_flux_input_click_fn();
    }
    function cmd_toggle_beziers() {
	if (o.show_beziers) cmd_hide_beziers();
	else cmd_show_beziers();
    }
    function cmd_show_beziers() {
	o.show_beziers = true;
	d3.select('#bezier-button').text('Hide control points (b)')
	    .on('click', cmd_hide_beziers);
	draw_everything();
    }
    function cmd_hide_beziers() {
	o.show_beziers = false;
	d3.select('#bezier-button').text('Show control points (b)')
	    .on('click', cmd_show_beziers);
	draw_everything();
    }
    function cmd_zoom_on() {
	o.zoom_container.toggle_zoom(true);
	enable_brush(false);
	d3.select('#zoom-button').text('Enable select (v)')
	    .on('click', cmd_zoom_off);
    }
    function cmd_zoom_off() {
	o.zoom_container.toggle_zoom(false);
	enable_brush(true);
	d3.select('#zoom-button').text('Enable pan+zoom (z)')
	    .on('click', cmd_zoom_on);
    }
    function cmd_rotate_selected_nodes() {
	/** Request a center, then listen for rotation, and rotate nodes.

	 */
	var selected_nodes = get_selected_nodes();
	if (selected_nodes.length < 1) return console.warn('No nodes selected');
	
	var zoom_on = o.zoom_container.zoom_enabled(),
	    click_on = o.metabolite_click_enabled,
	    brush_on = brush_is_enabled(),
	    turn_everything_on = function() {
		// turn the zoom and click back on 
		o.zoom_container.toggle_zoom(zoom_on);
		o.metabolite_click_enabled = click_on;
		enable_brush(brush_on);
	    };
	o.zoom_container.toggle_zoom(false);
	o.metabolite_click_enabled = false;
	enable_brush(false);

	var saved_center, total_angle = 0,
	    selected_node_ids = Object.keys(selected_nodes);

	choose_center(function(center) {
	    saved_center = center;
	    listen_for_rotation(center, function(angle) {
		total_angle += angle;
		var updated = build.rotate_selected_nodes(selected_nodes, o.drawn_reactions,
							  angle, center);
		draw_these_nodes(updated.node_ids);
		draw_these_reactions(updated.reaction_ids);
	    }, turn_everything_on, turn_everything_on);
	}, turn_everything_on);

	// add to undo/redo stack
	o.undo_stack.push(function() {
	    // undo
	    var nodes = {};
	    selected_node_ids.forEach(function(id) { nodes[id] = o.drawn_nodes[id]; });
	    var updated = build.rotate_selected_nodes(nodes, o.drawn_reactions,
						      -total_angle, saved_center);
	    draw_these_nodes(updated.node_ids);
	    draw_these_reactions(updated.reaction_ids);
	}, function () {
	    // redo
	    var nodes = {};
	    selected_node_ids.forEach(function(id) { nodes[id] = o.drawn_nodes[id]; });
	    var updated = build.rotate_selected_nodes(nodes, o.drawn_reactions,
						      total_angle, saved_center);
	    draw_these_nodes(updated.node_ids);
	    draw_these_reactions(updated.reaction_ids);
	});

	// definitions
	function choose_center(callback, callback_canceled) {
	    console.log('Choose center');
	    set_status('Choose a node or point to rotate around.');
	    var selection_node = d3.selectAll('.node-circle'),
		selection_background = d3.selectAll('#mouse-node'),
		escape_listener = add_escape_listener(function() {
		    console.log('choose_center escape');
		    selection_node.on('mousedown.center', null);
		    selection_background.on('mousedown.center', null);
		    set_status('');
		    callback_canceled();
		});
	    // if the user clicks a metabolite node
	    selection_node.on('mousedown.center', function(d) {		    
		console.log('mousedown.center');
		// turn off the click listeners to prepare for drag
		selection_node.on('mousedown.center', null);
		selection_background.on('mousedown.center', null);
		set_status('');
		escape_listener.clear();
		// find the location of the clicked metabolite
		var center = { x: d.x, y: d.y };
		callback(center); 
	    });
	    // if the user clicks a point
	    selection_background.on('mousedown.center', function() {
		console.log('mousedown.center');
		// turn off the click listeners to prepare for drag
		selection_node.on('mousedown.center', null);
		selection_background.on('mousedown.center', null);
		set_status('');
		escape_listener.clear();
		// find the point on the background node where the user clicked
		var center = { x: o.scale.x_size.invert(d3.mouse(this)[0]), 
			       y: o.scale.y_size.invert(d3.mouse(this)[1]) };
		callback(center); 
	    });
	}
	function listen_for_rotation(center, callback, callback_finished, 
				     callback_canceled) {
	    console.log('listen_for_rotation');
	    set_status('Drag to rotate.');
	    o.zoom_container.toggle_zoom(false);
	    var angle = Math.PI/2,
		selection = d3.selectAll('#mouse-node'),
		drag = d3.behavior.drag(),
		escape_listener = add_escape_listener(function() {
		    console.log('listen_for_rotation escape');
		    drag.on('drag.rotate', null);
		    drag.on('dragend.rotate', null);
		    set_status('');
		    callback_canceled();
		});
	    // drag.origin(function() { return point_of_grab; });
	    drag.on("drag.rotate", function() { 
		callback(angle_for_event({ dx: o.scale.x_size.invert(d3.event.dx), 
					   dy: o.scale.y_size.invert(d3.event.dy) },
					 { x: o.scale.x_size.invert(d3.mouse(this)[0]),
					   y: o.scale.y_size.invert(d3.mouse(this)[1]) },
					 center));
	    }).on("dragend.rotate", function() {
		console.log('dragend.rotate');
		drag.on('drag.rotate', null);
		drag.on('dragend.rotate', null);
		set_status('');
		escape_listener.clear();
		callback_finished();
	    });
	    selection.call(drag);

	    // definitions
	    function angle_for_event(displacement, point, center) {
		var gamma =  Math.atan2((point.x - center.x), (center.y - point.y)),
		    beta = Math.atan2((point.x - center.x + displacement.dx), 
				      (center.y - point.y - displacement.dy)),
		    angle = beta - gamma;
		return angle;
	    }
	}
    }

    function cmd_delete_selected_nodes() {
	/** Delete the selected nodes and associated segments and reactions.

	 Undoable.

	 */
	var selected_nodes = get_selected_nodes();
	if (selected_nodes.length < 1) return console.warn('No nodes selected');

	var out = segments_and_reactions_for_nodes(selected_nodes),
	    reactions = out.reactions,
	    segment_objs_w_segments = out.segment_objs_w_segments;

	// copy nodes to undelete
	var saved_nodes = utils.clone(selected_nodes),
	    saved_segment_objs_w_segments = utils.clone(segment_objs_w_segments),
	    saved_reactions = utils.clone(reactions);

	// delete
	delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);

	// add to undo/redo stack
	o.undo_stack.push(function() {
	    // undo
	    // redraw the saved nodes, reactions, and segments
	    utils.extend(o.drawn_nodes, saved_nodes);
	    utils.extend(o.drawn_reactions, saved_reactions);
	    var reactions_to_draw = Object.keys(saved_reactions);
	    saved_segment_objs_w_segments.forEach(function(segment_obj) {
		o.drawn_reactions[segment_obj.reaction_id]
		    .segments[segment_obj.segment_id] = segment_obj.segment;
		reactions_to_draw.push(segment_obj.reaction_id);
	    });
	    draw_these_nodes(Object.keys(saved_nodes));
	    draw_these_reactions(reactions_to_draw);
	    // copy nodes to re-delete
	    selected_nodes = utils.clone(saved_nodes);
	    segment_objs_w_segments = utils.clone(saved_segment_objs_w_segments);
	    reactions = utils.clone(saved_reactions);
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);
	});

	// definitions
	function delete_and_draw(nodes, reactions, segment_objs) {
	    // delete nodes, segments, and reactions with no segments
	    delete_nodes(selected_nodes);
	    delete_segments(segment_objs);
	    delete_reactions(reactions);
	    
	    // redraw
	    // TODO just redraw these nodes and segments
	    draw_everything();
	}
    }

    function cmd_zoom_extent(margin) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins.

	 */

	// optional args
	if (margin===undefined) margin = 180;

	// get the extent of the nodes
	var min = { x: null, y: null }, // TODO make infinity?
	    max = { x: null, y: null }; 
	for (var node_id in o.drawn_nodes) {
	    var node = o.drawn_nodes[node_id];
	    if (min.x===null) min.x = o.scale.x(node.x);
	    if (min.y===null) min.y = o.scale.y(node.y);
	    if (max.x===null) max.x = o.scale.x(node.x);
	    if (max.y===null) max.y = o.scale.y(node.y);

	    min.x = Math.min(min.x, o.scale.x(node.x));
	    min.y = Math.min(min.y, o.scale.y(node.y));
	    max.x = Math.max(max.x, o.scale.x(node.x));
	    max.y = Math.max(max.y, o.scale.y(node.y));
	}
	// set the zoom
        var new_zoom = Math.min((o.width - margin*2) / (max.x - min.x),
				(o.height - margin*2) / (max.y - min.y)),
	    new_pos = { x: - (min.x * new_zoom) + margin + ((o.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			y: - (min.y * new_zoom) + margin + ((o.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	o.window_scale = new_zoom;
        o.window_translate = new_pos;
        go();

	// definitions
        function go() {
            o.zoom_container.translate([o.window_translate.x, o.window_translate.y]);
            o.zoom_container.scale(o.window_scale);
            o.sel.transition()
                .attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
        };
    }

    function cmd_make_selected_node_primary() {
	var selected_nodes = get_selected_nodes();	    
	// can only have one selected
	if (Object.keys(selected_nodes).length != 1)
	    return console.error('Only one node can be selected');
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id];
	// make it primary
	o.drawn_nodes[node_id].node_is_primary = true;
	var nodes_to_draw = [node_id];
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [];
	o.drawn_nodes[node_id].connected_segments.forEach(function(segment_info) {
	    var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id];
	    connected_anchor_ids.push(segment.from_node_id==node_id ?
				      segment.to_node_id : segment.from_node_id);
	});
	// 2. find nodes connected to the anchor that are metabolites
	connected_anchor_ids.forEach(function(anchor_id) {
	    var segments = [];
	    o.drawn_nodes[anchor_id].connected_segments.forEach(function(segment_info) {
		var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		    conn_met_id = segment.from_node_id == anchor_id ? segment.to_node_id : segment.from_node_id,
		    conn_node = o.drawn_nodes[conn_met_id];
		if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		    conn_node.node_is_primary = false;
		    nodes_to_draw.push(conn_met_id);
		}
	    });
	});
	// draw the nodes
	draw_these_nodes(nodes_to_draw);
    }

    function cmd_cycle_primary_node() {
	var selected_nodes = get_selected_nodes();
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id];
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [], reactions_to_draw;
	o.drawn_nodes[node_id].connected_segments.forEach(function(segment_info) {
	    reactions_to_draw = [segment_info.reaction_id];
	    var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id];
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
	o.drawn_nodes[connected_anchor_id].connected_segments.forEach(function(segment_info) { // deterministic order
	    var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		conn_met_id = segment.from_node_id == connected_anchor_id ? segment.to_node_id : segment.from_node_id,
		conn_node = o.drawn_nodes[conn_met_id];
	    if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		related_node_ids.push(String(conn_met_id));
	    }
	});
	// 3. make sure they only have 1 reaction connection, and check if
	// they match the other selected nodes
	for (var i=0; i<related_node_ids.length; i++) {
	    if (o.drawn_nodes[related_node_ids[i]].connected_segments.length > 1)
		return console.error('Only connected nodes with a single reaction can be selected');
	}
	for (var a_selected_node_id in selected_nodes) {
	    if (a_selected_node_id!=node_id && related_node_ids.indexOf(a_selected_node_id) == -1)
		return console.warn('Selected nodes are not on the same reaction');
	}
	// 4. change the primary node, and change coords, label coords, and beziers
	var nodes_to_draw = [],
	    last_i = related_node_ids.length - 1,
	    last_node = o.drawn_nodes[related_node_ids[last_i]],
	    last_is_primary = last_node.node_is_primary,
	    last_coords = { x: last_node.x, y: last_node.y,
			    label_x: last_node.label_x, label_y: last_node.label_y },
	    last_segment_info = last_node.connected_segments[0], // guaranteed above to have only one
	    last_segment = o.drawn_reactions[last_segment_info.reaction_id].segments[last_segment_info.segment_id],
	    last_bezier = { b1: last_segment.b1, b2: last_segment.b2 },
	    primary_node_id;
	related_node_ids.forEach(function(related_node_id) {
	    var node = o.drawn_nodes[related_node_id],
		this_is_primary = node.node_is_primary,
		these_coords = { x: node.x, y: node.y,
				 label_x: node.label_x, label_y: node.label_y },
		this_segment_info = node.connected_segments[0],
		this_segment = o.drawn_reactions[this_segment_info.reaction_id].segments[this_segment_info.segment_id],
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
	var old_connected_segments = o.drawn_nodes[connected_anchor_id].connected_segments,
	    last_i = old_connected_segments.length - 1,
	    new_connected_segments = [old_connected_segments[last_i]];
	old_connected_segments.forEach(function(segment, i) {
	    if (last_i==i) return;
	    new_connected_segments.push(segment);
	});
	o.drawn_nodes[connected_anchor_id].connected_segments = new_connected_segments;	    
	// 6. draw the nodes
	draw_these_nodes(nodes_to_draw);
	draw_these_reactions(reactions_to_draw);
	// 7. select the primary node
	select_metabolite_with_id(primary_node_id);
    }
    function cmd_direction_arrow_right() {
	o.direction_arrow.set_rotation(0);
    }
    function cmd_direction_arrow_down() {
	o.direction_arrow.set_rotation(90);
    }
    function cmd_direction_arrow_left() {
	o.direction_arrow.set_rotation(180);
    }
    function cmd_direction_arrow_up() {
	o.direction_arrow.set_rotation(270);
    }
    function cmd_undo() {
	o.undo_stack.undo();
    }
    function cmd_redo() {
	o.undo_stack.redo();
    }

});
