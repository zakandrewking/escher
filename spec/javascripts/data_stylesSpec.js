describe('data_styles', function() {
    it('import_and_check', function() {
	// reaction data
	var reaction_data = { R1: 0, R2: 4, R3: -12.3 },
	    expected = { R1: [0], R2: [4], R3: [-12.3] };
	    out = escher.data_styles.import_and_check(reaction_data, [], 'reaction_data');
	expect(out).toEqual(expected);
	
	// gene data, funny names
	var gene_data = { G1ORF: 0, G2ANDHI: 4, 'G3-A': -12.3 },
	    reactions = { reaction_1: { gene_reaction_rule: '(G1ORF AND G2ANDHI) OR G3-A' }},
	    expected = { reaction_1: { rule: '(G1ORF AND G2ANDHI) OR G3-A',
				     genes: { G1ORF: [0],
					      G2ANDHI: [4],
					      'G3-A': [-12.3] }}},
	    out = escher.data_styles.import_and_check(gene_data, [], 'gene_data', reactions);
	expect(out).toEqual(expected);
	
	// gene data, multiple sets
	var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
	    reactions = { reaction_1: { gene_reaction_rule: '(G1 AND G2) OR G3' }},
	    expected = { reaction_1: { rule: '(G1 AND G2) OR G3',
				       genes: { G1: [0, 2],
						G2: [4, 6],
						G3: [-12.3, null] }}},
	    out = escher.data_styles.import_and_check(gene_data, [], 'gene_data', reactions);
	expect(out).toEqual(expected);

	// gene data, null
	var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
	    reactions = { reaction_1: { gene_reaction_rule: '' }},
	    expected = { reaction_1: { rule: '',
				       genes: {} }},
	    out = escher.data_styles.import_and_check(gene_data, [], 'gene_data', reactions);
	expect(out).toEqual(expected);

	// empty dataset
	var gene_data = {},
	    reactions = { reaction_1: { gene_reaction_rule: '(G1 AND G2) OR G3' }},
	    expected = { reaction_1: { rule: '(G1 AND G2) OR G3',
				       genes: { G1: [null],
					        G2: [null],
					        G3: [null] } }},
	    out = escher.data_styles.import_and_check(gene_data, [], 'gene_data', reactions);
	expect(out).toEqual(expected);
    });

    it('float_for_data',  function() {
        // single
        expect(escher.data_styles.float_for_data([-10], ['abs'], 'diff'))
            .toEqual(10);
        // diff
        expect(escher.data_styles.float_for_data([10, -5], [], 'diff'))
            .toEqual(-15);
        // abs diff
        expect(escher.data_styles.float_for_data([10, -5], ['abs'], 'diff'))
            .toEqual(-5);
        // fold
        expect(escher.data_styles.float_for_data([10, 5], ['abs'], 'log2_fold'))
            .toEqual(-1);
        // infinity
        expect(escher.data_styles.float_for_data([0, 5], [], 'log2_fold'))
            .toEqual(null);
        // abs negative fold
        expect(escher.data_styles.float_for_data([10, -5], ['abs'], 'log2_fold'))
            .toEqual(-1);
        // both neg fold
        expect(escher.data_styles.float_for_data([-10, -5], [], 'log2_fold'))
            .toEqual(-1); 
        // one neg, no abs
        expect(escher.data_styles.float_for_data([10, -5], [], 'log2_fold'))
            .toEqual(null);
        // bad compare_style
        expect(escher.data_styles.float_for_data.bind(null, [10, 5], [], 'd'))
            .toThrow();
    });
    
    it('text_for_data', function() {
        expect(escher.data_styles.text_for_data([10], 10))
            .toEqual('10.00');
        expect(escher.data_styles.text_for_data([-10], 10))
            .toEqual('-10.00');
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
        expect(escher.data_styles.gene_string_for_data('( G1 )', { G1: [-10] }, ['abs'], 'log2_fold'))
            .toEqual('( G1 (-10.0))');
    });

    it('csv_converter', function() {
        var csv_rows = [['g1', 10, 20],
                        ['g2', 15, 25]];
        expect(escher.data_styles.csv_converter(csv_rows))
            .toEqual([{'g1': 10, 'g2': 15}, {'g1': 20, 'g2': 25}]);
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
	var out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([12]);

	// specific bug: repeat
	rule = '( YER056C  or  YER060W  or  YER060W-A  or  YGL186C )';
	gene_values = {"YER056C": [151], "YER060W": [10],
		       "YER060W-A": [2], "YGL186C": [17]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([180]);

	// single negative
	rule = 'YER056C';
	gene_values = {"YER056C": [-151]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([null]);
	
	// multiple values
	rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)';
	gene_values = {G1: [5, 0], G2: [2, 0], G3ANDHI: [10, 0], G4ORF: [11.5, 6]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([12, 0]);

	// empty
	out = escher.data_styles.evaluate_gene_reaction_rule('', {});
	expect(out).toEqual([null]);
	
	// null values
	rule = '(G1 AND G2) OR (G3 AND G4)';
	gene_values = {G1: [5], G2: [2], G3: [10], G4: [null]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([2]);
	gene_values = {G1: [null], G2: [null], G3: [null], G4: [null]};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([null]);
	
	// illegal 
	rule = '(G1 AND G2) OR (G3 AND G4)';
	gene_values = {G1: [5], G2: [2], G3: [10], G4: 'DROP DATABASE db'};
	out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([null]);
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
	expect(escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values))
	    .toEqual([2]);

	rule = '( YOL096C  and  YDR204W  and  YML110C  and  YGR255C  and  YOR125C  and  YGL119W  and  YLR201C )',
	gene_values = {"YOL096C":[-9.966322672776391],
		       "YDR204W":[null],
		       "YML110C":[5.727832840424934],
		       "YGR255C":[null],
		       "YOR125C":[null],
		       "YGL119W":[null],
		       "YLR201C":[-7.88335943096544]};
	expect(escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values))
	    .toEqual([0]);
    });
});
