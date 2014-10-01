describe('data_styles', function() {
    it('import_and_check', function() {
	// reaction data
	var reaction_data = { R1: 0, R2: 4, R3: -12.3 },
	    expected = { R1: [0], R2: [4], R3: [-12.3] };
	    out = escher.data_styles.import_and_check(reaction_data, [], 'reaction_data');
	expect(out).toEqual(expected);
	
	// gene data
	var gene_data = { G1: 0, G2: 4, G3: -12.3 },
	    reactions = { reaction_1: { gene_reaction_rule: '(G1 AND G2) OR G3' }},
	    expected = { reaction_1: { rule: '(G1 AND G2) OR G3',
				     genes: { G1: [0],
					      G2: [4],
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

    });
});
