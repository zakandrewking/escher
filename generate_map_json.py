from bs4 import BeautifulSoup as bs
import json
from sys import argv

if len(argv) > 1:
    map_filename = argv[1]
else:
    map_filename = "ecoli.svg"

with open("maps/" + map_filename) as file:
    map = bs(file)

svg = map.find("svg")
data = {}

membrane_rectangles = []
for g in svg.find(id="Layer_base").find("g").find_all("g"):
    r = g.find("rect")
    this_membrane = {"height":r.attrs["height"],
                     "width":r.attrs["width"],
                     "x":r.attrs["x"],
                     "y":r.attrs["y"]}
    membrane_rectangles.append(this_membrane)
data["membrane_rectangles"] = membrane_rectangles

misc_labels = []
for g in svg.find(id="Layer_text").find("g").find_all("g"):
    text = g.find("text")
    this_text = {"style": g.attrs["style"].strip(),
                 "x": text.attrs["x"],
                 "y": text.attrs["y"],
                 "text": text.text}
    misc_labels.append(this_text)
data["misc_labels"] = misc_labels

reaction_paths = []
for g in svg.find(id="Layer_rxn").find_all("g"):
    for h in g.find_all("path"):
        this_path = {"title": g.find("title").text,
                     "id": g.attrs["id"],
                     "d": h.attrs["d"],
                     "class": h.attrs.get("class",None)}
        try:
            this_path["class"] = this_path["class"][0]
        except:
            pass
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
                   "style": g.attrs.get("style",None),
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

# convert to json representation
filename = 'map.json'
with open(filename, 'w') as file:
    json_map = json.dump(data, file)

# flux = {'GAPD': '100'};
# filename = 'flux.json';
# with open(filename, 'w') as file:
#     json_map = json.dump(flux, file)
