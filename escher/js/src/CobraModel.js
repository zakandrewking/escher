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
    function separate_compartments(reactions, metabolites) {
	/** Convert id to bigg_id and bigg_id_compartmentalized.
	 
	 */
	var new_reactions = {};
	for (var reaction_id in reactions) {
	    var new_reaction = utils.clone(reactions[reaction_id]);
	    new_reaction['bigg_id_compartmentalized'] = reaction_id;
	    var out = no_compartment(reaction_id);
	    if (out===null) out = [reaction_id, null];
	    new_reaction['bigg_id'] = out[0];
	    new_reaction['compartment_id'] = out[1];
	    for (var metabolite_id in new_reaction.metabolites) {
		var coefficient = new_reaction.metabolites[metabolite_id],
		    new_met;
		if (metabolite_id in metabolites) {
		    new_met = utils.clone(metabolites[metabolite_id]);
		} else {
		    // console.warn('Could not find metabolite.');
		    new_met = {};
		}
		new_met.coefficient = coefficient;
		new_met['bigg_id_compartmentalized'] = metabolite_id;
		var out = no_compartment(metabolite_id);
		if (out===null) out = [metabolite_id, null];
		new_met['bigg_id'] = out[0];
		new_met['compartment_id'] = out[1];
		new_reaction.metabolites[metabolite_id] = new_met;
	    }
	    new_reactions[reaction_id] = new_reaction;
	}
	return new_reactions;

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
	// reactions
	if (!(model_data.reactions instanceof Object || 
	     model_data.metabolites instanceof Object)) {
	    console.error('Bad model data');
	}
	this.reactions = separate_compartments(model_data.reactions, 
					       model_data.metabolites);
	// metabolites currently unused
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
