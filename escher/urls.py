from version import __version__

# TODO remove all os.path.join when using urls

_escher = {
    'builder_embed_css': 'css/builder-embed.css',
    'builder_css': 'css/builder.css',
    'escher': 'lib/escher.%s.js' % __version__,
    'escher_min': 'lib/escher.%s.min.js' % __version__,
    'logo': 'resources/escher-logo@2x.png',
    'index_js': 'js/web/index.js',
    'index_gh_pages_js': 'js/web/index_gh_pages.js',
    'index_css': 'css/index.css',
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
    'escher_root': '//zakandrewking.github.io/escher',
    'escher_src': '//zakandrewking.github.io/escher/escher',
    'escher_home': '//zakandrewking.github.io/escher',
    'github': '//github.com/zakandrewking/escher',
    }
    
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

def model_name_to_url(name, protocol='https'):
    """Convert short name to url.

    """
    parts = name.split(':')
    if len(parts) != 2:
        raise Exception('Bad model name')
    longname = '/'.join(['organisms', parts[0], 'models', parts[1]+'.json'])
    return '/'.join([get_url('escher_root', source='web', protocol=protocol), longname])

def map_name_to_url(name, protocol='https'):
    """Convert short name to url

    """
    parts = name.split(':')
    if len(parts) != 3:
        raise Exception('Bad map name')
    longname = '/'.join(['organisms', parts[0], 'models', parts[1], 'maps', parts[2]+'.json'])
    return '/'.join([get_url('escher_root', source='web', protocol=protocol), longname])
