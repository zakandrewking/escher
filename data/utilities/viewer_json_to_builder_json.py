import json
import sys
import re
from numpy import mean, inf
from scipy import stats
from math import atan, pi, sqrt, pow, sin, cos, atan2
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
    out['membranes'] = data['membrane_rectangles']
    out['reactions'] = {}
    
    # locate all the metabolites in the old map
    metabolite_centers = []
    for metabolite_path in data["metabolite_paths"]:
        center = path_center(metabolite_path["d"])
        compartment, name = parse_met_id(metabolite_path["id"])
        radius = 10             # TODO calculate the radius from the path
        match = False
        for metabolite in model.metabolites:
            if metabolite.name==name and metabolite.compartment==compartment:
                metabolite_centers.append((metabolite.id, center, radius))
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
            absolute_met_center, radius = find_metabolite_center(str(k),
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
                        "start": start,
                        "b1": b1,
                        "b2": b2,
                        "end": end,
                        "circle": circle,
                        "r": radius }
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
    at met_center, and follows the angle. Returns relative coords.
    
    """
    
    # Curve parameters
    b1_strength = 0.7
    b2_strength = 0.2
    gap = 35 # gap between arrow end and metabolite
        
    # Define line parameters and axis.
    start = {'x': 0, 'y': 0}
    circle = c_minus_c(met_center, reaction_center)
    end = displace_along_angle(start, circle, -gap)
    angle_b = angle_between(start, end)   # between -pi and pi
    
    # determine the angle direction
    min_angle_diff = abs(angle_b - angle)
    if min_angle_diff > pi/2:
        for m in [-2*pi, -pi, pi, 2*pi]:
            new_angle = angle + m
            if abs(angle_b - new_angle) < min_angle_diff:
                angle = new_angle
                min_angle_diff = abs(angle_b - angle)
                        
    # Beziers
    dis = distance(start, end)
    # print 'dis: %.4g' % dis
    # print 'angle: %.4g' % angle
    # print 'angle_b: %.4g' % angle_b
    b1 = { 'x': (dis * cos(angle) * b1_strength),
           'y': (dis * sin(angle) * b1_strength) }
    b2 = { 'x': (dis * cos(angle_b) * (1-b2_strength)),
           'y': (dis * sin(angle_b) * (1-b2_strength)) }
    return start, b1, b2, end, circle
    
def find_metabolite_center(met_id, reaction_coords, met_centers):
    """ Find absolute coords for closest matching metabolite to reaction.
    """
    d = inf; closest = None; radius = None
    for c_id, c_center, c_radius in met_centers:
        if c_id == met_id:
            new_distance = distance(reaction_coords, c_center)
            if new_distance < d:
                closest = c_center
                radius = c_radius
                d = new_distance
    return closest, radius
    
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
    x = [a-min(x) for a in x]
    y = [a-min(y) for a in y]
    slope, _, _, _, stderr = stats.linregress(x, y)
    slope_rev, _, _, _, stderr_rev = stats.linregress(y, x)
    if stderr <= stderr_rev:
        angle = atan(slope)
    else:
        angle = atan(slope_rev) + pi/2
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
    reg = re.compile(r'[A-Z]?([0-9.\-]+)\s([0-9.\-]+)')
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
    return atan2((end['y'] - st['y']), (end['x'] - st['x']))

def c_minus_c(coords1, coords2):
    return { "x": coords1['x'] - coords2['x'],
             "y": coords1['y'] - coords2['y'] }
    
if __name__ == '__main__':
        main()
