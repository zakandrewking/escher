# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals

from escher.version import __version__, __schema_version__, __map_model_version__
import os
import re
from os.path import dirname, realpath, join

root_directory = realpath(join(dirname(__file__), '..'))
top_directory = realpath(join(dirname(__file__), '..', '..'))

_escher_local = {
    'escher': 'escher/static/escher/escher.js',
    'escher_min': 'escher/static/escher/escher.min.js',
    'logo': 'escher/static/img/escher-logo@2x.png',
    'favicon': 'escher/static/img/favicon.ico',
}

_escher_web = {
    'server_index': '%s/%s/index.json' % (__schema_version__, __map_model_version__),
    'map_download': '%s/%s/maps/' % (__schema_version__, __map_model_version__),
    'model_download': '%s/%s/models/' % (__schema_version__, __map_model_version__),
}

_dependencies_cdn = {
    'escher': 'https://unpkg.com/escher@%s/dist/escher.js' % __version__,
    'escher_min': 'https://unpkg.com/escher@%s/dist/escher.min.js' % __version__,
}

_links = {
    'escher_root': 'https://escher.github.io/',
    'github': 'https://github.com/zakandrewking/escher',
    'github_releases': 'https://github.com/zakandrewking/escher/releases',
    'documentation': 'https://escher.readthedocs.org/',
}

# external dependencies
names = (
    list(_escher_local.keys()) +
    list(_escher_web.keys()) +
    list(_dependencies.keys()) +
    list(_links.keys())
)


def get_url(name):
    """Get a url.

    Arguments
    ---------

    name: The name of the URL. Options are available in urls.names.

    """

    if name in _escher_local:
        return _escher_local[name]
    elif name in _escher_web:
        return _links['escher_root'] + _escher_web[name]
    elif name in _links:
        return _links[name]
    elif name in _dependencies_cdn:
        return _dependencies_cdn[name]
    else:
        raise Exception('name not found')
