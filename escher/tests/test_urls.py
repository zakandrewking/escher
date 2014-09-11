from escher.urls import get_url, names, model_name_to_url, map_name_to_url
from escher.server import directory
from os.path import join, exists

from pytest import raises

def test_urls():
    # online
    url = get_url('builder_embed_css', source='web', protocol='https')
    assert url == 'https://zakandrewking.github.io/escher/escher/css/builder-embed.css'

    # no protocol
    url = get_url('index_js', 'web')
    assert url == '//zakandrewking.github.io/escher/escher/js/web/index.js'

    # local
    url = get_url('require_js', 'local')
    assert url == 'lib/require.min.js'
    assert exists(join(directory, url))

    # localhost
    url = get_url('require_js', source='local', local_host='http://localhost:7778/')
    assert url == 'http://localhost:7778/lib/require.min.js'

    # cdn
    url = get_url('boot_js', 'web')
    assert url == '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js'
    
    # raises
    with raises(Exception):
        get_url('bad-name')
    with raises(Exception):
        get_url('d3', source='bad-source')
    with raises(Exception):
        get_url('d3', protocol='bad-protocol')

def test_model_name_to_url():
    url = model_name_to_url('e_coli:iJO1366')
    assert url == 'https://zakandrewking.github.io/escher/organisms/e_coli/models/iJO1366.json'

def test_map_name_to_url():
    url = map_name_to_url('e_coli:iJO1366:central_metabolism', protocol='http')
    assert url == 'http://zakandrewking.github.io/escher/organisms/e_coli/models/iJO1366/maps/central_metabolism.json'
