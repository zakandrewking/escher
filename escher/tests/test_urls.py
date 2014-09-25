from escher.urls import get_url, names, check_name, name_to_url, url_to_name
from escher.server import directory
import os
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

    # download
    url = get_url('escher_download_rel')
    assert url == 'v1'
    url = get_url('escher_download', protocol='https')
    assert url == 'https://zakandrewking.github.io/escher/v1'
    
    # raises
    with raises(Exception):
        get_url('bad-name')
    with raises(Exception):
        get_url('d3', source='bad-source')
    with raises(Exception):
        get_url('d3', protocol='bad-protocol')

def test_check_name():
    # invalid characters
    with raises(Exception) as e:
        check_name('e_coli.iJO1366<')
    with raises(Exception):
        check_name('e_coli.iJO1366/')
    with raises(Exception):
        check_name('e_coli.iJO1366:')
    with raises(Exception):
        check_name('e_coli.iJO1366*')
    check_name('e_coli.iJO1366')

def test_name_to_url():
    url = name_to_url('e_coli.iJO1366')
    assert url == 'https://zakandrewking.github.io/escher/v1/organisms/e_coli/models/iJO1366.json'
    url = name_to_url('e_coli.iJO1366.central_metabolism', protocol='http')
    assert url == 'http://zakandrewking.github.io/escher/v1/organisms/e_coli/models/iJO1366/maps/central_metabolism.json'

    # too short
    with raises(Exception):
        name_to_url('e_coli')

def test_url_to_name():
    name = url_to_name('https://zakandrewking.github.io/escher/v1/organisms/e_coli/models/iJO1366_organisms.json')
    assert name == 'e_coli.iJO1366_organisms'
    name = url_to_name('http://zakandrewking.github.io/escher/v1/organisms/e_coli/models/iJO1366/maps/central_metabolism.json')
    assert name == 'e_coli.iJO1366.central_metabolism'
    name = url_to_name('v1/organisms/e_coli/models/iJO1366/maps/central_metabolism.json')
    assert name == 'e_coli.iJO1366.central_metabolism'
