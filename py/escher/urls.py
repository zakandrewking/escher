from escher.version import (
    __version__,
    __schema_version__,
    __map_model_version__,
)
import os
import re
from os.path import dirname, realpath, join

root_directory = realpath(join(dirname(__file__), '..'))

# relative to root_directory
_escher_local = {
    'map_jsonschema': 'escher/static/jsonschema/1-0-0',
}

_escher_web = {
    'server_index': '%s/%s/index.json' % (__schema_version__,
                                          __map_model_version__),
    'map_download': '%s/%s/maps/' % (__schema_version__,
                                     __map_model_version__),
    'model_download': '%s/%s/models/' % (__schema_version__,
                                         __map_model_version__),
}

_dependencies_cdn = {
    'escher': 'https://unpkg.com/escher@%s/dist/escher.js' % __version__,
    'escher_min': ('https://unpkg.com/escher@%s/dist/escher.min.js' %
                   __version__),
}

_links = {
    'escher_root': 'https://escher.github.io/',
    'github': 'https://github.com/zakandrewking/escher',
    'github_releases': 'https://github.com/zakandrewking/escher/releases',
    'documentation': 'https://escher.readthedocs.org/',
}


def get_filepath(key):
    """Get the filepath for the key"""
    if key in _escher_local:
        return join(root_directory, _escher_local[key])
    else:
        raise Exception('File key not recognized: %s' % key)


def get_url(name):
    """Get a url for the key"""

    if name in _escher_web:
        return _links['escher_root'] + _escher_web[name]
    elif name in _links:
        return _links[name]
    elif name in _dependencies_cdn:
        return _dependencies_cdn[name]
    else:
        raise Exception('name not found')
