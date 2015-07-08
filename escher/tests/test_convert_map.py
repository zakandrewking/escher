from __future__ import print_function, unicode_literals

from escher.convert_map import *
from escher.urls import root_directory
import cobra.io
from os.path import join
from pytest import raises

def get_old_map():
    # map
    return {'reactions': {'1': {'bigg_id': 'GAPD',
                                'label_x': '0',
                                'label_y': 0,
                                'segments': {'2': {'from_node_id': '0',
                                                   'to_node_id': '1',
                                                   'b1': {'x': None, 'y': None},
                                                   'b2': None},
                                             '10': {'from_node_id': '11',
                                                    'to_node_id': '12'}}},
                          '2': {'bigg_id': 'PDH'}},
            'nodes': {'0': {'node_type': 'multimarker',
                            'x': 1,
                            'y': 2},
                      '1': {'node_type': 'metabolite',
                            'label_x': 10,
                            'label_y': 12.2,
                            'x': 1,
                            'y': 2,
                            'bigg_id': 'g3p_c',
                            'name': 'glycerol-3-phosphate'},
                      '3': {'node_type': 'metabolite',
                            'x': 1,
                            'y': 2,
                            'bigg_id': 'glc__D_c',
                            'name': 'D-Glucose'}}}

def get_new_map():
    return [
        {"schema": "https://escher.github.io/escher/jsonschema/1-0-0#",
         "homepage": "https://escher.github.io",
         "map_name": "",
         "map_id": "",
         "map_description": ""},
        {"reactions": {"1576769": {"name": "glyceraldehyde-3-phosphate dehydrogenase",
                                   "bigg_id": "GAPD",
                                   "reversibility": True,
                                   "label_x": 1065,
                                   "label_y": 2385,
                                   "gene_reaction_rule": "b1779",
                                   "genes": [{"bigg_id": "b1779", "name": "b1779"}],
                                   "metabolites": [
                                       {"coefficient": 1, "bigg_id": "nadh_c"},
                                       {"coefficient": 1, "bigg_id": "13dpg_c"},
                                       {"coefficient": -1, "bigg_id": "pi_c"},
                                       {"coefficient": 1, "bigg_id": "h_c"},
                                       {"coefficient": -1, "bigg_id": "nad_c"},
                                       {"coefficient": -1, "bigg_id": "g3p_c"}
                                   ],
                                   "segments": {
                                       "217": {"from_node_id": "1577006", "to_node_id": "1577008", "b1": None, "b2": None},
                                       "218": {"from_node_id": "1577008", "to_node_id": "1577007", "b1": None, "b2": None},
                                       "219": {"from_node_id": "1576575", "to_node_id": "1577006", "b1": {"y": 2270, "x": 1055}, "b2": {"y": 2322.5, "x": 1055}},
                                       "220": {"from_node_id": "1576669", "to_node_id": "1577006", "b1": {"y": 2284.7920271060384, "x": 1055}, "b2": {"y": 2326.9376081318114, "x": 1055}},
                                       "221": {"from_node_id": "1576670", "to_node_id": "1577006", "b1": {"y": 2297.5658350974745, "x": 1055}, "b2": {"y": 2330.769750529242, "x": 1055}},
                                       "222": {"from_node_id": "1577007", "to_node_id": "1576487", "b1": {"y": 2454.5, "x": 1055}, "b2": {"y": 2500, "x": 1055}},
                                       "223": {"from_node_id": "1577007", "to_node_id": "1576671", "b1": {"y": 2453.0623918681886, "x": 1055}, "b2": {"y": 2495.2079728939616, "x": 1055}},
                                       "224": {"from_node_id": "1577007", "to_node_id": "1576672", "b1": {"y": 2449.230249470758, "x": 1055}, "b2": {"y": 2482.4341649025255, "x": 1055}}
                                   }
                               }
                       },
         "nodes": {
             "1577006": {"node_type": "multimarker", "x": 1055, "y": 2345},
             "1577007": {"node_type": "multimarker", "x": 1055, "y": 2435}, 
             "1577008": {"node_type": "midmarker", "x": 1055, "y": 2395},
             "1576575": {"node_type": "metabolite", "x": 1055, "y": 2195, "bigg_id": "g3p_c", "name": "Glyceraldehyde-3-phosphate", "label_x": 1085, "label_y": 2195, "node_is_primary": True},
             "1576487": {"node_type": "metabolite", "x": 1055, "y": 2565, "bigg_id": "13dpg_c", "name": "3-Phospho-D-glyceroyl-phosphate", "label_x": 1085, "label_y": 2565, "node_is_primary": True},
             "1576669": {"node_type": "metabolite", "x": 1145, "y": 2265, "bigg_id": "nad_c", "name": "Nicotinamide-adenine-dinucleotide", "label_x": 1165, "label_y": 2265, "node_is_primary": False},
             "1576670": {"node_type": "metabolite", "x": 1145, "y": 2315, "bigg_id": "pi_c", "name": "Phosphate", "label_x": 1165, "label_y": 2315, "node_is_primary": False},
             "1576671": {"node_type": "metabolite", "x": 1145, "y": 2515, "bigg_id": "nadh_c", "name": "Nicotinamide-adenine-dinucleotide-reduced", "label_x": 1165, "label_y": 2515, "node_is_primary": False},
             "1576672": {"node_type": "metabolite", "x": 1145, "y": 2465, "bigg_id": "h_c", "name": "H", "label_x": 1169, "label_y": 2465, "node_is_primary": False},
         }
     }
    ]


def test_get_header():
    assert get_header([1,2]) == 1

def test_get_body():
    assert get_body([1,2]) == 2

def test_is_valid_body():
    assert is_valid_body(get_old_map())

def test_dict_with_required_elements():
    out = {'my': 'dict'}
    dict_with_required_elements(out, ['my', 'also'],
                                get_default=lambda x, _: 'this' if x == 'also' else None)
    assert out['also'] == 'this'
    assert 'my' in out
    assert out['my'] is out['my']

    with raises(MissingDefaultAttribute):
        out = {'my': 'dict'}
        dict_with_required_elements(out, ['also'])

    # nullable attributes
    with raises(MissingDefaultAttribute):
        out = {'my': None}
        dict_with_required_elements(out, ['my'])
    out = {'my': None}
    dict_with_required_elements(out, ['my'], nullable=['my'])

    # casting
    out = {'my': 0}
    dict_with_required_elements(out, ['my'], cast={'my': float})
    assert out['my'] == 0

def test_old_map_to_new_schema():
    old_map = get_old_map()
    new_map = old_map_to_new_schema(old_map)
    assert len(new_map) == 2
    assert 'schema' in get_header(new_map)
    assert 'reactions' in get_body(new_map)
    assert old_map['reactions'] is get_reactions(get_body(new_map))
    assert get_body(new_map)['canvas']['x'] == -1440
    assert get_body(new_map)['text_labels'] == {}

def test_apply_id_mappings():
    new_map = get_new_map()
    reaction_id_mapping = {'GAPD': 'GAPD_1'}
    metabolite_id_mapping = {'g3p_c': 'g3p_c_1'}
    gene_id_mapping = {'b1779': 'gapA'}
    apply_id_mappings(new_map, reaction_id_mapping, metabolite_id_mapping, gene_id_mapping)
    assert list(get_reactions(get_body(new_map)).values())[0]['bigg_id'] == 'GAPD_1'
    assert list(get_reactions(get_body(new_map)).values())[0]['genes'][0]['bigg_id'] == 'gapA'
    assert 'g3p_c_1' in [x['bigg_id'] for x in list(get_reactions(get_body(new_map)).values())[0]['metabolites']]
    assert 'g3p_c_1' in [x['bigg_id'] for x in get_nodes(get_body(new_map)).values() if 'bigg_id' in x]

def test_apply_cobra_model_to_map():
    new_map = get_new_map()
    model = cobra.io.load_json_model(join(root_directory, 'escher', 'example_data', 'iJO1366.json'))
    model.reactions.get_by_id('GAPD').gene_reaction_rule = '12345'
    model.reactions.get_by_id('GAPD').name = '54321'
    assert model.reactions.get_by_id('GAPD').lower_bound < 0
    model.reactions.get_by_id('GAPD').lower_bound = 0
    model.genes.get_by_id('12345').name = 'gonzo'
    apply_cobra_model_to_map(new_map, model)
    gapd_reaction = list(get_reactions(get_body(new_map)).values())[0]
    assert gapd_reaction['gene_reaction_rule'] == model.reactions.get_by_id('GAPD').gene_reaction_rule
    assert gapd_reaction['name'] == model.reactions.get_by_id('GAPD').name
    assert gapd_reaction['reversibility'] is False
    assert 'gonzo' in [x['name'] for x in gapd_reaction['genes']]


def test_convert():
    model = cobra.io.load_json_model(join(root_directory, 'escher', 'example_data', 'iJO1366.json'))

    # reverse the reaction
    model.reactions.get_by_id('GAPD').upper_bound = 0
    model.reactions.get_by_id('GAPD').lower_bound = -1000

    new_map = convert(get_old_map(), model)
    print(new_map)

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

    # casting
    assert type(new_map[1]['reactions']['1']['label_x']) is float
    assert new_map[1]['reactions']['1']['segments']['2']['b1'] is None


def test_convert_2():
    model = cobra.io.load_json_model(join(root_directory, 'escher', 'example_data', 'iJO1366.json'))
    convert(get_new_map(), model)


def test_genes_for_gene_reaction_rule():
    assert genes_for_gene_reaction_rule('((G1 and G2)or G3and)') == ['G1', 'G2', 'G3and']
