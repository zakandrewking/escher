var require_helper = require('./helpers/require_helper');

var data_styles = require_helper('data_styles');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;


describe('data_styles', function() {
    it('import_and_check', function() {
        it('checks reaction data', function() {
            var reaction_data = { R1: 0, R2: 4, R3: -12.3 },
                expected = { R1: [0], R2: [4], R3: [-12.3] },
                out = data_styles.import_and_check(reaction_data, 'reaction_data');
            assert.deepEqual(out, expected);
        });

        it('checks gene data and funny names', function() {
            var gene_data = { G1ORF: 0, G2ANDHI: 4, 'G3-A': -12.3 },
                reactions = { '2': { bigg_id: 'reaction_1',
                                     gene_reaction_rule: '(G1ORF AND G2ANDHI) OR G3-A',
                             genes: [{ bigg_id: 'G1ORF', name: '' },
                                     { bigg_id: 'G2ANDHI', name: '' },
                                     { bigg_id: 'G3-A', name: '' }]}},
                expected = { reaction_1: { G1ORF: [0],
                                           G2ANDHI: [4],
                                           'G3-A': [-12.3] }},
                out = data_styles.import_and_check(gene_data, 'gene_data', reactions);
            assert.deepEqual(out, expected);
        });

        it('checks gene data with multiple sets', function() {
            var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
                reactions = { '4': { bigg_id: 'reaction_2',
                                     gene_reaction_rule: 'G4',
                                     genes: [{ bigg_id: 'G4', name: '' }]},
                              '3': { bigg_id: 'reaction_1',
                                     gene_reaction_rule: '(G1 AND G2) OR G3',
                                     genes: [{ bigg_id: 'G1', name: '' },
                                             { bigg_id: 'G2', name: 'G2_name' },
                                             { bigg_id: 'G3', name: '' }]}},
                expected = { reaction_2: { G4: [null, null]},
                             reaction_1: { G1: [0, 2],
                                           G2: [4, 6],
                                           G3: [-12.3, null] }},
                out = data_styles.import_and_check(gene_data, 'gene_data', reactions);
            assert.deepEqual(out, expected);
        });

        it('checks gene data with nulls', function() {
            var gene_data = [{ G1: 0, G2: 4, G3: -12.3 }, { G1: 2, G2: 6 }],
                reactions = { '1': { bigg_id: 'reaction_1',
                                     gene_reaction_rule: '' }},
                expected = { reaction_1: {} },
                out = data_styles.import_and_check(gene_data, 'gene_data', reactions);
            assert.deepEqual(out, expected);
        });

        it('checks gene data with empty data set', function() {
            var gene_data = {},
                reactions = { r1: { bigg_id: 'reaction_1',
                                    gene_reaction_rule: '(G1 AND G2) OR G3',
                                    genes: [{ bigg_id: 'G1', name: '' },
                                            { bigg_id: 'G2', name: 'G2_name' },
                                            { bigg_id: 'G3', name: '' }]}},
                expected = { reaction_1: { G1: [null],
                                           G2: [null],
                                           G3: [null] } },
                out = data_styles.import_and_check(gene_data, 'gene_data', reactions);
            assert.deepEqual(out, expected);
        });
    });

    it('float_for_data', function() {
        it('single', function() {
            assert.strictEqual(data_styles.float_for_data([-10], ['abs'], 'diff'), 10);
        });
        it('string', function() {
            assert.strictEqual(data_styles.float_for_data(['-10'], [], 'diff'), -10);
        });
        it('diff', function() {
            assert.strictEqual(data_styles.float_for_data([10, -5], [], 'diff'), -15);
        });
        it('abs diff', function() {
            assert.strictEqual(data_styles.float_for_data([10, -5], ['abs'], 'diff'), 15);
        });
        it('log fold', function() {
            assert.strictEqual(data_styles.float_for_data([10, 5], [], 'log2_fold'), -1);
            assert.strictEqual(data_styles.float_for_data([10, 5], ['abs'], 'log2_fold'), 1);
        });
        it('fold', function() {
            assert.strictEqual(data_styles.float_for_data([10, 5], [], 'fold'), -2);
            assert.strictEqual(data_styles.float_for_data([10, 5], ['abs'], 'fold'), 2);
        });
        it('infinity', function() {
            assert.strictEqual(data_styles.float_for_data([0, 5], [], 'log2_fold'), null);
        });
        it('abs negative fold', function() {
            assert.strictEqual(data_styles.float_for_data([10, -5], ['abs'], 'log2_fold'), null);
        });
        it('both neg fold', function() {
            assert.strictEqual(data_styles.float_for_data([-10, -5], [], 'log2_fold'), -1);
        });
        it('one neg, no abs', function() {
            assert.strictEqual(data_styles.float_for_data([10, -5], [], 'log2_fold'), null);
        });
        it('with zeros', function() {
            assert.strictEqual(data_styles.float_for_data([10, 0], [], 'log2_fold'), null);
            assert.strictEqual(data_styles.float_for_data([0, 10], [], 'log2_fold'), null);
        });
        it('null values', function() {
            assert.strictEqual(data_styles.float_for_data([null], [], 'log2_fold'), null);
            assert.strictEqual(data_styles.float_for_data([''], [], 'log2_fold'), null);
        });
        it('bad compare_style', function() {
            assert.throws(data_styles.float_for_data.bind(null, [10, 5], [], 'd'));
        });
    });

    it('text_for_data', function() {
        assert.strictEqual(data_styles.text_for_data([10], 10), '10.0');
        assert.strictEqual(data_styles.text_for_data([-10], 10), '-10.0');
        assert.strictEqual(data_styles.text_for_data([-10, 5], 10), '-10.0, 5.00: 10.0');
    });

    it('reverse_flux_for_data',  function() {
        assert.strictEqual(data_styles.reverse_flux_for_data([10]), false);
        assert.strictEqual(data_styles.reverse_flux_for_data([-10, 5]), true);
    });

    it('gene_string_for_data',  function() {
        // with data
        assert.deepEqual(data_styles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                          [{bigg_id: 'G1', name: 'Gene1'}],
                                                          ['abs'], 'bigg_id', 'log2_fold'),
                         [{ bigg_id: 'G1', name: 'Gene1', text: '( G1 (-10.0))' }]);
        assert.deepEqual(data_styles.gene_string_for_data('G1', { G1: [-10] },
                                                          [{bigg_id: 'G1', name: 'Gene1'}],
                                                          ['abs'], 'bigg_id', 'log2_fold'),
                         [{ bigg_id: 'G1', name: 'Gene1', text: 'G1 (-10.0)' }]);
        assert.deepEqual(data_styles.gene_string_for_data('( G1 )', { G1: [-10] },
                                                          [{bigg_id: 'G1', name: 'Gene1'}],
                                                          ['abs'], 'name', 'log2_fold'),
                         [{ bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (-10.0))' }]);

        // Repeated genes: If the genes object accidentally has repeats, then
        // make sure they are removed.
        assert.deepEqual(data_styles
               .gene_string_for_data('((b0902 and b0903) or (b0902 and b3114) or (b3951 and b3952) or ((b0902 and b0903) and b2579))',
                                     {"b0902":[188.37366666666665,282.133],
                                      "b0903":[1866.04,11448.37],
                                      "b3114":[5.289776666666666,5.4111400000000005],
                                      "b3951":[8.291500000000001,5.966176666666666],
                                      "b3952":[3.6747133333333335,4.2879700000000005],
                                      "b2579":[5274.716666666667,1089.1643333333334]},
                                     [{"bigg_id":"b0902","name":"b0902"},
                                      {"bigg_id":"b0903","name":"b0903"},
                                      {"bigg_id":"b2579","name":"b2579"},
                                      {"bigg_id":"b0902","name":"b0902"},
                                      {"bigg_id":"b0903","name":"b0903"},
                                      {"bigg_id":"b0902","name":"b0902"},
                                      {"bigg_id":"b3114","name":"b3114"},
                                      {"bigg_id":"b3951","name":"b3951"},
                                      {"bigg_id":"b3952","name":"b3952"}],
                                     ['abs'], 'bigg_id', 'log2_fold'),
                         [
                             { bigg_id:'b0902', name:'b0902', text: '((b0902 (188, 282: 0.583)' },
                             { bigg_id:'b0903', name:'b0903', text: ' and b0903 (1.87e+3, 1.14e+4: 2.62)' },
                             {'bigg_id':'b0902','name':'b0902', text: ') or (b0902 (188, 282: 0.583)' },
                             {'bigg_id':'b3114','name':'b3114', text: ' and b3114 (5.29, 5.41: 0.0327)' },
                             {'bigg_id':'b3951','name':'b3951', text: ') or (b3951 (8.29, 5.97: 0.475)' },
                             {'bigg_id':'b3952','name':'b3952', text: ' and b3952 (3.67, 4.29: 0.223)' },
                             {'bigg_id':'b0902','name':'b0902', text: ') or ((b0902 (188, 282: 0.583)' },
                             {'bigg_id':'b0903','name':'b0903', text: ' and b0903 (1.87e+3, 1.14e+4: 2.62)' },
                             {'bigg_id':'b2579','name':'b2579', text: ') and b2579 (5.27e+3, 1.09e+3: 2.28)))' }
                         ]);

        // no data
        assert.deepEqual(data_styles.gene_string_for_data('( G1 OR G2 )', null,
                                                [{bigg_id: 'G1', name: 'Gene1'},
                                                 {bigg_id: 'G2', name: 'Gene2'}],
                                                ['abs'], 'name', 'log2_fold'),
                         [
                             {bigg_id: 'G1', name: 'Gene1', text: '( Gene1' },
                             {bigg_id: 'G2', name: 'Gene2', text: ' OR Gene2)'}
                         ]);
    });

    it('stores text for non-numeric data', function() {
        assert.deepEqual(data_styles.float_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s'], [], 'log2_fold'), null);
        assert.deepEqual(data_styles.text_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s', '8'], null),
                         '2dmmql8_c + fum_c --> 2dmmq8_c + s, 8: (nd)');
        assert.deepEqual(data_styles.reverse_flux_for_data(['2dmmql8_c + fum_c --> 2dmmq8_c + s']), false);
        assert.deepEqual(data_styles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', '8'] },
                                                [{bigg_id: 'G1', name: 'Gene1'}],
                                                ['abs'], 'name', 'log2_fold'),
                         [{bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (my favorite gene✓, 8: nd))' }]);
        assert.deepEqual(data_styles.gene_string_for_data('( G1 )', { G1: ['my favorite gene✓', 'text'] },
                                                [{bigg_id: 'G1', name: 'Gene1'}],
                                                ['abs'], 'name', 'log2_fold'),
                         [{bigg_id: 'G1', name: 'Gene1', text: '( Gene1 (my favorite gene✓, text))' }]);
    });

    it('csv_converter', function() {
        var csv_rows = [['gene', 'v1', 'v2'],
                        ['g1', '10', '20'],
                        ['g2', '15', '25'],
                        ['g3', 'text', 'data']];
        assert.deepEqual(data_styles.csv_converter(csv_rows),
                         [{'g1': '10', 'g2': '15', g3: 'text'}, {g1: '20', g2: '25', g3: 'data'}]);
    });

    it('genes_for_gene_reaction_rule', function() {
        it('finds funny names', function() {
            var rule = '(G1ORF AND G2ANDHI) or YER060W-A OR (G3-A AND G4)';
            assert.deepEqual(data_styles.genes_for_gene_reaction_rule(rule),
                             ['G1ORF', 'G2ANDHI', 'YER060W-A', 'G3-A', 'G4']);
        });

        it('ignores repeats', function() {
            var rule = '((b0902 and b0903) or (b0902 and b3114) or (b3951 and b3952) or ((b0902 and b0903) and b2579))';
            assert.deepEqual(data_styles.genes_for_gene_reaction_rule(rule),
                             ['b0902', 'b0903', 'b3114', 'b3951', 'b3952', 'b2579']);
        });

        it('empty array for empty string', function() {
            var rule = '';
            assert.deepEqual(data_styles.genes_for_gene_reaction_rule(rule), []);
        });
    });

    it('evaluate_gene_reaction_rule', function() {
        var rule, gene_values, out;

        it('funny gene names, upper and lowercase ANDs', function() {
            rule = '(G1 AND G2-A) OR (G3ANDHI aNd G4ORF)';
            gene_values = {G1: [5], 'G2-A': [2], G3ANDHI: [10], G4ORF: [11.5]};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'mean');
            assert.deepEqual(out, [14.25]);
        });

        it('specific bug: repeat', function() {
            rule = '( YER056C  or  YER060W  or  YER060W-A  or  YGL186C )';
            gene_values = {"YER056C": ['151'], "YER060W": ['10'],
                           "YER060W-A": ['2'], "YGL186C": ['17']};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [180]);
        });

        it('single negative', function() {
            rule = 'YER056C';
            gene_values = {"YER056C": [-151]};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [-151]);
        });

        it('multiple values', function() {
        rule = '(G1 AND G2) OR (G3ANDHI aNd G4ORF)';
        gene_values = {G1: [5, 0], G2: [2, 0], G3ANDHI: [10, 0], G4ORF: [11.5, 6]};
        out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
        assert.deepEqual(out, [12, 0]);

        });

        it('order of operations', function() {
            rule = '( YEL039C and YKR066C or YJR048W and YKR066C )';
            gene_values = { YEL039C: ['1'], YKR066C: ['2'], YJR048W: ['4'] };
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [3]);
        });

        it('empty', function() {
            out = data_styles.evaluate_gene_reaction_rule('', {}, 'min');
            assert.deepEqual(out, [null]);
        });

        it('null values', function() {
            rule = '(G1 AND G2) OR (G3 AND G4)';
            gene_values = {G1: [5], G2: [2], G3: [''], G4: [null]};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [2]);
            gene_values = {G1: [null], G2: [null], G3: [null], G4: [null]};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [null]);
            gene_values = {G1: [''], G2: [''], G3: [''], G4: ['']};
            out = data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min');
            assert.deepEqual(out, [null]);
        });

        it(' Members of OR connections can be null', function() {
            rule = '( (( YCR034W or YGR032W) and YLR343W ) or ( ( YCR034W and YGR032W ) and YMR215W ) or ( ( YCR034W and YMR306W ) and YMR215W ) or ( ( YCR034W and YLR342W ) and YOL132W ) or ( ( YCR034W and YMR306W ) and YOL132W ) or ( ( YCR034W and YGR032W ) and YOL030W ) or ( ( YCR034W and YLR342W ) and YOL030W ) or ( ( YCR034W and YMR306W ) and YOL030W ) or ( ( YCR034W and YLR342W ) and YLR343W ) or ( ( YCR034W and YMR306W ) and YLR343W ) or ( ( YCR034W and YGR032W ) and YOL132W ) or ( ( YCR034W and YLR342W ) and YMR215W ) or ( ( YCR034W and YGR032W ) and YMR307W ) or ( ( YCR034W and YLR342W ) and YMR307W ) or ( ( YCR034W and YMR306W ) and YMR307W ) )';
            gene_values = {"YCR034W":[8],
                           "YGR032W":[12],
                           "YLR343W":[2],
                           "YMR215W":[null],
                           "YMR306W":[null],
                           "YLR342W":[null],
                           "YOL132W":[null],
                           "YOL030W":[null],
                           "YMR307W":[null]};
            assert.deepEqual(data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [2]);
        });

        it(' treat nulls as 0', function() {
            rule = '( YOL096C and YDR204W and YML110C and YGR255C and YOR125C and YGL119W and YLR201C )';
            gene_values = {"YOL096C": [-9.966],
                           "YDR204W": [null],
                           "YML110C": [5.727832840424934],
                           "YGR255C": [null],
                           "YOR125C": [null],
                           "YGL119W": [null],
                           "YLR201C": [-7.88335943096544]};
            assert.deepEqual(data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [-9.966]);

        });

        it('extra parentheses', function() {
            rule = '(( (YJL130C) ) or (YJR109C and YOR303W))';
            gene_values = { YJL130C: ['-80.0'],
                            YJR109C: ['70.5'],
                            YOR303W: ['200.5233'] };
            assert.deepEqual(data_styles.evaluate_gene_reaction_rule(rule, gene_values, 'min'), [-9.5]);
        });
    });

    it('replace_gene_in_rule', function() {
        it('replaces strings', function() {
            assert.strictEqual(data_styles.replace_gene_in_rule('G3 G300', 'G3', 'new'), 'new G300');
            assert.strictEqual(data_styles.replace_gene_in_rule('(G3)00', 'G3', 'new'), '(new)00');
            assert.strictEqual(data_styles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new'), '(new)00 new');
        });

        it('timing', function() {
            var start = new Date().getTime(),
                n = 1000.0;
            for (var i = 0; i < n; i++) {
                data_styles.replace_gene_in_rule('(G3)00 G3', 'G3', 'new');
            }
            var time = new Date().getTime() - start;
            console.log('replace_gene_in_rule execution time per ' + n + ': ' + time + 'ms');
        });
    });

    it('apply_reaction_data_to_reactions', function() {
        // for Map.reactions
        var reactions = { 238: { bigg_id: 'GAPD',
                                 segments: { 2: {}}}},
            data = { GAPD: [0, 10] };
        var out = data_styles.apply_reaction_data_to_reactions(reactions, data, [], 'diff');
        assert.strictEqual(out, true);
        assert.deepEqual(reactions, { 238: { bigg_id: 'GAPD',
                                             data: 10.0,
                                             data_string: '0.00, 10.0: 10.0',
                                             reverse_flux: false,
                                             gene_string: null,
                                             segments: { 2: { data: 10.0,
                                                              reverse_flux: false }}}});
    });

    it('apply_metabolite_data_to_nodes', function() {
        // for Map.reactions
        var nodes = { 238: { bigg_id: 'g3p_c' }},
            data = { g3p_c: [0, 10] };
        var out = data_styles.apply_metabolite_data_to_nodes(nodes, data, [], 'diff');
        assert.strictEqual(out, true);
        assert.deepEqual(nodes, { 238: { bigg_id: 'g3p_c',
                                         data: 10.0,
                                         data_string: '0.00, 10.0: 10.0' }});
    });

    it('apply_gene_data_to_reactions', function() {
        // for Map.reactions
        var reactions = { 238: { bigg_id: 'GAPD',
                                 gene_reaction_rule: 'b1779',
                                 genes: [ { bigg_id: 'b1779',
                                            name: 'gapA' } ],
                                 segments: { 2: {}}}},
            data = { GAPD: { b1779: [0, 10] }};
        var out = data_styles.apply_gene_data_to_reactions(reactions, data, [],
                                                           'name', 'diff', 'min');
        assert.strictEqual(out, true);
        assert.deepEqual(reactions, { 238: { bigg_id: 'GAPD',
                                             gene_reaction_rule: 'b1779',
                                             genes: [ { bigg_id: 'b1779',
                                                        name: 'gapA' } ],
                                             data: 10.0,
                                             data_string: '0.00, 10.0: 10.0',
                                             gene_string: [{bigg_id: 'b1779', name: 'gapA', text: 'gapA (0.00, 10.0: 10.0)'}],
                                             reverse_flux: false,
                                             segments: { 2: { data: 10.0,
                                                              reverse_flux: false }}}});
    });
});
