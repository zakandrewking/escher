# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals

from escher.quick_server import serve_and_open
from escher.urls import get_url 
from escher.appdirs import user_cache_dir
from escher.generate_index import index

import os
from os.path import dirname, abspath, join, isfile, isdir
from warnings import warn
try:
    from urllib.request import urlopen
    from urllib.error import URLError
except:
    from urllib2 import urlopen, URLError
import json
import shutil
import re
from jinja2 import Environment, PackageLoader, Template
import codecs
import random
import string
from tornado.escape import url_escape

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

# cache management

def get_cache_dir(name=None):
    """ Get the cache dir as a string.

    :param string name: An optional subdirectory within the cache

    """
    cache_dir = join(user_cache_dir('escher', appauthor='Zachary King'))
    if name is not None:
        cache_dir = join(cache_dir, name)
    try:
        os.makedirs(cache_dir)
    except OSError:
        pass
    return cache_dir

def clear_cache(different_cache_dir=None):
    """Empty the contents of the cache directory.

    :param string different_cache_dir: (Optional) The directory of another
                                       cache. This is mainly for testing.

    """
    if different_cache_dir is None:
        cache_dir = get_cache_dir()
    else:
        cache_dir = different_cache_dir    
        
    for root, dirs, files in os.walk(cache_dir):
        for f in files:
            os.unlink(join(root, f))
        for d in dirs:
            shutil.rmtree(join(root, d))

def local_index(cache_dir=get_cache_dir()):
    return index(cache_dir)

def list_cached_maps():
    """Return a list of all cached maps."""
    return local_index()['maps']

def list_cached_models():
    """Return a list of all cached models."""
    return local_index()['models']
    
# server management

def server_index():
    url = get_url('server_index', source='web', protocol='https')
    try:
        download = urlopen(url)
    except URLError:
        raise URLError('Could not contact Escher server')
    data = _decode_response(download)
    index = json.loads(data)
    return index

def list_available_maps():
    """Return a list of all maps available on the server"""
    return server_index()['maps']

def list_available_models():
    """Return a list of all models available on the server"""
    return server_index()['models']

# download maps and models

def _json_for_name(name, kind, cache_dir):
    # check the name
    name = name.replace('.json', '')

    def match_in_index(name, index, kind):
        return [(obj['organism'], obj[kind + '_name']) for obj in index[kind + 's']
                if obj[kind + '_name'] == name]
    
    # first check the local index
    match = match_in_index(name, local_index(cache_dir=cache_dir), kind)
    if len(match) == 0:
        path = None
    else:
        org, name = match[0]
        path = join(cache_dir, kind + 's', org, name + '.json')

    if path:
        # load the file
        with open(path, 'rb') as f:
            return f.read().decode('utf-8')
    # if the file is not present attempt to download
    else:
        try:
            index = server_index()
        except URLError:
            raise Exception(('Could not find the %s %s in the cache, and could '
                             'not connect to the Escher server' % (kind, name)))
        match = match_in_index(name, server_index(), kind)
        if len(match) == 0:
            raise Exception('Could not find the %s %s in the cache or on the server' % (kind, name))
        org, name = match[0]
        url = (get_url(kind + '_download', source='web', protocol='https') +
               '/'.join([url_escape(x, plus=False) for x in [org, name + '.json']]))
        warn('%s not in cache. Attempting download from %s' % (kind.title(), url))
        try:
            download = urlopen(url)
        except URLError:
            raise ValueError('No %s found in cache or at %s' % (kind, url))
        data = _decode_response(download)
        # save the file
        org_path = join(cache_dir, kind + 's', org)
        try:
            os.makedirs(org_path)
        except OSError:
            pass
        with open(join(org_path, name + '.json'), 'w') as outfile:
            outfile.write(data)
        return data

def model_json_for_name(model_name, cache_dir=get_cache_dir()):
    return _json_for_name(model_name, 'model', cache_dir)
   
def map_json_for_name(map_name, cache_dir=get_cache_dir()):
    return _json_for_name(map_name, 'map', cache_dir)

# helper functions

def _get_an_id():
    return (''.join(random.choice(string.ascii_lowercase)
                    for _ in range(10)))

def _decode_response(download):
    """Decode the urllib.response.addinfourl response."""
    data = download.read()
    try:                    # Python 2
        encoding = download.headers.getparam('charset')
    except AttributeError:  # Python 3
        encoding = download.headers.get_param('charset')
    if encoding:
        data = data.decode(encoding)
    else:
        data = data.decode('utf-8')
    return data

def _load_resource(resource, name, safe=False):
    """Load a resource that could be a file, URL, or json string."""
    # if it's a url, download it
    if resource.startswith('http://') or resource.startswith('https://'):
        try:
            download = urlopen(resource)
        except URLError as err:
            raise err
        else:
            return _decode_response(download)
    # if it's a filepath, load it
    if os.path.exists(resource):
        if (safe):
            raise Exception('Cannot load resource from file with safe mode enabled.')
        try:
            with open(resource, 'rb') as f:
                loaded_resource = f.read().decode('utf-8')
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
    """A metabolic map that can be viewed, edited, and used to visualize data.
    
    This map will also show metabolic fluxes passed in during consruction.  It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are stored in json files and are stored in a cache directory. Maps
    which are not found will be downloaded from a map repository if found.
    
    :param map_name:

        A string specifying a map to be downloaded from the Escher web server,
        or loaded from the cache.
    
    :param map_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a JSON
        file to be downloaded.

    :param model: A Cobra model.

    :param model_name:

        A string specifying a model to be downloaded from the Escher web server,
        or loaded from the cache.
    
    :param model_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a JSON
        file to be downloaded.

    :param embedded_css:

        The CSS (as a string) to be embedded with the Escher SVG.
    
    :param reaction_data:

        A dictionary with keys that correspond to reaction ids and values that
        will be mapped to reaction arrows and labels.

    :param metabolite_data:

        A dictionary with keys that correspond to metabolite ids and values that
        will be mapped to metabolite nodes and labels.

    :param gene_data:

        A dictionary with keys that correspond to gene ids and values that will
        be mapped to corresponding reactions.

    :param local_host:

        A hostname that will be used for any local files in dev mode.

    :param id:

        Specify an id to make the javascript data definitions unique. A random
        id is chosen by default.
    
    :param safe:

        If True, then loading files from the filesytem is not allowed. This is
        to ensure the safety of using Builder with a web server.

    **Keyword Arguments**

    These are defined in the Javascript API:

        - identifiers_on_map
        - show_gene_reaction_rules
        - unique_map_id
        - primary_metabolite_radius
        - secondary_metabolite_radius
        - marker_radius
        - hide_secondary_metabolites
        - reaction_styles
        - reaction_compare_style
        - reaction_scale
        - reaction_no_data_color
        - reaction_no_data_size
        - and_method_in_gene_reaction_rule
        - metabolite_styles
        - metabolite_compare_style
        - metabolite_scale
        - metabolite_no_data_color
        - metabolite_no_data_size
        - highlight_missing
        - allow_building_duplicate_reactions

    All keyword arguments can also be set on an existing Builder object
    using setter functions, e.g.:

    .. code:: python
    
        my_builder.set_reaction_styles(new_styles)

    """
    
    def __init__(self, map_name=None, map_json=None, model=None,
        model_name=None, model_json=None, embedded_css=None,
        reaction_data=None, metabolite_data=None, gene_data=None,
        local_host=None, id=None, safe=False, **kwargs):

        self.safe = safe
        
        # load the map
        self.map_name = map_name
        self.map_json = map_json
        self.loaded_map_json = None
        if map_name and map_json:
            warn('map_json overrides map_name')
        self._load_map()
        # load the model
        self.model = model
        self.model_name = model_name
        self.model_json = model_json
        self.loaded_model_json = None
        if sum([x is not None for x in (model, model_name, model_json)]) >= 2:
            warn('model overrides model_json, and both override model_name')
        self._load_model()
        # set the args
        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.gene_data = gene_data
        self.local_host = local_host
        
        # remove illegal characters from css
        try:
            self.embedded_css = (embedded_css.replace('\n', ''))
        except AttributeError:
            self.embedded_css = None
        # make the unique id
        self.the_id = _get_an_id() if id is None else id

        # set up the options
        self.options = ['identifiers_on_map',
                        'show_gene_reaction_rules',
                        'unique_map_id',
                        'primary_metabolite_radius',
                        'secondary_metabolite_radius',
                        'marker_radius',
                        'hide_secondary_metabolites',
                        'reaction_styles',
                        'reaction_compare_style',
                        'reaction_scale',
                        'reaction_no_data_color',
                        'reaction_no_data_size',
                        'and_method_in_gene_reaction_rule',
                        'metabolite_styles',
                        'metabolite_compare_style',
                        'metabolite_scale',
                        'metabolite_no_data_color',
                        'metabolite_no_data_size',
                        'highlight_missing',
                        'allow_building_duplicate_reactions']
        def get_getter_setter(o):
            """Use a closure."""
            # create local fget and fset functions 
            fget = lambda self: getattr(self, '_%s' % o)
            fset = lambda self, value: setattr(self, '_%s' % o, value)
            return fget, fset
        for option in self.options:
            fget, fset = get_getter_setter(option)
            # make the setter
            setattr(self.__class__, 'set_%s' % option, fset)
            # add property to self
            setattr(self.__class__, option, property(fget))
            # add corresponding local variable
            setattr(self, '_%s' % option, None)
            
        # set the kwargs
        for key, val in kwargs.items():
            try:
                getattr(self, 'set_%s' % key)(val)
            except AttributeError:
                print('Unrecognized keywork argument %s' % key)
        
    def _load_model(self):
        """Load the model.

        Try first from self.model, second from self.model_json, and
        third from from self.model_name.
        
        """
        if self.model is not None:
            try:
                import cobra.io
            except ImportError:
                raise Exception(('The COBRApy package must be available to load '
                                 'a COBRA model object'))
            self.loaded_model_json = cobra.io.to_json(self.model)
        elif self.model_json is not None:
            self.loaded_model_json = _load_resource(self.model_json,
                                                    'model_json',
                                                    safe=self.safe)
        elif self.model_name is not None:
            self.loaded_model_json = model_json_for_name(self.model_name)
                
    def _load_map(self):
        """Load the map from input map_json using _load_resource, or, secondarily,
           from map_name.

        """
        if self.map_json is not None:
            self.loaded_map_json = _load_resource(self.map_json,
                                                  'map_json',
                                                  safe=self.safe)
        elif self.map_name is not None:
            self.loaded_map_json = map_json_for_name(self.map_name)

    def _embedded_css(self, url_source):
        """Return a css string to be embedded in the SVG.

        Returns self.embedded_css if it has been assigned. Otherwise, attempts
        to download the css file.

        Arguments
        ---------
        
        url_source: Whether to load from 'web' or 'local'.
        

        """
        if self.embedded_css is not None:
            return self.embedded_css
            
        loc = get_url('builder_embed_css', source=url_source,
                      local_host=self.local_host, protocol='https')
        try:
            download = urlopen(loc)
        except URLError:
            raise Exception(('Could not find builder_embed_css. Be sure to pass '
                             'a local_host argument to Builder if js_source is dev or local '
                             'and you are in an iPython notebook or a static html file.'))
        data = _decode_response(download)
        return data.replace('\n', ' ')

    def _initialize_javascript(self, the_id, url_source):
        javascript = ("var map_data_{the_id} = {map_data};\n"
                      "var model_data_{the_id} = {model_data};\n"
                      "var reaction_data_{the_id} = {reaction_data};\n"
                      "var metabolite_data_{the_id} = {metabolite_data};\n"
                      "var gene_data_{the_id} = {gene_data};\n"
                      "var embedded_css_{the_id} = '{style}';\n").format(
                          the_id=the_id,
                          map_data=(self.loaded_map_json if self.loaded_map_json else
                                    'null'),
                          model_data=(self.loaded_model_json if self.loaded_model_json else
                                       'null'),
                          reaction_data=(json.dumps(self.reaction_data) if self.reaction_data else
                                         'null'),
                          metabolite_data=(json.dumps(self.metabolite_data) if self.metabolite_data else
                                           'null'),
                          gene_data=(json.dumps(self.gene_data) if self.gene_data else
                                           'null'),
                          style=self._embedded_css(url_source))
        return javascript

    def _draw_js(self, the_id, enable_editing, menu, enable_keys, dev,
                 fill_screen, scroll_behavior, never_ask_before_quit,
                 static_site_index_json): 
        draw = ("options = {{ enable_editing: {enable_editing},\n"
                "menu: {menu},\n"
                "enable_keys: {enable_keys},\n"
                "scroll_behavior: {scroll_behavior},\n"
                "fill_screen: {fill_screen},\n"
                "reaction_data: reaction_data_{the_id},\n"
                "metabolite_data: metabolite_data_{the_id},\n"
                "gene_data: gene_data_{the_id},\n"
                "never_ask_before_quit: {never_ask_before_quit},\n").format(
                    the_id=the_id,
                    enable_editing=json.dumps(enable_editing),
                    menu=json.dumps(menu),
                    enable_keys=json.dumps(enable_keys),
                    scroll_behavior=json.dumps(scroll_behavior),
                    fill_screen=json.dumps(fill_screen),
                    never_ask_before_quit=json.dumps(never_ask_before_quit))
        # Add the specified options
        for option in self.options:
            val = getattr(self, option)
            if val is None: continue
            draw = draw + "{option}: {value},\n".format(
                option=option,
                value=json.dumps(val)) 
        draw = draw + "};\n\n"
            
        # dev needs escher.
        dev_str = '' if dev else 'escher.'
        # parse the url in javascript, for building a static site
        if static_site_index_json:
            # get the relative location of the escher_download urls
            map_d = get_url('map_download', source='local')
            model_d = get_url('model_download', source='local')
            o = ('%sstatic.load_map_model_from_url("%s", "%s", \n%s, \noptions, function(map_data_%s, model_data_%s, options) {\n' %
                 (dev_str, map_d, model_d, static_site_index_json, the_id, the_id))
            draw = draw + o;
        # make the builder
        draw = draw + ('{dev_str}Builder(map_data_{the_id}, model_data_{the_id}, embedded_css_{the_id}, '
                       'd3.select("#{the_id}"), options);\n'.format(dev_str=dev_str, the_id=the_id))
        if static_site_index_json:
            draw = draw + '});\n'
        return draw
    
    def _get_html(self, js_source='web', menu='none', scroll_behavior='pan',
                  html_wrapper=False, enable_editing=False, enable_keys=False,
                  minified_js=True, fill_screen=False, height='800px',
                  never_ask_before_quit=False, static_site_index_json=None):
        """Generate the Escher HTML.

        Arguments
        --------

        js_source: Can be one of the following:
            'web' - (Default) use js files from escher.github.io.
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

        never_ask_before_quit: Never display an alert asking if you want to
        leave the page. By default, this message is displayed if enable_editing
        is True.
        
        static_site_index_json: The index, as a JSON string, for the static
        site. Use javascript to parse the URL options. Used for
        generating static pages (see static_site.py).        

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
            height = "%dpx" % height
        elif type(height) is float:
            height = "%fpx" % height
        elif type(height) is str:
            height = str(height)
            
        # set the proper urls 
        url_source = 'local' if (js_source=='local' or js_source=='dev') else 'web'
        is_dev = (js_source=='dev')
        
        d3_url = get_url('d3', url_source, self.local_host)
        d3_rel_url = get_url('d3', url_source)
        escher_url = ('' if js_source=='dev' else
                      get_url('escher_min' if minified_js else 'escher',
                              url_source, self.local_host))
        jquery_url = ('' if not menu=='all' else
                      get_url('jquery', url_source, self.local_host))
        boot_css_url = ('' if not menu=='all' else
                        get_url('boot_css', url_source, self.local_host))
        boot_js_url = ('' if not menu=='all' else
                        get_url('boot_js', url_source, self.local_host))
        require_js_url = get_url('require_js', url_source, self.local_host)                     
        escher_css_url = get_url('builder_css', url_source, self.local_host)
        favicon_url = get_url('favicon', url_source, self.local_host)

        lh_string = ('' if self.local_host is None else
                     self.local_host.rstrip('/') + '/')
        
        html = content.render(id=self.the_id,
                              height=height,
                              dev=is_dev,
                              d3=d3_url,
                              d3_rel=d3_rel_url,
                              escher=escher_url,
                              jquery=jquery_url,
                              boot_css=boot_css_url,
                              boot_js=boot_js_url,
                              require_js=require_js_url,
                              escher_css=escher_css_url,
                              wrapper=html_wrapper,
                              title='Escher ' + ('Builder' if enable_editing else 'Viewer'),
                              favicon=favicon_url,
                              host=lh_string,
                              initialize_js=self._initialize_javascript(self.the_id, url_source),
                              draw_js=self._draw_js(self.the_id, enable_editing,
                                                    menu, enable_keys, is_dev,
                                                    fill_screen, scroll_behavior,
                                                    never_ask_before_quit,
                                                    static_site_index_json))
        return html

    def display_in_notebook(self, js_source='web', menu='zoom', scroll_behavior='none',
                            minified_js=True, height=500):
        """Embed the Map within the current IPython Notebook.

        :param string js_source:

            Can be one of the following:
            
            - *web* (Default) - Use JavaScript files from escher.github.io.
            - *local* - Use compiled JavaScript files in the local Escher installation. Works offline.
            - *dev* - Use the local, uncompiled development files. Works offline.
            
        :param string menu: Menu bar options include:
        
            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - Note: The *all* menu option does not work in an IPython notebook.

        :param string scroll_behavior: Scroll behavior options:
        
            - *pan* - Pan the map.
            - *zoom* - Zoom the map.
            - *none* - (Default) No scroll events.

        :param Boolean minified_js:

            If True, use the minified version of js files. If js_source is
            *dev*, then this option is ignored.

        :param height: Height of the HTML container.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=False, enable_editing=False, enable_keys=False,
                              minified_js=minified_js, fill_screen=False, height=height,
                              never_ask_before_quit=True)
        if menu=='all':
            raise Exception("The 'all' menu option cannot be used in an IPython notebook.")
        # import here, in case users don't have requirements installed
        try:
            from IPython.display import HTML
        except ImportError:
            raise Exception('You need to be using the IPython notebook for this function to work')
        return HTML(html)

    
    def display_in_browser(self, ip='127.0.0.1', port=7655, n_retries=50, js_source='web',
                           menu='all', scroll_behavior='pan', enable_editing=True, enable_keys=True,
                           minified_js=True, never_ask_before_quit=False):
        """Launch a web browser to view the map.

        :param ip: The IP address to serve the map on.

        :param port:

            The port to serve the map on. If specified the port is occupied,
            then a random free port will be used.

        :param int n_retries:

            The number of times the server will try to find a port before
            quitting.
            
        :param string js_source:

            Can be one of the following:
            
            - *web* (Default) - Use JavaScript files from escher.github.io.
            - *local* - Use compiled JavaScript files in the local Escher installation. Works offline.
            - *dev* - Use the local, uncompiled development files. Works offline.

        :param string menu: Menu bar options include:
        
            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - *all* (Default) - Menu and button bar (requires Bootstrap).

        :param string scroll_behavior: Scroll behavior options:
        
            - *pan* - Pan the map.
            - *zoom* - Zoom the map.
            - *none* (Default) - No scroll events.
                
        :param Boolean enable_editing: Enable the map editing modes.

        :param Boolean enable_keys: Enable keyboard shortcuts.

        :param Boolean minified_js:

            If True, use the minified version of js files. If js_source is
            *dev*, then this option is ignored.

        :param Boolean never_ask_before_quit:

            Never display an alert asking if you want to leave the page. By
            default, this message is displayed if enable_editing is True.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=True, height="100%",
                              never_ask_before_quit=never_ask_before_quit)
        serve_and_open(html, ip=ip, port=port, n_retries=n_retries)
        
    def save_html(self, filepath=None, js_source='web', menu='all', scroll_behavior='pan',
                  enable_editing=True, enable_keys=True, minified_js=True,
                  never_ask_before_quit=False, static_site_index_json=None):
        """Save an HTML file containing the map.

        :param string filepath: The HTML file will be saved to this location.

        :param string js_source:

            Can be one of the following:
            
            - *web* (Default) - Use JavaScript files from escher.github.io.
            - *local* - Use compiled JavaScript files in the local Escher installation. Works offline.
            - *dev* - Use the local, uncompiled development files. Works offline.
            
        :param string menu: Menu bar options include:
        
            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - *all* (Default) - Menu and button bar (requires Bootstrap).

        :param string scroll_behavior: Scroll behavior options:
        
            - *pan* - Pan the map.
            - *zoom* - Zoom the map.
            - *none* (Default) - No scroll events.
            
        :param Boolean enable_editing: Enable the map editing modes.

        :param Boolean enable_keys: Enable keyboard shortcuts.

        :param Boolean minified_js:

            If True, use the minified version of js files. If js_source is
            *dev*, then this option is ignored.

        :param number height: Height of the HTML container.

        :param Boolean never_ask_before_quit:

            Never display an alert asking if you want to leave the page. By
            default, this message is displayed if enable_editing is True.

        :param string static_site_index_json:

            The index, as a JSON string, for the static site. Use javascript
            to parse the URL options. Used for generating static pages (see
            static_site.py).        

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=True, height="100%",
                              never_ask_before_quit=never_ask_before_quit,
                              static_site_index_json=static_site_index_json)
        if filepath is not None:
            with open(filepath, 'wb') as f:
                f.write(html.encode('utf-8'))
            return filepath
        else:
            from tempfile import mkstemp
            from os import write, close
            os_file, filename = mkstemp(suffix=".html", text=False) # binary
            write(os_file, html.encode('utf-8'))
            close(os_file)
            return filename
