describe('Map', function() {
    var map, svg;

    beforeEach(function() {
	// set up map
	svg = d3.select('body').append('svg');
	
	var sel = svg.append('g'),
	    options = {	auto_reaction_domain: true,
			reaction_data: null,
			reaction_styles: ['color', 'size', 'abs', 'text'],
			reaction_domain: [-10, 0, 10],
			reaction_color_range: ['rgb(200,200,200)', 'rgb(150,150,255)', 'purple'],
			reaction_size_range: [4, 8, 12],
			reaction_no_data_color: 'rgb(220,220,220)',
			reaction_no_data_size: 4,
			// metabolite
			metabolite_data: null,
			metabolite_styles: ['color', 'size', 'text'],
			auto_metabolite_domain: true,
			metabolite_domain: [-10, 0, 10],
			metabolite_color_range: ['green', 'white', 'red'],
			metabolite_size_range: [6, 8, 10],
			metabolite_no_data_color: 'white',
			metabolite_no_data_size: 6,
			// gene
			gene_data: null,
			gene_styles: ['text'],
			// color reactions not in the model
			highlight_missing_color: 'red' },
	    set_option = function(key, val) { options[key] = val; },
	    get_option = function(key) { return options[key]; };
	
	map = escher.Map.from_data(get_map(),
				   svg,
				   null,
				   sel,
				   null,
				   new escher.Settings(set_option, get_option),
				   null,
				   false);
    });

    afterEach(function() {
	// clean up
	svg.remove();
    });

    it("def is the first element in the svg", function() {
	// this fixes a bug with export SVG files to certain programs,
	// e.g. Inkscape for Windows
	var defs_node = d3.select('defs').node();
	expect(defs_node.parentNode.firstChild).toBe(defs_node);	
    });	
    
    it("Load without and with reaction/metabolite data", function () {
	// no data
	expect(map.has_reaction_data).toBe(false);
	expect(map.has_metabolite_data).toBe(false);
	
	// data
	map.apply_reaction_data_to_map({'GLCtex': 100});
	map.apply_metabolite_data_to_map({'glc__D_p': 3});
			     
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

	expect(map.has_reaction_data).toBe(true);
	for (var id in map.reactions) {
	    var reaction = map.reactions[id];
	    if (reaction.bigg_id=='GLCtex') {
		expect(reaction.data).toEqual(100);
		expect(reaction.data_string).toEqual('100.0');
	    } else {
		expect(reaction.data).toBe(null);
	    }
	}

	expect(map.has_metabolite_data).toBe(true);
	for (var id in map.nodes) {
	    var node = map.nodes[id];
	    if (node.bigg_id_compartmentalized=='glc__D_p')
		expect(map.nodes[id].data).toBe(3);
	    else
		expect(map.nodes[id].data).toBe(null);
	}
	
	map.apply_reaction_data_to_map(null);
	expect(map.has_reaction_data).toBe(false);
	for (var id in map.reactions) {
	    expect(map.reactions[id].data).toBe(null);
	}

	map.apply_metabolite_data_to_map(null);
	expect(map.has_metabolite_data).toBe(false);
	for (var id in map.nodes) {
	    expect(map.nodes[id].data).toBe(null);
	}
    });

    it('Add reaction to map', function() {
	var model_data = { reactions: [ { id: 'acc_tpp',
					  metabolites: { acc_c: 1, acc_p: -1 },
					  gene_reaction_rule: 'Y1234'
					}
				      ],
			   metabolites: [ { id: 'acc_c',
					    formula: 'C3H2' },
					  { id: 'acc_p',
					    formula: 'C3H2' }
					]
			 },
	    model = escher.CobraModel(model_data);
	map.cobra_model = model;

	map.new_reaction_from_scratch('acc_tpp', {x: 0, y: 0}, 0);

	// find the reaction
	var match = null;
	for (var r_id in map.reactions) {
	    var r = map.reactions[r_id];
	    if (r.bigg_id == 'acc_tpp')
		match = r;
	}
	expect(match).not.toBe(null);
	// gene reactin rule
	expect(match.gene_reaction_rule)
	    .toEqual(model_data.reactions[0].gene_reaction_rule);
	
    });
});
