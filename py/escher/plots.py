# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

from escher.urls import get_url, root_directory
from escher.util import b64dump
from escher.version import __version__

import cobra
from cobra import Model
import ipywidgets as widgets
from traitlets import Unicode, Int, Instance, Dict, observe, validate
import os
from os.path import join, isfile, expanduser
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
from typing import Optional

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


def _json_for_name(name: str, kind: str):
    # check the name
    name = name.replace('.json', '')

    def match_in_index(name, index, kind):
        return [(obj['organism'], obj[kind + '_name'])
                for obj in index[kind + 's']
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
    print('Downloading %s from %s' % (kind.title(), url))
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


class Builder(widgets.DOMWidget):
    """A Python wrapper for the Escher metabolic map.

    This map will also show data on reactions, metabolites, or genes.

    The Builder is a Jupyter widget that can be viewed in a Jupyter notebook or
    in Jupyter Lab. It can also be used to create a standalone HTML file for
    the map with the save_html() function.

    Maps are downloaded from the Escher website if found by name.

    :param int height:

        The height of the Escher Jupyter widget in pixels.

    :param str map_name:

        A string specifying a map to be downloaded from the Escher website.

    :param str map_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded.

    :param model:

        A COBRApy model.

    :param model_name:

        A string specifying a model to be downloaded from the Escher web
        server.

    :param model_json:

        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded.

    :param embedded_css:

        The CSS (as a string) to be embedded with the Escher SVG. In Jupyter,
        if you change embedded_css on an existing builder instance, the Builder
        must be restarted for this to take effect (e.g. by re-evaluating the
        widget in a cell). You can use the default embedded css as a starting
        point:

        https://github.com/zakandrewking/escher/blob/master/src/Builder-embed.css

    :param reaction_data:

        A dictionary with keys that correspond to reaction IDs and values that
        will be mapped to reaction arrows and labels.

    :param metabolite_data:

        A dictionary with keys that correspond to metabolite IDs and values
        that will be mapped to metabolite nodes and labels.

    :param gene_data:

        A dictionary with keys that correspond to gene IDs and values that will
        be mapped to corresponding reactions.

    **Keyword Arguments**

    You can also pass in any of the following options as keyword arguments. The
    details on each of these are provided in the JavaScript API documentation:

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

    All arguments can also be set by assigning the property of an an existing
    Builder object, e.g.:

    .. code:: python

        my_builder.map_name = 'iJO1366.Central metabolism'

    """

    # widget info traitlets

    _view_name = Unicode('EscherMapView').tag(sync=True)
    _model_name = Unicode('EscherMapModel').tag(sync=True)
    _view_module = Unicode('jupyter-escher').tag(sync=True)
    _model_module = Unicode('jupyter-escher').tag(sync=True)
    _view_module_version = Unicode(__version__).tag(sync=True)
    _model_module_version = Unicode(__version__).tag(sync=True)

    # editable attributes

    height = Int(500).tag(sync=True)
    _loaded_map_json = Unicode(None, allow_none=True).tag(sync=True)

    @observe('_loaded_map_json')
    def _observe_loaded_map_json(self, change):
        # if map is cleared, then clear these
        if not change.new:
            self.map_name = None
            self.map_json = None

    _loaded_model_json = Unicode(None, allow_none=True).tag(sync=True)

    @observe('_loaded_model_json')
    def _observe_loaded_model_json(self, change):
        # if model is cleared, then clear these
        if not change.new:
            self.model = None
            self.model_name = None
            self.model_json = None

    embedded_css = Unicode(None, allow_none=True).tag(sync=True)

    @validate('embedded_css')
    def _validate_embedded_css(self, proposal):
        css = proposal['value']
        if css:
            return css.replace('\n', '')
        else:
            return None

    reaction_data = Dict(None, allow_none=True).tag(sync=True)
    metabolite_data = Dict(None, allow_none=True).tag(sync=True)
    gene_data = Dict(None, allow_none=True).tag(sync=True)
    scroll_behavior = Unicode('pan').tag(sync=True)

    # builder traitlets that are indirectly synced to the widget

    map_name = Unicode(None, allow_none=True)
    map_json = Unicode(None, allow_none=True)
    model = Instance(Model, allow_none=True)
    model_name = Unicode(None, allow_none=True)
    model_json = Unicode(None, allow_none=True)

    @observe('map_name')
    def _observe_map_name(self, change):
        if change.new:
            self._loaded_map_json = map_json_for_name(change.new)
        else:
            self._loaded_map_json = None

    @observe('map_json')
    def _observe_map_json(self, change):
        if change.new:
            self._loaded_map_json = _load_resource(change.new, 'map_json')
        else:
            self._loaded_map_json = None

    @observe('model')
    def _observe_model(self, change):
        if change.new:
            self._loaded_model_json = cobra.io.to_json(change.new)
        else:
            self._loaded_model_json = None

    @observe('model_name')
    def _observe_model_name(self, change):
        if change.new:
            self._loaded_model_json = model_json_for_name(change.new)
        else:
            self._loaded_model_json = None

    @observe('model_json')
    def _observe_model_json(self, change):
        if change.new:
            self._loaded_model_json = _load_resource(change.new, 'model_json')
        else:
            self._loaded_model_json = None

    def __init__(
            self,
            #
            height: int = 500,
            map_name: str = None,
            map_json: str = None,
            model: Model = None,
            model_name: str = None,
            model_json: str = None,
            embedded_css: str = None,
            reaction_data: dict = None,
            metabolite_data: dict = None,
            gene_data: dict = None,
            scroll_behavior: str = 'pan',
            # menu: str='zoom',
            # enable_editing: bool=False,
            # **kwargs,
    ) -> None:
        super().__init__()

        # set attributes
        self.height = height

        if map_json:
            if map_name:
                warn('map_json overrides map_name')
            self.map_json = map_json
        else:
            self.map_name = map_name

        if model:
            if model_name:
                warn('model overrides model_name')
            if model_json:
                warn('model overrides model_json')
            self.model = model
        elif model_json:
            if model_name:
                warn('model_json overrides model_name')
            self.model_json = model_json
        else:
            self.model_name = model_name

        self.embedded_css = embedded_css

        self.reaction_data = reaction_data
        self.metabolite_data = metabolite_data
        self.gene_data = gene_data
        self.scroll_behavior = scroll_behavior

        # # set up the options
        # self.options = [
        #     'use_3d_transform',
        #     'enable_search',
        #     'fill_screen',
        #     'zoom_to_element',
        #     'full_screen_button',
        #     'starting_reaction',
        #     'unique_map_id',
        #     'primary_metabolite_radius',
        #     'secondary_metabolite_radius',
        #     'marker_radius',
        #     'gene_font_size',
        #     'hide_secondary_metabolites',
        #     'show_gene_reaction_rules',
        #     'hide_all_labels',
        #     'canvas_size_and_loc',
        #     'reaction_styles',
        #     'reaction_compare_style',
        #     'reaction_scale',
        #     'reaction_no_data_color',
        #     'reaction_no_data_size',
        #     'and_method_in_gene_reaction_rule',
        #     'metabolite_styles',
        #     'metabolite_compare_style',
        #     'metabolite_scale',
        #     'metabolite_no_data_color',
        #     'metabolite_no_data_size',
        #     'identifiers_on_map',
        #     'highlight_missing',
        #     'allow_building_duplicate_reactions',
        #     'cofactors',
        #     'enable_tooltips',
        # ]

        # def get_getter_setter(o):
        #     """Use a closure."""
        #     # create local fget and fset functions
        #     fget = lambda self: getattr(self, '_%s' % o)
        #     fset = lambda self, value: setattr(self, '_%s' % o, value)
        #     return fget, fset
        # for option in self.options:
        #     fget, fset = get_getter_setter(option)
        #     # make the setter
        #     setattr(self.__class__, 'set_%s' % option, fset)
        #     # add property to self
        #     setattr(self.__class__, option, property(fget))
        #     # add corresponding local variable
        #     setattr(self, '_%s' % option, None)

        # # set the kwargs
        # for key, val in kwargs.items():
        #     try:
        #         getattr(self, 'set_%s' % key)(val)
        #     except AttributeError:
        #         print('Unrecognized keywork argument %s' % key)

    # def display_in_notebook(self):
    #     """Deprecated.

    #     The Builder is now a Jupyter Widget, so you can return the Builder
    #     object from a cell to display it, or you can manually call the IPython
    #     display function:

    #     from IPython.display import display
    #     from escher import Builder
    #     b = Builder(...)
    #     display(b)

    #     """
    #     raise Exception(('display_in_notebook is deprecated. The Builder is '
    #                      'now a Jupyter Widget, so you can return the '
    #                      'Builder in a cell to see it, or use the IPython '
    #                      'display function (see Escher docs for details)'))

    # def display_in_browser(self, ip='127.0.0.1', port=7655, n_retries=50,
    #                        js_source='web', menu='all', scroll_behavior='pan',
    #                        enable_editing=True, enable_keys=True,
    #                        minified_js=True, never_ask_before_quit=False):
    #     """Deprecated.

    #     We recommend using the Jupyter Widget (which now supports all Escher
    #     features) or the save_html option to generate a standalone HTML file
    #     that loads the map.

    #     """
    #     raise Exception(('display_in_browser is deprecated. We recommend using'
    #                      'the Jupyter Widget (which now supports all Escher'
    #                      'features) or the save_html option to generate a'
    #                      'standalone HTML file that loads the map.'))

    # def save_html(self, filepath=None):
    #     """Save an HTML file containing the map.

    #     :param string filepath:

    #         The name of the HTML file.

    #     """

    #     # TODO apply options from self
    #     options = tranform(self.options)

    #     template = env.get_template('standalone.html')
    #     html = template.render(
    #         escher_url=get_url('escher_min'),
    #         # dump json
    #         options_json=b64dump(options),
    #         map_download_url_json=b64dump(get_url('map_download')),
    #         model_download_url_json=b64dump(get_url('model_download')),
    #         builder_embed_css_json=b64dump(self.embedded_css),
    #         # alreay json
    #         map_data_json=b64dump(self.loaded_map_json),
    #         model_data_json=b64dump(self.loaded_model_json),
    #     )

    #     with open(expanduser(filepath), 'wb') as f:
    #         f.write(html.encode('utf-8'))
