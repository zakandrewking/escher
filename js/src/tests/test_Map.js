var require_helper = require('./helpers/require_helper');

var Map = require_helper('Map');
var Settings = require_helper('Settings');
var CobraModel = require_helper('CobraModel');

var describe = require('mocha').describe;
var it = require('mocha').it;
var beforeEach = require('mocha').beforeEach;
var assert = require('chai').assert;

var d3_body = require('./helpers/d3_body');
var get_map = require('./helpers/get_map');


describe('Map', function() {
    var map, svg;

    beforeEach(function() {
        // set up map
        svg = d3_body.append('svg');

        var sel = svg.append('g'),
            // streams are required for these options
            required_options = { reaction_scale: [],
                                 metabolite_scale: [],
                                 reaction_styles: [],
                                 reaction_compare_style: 'diff',
                                 metabolite_styles: [],
                                 metabolite_compare_style: 'diff' },
            required_conditional_options = [ 'reaction_scale', 'metabolite_scale' ],
            set_option = function(key, val) { required_options[key] = val; },
            get_option = function(key) { return required_options[key]; };

        map = Map.from_data(get_map(),
                            svg,
                            null,
                            sel,
                            null,
                            new Settings(set_option, get_option,
                                         required_conditional_options),
                            null,
                            true);
    });

    it('initializes', function() {
        assert.ok(map);
    });

    it('def is the first element in the svg', function() {
        // this fixes a bug with export SVG files to certain programs,
        // e.g. Inkscape for Windows
        var defs_node = d3_body.select('defs').node();
        assert.strictEqual(defs_node.parentNode.firstChild, defs_node);
    });

    it('loads with reaction/metabolite data', function () {
        // no data
        assert.strictEqual(map.has_data_on_reactions, false);
        assert.strictEqual(map.has_data_on_nodes, false);
    });

    it('loads without reaction/metabolite data', function () {
        // data
        map.apply_reaction_data_to_map({'GLCtex': 100});
        map.apply_metabolite_data_to_map({'glc__D_p': 3});

        // make sure ids are saved correctly
        for (var id in map.reactions) {
            // ids should be strings that eval to integers
            assert.strictEqual(isNaN(id), false);
            // bigg ids should be present
            assert.isDefined(map.reactions[id].bigg_id);
            assert.isUndefined(map.reactions[id].bigg_id_compartmentalized);
        }

        for (var id in map.nodes) {
            var node = map.nodes[id];
            // ids should be strings that eval to integers
            assert.strictEqual(isNaN(id), false);
            if (node.node_type=='metabolite') {
                // bigg ids and compartments should be present
                assert.isDefined(map.nodes[id].bigg_id);
            }
        }

        assert.isTrue(map.has_data_on_reactions);
        for (var id in map.reactions) {
            var reaction = map.reactions[id];
            if (reaction.bigg_id=='GLCtex') {
                assert.strictEqual(reaction.data, 100);
                assert.strictEqual(reaction.data_string, '100.0');
            } else {
                assert.strictEqual(reaction.data, null);
            }
        }

        assert.strictEqual(map.has_data_on_nodes, true);
        for (var id in map.nodes) {
            var node = map.nodes[id];
            if (node.bigg_id_compartmentalized=='glc__D_p')
                assert.strictEqual(map.nodes[id].data, 3);
            else
                assert.strictEqual(map.nodes[id].data, null);
        }

        map.apply_reaction_data_to_map(null);
        assert.strictEqual(map.has_data_on_reactions, false);
        for (var id in map.reactions) {
            assert.strictEqual(map.reactions[id].data, null);
        }

        map.apply_metabolite_data_to_map(null);
        assert.isFalse(map.has_data_on_nodes);
        for (var id in map.nodes) {
            assert.strictEqual(map.nodes[id].data, null);
        }
    });

    it('has a search index', function() {
        // reactions
        assert.deepEqual(map.search_index.find('glyceraldehyde-3-phosphate dehydrogenase')[0],
                         { type: 'reaction', reaction_id: '1576769' });
        assert.deepEqual(map.search_index.find('GAPD')[0],
                         { type: 'reaction', reaction_id: '1576769' });
        assert.deepEqual(map.search_index.find('b1779')[0],
                         { type: 'reaction', reaction_id: '1576769' });
        // metabolites
        assert.deepEqual(map.search_index.find('Glyceraldehyde-3-phosphate')[0],
                         { type: 'metabolite', node_id: '1576545' });
        assert.deepEqual(map.search_index.find('^g3p_c$')[0],
                         { type: 'metabolite', node_id: '1576545' });
        // text_labels
        assert.deepEqual(map.search_index.find('TEST')[0],
                         { type: 'text_label', text_label_id: '1' });

        // delete reactions
        map.delete_reaction_data(['1576769']);
        assert.deepEqual(map.search_index.find('glyceraldehyde-3-phosphatedehydrogenase'), []);
        assert.deepEqual(map.search_index.find('GAPD'), []);
        assert.deepEqual(map.search_index.find('b1779'), []);
        // delete nodes
        map.delete_node_data(['1576545', '1576575']);
        assert.deepEqual(map.search_index.find('Glyceraldehyde-3-phosphate'), []);
        assert.deepEqual(map.search_index.find('^g3p_c$'), []);
        // delete text_labels
        map.delete_text_label_data(['1']);
        assert.deepEqual(map.search_index.find('TEST'), []);

        // new reaction
        map.extend_reactions({ '123456789': { bigg_id: 'EX_glc__D_p',
                                              name: 'periplasmic glucose exchange',
                                              gene_reaction_rule: 's0001',
                                              genes: [ { 'bigg_id': 's0001',
                                                         'name': 'spontaneous'} ] } });
        assert.deepEqual(map.search_index.find('EX_glc__D_p')[0],
                         { type: 'reaction', reaction_id: '123456789' });
        assert.deepEqual(map.search_index.find('periplasmic glucose exchange')[0],
                         { type: 'reaction', reaction_id: '123456789' });
        assert.deepEqual(map.search_index.find('s0001')[0],
                         { type: 'reaction', reaction_id: '123456789' });
        assert.deepEqual(map.search_index.find('spontaneous')[0],
                         { type: 'reaction', reaction_id: '123456789' });
        // new node
        map.extend_nodes({ '123456789': { bigg_id: 'glc__D_p',
                                          name: 'periplasmic glucose',
                                          node_type: 'metabolite' }});
        assert.deepEqual(map.search_index.find('^glc__D_p')[0],
                         { type: 'metabolite', node_id: '123456789' });
        assert.deepEqual(map.search_index.find('periplasmic glucose$')[0],
                         { type: 'metabolite', node_id: '123456789' });
        // new text label
        var id = map.new_text_label({ x: 0, y: 0 }, 'TESTEST');
        assert.deepEqual(map.search_index.find('TESTEST')[0],
                         { type: 'text_label', text_label_id: id });

        // edit text label
        map.edit_text_label(id, 'TESTESTEST', false);
        assert.deepEqual(map.search_index.find('^TESTEST$'), []);
        assert.deepEqual(map.search_index.find('TESTESTEST')[0],
                         { type: 'text_label', text_label_id: id });
    });

    it('can accept new reactions', function() {
        var model_data = { reactions: [ { id: 'acc_tpp',
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
                         },
            model = CobraModel.from_cobra_json(model_data);
        map.cobra_model = model;

        map.new_reaction_from_scratch('acc_tpp', {x: 0, y: 0, gene_reaction_rule: ''}, 0);

        // find the reaction
        var match = null;
        for (var r_id in map.reactions) {
            var r = map.reactions[r_id];
            if (r.bigg_id == 'acc_tpp')
                match = r;
        }
        assert.ok(match);
        // gene reaction rule
        assert.strictEqual(match.gene_reaction_rule,
                           model_data.reactions[0].gene_reaction_rule);
    });

    it('get_data_statistics', function() {
        it('accepts numbers or strings as floats; ignores empty strings and nulls', function() {
            var data = { PGI: [10], GAPD: ['5'], TPI: [''], PGK: [null] };
            map.apply_reaction_data_to_map(data);
            map.calc_data_stats('reaction');
            assert.deepEqual(map.get_data_statistics(),
                             { reaction: { min: 5, median: 7.5, mean: 7.5,
                                           Q1: 5, Q3: 10, max: 10 },
                               metabolite: { min: null, median: null, mean: null,
                                             Q1: null, Q3: null, max: null } });
        });

        it('works for metabolites', function() {
            // metabolites
            var data = { g3p_c: [10], fdp_c: ['4'] };
            map.apply_metabolite_data_to_map(data);
            map.calc_data_stats('metabolite');
            assert.deepEqual(map.get_data_statistics(),
                             { reaction: { min: 5, median: 7.5, mean: 7.5,
                                           Q1: 5, Q3: 10, max: 10 },
                               metabolite: { min: 4, median: 10, mean: 8,
                                             Q1: 4, Q3: 10, max: 10 } });
        });
    });

    it('map_for_export', function() {
        it('removes unnecessary attributes', function() {
            // check that unnecessary attributes are removed
            ['reactions', 'nodes', 'text_labels'].forEach(function(type) {
                for (var first in map[type]) {
                    map[type][first].to_remove = true;
                    var data = map.map_for_export();
                    assert.strictEqual(data[1][type][first].to_remove).not.toBeDefined();
                    break;
                }
            });
            map.canvas.to_remove = true;
            var data = map.map_for_export();
            assert.isUndefined(data[1].canvas.to_remove);
        });
    });
});
