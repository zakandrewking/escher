# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals

from escher.version import __version__, __schema_version__, __map_model_version__
import os
import re
from os.path import dirname, realpath, join

root_directory = realpath(join(dirname(__file__), '..'))
top_directory = realpath(join(dirname(__file__), '..', '..'))

_escher_local = {
    'builder_css': 'escher/static/escher/builder.css',
    'builder_css_min': 'escher/static/escher/builder.min.css',
    'escher': 'escher/static/escher/escher.js',
    'escher_min': 'escher/static/escher/escher.min.js',
    'logo': 'escher/static/img/escher-logo@2x.png',
    'favicon': 'escher/static/img/favicon.ico',
    'homepage_js': 'escher/static/homepage/main.js',
    'homepage_css': 'escher/static/homepage/main.css',
    'server_index': '../%s/%s/index.json' % (__schema_version__, __map_model_version__),
    'map_download': '../%s/%s/maps/' % (__schema_version__, __map_model_version__),
    'model_download': '../%s/%s/models/' % (__schema_version__, __map_model_version__),
}

_escher_web = {
    'server_index': '%s/%s/index.json' % (__schema_version__, __map_model_version__),
    'map_download': '%s/%s/maps/' % (__schema_version__, __map_model_version__),
    'model_download': '%s/%s/models/' % (__schema_version__, __map_model_version__),
    'favicon': 'escher/static/img/favicon.ico',
}

_dependencies = {
    'boot_js': 'escher/static/lib/bootstrap.min.js',
    'boot_css': 'escher/static/lib/bootstrap.min.css',
    'jquery': 'escher/static/lib/jquery.min.js',
    'boot_font_eot': 'escher/static/fonts/glyphicons-halflings-regular.eot',
    'boot_font_svg': 'escher/static/fonts/glyphicons-halflings-regular.svg',
    'boot_font_woff': 'escher/static/fonts/glyphicons-halflings-regular.woff',
    'boot_font_woff2': 'escher/static/fonts/glyphicons-halflings-regular.woff2',
    'boot_font_ttf': 'escher/static/fonts/glyphicons-halflings-regular.ttf',
}

_dependencies_cdn = {
    'builder_css': '//unpkg.com/escher-vis@%s/css/dist/builder.css' % __version__,
    'builder_css_min': '//unpkg.com/escher-vis@%s/css/dist/builder.min.css' % __version__,
    'escher': '//unpkg.com/escher-vis@%s/js/dist/escher.js' % __version__,
    'escher_min': '//unpkg.com/escher-vis@%s/js/dist/escher.min.js' % __version__,
    'boot_js': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js',
    'boot_css': '//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/simplex/bootstrap.min.css',
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js',
}

_links = {
    'escher_root': '//escher.github.io/',
    'github': '//github.com/zakandrewking/escher/',
    'github_releases': '//github.com/zakandrewking/escher/releases',
    'documentation': '//escher.readthedocs.org/',
}

# external dependencies
names = list(_escher_local.keys()) + list(_escher_web.keys()) + list(_dependencies.keys()) + list(_links.keys())

def get_url(name, source='web', local_host=None, protocol=None):
    """Get a url.

    Arguments
    ---------

    name: The name of the URL. Options are available in urls.names.

    source: Either 'web' or 'local'. Cannot be 'local' for external links.

    protocol: The protocol can be 'http', 'https', or None which indicates a
    'protocol relative URL', as in //escher.github.io. Ignored if source is
    local.

    local_host: A host url, including the protocol. e.g. http://localhost:7778.

    """
    if source not in ['web', 'local']:
        raise Exception('Bad source: %s' % source)

    if protocol not in [None, 'http', 'https']:
        raise Exception('Bad protocol: %s' % protocol)

    if protocol is None:
        protocol = ''
    else:
        protocol = protocol + ':'

    def apply_local_host(url):
        return '/'.join([local_host.rstrip('/'), url.lstrip('/')])

    # escher
    if name in _escher_local and source == 'local':
        if local_host is not None:
            return apply_local_host(_escher_local[name])
        return _escher_local[name]
    elif name in _escher_web and source == 'web':
        return protocol + '/'.join([_links['escher_root'].rstrip('/'),
                                    _escher_web[name].lstrip('/')])
    # links
    elif name in _links:
        if source=='local':
            raise Exception('Source cannot be "local" for external links')
        return protocol + _links[name]
    # local dependencies
    elif name in _dependencies and source == 'local':
        if local_host is not None:
            return apply_local_host(_dependencies[name])
        return _dependencies[name]
    # cdn dependencies
    elif name in _dependencies_cdn and source == 'web':
        return protocol + _dependencies_cdn[name]

    raise Exception('name not found')
