from __future__ import print_function, unicode_literals

from escher.plots import Builder
from escher.urls import get_url
from escher.version import __version__
from escher.urls import top_directory, root_directory

from os.path import join, dirname, realpath
from jinja2 import Environment, PackageLoader
import shutil

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

def generate_static_site():
    print('Generating static site at %s' % top_directory)

    # index file
    template = env.get_template('homepage.html')

    def static_rel(path):
        return 'py/' + path

    data = template.render(d3=static_rel(get_url('d3', 'local')),
                           boot_css=static_rel(get_url('boot_css', 'local')),
                           homepage_css=static_rel(get_url('homepage_css', 'local')),
                           favicon=static_rel(get_url('favicon', 'local')),
                           logo=static_rel(get_url('logo', 'local')),
                           documentation=get_url('documentation', protocol='https'),
                           github=get_url('github', protocol='https'),
                           github_releases=get_url('github_releases', protocol='https'),
                           homepage_js=static_rel(get_url('homepage_js', 'local')),
                           version=__version__,
                           map_download_url=get_url('map_download', 'local'),
                           web_version=True,
                           server_index_url=static_rel(get_url('server_index', 'local')))

    with open(join(top_directory, 'index.html'), 'wb') as f:
        f.write(data.encode('utf-8'))

    # viewer and builder
    # make the builder
    builder = Builder(safe=True, id='static_map')

    filepath = join(top_directory, 'builder')
    with open(join(root_directory, get_url('server_index', source='local')), 'r') as f:
        index_json = f.read()
    html = builder.save_html(filepath=filepath,
                             overwrite=True,
                             js_source='local',
                             protocol=None,
                             minified_js=True,
                             static_site_index_json=index_json)

    # copy over the source maps
    escher_map = get_url('escher_min', 'local') + '.map'
    builder_css_map = get_url('builder_css_min', 'local') + '.map'
    shutil.copy(join(root_directory, escher_map), join(top_directory, 'builder', escher_map))
    shutil.copy(join(root_directory, builder_css_map), join(top_directory, 'builder', builder_css_map))


if __name__=='__main__':
    generate_static_site()
