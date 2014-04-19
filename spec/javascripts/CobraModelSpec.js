describe('CobraModel', function() {
    it("New model", function () {
	var model_data = {reactions: {},
			  cofactors: []};
	expect(function() { escher.CobraModel(model_data);} )
	    .toThrow(new Error("Bad model data."));
    });
    it("Formulas", function () {
	var model_data = { reactions: { acc_tpp: { metabolites: { acc_c: 1, 
								  acc_p: -1 }
						 } },
			   metabolites: { acc_c: { formula: 'C3H2' },
					  acc_p: { formula: 'C3H2' } } },
	    model_data_copy = escher.utils.clone(model_data);
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
	// make sure data is not modified by the CobraModel
	expect(model_data).toEqual(model_data_copy);
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
