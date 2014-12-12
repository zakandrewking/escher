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
				   true);
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
    
    it('Map search index', function() {
        // reactions
        expect(map.search_index.find('glyceraldehyde-3-phosphate dehydrogenase')[0])
            .toEqual({ type: 'reaction', reaction_id: '1576769' });
        expect(map.search_index.find('GAPD')[0])
            .toEqual({ type: 'reaction', reaction_id: '1576769' });
        expect(map.search_index.find('b1779')[0])
            .toEqual({ type: 'reaction', reaction_id: '1576769' });
        // metabolites
        expect(map.search_index.find('Glyceraldehyde-3-phosphate')[0])
            .toEqual({ type: 'metabolite', node_id: '1576545' });
        expect(map.search_index.find('^g3p_c$')[0])
            .toEqual({ type: 'metabolite', node_id: '1576545' });
        // text_labels
        expect(map.search_index.find('TEST')[0])
            .toEqual({ type: 'text_label', text_label_id: '1' });

        // delete reactions
        map.delete_reaction_data(['1576769']);
        expect(map.search_index.find('glyceraldehyde-3-phosphatedehydrogenase')).toEqual([]);
        expect(map.search_index.find('GAPD')).toEqual([]);
        expect(map.search_index.find('b1779')).toEqual([]);
        // delete nodes
        map.delete_node_data(['1576545', '1576575']);
        expect(map.search_index.find('Glyceraldehyde-3-phosphate')).toEqual([]);
        expect(map.search_index.find('^g3p_c$')).toEqual([]);
        // delete text_labels
        map.delete_text_label_data(['1']);
        expect(map.search_index.find('TEST')).toEqual([]);

        // new reaction
        map.extend_reactions({ '123456789': { bigg_id: 'EX_glc__D_p',
                                              name: 'periplasmic glucose exchange',
                                              gene_reaction_rule: 's0001',
                                              genes: [ { 'bigg_id': 's0001',
                                                         'name': 'spontaneous'} ] } });
        expect(map.search_index.find('EX_glc__D_p')[0])
            .toEqual({ type: 'reaction', reaction_id: '123456789' });
        expect(map.search_index.find('periplasmic glucose exchange')[0])
            .toEqual({ type: 'reaction', reaction_id: '123456789' });
        expect(map.search_index.find('s0001')[0])
            .toEqual({ type: 'reaction', reaction_id: '123456789' });
        expect(map.search_index.find('spontaneous')[0])
            .toEqual({ type: 'reaction', reaction_id: '123456789' });
        // new node
        map.extend_nodes({ '123456789': { bigg_id: 'glc__D_p',
                                          name: 'periplasmic glucose',
                                          node_type: 'metabolite' }});
        expect(map.search_index.find('^glc__D_p')[0])
            .toEqual({ type: 'metabolite', node_id: '123456789' });
        expect(map.search_index.find('periplasmic glucose$')[0])
            .toEqual({ type: 'metabolite', node_id: '123456789' });
        // new text label
        var id = map.new_text_label({ x: 0, y: 0 }, 'TESTEST');
        expect(map.search_index.find('TESTEST')[0])
            .toEqual({ type: 'text_label', text_label_id: id });

        // edit text label
        map.edit_text_label(id, 'TESTESTEST', false);
        expect(map.search_index.find('^TESTEST$')).toEqual([]);
        expect(map.search_index.find('TESTESTEST')[0])
            .toEqual({ type: 'text_label', text_label_id: id });
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
        var data = { PGI: [10], GAPD: ['5'], TPI: [''], PGK: [null] };
        map.apply_reaction_data_to_map(data);
        map.calc_data_stats('reaction');
        expect(map.get_data_statistics())
            .toEqual({ reaction: { min: 5, median: 7.5, mean: 7.5,
                                   Q1: 5, Q3: 10, max: 10 },
                       metabolite: { min: null, median: null, mean: null,
                                     Q1: null, Q3: null, max: null } });
        // metabolites 
        data = { g3p_c: [10], fdp_c: ['4'] };
        map.apply_metabolite_data_to_map(data);
        map.calc_data_stats('metabolite');
        expect(map.get_data_statistics())
            .toEqual({ reaction: { min: 5, median: 7.5, mean: 7.5,
                                   Q1: 5, Q3: 10, max: 10 },
                       metabolite: { min: 4, median: 10, mean: 8,
                                     Q1: 4, Q3: 10, max: 10 } });
    });
    
    it('map_for_export', function() {
        // check that unnecessary attributes are removed
        ['reactions', 'nodes', 'text_labels'].forEach(function(type) {
            for (var first in map[type]) {
                map[type][first].to_remove = true;
                var data = map.map_for_export();
                expect(data[1][type][first].to_remove).not.toBeDefined();
                break;
            }
        }); 
        map.canvas.to_remove = true;
        var data = map.map_for_export();
        expect(data[1].canvas.to_remove).not.toBeDefined();
    });
});
