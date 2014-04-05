from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
from urllib2 import urlopen
import json
import os
import appdirs
import escher
import re
from uuid import uuid4
from jinja2 import Environment, PackageLoader

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

# find the necessary files for embedding
this_dir = abspath(dirname(__file__))
js_dir = join(this_dir, "js")
css_dir = join(this_dir, "css")
template_dir = join(this_dir, "templates")
for path in os.listdir(js_dir):
    if re.match(r'd3.*.js', path):
        d3_filepath = join(js_dir, path)
    elif re.match(r'escher.*.min.js', path):
        escher_min_filepath = join(js_dir, path)
    elif re.match(r'escher.*.js', path):
        escher_filepath = join(js_dir, path)

map_download_url = "http://zakandrewking.github.io/escher/maps/v0.4/"
map_download_display_url = "http://zakandrewking.github.io/escher/"

def get_maps_cache_dir():
    cache_dir = appdirs.user_cache_dir('escher', appauthor="Zachary King")
    map_cache_dir = join(cache_dir, "map_cache", "")
    try:
        os.makedirs(map_cache_dir)
    except OSError:
        pass
    return map_cache_dir

def get_style():
    with open(join(css_dir, 'builder.css')) as infile:
        style = infile.read().replace("\n", " ")
    return style

class Builder(object):
    """Viewable metabolic map.
    
    This map will also show metabolic fluxes passed in during consruction.  It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a map_cache directory. Maps
    which are not found will be downloaded from a map repository if found.
    
    """
    def __init__(self, map_name=None, reaction_data=None, metabolite_data=None,
                 height=800):
        self.map_name = map_name
        if map_name:
            self.load_map()
        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.height = height

    def load_map(self):
        map_name = self.map_name
        if map_name is None: return
        
        map_name = map_name.replace(".json", "")

        # if the file is not present attempt to download
        maps_cache_dir = get_maps_cache_dir()
        map_filename = join(maps_cache_dir, map_name + ".json")
        if not isfile(map_filename):
            map_not_cached = 'Map "%s" not in cache. Attempting download from %s' % \
                (map_name, map_download_display_url)
            warn(map_not_cached)
            from urllib2 import urlopen, HTTPError
            try:
                download = urlopen(map_download_url + map_name + ".json")
                with open(map_filename, "w") as outfile:
                    outfile.write(download.read())
            except HTTPError:
                raise ValueError("No map named %s found in cache or at %s" % \
                                     (map_name, map_download_display_url))
        with open(map_filename) as f:
            self.map_json = f.read()

    def _repr_html_(self):
        n = uuid4()
        html = """
            <button onclick="download_map('%s')">Download svg</button>
            <div id="%s" style="height:%dpx;"></div>
            %s
            <script>
                escher.Builder({ selection: d3.select('#%s') });
            </script>
        """ % (n, n, self.height, self._assemble_javascript(), n)
        return html

    def _assemble_javascript(self):
        with open(d3_filepath, 'r') as f:
            d3 = f.read()
        with open(escher_min_filepath, 'r') as f:
            escher_min_js = f.read()
        javascript = " ".join([d3, escher_min_js,
                               "var map_data = %s;" % self.map_json if self.map_json else '{}',
                               "var flux = %s;" % json.dumps(self.flux)])
        return javascript

    def create_standalone_html(self, filepath=None):
        """Save an html file containing the map.

        """
        with open(join(template_dir, "builder.html")) as infile:
            template = infile.read()
        template = template.replace("__ALL_JAVASCRIPT__", self._assemble_javascript())
        if outfilepath is not None:
            with open(outfilepath, "w") as outfile:
                outfile.write(template)
            return outfilepath
        else:
            from tempfile import mkstemp
            from os import write, close
            os_file, filename = mkstemp(suffix=".html")
            write(os_file, template)
            close(os_file)
            return filename
    
    def view_in_browser(self):
        """Launch a web browser to view the map.

        """
        import webbrowser
        webbrowser.open("file://" + self.create_standalone_html())
