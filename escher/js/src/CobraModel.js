define(["utils"], function(utils) {
    /**
     */

    var CobraModel = utils.make_class();
    // class methods
    CobraModel.separate_compartments = separate_compartments;
    // instance methods
    CobraModel.prototype = { init: init };

    return CobraModel;

    // class methods
    function separate_compartments(obj) {
	/** Convert ids to bigg_id and bigg_id_compartmentalized.
	 
	 */
	// component ids
	for (var component_id in obj) {
	    var component = obj[component_id];
	    component['bigg_id_compartmentalized'] = component_id;
	    var out = no_compartment(component_id);
	    if (out===null) out = [component_id, null];
	    component['bigg_id'] = out[0];
	    component['compartment_id'] = out[1];
	}

	// definitions
	function no_compartment(id) {
	    /** Returns an array of [uncompartmentalized id, compartment id].

	     Matches compartment ids with length 1 or 2.

	     Return null if no match is found.

	     */
            var reg = /(.*)_([a-z0-9]{1,2})$/,
		result = reg.exec(id);
	    if (result===null) return null;
	    return result.slice(1,3);
	}
    }

    // instance methods
    function init(model_data) {
	// reactions and metabolites
	if (!(model_data.reactions && model_data.metabolites)) {
	    throw new Error('Bad model data.');
	    return;
	}
	this.reactions = utils.clone(model_data.reactions);
	this.metabolites = utils.clone(model_data.metabolites);
	CobraModel.separate_compartments(this.reactions);
	CobraModel.separate_compartments(this.metabolites);

	// get cofactors if preset
	if ('cofactors' in model_data) {
	    if (model_data.cofactors instanceof Array) {
		this.cofactors = model_data.cofactors;
	    } else {
		console.warn('model_data.cofactors should be an array. Ignoring it');
		this.cofactors = [];
	    }
	} else {
	    this.cofactors = [];
	}
    }
});
