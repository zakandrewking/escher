from escher.server import directory
from os.path import join
import json

def check_segments(map_data):
    """Make sure that nodes exist on either end of each segment.

    """
    reactions = map_data[1]['reactions'];
    nodes = map_data[1]['nodes'];
    nonvalid = []
    for _, reaction in reactions.iteritems():
        for segment_id, segment in reaction['segments'].iteritems():
            for n in ['to_node_id', 'from_node_id']:
                if segment[n] not in nodes:
                    nonvalid.append((n, segment_id))
    return nonvalid

def get_jsonschema():
    """Get the local jsonschema.

    """
    with open(join(directory, 'jsonschema', '1-0-0'), 'r') as f:
        return json.load(f)
