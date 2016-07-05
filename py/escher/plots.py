# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals

from escher.quick_server import serve_and_open
from escher.urls import get_url, root_directory
from escher.appdirs import user_cache_dir
from escher.generate_index import index
from escher.version import __schema_version__, __map_model_version__
from escher.util import query_yes_no
from escher.escape import json_dump_and_escape, escape_json_or_null

import os
from os.path import (dirname, basename, abspath, join, isfile, isdir, exists,
                     expanduser)
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
import shutil

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

# cache management

def get_cache_dir(versioned=True, name=None):
    """Get the cache dir as a string, and make the directory if it does not already
    exist.

    :param Boolean versioned: Whether to return the versioned path in the
                              cache. Escher maps for the latest version of
                              Escher are found in the versioned directory
                              (versioned = True), but maps for previous versions
                              of Escher can be found by visiting the parent
                              directory (versioned = False).

    :param string name: An optional subdirectory within the cache. If versioned
                        is False, then name is ignored.

    """
    cache_dir = user_cache_dir('escher', appauthor='Zachary King')
    # add version
    if versioned:
        cache_dir = join(cache_dir, __schema_version__, __map_model_version__)
        # add subdirectory
        if name is not None:
            cache_dir = join(cache_dir, name)
    try:
        os.makedirs(cache_dir)
    except OSError:
        pass
    return cache_dir

def clear_cache(different_cache_dir=None, ask=True):
    """Empty the contents of the cache directory, including all versions of all maps
    and models.

    :param string different_cache_dir: (Optional) The directory of another
                                       cache. This is mainly for testing.

    :param Boolean ask: Whether to ask before deleting.

    """
    if ask and not query_yes_no('Are you sure you want to delete the contents of the cache?'):
        return

    if different_cache_dir is None:
        cache_dir = get_cache_dir(versioned=False)
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
    try:
        is_file = isfile(resource)
    except ValueError:
        # check for error with long filepath (or URL) on Windows
        is_file = False
    if is_file:
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

        A hostname that will be used for any local files. This is generally used
        for using the notebook offline and for testing in the IPython Notebook
        with modified Escher code. An example value for local_host is
        'http://localhost:7778/'.

    :param id:

        Specify an id to make the javascript data definitions unique. A random
        id is chosen by default.

    :param safe:

        If True, then loading files from the filesytem is not allowed. This is
        to ensure the safety of using Builder within a web server.

    **Keyword Arguments**

    These are defined in the Javascript API:

        - use_3d_transform
        - enable_search
        - fill_screen
        - zoom_to_element
        - full_screen_button
        - starting_reaction
        - unique_map_id
        - primary_metabolite_radius
        - secondary_metabolite_radius
        - marker_radius
        - gene_font_size
        - hide_secondary_metabolites
        - show_gene_reaction_rules
        - hide_all_labels
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
        - identifiers_on_map
        - highlight_missing
        - allow_building_duplicate_reactions
        - cofactors

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
        self.options = ['use_3d_transform',
                        'enable_search',
                        'fill_screen',
                        'zoom_to_element',
                        'full_screen_button',
                        'starting_reaction',
                        'unique_map_id',
                        'primary_metabolite_radius',
                        'secondary_metabolite_radius',
                        'marker_radius',
                        'gene_font_size',
                        'hide_secondary_metabolites',
                        'show_gene_reaction_rules',
                        'hide_all_labels',
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
                        'identifiers_on_map',
                        'highlight_missing',
                        'allow_building_duplicate_reactions',
                        'cofactors']
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


    def _get_html(self, js_source='web', menu='none', scroll_behavior='pan',
                  html_wrapper=False, enable_editing=False, enable_keys=False,
                  minified_js=True, fill_screen=False, height='800px',
                  never_ask_before_quit=False, static_site_index_json=None,
                  protocol=None, ignore_bootstrap=False):
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

        minified_js: If True, use the minified version of JavaScript and CSS
        files.

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

        protocol: The protocol can be 'http', 'https', or None which indicates a
        'protocol relative URL', as in //escher.github.io. Ignored if source is
        local.

        ignore_bootstrap: Do not use Bootstrap for buttons, even if it
        available. This is used to embed Escher in a Jupyter notebook where it
        conflicts with the Jupyter Boostrap installation.

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
        local_host = self.local_host

        # get the urls
        d3_url = get_url('d3', url_source, local_host, protocol)
        escher_url = get_url(('escher_min' if minified_js else 'escher'),
                             url_source, local_host, protocol)
        if menu == 'all' and not ignore_bootstrap:
            jquery_url = get_url('jquery', url_source, local_host, protocol)
            boot_css_url = get_url('boot_css', url_source, local_host, protocol)
            boot_js_url = get_url('boot_js', url_source, local_host, protocol)
        else:
            jquery_url = boot_css_url = boot_js_url = None
        escher_css_url = get_url(('builder_css_min' if minified_js else 'builder_css'),
                                 url_source, local_host, protocol)
        favicon_url = get_url('favicon', url_source, local_host, protocol)
        # for static site
        map_download_url = get_url('map_download', url_source, local_host, protocol)
        model_download_url = get_url('model_download', url_source, local_host, protocol)

        # local host
        lh_string = ('' if local_host is None else
                     local_host.rstrip('/') + '/')

        # options
        options = {
            'menu': menu,
            'enable_keys': enable_keys,
            'enable_editing': enable_editing,
            'scroll_behavior': scroll_behavior,
            'fill_screen': fill_screen,
            'ignore_bootstrap': ignore_bootstrap,
            'never_ask_before_quit': never_ask_before_quit,
            'reaction_data': self.reaction_data,
            'metabolite_data': self.metabolite_data,
            'gene_data': self.gene_data,
        }
        # Add the specified options
        for option in self.options:
            val = getattr(self, option)
            if val is None:
                continue
            options[option] = val

        html = content.render(
            # standalone
            title='Escher ' + ('Builder' if enable_editing else 'Viewer'),
            jquery_url=jquery_url,
            boot_js_url=boot_js_url,
            boot_css_url=boot_css_url,
            escher_css_url=escher_css_url,
            favicon_url=favicon_url,
            # content
            wrapper=html_wrapper,
            height=height,
            id=self.the_id,
            d3_url=d3_url,
            escher_url=escher_url,
            # dump json
            id_json=json_dump_and_escape(self.the_id),
            options_json=json_dump_and_escape(options),
            map_download_url_json=json_dump_and_escape(map_download_url),
            model_download_url_json=json_dump_and_escape(model_download_url),
            builder_embed_css_json=json_dump_and_escape(self.embedded_css),
            # alreay json
            map_data_json=escape_json_or_null(self.loaded_map_json),
            model_data_json=escape_json_or_null(self.loaded_model_json),
            static_site_index_json=escape_json_or_null(static_site_index_json),
        )

        return html


    def display_in_notebook(self, js_source='web', menu='zoom', scroll_behavior='none',
                            minified_js=True, height=500, enable_editing=False):
        """Embed the Map within the current IPython Notebook.

        :param string js_source:

            Can be one of the following:

            - *web* (Default) - Use JavaScript files from escher.github.io.
            - *local* - Use compiled JavaScript files in the local Escher installation. Works offline.
            - *dev* - No longer necessary with source maps. This now gives the
                      same behavior as 'local'.

        :param string menu: Menu bar options include:

            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - Note: The *all* menu option does not work in an IPython notebook.

        :param string scroll_behavior: Scroll behavior options:

            - *pan* - Pan the map.
            - *zoom* - Zoom the map.
            - *none* - (Default) No scroll events.

        :param Boolean minified_js:

            If True, use the minified version of JavaScript and CSS files.

        :param height: Height of the HTML container.

        :param Boolean enable_editing: Enable the map editing modes.

        """
        if (enable_editing and menu == 'zoom'):
            menu = 'all'
        if enable_editing:
            print('Some functions (e.g. saving maps) are not available in the notebook. Use '
                  'Builder.display_in_browser() for a full-featured Escher Builder.')
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=False, enable_editing=enable_editing, enable_keys=False,
                              minified_js=minified_js, fill_screen=False, height=height,
                              never_ask_before_quit=True, ignore_bootstrap=True)
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
            - *dev* - No longer necessary with source maps. This now gives the
                      same behavior as 'local'.

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

            If True, use the minified version of JavaScript and CSS files.

        :param Boolean never_ask_before_quit:

            Never display an alert asking if you want to leave the page. By
            default, this message is displayed if enable_editing is True.

        """
        html = self._get_html(js_source=js_source, menu=menu, scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing, enable_keys=enable_keys,
                              minified_js=minified_js, fill_screen=True, height="100%",
                              never_ask_before_quit=never_ask_before_quit)
        serve_and_open(html, ip=ip, port=port, n_retries=n_retries)


    def save_html(self, filepath=None, overwrite=False, js_source='web',
                  protocol='https', menu='all', scroll_behavior='pan',
                  enable_editing=True, enable_keys=True, minified_js=True,
                  never_ask_before_quit=False, static_site_index_json=None):
        """Save an HTML file containing the map.

        :param string filepath:

            The HTML file will be saved to this location. When js_source is
            'local', then a new directory will be created with this name.

        :param Boolean overwrite:

            Overwrite existing files.

        :param string js_source:

            Can be one of the following:

            - *web* (Default) - Use JavaScript files from escher.github.io.
            - *local* - Use compiled JavaScript files in the local Escher
                        installation. Works offline. To make the dependencies
                        available to the downloaded file, a new directory will
                        be made with the name specified by filepath.
            - *dev* - No longer necessary with source maps. This now gives the
                      same behavior as 'local'.

        :param string protocol:

            The protocol can be 'http', 'https', or None which indicates a
            'protocol relative URL', as in //escher.github.io. Ignored if source
            is local.

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

            If True, use the minified version of JavaScript and CSS files.

        :param number height: Height of the HTML container.

        :param Boolean never_ask_before_quit:

            Never display an alert asking if you want to leave the page. By
            default, this message is displayed if enable_editing is True.

        :param string static_site_index_json:

            The index, as a JSON string, for the static site. Use javascript
            to parse the URL options. Used for generating static pages (see
            static_site.py).

        """

        filepath = expanduser(filepath)

        if js_source in ['local', 'dev']:
            if filepath is None:
                raise Exception('Must provide a filepath when js_source is not "web"')

            # make a directory
            directory = re.sub(r'\.html$', '', filepath)
            if exists(directory):
                if not overwrite:
                    raise Exception('Directory already exists: %s' % directory)
            else:
                os.makedirs(directory)
            # add dependencies to the directory
            escher = get_url('escher_min' if minified_js else 'escher', 'local')
            builder_css = get_url('builder_css_min' if minified_js else 'builder_css', 'local')
            d3 = get_url('d3', 'local')
            favicon = get_url('favicon', 'local')
            if menu == 'all':
                boot_css = get_url('boot_css', 'local')
                boot_js = get_url('boot_js', 'local')
                jquery = get_url('jquery', 'local')
                boot_font_eot = get_url('boot_font_eot', 'local')
                boot_font_svg = get_url('boot_font_svg', 'local')
                boot_font_woff = get_url('boot_font_woff', 'local')
                boot_font_woff2 = get_url('boot_font_woff2', 'local')
                boot_font_ttf = get_url('boot_font_ttf', 'local')
            else:
                boot_css = boot_js = jquery = None
                boot_font_eot = boot_font_svg = None
                boot_font_woff = boot_font_woff2 = boot_font_ttf = None

            for path in [escher, builder_css, boot_css, boot_js, jquery, d3,
                         favicon, boot_font_eot, boot_font_svg, boot_font_woff,
                         boot_font_woff2, boot_font_ttf]:
                if path is None:
                    continue
                src = join(root_directory, path)
                dest = join(directory, path)
                dest_dir = dirname(dest)
                if not exists(dest_dir):
                    os.makedirs(dest_dir)
                shutil.copy(src, dest)
            filepath = join(directory, 'index.html')
        else:
            if not filepath.endswith('.html'):
                filepath += '.html'
            if exists(filepath) and not overwrite:
                raise Exception('File already exists: %s' % filepath)

        html = self._get_html(js_source=js_source, menu=menu,
                              scroll_behavior=scroll_behavior,
                              html_wrapper=True, enable_editing=enable_editing,
                              enable_keys=enable_keys, minified_js=minified_js,
                              fill_screen=True, height="100%",
                              never_ask_before_quit=never_ask_before_quit,
                              static_site_index_json=static_site_index_json,
                              protocol=protocol)
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
