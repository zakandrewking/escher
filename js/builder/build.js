define(["metabolic-map/utils", "lib/d3"], function(utils, d3) {
    return { new_reaction: new_reaction };
    
    // definitions
    function new_reaction(reaction_abbreviation, cobra_reaction, 
			  metabolite_simpheny_id_compartmentalized,
			  selected_metabolite_coords, largest_ids) {
        /** New reaction.

	 */
	
	// generate a new integer id
	var new_reaction_id = ++largest_ids.reactions;

        // calculate coordinates of reaction
        var loc = utils.calculate_new_reaction_coordinates(selected_metabolite_coords);

	// relative label location
	var label_d = { x: 80, y: 0 };

	// relative anchor node distance
	var anchor_distance = 20;

	// new reaction structure
	var new_reaction = { abbreviation: reaction_abbreviation,
			     direction: cobra_reaction.reversibility ? 'Reversible' : 'Irreversible',
			     label_x: loc.center.x + label_d.x,
			     label_y: loc.center.y + label_d.y,
			     name: cobra_reaction.name,
			     segments: {} };

	console.log(cobra_reaction);

	// generate anchor nodes
	// 
	// imported anchor nodes look like this:
	// connected_segments: Array[5]
	// node_id: "755272" // ignoring for now
	// node_is_primary: false // ignoring for now
	// node_type: "multimarker" // ignoring for now
	// previously_selected: false // ignoring for now
	// selected: false // ignoring for now
	// x: 2750
	// y: 2150 
	var new_anchors = {},
	    anchors = [ { title: 'anchor_reactants',
			  dis: { x: -anchor_distance, y: 0 } },
			{ title: 'center',
			  dis: { x: 0, y: 0 } },
			{ title: 'anchor_products',
			  dis: { x: anchor_distance, y: 0 } } ],
	    anchor_ids;
	anchors.map(function(n) {
	    var new_id = ++largest_ids.nodes;
	    new_anchors[new_id] = { title: n.title,
				    x: loc.center.x + n.dis.x,
				    y: loc.center.y + n.dis.y,
				    connected_segments: [] };
	    anchor_ids[n.title] = new_id;
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
	    new_anchors[from_id].connected_segments.push(new_segment_id);
	    new_anchors[to_id].connected_segments.push(new_segment_id);
	});

        // set primary metabolites and count reactants/products
	// 
	// defaults
        var primary_reactant_index = 0,
            primary_product_index = 0;
	// look for the selected metabolite
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
	    if (metabolite_simpheny_id_compartmentalized==metabolite_abbreviation) {
		metabolite.is_primary = true;
		if (metabolite.coefficient < 0) {
		    primary_reactant_index = reactant_count;
		} else {
		    primary_product_index = reactant_count;
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
	// label_x: 2780
	// label_y: 2030
	// metabolite_name: "D-Alanine"
	// metabolite_simpheny_id: "ala-D"
	// metabolite_simpheny_id_compartmentalized: "ala-D_c"
	// node_id: "755258"
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
                // primary_index = primary_reactant_index;
		from_node_id = anchor_ids['anchor_reactants'];
            } else {
                // metabolite.count = product_count + 1;
                // primary_index = primary_product_index;
		from_node_id = anchor_ids['anchor_products'];
            }
	    
            // calculate coordinates of metabolite components
            var metabolite_loc = utils.calculate_new_metabolite_coordinates(metabolite,
									    primary_index,
									    loc.main_axis,
									    loc.center,
									    loc.dis);

	    // save new metabolite
	    var new_segment_id = ++largest_ids.segments,
		new_node_id = ++largest_ids.nodes;
	    new_reaction.segments[new_segment_id] = { from_node_id: from_node_id,
						      to_node_id: new_node_id,
						      b1: metabolite_loc.b1,
						      b2: metabolite_loc.b2 };
	    // save new node
	    new_nodes[new_node_id] = { connected_segments: [new_segment_id],
				       x: metabolite_loc.x,
				       y: metabolite_loc.y,
				       node_is_primary: metabolite.is_primary,
				       compartment_name: null,
				       label_x: null,
				       label_y: null,
				       metabolite_name: null,
				       metabolite_simpheny_id: null,
				       metabolite_simpheny_id_compartmentalized: null,
				       node_type: null };	    
	}

	// new_reactions object
	var new_reactions = {};
	new_reactions[new_reaction_id] = new_reaction;

	// rotate the new reaction around the selected metabolite
	var angle = Math.PI / 2; // default angle
	rotate_reactions(new_reactions, new_nodes, angle, selected_metabolite_coords);

	return { new_reactions: new_reactions,
		 new_nodes: new_nodes };
    }

    // function rotate_reaction_id(reaction_id, angle, center) {
    // 	/** Rotate reaction with reaction_id in o.drawn_reactions around center.

    // 	 */
    // 	o.drawn_reactions[reaction_id] = rotate_reaction(o.drawn_reactions[reaction_id],
    // 							 angle, center);
    // }
    
    function rotate_reactions(new_reactions, new_nodes, angle, center) {
	/** Rotate reaction around center.

	 */

	// functions
	var rotate_around = function(coord) {
	    return utils.rotate_coords(coord, angle, center);
	};

	for (var reaction_id in new_reactions) {
	    var reaction = new_reactions[reaction_id];

	    // recalculate: label
	    var new_label_coords = rotate_around({ x: reaction.label_x, y: reaction.label_y });
	    reaction.label_x.x = new_label_coords.x;
	    reaction.label_y.y = new_label_coords.y;

	    // recalculate: segment
	    for (var segment_id in reaction.segments) {
		var segment = reaction.segments[segment_id];
		segment.b1 = rotate_around(segment.b1);
		segment.b2 = rotate_around(segment.b2);
	    }

	    // recalculate: node
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id],
		    new_node_coords = rotate_around({ x: node.x, y: node.x });
		node.x = new_node_coords.x;
		node.y = new_node_coords.y;
	    }
	}
    }
    
});
