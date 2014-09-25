describe('Map', function() {
    it("Load with reaction/met data", function () {
	var svg = d3.select('body').append('svg'),
	    sel = svg.append('g'),
	    map = escher.Map.from_data(get_map(),
				       svg,
				       null,
				       sel,
				       null,
				       new escher.Settings(),
				       {'GLCtex': 100},
				       {'glc__D_p': 3},
				       null,
				       false);


			     
	// make sure ids are saved correctly
	for (var id in map.reactions) {
	    // ids should be strings that eval to integers
	    expect(isNaN(id)).toBe(false);
	    // bigg ids should be present
	    expect(map.reactions[id].bigg_id).toBeDefined();
	    expect(map.reactions[id].bigg_id_compartmentalized).not.toBeDefined();
	}
	for (var id in map.nodes) {
	    var node = map.nodes[id];
	    // ids should be strings that eval to integers
	    expect(isNaN(id)).toBe(false);
	    if (node.node_type=='metabolite') {
		// bigg ids and compartments should be present
		expect(map.nodes[id].bigg_id).toBeDefined();
	    }
	}

	expect(map.has_reaction_data()).toBe(true);
	for (var id in map.reactions) {
	    var reaction = map.reactions[id];
	    if (reaction.bigg_id=='GLCtex') {
		expect(reaction.data).toEqual(100);
		expect(reaction.data_string).toEqual('100.0');
	    } else {
		expect(reaction.data).toBe(null);
	    }
	}

	expect(map.has_metabolite_data()).toBe(true);
	for (var id in map.nodes) {
	    var node = map.nodes[id];
	    if (node.bigg_id_compartmentalized=='glc__D_p')
		expect(map.nodes[id].data).toBe(3);
	    else
		expect(map.nodes[id].data).toBe(null);
	}
	
	map.set_reaction_data(null);
	expect(map.has_reaction_data()).toBe(false);
	for (var id in map.reactions) {
	    expect(map.reactions[id].data).toBe(null);
	}

	map.set_metabolite_data(null);
	expect(map.has_metabolite_data()).toBe(false);
	for (var id in map.nodes) {
	    expect(map.nodes[id].data).toBe(null);
	}
	svg.remove();
    });
    it("Load without reaction/met data", function () {
	var svg = d3.select('body').append('svg'),
	    sel = svg.append('g'),
	    map = escher.Map.from_data(get_map(),
				       svg,
				       null,
				       sel,
				       null,
				       new escher.Settings(),
				       null,
				       null,
				       null,
				       null);

	expect(map.has_reaction_data()).toBe(false);
	expect(map.has_metabolite_data()).toBe(false);
	svg.remove();
    });
});
