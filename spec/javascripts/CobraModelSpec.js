describe('CobraModel', function() {
    it("reaction string", function () {
	var r = { atp: -1, amp: -1, adp: 2 },
	    s = escher.CobraModel.build_reaction_string(r, true);
	expect(s).toEqual('atp + amp ↔ 2 adp');
	s = escher.CobraModel.build_reaction_string(r, false);
	expect(s).toEqual('atp + amp → 2 adp');
    });
    
    it("New model", function () {
	var model = new escher.CobraModel();
    });
    
    it("Formulas, genes, reversibility", function () {
	var model_data = { reactions: [ { id: 'acc_tpp',
					  metabolites: { acc_c: 1, acc_p: -1 },
                                          gene_reaction_rule: 'my_gene',
                                          lower_bound: -100,
                                          upper_bound: -2
					},
                                        { id: 'my_empty_reaction',
					  metabolites: {},
                                          gene_reaction_rule: '',
                                          lower_bound: -4,
                                          upper_bound: 1000
					}
				      ],
			   metabolites: [ { id: 'acc_c',
					    formula: 'C3H2' },
					  { id: 'acc_p',
					    formula: 'C3H2' }
					],
                           genes: [ { id: 'my_gene', name: 'gene_name' } ]
			 };
	var model = escher.CobraModel.from_cobra_json(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp: { bigg_id: 'acc_tpp',
                         metabolites: { acc_c: -1, // should reverse the reaction
					acc_p: 1 },
                         reversibility: false,
                         gene_reaction_rule: 'my_gene',
                         genes: [ { bigg_id: 'my_gene', name: 'gene_name' } ]
		       },
              my_empty_reaction: { bigg_id: 'my_empty_reaction',
                                   metabolites: {},
                                   gene_reaction_rule: '',
                                   genes: [],
                                   reversibility: true
                                 }
	    });
	expect(model.metabolites).toEqual(
	    { acc_c: { bigg_id: 'acc_c',
                       formula: 'C3H2' },
	      acc_p: { bigg_id: 'acc_p',
                       formula: 'C3H2' }
	    });
    });
    
    it("Cofactors", function () {
	var model_data = { reactions: [],
			   metabolites: [],
                           genes: [] },
	    model = escher.CobraModel.from_cobra_json(model_data);
	expect(model.cofactors).toContain('atp');
    });

    it("import export", function() {
        // set up
	var model_data = { reactions: [ { id: 'acc_tpp',
					  metabolites: { acc_c: 1, acc_p: -1 },
                                          gene_reaction_rule: 'my_gene',
                                          lower_bound: -100,
                                          upper_bound: -2
					},
                                        { id: 'my_empty_reaction',
					  metabolites: {},
                                          gene_reaction_rule: '',
                                          lower_bound: -4,
                                          upper_bound: 1000
					}
				      ],
			   metabolites: [ { id: 'acc_c',
					    formula: 'C3H2' },
					  { id: 'acc_p',
					    formula: 'C3H2' }
					],
                           genes: [ { id: 'my_gene', name: 'gene_name' } ]
			 };
	var model = escher.CobraModel.from_cobra_json(model_data);

        // export
        var exp = model.model_for_export();

        // import
        var new_model = escher.CobraModel.from_exported_data(exp);

        // check
        expect(new_model.reactions).toEqual(
	    { acc_tpp: { bigg_id: 'acc_tpp',
                         metabolites: { acc_c: -1, // should reverse the reaction
					acc_p: 1 },
                         reversibility: false,
                         gene_reaction_rule: 'my_gene',
                         genes: [ { bigg_id: 'my_gene', name: 'gene_name' } ]
		       },
              my_empty_reaction: { bigg_id: 'my_empty_reaction',
                                   metabolites: {},
                                   gene_reaction_rule: '',
                                   genes: [],
                                   reversibility: true
                                 }
	    });
	expect(new_model.metabolites).toEqual(
	    { acc_c: { bigg_id: 'acc_c',
                       formula: 'C3H2' },
	      acc_p: { bigg_id: 'acc_p',
                       formula: 'C3H2' }
	    });
    });
});
