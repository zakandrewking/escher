describe('CobraModel', function() {
    it("reaction string", function () {
	var r = {'atp': -1, 'amp': -1, 'adp': 2},
	    s = escher.CobraModel.build_reaction_string(r, true,
							0, 0);
	expect(s).toEqual('atp + amp <=> 2 adp');
	s = escher.CobraModel.build_reaction_string(r, false, 0, 1000);
	expect(s).toEqual('atp + amp --> 2 adp');
	s = escher.CobraModel.build_reaction_string(r, false, -10, 0);
	expect(s).toEqual('atp + amp <-- 2 adp');
    });

    it('genes_for_gene_reaction_rule', function() {
	var rule = '(G1 AND G2) OR (G3 AND G4)';
	expect(escher.CobraModel.genes_for_gene_reaction_rule(rule))
	    .toEqual(['G1', 'G2', 'G3', 'G4']);
    });

    it('evaluate_gene_reaction_rule', function() {
	var rule = '(G1 AND G2) OR (G3 AND G4)',
	    gene_values = {G1: 5, G2: 2, G3: 10, G4: 11},
	    out = escher.CobraModel.evaluate_gene_reaction_rule(rule, gene_values);
	expect(out).toEqual(12);
    });
    
    it("New model", function () {
	var model_data = {reactions: {}};
	expect(function() { escher.CobraModel(model_data);} )
	    .toThrow(new Error("Bad model data."));
    });
    it("Formulas", function () {
	var model_data = { reactions: [ { id: 'acc_tpp',
					  metabolites: { acc_c: 1, acc_p: -1 }
					}
				      ],
			   metabolites: [ { id: 'acc_c',
					    formula: 'C3H2' },
					  { id: 'acc_p',
					    formula: 'C3H2' }
					]
			 };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp: { metabolites: { acc_c: 1, 
					acc_p: -1 }
		       } 
	    });
	expect(model.metabolites).toEqual(
	    { acc_c: { formula: 'C3H2' },
	      acc_p: { formula: 'C3H2' }
	    });
    });
    it("Cofactors", function () {
	var model_data = {reactions: {},
			  metabolites: {},
			  cofactors: {} },
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toContain('atp');
    });
});
