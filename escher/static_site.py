from escher.plots import Builder
from escher import urls

from os.path import join, dirname, realpath
from jinja2 import Environment, PackageLoader

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def generate_static_site():
    build_path = realpath(join(dirname(realpath(__file__)), '..'))
    print 'Generating static site at %s' % build_path

    # index file
    template = env.get_template('index.html')
    
    data = template.render(jquery=urls.jquery_local,
                           boot_css=urls.boot_css_local,
                           index_css=urls.index_css_local,
                           logo=urls.logo_local,
                           github=urls.github,
                           index_js=urls.index_js_local,
                           index_gh_pages_js=urls.index_gh_pages_js_local,
                           models=[],
                           maps=[],
                           web_version=True)
    
    with open(join(build_path, 'index.html'), 'w') as f:
        f.write(data)

    # viewer and builder
    for kind in ['viewer', 'builder']:
        for minified_js in [True, False]:
            js_source = 'web'
            enable_editing = (kind=='builder')

            # make the builder        
            builder = Builder(safe=True)
            
            filepath = join(build_path,
                            '%s%s.html' % (kind, '' if minified_js else '_not_minified'))
            html = builder.save_html(filepath=filepath,
                                     js_source=js_source,
                                     minified_js=minified_js,
                                     enable_editing=enable_editing,
                                     js_url_parse=True)
    
if __name__=='__main__':
    generate_static_site()
