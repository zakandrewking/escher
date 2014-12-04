describe('data_styles', function() {
    it('import_and_check', function() {
	// reaction data
	var reaction_data = { R1: 0, R2: 4, R3: -12.3 },
	    expected = { R1: [0], R2: [4], R3: [-12.3] };
	    out = escher.data_styles.import_and_check(reaction_data, 'reaction_data');
	expect(out).toEqual(expected);
	
	// gene data, funny names
	var gene_data = { G1ORF: 0, G2ANDHI: 4, 'G3-A': -12.3 },
	    reactions = { '2': { bigg_id: 'reaction_1',
                                 gene_reaction_rule: '(G1ORF AND G2ANDHI) OR G3-A' }},
	    expected = { reaction_1: { G1ORF: [0],
				       G2ANDHI: [4],
				       'G3-A': [-12.3] }},
	    out = escher.data_styles.import_and_check(gene_data, 'gene_data', reactions);
	expect(out).toEqual(expected);
	
	// gene data, multiple sets
	var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
	    reactions = { '3': { bigg_id: 'reaction_1',
                                 gene_reaction_rule: '(G1 AND G2) OR G3' }},
	    expected = { reaction_1: { G1: [0, 2],
				       G2: [4, 6],
				       G3: [-12.3, null] }},
	    out = escher.data_styles.import_and_check(gene_data, 'gene_data', reactions);
	expect(out).toEqual(expected);

	// gene data, null
	var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
	    reactions = { '1': { bigg_id: 'reaction_1',
                                 gene_reaction_rule: '' }},
	    expected = { reaction_1: {} },
	    out = escher.data_styles.import_and_check(gene_data, 'gene_data', reactions);
	expect(out).toEqual(expected);

	// empty dataset
	var gene_data = {},
	    reactions = { r1: { bigg_id: 'reaction_1',
                                gene_reaction_rule: '(G1 AND G2) OR G3' }},
	    expected = { reaction_1: { G1: [null],
				       G2: [null],
				       G3: [null] } },
	    out = escher.data_styles.import_and_check(gene_data, 'gene_data', reactions);
	expect(out).toEqual(expected);
    });

    it('float_for_data',  function() {
        // single
        expect(escher.data_styles.float_for_data([-10], ['abs'], 'diff'))
            .toEqual(10);
        // string
        expect(escher.data_styles.float_for_data(['-10'], [], 'diff'))
            .toEqual(-10);
        // diff
        expect(escher.data_styles.float_for_data([10, -5], [], 'diff'))
            .toEqual(-15);
        // abs diff
        expect(escher.data_styles.float_for_data([10, -5], ['abs'], 'diff'))
            .toEqual(15);
        // fold
        expect(escher.data_styles.float_for_data([10, 5], [], 'log2_fold'))
            .toEqual(-1);
        expect(escher.data_styles.float_for_data([10, 5], ['abs'], 'log2_fold'))
            .toEqual(1);
        // infinity
        expect(escher.data_styles.float_for_data([0, 5], [], 'log2_fold'))
            .toEqual(null);
        // abs negative fold
        expect(escher.data_styles.float_for_data([10, -5], ['abs'], 'log2_fold'))
            .toEqual(null);
        // both neg fold
        expect(escher.data_styles.float_for_data([-10, -5], [], 'log2_fold'))
            .toEqual(-1); 
        // one neg, no abs
        expect(escher.data_styles.float_for_data([10, -5], [], 'log2_fold'))
            .toEqual(null);
        // with zeros
        expect(escher.data_styles.float_for_data([10, 0], [], 'log2_fold'))
            .toEqual(null);
        expect(escher.data_styles.float_for_data([0, 10], [], 'log2_fold'))
            .toEqual(null);
        // null values 
        expect(escher.data_styles.float_for_data([null], [], 'log2_fold'))
            .toEqual(null);
        expect(escher.data_styles.float_for_data([''], [], 'log2_fold'))
            .toEqual(null);
        // bad compare_style
        expect(escher.data_styles.float_for_data.bind(null, [10, 5], [], 'd'))
            .toThrow();
    });
    
    it('text_for_data', function() {
        expect(escher.data_styles.text_for_data([10], 10))
            .toEqual('10.0');
        expect(escher.data_styles.text_for_data([-10], 10))
            .toEqual('-10.0');
        expect(escher.data_styles.text_for_data([-10, 5], 10))
            .toEqual('-10.0, 5.00: 10.0');
    });

    it('reverse_flux_for_data',  function() {
        expect(escher.data_styles.reverse_flux_for_data([10]))
            .toEqual(false);
        expect(escher.data_styles.reverse_flux_for_data([-10, 5]))
            .toEqual(true);
    });

    it('gene_string_for_data',  function() {
        // with data
        expect(escher.data_styles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                       [{bigg_id: 'G1', name: 'Gene1'}],
                                                       ['abs'], 'bigg_id', 'log2_fold'))
            .toEqual('( G1 (-10.0))');
        expect(escher.data_styles.gene_string_for_data('G1', { G1: [-10] },
                                                       [{bigg_id: 'G1', name: 'Gene1'}],
                                                       ['abs'], 'bigg_id', 'log2_fold'))
            .toEqual('G1 (-10.0)');
        expect(escher.data_styles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                       [{bigg_id: 'G1', name: 'Gene1'}],
                                                       ['abs'], 'name', 'log2_fold'))
            .toEqual('( Gene1 (-10.0))');
        // no data
        expect(escher.data_styles.gene_string_for_data('( G1 OR G2 )', null,
                                                       [{bigg_id: 'G1', name: 'Gene1'},
                                                        {bigg_id: 'G2', name: 'Gene2'}],
                                                       ['abs'], 'name', 'log2_fold'))
            .toEqual('( Gene1\n OR Gene2)');
    });
    
    it('stores text for non-numeric data', function() {
        expect(escher.data_styles.float_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s'], [], 'log2_fold'))
            .toEqual(null);
        expect(escher.data_styles.text_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s', '8'], null))
            .toEqual('2dmmql8_c + fum_c --> 2dmmq8_c + s, 8: (nd)');
        expect(escher.data_styles.reverse_flux_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s']))
            .toEqual(false);
        expect(escher.data_styles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', '8'] },
                                                       [{bigg_id: 'G1', name: 'Gene1'}],
                                                       ['abs'], 'name', 'log2_fold'))
            .toEqual('( Gene1 (my favorite gene✓, 8: nd))');
        expect(escher.data_styles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', 'text'] },
                                                       [{bigg_id: 'G1', name: 'Gene1'}],
                                                       ['abs'], 'name', 'log2_fold'))
            .toEqual('( Gene1 (my favorite gene✓, text))');
    });
    
    it('csv_converter', function() {
        var csv_rows = [['gene', 'v1', 'v2'],
                        ['g1', '10', '20'],
                        ['g2', '15', '25'],
                        ['g3', 'text', 'data']];
        expect(escher.data_styles.csv_converter(csv_rows))
            .toEqual([{'g1': '10', 'g2': '15', g3: 'text'}, {g1: '20', g2: '25', g3: 'data'}]);
    });
    
    it('genes_for_gene_reaction_rule', function() {
	// funny names
	var rule = '(G1ORF AND G2ANDHI) or YER060W-A OR (G3-A AND G4)';
	expect(escher.data_styles.genes_for_gene_reaction_rule(rule))
	    .toEqual(['G1ORF', 'G2ANDHI', 'YER060W-A', 'G3-A', 'G4']);
	
	// empty
	var rule = '';
	expect(escher.data_styles.genes_for_gene_reaction_rule(rule))
	    .toEqual([]);
    });

    it('evaluate_gene_reaction_rule', function() {
	// funny gene names, upper and lowercase ANDs
	var rule = '(G1 AND G2-A) OR (G3ANDHI aNd G4ORF)',
	    gene_values = {G1: [5], 'G2-A': [2], G3ANDHI: [10], G4ORF: [11.5]};
	var out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'mean');
	expect(out).toEqual([14.25]);

	// specific bug: repeat
	rule = '( YER056C  or  YER060W  or  YER060W-A  or  YGL186C )';
	gene_values = {"YER056C": ['151'], "YER060W": ['10'],
		       "YER060W-A": ['2'], "YGL186C": ['17']};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([180]);

	// single negative
	rule = 'YER056C';
	gene_values = {"YER056C": [-151]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([null]);
	
	// multiple values
	rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)';
	gene_values = {G1: [5, 0], G2: [2, 0], G3ANDHI: [10, 0], G4ORF: [11.5, 6]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([12, 0]);

        // order of operations
        rule = '( YEL039C and YKR066C or YJR048W and YKR066C )';
        gene_values = { YEL039C: ['1'], YKR066C: ['2'], YJR048W: ['4'] };
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([3]);
        
	// empty
	out = escher.data_styles.evaluate_gene_reaction_rule('', {}, 'min');
	expect(out).toEqual([null]);
	
	// null values
	rule = '(G1 AND G2) OR (G3 AND G4)';
	gene_values = {G1: [5], G2: [2], G3: [''], G4: [null]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([2]);
	gene_values = {G1: [null], G2: [null], G3: [null], G4: [null]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([null]);
	gene_values = {G1: [''], G2: [''], G3: [''], G4: ['']};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	expect(out).toEqual([null]);
	
	// illegal 
	// rule = '(G1 AND G2) OR (G3 AND G4)';
	// gene_values = {G1: [5], G2: [2], G3: [10], G4: 'DROP DATABASE db'};
	// out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
	// expect(out).toEqual([null]);
    });
    
    it('evaluate_gene_reaction_rule, complex cases', function() {
	// complex cases
	var rule = '( (( YCR034W      or  YGR032W)      and  YLR343W )       or  ( ( YCR034W  and  YGR032W )  and  YMR215W )  or  ( ( YCR034W  and  YMR306W )  and  YMR215W )  or  ( ( YCR034W  and  YLR342W )  and  YOL132W )  or  ( ( YCR034W  and  YMR306W )  and  YOL132W )  or  ( ( YCR034W  and  YGR032W )  and  YOL030W )  or  ( ( YCR034W  and  YLR342W )  and  YOL030W )  or  ( ( YCR034W  and  YMR306W )  and  YOL030W )  or  ( ( YCR034W  and  YLR342W )  and  YLR343W )  or  ( ( YCR034W  and  YMR306W )  and  YLR343W )  or  ( ( YCR034W  and  YGR032W )  and  YOL132W )  or  ( ( YCR034W  and  YLR342W )  and  YMR215W )  or  ( ( YCR034W  and  YGR032W )  and  YMR307W )  or  ( ( YCR034W  and  YLR342W )  and  YMR307W )  or  ( ( YCR034W  and  YMR306W )  and  YMR307W ) )',
	    gene_values = {"YCR034W":[8],
			   "YGR032W":[12],
			   "YLR343W":[2],
			   "YMR215W":[null],
			   "YMR306W":[-5.603479644538055],
			   "YLR342W":[-8.560205416555595],
			   "YOL132W":[-7.133712781035477],
			   "YOL030W":[-6.097013023625431],
			   "YMR307W":[-7.909738697562627]};
	expect(escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'))
	    .toEqual([2]);

	rule = '( YOL096C  and  YDR204W  and  YML110C  and  YGR255C  and  YOR125C  and  YGL119W  and  YLR201C )';
	gene_values = {"YOL096C":[-9.966322672776391],
		       "YDR204W":[null],
		       "YML110C":[5.727832840424934],
		       "YGR255C":[null],
		       "YOR125C":[null],
		       "YGL119W":[null],
		       "YLR201C":[-7.88335943096544]};
	expect(escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'))
	    .toEqual([0]);

        rule = '(( (YJL130C) ) or (YJR109C and YOR303W))';
        gene_values = { YJL130C: ['80.0'],
                        YJR109C: ['70.5'],
                        YOR303W: ['200.5233'] };
	expect(escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'))
	    .toEqual([150.5]);
    });

    it('replace_gene_in_rule', function() {
        expect(escher.data_styles.replace_gene_in_rule('G3 G300', 'G3', 'new'))
            .toEqual('new G300');
        expect(escher.data_styles.replace_gene_in_rule('(G3)00', 'G3', 'new'))
            .toEqual('(new)00');
        expect(escher.data_styles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new'))
            .toEqual('(new)00 new');

        var start = new Date().getTime(),
            n = 1000.0;
        for (var i = 0; i < n; i++) {
            escher.data_styles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new');
        }
        var time = new Date().getTime() - start;
        console.log('replace_gene_in_rule execution time per ' + n + ': ' + time + 'ms');
    });

    it('apply_reaction_data_to_reactions', function() {
        // for Map.reactions
        var reactions = { 238: { bigg_id: 'GAPD',
                                 segments: { 2: {}}}},
            data = { GAPD: [0, 10] };
        var out = escher.data_styles.apply_reaction_data_to_reactions(reactions, data, [], 'diff');
        expect(out).toEqual(true);
        expect(reactions).toEqual({ 238: { bigg_id: 'GAPD',
                                           data: 10.0,
                                           data_string: '0.00, 10.0: 10.0',
                                           reverse_flux: false,
                                           gene_string: null,
                                           segments: { 2: { data: 10.0,
                                                            reverse_flux: false }}}});
    });
    
    it('apply_metabolite_data_to_nodes', function() {
        // for Map.reactions
        var nodes = { 238: { bigg_id: 'g3p_c' }},
            data = { g3p_c: [0, 10] };
        var out = escher.data_styles.apply_metabolite_data_to_nodes(nodes, data, [], 'diff');
        expect(out).toEqual(true);
        expect(nodes).toEqual({ 238: { bigg_id: 'g3p_c',
                                       data: 10.0,
                                       data_string: '0.00, 10.0: 10.0' }});
    });
    
    it('apply_gene_data_to_reactions', function() {
        // for Map.reactions
        var reactions = { 238: { bigg_id: 'GAPD',
                                 gene_reaction_rule: 'b1779',
                                 genes: [ { bigg_id: 'b1779',
                                            name: 'gapA' } ],
                                 segments: { 2: {}}}},
            data = { GAPD: { b1779: [0, 10] }};
        var out = escher.data_styles.apply_gene_data_to_reactions(reactions, data, [],
                                                                  'name', 'diff', 'min');
        expect(out).toEqual(true);
        expect(reactions).toEqual({ 238: { bigg_id: 'GAPD',
                                           gene_reaction_rule: 'b1779',
                                           genes: [ { bigg_id: 'b1779',
                                                      name: 'gapA' } ],
                                           data: 10.0,
                                           data_string: '0.00, 10.0: 10.0',
                                           gene_string: 'gapA (0.00, 10.0: 10.0)',
                                           reverse_flux: false,
                                           segments: { 2: { data: 10.0,
                                                            reverse_flux: false }}}});
    }); 
});
