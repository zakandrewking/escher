import json
import sys
import re
from numpy import mean
from scipy import stats
from math import atan, pi, sqrt, pow

def main():
    try:
        infile = sys.argv[1]
    except IndexError:
        print "Not enough arguments"
        sys.exit()

    with open(infile, 'r') as f: data = json.load(f)
    out = {}

    for reaction_path in data['reaction_paths']:
        the_id = reaction_path['id']
        path = reaction_path['d']
        angle, center, coords, dis, main_axis = parse_path(path)
        out[the_id] = { "metabolites": {},
                        "angle": angle,
                        "center": center,
                        "coords": coords,
                        "dis": dis,
                        "main_axis": main_axis }
        if the_id=="ME2":
            print out[the_id]
            print the_id
            return

    print 'done'

def parse_path(path):
    all_coords = get_all_coords(path)
    x = [a["x"] for a in all_coords]
    y = [a["y"] for a in all_coords]
    # first find the center of the reaction in map coordinates
    map_reaction_center = {"x": mean(x), "y": mean(y)}
    # then find the angle using some tricky method
    slope, _, _, _, _ = stats.linregress(x, y)
    angle = -atan(slope)+(pi/2)
    # then find the max extent along that angle
    dis = max([distance(map_reaction_center, a) for a in all_coords])
    # set the center and new coords based on these
    center = {"x": 0, "y": 0} # angle and distance/2
    coords = map_reaction_center # map_reaction_center - center
    main_axis = [{"x": 0, "y": 0}, {"x": 0, "y": 0}]   # calculate from dis to center * 2
    return (angle, center, coords, dis, main_axis)

def get_all_coords(path):
    reg = re.compile(r'[A-Z]+([0-9.\-]+)\s([0-9.\-]+)')
    return [{"x": float(m[0]), "y": float(m[1])} for m in reg.findall(path)]

def distance(p1, p2):
    return sqrt((p2["x"]-p1["x"])**2 + (p2["y"]-p1["y"])**2)

if __name__ == '__main__':
        main()
