# -*- coding: utf-8 -*-

from quick_server import serve_and_open
import urls

from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
from urllib2 import urlopen, HTTPError
import json
import os
import appdirs
import re
from jinja2 import Environment, PackageLoader, Template
import codecs
import random
import string
        
# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def get_maps_cache_dir():
    cache_dir = appdirs.user_cache_dir('escher', appauthor="Zachary King")
    map_cache_dir = join(cache_dir, "map_cache", "")
    try:
        os.makedirs(map_cache_dir)
    except OSError:
        pass
    return map_cache_dir

def get_an_id():
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(10))

class Plot(object):
    def standalone_html(self):
        raise NotImplemented()
    def embed_html(self):
        raise NotImplemented()
    
    def display_in_notebook(self):
        """Display the plot in the notebook.

        """
        # import here, in case users don't have requirements installed
        from IPython.display import HTML
        import matplotlib.pyplot as plt
        return HTML(self.embedded_html())

    def display_in_browser(self, ip='127.0.0.1', port=7655, n_retries=50):
        """Launch a web browser to view the map.

        """
        html = self.standalone_html()
        serve_and_open(html, ip=ip, port=port, n_retries=n_retries)

    def save_html(self, filepath=None):
        """Save an html file containing the map.

        """
        html = self.standalone_html()
        if filepath is not None:
            with codeds.open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            return filepath
        else:
            from tempfile import mkstemp
            from os import write, close
            os_file, filename = mkstemp(suffix=".html")
            write(os_file, unicode(html).encode('utf-8'))
            close(os_file)
            return filename
    
class Builder(Plot):
    """Viewable metabolic map.
    
    This map will also show metabolic fluxes passed in during consruction.  It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a map_cache directory. Maps
    which are not found will be downloaded from a map repository if found.
    
    """
    def __init__(self, map_name=None, reaction_data=None, metabolite_data=None,
                 height=800, always_make_standalone=False, **kwargs):
        self.map_name = map_name
        if map_name:
            self.load_map()
        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.height = height
        self.always_make_standalone = always_make_standalone
        self.map_json = None
        self.options = kwargs

    def load_map(self):
        map_name = self.map_name
        if map_name is None: return
        
        map_name = map_name.replace(".json", "")

        # if the file is not present attempt to download
        maps_cache_dir = get_maps_cache_dir()
        map_filename = join(maps_cache_dir, map_name + ".json")
        if not isfile(map_filename):
            map_not_cached = 'Map "%s" not in cache. Attempting download from %s' % \
                (map_name, urls.escher_home)
            warn(map_not_cached)
            try:
                download = urlopen(urls.map_download + map_name + ".json")
                with open(map_filename, "w") as outfile:
                    outfile.write(download.read())
            except HTTPError:
                raise ValueError("No map named %s found in cache or at %s" % \
                                     (map_name, urls.escher_home))
        with open(map_filename) as f:
            self.map_json = f.read()
    
    def _initialize_javascript(self):
        javascript = u"\n".join([u"var map_data = %s;" % (self.map_json if self.map_json else u'{}'),
                                 u"var reaction_data = %s;" % json.dumps(self.reaction_data),
                                 u"var metabolite_data = %s;" % json.dumps(self.metabolite_data),
                                 u"var css_string = '%s';" % self._embed_style()])
        return javascript

    def _options_string(self):
        return ' '.join(",\n %s: '%s'"%(k,v) for k,v in self.options.iteritems())
    
    def _draw_js(self, the_id):
        draw = """escher.Builder({ selection: d3.select('#%s'),
		                   map_data: map_data,
		                   flux: reaction_data,
		                   node_data: metabolite_data,
		                   css: css_string%s });
        """ % (the_id, self._options_string())
        return draw

    def _draw_js_dev(self, the_id):
        draw = """require(["Builder"], function(Builder) {
                      Builder({  selection: d3.select('#%s'),
                                 debug: true%s });
                  });
        """ % (the_id, self._options_string())
        return draw


    def _embed_style(self):
        download = urlopen(urls.builder_embed_css)
        return unicode(download.read().replace('\n', ' '))
    
    def _get_html(self, dev=False, wrapper=False):
        an_id = unicode(get_an_id())
        if dev:
            content = env.get_template('dev_content.html')
            html = content.render(id=an_id,
                                  height=unicode(self.height),
                                  css_path=urls.builder_css_local,
                                  draw_js=self._draw_js_dev(an_id),
                                  d3_url=urls.d3,
                                  wrapper=wrapper)
        else:
            content = env.get_template('content.html')
            html = content.render(id=an_id,
                                  height=unicode(self.height),
                                  css_path=urls.builder_css,
                                  initialize_js=self._initialize_javascript(),
                                  draw_js=self._draw_js(an_id),
                                  d3_url=urls.d3,
                                  escher_url=urls.escher,
                                  wrapper=wrapper)
        return html

    def embedded_html(self, dev=False):
        return self._get_html(dev=dev, wrapper=False)
    
    def standalone_html(self, dev=False):
        return self._get_html(dev=dev, wrapper=True)
