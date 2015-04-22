"""This script has two purposes:

1. Apply the attributes from a cobra model to an existing Escher
map. For instance, update modified reversibilities.

2. Convert maps made with Escher beta versions to valid jsonschema/1-0-0
maps.

Usage:

Using a Theseus model name (https://github.com/zakandrewking/Theseus).
python convert_map.py old_map.json iJO1366

Using a SBML or JSON model path
python convert_map.py another_old_map.json path/to/iJO1366.sbml

"""

from __future__ import print_function, unicode_literals

try:
    import cobra.io
    import jsonschema
except ImportError:
    raise Exception(('The Python packages jsonschema and COBRApy (0.3.0b3 or later) '
                     'are required for converting maps.'))
try:
    from theseus import load_model
except ImportError:
    print('Theseus not available (https://github.com/zakandrewking/Theseus)')
import sys
import json
from os.path import basename, join
try:
    from urllib.request import urlopen
except ImportError:
    from urllib import urlopen

from escher.validate import validate_map, genes_for_gene_reaction_rule

def main():
    """Load an old Escher map, and generate a validated map.

    """
    try:
        in_file = sys.argv[1]
        model_path = sys.argv[2]
    except IndexError:
        raise Exception("Usage: python convert_map.py old_map.json path/to/model.sbml")
   
    # get the cobra model
    try:
        model = load_model(model_path)
    except Exception:
        try:
            model = cobra.io.load_json_model(model_path)
        except (IOError, ValueError):
            try:
                model = cobra.io.read_sbml_model(model_path)
            except IOError:
                raise Exception('Could not find model in theseus or filesystem: %s' % model_path)

    # get the current map
    with open(in_file, 'r') as f:
        out = json.load(f)

    the_map = convert(out, model)
    
    # don't replace the file
    out_file = in_file.replace('.json', '_converted.json')
    print('Saving validated map to %s' % out_file)
    with open(out_file, 'w') as f:
        json.dump(the_map, f, allow_nan=False)

def convert(map, model):
    # check for new, 2-level maps
    has_head = isinstance(map, list) and len(map) == 2
    if has_head:
        map_body = map[1]
    else:
        map_body = map

    # add missing elements
    for k in ['nodes', 'reactions', 'text_labels']:
        if k not in map_body or len(map_body[k]) == 0:
            map_body[k] = {}
    # default canvas
    if 'canvas' not in map_body:
        map_body['canvas'] = { 'x': -1440,
                               'y': -775,
                               'width': 4320,
                               'height': 2325 }        
    
    # keep track of deleted nodes and reactions
    nodes_to_delete = set()
    reactions_to_delete = set()
    nodes_with_segments = set()

    # nodes
    for id, node in map_body['nodes'].items():
        # follow rules for type
        # metabolites
        if node['node_type'] == 'metabolite':
            # no bigg_id
            if not 'bigg_id' in node:
                print('No bigg_id for node %s. Deleting.' % id)
                nodes_to_delete.add(id)
                
            # unsupported attributes
            for key in list(node.keys()):
                if not key in ["node_type", "x", "y", "bigg_id", "name",
                               "label_x", "label_y", "node_is_primary"]:
                    del node[key]
                    
            # find the metabolite
            try:
                cobra_metabolite = model.metabolites.get_by_id(node['bigg_id'])
            except KeyError:
                print('Could not find metabolite %s in model. Deleting.' % node['bigg_id'])
                nodes_to_delete.add(id)
                continue
            # apply new display names
            node['name'] = cobra_metabolite.name

            # node_is_primary defaults to False
            if not 'node_is_primary' in node or node['node_is_primary'] not in [True, False]:
                node['node_is_primary'] = False
        # markers
        elif node['node_type'] in ['multimarker', 'midmarker']:
            # unsupported attributes
            for key in list(node.keys()):
                if not key in ["node_type", "x", "y"]:
                    del node[key]
        # invalid node_type
        else:
            nodes_to_delete.add(id)
        
    # update reactions
    for id, reaction in map_body['reactions'].items():
        # missing attributes
        will_delete = False
        for k in ["bigg_id", "segments", "label_x", "label_y"]:
            if not k in reaction:
                print('No %s for reaction %s. Deleting.' % (k, id))
                reactions_to_delete.add(id)
                will_delete = True
        if will_delete:
            continue

        # unsupported attributes
        for key in list(reaction.keys()):
            if not key in ["name", "bigg_id","reversibility",
                           "label_x", "label_y", "gene_reaction_rule",
                           "genes", "metabolites", "segments"]:
                del reaction[key]

        # cast attributes
        for k in ['label_x', 'label_y']:
            reaction[k] = float(reaction[k])

        # unsupported attributes in segments
        for s_id, segment in reaction['segments'].items():
            for key in list(segment.keys()):
                if not key in ["from_node_id", "to_node_id", "b1", "b2"]:
                    del segment[key]

            # cast attributes
            for k in ['b1', 'b2']:
                if segment[k] is not None and (segment[k]['x'] is None or segment[k]['y'] is None):
                    segment[k] = None

            # keep track of nodes that have appeared here
            for key in ['from_node_id', 'to_node_id']:
                try:
                    nodes_with_segments.add(segment[key])
                except KeyError:
                    pass

        # get reaction
        try:
            cobra_reaction = model.reactions.get_by_id(reaction['bigg_id'])
        except KeyError:
            print('Could not find reaction %s in model. Deleting.' % reaction['bigg_id'])
            reactions_to_delete.add(id)
            continue
        reaction['gene_reaction_rule'] = cobra_reaction.gene_reaction_rule
        reaction['reversibility'] = (cobra_reaction.lower_bound < 0 and cobra_reaction.upper_bound > 0)
        # reverse metabolites if reaction runs in reverse
        rev_mult = (-1 if
                    (cobra_reaction.lower_bound < 0 and cobra_reaction.upper_bound <= 0)
                    else 1)
        # use metabolites from reaction
        reaction['metabolites'] = [{'bigg_id': met.id, 'coefficient': coeff * rev_mult}
                                   for met, coeff in
                                   cobra_reaction.metabolites.items()]
            
        reaction['name'] = cobra_reaction.name

        reaction['genes'] = []
        for gene in genes_for_gene_reaction_rule(reaction['gene_reaction_rule']):
            try:
                cobra_gene = model.genes.get_by_id(gene)
            except KeyError:
                print('Could not find gene %s in model. Setting name to ID.')
                reaction['genes'].append({'bigg_id': gene, 'name': gene})
                continue
            reaction['genes'].append({'bigg_id': gene, 'name': cobra_gene.name})
        
        # remove any lost segments
        reaction['segments'] = {id: seg for id, seg in reaction['segments'].items()
                                if ((seg['to_node_id'] in map_body['nodes'] and seg['to_node_id'] not in nodes_to_delete) and
                                    (seg['from_node_id'] in map_body['nodes'] and seg['from_node_id'] not in nodes_to_delete))}

    # delete those reactions
    for reaction_id in reactions_to_delete:
        del map_body['reactions'][reaction_id]

    # delete those nodes
    for node_id in nodes_to_delete:
        del map_body['nodes'][node_id]

    # delete any nodes with no segment
    for node_id in list(map_body['nodes'].keys()):
        if node_id not in nodes_with_segments:
            # may not be there, if previously deleted
            try:
                del map_body['nodes'][node_id]
                print('No segments for node %s. Deleting' % node_id)
            except KeyError:
                pass
        
    # text labels
    for id, text_label in map_body['text_labels'].items():
        # unsupported attributes
        for key in list(text_label.keys()):
            if not key in ["x", "y", "text"]:
                del text_label[key]

    # canvas
    # unsupported attributes
    for key in list(map_body['canvas'].keys()):
        if not key in ["x", "y", "width", "height"]:
            del map_body['canvas'][key]

    # delete unsupported elements
    for key in list(map_body.keys()):
        if not key in ["nodes", "reactions", "text_labels", "canvas"]:
            del map_body[key]

    header = {
        "schema": "https://escher.github.io/escher/jsonschema/1-0-0#",
        "homepage": "https://escher.github.io",
        "map_name": "",
        "map_id": "",
        "map_description": ""
        }
    if has_head:
        for key, value in map[0].items():
            if key in ['schema', 'homepage']: continue
            header[key] = value
    
    the_map = [header, map_body]

    validate_map(the_map) 
    return the_map

if __name__=="__main__":
    main()
