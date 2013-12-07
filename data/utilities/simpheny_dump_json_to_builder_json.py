import sys
import gzip
import json
import pprint
from math import atan2

PP = pprint.PrettyPrinter(indent=4)
        
def main():
    """Load a processed dump file (.json or .json.gz), and generate a map for the
    builder tool.

    The final spec looks like:

    { 'reactions': {unique_int: { 'segments': {unique_int: { 'from_node_id': 2,
                                                              'to_node_id': 3,
                                                              'b1': {'absolute_x':1.1, 'absolute_y':1.2},
                                                              'b2': {'absolute_x':1.1, 'absolute_y':1.2}
                                                            },
                                                 ...
                                               ],
                                    'name': '',
                                    'direction': '',
                                    'abbreviation': ''
                                 },
                     ...
                    },
      'nodes': {unique_int: {'node_type': '',
                              'compartment_id': '',
                              'absolute_x': 5.0,
                              'absolute_y': 5.0,
                              'metabolite_name': '',
                              'metabolite_simpheny_id': '',
                              'label_absolute_x': 5.0,
                              'label_absolute_y': 5.0,
                              'node_is_primary': True,
                              'connected_segments': [ {'reaction_id': 4,
                                                       'segment_id': 7},
                                                       ...
                                                    ]
                             },
                ...
               }
    }

    """
    try:
        in_file = sys.argv[1]
        # out_file = sys.argv[2]
    except IndexError:
        print "Not enough arguments"
        sys.exit()

    if in_file.endswith('.gz'):
        with gzip.open(in_file, "r") as f:
            data = json.load(f)
    else:
        with open(in_file, "r") as f:
            data = json.load(f)

    # major categories
    for k, v in data.iteritems():
        if k=="MAPREACTION": reactions = v
        elif k=="MAPLINESEGMENT": line_segments = v
        elif k=="MAPTEXT": text = v
        elif k=="MAPNODE": nodes = v
        else:
            raise Exception('Unrecognized category: %s' % k)

    # do the nodes
    nodes = parse_node(nodes)

    # do the segments
    segment_id = 0
    for segment in line_segments:
        # get the reaction
        reaction_id = segment['MAPLINESEGMENTREACTION']['MAPREACTIONREACTION_ID']
        reaction = [a for a in reactions if a['MAPREACTIONREACTION_ID']==reaction_id]
        if len(reaction) > 1: raise Exception('Too many matches')
        else: reaction = reaction[0]

        # get the nodes
        from_node_id = check_and_add_to_nodes(nodes, segment['MAPLINESEGMENTFROMNODE_ID'], segment_id, reaction['MAPOBJECT_ID'])
        to_node_id = check_and_add_to_nodes(nodes, segment['MAPLINESEGMENTTONODE_ID'], segment_id, reaction['MAPOBJECT_ID'])
        segment['from_node_id'] = from_node_id
        segment['to_node_id'] = to_node_id
        try:
            segment['b1'] = to_x_y(segment['MAPLINESEGMENTCONTROLPOINTS'][0])
            segment['b2'] = to_x_y(segment['MAPLINESEGMENTCONTROLPOINTS'][1])
        except KeyError:
            segment['b1'] = None
            segment['b2'] = None
        
        if 'segments' not in reaction: reaction['segments'] = {}
        reaction['segments'][segment_id] = segment
        segment_id = segment_id + 1

    # do the reactions
    reactions = parse_reactions(reactions)
    
    out = {}
    out['nodes'] = nodes
    out['reactions'] = reactions
    
    # for export, only keep the necessary stuff
    for k, reaction in out['reactions'].iteritems():
        node_keys_to_keep = ['node_type', 'compartment_id', 'absolute_x',
                             'absolute_y', 'metabolite_name',
                             'metabolite_simpheny_id', 'label_absolute_x',
                             'label_absolute_y', 'node_is_primary',
                             'connected_segments']
        segment_keys_to_keep = ['from_node_id', 'to_node_id', 'b1', 'b2']
        reaction_keys_to_keep = ['segments', 'name', 'direction', 'abbreviation']

        for k, node in out['nodes'].iteritems():
            only_keep_keys(node, node_keys_to_keep)
        for k, segment in reaction['segments'].iteritems():
            only_keep_keys(segment, segment_keys_to_keep)
        only_keep_keys(reaction, reaction_keys_to_keep)

    PP.pprint(out['reactions'])
    # with open(out_file, 'w') as f: json.dump(out, f)

def parse_node(nodes):
    for node in nodes:
        # assign new keys
        node['node_type'] = node['MAPNODENODETYPE'].lower()

        def try_assignment(node, key, new_key, cast=None):
            try:
                if cast is not None:
                    node[new_key] = cast(node[key])
                else:
                    node[new_key] = node[key]
            except KeyError:
                pass
        try_assignment(node, 'MAPNODEPOSITIONX', 'absolute_x', cast=float)
        try_assignment(node, 'MAPNODEPOSITIONY', 'absolute_y', cast=float)
        try_assignment(node, 'MAPNODECOMPARTMENT_ID', 'compartment_id', cast=int)
        try_assignment(node, 'MOLECULEOFFICIALNAME', 'metabolite_name')
        try_assignment(node, 'MOLECULEABBREVIATION', 'metabolite_simpheny_id')
        try_assignment(node, 'MAPNODELABELPOSITIONX', 'label_absolute_x', cast=float)
        try_assignment(node, 'MAPNODELABELPOSITIONY', 'label_absolute_y', cast=float)
        try_assignment(node, 'MAPNODEISPRIMARY', 'node_is_primary',
                       cast=lambda x: True if x=='Y' else False)

        node['id'] = node['MAPOBJECT_ID']
        
    # Make into dictionary
    return dict((int(a['id']), a) for a in nodes)

def check_and_add_to_nodes(nodes, node_id, segment_id, reaction_id):
    try:
        node = nodes[int(node_id)]
    except KeyError:
        raise Exception('No match for node')
        return None
    if 'connected_segments' not in node: node['connected_segments'] = []
    node['connected_segments'].append({'reaction_id': int(reaction_id),
                                       'segment_id': int(segment_id)})
    return node_id
        
def to_x_y(array):
    return {'absolute_x': float(array[0]), 'absolute_y': float(array[1])}

def parse_reactions(reactions):
    for reaction in reactions:
        reaction["name"] = reaction['REACTIONOFFICIALNAME']
        reaction["direction"] = reaction['REACTIONDIRECTION']
        reaction["abbreviation"] = reaction['REACTIONABBREVATION']
        reaction["id"] = reaction['MAPOBJECT_ID']
    return dict((int(r['id']), r) for r in reactions)

def only_keep_keys(d, keys):
    for k, v in d.items():
        if k not in keys:
            del d[k]
        
if __name__=="__main__":
    main()
