describe('CobraModel', function() {
    it("New model", function () {
	var model_data = {reactions: [],
			  metabolites: [],
			  cofactors: []},
	    model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual({});
	expect(model.cofactors).toEqual([]);
    });
    it("Compartments", function () {
	var model_data = { reactions: { acc_tpp_e: { metabolites: { acc_c: 1, 
								    acc_p: -1 }
						   } },
			   metabolites: { acc_c: { formula: 'C3H2' },
					  acc_p: { formula: 'C3H2' } } };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp_e: { bigg_id: 'acc_tpp',
			   bigg_id_compartmentalized: 'acc_tpp_e',
			   compartment_id: 'e',
			   metabolites: { acc_c: { coefficient: 1,
						   formula: 'C3H2',
						   bigg_id_compartmentalized : 'acc_c',
						   bigg_id : 'acc',
						   compartment_id : 'c' },
					  acc_p: { coefficient: -1,
						   formula: 'C3H2',
						   bigg_id_compartmentalized : 'acc_p',
						   bigg_id : 'acc',
						   compartment_id : 'p' }
					}
			 }
	    }
	);
    });
    it("Compartments_l2", function () {
	var model_data = { reactions: { acc_tpp_e0: { metabolites: { acc_c: 1, 
								     acc_p: -1 }
						    } },
			   metabolites: { acc_c: { formula: 'C3H2' },
					  acc_p: { formula: 'C3H2' } } };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp_e0: { bigg_id: 'acc_tpp',
			    bigg_id_compartmentalized: 'acc_tpp_e0',
			    compartment_id: 'e0',
			    metabolites: { acc_c: { coefficient: 1,
						    formula: 'C3H2',
						    bigg_id_compartmentalized : 'acc_c',
						    bigg_id : 'acc',
						    compartment_id : 'c' },
					   acc_p: { coefficient: -1,
						    formula: 'C3H2',
						    bigg_id_compartmentalized : 'acc_p',
						    bigg_id : 'acc',
						    compartment_id : 'p' }
					 }
			  }
	    }
	);
    });
    it("Compartments_no_match", function () {
	var model_data = { reactions: { acc_tpp: {} } };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp: { bigg_id: 'acc_tpp',
			 bigg_id_compartmentalized: 'acc_tpp',
			 compartment_id: null }
	    }
	);
    });
    it("No cofactors", function () {
	var model_data = {'reactions': null,
			  'metabolites': null},
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toEqual([]);
    });
    it("Bad cofactors", function () {
	var model_data = {reactions: null,
			  metabolites: null,
			  cofactors: {} },
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toEqual([]);
    });
});
