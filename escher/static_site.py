from escher.plots import Builder
from escher.urls import get_url

from os.path import join, dirname, realpath
from jinja2 import Environment, PackageLoader

from escher.version import __version__

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def generate_static_site():
    build_path = realpath(join(dirname(realpath(__file__)), '..'))
    print 'Generating static site at %s' % build_path

    # index file
    template = env.get_template('index.html')

    def add_escher(url):
        return 'escher/' + url
    
    data = template.render(d3=add_escher(get_url('d3', 'local')),
                           index_css=add_escher(get_url('index_css', 'local')),
                           logo=add_escher(get_url('logo', 'local')),
                           index_js=add_escher(get_url('index_js', 'local')),
                           index_gh_pages_js=add_escher(get_url('index_gh_pages_js', 'local')),
                           boot_css=add_escher(get_url('boot_css', 'local')),
                           github=get_url('github', protocol='https'),
                           data='null',
                           version=__version__,
                           web_version=True)
    
    with open(join(build_path, 'index.html'), 'w') as f:
        f.write(data)

    # viewer and builder
    for kind in ['viewer', 'builder']:
        for minified_js in [True, False]:
            js_source = 'web'
            enable_editing = (kind=='builder')

            # make the builder        
            builder = Builder(safe=True, id='static')
            
            filepath = join(build_path,
                            '%s%s.html' % (kind, '' if minified_js else '_not_minified'))
            html = builder.save_html(filepath=filepath,
                                     js_source=js_source,
                                     minified_js=minified_js,
                                     enable_editing=enable_editing,
                                     js_url_parse=True)
    
if __name__=='__main__':
    generate_static_site()
