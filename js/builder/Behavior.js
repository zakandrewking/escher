define(["vis/utils", "lib/d3", "builder/build"], function(utils, d3, build) {
    /** Defines the set of click and drag behaviors for the map, and keeps track
     of which behaviors are activated.

     Has the following attributes:

     Behavior.node_click
     Behavior.node_drag
     Behavior.bezier_drag
     Behavior.label_drag
     */

    var Behavior = utils.make_class();
    Behavior.prototype = { init: init,
			   turn_everything_on: turn_everything_on,
			   turn_everything_off: turn_everything_off,
			   toggle_node_click: toggle_node_click,
			   toggle_node_drag: toggle_node_drag,
			   toggle_label_drag: toggle_label_drag,
			   get_reaction_label_drag: get_reaction_label_drag,
			   get_node_label_drag: get_node_label_drag,
			   get_text_label_drag: get_text_label_drag,
			   get_generic_drag: get_generic_drag };

    return Behavior;

    // definitions
    function init(map, undo_stack) {
	this.map = map;
	this.undo_stack = undo_stack;

	// make an empty function that can be called as a behavior and does nothing
	this.empty_behavior = function() {};

	// init empty
	this.node_click = null;
	this.node_drag = this.empty_behavior;
	this.bezier_drag = this.empty_behavior;
	this.reaction_label_drag = this.empty_behavior;
	this.node_label_drag = this.empty_behavior;
	this.text_label_drag = this.empty_behavior;
	this.turn_everything_on();
    }
    function turn_everything_on() {
	this.toggle_node_click(true);
	this.toggle_node_drag(true);
	this.toggle_label_drag(true);
    }
    function turn_everything_off() {
	this.toggle_node_click(false);
	this.toggle_node_drag(false);
	this.toggle_label_drag(false);
    }
    function toggle_node_click(on_off) {
	/** With no argument, toggle the node click on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.node_click==null;
	if (on_off) {
	    var map = this.map;
	    this.node_click = function node_click(d) {
		map.select_metabolite(this, d);
		d3.event.stopPropagation();
	    };
	} else {
	    this.node_click = null;
	}
    }
    function toggle_node_drag(on_off) {
	/** With no argument, toggle the node drag & bezier drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.node_drag===this.empty_behavior;
	if (on_off) {
	    this.node_drag = get_node_drag_behavior(this.map, this.undo_stack);
	    this.bezier_drag = get_bezier_drag_behavior(this.map, this.undo_stack);
	} else {
	    this.node_drag = this.empty_behavior;
	}
    }
    function toggle_label_drag(on_off) {
	/** With no argument, toggle the label drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.label_drag===this.empty_behavior;
	if (on_off) {
	    this.reaction_label_drag = this.get_reaction_label_drag(this.map, this.scale);
	    this.node_label_drag = this.get_node_label_drag(this.map, this.scale);
	    this.text_label_drag = this.get_text_label_drag(this.map, this.scale);
	} else {
	    this.reaction_label_drag = this.empty_behavior;
	    this.node_label_drag = this.empty_behavior;
	    this.text_label_drag = this.empty_behavior;
	}
    }

    function get_node_drag_behavior(map, undo_stack) {
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    nodes_to_drag,
	    reaction_ids,
	    the_timeout;

        behavior.on("dragstart", function () { 
	    // Note that dragstart is called even for a click event
	    var data = this.parentNode.__data__,
		bigg_id_compartmentalized = data.bigg_id_compartmentalized,
		node_group = this.parentNode;
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    // remember the total displacement for later
	    total_displacement = {};
	    // Move element to back (for the next step to work). Wait 200ms
	    // before making the move, becuase otherwise the element will be
	    // deleted before the click event gets called, and selection
	    // will stop working.
	    the_timeout = window.setTimeout(function() {
		node_group.parentNode.insertBefore(node_group,node_group.parentNode.firstChild);
	    }, 200);
	    // prepare to combine metabolites
	    d3.selectAll('.metabolite-circle')
		.on('mouseover.combine', function(d) {
		    if (d.bigg_id_compartmentalized==bigg_id_compartmentalized &&
			d.node_id!=data.node_id) {
			d3.select(this).style('stroke-width', String(map.scale.size(12))+'px')
			    .classed('node-to-combine', true);
		    }
		}).on('mouseout.combine', function(d) {
		    if (d.bigg_id_compartmentalized==bigg_id_compartmentalized &&
			d.node_id!==data.node_id) {
			d3.select(this).style('stroke-width', String(map.scale.size(2))+'px')
			    .classed('node-to-combine', false);
		    }
		});
	});
        behavior.on("drag", function() {
	    var grabbed_id = this.parentNode.__data__.node_id, 
		selected_ids = map.get_selected_node_ids();
	    nodes_to_drag = [];
	    // choose the nodes to drag
	    if (selected_ids.indexOf(grabbed_id)==-1) { 
		nodes_to_drag.push(grabbed_id);
	    } else {
		nodes_to_drag = selected_ids;
	    }
	    reaction_ids = [];
	    nodes_to_drag.forEach(function(node_id) {
		// update data
		var node = map.nodes[node_id],
		    displacement = { x: map.scale.x_size.invert(d3.event.dx),
				     y: map.scale.y_size.invert(d3.event.dy) },
		    updated = build.move_node_and_dependents(node, node_id, map.reactions, displacement);
		reaction_ids = utils.unique_concat([reaction_ids, updated.reaction_ids]);
		// remember the displacements
		if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 };
		total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement);
	    });
	    // draw
	    map.draw_these_nodes(nodes_to_drag);
	    map.draw_these_reactions(reaction_ids);
	});
	behavior.on("dragend", function() {	
	    // look for mets to combine
	    var node_to_combine_array = [];
	    d3.selectAll('.node-to-combine').each(function(d) {
		node_to_combine_array.push(d.node_id);
	    });
	    if (node_to_combine_array.length==1) {
		// If a node is ready for it, combine nodes
		var fixed_node_id = node_to_combine_array[0],
		    dragged_node_id = this.parentNode.__data__.node_id,
		    saved_dragged_node = utils.clone(map.nodes[dragged_node_id]),
		    segment_objs_moved_to_combine = combine_nodes_and_draw(fixed_node_id, dragged_node_id);
		undo_stack.push(function() {
		    // undo
		    // put the old node back
		    map.nodes[dragged_node_id] = saved_dragged_node;
		    var fixed_node = map.nodes[fixed_node_id],
			updated_reactions = [];
		    segment_objs_moved_to_combine.forEach(function(segment_obj) {
			var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
			if (segment.from_node_id==fixed_node_id) segment.from_node_id = dragged_node_id;
			else if (segment.to_node_id==fixed_node_id) segment.to_node_id = dragged_node_id;
			else console.error('Segment does not connect to fixed node');
			// removed this segment_obj from the fixed node
			fixed_node.connected_segments = fixed_node.connected_segments.filter(function(x) {
			    return !(x.reaction_id==segment_obj.reaction_id && x.segment_id==segment_obj.segment_id);
			});
			if (updated_reactions.indexOf(segment_obj.reaction_id)==-1)
			    updated_reactions.push(segment_obj.reaction_id);
		    });
		    map.draw_these_nodes([dragged_node_id]);
		    map.draw_these_reactions(updated_reactions);
		}, function () {
		    // redo
		    combine_nodes_and_draw(fixed_node_id, dragged_node_id);
		});

	    } else {
		// otherwise, drag node
		
		// add to undo/redo stack
		// remember the displacement, dragged nodes, and reactions
		var saved_displacement = utils.clone(total_displacement), // BUG TODO this variable disappears!
		    saved_node_ids = utils.clone(nodes_to_drag),
		    saved_reaction_ids = utils.clone(reaction_ids);
		undo_stack.push(function() {
		    // undo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions,
						       utils.c_times_scalar(saved_displacement[node_id], -1));
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		}, function () {
		    // redo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions,
						       saved_displacement[node_id]);
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		});
	    }

	    // stop combining metabolites
	    d3.selectAll('.metabolite-circle')
		.on('mouseover.combine', null)
		.on('mouseout.combine', null);

	    // clear the timeout
	    window.clearTimeout(the_timeout);
	});
	return behavior;

	// definitions
	function combine_nodes_and_draw(fixed_node_id, dragged_node_id) {
	    var dragged_node = map.nodes[dragged_node_id],
		fixed_node = map.nodes[fixed_node_id],
		updated_segment_objs = [];
	    dragged_node.connected_segments.forEach(function(segment_obj) {
		// change the segments to reflect
		var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
		if (segment.from_node_id==dragged_node_id) segment.from_node_id = fixed_node_id;
		else if (segment.to_node_id==dragged_node_id) segment.to_node_id = fixed_node_id;
		else return console.error('Segment does not connect to dragged node');
		// moved segment_obj to fixed_node
		fixed_node.connected_segments.push(segment_obj);
		updated_segment_objs.push(utils.clone(segment_obj));
	    });
	    // delete the old node
	    map.delete_nodes_by_id([dragged_node_id]);
	    // turn off the class
	    d3.selectAll('.node-to-combine').classed('node-to-combine', false);
	    // draw
	    map.draw_everything();
	    // return for undo
	    return updated_segment_objs;
	}
    }
    function get_bezier_drag_behavior(map, undo_stack) {
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    segment_id, reaction_id, bezier_number;

        behavior.on("dragstart", function () {
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    total_displacement = { x: 0, y: 0 };
	});
        behavior.on("drag", function(d) {
	    reaction_id = d.reaction_id;
	    segment_id = d.segment_id;
	    bezier_number = d.bezier;
	    // update data
	    var displacement = { x: map.scale.x_size.invert(d3.event.dx),
				 y: map.scale.y_size.invert(d3.event.dy) };
	    move_bezier(reaction_id, segment_id, bezier_number, displacement);
	    // remember the displacement
	    total_displacement = utils.c_plus_c(total_displacement, displacement);
	    // draw
	    map.draw_these_reactions([reaction_id]);
	});
	behavior.on("dragend", function(d) {			  
	    // add to undo/redo stack
	    // remember the displacement, dragged nodes, and reactions
	    var saved_displacement = utils.clone(total_displacement), // BUG TODO this variable disappears!
		saved_reaction_id = utils.clone(reaction_id);
	    undo_stack.push(function() {
		// undo
		move_bezier(reaction_id, segment_id, bezier_number,
			    utils.c_times_scalar(saved_displacement, -1));
		map.draw_these_reactions([saved_reaction_id]);
	    }, function () {
		// redo
		move_bezier(reaction_id, segment_id, bezier_number,
			    saved_displacement);
		map.draw_these_reactions([saved_reaction_id]);
	    });
	});
	return behavior;

	// definitions
	function move_bezier(reaction_id, segment_id, bezier_number, displacement) {
	    var segment = map.reactions[reaction_id].segments[segment_id];
	    segment['b'+bezier_number] = utils.c_plus_c(segment['b'+bezier_number], displacement);
	};
    }
    function get_reaction_label_drag(map, undo_stack) {
	var move_label = function(reaction_id, displacement) {
	    var reaction = map.reactions[reaction_id];
	    reaction.label_x = reaction.label_x + displacement.x;
	    reaction.label_y = reaction.label_y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.reaction_id, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.reaction_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_reactions([d.reaction_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.reaction_id, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_node_label_drag(map, undo_stack) {
	var move_label = function(node_id, displacement) {
	    var node = map.nodes[node_id];
	    node.label_x = node.label_x + displacement.x;
	    node.label_y = node.label_y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.node_id, displacement);
		map.draw_these_nodes([d.node_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.node_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_nodes([d.node_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.node_id, displacement);
		map.draw_these_nodes([d.node_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_text_label_drag(map, undo_stack) {
	var move_label = function(text_label_id, displacement) {
	    var text_label = map.text_labels[text_label_id];
	    text_label.x = text_label.x + displacement.x;
	    text_label.y = text_label.y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.text_label_id, displacement);
		map.draw_these_text_labels([d.text_label_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.text_label_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_text_labels([d.text_label_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.text_label_id, displacement);
		map.draw_these_text_labels([d.text_label_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn) {
	/** Make a generic drag behavior, with undo/redo.

	 start_fn: function(d) Called at dragstart.

	 drag_fn: function(d, displacement, total_displacement) Called during
	 drag.

	 end_fn

	 undo_fn

	 redo_fn

	 */
	 
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    scale = this.map.scale,
	    undo_stack = this.undo_stack;

        behavior.on("dragstart", function (d) {
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    total_displacement = { x: 0, y: 0 };
	    start_fn(d);
	});
        behavior.on("drag", function(d) {
	    // update data
	    var displacement = { x: scale.x_size.invert(d3.event.dx),
				 y: scale.y_size.invert(d3.event.dy) };
	    // remember the displacement
	    total_displacement = utils.c_plus_c(total_displacement, displacement);
	    drag_fn(d, displacement, total_displacement);
	});
	behavior.on("dragend", function(d) {			  
	    // add to undo/redo stack
	    // remember the displacement, dragged nodes, and reactions
	    var saved_d = utils.clone(d),
		saved_displacement = utils.clone(total_displacement); // BUG TODO this variable disappears!
	    undo_stack.push(function() {
		// undo
		undo_fn(saved_d, saved_displacement);
	    }, function () {
		// redo
		redo_fn(saved_d, saved_displacement);
	    });
	    end_fn(d);
	});
	return behavior;
    }
});
