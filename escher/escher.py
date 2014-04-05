# -*- coding: utf-8 -*-

from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
from urllib2 import urlopen, HTTPError
import json
import os
import appdirs
import escher
import re
from jinja2 import Environment, PackageLoader, Template
import codecs
import random
import string
        
# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

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

def get_an_id():
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(10))

def get_embed_style():
    download = urlopen('https://raw.githubusercontent.com/zakandrewking/escher/master/css/builder-embed.css')
    return download.read().replace('\n', ' ')

class Link(object):
    def __init__(self, address, text):
        self.address = address
        self.text = text

    def _repr_html_(self):
        return '<a href="%s" target="_blank">%s</a>' % (self.address, self.text)

class Builder(object):
    """Viewable metabolic map.
    
    This map will also show metabolic fluxes passed in during consruction.  It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a map_cache directory. Maps
    which are not found will be downloaded from a map repository if found.
    
    """
    def __init__(self, map_name=None, reaction_data=None, metabolite_data=None,
                 height=800, always_make_standalone=False):
        self.map_name = map_name
        if map_name:
            self.load_map()
        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.height = height
        self.always_make_standalone = always_make_standalone
        self.map_json = None

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
            try:
                download = urlopen(map_download_url + map_name + ".json")
                with open(map_filename, "w") as outfile:
                    outfile.write(download.read())
            except HTTPError:
                raise ValueError("No map named %s found in cache or at %s" % \
                                     (map_name, map_download_display_url))
        with open(map_filename) as f:
            self.map_json = f.read()

    def _assemble_content(self):
        content = env.get_template('builder_content.html')
        html = content.render(id=unicode(get_an_id()),
                              height=u"%d"%self.height,
                              javascript=self._assemble_javascript(),
                              css_embed=get_embed_style())
        return html
    
    def _assemble_javascript(self):
        javascript = u"\n".join([u"var map_data = %s;" % (self.map_json if self.map_json else u'{}'),
                                 u"var reaction_data = %s;" % json.dumps(self.reaction_data),
                                 u"var metabolite_data = %s;" % json.dumps(self.metabolite_data)])
        return javascript

    def _repr_html_(self):
        content = self._assemble_content()
        if (self.always_make_standalone):
            link = (u'<a href="%s" target="_blank">Open standalone map</a>' %
                    self.create_standalone_html())
            content = u" ".join(link, content)
        return content

    def create_standalone_html(self, filepath=None):
        """Save an html file containing the map.

        """
        template = env.get_template('standalone.html')
        variables = {'title': u'Builder',
                     'content': self._assemble_content()};
        filled = template.render(variables)
        
        if filepath is not None:
            with codeds.open(filepath, 'w', encoding='utf-8') as f:
                f.write(filled)
            return filepath
        else:
            from tempfile import mkstemp
            from os import write, close
            os_file, filename = mkstemp(suffix=".html")
            write(os_file, unicode(filled).encode('utf-8'))
            close(os_file)
            return filename
    
    def view_in_browser(self):
        """Launch a web browser to view the map.

        """
        import webbrowser
        webbrowser.open("file://" + self.create_standalone_html())
