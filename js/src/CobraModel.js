/**
 * CobraModel
 */

var utils = require('./utils')
var data_styles = require('./data_styles')

var CobraModel = utils.make_class()
// class methods
CobraModel.from_cobra_json = from_cobra_json
CobraModel.build_reaction_string = build_reaction_string
// instance methods
CobraModel.prototype = {
  init: init,
  apply_reaction_data: apply_reaction_data,
  apply_metabolite_data: apply_metabolite_data,
  apply_gene_data: apply_gene_data
}
module.exports = CobraModel

// class methods

/**
 * Return a reaction string for the given stoichiometries. Adapted from
 * cobra.core.Reaction.build_reaction_string().
 * @param {Object} stoichiometries - An object with metabolites as keys and
 * stoichiometries as values.
 * @param {Boolean} is_reversible - Whether the reaction is reversible.
 */
function build_reaction_string (stoichiometries, is_reversible) {
  var format = function(number) {
    if (number == 1) {
      return ''
    }
    return String(number) + ' '
  }
  var reactant_dict = {}
  var product_dict = {}
  var reactant_bits = []
  var product_bits = []
  for (var the_metabolite in stoichiometries) {
    var coefficient = stoichiometries[the_metabolite]
    if (coefficient > 0)
      product_bits.push(format(coefficient) + the_metabolite)
    else
      reactant_bits.push(format(Math.abs(coefficient)) + the_metabolite)
  }
  var reaction_string = reactant_bits.join(' + ')
  if (is_reversible) {
    reaction_string += ' ↔ '
  } else {
    reaction_string += ' → '
  }
  reaction_string += product_bits.join(' + ')
  return reaction_string
}

function from_cobra_json (model_data) {
  /** Use a JSON Cobra model exported by COBRApy to make a new CobraModel
      object.

      The COBRA "id" becomes a "bigg_id", and "upper_bound" and "lower_bound"
      bounds become "reversibility".

      Fills out a "genes" list.

  */
  // reactions and metabolites
  if (!(model_data.reactions && model_data.metabolites)) {
    throw new Error('Bad model data.')
  }

  // make a gene dictionary
  var genes = {}
  for (var i = 0, l = model_data.genes.length; i < l; i++) {
    var r = model_data.genes[i],
    the_id = r.id
    genes[the_id] = r
  }

  var model = new CobraModel()

  model.reactions = {}
  for (var i = 0, l = model_data.reactions.length; i<l; i++) {
    var r = model_data.reactions[i]
    var the_id = r.id
    var reaction = utils.clone(r)
    delete reaction.id
    reaction.bigg_id = the_id
    reaction.data_string = ''
    // add the appropriate genes
    reaction.genes = []

    // set reversibility
    reaction.reversibility = (reaction.lower_bound < 0 && reaction.upper_bound > 0)
    if (reaction.upper_bound <= 0 && reaction.lower_bound < 0) {
      // reverse stoichiometries
      for (var met_id in reaction.metabolites) {
        reaction.metabolites[met_id] = -reaction.metabolites[met_id]
      }
    }
    delete reaction.lower_bound
    delete reaction.upper_bound

    if ('gene_reaction_rule' in reaction) {
      var gene_ids = data_styles.genes_for_gene_reaction_rule(reaction.gene_reaction_rule)
      gene_ids.forEach(function(gene_id) {
        if (gene_id in genes) {
          var gene = utils.clone(genes[gene_id])
          // rename id to bigg_id
          gene.bigg_id = gene.id
          delete gene.id
          reaction.genes.push(gene)
        } else {
          console.warn('Could not find gene for gene_id ' + gene_id)
        }
      })
    }
    model.reactions[the_id] = reaction
  }
  model.metabolites = {}
  for (var i = 0, l = model_data.metabolites.length; i<l; i++) {
    var r = model_data.metabolites[i]
    var the_id = r.id
    var met = utils.clone(r)
    delete met.id
    met.bigg_id = the_id
    model.metabolites[the_id] = met
  }
  return model
}

// instance methods
function init () {
  this.reactions = {}
  this.metabolites = {}
}

/**
 * Apply data to model. This is only used to display options in
 * BuildInput. apply_reaction_data overrides apply_gene_data.
 */
function apply_reaction_data (reaction_data, styles, compare_style) {
  data_styles.apply_reaction_data_to_reactions(this.reactions, reaction_data,
                                               styles, compare_style)
}

/**
 * Apply data to model. This is only used to display options in BuildInput.
 */
function apply_metabolite_data (metabolite_data, styles, compare_style) {
  data_styles.apply_metabolite_data_to_nodes(this.metabolites, metabolite_data,
                                             styles, compare_style)
}

/**
 * Apply data to model. This is only used to display options in
 * BuildInput. Overrides apply_reaction_data.
 */
function apply_gene_data (gene_data_obj, styles, identifiers_on_map,
                          compare_style, and_method_in_gene_reaction_rule) {
  data_styles.apply_gene_data_to_reactions(this.reactions, gene_data_obj,
                                           styles, identifiers_on_map,
                                           compare_style,
                                           and_method_in_gene_reaction_rule)
}
