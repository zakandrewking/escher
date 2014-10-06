describe('data_styles', function() {
    it('import_and_check', function() {
	// reaction data
	var reaction_data = { R1: 0, R2: 4, R3: -12.3 },
	    expected = { R1: [0], R2: [4], R3: [-12.3] };
	    out = escher.data_styles.import_and_check(reaction_data, [], 'reaction_data');
	expect(out).toEqual(expected);
	
	// gene data, funny names
	var gene_data = { G1ORF: 0, G2ANDHI: 4, G3: -12.3 },
	    reactions = { reaction_1: { gene_reaction_rule: '(G1ORF AND G2ANDHI) OR G3' }},
	    expected = { reaction_1: { rule: '(G1ORF AND G2ANDHI) OR G3',
				     genes: { G1ORF: [0],
					      G2ANDHI: [4],
					      G3: [-12.3] }}},
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
    
    it('genes_for_gene_reaction_rule', function() {
	// funny names
	var rule = '(G1ORF AND G2ANDHI) OR (G3 AND G4)';
	expect(escher.data_styles.genes_for_gene_reaction_rule(rule))
	    .toEqual(['G1ORF', 'G2ANDHI', 'G3', 'G4']);
	
	// empty
	var rule = '';
	expect(escher.data_styles.genes_for_gene_reaction_rule(rule))
	    .toEqual([]);
    });

    it('evaluate_gene_reaction_rule', function() {
	// funny gene names, upper and lowercase ANDs
	var rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)',
	    gene_values = {G1: [5], G2: [2], G3ANDHI: [10], G4ORF: [11.5]},
	    out = escher.data_styles.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual([12]);
	
	// multiple values
	var rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)',
	    gene_values = {G1: [5, 0], G2: [2, 0], G3ANDHI: [10, 0], G4ORF: [11.5, 6]},
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
	expect(escher.data_styles.evaluate_gene_reaction_rule.bind(null, rule, gene_values))
	    .toThrow();
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