import * as utils from './utils'
import * as dataStyles from './dataStyles'

/**
 * CobraModel
 */
export default class CobraModel {
  constructor () {
    this.reactions = {}
    this.metabolites = {}
  }

  /**
   * Return a reaction string for the given stoichiometries. Adapted from
   * cobra.core.Reaction.buildReactionString().
   * @param {Object} stoichiometries - An object with metabolites as keys and
   * stoichiometries as values.
   * @param {Boolean} is_reversible - Whether the reaction is reversible.
   */
  static buildReactionString (stoichiometries, isReversible) {
    const format = number => {
      if (number === 1) {
        return ''
      }
      return String(number) + ' '
    }

    const reactantBits = []
    const productBits = []
    for (let theMetabolite in stoichiometries) {
      var coefficient = stoichiometries[theMetabolite]
      if (coefficient > 0) {
        productBits.push(format(coefficient) + theMetabolite)
      } else {
        reactantBits.push(format(Math.abs(coefficient)) + theMetabolite)
      }
    }
    let reactionString = reactantBits.join(' + ')
    if (isReversible) {
      reactionString += ' ↔ '
    } else {
      reactionString += ' → '
    }
    reactionString += productBits.join(' + ')
    return reactionString
  }

  /**
   * Use a JSON Cobra model exported by COBRApy to make a new CobraModel object.
   * The COBRA "id" becomes a "bigg_id", and "upper_bound" and "lower_bound"
   * bounds become "reversibility". Fills out a "genes" list.
   */
  static fromCobraJson (modelData) {
    // reactions and metabolites
    if (!(modelData.reactions && modelData.metabolites)) {
      throw new Error('Bad model data.')
    }

    // make a gene dictionary
    var genes = {}
    for (let i = 0, l = modelData.genes.length; i < l; i++) {
      const r = modelData.genes[i]
      genes[r.id] = r
    }

    const model = new CobraModel()

    model.reactions = {}
    for (let i = 0, l = modelData.reactions.length; i < l; i++) {
      var r = modelData.reactions[i]
      var reaction = utils.clone(r)
      delete reaction.id
      reaction.bigg_id = r.id
      reaction.data_string = ''
      // add the appropriate genes
      reaction.genes = []

      // set reversibility
      reaction.reversibility = reaction.lower_bound < 0 && reaction.upper_bound > 0
      if (reaction.upper_bound <= 0 && reaction.lower_bound < 0) {
        // reverse stoichiometries
        for (let metId in reaction.metabolites) {
          reaction.metabolites[metId] = -reaction.metabolites[metId]
        }
      }
      delete reaction.lower_bound
      delete reaction.upper_bound

      if ('gene_reaction_rule' in reaction) {
        const geneIds = dataStyles.genes_for_gene_reaction_rule(reaction.gene_reaction_rule)
        geneIds.forEach(geneId => {
          if (geneId in genes) {
            const gene = utils.clone(genes[geneId])
            // rename id to bigg_id
            gene.bigg_id = gene.id
            delete gene.id
            reaction.genes.push(gene)
          } else {
            console.warn('Could not find gene for gene_id ' + geneId)
          }
        })
      }
      model.reactions[r.id] = reaction
    }
    model.metabolites = {}
    for (let i = 0, l = modelData.metabolites.length; i < l; i++) {
      const r = modelData.metabolites[i]
      const met = utils.clone(r)
      delete met.id
      met.bigg_id = r.id
      model.metabolites[r.id] = met
    }
    return model
  }

  /**
   * Apply data to model. This is only used to display options in
   * BuildInput. applyReactionData overrides applyGeneData.
   */
  applyReactionData (...args) {
    dataStyles.apply_reaction_data_to_reactions(this.reactions, ...args)
  }

  /**
   * Apply data to model. This is only used to display options in BuildInput.
   */
  applyMetaboliteData (...args) {
    dataStyles.apply_metabolite_data_to_nodes(this.metabolites, ...args)
  }

  /**
   * Apply data to model. This is only used to display options in
   * BuildInput. Overrides applyReactionData.
   */
  applyGeneData (...args) {
    dataStyles.apply_gene_data_to_reactions(this.reactions, ...args)
  }
}
