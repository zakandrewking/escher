describe('CobraModel', function() {
    it("reaction string", function () {
	var r = {'atp': -1, 'amp': -1, 'adp': 2},
	    s = escher.CobraModel.build_reaction_string(r, true,
							0, 0);
	expect(s).toEqual('atp + amp ↔ 2 adp');
	s = escher.CobraModel.build_reaction_string(r, false, 0, 1000);
	expect(s).toEqual('atp + amp → 2 adp');
	s = escher.CobraModel.build_reaction_string(r, false, -10, 0);
	expect(s).toEqual('atp + amp ← 2 adp');
    });
    
    it("New model", function () {
	var model_data = {reactions: {}};
	expect(function() { escher.CobraModel(model_data);} )
	    .toThrow(new Error("Bad model data."));
    });
    it("Formulas and genes", function () {
	var model_data = { reactions: [ { id: 'acc_tpp',
					  metabolites: { acc_c: 1, acc_p: -1 },
                                          gene_reaction_rule: 'my_gene'
					},
                                        { id: 'my_empty_reaction',
					  metabolites: {},
                                          gene_reaction_rule: ''
					}
				      ],
			   metabolites: [ { id: 'acc_c',
					    formula: 'C3H2' },
					  { id: 'acc_p',
					    formula: 'C3H2' }
					],
                           genes: [ { id: 'my_gene', name: 'gene_name' } ]
			 };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp: { metabolites: { acc_c: 1, 
					acc_p: -1 },
                         gene_reaction_rule: 'my_gene',
                         genes: [ { bigg_id: 'my_gene', name: 'gene_name' } ]
		       },
              my_empty_reaction: { metabolites: {},
                                   gene_reaction_rule: '',
                                   genes: []
                                 }
	    });
	expect(model.metabolites).toEqual(
	    { acc_c: { formula: 'C3H2' },
	      acc_p: { formula: 'C3H2' }
	    });
    });
    it("Cofactors", function () {
	var model_data = {reactions: [],
			  metabolites: [],
                          genes: [] },
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toContain('atp');
    });
});
