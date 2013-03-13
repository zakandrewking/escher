from bs4 import BeautifulSoup as bs
import json, re
from optparse import OptionParser

# parse options
parser = OptionParser()
parser.add_option("-f", "--format", dest="format",
                  help="choose BIGG or SimPheny formats",
                  default="bigg")
(options, args) = parser.parse_args()

if len(args) < 1:
    raise Exception("Must include map filename")
    
map_filename = args[0]
with open(map_filename) as file:
    map = bs(file)

name_id_dictionary = {}
with open('reaction_name_to_id.tsv', 'rU') as file:
    for line in file.readlines():
        s = [x.strip() for x in line.split('\t')]
        name_id_dictionary[s[0]] = s[1]

def reaction_name_to_id(name):
    # SimPheny attached reaction names to reaction paths, rather than
    # the more-sensible id's. Thus, we load a conversion table
    try:
        the_id = name_id_dictionary[name]
    except KeyError:
        the_id = name
    return the_id
    
def save_as_json(data, svg):
    max_x = 0; max_y = 0
    for x in svg.find_all(x=True):
        val = float(x.attrs["x"])
        if val > max_x:
            max_x = val
    for y in svg.find_all(y=True):
        val = float(y.attrs["y"])
        if val > max_y:
            max_y = val
    data["max_map_w"] = max_x*1.05
    data["max_map_h"] = max_y*1.05
    print max_x
    print max_y

    # convert to json representation
    filename = 'map.json'
    with open(filename, 'w') as file:
        json_map = json.dump(data, file)


def read_simpheny(map):
    svg = map.find('svg')
    data = {}

    membrane_rectangles = []
    for g in svg.find(id='Layer_0').children:
        r = g.find('rect')
        try:
            this_membrane = {'height':r.attrs['height'],
                             'width':r.attrs['width'],
                             'x':r.attrs['x'],
                             'y':r.attrs['y']}
        except AttributeError:
            continue
        membrane_rectangles.append(this_membrane)
    data["membrane_rectangles"] = membrane_rectangles

    # in Layer_0:?
    # <g id="succinate transport via diffusion (extracellular to periplasm)" style="color-interpolation:auto;color-rendering:auto;fill:black;fill-opacity:1;font-family:sans-serif;font-size:12;font-style:normal;font-weight:normal;image-rendering:auto;shape-rendering:auto;stroke:black;stroke-dasharray:none;stroke-dashoffset:0;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;text-rendering:auto"><g style="fill:rgb(170,170,255);stroke:rgb(170,170,255)"><path d="M5346.07421875 3115.5 L5346.07421875 3122.5 L5459.07421875 3122.5 L5459.07421875 3115.5 Z" style="stroke:none"></path></g><g style="fill:rgb(0,0,64);stroke:rgb(0,0,64);stroke-linecap:round;stroke-linejoin:round"><path d="M5346.07421875 3115.5 L5346.07421875 3122.5 L5459.07421875 3122.5 L5459.07421875 3115.5 Z" style="fill:none"></path></g><g style="fill:rgb(170,170,255);stroke:rgb(170,170,255)"><path d="M5471.07421875 3119 L5456.07421875 3126 L5456.07421875 3112 ZM5334.07421875 3119 L5349.07421875 3126 L5349.07421875 3112 Z" style="stroke:none"></path></g><g style="fill:rgb(0,0,64);stroke:rgb(0,0,64)"><path d="M5471.07421875 3119 L5456.07421875 3126 L5456.07421875 3112 ZM5334.07421875 3119 L5349.07421875 3126 L5349.07421875 3112 Z" style="fill:none"></path></g></g>
    
    reaction_paths = []
    for g in svg.find(id="Layer_5").children:
        for h in g.find_all('path'):
            this_path = {'name': g.attrs['id'],
                         'id': reaction_name_to_id(g.attrs['id']),
                         'd': h.attrs['d'],
                         'class': 'fill-arrow'} 
            reaction_paths.append(this_path)
    data["reaction_paths"] = reaction_paths
    
    misc_labels = []
    for t in svg.find(id="Layer_7").find_all("text"): 
        this_text = {"text":t.text,
                     "x":t.attrs["x"],
                     "y":t.attrs["y"]}
        try:
            this_text['transform'] = t.attrs['transform'];
        except KeyError:
            pass    
        misc_labels.append(this_text)
    for t in svg.find(id="Layer_8").find_all("text"):  # in all-rxns, this contains misc labels
        this_text = {"text":t.text,
                     "x":t.attrs["x"],
                     "y":t.attrs["y"]}
        try:
            this_text['transform'] = t.attrs['transform'];
        except KeyError:
            pass    
        misc_labels.append(this_text)
    data["misc_labels"] = misc_labels

    metabolite_paths = []; reaction_labels = []
    for g in svg.find(id="Layer_10").children:
        for h in g.find_all('path'):
            this_path = {'id': g.attrs['id'],
                         'd': h.attrs['d']}
            metabolite_paths.append(this_path)
    data["metabolite_paths"] = metabolite_paths
    
    metabolite_labels = []
    for t in svg.find(id="Layer_13").find_all('text'): # in all-rxns, this also contains reaction labels
        this_label = {'text': t.text,
                      'x': t.attrs['x'],
                      'y': t.attrs['y']}
        if t.text in name_id_dictionary.values():
            reaction_labels.append(this_label)
        else:
            metabolite_labels.append(this_label)
    data["reaction_labels"] = reaction_labels
    data["metabolite_labels"] = metabolite_labels

    save_as_json(data, svg)

def read_bigg(map):
    
    svg = map.find('svg')
    data = {}

    membrane_rectangles = []
    for g in svg.find(id="Layer_base").find('g').find_all('g'):
        r = g.find('rect')
        # remove fill from line style
        this_membrane = {'height':r.attrs['height'],
                         'width':r.attrs['width'],
                         'x':r.attrs['x'],
                         'y':r.attrs['y'],
                         'style':"fill:none;" +
                           re.sub(r"fill:[\sA-Za-z0-9\(\),]+;\s", "", g.attrs['style']) }
        membrane_rectangles.append(this_membrane)
    data["membrane_rectangles"] = membrane_rectangles

    misc_labels = []
    for g in svg.find(id="Layer_text").find("g").find_all("g"):
        text = g.find("text")
        this_text = {"x": text.attrs["x"],
                     "y": text.attrs["y"],
                     "text": text.text}
        misc_labels.append(this_text)
    data["misc_labels"] = misc_labels

    reaction_paths = []
    for g in svg.find(id="Layer_rxn").find_all("g"):
        for h in g.find_all("path"):
            this_path = {"title": g.find("title").text,
                         "id": g.attrs["id"],
                         "d": h.attrs["d"]};
            bc = "line-arrow"
            if h.attrs.has_key("marker-end"):
                bc = bc + " end";
            if h.attrs.has_key("marker-start"):
                bc = bc + " start";
            try:
                a = h.attrs["class"]
                a.append(bc)
                this_path["class"] = ' '.join(a)
            except KeyError:
                this_path["class"] = bc
            reaction_paths.append(this_path)
    data["reaction_paths"] = reaction_paths

    reaction_labels = []
    for t in svg.find(id="Layer_label_rxn").find_all("text"):
        this_text = {"text":t.text,
                     "x":t.attrs["x"],
                     "y":t.attrs["y"]}
        reaction_labels.append(this_text)
    data["reaction_labels"] = reaction_labels

    metabolite_circles = []
    for g in svg.find(id="Layer_met").find_all("g"):
        c = g.find("circle")
        this_circle = {"id": g.attrs.get("id",None),
                       "cx": c.attrs["cx"],
                       "cy": c.attrs["cy"],
                       "r": c.attrs["r"]}
        metabolite_circles.append(this_circle)
    data["metabolite_circles"] = metabolite_circles

    metabolite_labels = []
    for t in svg.find(id="Layer_label_met").find_all("text"):
        this_label = {"text": t.text,
                      "x": t.attrs["x"],
                      "y": t.attrs["y"]}
        metabolite_labels.append(this_label)
    data["metabolite_labels"] = metabolite_labels

    save_as_json(data, svg)
    

# GO!!
if options.format.lower()=="bigg":
    read_bigg(map)
elif options.format.lower()=="simpheny":
    read_simpheny(map)
else:
    raise Exception("invalid format option")
