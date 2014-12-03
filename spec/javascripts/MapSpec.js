describe('Map', function() {
    var map, svg;

    beforeEach(function() {
	// set up map
	svg = d3.select('body').append('svg');
	
	var sel = svg.append('g'),
            // streams are required for these options
	    required_options = { reaction_scale: [],
			         metabolite_scale: [],
                                 reaction_styles: [],
                                 reaction_compare_style: 'diff',
                                 metabolite_styles: [],
                                 metabolite_compare_style: 'diff' },
            required_conditional_options = [ 'reaction_scale', 'metabolite_scale' ];
	    set_option = function(key, val) { required_options[key] = val; },
	    get_option = function(key) { return required_options[key]; };
	    
	map = escher.Map.from_data(get_map(),
				   svg,
				   null,
				   sel,
				   null,
				   new escher.Settings(set_option, get_option,
                                                       required_conditional_options),
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
	expect(map.has_data_on_reactions).toBe(false);
	expect(map.has_data_on_nodes).toBe(false);
	
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

	expect(map.has_data_on_reactions).toBe(true);
	for (var id in map.reactions) {
	    var reaction = map.reactions[id];
	    if (reaction.bigg_id=='GLCtex') {
		expect(reaction.data).toEqual(100);
		expect(reaction.data_string).toEqual('100.0');
	    } else {
		expect(reaction.data).toBe(null);
	    }
	}

	expect(map.has_data_on_nodes).toBe(true);
	for (var id in map.nodes) {
	    var node = map.nodes[id];
	    if (node.bigg_id_compartmentalized=='glc__D_p')
		expect(map.nodes[id].data).toBe(3);
	    else
		expect(map.nodes[id].data).toBe(null);
	}
	
	map.apply_reaction_data_to_map(null);
	expect(map.has_data_on_reactions).toBe(false);
	for (var id in map.reactions) {
	    expect(map.reactions[id].data).toBe(null);
	}

	map.apply_metabolite_data_to_map(null);
	expect(map.has_data_on_nodes).toBe(false);
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
					],
                           genes: []
			 },
	    model = escher.CobraModel.from_cobra_json(model_data);
	map.cobra_model = model;

	map.new_reaction_from_scratch('acc_tpp', {x: 0, y: 0, gene_reaction_rule: ''}, 0);

	// find the reaction
	var match = null;
	for (var r_id in map.reactions) {
	    var r = map.reactions[r_id];
	    if (r.bigg_id == 'acc_tpp')
		match = r;
	}
	expect(match).not.toBe(null);
	// gene reaction rule
	expect(match.gene_reaction_rule)
	    .toEqual(model_data.reactions[0].gene_reaction_rule);
	
    });

    it('calculate stats', function() {
        // accept numbers, and parseFloats for strings. ignore emtpy strings and nulls.
        var data = { ENO: [10], PYRt2r: ['5'], TPI: [''], PGK: [null] };
        map.apply_reaction_data_to_map(data);
        map.calc_data_stats('reaction');
        expect(map.get_data_statistics())
            .toEqual({ reaction: { min: 5, median: 7.5, mean: 7.5,
                                   Q1: 5, Q3: 10, max: 10 },
                       metabolite: { min: null, median: null, mean: null,
                                     Q1: null, Q3: null, max: null } });
        // metabolites 
        data = { g3p_c: [10], pyr_c: ['5'] };
        map.apply_metabolite_data_to_map(data);
        map.calc_data_stats('metabolite');
        expect(map.get_data_statistics())
            .toEqual({ reaction: { min: 5, median: 7.5, mean: 7.5,
                                   Q1: 5, Q3: 10, max: 10 },
                       metabolite: { min: 5, median: 7.5, mean: 7.5,
                                     Q1: 5, Q3: 10, max: 10 } });
    });
});
