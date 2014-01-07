from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
from urllib2 import urlopen
import json
import os
import appdirs

static_dir = join(abspath(dirname(__file__)), "static", "")
d3_filepath = join(static_dir, 'd3.v3.min.js')
map_js_filepath = join(static_dir, 'visbio_map.js')

ipython_html = """
<style>
.overlay {
  fill: none;
  pointer-events: all;
}
</style>
<button onclick="download_map('map%d')">Download svg</button>
<div id="map%d" style="height:800px;"></div>"""

map_download_url = "http://zakandrewking.github.io/visbio/maps/"
map_download_display_url = "http://zakandrewking.github.io/visbio/"

def get_maps_cache_dir():
    cache_dir = appdirs.user_cache_dir('visbio', appauthor="Zachary King")
    map_cache_dir = join(cache_dir, "map_cache", "")
    try:
        os.makedirs(map_cache_dir)
    except OSError:
        pass
    return map_cache_dir

def get_style():
    with open(join(static_dir, 'map.css')) as infile:
        style = infile.read().replace("\n", " ")
    return style

class Map(object):
    """Viewable metabolic map
    
    This map will also show metabolic fluxes passed in during consruction.
    It can be viewed as a standalone html inside a browswer. Alternately,
    the respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a map_cache directory.
    Maps which are not found will be downloaded from a map repository if
    found.
    """
    def __init__(self, map_name="e-coli-core", flux={}):
        if map_name.endswith(".json"):
            warn("Map file name should not include .json")
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
        self.flux = flux

    def _repr_html_(self):
        from random import randint
        n = randint(1, 1000000)
        javascript = """<script type="text/Javascript">
            %s
            selection = d3.select("#map%d");
            selection[0][0].style["width"] = window.innerWidth * 0.7 + "px";
            visBioMap.visualizeit(selection, map_data, style, flux, null, null, null);
        </script>""" % (self._assemble_javascript(), n)
        return (ipython_html % (n, n)) + javascript


    def _assemble_javascript(self):
        with open(d3_filepath, 'r') as f:
            d3 = f.read()
        with open(map_js_filepath, 'r') as f:
            map_js = f.read()
        javascript = "\n".join([
            "var " + d3, map_js,
            "var map_data = %s;" % self.map_json,
            "var flux = %s;" % json.dumps(self.flux),
            'var style = "%s";' % get_style()])
        return javascript

    def create_standalone_html(self, outfilepath=None):
        """saves an html file containing the map"""
        with open(join(static_dir, "standalone_map_template.html")) as infile:
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
    
    
    def view_browser(self):
        """launches a webpage with the map open"""
        import webbrowser
        webbrowser.open("file://" + self.create_standalone_html())


    #def run_server(self):
    #    """start a tornado server to display the map"""
    #    None  # TODO implement
