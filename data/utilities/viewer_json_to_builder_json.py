import json
import sys
import re
from numpy import mean, inf
from scipy import stats
from math import atan, pi, sqrt, pow, sin, cos
from cPickle import load, dump
import cobra

def main():
    try:
        in_file = sys.argv[1]
    except IndexError:
        print "Not enough arguments"
        sys.exit()

    out_file = "../maps/converted/" + in_file.split("/")[-1]
    model_file = "/Users/zaking/models/iJO1366.pickle"
        
    with open(in_file, 'r') as f: data = json.load(f)
    with open(model_file, 'r') as f: model = load(f)

    # map data
    out = {}
    out['info'] = {'max_map_w': data['max_map_w'],
                   'max_map_h': data['max_map_h']}
    out['reactions'] = {}
    
    # locate all the metabolites in the old map
    metabolite_centers = []
    for metabolite_path in data["metabolite_paths"]:
        center = path_center(metabolite_path["d"])
        compartment, name = parse_met_id(metabolite_path["id"])
        match = False
        for metabolite in model.metabolites:
            if metabolite.name==name and metabolite.compartment==compartment:
                metabolite_centers.append((metabolite.id, center))
                match = True
                continue
        if not match:
            print 'no match: %s, %s' % (name, compartment)
    print 'Found %d of %d metabolite_paths.' % \
      (len(metabolite_centers), len(data["metabolite_paths"]))

    # locate all reactions in the old map
    for reaction_path in data['reaction_paths']:
        # find the matching cobra reaction
        the_id = reaction_path['id']
        # misspelling in iJO1366:
        the_id = the_id.replace("2-Oxoglutarate dehydrogenase", "2-Oxogluterate dehydrogenase")
        try:
            r = model.reactions.get_by_id(the_id.replace("-", "__"))
        except KeyError:
            try:
                r = [rxn for rxn in model.reactions if rxn.name==the_id][0]
            except IndexError:
                continue

        path = reaction_path['d']
        # estimate reaction coordinates
        angle, absolute_center, _ = parse_path(path)
        new_reaction = { "metabolites": {},
                         "coords": absolute_center,
                         "angle": angle }
        for k, v in r._metabolites.iteritems():
            # find the most likely metabolite, or return None
            absolute_met_center = find_metabolite_center(str(k),
                                                         absolute_center,
                                                         metabolite_centers)
            if absolute_met_center is not None:
                start, b1, b2, end, circle = beziers(absolute_center,
                                                     absolute_met_center,
                                                     angle)
            else:
                start = None; b1 = None; b2 = None;
                end = None; circle = None
            the_met = { "coefficient": v,
                        "reaction_id": str(k),
                        "text_dis": {"x": 0, "y": -18},
                        "circle": circle,
                        "b1": b1,
                        "b2": b2,
                        "start": start,
                        "end": end }
                       # these are redundant/optional:
                       # "is_primary": None, 
                       # "index": None,
                       # "count": None }
            new_reaction["metabolites"][str(k)] = the_met
        out['reactions'][r.id] = new_reaction

    print 'Found %d of %d reaction_paths.' % \
      (len(out['reactions']), len(data["reaction_paths"]))

    with open(out_file, 'w') as f: json.dump(out, f)
      
    print 'done'

def beziers(reaction_center, met_center, angle):
    """ Adapted from visbio:
    
    js.metabolic_map.utils.calculate_new_metabolite_coordinates

    Finds beziers for a metabolite arrow that starts at center, ends
    at met_center, and follows the angle.
    
    """
    
    # Curve parameters
    b1_strength = 0.5
    b2_strength = 0.2
    gap = 20 # gap between arrow end and metabolite
        
    # Define line parameters and axis.
    start = reaction_center
    circle = met_center
    end = displace_along_angle(start, circle, -gap)
    angle_b = angle_between(start, end)   # between -pi and pi
    
    # print '%.3f, %.3f' % (angle_b, angle)
    # determine the angle direction
    angle_diff = abs(angle_b - angle)
    if angle_diff > pi/2:
        if angle > 0:
            angle = angle - pi
        else:
            angle = angle + pi
        # print 'new angle: %g' % angle
        # print 'diff: %g' % abs(angle_b-angle)
                        
    # Beziers
    dis = distance(reaction_center, met_center)
    b1 = { 'x': start['x'] + (dis * cos(angle) * b1_strength),
           'y': start['y'] + (dis * sin(angle) * b1_strength) }
    b2 = { 'x': start['x'] + (dis * cos(angle_b) * (1-b2_strength)),
           'y': start['y'] + (dis * sin(angle_b) * (1-b2_strength)) }
    return start, b1, b2, end, circle
    
def find_metabolite_center(met_id, reaction_coords, met_centers):
    """ Find absolute coords for closest matching metabolite to reaction.
    """
    d = inf; closest = None
    for c_id, c_center in met_centers:
        if c_id == met_id:
            new_distance = distance(reaction_coords, c_center)
            if new_distance < d:
                closest = c_center
                d = new_distance
    return closest
    
def parse_met_id(the_id):
    m = re.search(r'(.*)\[([a-z])\]', the_id)
    try:
        return m.group(2), m.group(1)
    except AttributeError:
        return "c", the_id

def parse_path(path):
    """ Returns:

    ( The angle of the reaction (without direction),
      The absolute center determined for the reaction,
      The farthest distance from the center to a metabolite )
          
    """
    all_coords = get_all_coords(path)
    x = [a["x"] for a in all_coords]
    y = [a["y"] for a in all_coords]
    # first find the center of the reaction in map coordinates
    absolute_center = {"x": mean(x), "y": mean(y)}
    # then find the angle using some tricky method
    slope, _, _, _, _ = stats.linregress(x, y)
    angle = atan(slope)
    # then find the max extent along that angle
    dis = max([distance(absolute_center, a) for a in all_coords])
    return (angle, absolute_center, dis)

def path_center(path):
    all_coords = get_all_coords(path)
    x = [a["x"] for a in all_coords]
    y = [a["y"] for a in all_coords]
    # first find the center of the reaction in map coordinates
    return {"x": mean(x), "y": mean(y)}    

def get_all_coords(path):
    reg = re.compile(r'[A-Z]+([0-9.\-]+)\s([0-9.\-]+)')
    return [{"x": float(m[0]), "y": float(m[1])} for m in reg.findall(path)]

def distance(p1, p2):
    return sqrt((p2["x"]-p1["x"])**2 + (p2["y"]-p1["y"])**2)

def displace_along_angle(st, end, length):
    """Return a point along the line from st to end, displaced
    by length from end.
    """
    n = {}
    hyp = distance(st, end)
    n['x'] = end['x'] + length * (end['x'] - st['x']) / hyp
    n['y'] = end['y'] + length * (end['y'] - st['y']) / hyp
    return n

def angle_between(st, end):
    return atan((end['y'] - st['y']) / (end['x'] - st['x']))

if __name__ == '__main__':
        main()
