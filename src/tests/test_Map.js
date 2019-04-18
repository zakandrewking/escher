const Map = require('../Map').default
const Settings = require('../Settings').default
const CobraModel = require('../CobraModel')

const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const assert = require('chai').assert

const d3Body = require('./helpers/d3Body')
const get_map = require('./helpers/get_map')

const _ = require('underscore')

function matching_reaction (reactions, id) {
  let match = null
  for (let r_id in reactions) {
    const r = reactions[r_id]
    if (r.bigg_id === id) {
      match = r
      break
    }
  }
  return match
}

describe('Map', () => {
  let map, svg

  beforeEach(() => {
    // set up map
    svg = d3Body.append('svg')
    const sel = svg.append('g')
    // streams are required for these options
    const requiredOptions = {
      reaction_scale: [],
      metabolite_scale: [],
      reaction_styles: [],
      reaction_compare_style: 'diff',
      metabolite_styles: [],
      metabolite_compare_style: 'diff',
      cofactors: []
    }
    const requiredConditionalOptions = [ 'reaction_scale', 'metabolite_scale' ]
    map = Map.from_data(
      get_map(),
      svg,
      null,
      sel,
      null,
      new Settings(requiredOptions, requiredConditionalOptions),
      null,
      true
    )
  })

  it('initializes', () => {
    assert.ok(map)
  })

  it('def is the first element in the svg', () => {
    // this fixes a bug with export SVG files to certain programs,
    // e.g. Inkscape for Windows
    const defs_node = d3Body.select('defs').node()
    assert.strictEqual(defs_node.parentNode.firstChild, defs_node)
  })

  it('loads with reaction/metabolite data', () => {
    // no data
    assert.strictEqual(map.has_data_on_reactions, false)
    assert.strictEqual(map.has_data_on_nodes, false)
  })

  it('loads without reaction/metabolite data', () => {
    // data
    map.apply_reaction_data_to_map({'GLCtex': 100})
    map.apply_metabolite_data_to_map({'glc__D_p': 3})

    // make sure ids are saved correctly
    for (let id in map.reactions) {
      // ids should be strings that eval to integers
      assert.strictEqual(isNaN(id), false)
      // bigg ids should be present
      assert.isDefined(map.reactions[id].bigg_id)
      assert.isUndefined(map.reactions[id].bigg_id_compartmentalized)
    }

    for (let id in map.nodes) {
      const node = map.nodes[id]
      // ids should be strings that eval to integers
      assert.strictEqual(isNaN(id), false)
      if (node.node_type === 'metabolite') {
        // bigg ids and compartments should be present
        assert.isDefined(map.nodes[id].bigg_id)
      }
    }

    assert.isTrue(map.has_data_on_reactions)
    for (let id in map.reactions) {
      const reaction = map.reactions[id]
      if (reaction.bigg_id === 'GLCtex') {
        assert.strictEqual(reaction.data, 100)
        assert.strictEqual(reaction.data_string, '100.0')
      } else {
        assert.strictEqual(reaction.data, null)
      }
    }

    assert.strictEqual(map.has_data_on_nodes, true)
    for (let id in map.nodes) {
      const node = map.nodes[id]
      if (node.bigg_id_compartmentalized === 'glc__D_p') {
        assert.strictEqual(map.nodes[id].data, 3)
      } else {
        assert.strictEqual(map.nodes[id].data, null)
      }
    }

    map.apply_reaction_data_to_map(null)
    assert.strictEqual(map.has_data_on_reactions, false)
    for (let id in map.reactions) {
      assert.strictEqual(map.reactions[id].data, null)
    }

    map.apply_metabolite_data_to_map(null)
    assert.isFalse(map.has_data_on_nodes)
    for (let id in map.nodes) {
      assert.strictEqual(map.nodes[id].data, null)
    }
  })

  it('search index reactions', () => {
    assert.deepEqual(map.search_index.find('glyceraldehyde-3-phosphate dehydrogenase')[0],
                     { type: 'reaction', reaction_id: '1576769' })
    assert.deepEqual(map.search_index.find('GAPD')[0],
                     { type: 'reaction', reaction_id: '1576769' })
    assert.deepEqual(map.search_index.find('b1779')[0],
                     { type: 'reaction', reaction_id: '1576769' })
    assert.deepEqual(map.search_index.find('gapA')[0],
                     { type: 'reaction', reaction_id: '1576769' })
  })

  it('search index metabolites', () => {
    assert.deepEqual(map.search_index.find('Glyceraldehyde-3-phosphate')[0],
                     { type: 'metabolite', node_id: '1576545' })
    assert.deepEqual(map.search_index.find('^g3p_c$')[0],
                     { type: 'metabolite', node_id: '1576545' })
  })

  it('search index text labels', () => {
    assert.deepEqual(map.search_index.find('TEST')[0],
                     { type: 'text_label', text_label_id: '1' })
  })

  it('search index delete', () => {
    // delete reactions
    map.delete_reaction_data(['1576769'])
    assert.deepEqual(map.search_index.find('glyceraldehyde-3-phosphatedehydrogenase'), [])
    assert.deepEqual(map.search_index.find('GAPD'), [])
    assert.deepEqual(map.search_index.find('b1779'), [])
    // delete nodes
    map.delete_node_data(['1576545', '1576575'])
    assert.deepEqual(map.search_index.find('Glyceraldehyde-3-phosphate'), [])
    assert.deepEqual(map.search_index.find('^g3p_c$'), [])
    // delete text_labels
    map.delete_text_label_data(['1'])
    assert.deepEqual(map.search_index.find('TEST'), [])
  })

  it('search index extend reactions', () => {
    map.extend_reactions({ '123456789': { bigg_id: 'EX_glc__D_p',
                                          name: 'periplasmic glucose exchange',
                                          gene_reaction_rule: 's0001',
                                          genes: [ { 'bigg_id': 's0001',
                                                     'name': 'spontaneous'} ] } })
    assert.deepEqual(map.search_index.find('EX_glc__D_p')[0],
                     { type: 'reaction', reaction_id: '123456789' })
    assert.deepEqual(map.search_index.find('periplasmic glucose exchange')[0],
                     { type: 'reaction', reaction_id: '123456789' })
    assert.deepEqual(map.search_index.find('s0001')[0],
                     { type: 'reaction', reaction_id: '123456789' })
    assert.deepEqual(map.search_index.find('spontaneous')[0],
                     { type: 'reaction', reaction_id: '123456789' })
  })

  it('search index extend nodes', () => {
    map.extend_nodes({ '123456789': { bigg_id: 'glc__D_p',
                                      name: 'periplasmic glucose',
                                      node_type: 'metabolite' }})
    assert.deepEqual(map.search_index.find('^glc__D_p')[0],
                     { type: 'metabolite', node_id: '123456789' })
    assert.deepEqual(map.search_index.find('periplasmic glucose$')[0],
                     { type: 'metabolite', node_id: '123456789' })
  })

  it('search index new/edit text label', () => {
    const id = map.new_text_label({ x: 0, y: 0 }, 'TESTEST')
    assert.deepEqual(map.search_index.find('TESTEST')[0],
                     { type: 'text_label', text_label_id: id })
    map.edit_text_label(id, 'TESTESTEST', false)
    assert.deepEqual(map.search_index.find('^TESTEST$'), [])
    assert.deepEqual(map.search_index.find('TESTESTEST')[0],
                     { type: 'text_label', text_label_id: id })
  })

  it('new_reaction_from_scratch', () => {
    const model_data = { reactions: [ { id: 'acc_tpp',
                                        metabolites: { acc_c: 1, acc_p: -1 },
                                        gene_reaction_rule: 'Y1234'
                                      }
                                    ],
                         metabolites: [ { id: 'acc_c',
                                          formula: 'C3H2' },
                                        { id: 'acc_p',
                                          formula: 'C3H2' }
                                      ],
                         genes: []
                       }
    const model = CobraModel.from_cobra_json(model_data)
    map.cobra_model = model

    map.new_reaction_from_scratch('acc_tpp', { x: 0, y: 0 }, 0)

    // find the reaction
    const match = matching_reaction(map.reactions, 'acc_tpp')
    assert.ok(match)
    // gene reaction rule
    assert.strictEqual(match.gene_reaction_rule,
                       model_data.reactions[0].gene_reaction_rule)
  })

  it('new_reaction_from_scratch exchanges', () => {
    ;[ 'uptake', 'secretion' ].map(direction => {
      const model_data = {
        reactions: [ {
          id: 'EX_glc__D_e',
          metabolites: { glc__D_e: direction === 'uptake' ? 1 : -1 },
          gene_reaction_rule: ''
        } ],
        metabolites: [{
          id: 'glc__D_e',
          formula: 'C6H12O6'
        }],
        genes: []
      }
      const model = CobraModel.from_cobra_json(model_data)
      map.cobra_model = model

      map.new_reaction_from_scratch('EX_glc__D_e', { x: 0, y: 0 }, 30)

      // find the reaction
      const match = matching_reaction(map.reactions, 'EX_glc__D_e')
      assert.ok(match)
      // segments
      assert.strictEqual(_.size(match.segments), 3)
    })
  })

  it('get_data_statistics accepts numbers or strings as floats; ignores empty strings and nulls', () => {
    const dataReactions = { PGI: [10], GAPD: ['5'], TPI: [''], PGK: [null] }
    map.apply_reaction_data_to_map(dataReactions)
    map.calc_data_stats('reaction')
    assert.deepEqual(
      map.get_data_statistics(),
      {
        reaction: { min: 5, median: 7.5, mean: 7.5, Q1: 5, Q3: 10, max: 10 },
        metabolite: null
      }
    )
    // metabolites
    const dataMetabolites = { g3p_c: [10], fdp_c: ['4'] }
    map.apply_metabolite_data_to_map(dataMetabolites)
    map.calc_data_stats('metabolite')
    assert.deepEqual(
      map.get_data_statistics(),
      { reaction: { min: 5, median: 7.5, mean: 7.5, Q1: 5, Q3: 10, max: 10 },
        metabolite: { min: 4, median: 10, mean: 8, Q1: 4, Q3: 10, max: 10 }
      }
    )
  })

  it('get_data_statistics uses defaults for no data -- reactions', () => {
    assert.deepEqual(map.get_data_statistics(), { reaction: null, metabolite: null })
    const dataReactions = {}
    map.apply_reaction_data_to_map(dataReactions)
    map.calc_data_stats('reaction')
    assert.deepEqual(map.get_data_statistics(), { reaction: null, metabolite: null })
  })

  it('get_data_statistics uses defaults for no data', () => {
    assert.deepEqual(map.get_data_statistics(), { reaction: null, metabolite: null })
    const dataMetabolites = {}
    map.apply_metabolite_data_to_map(dataMetabolites)
    map.calc_data_stats('metabolite')
    assert.deepEqual(map.get_data_statistics(), { reaction: null, metabolite: null })
  })

  it('map_for_export removes unnecessary attributes', () => {
    // check that unnecessary attributes are removed
    ;[ 'reactions', 'nodes', 'text_labels' ].forEach(function (type) {
      const first = Object.keys(map[type])[0]
      map[type][first].to_remove = true
      const data = map.map_for_export()
      assert.isUndefined(data[1][type][first].to_remove)
    })
    map.canvas.to_remove = true
    const data = map.map_for_export()
    assert.isUndefined(data[1].canvas.to_remove)
  })
})
