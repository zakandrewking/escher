from __future__ import print_function, unicode_literals

from escher.server import directory
from os.path import join
import json

def validate_map(map_data):
    import jsonschema
    schema = get_jsonschema()
    jsonschema.Draft4Validator.validate(map_data, schema)

    nonvalid = check_segments(map_data)
    if len(nonvalid) == 0:
        print('Map is valid')
    else:
        print('Error. No nodes for segments:')
        print('\n'.join(str(x) for x in nonvalid))

def validate_schema():
    import jsonschema
    schema = get_jsonschema()
    jsonschema.Draft4Validator.check_schema(schema)    

def check_segments(map_data):
    """Make sure that nodes exist on either end of each segment.

    """
    reactions = map_data[1]['reactions'];
    nodes = map_data[1]['nodes'];
    nonvalid = []
    for _, reaction in reactions.items():
        for segment_id, segment in reaction['segments'].items():
            for n in ['to_node_id', 'from_node_id']:
                if segment[n] not in nodes:
                    nonvalid.append((n, segment_id))
    return nonvalid

def get_jsonschema():
    """Get the local jsonschema.

    """
    with open(join(directory, 'jsonschema', '1-0-0'), 'r') as f:
        return json.load(f)

if __name__=="__main__":
    from sys import argv
    if len(argv) < 2:
        raise Exception('Must supply a map JSON file')

    with open(argv[1], 'r') as f:
        map_data = json.load(f)
    validate_map(map_data)
