from colorsys import hsv_to_rgb as _hsv_to_rgb
from os import path as _path
from re import compile as _compile

from bs4 import BeautifulSoup as _BS, Tag as _Tag
from lxml import etree

class _SVGsoup(_BS):
    NESTABLE_TAGS = {"g": "g"}
    SELF_CLOSING_TAGS = {"path": None, "rect": None, "circle": None}
    def __init__(self, infile):
        _BS.__init__(self, infile, ["lxml", "xml"])

maps_dir = _path.join(_path.split(_path.abspath(__file__))[0], "maps", "")

def default_color_map(value):
    rgb = _hsv_to_rgb(value, 1.0, 1.0)
    if value < 0.01:
        rgb = (0.3, 0.3, 0.3)
    elif value < 0.4:
        rgb = (0.4, rgb[1], rgb[2])
    return (int(255 * rgb[0]), int(255 * rgb[1]), int(255 * rgb[2]))

def import_raw_svg(raw_svg=maps_dir + "raw_svg/core.svg"):
    """parse an svg from the patched version of bigg and save it in the
    maps directory"""
    non_empty = _compile(".")
    with open(raw_svg) as infile:
        svg = _SVGsoup(infile)
    rxn_layer = svg.findChild(name="g", id="Layer_rxn")
    met_layer = svg.findChild(name="g", id="Layer_met")
    for svg_rxn in rxn_layer.findChildren(name="g", recursive=False):
        del(svg_rxn["stroke"])
        del(svg_rxn.a["xlink:href"])
        for path in svg_rxn.findChildren(name="path", attrs={"marker-end": non_empty}):
            del(path["marker-end"])
            path["class"] = "end"
        for path in svg_rxn.findChildren(name="path", attrs={"marker-start": non_empty}):
            del(path["marker-start"])
            path["class"] = "start"
    for met_rxn in met_layer.findChildren(name="g", recursive=False):
        del(met_rxn.a["xlink:href"])
    rxn_colors = _Tag(svg, name="style")
    rxn_colors["id"] = "object_styles"
    svg.defs.append(rxn_colors)
    # write the processed file out to the maps directory
    with open(maps_dir + _path.split(raw_svg)[1], "w") as outfile:
        outfile.write(str(svg))

class Map:
    def __init__(self, map_file="core.svg"):
        # do some magic to find the correct filepath
        if not _path.isfile(map_file):
            if _path.isfile(maps_dir + map_file):
                map_file = maps_dir + map_file
            elif _path.isfile(maps_dir + map_file + ".svg"):
                map_file = maps_dir + map_file + ".svg"
            else:
                raise IOError("map %s not found" % (map_file))
        with open(map_file) as infile:
            self.svg = _SVGsoup(infile)
        self._rxn_layer = self.svg.findChild(name="g", id="Layer_rxn")
        self._rxn_label_layer = self.svg.findChild(name="g", id="Layer_label_rxn")
        self.included_reactions = set(str(reaction["id"]) for reaction in self._rxn_layer.findChildren(name="g", recursive=False))
        self._svg_style = self.svg.findChild(name="style", id="object_styles")
        self.object_styles = {}
        # overload some dict attributes with those of object_styles
        # __setitem__ and update need some extra magic and are not included
        for i in ("__contains__", "__getitem__", "clear", "fromkeys", "get",
                "has_key", "items", "iteritems", "iterkeys", "keys", "pop",
                "popitem", "values", "viewitems", "viewkeys", "viewvalues"):
            setattr(self, i, getattr(self.object_styles, i))
    
    def apply_solution(self, flux_dict, color_map=default_color_map):
        self.object_styles.clear()
        fluxes = dict((i, flux_dict[i]) for i in self.included_reactions.intersection(flux_dict))
        abs_fluxes = [min(abs(i), 20) for i in fluxes.itervalues()]
        x_min = min(abs_fluxes)
        x_max = max(abs_fluxes)
        scale_func = lambda value: min(1, (abs(value) - x_min) / (x_max - x_min) * 3)
        for reaction, value in fluxes.iteritems():
            #t = _Tag(name="title")
            #t.string = "%.2f" % (value)
            self._rxn_layer.findChild("g", id=reaction).title.string += "\n%.2f" % (value)#append(t)
            try:
                t = _Tag(name="title")
                t.string = "%.2f" % (value)
                self._rxn_label_layer.findChild(name="text", text=_compile(reaction)).append(t)
            except: None
            if str(reaction) in self.included_reactions:
                self.set_object_color(str(reaction), color_map(scale_func(value)))
            if value < 0:
                self.object_styles["%s .end" % str(reaction)] = {"marker-end": "none"}
            if value > 0:
                self.object_styles["%s .start" % str(reaction)] = {"marker-start": "none"}
        for reaction in self.included_reactions.difference(flux_dict.keys()):
            self.set_object_color(reaction, (0, 0, 0))
        self._update_svg()
        return self
    
    def set_object_color(self, name, color):
        """set the color for an object with a given name.
        
        The color can either be a color string (i.e. "red" or "black") or a 
        tuple of either length 3 (rgb) or length 4 (rgba)"""
        if not isinstance(color, (str, unicode)):
            if len(color) == 3:
                tmp = color
                color = []
                color.extend(tmp)
                color.append(1)
            if len(color) == 4:
                color = "rgba" + str(tuple(color))
        if name not in self.object_styles:
            self.object_styles[name] = {}
        self.object_styles[name]["stroke"] = color
    
    def _update_svg(self):
        svg_styles = ""
        for object_name, style in self.object_styles.iteritems():
            #svg_colors += "#%s {stroke: %s;} " % (reaction, color)
            svg_styles += "#%s %s " % (object_name, str(style).replace("',", "';").replace("'", ""))
        self._svg_style.string = svg_styles
    
    def __setitem__(self, key, value):
        # if it is being set to a dict
        if hasattr(value, "keys"):
            self.object_styles[key] = value
        else:  # otherwise assume the color is being set
            self.set_object_color(key, value)
    
    def _repr_svg_(self):
        self._update_svg()
        return str(self.svg)

if __name__ == "__main__":
    # import urllib2
    # for savename, map_id in [("core.svg", 1576807), ("ecoli.svg", 1555394)]:
    #     #response = urllib2.urlopen("http://clostridium.ucsd.edu/bigg/showMap.pl?map=%d" % (map_id))
    #     with open(
    #     with open(maps_dir + "raw_svg/" + savename, "w") as outfile:
    #         outfile.write(response.read())
    # import_raw_svg(maps_dir + "raw_svg/ecoli.svg")
    # import_raw_svg(maps_dir + "raw_svg/core.svg")
    a = Map("core")
    #a["PGI"] = "red"
    #a.update()
    #print a._svg_rxn_colors
    
