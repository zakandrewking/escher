from __future__ import print_function, unicode_literals

from escher.plots import Builder
from escher.urls import get_url
from escher.version import __version__, __schema_version__
from escher.urls import root_directory

from os.path import join, dirname, realpath
from jinja2 import Environment, PackageLoader

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def generate_static_site():
    print('Generating static site at %s' % root_directory)

    # index file
    template = env.get_template('index.html')
    
    data = template.render(d3=get_url('d3', 'local'),
                           boot_css=get_url('boot_css', 'local'),
                           index_css=get_url('index_css', 'local'),
                           favicon=get_url('favicon', 'local'),
                           logo=get_url('logo', 'local'),
                           documentation=get_url('documentation', protocol='https'),
                           github=get_url('github', protocol='https'),
                           index_js=get_url('index_js', 'local'),
                           index_gh_pages_js=get_url('index_gh_pages_js', 'local'),
                           version=__version__,
                           map_download=get_url('map_download', 'local'),
                           web_version=True,
                           server_index_url=get_url('server_index', 'local'),
                           # server_index=
                           # local_index=
                           can_dev=False,
                           # can_dev_js=
                           )
    
    with open(join(root_directory, 'index.html'), 'w') as f:
        f.write(data.encode('utf-8'))

    # viewer and builder
    for kind in ['viewer', 'builder']:
        for minified_js in [True, False]:
            js_source = 'local'
            enable_editing = (kind=='builder')

            # make the builder
            with open(join(root_directory, get_url('builder_embed_css', 'local')), 'r') as f:
                css = f.read()
            builder = Builder(embedded_css=css, safe=True, id='static')
            
            filepath = join(root_directory,
                            '%s%s.html' % (kind, '' if minified_js else '_not_minified'))
            with open(join(root_directory, get_url('server_index', source='local')), 'r') as f:
                index_json = f.read()
            html = builder.save_html(filepath=filepath,
                                     js_source=js_source,
                                     minified_js=minified_js,
                                     enable_editing=enable_editing,
                                     static_site_index_json=index_json)
    
if __name__=='__main__':
    generate_static_site()
