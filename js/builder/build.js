define(["metabolic-map/utils", "lib/d3"], function(utils, d3) {
    return { new_reaction: new_reaction };
    
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

	// generate anchor nodes
	// 
	// imported anchor nodes look like this:
	// connected_segments: Array[5]
	// node_id: "755272"
	// node_is_primary: false // ignoring for now
	// node_type: "multimarker" // ignoring for now
	// previously_selected: false // ignoring for now
	// selected: false // ignoring for now
	// x: 2750
	// y: 2150 
	var new_anchors = {},
	    anchors = [ { node_type: 'anchor_reactants',
			  dis: { x: -anchor_distance, y: 0 } },
			{ node_type: 'center',
			  dis: { x: 0, y: 0 } },
			{ node_type: 'anchor_products',
			  dis: { x: anchor_distance, y: 0 } } ],
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
	// 
	// imported anchor segments look like this:
	// b1: null
	// b2: null
	// from_node_id: "755271"
	// segment_id: "453" // ignoring for now
	// to_node_id: "755272"
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

        // set primary metabolites and count reactants/products
	// 
	// defaults
        var primary_reactant_index = 0,
            primary_product_index = 0;
        var reactant_count = 0, product_count = 0;
	// look for the selected metabolite
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
	    if (selected_node.bigg_id_compartmentalized==
		metabolite.bigg_id_compartmentalized) {
		metabolite.is_primary = true;
		if (metabolite.coefficient < 0) {
		    primary_reactant_index = reactant_count;
                    reactant_count++;
		} else {
		    primary_product_index = reactant_count;
                    product_count++;
		}
	    }
	}
	// set primary metabolites
        var reactant_count = 0, product_count = 0;
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
            if (metabolite.coefficient < 0) {
                metabolite.index = reactant_count;
                if (reactant_count==primary_reactant_index) metabolite.is_primary = true;
                reactant_count++;
            } else {
                metabolite.index = product_count;
                if (product_count==primary_product_index) metabolite.is_primary = true;
                product_count++;
            }
        }

        // Add the metabolites, keeping track of total reactants and products.
	// 
	// imported new metabolite nodes look like this:
	// compartment_name: "cytosol"
	// connected_segments: Array[2]
	//     reaction_id: 755313
	//     segment_id: 472
	// label_x: 2780
	// label_y: 2030
	// metabolite_name: "D-Alanine"
	// bigg_id: "ala-D"
	// bigg_id_compartmentalized: "ala-D_c"
	// node_id: "755258" // where does this come from?
	// node_is_primary: true
	// node_type: "metabolite"
	// previously_selected: false
	// selected: false
	// x: 2750
	// y: 2030
	//
	// and new metabolite segments:
	// b1: Object
	//     x: 2750
	//     y: 2177
	// b2: Object
	//     x: 2750
	//     y: 2240
	// from_node_id: "755272"
	// segment_id: "457" // ignoring for now
	// to_node_id: "755252"
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
            var met_loc = utils.calculate_new_metabolite_coordinates(metabolite,
								     primary_index,
								     main_axis,
								     center,
								     reaction_length);

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
	    }
	}

	// new_reactions object
	var new_reactions = {};
	new_reactions[new_reaction_id] = new_reaction;
	
	// rotate the new reaction around the selected metabolite
	var angle = Math.PI / 2; // default angle
	rotate_reactions(new_reactions, new_nodes, angle, selected_node_coords);

	return { new_reactions: new_reactions,
		 new_nodes: new_nodes };
    }

    // function rotate_reaction_id(reaction_id, angle, center) {
    // 	/** Rotate reaction with reaction_id in o.drawn_reactions around center.

    // 	 */
    // 	o.drawn_reactions[reaction_id] = rotate_reaction(o.drawn_reactions[reaction_id],
    // 							 angle, center);
    // }
    
    function rotate_reactions(reactions, nodes, angle, center) {
	/** Rotate reaction around center.

	 */
	console.log(reactions, nodes);
	
	// functions
	var rotate_around = function(coord) {
	    if (coord === null)
		return null;
	    return utils.rotate_coords(coord, angle, center);
	};

	for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id];

	    // recalculate: label
	    var label_coords = rotate_around({ x: reaction.label_x, y: reaction.label_y });
	    reaction.label_x = label_coords.x;
	    reaction.label_y = label_coords.y;

	    // recalculate: segment
	    for (var segment_id in reaction.segments) {
		var segment = reaction.segments[segment_id];
		segment.b1 = rotate_around(segment.b1);
		segment.b2 = rotate_around(segment.b2);
	    }
	}
	// recalculate: node
	for (var node_id in nodes) {
	    var node = nodes[node_id],
		node_coords = rotate_around({ x: node.x, y: node.y });
	    node.x = node_coords.x;
	    node.y = node_coords.y;
	    
	    // recalculate: label
	    var label_coords = rotate_around({ x: node.label_x, y: node.label_y });
	    node.label_x = label_coords.x;
	    node.label_y = label_coords.y;
	}
    }    
});
