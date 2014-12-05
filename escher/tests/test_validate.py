# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals

from escher.validate import validate_map, validate_schema
from pytest import raises
from copy import deepcopy

def test_validate_map():
    the_map = [{ 'map_name': 'carbohydrate metabolism',
                 'map_id': 'h_sapiens_carb',
                 'map_description': 'A map of central carbon→ metabolism',
                 'homepage': 'https://escher.github.io',
                 'schema': 'https://escher.github.io/escher/jsonschema/1-0-0#'
             },
               { 'reactions': { '1': {'name': 'glyceraldehyde-3-phosphate dehydrogenase',
                                      'bigg_id': 'GAPD',
                                      'reversibility': True,
                                      'label_x': 0,
                                      'label_y': 0,
                                      'gene_reaction_rule': 'b1779',
                                      'genes': [{ 'bigg_id': 'b1779', 'name': 'gapA' }],
                                      'metabolites': [{ 'bigg_id': 'g3p_c', 'coefficient': -1 }],
                                      'segments': { '2': { 'from_node_id': '0',
                                                           'to_node_id': '1',
                                                           'b1': None,
                                                           'b2': None } } } },
                 'nodes': { '0': { 'node_type': 'metabolite',
                                   'x': 1,
                                   'y': 2,
                                   'bigg_id': 'g3p_c',
                                   'name': 'glyceraldehyde-3-phosphate cytosolic',
                                   'label_x': 3,
                                   'label_y': 3,
                                   'node_is_primary': True },
                            '1': { 'node_type': 'multimarker',
                                   'x': 10,
                                   'y': 12.3 } },
                 'text_labels': {},
                 'canvas': {'x': 1208.24,
                            'y':794.55,
                            'width':10402.35,
                            'height':13224.91}
             }] 
    validate_map(the_map)

    # missing node
    new_map = deepcopy(the_map)
    del new_map[1]['nodes']['1']
    with raises(Exception) as e:
        validate_map(new_map)
    print(e)
    assert 'No nodes for segments' in str(e.value)

    # zero coefficient
    new_map = deepcopy(the_map)
    new_map[1]['reactions']['1']['metabolites'][0]['coefficient'] = 0
    with raises(Exception) as e:
        validate_map(new_map)
    print(e)
    assert 'No non-zero stoichiometry for a connected metabolite node' in str(e.value)

    # # midmarker connected to metabolite
    # new_map = deepcopy(the_map)
    # new_map[1]['nodes']['1']['node_type'] = 'midmarker'
    # with raises(Exception) as e:
    #     validate_map(new_map)
    # print(e)
    # assert 'Segments connect midmarkers to metabolites' in str(e.value)

    # No gene name for gene in gene_reaction_rule
    new_map = deepcopy(the_map)
    del new_map[1]['reactions']['1']['genes'][0]['name']
    with raises(Exception) as e:
        validate_map(new_map)
    print(e)
    assert 'No gene name for gene in gene_reaction_rule' in str(e.value)

def test_schema():
    validate_schema()
