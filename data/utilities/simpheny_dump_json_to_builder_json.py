import sys
import gzip
import json
import pprint
from math import atan2
from itertools import izip
from numpy import inf

PP = pprint.PrettyPrinter(indent=4)
        
def main():
    """Load a processed dump file (.json or .json.gz), and generate a map for the
    builder tool.

    The final spec looks like:

    { 'reactions': {unique_int: { 'segments': {unique_int: { 'from_node_id': 2,
                                                              'to_node_id': 3,
                                                              'b1': {'x':1.1, 'y':1.2},
                                                              'b2': {'x':1.1, 'y':1.2}
                                                            },
                                                 ...
                                               ],
                                    'name': '',
                                    'direction': '',
                                    'abbreviation': ''
                                    'label_x': 4.3,
                                    'label_y': 4.5
                                 },
                     ...
                    },
      'nodes': {unique_int: {'node_type': '',
                              'compartment_id': '',
                              'x': 5.0,
                              'y': 5.0,
                              'metabolite_name': '',
                              'metabolite_simpheny_id': '',
                              'label_x': 5.0,
                              'label_y': 5.0,
                              'node_is_primary': True,
                              'connected_segments': [ {'reaction_id': 4,
                                                       'segment_id': 7},
                                                       ...
                                                    ]
                             },
                ...
               },
      'text_labels': { unique_int: { 'text': '',
                                'x': 6.1,
                                'y': 7.2 }
                }
    }

    """
    try:
        in_file = sys.argv[1]
        out_file = sys.argv[2]
    except IndexError:
        raise Exception("Not enough arguments")

    if in_file.endswith('.gz'):
        with gzip.open(in_file, "r") as f:
            data = json.load(f)
    else:
        with open(in_file, "r") as f:
            data = json.load(f)

    # major categories
    reactions = []; line_segments = []; text_labels = []; nodes = []
    for k, v in data.iteritems():
        if k=="MAPREACTION": reactions = v
        elif k=="MAPLINESEGMENT": line_segments = v
        elif k=="MAPTEXT": text_labels = v
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
        if len(reaction) > 1: reaction = reaction[0] # raise Exception('Too many matches')
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

        # get reaction label position
        # PP.pprint(segment)
        try:
            reaction['label_x'] = float(segment['MAPLINESEGMENTFROMNODE']['MAPNODELABELPOSITIONX'])
            reaction['label_y'] = float(segment['MAPLINESEGMENTFROMNODE']['MAPNODELABELPOSITIONY'])
        except KeyError:
            pass
        
        if 'segments' not in reaction: reaction['segments'] = {}
        reaction['segments'][segment_id] = segment
        segment_id = segment_id + 1

    # do the reactions
    reactions = parse_reactions(reactions)

    # do the text labels
    text_labels = parse_labels(text_labels)

    # compile the data
    out = {}
    out['nodes'] = nodes
    out['reactions'] = reactions
    out['text_labels'] = text_labels

    # translate everything so x > 0 and y > 0
    out = translate_everything(out)
    
    # for export, only keep the necessary stuff
    node_keys_to_keep = ['node_type', 'compartment_id', 'x',
                         'y', 'metabolite_name',
                         'metabolite_simpheny_id', 'label_x',
                         'label_y', 'node_is_primary',
                         'connected_segments']
    segment_keys_to_keep = ['from_node_id', 'to_node_id', 'b1', 'b2']
    reaction_keys_to_keep = ['segments', 'name', 'direction', 'abbreviation', 'label_x', 'label_y']
    text_label_keys_to_keep = ['x', 'y', 'text']
    for k, node in out['nodes'].iteritems():
            only_keep_keys(node, node_keys_to_keep)
    for k, reaction in out['reactions'].iteritems():
        if 'segments' not in reaction: continue
        for k, segment in reaction['segments'].iteritems():
            only_keep_keys(segment, segment_keys_to_keep)
        only_keep_keys(reaction, reaction_keys_to_keep)
    for k, text_label in out['text_labels'].iteritems():
        only_keep_keys(text_label, text_label_keys_to_keep)

    # get max width and height
    min_max = {'x': [inf, -inf], 'y': [inf, -inf]}
    for k, node in nodes.iteritems():
        if node['x'] < min_max['x'][0]: min_max['x'][0] = node['x']
        if node['x'] > min_max['x'][1]: min_max['x'][1] = node['x']
        if node['y'] < min_max['y'][0]: min_max['y'][0] = node['y']
        if node['y'] > min_max['y'][1]: min_max['y'][1] = node['y']
    max_map_w = min_max['x'][1] - min_max['x'][0]
    max_map_h = min_max['y'][1] - min_max['y'][0]
    out['info'] = {'max_map_w': max_map_w,
                   'max_map_h': max_map_h}

    out['membranes'] = []
        
    with open(out_file, 'w') as f: json.dump(out, f)

def parse_node(nodes):
    for node in nodes:
        # assign new keys
        node['node_type'] = node['MAPNODENODETYPE'].lower()

        try_assignment(node, 'MAPNODEPOSITIONX', 'x', cast=float)
        try_assignment(node, 'MAPNODEPOSITIONY', 'y', cast=float)
        try_assignment(node, 'MAPNODECOMPARTMENT_ID', 'compartment_id', cast=int)
        try_assignment(node, 'MOLECULEOFFICIALNAME', 'metabolite_name')
        try_assignment(node, 'MOLECULEABBREVIATION', 'metabolite_simpheny_id')
        try_assignment(node, 'MAPNODELABELPOSITIONX', 'label_x', cast=float)
        try_assignment(node, 'MAPNODELABELPOSITIONY', 'label_y', cast=float)
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
    return {'x': float(array[0]), 'y': float(array[1])}

def parse_reactions(reactions):
    for reaction in reactions:
        reaction["name"] = reaction['REACTIONOFFICIALNAME']
        reaction["direction"] = reaction['REACTIONDIRECTION']
        reaction["abbreviation"] = reaction['REACTIONABBREVATION']
        reaction["id"] = reaction['MAPOBJECT_ID']
    return dict((int(r['id']), r) for r in reactions)

def parse_labels(labels):
    for label in labels:
        try_assignment(label, 'MAPTEXTPOSITIONX', 'x', cast=float)
        try_assignment(label, 'MAPTEXTPOSITIONY', 'y', cast=float) # cast=lambda x: float(x) - 2000)
        label["id"] = label['MAPOBJECT_ID']
        label["text"] = label["MAPTEXTCONTENT"]
    return dict((int(r['id']), r) for r in labels)

def only_keep_keys(d, keys):
    for k, v in d.items():
        if k not in keys:
            del d[k]

def try_assignment(node, key, new_key, cast=None):
    try:
        if cast is not None:
            node[new_key] = cast(node[key])
        else:
            node[new_key] = node[key]
    except KeyError:
        pass

def translate_everything(out):
    def get_min(a):
        def check(d, mins):
            if type(d) is not dict: return
            
            xs = []; ys = []
            if 'x' in d: xs.append(d['x'])
            if 'label_x' in d: xs.append(d['label_x'])
            if 'y' in d: ys.append(d['y'])
            if 'label_y' in d: ys.append(d['label_y'])

            mins['x'] = min(xs + [mins['x']])
            mins['y'] = min(ys + [mins['y']])

            for k, v in d.iteritems():
                check(v, mins)

        mins = {'x': 0, 'y': 0}
        check(a, mins)
        return mins['x'], mins['y']
    
    def translate(d, subtract_x, subtract_y):
        if type(d) is not dict: return d

        if 'x' in d: d['x'] = d['x'] - subtract_x
        if 'label_x' in d: d['label_x'] = d['label_x'] - subtract_x
        if 'y' in d: d['y'] = d['y'] - subtract_y
        if 'label_y' in d: d['label_y'] = d['label_y'] - subtract_y
        
        for k, v in d.iteritems():
            d[k] = translate(v, subtract_x, subtract_y)
            
        return d

    subtract_x, subtract_y = get_min(out)
    print subtract_x, subtract_y
    return translate(out, subtract_x, subtract_y)
    
if __name__=="__main__":
    main()
