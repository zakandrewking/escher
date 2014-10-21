"""This script has two purposes:

1. Apply the attributes from a cobra model to an existing Escher
map. For instance, update modified reversibilities.

2. Convert maps made with Escher beta versions to valid jsonschema/1-0-0
maps.

Usage:

Without a model
python convert_map.py old_map.json output_directory

Using a theseus model name
python convert_map.py old_map.json output_directory iJO1366

Using an sbml model path
python convert_map.py another_old_map.json output_directory iJO1366.sbml
"""

import sys
import cobra.io
import json
from theseus import load_model
from os.path import basename, join
from urllib2 import urlopen
import jsonschema
from escher.validate import get_jsonschema, check_segments

def main():
    """Load an old Escher map, and generate a validated map.

    """
    try:
        in_file = sys.argv[1]
        out_directory = sys.argv[2]
    except IndexError:
        raise Exception("Not enough arguments")

    model_path = sys.argv[3]        
    # get the cobra model
    try:
        model = load_model(model_path)
    except Exception:
        try:
            model = cobra.io.read_sbml_model(model_path)
        except IOError:
            raise Exception('Could not find model in theseus or filesystem: %s' % model_path)

    # get the current map
    with open(in_file, 'r') as f:
        out = json.load(f)

    # keep track of deleted nodes
    nodes_to_delete = []
    for id, node in out['nodes'].iteritems():
        # delete connected_segments
        del node['connected_segments']
        
        # follow rules for type
        if node['node_type'] == 'metabolite':
            if not 'node_is_primary' in node:
                node['node_is_primary'] = False
                
        elif node['node_type'] in ['multimarker', 'midmarker']:
            for key in node.keys():
                if not key in ["node_type", "x", "y"]:
                    del node[key]

        else:
            nodes_to_delete.append(id)

    # delete those nodes
    for node_id in nodes_to_delete:
        del out['nodes'][node_id]
        
    # update reactions
    for id, reaction in out['reactions'].iteritems():
        reaction['metabolites'] = [{'bigg_id': key, 'coefficient': val['coefficient']}
                                for key, val in
                                reaction['metabolites'].iteritems()]

        # get gpr
        if model is not None:
            try:
                cobra_reaction = model.reactions.get_by_id(reaction['bigg_id'])
                reaction['gene_reaction_rule'] = cobra_reaction.gene_reaction_rule
                continue
            except KeyError:
                pass
            reaction['gene_reaction_rule'] = ''

        # remove any lost segments
        reaction['segments'] = {id: seg for id, seg in reaction['segments'].iteritems()
                                if (seg['to_node_id'] not in nodes_to_delete and
                                    seg['from_node_id'] not in nodes_to_delete)}
            
    # delete unsupported elements
    for key in out.keys():
        if not key in ["nodes", "reactions", "text_labels", "canvas"]:
            del out[key]

    header = {
        "schema": "https://zakandrewking.github.io/escher/escher/jsonschema/1-0-0#",
        "homepage": "https://zakandrewking.github.io/escher",
        "map_name": basename(in_file).replace('.json', ''),
        "map_id": "",
        "map_description": ""
        }
    
    the_map = [header, out]
        
    schema = get_jsonschema()
    jsonschema.validate(the_map, schema)

    nonvalid = check_segments(the_map)
    if len(nonvalid) == 0:
        print 'Map is valid'
        out_file = join(out_directory, basename(in_file))
        # don't replace the file
        out_file = out_file.replace('.json', '_converted.json')
        print 'Saving validated map to %s' % out_file            
        with open(out_file, 'w') as f:
            json.dump(the_map, f, allow_nan=False)
    else:
        print 'Error. No nodes for segments:'
        print '\n'.join(str(x) for x in nonvalid)

if __name__=="__main__":
    main()
