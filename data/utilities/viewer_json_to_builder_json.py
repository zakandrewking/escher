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
    out = {}

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
    out = []
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
        angle, center, coords, dis, main_axis, abs_center = parse_path(path)
        new_reaction = { "metabolites": {},
                         "center": center,
                         "coords": coords,
                         "angle": angle, # these are redundant
                         "dis": None, 
                         "main_axis": None }
        for k, v in r._metabolites.iteritems():
            center = find_likely_metabolite_center(str(k), abs_center, metabolite_centers)
            if center is not None:
                center_rel = {"x": center["x"] - coords["x"],
                              "y": center["y"] - coords["y"]}
                start, b1, b2, end = beziers(center, center_rel)
            else:
                center_rel = None
                b1 = None; b2 = None
            the_met = { "coefficient": v,
                        "reaction_id": str(k),
                        "text_dis": {"x": 0, "y": -18},
                        "circle": center_rel,
                        "b1": None,
                        "b2": None,
                        "start": start,
                        "end": end }
                       # these are redundant/optional:
                       # "is_primary": None, 
                       # "center": None, # exact coordinates when desirable
                       # "start": None,
                       # "end": None,
                       # "flux": None,
                       # "index": None,
                       # "count": None, 
                       # "index": None }
            new_reaction["metabolites"][str(k)] = the_met
        out.append((r.id, new_reaction))

    print 'Found %d of %d reaction_paths.' % \
      (len(out), len(data["reaction_paths"]))

    with open(out_file, 'w') as f: json.dump(out, f)
      
    print 'done'

def beziers(reaction_center, met_center):
    start = reaction_center
    b1_strength = 0.5
    b2_strength = 0.2
    return start, b1, b2, end
    
def find_likely_metabolite_center(met_id, reaction_coords, met_centers):
    """ Find closest metabolite to reaction.
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
    all_coords = get_all_coords(path)
    x = [a["x"] for a in all_coords]
    y = [a["y"] for a in all_coords]
    # first find the center of the reaction in map coordinates
    map_reaction_center = {"x": mean(x), "y": mean(y)}
    # then find the angle using some tricky method
    slope, _, _, _, _ = stats.linregress(x, y)
    angle = atan(slope)
    # then find the max extent along that angle
    dis = max([distance(map_reaction_center, a) for a in all_coords])
    # set the center and new coords based on these
    center = {"x": dis/2*cos(angle), "y": dis/2*sin(angle)} # angle and distance/2
    coords = {"x": map_reaction_center["x"] - center["x"],
              "y": map_reaction_center["y"] - center["y"]} # map_reaction_center - center
    main_axis = [{"x": 0, "y": 0}, {"x": center["x"]*2, "y": center["y"]*2}]   # calculate from dis to center * 2
    return (angle, center, coords, dis, main_axis, map_reaction_center)

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

if __name__ == '__main__':
        main()
