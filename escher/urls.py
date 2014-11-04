from version import __version__
from urllib import quote
import os
import re

# TODO remove all os.path.join when using urls

_escher = {
    'builder_embed_css': 'css/builder-embed-%s.css' % __version__,
    'builder_css': 'css/builder-%s.css' % __version__,
    'escher': 'lib/escher-%s.js' % __version__,
    'escher_min': 'lib/escher-%s.min.js' % __version__,
    'logo': 'resources/escher-logo@2x.png',
    'index_js': 'js/web/index.js',
    'index_gh_pages_js': 'js/web/index_gh_pages.js',
    'index_css': 'css/web/index.css',
    }
    
_dependencies = {
    'd3': 'lib/d3.min.js',
    'boot_js': 'lib/bootstrap-3.1.1.min.js',
    'boot_css': 'lib/bootstrap-3.1.1.min.css',
    'jquery': 'lib/jquery-2.1.0.min.js',
    'require_js': 'lib/require.min.js',
    'bacon': 'lib/bacon-0.7.12.min.js',
    }
    
_dependencies_cdn = {
    'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js',
    'boot_js': '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js',
    'boot_css': '//netdna.bootstrapcdn.com/bootswatch/3.1.1/simplex/bootstrap.min.css',
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js',
    'require_js': '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js',
    'bacon': '//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.12/bacon.min.js',
    }

_links = {
    'escher_download_rel': '1-0-0',
    'escher_src': '//zakandrewking.github.io/escher/escher',
    'escher_home': '//zakandrewking.github.io/escher',
    'github': '//github.com/zakandrewking/escher',
    }
_links['escher_download'] = '/'.join([_links['escher_home'],
                                      _links['escher_download_rel']])
    
# external dependencies
names = _escher.keys() + _dependencies.keys() + _links.keys()

def get_url(name, source='web', local_host=None, protocol=None):
    """Get a url.

    Arguments
    ---------

    name: The name of the URL. Options are available in urls.names.

    source: Either 'web' or 'local'. Cannot be 'local' for external links.

    protocol: The protocol can be 'http', 'https', or None which indicates a
    'protocol relative URL', as in //zakandrewking.github.io/escher. Ignored if
    source is local.

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
        return '/'.join([local_host.rstrip('/'), url])
        
    # escher
    if name in _escher:
        if source=='local':
            if local_host is not None:
                return apply_local_host(_escher[name])
            return _escher[name]
        return protocol + _links['escher_src'] + '/' + _escher[name]
    # links
    elif name in _links:
        if source=='local':
            raise Exception('Source cannot be "local" for external links')
        return protocol + _links[name]
    # local dependencies
    elif name in _dependencies and source=='local':
        if local_host is not None:
            return apply_local_host(_dependencies[name])
        return _dependencies[name]
    # cdn dependencies
    elif name in _dependencies_cdn and source=='web':
        return protocol + _dependencies_cdn[name]
    
    raise Exception('name not found')

# See the corresponding javascript implementation in escher/js/src/utils.js

def check_name(name):
    """Name cannot include:

    <>:"/\|?*

    """
    if re.search(r'[<>:"/\\\|\?\*]', name):
        raise Exception('Name cannot include the characters <>:"/\|?*')

def name_to_url(name, protocol='https'):
    """Convert short name to url. The short name is separated by '+'
    characters.

    Arguments
    ---------

    name: the shorthand name for the map or model.

    protocol: 'https' or 'http
    
    """

    check_name(name)
    
    parts = name.split('.')
    if len(parts) == 2:
        longname = '/'.join(['organisms', parts[0], 'models',
                             parts[1]+'.json'])
    elif len(parts) == 3:
        longname = '/'.join(['organisms', parts[0], 'models', parts[1], 'maps',
                             parts[2]+'.json'])
    else:
        raise Exception('Bad short name')
    return '/'.join([get_url('escher_download', source='web', protocol=protocol),
                     longname])

def url_to_name(url):
    """Convert url to short name. The short name is separated by '+' characters.

    Arguments
    ---------

    url: The url, which must contain at least 'organisms' and 'models'.

    """

    # get the section after organisms, removing the file extension
    url = re.search('(?:^|/)organisms/(.*)\.\w+', url).group(1)
    # separate
    organism, model = [x.strip('/') for x in url.split('/models/')]
    # if maps are present, separate
    if '/maps/' in model:
        model, map = [x.strip('/') for x in model.split('/maps/')]
        name = '.'.join([organism, model, map])
    else:
        name = '.'.join([organism, model])
    return name

