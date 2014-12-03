from __future__ import print_function, unicode_literals

from escher.convert_map import genes_for_gene_reaction_rule, convert
from escher.urls import root_directory
import cobra.io
from os.path import join

def test_convert():
    model = cobra.io.load_json_model(join(root_directory, 'escher', 'example_data', 'iJO1366.json'))

    # reverse the reaction
    model.reactions.get_by_id('GAPD').upper_bound = 0
    model.reactions.get_by_id('GAPD').lower_bound = -1000

    # map
    old_map = {'reactions': {'1': {'bigg_id': 'GAPD',
                                   'label_x': 0,
                                   'label_y': 0,
                                   'segments': {'2': {'from_node_id': '0',
                                                      'to_node_id': '1',
                                                      'b1': None,
                                                      'b2': None}}},
                             '2': {'bigg_id': 'PDH'}},
               'nodes': {'3': {'node_type': 'metabolite',
                               'x': 1,
                               'y': 2,
                               'bigg_id': 'glc__D_c',
                               'name': 'D-Glucose'}}}
    
    new_map = convert(old_map, model)

    # no segments: delete reaction
    assert '2' not in new_map[1]['reactions']

    # reversed the map
    for m in new_map[1]['reactions']['1']['metabolites']:
        if m['bigg_id'] == 'g3p_c':
            assert m['coefficient'] == 1
        elif m['bigg_id'] == 'nadh_c':
            assert m['coefficient'] == -1
    assert new_map[1]['reactions']['1']['reversibility'] == False

    # Remove unconnected nodes. These do not make the map invalid, but they are
    # annoying.
    assert '3' not in new_map[1]['nodes']

def test_genes_for_gene_reaction_rule():
    assert genes_for_gene_reaction_rule('((G1 and G2)or G3and)') == ['G1', 'G2', 'G3and']
