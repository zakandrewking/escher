describe('CobraModel', function() {
    it("New model", function () {
	var model_data = {reactions: {},
			  cofactors: []};
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
