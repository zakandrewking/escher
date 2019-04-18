const dataStyles = require('../data_styles')

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('chai').assert

describe('dataStyles.import_and_check', () => {
    it('checks reaction data', () => {
        const reactionData = { R1: 0, R2: 4, R3: -12.3 }
    const expected = { R1: [0], R2: [4], R3: [-12.3] }
    const out = dataStyles.import_and_check(reactionData, 'reaction_data')
    assert.deepEqual(out, expected)
  })

  it('checks gene data and funny names', () => {
    const gene_data = { G1ORF: 0, G2ANDHI: 4, 'G3-A': -12.3 }
    const reactions = { '2': { bigg_id: 'reaction_1',
                               gene_reaction_rule: '(G1ORF AND G2ANDHI) OR G3-A',
                               genes: [{ bigg_id: 'G1ORF', name: '' },
                                       { bigg_id: 'G2ANDHI', name: '' },
                                       { bigg_id: 'G3-A', name: '' }]}}
    const expected = { reaction_1: { G1ORF: [0],
                                     G2ANDHI: [4],
                                     'G3-A': [-12.3] }}
    const out = dataStyles.import_and_check(gene_data, 'gene_data', reactions)
    assert.deepEqual(out, expected)
  })

  it('checks gene data with multiple sets', () => {
    const gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }]
    const reactions = { '4': { bigg_id: 'reaction_2',
                               gene_reaction_rule: 'G4',
                               genes: [{ bigg_id: 'G4', name: '' }]},
                        '3': { bigg_id: 'reaction_1',
                               gene_reaction_rule: '(G1 AND G2) OR G3',
                               genes: [{ bigg_id: 'G1', name: '' },
                                       { bigg_id: 'G2', name: 'G2_name' },
                                       { bigg_id: 'G3', name: '' }]}}
    const expected = { reaction_2: { G4: [null, null]},
                       reaction_1: { G1: [0, 2],
                                     G2: [4, 6],
                                     G3: [-12.3, null] }}
    const out = dataStyles.import_and_check(gene_data, 'gene_data', reactions)
    assert.deepEqual(out, expected)
  })

  it('checks gene data with nulls', () => {
    const gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }]
    const reactions = { '1': { bigg_id: 'reaction_1',
                               gene_reaction_rule: '',
                               genes: [] }}
    const expected = { reaction_1: {} }
    const out = dataStyles.import_and_check(gene_data, 'gene_data', reactions)
    assert.deepEqual(out, expected)
  })

  it('checks gene data with empty data set', () => {
    const gene_data = {}
    const reactions = { r1: { bigg_id: 'reaction_1',
                              gene_reaction_rule: '(G1 AND G2) OR G3',
                              genes: [{ bigg_id: 'G1', name: '' },
                                      { bigg_id: 'G2', name: 'G2_name' },
                                      { bigg_id: 'G3', name: '' }]}}
    const expected = { reaction_1: { G1: [null],
                                     G2: [null],
                                     G3: [null] } }
    const out = dataStyles.import_and_check(gene_data, 'gene_data', reactions)
    assert.deepEqual(out, expected)
  })
})

describe('dataStyles.float_for_data', () => {
  it('single', () => {
    assert.strictEqual(dataStyles.float_for_data([-10], ['abs'], 'diff'), 10)
  })
  it('string', () => {
    assert.strictEqual(dataStyles.float_for_data(['-10'], [], 'diff'), -10)
  })
  it('diff', () => {
    assert.strictEqual(dataStyles.float_for_data([10, -5], [], 'diff'), -15)
  })
  it('abs diff', () => {
    assert.strictEqual(dataStyles.float_for_data([10, -5], ['abs'], 'diff'), 15)
  })
  it('log fold', () => {
    assert.strictEqual(dataStyles.float_for_data([10, 5], [], 'log2_fold'), -1)
    assert.strictEqual(dataStyles.float_for_data([10, 5], ['abs'], 'log2_fold'), 1)
  })
  it('fold', () => {
    assert.strictEqual(dataStyles.float_for_data([10, 5], [], 'fold'), -2)
    assert.strictEqual(dataStyles.float_for_data([10, 5], ['abs'], 'fold'), 2)
  })
  it('infinity', () => {
    assert.strictEqual(dataStyles.float_for_data([0, 5], [], 'log2_fold'), null)
  })
  it('abs negative fold', () => {
    assert.strictEqual(dataStyles.float_for_data([10, -5], ['abs'], 'log2_fold'), null)
  })
  it('both neg fold', () => {
    assert.strictEqual(dataStyles.float_for_data([-10, -5], [], 'log2_fold'), -1)
  })
  it('one neg, no abs', () => {
    assert.strictEqual(dataStyles.float_for_data([10, -5], [], 'log2_fold'), null)
  })
  it('with zeros', () => {
    assert.strictEqual(dataStyles.float_for_data([10, 0], [], 'log2_fold'), null)
    assert.strictEqual(dataStyles.float_for_data([0, 10], [], 'log2_fold'), null)
  })
  it('null values', () => {
    assert.strictEqual(dataStyles.float_for_data([null], [], 'log2_fold'), null)
    assert.strictEqual(dataStyles.float_for_data([''], [], 'log2_fold'), null)
  })
  it('bad compare_style', () => {
    assert.throws(dataStyles.float_for_data.bind(null, [10, 5], [], 'd'))
  })
})

describe('dataStyles.text_for_data', () => {
  it('positive', () => {
    assert.strictEqual(dataStyles.text_for_data([10], 10), '10.0')
  })
  it('negative', () => {
    assert.strictEqual(dataStyles.text_for_data([-10], 10), '-10.0')
  })
  it('multiple', () => {
    assert.strictEqual(dataStyles.text_for_data([-10, 5], 10), '-10.0, 5.00: 10.0')
  })
})

describe('dataStyles.reverse_flux_for_data', () => {
  it('positive', () => {
    assert.strictEqual(dataStyles.reverse_flux_for_data([10]), false)
  })
  it('negative, multiple', () => {
    assert.strictEqual(dataStyles.reverse_flux_for_data([-10, 5]), true)
  })
})

describe('dataStyles.gene_string_for_data', () => {
  it('single gene with data', () => {
    assert.deepEqual(dataStyles.gene_string_for_data('G1', { G1: [-10] },
                                                      [{bigg_id: 'G1', name: 'Gene1'}],
                                                      ['abs'], 'bigg_id', 'log2_fold'),
                     [{ bigg_id: 'G1', name: 'Gene1', text: 'G1 (-10.0)' }])
  })
  it('parentheses', () => {
    assert.deepEqual(dataStyles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                      [{bigg_id: 'G1', name: 'Gene1'}],
                                                      ['abs'], 'bigg_id', 'log2_fold'),
                     [{ bigg_id: 'G1', name: 'Gene1', text: '( G1 (-10.0))' }])
  })

  it('single gene, name identifiers', () => {
    assert.deepEqual(dataStyles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                      [{bigg_id: 'G1', name: 'Gene1'}],
                                                      ['abs'], 'name', 'log2_fold'),
                     [{ bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (-10.0))' }])
  })

  it('multiple genes, name identifiers, no data', () => {
    assert.deepEqual(dataStyles.gene_string_for_data('226_AT2 or 226_AT1 or 226_AT3 or 230_AT1 or 229_AT1',
                                                      null,
                                                      [
                                                        { name: 'ALDOA', bigg_id: '226_AT2' },
                                                        { name: 'ALDOA', bigg_id: '226_AT1' },
                                                        { name: 'ALDOA', bigg_id: '226_AT3' },
                                                        { name: 'ALDOC', bigg_id: '230_AT1' },
                                                        { name: 'ALDOB', bigg_id: '229_AT1' },
                                                      ],
                                                      [], 'name', 'log2_fold'),
                     [
                       { name: 'ALDOA', bigg_id: '226_AT2', text: 'ALDOA' },
                       { name: 'ALDOA', bigg_id: '226_AT1', text: ' or ALDOA' },
                       { name: 'ALDOA', bigg_id: '226_AT3', text: ' or ALDOA' },
                       { name: 'ALDOC', bigg_id: '230_AT1', text: ' or ALDOC' },
                       { name: 'ALDOB', bigg_id: '229_AT1', text: ' or ALDOB' },
                     ])
  })

  it('repeated genes', () => {
    // If the genes object accidentally has repeats, then make sure they are
    // removed.
    assert.deepEqual(dataStyles
                     .gene_string_for_data('((b0902 and b0903) or (b0902 and b3114) or (b3951 and b3952) or ((b0902 and b0903) and b2579))',
                                           {
                                             b0902: [ 188.37366666666665, 282.133 ],
                                             b0903: [ 1866.04, 11448.37 ],
                                             b3114: [ 5.289776666666666, 5.4111400000000005 ],
                                             b3951: [ 8.291500000000001, 5.966176666666666 ],
                                             b3952: [ 3.6747133333333335, 4.2879700000000005 ],
                                             b2579: [ 5274.716666666667, 1089.1643333333334 ],
                                           },
                                           [
                                             { bigg_id: "b0902", name: "b0902" },
                                             { bigg_id: "b0903", name: "b0903" },
                                             { bigg_id: "b2579", name: "b2579" },
                                             { bigg_id: "b0902", name: "b0902" },
                                             { bigg_id: "b0903", name: "b0903" },
                                             { bigg_id: "b0902", name: "b0902" },
                                             { bigg_id: "b3114", name: "b3114" },
                                             { bigg_id: "b3951", name: "b3951" },
                                             { bigg_id: "b3952", name: "b3952" },
                                           ],
                                           [ 'abs' ], 'bigg_id', 'log2_fold'),
                     [
                       { bigg_id: 'b0902', name: 'b0902', text: '((b0902 (188, 282: 0.583)' },
                       { bigg_id: 'b0903', name: 'b0903', text: ' and b0903 (1.87e+3, 1.14e+4: 2.62)' },
                       { bigg_id: 'b0902', name: 'b0902', text: ') or (b0902 (188, 282: 0.583)' },
                       { bigg_id: 'b3114', name: 'b3114', text: ' and b3114 (5.29, 5.41: 0.0327)' },
                       { bigg_id: 'b3951', name: 'b3951', text: ') or (b3951 (8.29, 5.97: 0.475)' },
                       { bigg_id: 'b3952', name: 'b3952', text: ' and b3952 (3.67, 4.29: 0.223)' },
                       { bigg_id: 'b0902', name: 'b0902', text: ') or ((b0902 (188, 282: 0.583)' },
                       { bigg_id: 'b0903', name: 'b0903', text: ' and b0903 (1.87e+3, 1.14e+4: 2.62)' },
                       { bigg_id: 'b2579', name: 'b2579', text: ') and b2579 (5.27e+3, 1.09e+3: 2.28)))' },
                     ])
  })

  it('no data', () => {
    assert.deepEqual(dataStyles.gene_string_for_data('( G1 OR G2 )', null,
                                                      [{bigg_id: 'G1', name: 'Gene1'},
                                                       {bigg_id: 'G2', name: 'Gene2'}],
                                                      ['abs'], 'name', 'log2_fold'),
                     [
                       {bigg_id: 'G1', name: 'Gene1', text: '( Gene1' },
                       {bigg_id: 'G2', name: 'Gene2', text: ' OR Gene2)'}
                     ])
  })
})

describe('dataStyles.various methods', () => {
  it('store text for non-numeric data', () => {
    assert.deepEqual(dataStyles.float_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s'], [], 'log2_fold'), null)
    assert.deepEqual(dataStyles.text_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s', '8'], null),
                     '2dmmql8_c + fum_c --> 2dmmq8_c + s, 8: (nd)')
    assert.deepEqual(dataStyles.reverse_flux_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s']), false)
    assert.deepEqual(dataStyles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', '8'] },
                                                      [{bigg_id: 'G1', name: 'Gene1'}],
                                                      ['abs'], 'name', 'log2_fold'),
                     [{bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (my favorite gene✓, 8: nd))' }])
    assert.deepEqual(dataStyles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', 'text'] },
                                                      [{bigg_id: 'G1', name: 'Gene1'}],
                                                      ['abs'], 'name', 'log2_fold'),
                     [{bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (my favorite gene✓, text))' }])
  })
})

describe('dataStyles.csv_converter', () => {
  it('basic conversion', () => {
    const csv_rows = [['gene', 'v1', 'v2'],
                      ['g1', '10', '20'],
                      ['g2', '15', '25'],
                      ['g3', 'text', 'data']]
    assert.deepEqual(dataStyles.csv_converter(csv_rows),
                     [{'g1': '10', 'g2': '15', g3: 'text'}, {g1: '20', g2: '25', g3: 'data'}])
  })
})

describe('dataStyles.genes_for_gene_reaction_rule', () => {
  it('finds funny names', () => {
    const rule = '(G1ORF AND G2ANDHI) or YER060W-A OR (G3-A AND G4)'
    assert.deepEqual(dataStyles.genes_for_gene_reaction_rule(rule),
                     ['G1ORF', 'G2ANDHI', 'YER060W-A', 'G3-A', 'G4'])
  })

  it('ignores repeats', () => {
    const rule = '((b0902 and b0903) or (b0902 and b3114) or (b3951 and b3952) or ((b0902 and b0903) and b2579))'
    assert.deepEqual(dataStyles.genes_for_gene_reaction_rule(rule),
                     ['b0902', 'b0903', 'b3114', 'b3951', 'b3952', 'b2579'])
  })

  it('empty array for empty string', () => {
    const rule = ''
    assert.deepEqual(dataStyles.genes_for_gene_reaction_rule(rule), [])
  })
})

describe('dataStyles.evaluate_gene_reaction_rule', () => {
  it('funny gene names, upper and lowercase ANDs', () => {
    const rule = '(G1 AND G2-A) OR (G3ANDHI aNd G4ORF)'
    const gene_values = {G1: [5], 'G2-A': [2], G3ANDHI: [10], G4ORF: [11.5]}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'mean')
    assert.deepEqual(out, [14.25])
  })

  it('specific bug: repeat', () => {
    const rule = '( YER056C  or  YER060W  or  YER060W-A  or  YGL186C )'
    const gene_values = {"YER056C": ['151'], "YER060W": ['10'],
                         "YER060W-A": ['2'], "YGL186C": ['17']}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [180])
  })

  it('single negative', () => {
    const rule = 'YER056C'
    const gene_values = {"YER056C": [-151]}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [-151])
  })

  it('multiple values', () => {
    const rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)'
    const gene_values = {G1: [5, 0], G2: [2, 0], G3ANDHI: [10, 0], G4ORF: [11.5, 6]}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [12, 0])

  })

  it('order of operations', () => {
    const rule = '( YEL039C and YKR066C or YJR048W and YKR066C )'
    const gene_values = { YEL039C: ['1'], YKR066C: ['2'], YJR048W: ['4'] }
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [3])
  })

  it('empty', () => {
    const out = dataStyles.evaluate_gene_reaction_rule('', {}, 'min')
    assert.deepEqual(out, [null])
  })

  it('null values 1', () => {
    const rule = '(G1 AND G2) OR (G3 AND G4)'
    const gene_values = {G1: [5], G2: [2], G3: [''], G4: [null]}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [2])
  })

  it('null values 2', () => {
    const rule = '(G1 AND G2) OR (G3 AND G4)'
    const gene_values = {G1: [null], G2: [null], G3: [null], G4: [null]}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [null])
  })

  it('null values 3', () => {
    const rule = '(G1 AND G2) OR (G3 AND G4)'
    const gene_values = {G1: [''], G2: [''], G3: [''], G4: ['']}
    const out = dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min')
    assert.deepEqual(out, [null])
  })

  it('members of OR connections can be null', () => {
    const rule = '( (( YCR034W or YGR032W) and YLR343W ) or ( ( YCR034W and YGR032W ) and YMR215W ) or ( ( YCR034W and YMR306W ) and YMR215W ) or ( ( YCR034W and YLR342W ) and YOL132W ) or ( ( YCR034W and YMR306W ) and YOL132W ) or ( ( YCR034W and YGR032W ) and YOL030W ) or ( ( YCR034W and YLR342W ) and YOL030W ) or ( ( YCR034W and YMR306W ) and YOL030W ) or ( ( YCR034W and YLR342W ) and YLR343W ) or ( ( YCR034W and YMR306W ) and YLR343W ) or ( ( YCR034W and YGR032W ) and YOL132W ) or ( ( YCR034W and YLR342W ) and YMR215W ) or ( ( YCR034W and YGR032W ) and YMR307W ) or ( ( YCR034W and YLR342W ) and YMR307W ) or ( ( YCR034W and YMR306W ) and YMR307W ) )'
    const gene_values = {"YCR034W":[8],
                         "YGR032W":[12],
                         "YLR343W":[2],
                         "YMR215W":[null],
                         "YMR306W":[null],
                         "YLR342W":[null],
                         "YOL132W":[null],
                         "YOL030W":[null],
                         "YMR307W":[null]}
    assert.deepEqual(dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [2])
  })

  it(' treat nulls as 0', () => {
    const rule = '( YOL096C and YDR204W and YML110C and YGR255C and YOR125C and YGL119W and YLR201C )'
    const gene_values = {"YOL096C": [-9.966],
                         "YDR204W": [null],
                         "YML110C": [5.727832840424934],
                         "YGR255C": [null],
                         "YOR125C": [null],
                         "YGL119W": [null],
                         "YLR201C": [-7.88335943096544]}
    assert.deepEqual(dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [-9.966])

  })

  it('extra parentheses', () => {
    const rule = '(( (YJL130C) ) or (YJR109C and YOR303W))'
    const gene_values = { YJL130C: ['-80.0'],
                          YJR109C: ['70.5'],
                          YOR303W: ['200.5233'] }
    assert.deepEqual(dataStyles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [-9.5])
  })
})

describe('dataStyles.replace_gene_in_rule', () => {
  it('replaces strings', () => {
    assert.strictEqual(dataStyles.replace_gene_in_rule('G3 G300', 'G3', 'new'), 'new G300')
    assert.strictEqual(dataStyles.replace_gene_in_rule('(G3)00', 'G3', 'new'), '(new)00')
    assert.strictEqual(dataStyles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new'), '(new)00 new')
  })

  it('timing', () => {
    const start = new Date().getTime()
    const n = 1000.0
    for (let i = 0; i < n; i++) {
      dataStyles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new')
    }
    const time = new Date().getTime() - start
    console.warn('replace_gene_in_rule execution time per ' + n + ': ' + time + 'ms')
  })
})

describe('dataStyles.apply_reaction_data_to_reactions', () => {
  it('for Map.reactions', () => {
    const reactions = { 238: { bigg_id: 'GAPD',
                               segments: { 2: {}}}},
          data = { GAPD: [0, 10] }
    const out = dataStyles.apply_reaction_data_to_reactions(reactions, data, [], 'diff')
    assert.strictEqual(out, true)
    assert.deepEqual(reactions, { 238: { bigg_id: 'GAPD',
                                         data: 10.0,
                                         data_string: '0.00, 10.0: 10.0',
                                         reverse_flux: false,
                                         gene_string: null,
                                         segments: { 2: { data: 10.0,
                                                          reverse_flux: false }}}})
  })
})

describe('dataStyles.apply_metabolite_data_to_nodes', () => {
  it('for Map.nodes', () => {
    const nodes = { 238: { bigg_id: 'g3p_c' }}
    const data = { g3p_c: [ 0, 10 ] }
    const out = dataStyles.apply_metabolite_data_to_nodes(nodes, data, [], 'diff')
    assert.strictEqual(out, true)
    assert.deepEqual(nodes, { 238: { bigg_id: 'g3p_c',
                                     data: 10.0,
                                     data_string: '0.00, 10.0: 10.0' } })
  })
})

describe('dataStyles.apply_gene_data_to_reactions', () => {
  it('for Map.reactions', () => {
    const reactions = { 238: { bigg_id: 'GAPD',
                               gene_reaction_rule: 'b1779',
                               genes: [ { bigg_id: 'b1779',
                                          name: 'gapA' } ],
                               segments: { 2: {}}}}
    const data = { GAPD: { b1779: [0, 10] }}
    const out = dataStyles.apply_gene_data_to_reactions(reactions, data, [],
                                                         'name', 'diff', 'min')
    assert.strictEqual(out, true)
    assert.deepEqual(reactions, { 238: { bigg_id: 'GAPD',
                                         gene_reaction_rule: 'b1779',
                                         genes: [ { bigg_id: 'b1779',
                                                    name: 'gapA' } ],
                                         data: 10.0,
                                         data_string: '0.00, 10.0: 10.0',
                                         gene_string: [{bigg_id: 'b1779', name: 'gapA', text: 'gapA (0.00, 10.0: 10.0)'}],
                                         reverse_flux: false,
                                         segments: { 2: { data: 10.0,
                                                          reverse_flux: false }}}})
  })
})
