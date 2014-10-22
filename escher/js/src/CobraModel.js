define(['utils', 'data_styles'], function(utils, data_styles) {
    /**
     */

    var CobraModel = utils.make_class();
    // class methods
    CobraModel.build_reaction_string = build_reaction_string;
    // instance methods
    CobraModel.prototype = { init: init,
			     apply_reaction_data: apply_reaction_data,
			     apply_metabolite_data: apply_metabolite_data,
			     apply_gene_data: apply_gene_data };

    return CobraModel;

    // class methods
    function build_reaction_string(stoichiometries, is_reversible,
				   lower_bound, upper_bound) {
	/** Return a reaction string for the given stoichiometries.

	    Adapted from cobra.core.Reaction.build_reaction_string().

	    Arguments
	    ---------

	    stoichiometries: An object with metabolites as keys and
	    stoichiometries as values.

	    is_reversible: Boolean. Whether the reaction is reversible.

	    lower_bound: Reaction upper bound, to determine direction.

	    upper_bound: Reaction lower bound, to determine direction.

	*/

	var format = function(number) {
            if (number == 1)
                return "";
            return String(number) + " ";
	}
        var reactant_dict = {},
            product_dict = {},
            reactant_bits = [],
            product_bits = [];
	for (var the_metabolite in stoichiometries) {
	    var coefficient = stoichiometries[the_metabolite];
            if (coefficient > 0)
                product_bits.push(format(coefficient) + the_metabolite);
            else
                reactant_bits.push(format(Math.abs(coefficient)) + the_metabolite);
	}
        reaction_string = reactant_bits.join(' + ');
        if (is_reversible) {
            reaction_string += ' ↔ ';
        } else {
            if (lower_bound < 0 && upper_bound <=0)
                reaction_string += ' ← ';
            else
		reaction_string += ' → ';
	}
        reaction_string += product_bits.join(' + ')
        return reaction_string
    }
    
    // instance methods
    function init(model_data) {
	// reactions and metabolites
	if (!(model_data.reactions && model_data.metabolites)) {
	    throw new Error('Bad model data.');
	    return;
	}
        // make a gene dictionary
	var genes = {};
	for (var i=0, l=model_data.genes.length; i<l; i++) {
	    var r = model_data.genes[i],
		the_id = r.id;
	    genes[the_id] = r;
	}

	this.reactions = {};
	for (var i=0, l=model_data.reactions.length; i<l; i++) {
	    var r = model_data.reactions[i],
		the_id = r.id,
                reaction = utils.clone(r);
	    delete reaction.id;
            // add the appropriate genes
            reaction.genes = [];
            if ('gene_reaction_rule' in reaction) {
                var gene_ids = data_styles.genes_for_gene_reaction_rule(reaction.gene_reaction_rule);
                gene_ids.forEach(function(gene_id) {
                    if (gene_id in genes) {
                        var gene = utils.clone(genes[gene_id]);
                        // rename id to bigg_id
                        gene.bigg_id = gene.id;
                        delete gene.id;
                        reaction.genes.push(gene);
                    } else {
                        console.warn('Could not find gene for gene_id ' + gene_id);
                    }
                });
            }
	    this.reactions[the_id] = reaction;
	}
	this.metabolites = {};
	for (var i=0, l=model_data.metabolites.length; i<l; i++) {
	    var r = model_data.metabolites[i],
		the_id = r.id;
	    this.metabolites[the_id] = utils.clone(r);
	    delete this.metabolites[the_id].id;
	}
        
	this.cofactors = ['atp', 'adp', 'nad', 'nadh', 'nadp', 'nadph', 'gtp',
			  'gdp', 'h', 'coa'];
    }

    function apply_reaction_data(reaction_data, styles, compare_style) {
	/** Apply data to model. This is only used to display options in
	    BuildInput.
	    
	    apply_reaction_data overrides apply_gene_data.

	*/

	for (var reaction_id in this.reactions) {
	    var reaction = this.reactions[reaction_id];
	    if (reaction_data===null) {
		reaction.data = null;
		reaction.data_string = '';
	    } else {
		var d = (reaction_id in reaction_data ?
			 reaction_data[reaction_id] : null),
		    f = data_styles.float_for_data(d, styles, compare_style),
		    r = data_styles.reverse_flux_for_data(d),
		    s = data_styles.text_for_data(d, f);
		reaction.data = f;
		reaction.data_string = s;
	        reaction.reverse_flux = r;
	    }
            reaction.gene_string = '';
	}
    }

    function apply_metabolite_data(metabolite_data, styles, compare_style) {
	/** Apply data to model. This is only used to display options in
	    BuildInput.

	 */
	for (var metabolite_id in this.metabolites) {
	    var metabolite = this.metabolites[metabolite_id];
	    if (metabolite_data===null) {
		metabolite.data = null;
		metabolite.data_string = '';
	    } else {
		var d = (metabolite_id in metabolite_data ?
			 metabolite_data[metabolite_id] : null),
		    f = data_styles.float_for_data(d, styles, compare_style),
		    s = data_styles.text_for_data(d, f);
		metabolite.data = f;
		metabolite.data_string = s;
	    }
	}
    }

    function apply_gene_data(gene_data_obj, styles, identifiers_on_map, compare_style) {
	/** Apply data to model. This is only used to display options in
	    BuildInput.

	    apply_gene_data overrides apply_reaction_data.

	    Arguments
	    ---------

	    gene_data_obj: The gene data object, with the following style:

	    { reaction_id: { rule: 'rule_string', genes: { gene_id: value } } }

	    style: Gene styles array.

            compare_style: The comparison type.

	*/

        // TODO abstract out this function, and the equivalent Map.apply_gene_data_to_reactions();
        
	// get the null val
	var null_val = [null];
	// make an array of nulls as the default
	for (var reaction_id in gene_data_obj) {
	    for (var gene_id in gene_data_obj[reaction_id].genes) {
		null_val = gene_data_obj[reaction_id].genes[gene_id]
		    .map(function() { return null; });
		break;
	    }
	    break;
	}

	for (var reaction_id in this.reactions) {
	    var reaction = this.reactions[reaction_id];
	    if (gene_data_obj === null) {
		reaction.data = null;
		reaction.data_string = '';
		reaction.gene_string = '';
	    } else {
		var d, rule, gene_values;
		if (reaction_id in gene_data_obj) {
		    rule = gene_data_obj[reaction_id].rule;
		    gene_values = gene_data_obj[reaction_id].genes;
		    d = data_styles.evaluate_gene_reaction_rule(rule, gene_values);
		} else {
		    gene_values = {};
		    d = null_val;
		}
		var f = data_styles.float_for_data(d, styles, compare_style),
                    r = data_styles.reverse_flux_for_data(d),
		    s = data_styles.text_for_data(d, f),
		    g = data_styles.gene_string_for_data(rule, gene_values,
                                                         reaction.genes, styles,
                                                         identifiers_on_map,
                                                         compare_style);
		reaction.data = f;
		reaction.data_string = s;
		reaction.gene_string = g;
		reaction.reverse_flux = r;
	    }
	}
    }
});
