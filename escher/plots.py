# -*- coding: utf-8 -*-

from quick_server import serve_and_open
import urls

import os
from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
from urllib2 import urlopen, HTTPError, URLError
import json
import shutil
import appdirs
import re
from jinja2 import Environment, PackageLoader, Template
import codecs
import random
import string
        
# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def get_cache_dir(name=None):
    """ Get the cache dir as a string.

    name: an optional subdirectory within the cache

    """
    cache_dir = join(appdirs.user_cache_dir('escher', appauthor="Zachary King"))
    if name is not None:
        cache_dir = join(cache_dir, name)
    try:
        os.makedirs(cache_dir)
    except OSError:
        pass
    return cache_dir

def clear_cache():
    """Empty the contents of the cache directory."""
    cache_dir = get_cache_dir()
    for root, dirs, files in os.walk(cache_dir):
        for f in files:
            os.unlink(join(root, f))
        for d in dirs:
            shutil.rmtree(join(root, d))

def list_cached_maps():
    """Return a list of all cached maps."""
    try:
        return [x.replace('.json', '') for x in os.listdir(get_cache_dir(name='maps'))]
    except OSError:
        print 'No cached maps'
        return None

def list_cached_models():
    """Return a list of all cached models."""
    try:
        return [x.replace('.json', '') for x in os.listdir(get_cache_dir(name='models'))]
    except OSError:
        print 'No cached maps'
        return None
    
def get_an_id():
    return unicode(''.join(random.choice(string.ascii_lowercase)
                           for _ in range(10)))

def load_resource(resource, name, safe=False):
    """Load a resource that could be a file, URL, or json string."""
    # if it's a url, download it
    if resource.startswith('http://') or resource.startswith('https://'):
        try:
            download = urlopen(resource)
        except URLError as err:
            raise err
        else:
            return download.read()
    # if it's a filepath, load it
    if os.path.exists(resource):
        if (safe):
            raise Exception('Cannot load resource from file with safe mode enabled.')
        try:
            with open(resource, 'r') as f:
                loaded_resource = f.read()
            _ = json.loads(loaded_resource)
        except ValueError as err:
            raise ValueError('%s not a valid json file' % name)
        else:
            return loaded_resource
    # try to validate the json
    try:
        _ = json.loads(resource)
    except ValueError as err:
        raise ValueError('Could not load %s. Not valid json, url, or filepath' % name)
    else:
        return resource
    raise Exception('Could not load %s.' % name)

class Builder(object):
    """Viewable metabolic map.
    
    This map will also show metabolic fluxes passed in during consruction.  It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a cache directory. Maps
    which are not found will be downloaded from a map repository if found.

    Arguments
    ---------
    map_name: a string specifying a map to be downloaded from the Escher web server.
    
    map_json: a json string, or a file path to a json file, or a URL specifying
    a json file to be downloaded.

    model_name: a string specifying a model to be downloaded from the Escher web
    server.
    
    model_json: a json string, or a file path to a json file, or a URL
    specifying a json file to be downloaded.

    reaction_data: a dictionary with keys that correspond to reaction ids
    and values that will be mapped to reaction arrows and labels.

    reaction_data: a dictionary with keys that correspond to metabolite ids and
    values that will be mapped to metabolite nodes and labels.

    local_host: a hostname that will be used for any local files in dev
    mode. Defaults to the current host.
    
    safe: if True, then loading files from the filesytem is not allowed. This is
    to ensure the safety of using Builder with a web server.

    """
    def __init__(self, map_name=None, map_json=None, model_name=None,
                 model_json=None, reaction_data=None, metabolite_data=None,
                 local_host='', safe=False):
        self.safe = safe
        
        # load the map
        self.map_name = map_name
        self.map_json = map_json
        self.loaded_map_json = None
        if map_name and map_json:
            warn('map_json overrides map_name')
        self.load_map()
        # load the model
        self.model_name = model_name
        self.model_json = model_json
        self.loaded_model_json = None
        if model_name and model_json:
            warn('model_json overrides model_name')
        self.load_model()
        # set the args
        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.local_host = local_host.strip(os.sep)
        # make the unique id
        self.generate_id()

    def generate_id(self):
        self.the_id = get_an_id()
        
    def load_model(self):
        """Load the model from input model_json using load_resource, or, secondarily,
           from model_name.

        """
        model_json = self.model_json
        if model_json is not None:
            self.loaded_model_json = load_resource(self.model_json,
                                                   'model_json',
                                                   safe=self.safe)
        elif self.model_name is not None:
            # get the name
            model_name = self.model_name  
            model_name = model_name.replace(".json", "")
            # if the file is not present attempt to download
            cache_dir = get_cache_dir(name='models')
            model_filename = join(cache_dir, model_name + ".json")
            if not isfile(model_filename):
                model_not_cached = 'Model "%s" not in cache. Attempting download from %s' % \
                    (model_name, urls.escher_home)
                warn(model_not_cached)
                try:
                    url = urls.model_download + model_name + ".json"
                    download = urlopen(url)
                    with open(model_filename, "w") as outfile:
                        outfile.write(download.read())
                except HTTPError:
                    raise ValueError("No model named %s found in cache or at %s" % \
                                     (model_name, url))
            with open(model_filename) as f:
                self.loaded_model_json = f.read()
    
    def load_map(self):
        """Load the map from input map_json using load_resource, or, secondarily,
           from map_name.

        """
        map_json = self.map_json
        if map_json is not None:
            self.loaded_map_json = load_resource(self.map_json,
                                                 'map_json',
                                                 safe=self.safe)
        elif self.map_name is not None:
            # get the name
            map_name = self.map_name  
            map_name = map_name.replace(".json", "")
            # if the file is not present attempt to download
            cache_dir = get_cache_dir(name='maps')
            map_filename = join(cache_dir, map_name + ".json")
            if not isfile(map_filename):
                map_not_cached = 'Map "%s" not in cache. Attempting download from %s' % \
                    (map_name, urls.escher_home)
                warn(map_not_cached)
                try:
                    url = urls.map_download + map_name + ".json"
                    download = urlopen(url)
                    with open(map_filename, "w") as outfile:
                        outfile.write(download.read())
                except HTTPError:
                    raise ValueError("No map named %s found in cache or at %s" % \
                                     (map_name, url))
            with open(map_filename) as f:
                self.loaded_map_json = f.read()

    def _embedded_css(self, is_local):
        loc = (join(self.local_host, urls.builder_embed_css_local) if is_local else
               urls.builder_embed_css)
        download = urlopen(urls.builder_embed_css)
        return unicode(download.read().replace('\n', ' '))
    
    def _initialize_javascript(self, is_local):
        javascript = (u"var map_data_{the_id} = {map_data};"
                      u"var cobra_model_{the_id} = {cobra_model};"
                      u"var reaction_data_{the_id} = {reaction_data};"
                      u"var metabolite_data_{the_id} = {metabolite_data};"
                      u"var css_string_{the_id} = '{style}';").format(
                          the_id=self.the_id,
                          map_data=(self.loaded_map_json if self.loaded_map_json else
                                    u'null'),
                          cobra_model=(self.loaded_model_json if self.loaded_model_json else
                                       u'null'),
                          reaction_data=(json.dumps(self.reaction_data) if self.reaction_data else
                                         u'null'),
                          metabolite_data=(json.dumps(self.metabolite_data) if self.metabolite_data else
                                           u'null'),
                          style=self._embedded_css(is_local))
        return javascript

    def _draw_js(self, the_id, enable_editing, menu, enable_keys, dev,
                 fill_screen, scroll_behavior):
        draw = (u"Builder({{ selection: d3.select('#{the_id}'),"
                u"enable_editing: {enable_editing},"
                u"menu: {menu},"
                u"enable_keys: {enable_keys},"
                u"scroll_behavior: {scroll_behavior},"
                u"fill_screen: {fill_screen},"
                u"map: map_data_{the_id},"
                u"cobra_model: cobra_model_{the_id},"
                u"reaction_data: reaction_data_{the_id},"
		u"metabolite_data: metabolite_data_{the_id},"
                u"css: css_string_{the_id} }});").format(
                    the_id=the_id,
                    enable_editing=json.dumps(enable_editing),
                    menu=json.dumps(menu),
                    enable_keys=json.dumps(enable_keys),
                    scroll_behavior=json.dumps(scroll_behavior),
                    fill_screen=json.dumps(fill_screen))
        if not dev:
            draw = u'escher.%s' % draw
        return draw
    
    def _get_html(self, js_source='web', menu='none', scroll_behavior='pan',
                  html_wrapper=False, enable_editing=False, enable_keys=False,
                  minified_js=True, fill_screen=False, height='800px'):
        """Generate the Escher HTML.

        Arguments
        --------

        js_source: Can be one of the following:
            'web' - (Default) use js files from zakandrewking.github.io/escher.
            'local' - use compiled js files in the local escher installation. Works offline.
            'dev' - use the local, uncompiled development files. Works offline.

        menu: Menu bar options include:
            'none' - (Default) No menu or buttons.
            'zoom' - Just zoom buttons (does not require bootstrap).
            'all' - Menu and button bar (requires bootstrap).

        scroll_behavior: Scroll behavior options:
            'pan' - (Default) Pan the map.
            'zoom' - Zoom the map.
            'none' - No scroll events.

        minified_js: If True, use the minified version of js files. If
        js_source is 'dev', then this option is ignored.
            
        html_wrapper: If True, return a standalone html file.

        enable_editing: Enable the editing modes (build, rotate, etc.).

        enable_keys: Enable keyboard shortcuts.

        height: The height of the HTML container.

        """

        if js_source not in ['web', 'local', 'dev']:
            raise Exception('Bad value for js_source: %s' % js_source)

        if menu not in ['none', 'zoom', 'all']:
            raise Exception('Bad value for menu: %s' % menu)

        if scroll_behavior not in ['pan', 'zoom', 'none']:
            raise Exception('Bad value for scroll_behavior: %s' % scroll_behavior)
        
        content = env.get_template('content.html')

        # if height is not a string
        if type(height) is int:
            height = u"%dpx" % height
        elif type(height) is float:
            height = u"%fpx" % height
        elif type(height) is str:
            height = unicode(height)
            
        # set the proper urls 
        is_local = js_source=='local' or js_source=='dev'
        is_dev = js_source=='dev'
        d3_url = (join(self.local_host, urls.d3_local) if is_local else
                  urls.d3)
        escher_url = ("" if js_source=='dev' else
                      (join(self.local_host, urls.escher_min_local) if is_local and minified_js else
                       (join(self.local_host, urls.escher_local) if is_local else
                        (urls.escher_min if minified_js else
                         urls.escher))))
        jquery_url = ("" if not menu=='all' else
                      (join(self.local_host, urls.jquery_local) if is_local else
                       urls.jquery))
        boot_css_url = ("" if not menu=='all' else
                        (join(self.local_host, urls.boot_css_local) if is_local else 
                         urls.boot_css))
        boot_js_url = ("" if not menu=='all' else
                       (join(self.local_host, urls.boot_js_local) if is_local else
                        urls.boot_js))
        require_js_url = (urls.require_js_local if is_local else
                          urls.require_js)
        html = content.render(require_js=require_js_url,
                              id=self.the_id,
                              height=height,
                              escher_css=(join(self.local_host, urls.builder_css_local) if is_local else
                                          urls.builder_css),
                              dev=is_dev,
                              d3=d3_url,
                              escher=escher_url,
                              jquery=jquery_url,
                              boot_css=boot_css_url,
                              boot_js=boot_js_url,
                              wrapper=html_wrapper,
                              host=self.local_host,
                              initialize_js=self._initialize_javascript(is_local),
                              draw_js=self._draw_js(self.the_id, enable_editing,
                                                    menu, enable_keys,
                                                    is_dev, fill_screen, scroll_behavior),)
        return html

    def display_in_notebook(self, js_source='web', menu='zoom', scroll_behavior='none',
                            enable_editing=False, enable_keys=False, minified_js=True, 
                            height=500):
        """Display the plot in the notebook.

        Arguments
        --------

        js_source: Can be one of the following:
            'web' (Default) - use js files from zakandrewking.github.io/escher.
            'local' - use compiled js files in the local escher installation. Works offline.
            'dev' - use the local, uncompiled development files. Works offline.

        menu: Menu bar options include:
            'none' - No menu or buttons.
            'zoom' - Just zoom buttons.
            Note: The 'all' menu option does not work in an IPython notebook.

        scroll_behavior: Scroll behavior options:
            'pan' - Pan the map.
            'zoom' - Zoom the map.
            'none' - (Default) No scroll events.

        enable_editing: Enable the editing modes (build, rotate, etc.).

        enable_keys: Enable keyboard shortcuts.

        minified_js: If True, use the minified version of js files. If js_source
        is 'dev', then this option is ignored.

        height: Height of the HTML container.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=False, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=False, height=height)
        if menu=='all':
            raise Exception("The 'all' menu option cannot be used in an IPython notebook.")
        # import here, in case users don't have requirements installed
        from IPython.display import HTML
        return HTML(html)

    
    def display_in_browser(self, ip='127.0.0.1', port=7655, n_retries=50, js_source='web',
                           menu='all', scroll_behavior='pan', enable_editing=True, enable_keys=True,
                           minified_js=True):
        """Launch a web browser to view the map.

        Arguments
        --------

        js_source: Can be one of the following:
            'web' - use js files from zakandrewking.github.io/escher.
            'local' - use compiled js files in the local escher installation. Works offline.
            'dev' - use the local, uncompiled development files. Works offline.

        menu: Menu bar options include:
            'none' - No menu or buttons.
            'zoom' - Just zoom buttons (does not require bootstrap).
            'all' - Menu and button bar (requires bootstrap).

        scroll_behavior: Scroll behavior options:
            'pan' - (Default) Pan the map.
            'zoom' - Zoom the map.
            'none' - No scroll events.
            
        enable_editing: Enable the editing modes (build, rotate, etc.).

        enable_keys: Enable keyboard shortcuts.

        minified_js: If True, use the minified version of js files. If js_source
        is 'dev', then this option is ignored.

        height: Height of the HTML container.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=True, height="100%")
        serve_and_open(html, ip=ip, port=port, n_retries=n_retries)
        
    def save_html(self, filepath=None, js_source='web', menu='all', scroll_behavior='pan',
                  enable_editing=True, enable_keys=True, minified_js=True):
        """Save an HTML file containing the map.

        Arguments
        --------

        js_source: Can be one of the following:
            'web' - use js files from zakandrewking.github.io/escher.
            'local' - use compiled js files in the local escher installation. Works offline.
            'dev' - use the local, uncompiled development files. Works offline.

        menu: Menu bar options include:
            'none' - No menu or buttons.
            'zoom' - Just zoom buttons (does not require bootstrap).
            'all' - Menu and button bar (requires bootstrap).

        scroll_behavior: Scroll behavior options:
            'pan' - (Default) Pan the map.
            'zoom' - Zoom the map.
            'none' - No scroll events.
            
        enable_editing: Enable the editing modes (build, rotate, etc.).

        enable_keys: Enable keyboard shortcuts.

        minified_js: If True, use the minified version of js files. If js_source
        is 'dev', then this option is ignored.

        height: Height of the HTML container.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=True, height="100%")
        if filepath is not None:
            with codecs.open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            return filepath
        else:
            from tempfile import mkstemp
            from os import write, close
            os_file, filename = mkstemp(suffix=".html")
            write(os_file, unicode(html).encode('utf-8'))
            close(os_file)
            return filename
    
