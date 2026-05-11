from escher.urls import get_url, root_directory
from escher.util import b64dump
from escher.version import __version__
from escher import rc

import anywidget
import traitlets
import pathlib
import cobra
from cobra import Model
import pandas as pd
import os
from os.path import join, isfile, expanduser
from warnings import warn
from urllib.request import urlopen
from urllib.error import URLError
from urllib.parse import quote as url_escape
import json
import re
from jinja2 import Environment, PackageLoader
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
        raise Exception('Could not find the {kind} {name} on the server'
                        .format(kind=kind, name=name))
    org, name = match[0]
    url = (
        get_url(kind + '_download') +
        '/'.join([url_escape(x) for x in [org, name + '.json']])
    )
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


def convert_data(data):
    if type(data) is pd.Series:
        return dict(data)
    elif type(data) is pd.DataFrame:
        return list(dict(x.dropna()) for _, x in data.T.iterrows())
    elif type(data) is dict or type(data) is list or data is None:
        return data
    raise Exception


class _NumpyEncoder(json.JSONEncoder):
    """JSON encoder that converts numpy scalars to native Python types."""
    def default(self, obj):
        if hasattr(obj, 'item'):
            return obj.item()
        return super().default(obj)


_DATA_TRAITLETS = frozenset(['reaction_data', 'metabolite_data', 'gene_data'])

_KNOWN_OPTIONS = frozenset([
    'menu', 'scroll_behavior', 'use_3d_transform', 'enable_editing',
    'enable_keys', 'enable_search', 'zoom_to_element', 'full_screen_button',
    'disabled_buttons', 'semantic_zoom', 'starting_reaction',
    'never_ask_before_quit', 'primary_metabolite_radius',
    'secondary_metabolite_radius', 'marker_radius', 'gene_font_size',
    'hide_secondary_metabolites', 'show_gene_reaction_rules', 'hide_all_labels',
    'canvas_size_and_loc', 'reaction_styles', 'reaction_compare_style',
    'reaction_scale', 'reaction_no_data_color', 'reaction_no_data_size',
    'and_method_in_gene_reaction_rule', 'metabolite_styles',
    'metabolite_compare_style', 'metabolite_scale', 'metabolite_no_data_color',
    'metabolite_no_data_size', 'identifiers_on_map', 'highlight_missing',
    'allow_building_duplicate_reactions', 'cofactors', 'enable_tooltips',
    'enable_keys_with_tooltip', 'reaction_scale_preset', 'metabolite_scale_preset',
])

_FULL_SCREEN_BUTTON_DEFAULT = {
    'enable_keys': True,
    'scroll_behavior': 'pan',
    'enable_editing': True,
    'menu': 'all',
    'enable_tooltips': ['label'],
}


class Builder(anywidget.AnyWidget):
    """A Python wrapper for the Escher metabolic map.

    This map will also show data on reactions, metabolites, or genes.

    The Builder is a Jupyter widget (anywidget) that can be viewed in
    JupyterLab, VS Code notebooks, Marimo, and Colab without any Jupyter
    extension. It can also be used to create a standalone HTML file with
    save_html().

    Maps are downloaded from the Escher website if found by name.

    :param int height:
        The height of the Escher Jupyter widget in pixels.

    :param str map_name:
        A string specifying a map to be downloaded from the Escher website.

    :param str map_json:
        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded.

    :param model:
        A COBRApy model (Python-only; FBA stays in Python).

    :param model_name:
        A string specifying a model to be downloaded from the Escher web
        server (Python-only).

    :param model_json:
        A JSON string, or a file path to a JSON file, or a URL specifying a
        JSON file to be downloaded (Python-only).

    :param embedded_css:
        CSS string embedded in the standalone HTML produced by save_html().
        Has no effect on the Jupyter widget.

    :param reaction_data:
        A dictionary with keys that correspond to reaction IDs and values that
        will be mapped to reaction arrows and labels.

    :param metabolite_data:
        A dictionary with keys that correspond to metabolite IDs and values
        that will be mapped to metabolite nodes and labels.

    :param gene_data:
        A dictionary with keys that correspond to gene IDs and values that
        will be mapped to corresponding reactions.

    **Keyword Arguments**

    Any remaining keyword arguments are treated as display options passed to
    the JS Builder. See the JavaScript API documentation for details.
    """

    _esm = pathlib.Path(__file__).parent / 'static' / 'escher-widget.js'
    _css = pathlib.Path(__file__).parent / 'static' / 'escher.css'

    # Synced traitlets (Python ↔ JS)
    map_json            = traitlets.Unicode('').tag(sync=True)
    model_json          = traitlets.Unicode('').tag(sync=True)
    # Any (not Unicode) so the @validate converters can receive dict/Series/None
    # and convert to JSON string before the value is stored.
    reaction_data       = traitlets.Any('null').tag(sync=True)
    metabolite_data     = traitlets.Any('null').tag(sync=True)
    gene_data           = traitlets.Any('null').tag(sync=True)
    height              = traitlets.Int(500).tag(sync=True)
    selected_reaction   = traitlets.Unicode('').tag(sync=True)
    selected_metabolite = traitlets.Unicode('').tag(sync=True)
    _escher_version     = traitlets.Unicode(__version__).tag(sync=True)
    _options_json       = traitlets.Unicode('{}').tag(sync=True)

    @traitlets.validate('reaction_data')
    def _validate_reaction_data(self, proposal):
        v = proposal['value']
        if v is None:
            return 'null'
        if isinstance(v, str):
            return v
        return json.dumps(convert_data(v), cls=_NumpyEncoder)

    @traitlets.validate('metabolite_data')
    def _validate_metabolite_data(self, proposal):
        v = proposal['value']
        if v is None:
            return 'null'
        if isinstance(v, str):
            return v
        return json.dumps(convert_data(v), cls=_NumpyEncoder)

    @traitlets.validate('gene_data')
    def _validate_gene_data(self, proposal):
        v = proposal['value']
        if v is None:
            return 'null'
        if isinstance(v, str):
            return v
        return json.dumps(convert_data(v), cls=_NumpyEncoder)

    def __init__(
        self,
        map_name=None,
        map_json=None,
        model=None,
        model_name=None,
        model_json=None,
        height=500,
        embedded_css=None,
        **kwargs
    ):
        super().__init__(height=height)

        # Initialize plain instance attrs before any __setattr__ that checks them
        object.__setattr__(self, '_opts', {})
        object.__setattr__(self, '_embedded_css', embedded_css)
        object.__setattr__(self, '_loaded_model_json', None)

        # Resolve map
        if map_json:
            if map_name:
                warn('map_json overrides map_name')
            self.map_json = _load_resource(map_json, 'map_json')
        elif map_name:
            self.map_json = map_json_for_name(map_name)

        # Resolve model → synced to JS so the map editor knows available reactions
        if model:
            if model_name:
                warn('model overrides model_name')
            if model_json:
                warn('model overrides model_json')
            _mj = cobra.io.to_json(model)
            object.__setattr__(self, '_loaded_model_json', _mj)
            self.model_json = _mj
        elif model_json:
            if model_name:
                warn('model_json overrides model_name')
            _mj = _load_resource(model_json, 'model_json')
            object.__setattr__(self, '_loaded_model_json', _mj)
            self.model_json = _mj
        elif model_name:
            _mj = model_json_for_name(model_name)
            object.__setattr__(self, '_loaded_model_json', _mj)
            self.model_json = _mj

        # Set data traitlets (validators handle Series/DataFrame/dict/None)
        if 'reaction_data' in kwargs:
            self.reaction_data = kwargs.pop('reaction_data')
        if 'metabolite_data' in kwargs:
            self.metabolite_data = kwargs.pop('metabolite_data')
        if 'gene_data' in kwargs:
            self.gene_data = kwargs.pop('gene_data')

        # Collect display options from remaining kwargs
        unavailable = {
            'fill_screen', 'tooltip_component', 'first_load_callback',
            'unique_map_id', 'ignore_bootstrap',
        }
        for key, val in kwargs.items():
            if key in unavailable:
                warn('Option %s is not available in the Python API' % key)
            elif key in _KNOWN_OPTIONS:
                self._opts[key] = val

        # Apply rc default for never_ask_before_quit if not explicitly set
        if 'never_ask_before_quit' not in self._opts:
            naqbq = rc.get('never_ask_before_quit', None)
            if naqbq is not None:
                self._opts['never_ask_before_quit'] = naqbq

        self._options_json = json.dumps(
            {k: v for k, v in self._opts.items() if v is not None}
        )

    def __getattr__(self, name):
        if name in _KNOWN_OPTIONS:
            try:
                return object.__getattribute__(self, '_opts').get(name)
            except AttributeError:
                return None
        raise AttributeError(
            '{!r} object has no attribute {!r}'.format(type(self).__name__, name)
        )

    def __setattr__(self, name, value):
        if name in _DATA_TRAITLETS:
            # traitlets.Any short-circuits the @validate decorator for None
            # (allow_none=True path in _validate), so convert to JSON string here.
            if value is None:
                super().__setattr__(name, 'null')
            elif isinstance(value, str):
                super().__setattr__(name, value)
            else:
                super().__setattr__(name,
                                    json.dumps(convert_data(value), cls=_NumpyEncoder))
        elif name in _KNOWN_OPTIONS:
            self._opts[name] = value
            self._options_json = json.dumps(
                {k: v for k, v in self._opts.items() if v is not None}
            )
        else:
            super().__setattr__(name, value)

    def display_in_notebook(self, *args, **kwargs):
        """Deprecated."""
        raise Exception(
            'display_in_notebook is deprecated. The Builder is now a Jupyter '
            'Widget — return it from a cell or use IPython.display.display(b).'
        )

    def display_in_browser(self, *args, **kwargs):
        """Deprecated."""
        raise Exception(
            'display_in_browser is deprecated. Use the Jupyter Widget or '
            'save_html() to generate a standalone HTML file.'
        )

    def save_html(self, filepath):
        """Save an HTML file containing the map.

        :param string filepath:
            The name of the HTML file.
        """
        options = {k: v for k, v in self._opts.items() if v is not None}
        options_json = json.dumps(options)

        template = env.get_template('standalone.html')
        embedded_css_b64 = (b64dump(self._embedded_css)
                            if self._embedded_css is not None else None)
        html = template.render(
            escher_url=get_url('escher_min'),
            escher_css=(pathlib.Path(__file__).parent / 'static' / 'escher.css').read_text(encoding='utf-8'),
            embedded_css_b64=embedded_css_b64,
            map_data_json_b64=b64dump(self.map_json) if self.map_json else None,
            model_data_json_b64=b64dump(self._loaded_model_json),
            options_json_b64=b64dump(options_json),
        )

        with open(expanduser(filepath), 'wb') as f:
            f.write(html.encode('utf-8'))
