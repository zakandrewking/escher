# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

from escher.urls import get_url, root_directory
from escher.util import b64dump
from escher.widget import EscherWidget

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


# server management

def server_index():
    url = get_url('server_index')
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

def _json_for_name(name, kind):
    # check the name
    name = name.replace('.json', '')

    def match_in_index(name, index, kind):
        return [(obj['organism'], obj[kind + '_name']) for obj in index[kind + 's']
                if obj[kind + '_name'] == name]

    try:
        index = server_index()
    except URLError:
        raise Exception('Could not connect to the Escher server')
    match = match_in_index(name, server_index(), kind)
    if len(match) == 0:
        raise Exception('Could not find the %s %s on the server' % (kind, name))
    org, name = match[0]
    url = (get_url(kind + '_download') +
            '/'.join([url_escape(x, plus=False) for x in [org, name + '.json']]))
    warn('Downloading from %s' % (kind.title(), url))
    try:
        download = urlopen(url)
    except URLError:
        raise ValueError('No %s found in at %s' % (kind, url))
    data = _decode_response(download)
    return data


def model_json_for_name(model_name):
    return _json_for_name(model_name, 'model')


def map_json_for_name(map_name):
    return _json_for_name(map_name, 'map')

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


def _load_resource(resource, name):
    """Load a resource that could be a file, URL, or json string."""
    # if it's a url, download it
    if resource.startswith('http://') or resource.startswith('https://'):
        try:
            download = urlopen(resource)
        except URLError as err:
            raise err
        else:
            return _decode_response(download)
    # If it's a filepath, load it
    try:
        is_file = isfile(resource)
    except ValueError:
        # check for error with long filepath (or URL) on Windows
        is_file = False
    if is_file:
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
        raise ValueError('Could not load %s. Not valid json, url, or filepath'
                         % name)
    else:
        return resource
    raise Exception('Could not load %s.' % name)


class Builder(object):
    """A metabolic map that can be viewed, edited, and used to visualize data.

    This map will also show metabolic fluxes passed in during consruction. It
    can be viewed as a standalone html inside a browswer. Alternately, the
    respresentation inside an IPython notebook will also display the map.

    Maps are downloaded from the map repository if found by name.

    :param map_name:

        A string specifying a map to be downloaded from the Escher web server.

    :param map_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded.

    :param model: A Cobra model.

    :param model_name:

        A string specifying a model to be downloaded from the Escher web
        server.

    :param model_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded.

    :param embedded_css:

        The CSS (as a string) to be embedded with the Escher SVG.

    :param reaction_data:

        A dictionary with keys that correspond to reaction ids and values that
        will be mapped to reaction arrows and labels.

    :param metabolite_data:

        A dictionary with keys that correspond to metabolite ids and values
        that will be mapped to metabolite nodes and labels.

    :param gene_data:

        A dictionary with keys that correspond to gene ids and values that will
        be mapped to corresponding reactions.

    :param local_host:

        deprecated

    :param id:

        Specify an id to make the javascript data definitions unique. A random
        id is chosen by default.

    :param safe:

        Deprecated

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
        - canvas_size_and_loc
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
        - enable_tooltips

    All keyword arguments can also be set on an existing Builder object
    using setter functions, e.g.:

    .. code:: python

        my_builder.set_reaction_styles(new_styles)

    """

    def __init__(self, map_name=None, map_json=None, model=None,
                 model_name=None, model_json=None, embedded_css=None,
                 reaction_data=None, metabolite_data=None, gene_data=None,
                 local_host=None, id=None, safe=None, **kwargs):

        if local_host is not None:
            warn('The local_host option is deprecated')
        if safe is not None:
            warn('The safe option is deprecated')

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

        # remove illegal characters from css
        try:
            self.embedded_css = (embedded_css.replace('\n', ''))
        except AttributeError:
            self.embedded_css = None
        # make the unique id
        self.the_id = _get_an_id() if id is None else id

        # set up the options
        self.options = [
            'use_3d_transform',
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
            'canvas_size_and_loc',
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
            'cofactors',
            'enable_tooltips',
        ]

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
                raise Exception(('The COBRApy package must be available to '
                                 'load a COBRA model object'))
            self.loaded_model_json = cobra.io.to_json(self.model)
        elif self.model_json is not None:
            self.loaded_model_json = _load_resource(self.model_json,
                                                    'model_json')
        elif self.model_name is not None:
            self.loaded_model_json = model_json_for_name(self.model_name)

    def _load_map(self):
        """Load the map from input map_json using _load_resource, or, secondarily,
           from map_name.

        """
        if self.map_json is not None:
            self.loaded_map_json = _load_resource(self.map_json,
                                                  'map_json')
        elif self.map_name is not None:
            self.loaded_map_json = map_json_for_name(self.map_name)

    def display_in_notebook(self, js_source=None, menu='zoom',
                            scroll_behavior='none', minified_js=None,
                            height=500, enable_editing=False):
        """Embed the Map within the current IPython Notebook.

        :param string js_source:

            deprecated

        :param string menu: Menu bar options include:

            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - Note: The *all* menu option does not work in an IPython notebook.

        :param string scroll_behavior: Scroll behavior options:

            - *pan* - Pan the map.
            - *zoom* - Zoom the map.
            - *none* - (Default) No scroll events.

        :param Boolean minified_js:

            Deprectated.

        :param height: Height of the HTML container.

        :param Boolean enable_editing: Enable the map editing modes.

        """
        if js_source is not None:
            warn('The js_source option is deprecated')
        if minified_js is not None:
            warn('The minified_js option is deprecated')

        # options
        # TODO deduplicate
        options = {
            'menu': menu,
            'enable_keys': enable_keys,
            'enable_editing': enable_editing,
            'scroll_behavior': scroll_behavior,
            'fill_screen': fill_screen,
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

        return EscherWidget(
            menu=menu,
            scroll_behavior=scroll_behavior,
            height=height,
            enable_editing=enable_editing,
            options=this.options,
            embedded_css=this.embedded_css,
            loaded_map_json=this.loaded_map_json,
            loaded_model_json=this.loaded_model_json,
        )

    def display_in_browser(self, ip='127.0.0.1', port=7655, n_retries=50,
                           js_source='web', menu='all', scroll_behavior='pan',
                           enable_editing=True, enable_keys=True,
                           minified_js=True, never_ask_before_quit=False):
        """Deprecated.

        We recommend using the Jupyter Widget (which now supports all Escher
        features) or the save_html option to generate a standalone HTML file
        that loads the map.

        """
        raise Exception(('display_in_browser is deprecated. We recommend using'
                         'the Jupyter Widget (which now supports all Escher'
                         'features) or the save_html option to generate a'
                         'standalone HTML file that loads the map.'))

    def _get_html(self, js_source=None, menu='none', scroll_behavior='pan',
                  html_wrapper=False, enable_editing=False, enable_keys=False,
                  minified_js=True, fill_screen=False, height='800px',
                  never_ask_before_quit=False, static_site_index_json=None,
                  protocol=None, ignore_bootstrap=None):
        """Generate the Escher HTML.

        Arguments
        --------

        js_source: Deprecated.

        menu: Menu bar options include:
            'none' - (Default) No menu or buttons.
            'zoom' - Just zoom buttons (does not require bootstrap).
            'all' - Menu and button bar (requires bootstrap).

        scroll_behavior: Scroll behavior options:
            'pan' - (Default) Pan the map.
            'zoom' - Zoom the map.
            'none' - No scroll events.

        minified_js: If True, use the minified version of JavaScript files.

        html_wrapper: If True, return a standalone html file.

        enable_editing: Enable the editing modes (build, rotate, etc.).

        enable_keys: Enable keyboard shortcuts.

        height: The height of the HTML container.

        never_ask_before_quit: Never display an alert asking if you want to
        leave the page. By default, this message is displayed if enable_editing
        is True.

        static_site_index_json: Deprecated

        protocol: Deprecated

        ignore_bootstrap: Deprecated

        """

        if js_source is not None:
            warn('The js_source option is deprecated')
        if static_site_index_json is not None:
            warn('The static_site_index_json option is deprecated')
        if protocol is not None:
            warn('The protocol option is deprecated')
        if ignore_bootstrap is not None:
            warn('The ignore_bootstrap option is deprecated')

        if menu not in ['none', 'zoom', 'all']:
            raise Exception('Bad value for menu: %s' % menu)

        if scroll_behavior not in ['pan', 'zoom', 'none']:
            raise Exception('Bad value for scroll_behavior: %s' %
                            scroll_behavior)

        content = env.get_template('content.html')

        # if height is not a string
        if type(height) is int:
            height = "%dpx" % height
        elif type(height) is float:
            height = "%fpx" % height
        elif type(height) is str:
            height = str(height)

        # for static site
        map_download_url = get_url('map_download')
        model_download_url = get_url('model_download')

        # options
        # TODO deduplicate
        options = {
            'menu': menu,
            'enable_keys': enable_keys,
            'enable_editing': enable_editing,
            'scroll_behavior': scroll_behavior,
            'fill_screen': fill_screen,
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
            favicon_url=favicon_url,
            # content
            wrapper=html_wrapper,
            height=height,
            id=self.the_id,
            escher_url=escher_url,
            # dump json
            id_json=b64dump(self.the_id),
            options_json=b64dump(options),
            map_download_url_json=b64dump(map_download_url),
            model_download_url_json=b64dump(model_download_url),
            builder_embed_css_json=b64dump(self.embedded_css),
            # alreay json
            map_data_json=b64dump(self.loaded_map_json),
            model_data_json=b64dump(self.loaded_model_json),
            static_site_index_json=b64dump(static_site_index_json),
        )

        return html

    def save_html(self, filepath=None, overwrite=False, js_source=None,
                  protocol=None, menu='all', scroll_behavior='pan',
                  enable_editing=True, enable_keys=True, minified_js=True,
                  never_ask_before_quit=False, static_site_index_json=None):
        """Save an HTML file containing the map.

        :param string filepath:

            The HTML and JS files will be saved to a new directory in this
            location.

        :param Boolean overwrite:

            Overwrite existing files.

        :param string js_source:

            Deprecated

        :param string protocol:

            Deprecated

        :param string menu: Menu bar options include:

            - *none* - No menu or buttons.
            - *zoom* - Just zoom buttons.
            - *all* (Default) - Menu and button bar.

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

            Deprecated

        """
        if js_source is not None:
            warn('The js_source option is deprecated')
        if protocol is not None:
            warn('The protocol option is deprecated')
        if static_site_index_json is not None:
            warn('The static_site_index_json option is deprecated')

        if filepath is None:
            raise Exception('Must provide a filepath')

        filepath = expanduser(filepath)

        # make a directory
        directory = re.sub(r'\.html$', '', filepath)
        if exists(directory):
            if not overwrite:
                raise Exception('Directory already exists: %s' % directory)
        else:
            os.makedirs(directory)
        # add dependencies to the directory
        escher = get_url('escher_min' if minified_js else 'escher')
        favicon = get_url('favicon')

        for path in [escher, favicon]:
            if path is None:
                continue
            src = join(root_directory, path)
            dest = join(directory, path)
            dest_dir = dirname(dest)
            if not exists(dest_dir):
                os.makedirs(dest_dir)
            shutil.copy(src, dest)
        filepath = join(directory, 'index.html')

        html = self._get_html(
            menu=menu,
            scroll_behavior=scroll_behavior,
            html_wrapper=True,
            enable_editing=enable_editing,
            enable_keys=enable_keys,
            minified_js=minified_js,
            fill_screen=True,
            height="100%",
            never_ask_before_quit=never_ask_before_quit,
        )
        with open(filepath, 'wb') as f:
            f.write(html.encode('utf-8'))
        return filepath
