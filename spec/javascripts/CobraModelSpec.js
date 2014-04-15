describe('CobraModel', function() {
    it("New model", function () {
	var model_data = {reactions: {},
			  cofactors: []};
	expect(function() { escher.CobraModel(model_data);} )
		.toThrow(new Error("Bad model data."));
    });
    it("Compartments", function () {
	var model_data = { reactions: { acc_tpp_e: { metabolites: { acc_c: 1, 
								    acc_p: -1 }
						   } },
			   metabolites: { acc_c: { formula: 'C3H2' },
					  acc_p: { formula: 'C3H2' } } },
	    model_data_copy = escher.utils.clone(model_data);
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp_e: { bigg_id: 'acc_tpp',
			   bigg_id_compartmentalized: 'acc_tpp_e',
			   compartment_id: 'e',
			   metabolites: { acc_c: 1, 
					  acc_p: -1 }
			 } 
	    });
	expect(model.metabolites).toEqual(
	    { acc_c: { formula: 'C3H2',
		       bigg_id_compartmentalized : 'acc_c',
		       bigg_id : 'acc',
		       compartment_id : 'c' },
	      acc_p: { formula: 'C3H2',
		       bigg_id_compartmentalized : 'acc_p',
		       bigg_id : 'acc',
		       compartment_id : 'p' }
	    });
	// make sure data is not modified by the CobraModel
	expect(model_data).toEqual(model_data_copy);
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
			    metabolites: { acc_c: 1, 
					   acc_p: -1 }
			  }
	    });
	expect(model.metabolites).toEqual(
	    { acc_c: { formula: 'C3H2',
		       bigg_id_compartmentalized : 'acc_c',
		       bigg_id : 'acc',
		       compartment_id : 'c' },
	      acc_p: { formula: 'C3H2',
		       bigg_id_compartmentalized : 'acc_p',
		       bigg_id : 'acc',
		       compartment_id : 'p' } 
	    });
    });
    it("Compartments_no_match", function () {
	var model_data = { reactions: { acc_tpp: {} },
			   metabolites: {} };
	var model = escher.CobraModel(model_data);
	expect(model.reactions).toEqual(
	    { acc_tpp: { bigg_id: 'acc_tpp',
			 bigg_id_compartmentalized: 'acc_tpp',
			 compartment_id: null }
	    }
	);
    });
    it("No cofactors", function () {
	var model_data = {'reactions': {},
			  'metabolites': {}},
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toEqual([]);
    });
    it("Bad cofactors", function () {
	var model_data = {reactions: {},
			  metabolites: {},
			  cofactors: {} },
	    model = escher.CobraModel(model_data);
	expect(model.cofactors).toEqual([]);
    });
});
