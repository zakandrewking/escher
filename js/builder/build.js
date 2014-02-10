define(["metabolic-map/utils", "lib/d3"], function(utils, d3) {
    return { new_reaction: new_reaction,
	     rotate_selected_nodes: rotate_selected_nodes,
	     move_node_and_dependents: move_node_and_dependents };
    
    // definitions
    function new_reaction(reaction_abbreviation, cobra_reaction,
			  selected_node_id, selected_node,
			  largest_ids) {
        /** New reaction.

	 */
	
	// generate a new integer id
	var new_reaction_id = ++largest_ids.reactions;

        // calculate coordinates of reaction
	var selected_node_coords = { x: selected_node.x,
				     y: selected_node.y };
		
	// rotate main axis around angle with distance
	var reaction_length = 300,
            main_axis = [ selected_node_coords,
			  utils.c_plus_c(selected_node_coords,
					 {'x': reaction_length, 'y': 0}) ],
	    center = { 'x': (main_axis[0].x + main_axis[1].x)/2,  
                       'y': (main_axis[0].y + main_axis[1].y)/2 };
	    
	// relative label location
	var label_d = { x: 30, y: 10 };

	// relative anchor node distance
	var anchor_distance = 20;

	// new reaction structure
	var direction = cobra_reaction.reversibility ? 'Reversible' : 'Irreversible',
	    new_reaction = { abbreviation: reaction_abbreviation,
			     direction: direction,
			     label_x: center.x + label_d.x,
			     label_y: center.y + label_d.y,
			     name: cobra_reaction.name,
			     segments: {} };	

        // // set primary metabolites and count reactants/products
        // var primary_reactant_index = 0,
        //     primary_product_index = 0;
        // var reactant_count = 0, product_count = 0,
	//     reaction_is_reversed = false;
	// // look for the selected metabolite
        // for (var metabolite_abbreviation in cobra_reaction.metabolites) {
        //     var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
	//     if (metabolite.coefficient < 0) {
        //         metabolite.index = reactant_count;
	// 	if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized)
	// 	    primary_reactant_index = reactant_count; 
        //         reactant_count++;
	//     } else {
        //         metabolite.index = product_count;
	// 	if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized) {
	// 	    primary_product_index = product_count;
	// 	    reaction_is_reversed = true;
	// 	}
        //         product_count++;
	//     }
	// }
	// // set primary metabolites
        // for (var metabolite_abbreviation in cobra_reaction.metabolites) {
        //     var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
        //     if (metabolite.coefficient < 0) {
        //         if (metabolite.index==primary_reactant_index) metabolite.is_primary = true;
	// 	metabolite.count = reactant_count + 1;
        //     } else {
        //         if (metabolite.index==primary_product_index) metabolite.is_primary = true;
	// 	metabolite.count = product_count + 1;
        //     }
        // }

	// NEW =========
        // set primary metabolites and count reactants/products

	// look for the selected metabolite, and record the indices
	var reactant_ranks = [], product_ranks = [], 
            reactant_count = 0, product_count = 0,
	    reaction_is_reversed = false;
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
	    if (metabolite.coefficient < 0) {
                metabolite.index = reactant_count;
		// score the metabolites. Infinity == selected, >= 1 == carbon containing
		var carbons = /C([0-9]+)/.exec(metabolite.formula);
		if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized) {
		    reactant_ranks.push([metabolite.index, Infinity]);
		} else if (carbons) {
		    reactant_ranks.push([metabolite.index, carbons[1]]);
		}
                reactant_count++;
	    } else {
                metabolite.index = product_count;
		var carbons = /C([0-9]+)/.exec(metabolite.formula);
		if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized) {
		    product_ranks.push([metabolite.index, Infinity]);
		    reaction_is_reversed = true;
		} else if (carbons) {
		    product_ranks.push([metabolite.index, carbons[1]]);
		}
                product_count++;
	    }
	}

	// get the rank with the highest score
	var max_rank = function(old, current) { return current[1] > old[1] ? current : old; },
            primary_reactant_index = reactant_ranks.reduce(max_rank, [0,0])[0],
            primary_product_index = reactant_ranks.reduce(max_rank, [0,0])[0];

	// set primary metabolites, and keep track of the total counts
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
            if (metabolite.coefficient < 0) {
                if (metabolite.index==primary_reactant_index) metabolite.is_primary = true;
		metabolite.count = reactant_count + 1;
            } else {
                if (metabolite.index==primary_product_index) metabolite.is_primary = true;
		metabolite.count = product_count + 1;
            }
        }
	// =======

	// generate anchor nodes
	var new_anchors = {},
	    anchors = [ { node_type: 'anchor_reactants',
			  dis: { x: anchor_distance * (reaction_is_reversed ? 1 : -1), y: 0 } },
			{ node_type: 'center',
			  dis: { x: 0, y: 0 } },
			{ node_type: 'anchor_products',
			  dis: { x: anchor_distance * (reaction_is_reversed ? -1 : 1), y: 0 } } ],
	    anchor_ids = {};
	anchors.map(function(n) {
	    var new_id = ++largest_ids.nodes;
	    new_anchors[new_id] = { node_type: n.node_type,
				    x: center.x + n.dis.x,
				    y: center.y + n.dis.y,
				    connected_segments: [] };
	    anchor_ids[n.node_type] = new_id;
	});

	// add the segments, outside to inside
	var new_anchor_groups = [ [ anchor_ids['anchor_reactants'], anchor_ids['center'] ],
				  [ anchor_ids['anchor_products'],  anchor_ids['center'] ] ];
	new_anchor_groups.map(function(l) {
	    var from_id = l[0], to_id = l[1],
		new_segment_id = ++largest_ids.segments;
	    new_reaction.segments[new_segment_id] =  { b1: null,
						       b2: null,
						       from_node_id: from_id,
						       to_node_id: to_id };
	    new_anchors[from_id].connected_segments.push({ segment_id: new_segment_id,
							   reaction_id: new_reaction_id });
	    new_anchors[to_id].connected_segments.push({ segment_id: new_segment_id,
							 reaction_id: new_reaction_id });
	});

        // Add the metabolites, keeping track of total reactants and products.
	var new_nodes = new_anchors;
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
            var primary_index, from_node_id;
            if (metabolite.coefficient < 0) {
                // metabolite.count = reactant_count + 1;
                primary_index = primary_reactant_index;
		from_node_id = anchor_ids['anchor_reactants'];
            } else {
                // metabolite.count = product_count + 1;
                primary_index = primary_product_index;
		from_node_id = anchor_ids['anchor_products'];
            }
	    
            // calculate coordinates of metabolite components
            var met_loc = calculate_new_metabolite_coordinates(metabolite,
							       primary_index,
							       main_axis,
							       center,
							       reaction_length,
							       reaction_is_reversed);

	    // if this is the existing metabolite
	    if (metabolite.bigg_id_compartmentalized==
		selected_node.bigg_id_compartmentalized) {
		var new_segment_id = ++largest_ids.segments;
		new_reaction.segments[new_segment_id] = { from_node_id: from_node_id,
							  to_node_id: selected_node_id,
							  b1: met_loc.b1,
							  b2: met_loc.b2 };
		// update the existing node
		selected_node.connected_segments.push({ segment_id: new_segment_id,
							reaction_id: new_reaction_id });
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    } else {
		// save new metabolite
		var new_segment_id = ++largest_ids.segments,
		    new_node_id = ++largest_ids.nodes;
		new_reaction.segments[new_segment_id] = { from_node_id: from_node_id,
							  to_node_id: new_node_id,
							  b1: met_loc.b1,
							  b2: met_loc.b2 };
		// save new node
		new_nodes[new_node_id] = { connected_segments: [{ segment_id: new_segment_id,
								  reaction_id: new_reaction_id }],
					   x: met_loc.circle.x,
					   y: met_loc.circle.y,
					   node_is_primary: metabolite.is_primary,
					   compartment_name: metabolite.compartment,
					   label_x: met_loc.circle.x + label_d.x,
					   label_y: met_loc.circle.y + label_d.y,
					   metabolite_name: metabolite.name,
					   bigg_id: metabolite.bigg_id,
					   bigg_id_compartmentalized: metabolite.bigg_id_compartmentalized,
					   node_type: 'metabolite' };
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    }
	}

	// new_reactions object
	var new_reactions = {};
	new_reactions[new_reaction_id] = new_reaction;
	
	// rotate the new reaction around the selected metabolite
	var angle = Math.PI / 2; // default angle

	// add the selected node for rotation, and return it as a new (updated) node
	new_nodes[selected_node_id] = selected_node;
	var updated = rotate_selected_nodes(new_nodes, new_reactions,
					    angle, selected_node_coords);

	return { new_reactions: new_reactions,
		 new_nodes: new_nodes };
    }

    function rotate_selected_nodes(selected_nodes, reactions, angle, center) {
	/** Rotate the selected nodes around center.

	 selected_nodes: Nodes to rotate.
	 reactions: Only updates beziers for these reactions.
	 angle: Angle to rotate in radians.
	 center: Point to rotate around.

	 */
	
	// functions
	var rotate_around = function(coord) {
	    if (coord === null)
		return null;
	    return utils.rotate_coords(coord, angle, center);
	};

	// recalculate: node
	var updated_node_ids = [], updated_reaction_ids = [];
	for (var node_id in selected_nodes) {
	    var node = selected_nodes[node_id],
		// rotation distance
		displacement = rotate_around({ x: node.x, y: node.y }),
		// move the node
		updated = move_node_and_labels(node, reactions,
						   displacement);
	    // move the bezier points
	    node.connected_segments.map(function(segment_obj) {
		var reaction = reactions[segment_obj.reaction_id];
		// If the reaction was not passed in the reactions argument, then ignore
		if (reaction === undefined) return;

		// rotate the beziers
		var segment = reaction.segments[segment_obj.segment_id];
		if (segment.to_node_id==node_id && segment.b2) {
		    var displacement = rotate_around(segment.b2);
		    segment.b2 = utils.c_plus_c(segment.b2, displacement);
		} else if (segment.from_node_id==node_id && segment.b1) {
		    var displacement = rotate_around(segment.b1);
		    segment.b1 = utils.c_plus_c(segment.b1, displacement);
		}
	    });

	    updated_reaction_ids = utils.unique_concat([updated_reaction_ids,
							updated.reaction_ids]);
	    updated_node_ids.push(node_id);
	}

	return { node_ids: updated_node_ids,
		 reaction_ids: updated_reaction_ids };
    }
    
    function move_node_and_dependents(node, node_id, reactions, displacement) {
	/** Move the node and its labels and beziers.

	 */
	var updated = move_node_and_labels(node, reactions, displacement);

	// move beziers
	node.connected_segments.map(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id];
	    // If the reaction was not passed in the reactions argument, then ignore
	    if (reaction === undefined) return;

	    // update beziers
	    var segment = reaction.segments[segment_obj.segment_id];
	    if (segment.from_node_id==node_id && segment.b1) {
		segment.b1 = utils.c_plus_c(segment.b1, displacement);
	    }
	    if (segment.to_node_id==node_id && segment.b2) {
		segment.b2 = utils.c_plus_c(segment.b2, displacement);
	    }
	    // add to list of updated reaction ids if it isn't already there
	    if (updated.reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
	        updated.reaction_ids.push(segment_obj.reaction_id);
	    }
	});
	return updated;
    }

    function move_node_and_labels(node, reactions, displacement) {
	node.x = node.x + displacement.x;
	node.y = node.y + displacement.y;
	    
	// recalculate: node label
	node.label_x = node.label_x + displacement.x;
	node.label_y = node.label_y + displacement.y;

	// recalculate: reaction label
	var updated_reaction_ids = [];
	node.connected_segments.map(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id];
	    // add to list of updated reaction ids if it isn't already there
	    if (updated_reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
		updated_reaction_ids.push(segment_obj.reaction_id);

		// update reaction label (but only once per reaction
		if (node.node_type == 'center') {
		    reaction.label_x = reaction.label_x + displacement.x;
		    reaction.label_y = reaction.label_y + displacement.y;
		}
	    }
	});
	return { reaction_ids: updated_reaction_ids };
    }


    function calculate_new_metabolite_coordinates(met, primary_index, main_axis, center, dis, is_reversed) {
	/** Calculate metabolite coordinates for a new reaction metabolite.

	 */
	// new local coordinate system
	var displacement = main_axis[0],
	    main_axis = [utils.c_minus_c(main_axis[0], displacement),
			 utils.c_minus_c(main_axis[1], displacement)],
	    center = utils.c_minus_c(center, displacement);
	
        // Curve parameters
        var w = 60,  // distance between reactants and between products
            b1_strength = 0.5,
            b2_strength = 0.2,
            w2 = w*0.7,
            secondary_dis = 40,
            num_slots = Math.min(2, met.count - 1);

        // size and spacing for primary and secondary metabolites
        var ds, draw_at_index, r;
        if (met.is_primary) { // primary
            ds = 20;
        } else { // secondary
            ds = 10;
            // don't use center slot
            if (met.index > primary_index) draw_at_index = met.index - 1;
            else draw_at_index = met.index;
        }

        var de = dis - ds, // distance between ends of line axis
            reaction_axis = [{'x': ds, 'y': 0},
                             {'x': de, 'y': 0}];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right. 
        var end, circle, b1, b2;
        // reactants
        if (((met.coefficient < 0) != is_reversed) && met.is_primary) { // Ali == BADASS
            end = {'x': reaction_axis[0].x,
                   'y': reaction_axis[0].y};
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[0].y*b1_strength};
            b2 = {'x': center.x*b2_strength + (end.x)*(1-b2_strength),
                  'y': center.y*b2_strength + (end.y)*(1-b2_strength)},
            circle = {'x': main_axis[0].x,
                      'y': main_axis[0].y};
        } else if ((met.coefficient < 0) != is_reversed) {
	    end = {'x': reaction_axis[0].x + secondary_dis,
                   'y': reaction_axis[0].y + (w2*draw_at_index - w2*(num_slots-1)/2)},
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[0].y*b1_strength},
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[0].x + secondary_dis,
                      'y': main_axis[0].y + (w*draw_at_index - w*(num_slots-1)/2)};
        } else if (((met.coefficient > 0) != is_reversed) && met.is_primary) {        // products
            end = {'x': reaction_axis[1].x,
                   'y': reaction_axis[1].y};
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x,
                      'y': main_axis[1].y};
        } else if ((met.coefficient > 0) != is_reversed) {
            end = {'x': reaction_axis[1].x - secondary_dis,
                   'y': reaction_axis[1].y + (w2*draw_at_index - w2*(num_slots-1)/2)},
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x - secondary_dis,
                      'y': main_axis[1].y + (w*draw_at_index - w*(num_slots-1)/2)};
        }
	var loc = {};
	loc.b1 = utils.c_plus_c(displacement, b1);
	loc.b2 = utils.c_plus_c(displacement, b2);
	loc.circle = utils.c_plus_c(displacement, circle);
        return loc;
    }

});
