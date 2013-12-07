import sys
import csv
import json
import copy
from numpy import array
from numpy.linalg import norm
import gzip
import os

CURVE_K = 0.5
CURVE_L = 0.3

class AutoVivification(dict):
    """
    Taken from http://stackoverflow.com/a/652284/280182
    Implementation of perl's autovivification feature."""
    def __getitem__(self, item):
        try:
            return dict.__getitem__(self, item)
        except KeyError:
            value = self[item] = type(self)()
            return value

def parse_complete_simpheny_dump(dump_csv_path, out_path="processed"):
    """File complete_simpheny_maps_dump.csv contains all simpheny maps.

    """
    map_dump = map_csv_to_struct(dump_csv_path)

    for map_id, map_content in map_dump.items():
        print 'Processing map ' + map_id
        map_objects = index_map_objects_by_id(map_content)
        add_control_points(map_content, map_objects)

        reorganized_dump = copy.copy(map_content)
        for segment in reorganized_dump['MAPLINESEGMENT']:
            segment['MAPLINESEGMENTREACTION'] = map_objects[segment['MAPLINESEGMENTREACTION_ID']]
            segment['MAPLINESEGMENTFROMNODE'] = map_objects[segment['MAPLINESEGMENTFROMNODE_ID']]
            segment['MAPLINESEGMENTTONODE'] = map_objects[segment['MAPLINESEGMENTTONODE_ID']]
        if not os.path.isdir(out_path): os.mkdir(out_path)
        with gzip.open(os.path.join(out_path, map_id + ".json.gz"), "w") as fhandle:
            json.dump(reorganized_dump, fhandle, indent=4, sort_keys=True)

def parse_simpheny_dump(dump_csv_path, reorganized=True):
    """Returns a python object for the simpheny dump.

    e.g. coremap_dump.csv

    """
    map_dump = map_csv_to_struct(dump_csv_path)
    map_id, map_dump = map_dump.popitem()
    map_objects = index_map_objects_by_id(map_dump)
    add_control_points(map_dump, map_objects)

    if not reorganized:
        return map_dump

    reorganized_dump = copy.copy(map_dump)
    for segment in reorganized_dump['MAPLINESEGMENT']:
        segment['MAPLINESEGMENTREACTION'] = map_objects[segment['MAPLINESEGMENTREACTION_ID']]
        segment['MAPLINESEGMENTFROMNODE'] = map_objects[segment['MAPLINESEGMENTFROMNODE_ID']]
        segment['MAPLINESEGMENTTONODE'] = map_objects[segment['MAPLINESEGMENTTONODE_ID']]
    return reorganized_dump

def map_csv_to_struct(path):
    '''Read simpheny dump from csv and return nested data structure of MAPTEXT,
    MAPLINESEGMENT, etc.

    '''

    # Read csv dump
    print 'Reading file ...'
    stuff = list()
    with open(path, "U") as fhandle:
        for i, row in enumerate(csv.reader(fhandle)):
            if i == 0:
                header = row
            else:
                stuff.append(dict(zip(header, row)))
    # Get header
    print 'Constructing set of object types ...'
    header = set()
    for row in stuff:
        if row["MAPOBJECTTYPE"].strip() is not '':
            header.add(row["MAPOBJECTTYPE"].strip())
    print "MAPOBJECTTYPE(s) found:"
    print header

    # Generate json like represenation
    map_dump = AutoVivification()
    num_rows = len(stuff)
    for index, row in enumerate(stuff):
        if index is not 0 and index % 100000 == 0:
            print "Processing csv file ... row %d out of %d" % (index, num_rows)
        for objtype in header:
            if row["MAPOBJECTTYPE"].strip() == objtype.strip():
                tmp_dict = dict([(k, v) for k,v in row.items() if not v == ''])
                try:
                    tmp_dict.pop("MAPOBJECTTYPE")
                    if map_dump[row['METABOLICMAP_ID']].has_key(row["MAPOBJECTTYPE"].strip()):
                        map_dump[row['METABOLICMAP_ID']][row["MAPOBJECTTYPE"].strip()].append(tmp_dict)
                    else:
                         map_dump[row['METABOLICMAP_ID']][row["MAPOBJECTTYPE"].strip()] = [tmp_dict]
                except KeyError, e:
                    print row["MAPOBJECTTYPE"].strip()
                    print objtype.strip()
                    print tmp_dict
                    print e
    return map_dump

def index_map_objects_by_id(map_dump):
    '''
    index_map_objects_by_id(mapdump) will return a dict of all
    map objects. The keys are the id stored in MAPOBJECT_ID.

    '''        
    # Cache all map objects by ID (MAPOBJECT_ID)
    map_objects = dict()
    for sublist in map_dump.values():
        for item in sublist:
            item_cp = copy.copy(item)
            mapobject_id = item_cp.pop("MAPOBJECT_ID")
            map_objects[mapobject_id] = item_cp
    return map_objects

def get_reaction_directions(line_segments, map_objects):
    '''
    get_reaction_directions returns a dictionary of tuple keys (rxnID,
    'reactant_side'|'product_side') and unit vector directions; it is similar
    to the _getControlPt routine in MetabolicMap.pm (in the BIGG codebase)
    '''
    rxn_orientation = dict()
    for segment in line_segments:
        rxnID = segment['MAPLINESEGMENTREACTION_ID']
        from_node_id = segment['MAPLINESEGMENTFROMNODE_ID']
        from_node = map_objects[from_node_id]
        from_node_type = from_node['MAPNODENODETYPE']
        to_node_id = segment['MAPLINESEGMENTTONODE_ID']
        to_node = map_objects[to_node_id]
        to_node_type = to_node['MAPNODENODETYPE']
        
        from_coords = array((float(from_node['MAPNODEPOSITIONX']), float(from_node['MAPNODEPOSITIONY'])))
        to_coords = array((float(to_node['MAPNODEPOSITIONX']), float(to_node['MAPNODEPOSITIONY'])))
        if from_node_type == 'MIDMARKER' and to_node_type == 'MULTIMARKER':
            unit_vector_direction = (to_coords - from_coords) / norm(to_coords - from_coords)
            rxn_orientation[(rxnID, 'product_side')] = unit_vector_direction
        elif from_node_type == 'MULTIMARKER' and to_node_type == 'MIDMARKER':
            unit_vector_direction = (from_coords - to_coords) / norm(from_coords - to_coords)
            rxn_orientation[(rxnID, 'reactant_side')] = unit_vector_direction
        elif from_node_type == 'METABOLITE' and to_node_type == 'MIDMARKER':
            unit_vector_direction = (from_coords - to_coords) / norm(from_coords - to_coords)
            rxn_orientation[(rxnID, 'reactant_side')] = unit_vector_direction
        elif from_node_type == 'MIDMARKER' and to_node_type == 'METABOLITE':
            unit_vector_direction = (from_coords - to_coords) / norm(from_coords - to_coords)
            rxn_orientation[(rxnID, 'product_side')] = unit_vector_direction
    return rxn_orientation

def add_control_points(map_dump, map_objects):
    rxn_directions = get_reaction_directions(map_dump['MAPLINESEGMENT'], map_objects)

    # Add control points to MAPLINESEGMENTS
    for segment in map_dump['MAPLINESEGMENT']:
        # Clean up original control points
        try:
            del segment['MAPLINESEGMENTCONTROLPOINTS']
        except KeyError:
            pass
        rxnID = segment['MAPLINESEGMENTREACTION_ID']
        from_node_id = segment['MAPLINESEGMENTFROMNODE_ID']
        from_node = map_objects[from_node_id]
        from_node_type = from_node['MAPNODENODETYPE']
        to_node_id = segment['MAPLINESEGMENTTONODE_ID']
        to_node = map_objects[to_node_id]
        to_node_type = to_node['MAPNODENODETYPE']

        from_coords = array((float(from_node['MAPNODEPOSITIONX']), float(from_node['MAPNODEPOSITIONY'])))
        to_coords = array((float(to_node['MAPNODEPOSITIONX']), float(to_node['MAPNODEPOSITIONY'])))
        if from_node_type == 'METABOLITE' and to_node_type == 'MULTIMARKER':
            direction = rxn_directions[(rxnID, 'reactant_side')]
            distance =  norm(from_coords - to_coords)
            offset_from_marker = distance * CURVE_K
            control_point_1 = to_coords + direction * offset_from_marker
            control_point_2 = to_coords + CURVE_L * (control_point_1 - to_coords)
            segment['MAPLINESEGMENTCONTROLPOINTS'] = (tuple(control_point_1), tuple(control_point_2))

        elif from_node_type == 'MULTIMARKER' and to_node_type == 'METABOLITE':
            direction = rxn_directions[(rxnID, 'product_side')]
            distance =  norm(from_coords - to_coords)
            offset_from_marker = distance * CURVE_K
            control_point_1 = from_coords + direction * offset_from_marker
            control_point_2 = from_coords + CURVE_L * (control_point_1 - from_coords)
            segment['MAPLINESEGMENTCONTROLPOINTS'] = (tuple(control_point_2), tuple(control_point_1))
        
        elif from_node_type == 'METABOLITE' and to_node_type == 'MIDMARKER':
            direction = -1 * rxn_directions[(rxnID, 'reactant_side')]
            distance =  norm(from_coords - to_coords)
            offset_from_marker = distance * CURVE_K
            control_point_1 = from_coords + direction * offset_from_marker
            control_point_2 = from_coords + CURVE_L * (control_point_1 - from_coords)
            segment['MAPLINESEGMENTCONTROLPOINTS'] = (tuple(control_point_2), tuple(control_point_1))

        elif from_node_type == 'MIDMARKER' and to_node_type == 'METABOLITE':
            direction = -1 * rxn_directions[(rxnID, 'product_side')]
            distance =  norm(from_coords - to_coords)
            offset_from_marker = distance * CURVE_K
            control_point_1 = from_coords + direction * offset_from_marker
            control_point_2 = from_coords + CURVE_L * (control_point_1 - from_coords)
            segment['MAPLINESEGMENTCONTROLPOINTS'] = (tuple(control_point_2), tuple(control_point_1))

if __name__=="__main__":
    map_dump = parse_simpheny_dump("dumps/coremap_dump.csv")
    reorganized_dump = parse_simpheny_dump("dumps/coremap_dump.csv", reorganized=True)
    
    with open("dumps/coremap_dump.json", "w") as f:
        json.dump(map_dump, f, indent=4, sort_keys=True)
    with open("dumps/coremap_dump_verbose.json", "w") as fhandle:
        json.dump(reorganized_dump, fhandle, indent=4, sort_keys=True)

    # dump them all!
    parse_complete_simpheny_dump("dumps/complete_simpheny_maps_dump.csv", out_path="processed")
