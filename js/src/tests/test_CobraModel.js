var CobraModel = require('../CobraModel');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;


describe('CobraModel', function() {
    it('initializes', function () {
        assert.ok(new CobraModel());
    });

    it('has a list of cofactors', function () {
        var model_data = { reactions: [],
                           metabolites: [],
                           genes: [] },
            model = CobraModel.from_cobra_json(model_data);
        assert.include(model.cofactors, 'atp');
    });

    it('can be imported and exported', function() {
        // set up
        var model_data = { reactions: [ { id: 'acc_tpp',
                                          metabolites: { acc_c: 1, acc_p: -1 },
                                          gene_reaction_rule: 'my_gene',
                                          lower_bound: -100,
                                          upper_bound: -2
                                        },
                                        { id: 'my_empty_reaction',
                                          metabolites: {},
                                          gene_reaction_rule: '',
                                          lower_bound: -4,
                                          upper_bound: 1000
                                        }
                                      ],
                           metabolites: [ { id: 'acc_c',
                                            formula: 'C3H2' },
                                          { id: 'acc_p',
                                            formula: 'C3H2' }
                                        ],
                           genes: [ { id: 'my_gene', name: 'gene_name' } ]
                         };
        var model = CobraModel.from_cobra_json(model_data);

        // export
        var exp = model.model_for_export();

        // import
        var new_model = CobraModel.from_exported_data(exp);

        // check
        assert.deepEqual(new_model.reactions,
                           { acc_tpp: { bigg_id: 'acc_tpp',
                                        metabolites: { acc_c: -1, // should reverse the reaction
                                                       acc_p: 1 },
                                        reversibility: false,
                                        gene_reaction_rule: 'my_gene',
                                        genes: [ { bigg_id: 'my_gene', name: 'gene_name' } ]
                                      },
                             my_empty_reaction: { bigg_id: 'my_empty_reaction',
                                                  metabolites: {},
                                                  gene_reaction_rule: '',
                                                  genes: [],
                                                  reversibility: true
                                                }
                           });
        assert.deepEqual(new_model.metabolites,
                         { acc_c: { bigg_id: 'acc_c',
                                    formula: 'C3H2' },
                           acc_p: { bigg_id: 'acc_p',
                                    formula: 'C3H2' }
                         });
    });

    it('Formulas, genes, reversibility', function () {
        var model_data = { reactions: [ { id: 'acc_tpp',
                                          metabolites: { acc_c: 1, acc_p: -1 },
                                          gene_reaction_rule: 'my_gene',
                                          lower_bound: -100,
                                          upper_bound: -2
                                        },
                                        { id: 'my_empty_reaction',
                                          metabolites: {},
                                          gene_reaction_rule: '',
                                          lower_bound: -4,
                                          upper_bound: 1000
                                        }
                                      ],
                           metabolites: [ { id: 'acc_c',
                                            formula: 'C3H2' },
                                          { id: 'acc_p',
                                            formula: 'C3H2' }
                                        ],
                           genes: [ { id: 'my_gene', name: 'gene_name' } ]
                         };
        var model = CobraModel.from_cobra_json(model_data);
        assert.deepEqual(model.reactions,
                         { acc_tpp: { bigg_id: 'acc_tpp',
                                      metabolites: { acc_c: -1, // should reverse the reaction
                                                     acc_p: 1 },
                                      reversibility: false,
                                      gene_reaction_rule: 'my_gene',
                                      genes: [ { bigg_id: 'my_gene', name: 'gene_name' } ]
                                    },
                           my_empty_reaction: { bigg_id: 'my_empty_reaction',
                                                metabolites: {},
                                                gene_reaction_rule: '',
                                                genes: [],
                                                reversibility: true
                                              }
                         });
        assert.deepEqual(model.metabolites,
                         { acc_c: { bigg_id: 'acc_c',
                                    formula: 'C3H2' },
                           acc_p: { bigg_id: 'acc_p',
                                    formula: 'C3H2' }
                         });
    });

    it('build_reaction_string', function () {
        var r = { atp: -1, amp: -1, adp: 2 },
            s = CobraModel.build_reaction_string(r, true);
        assert.strictEqual(s, 'atp + amp ↔ 2 adp');
        s = CobraModel.build_reaction_string(r, false);
        assert.strictEqual(s, 'atp + amp → 2 adp');
    });
});
