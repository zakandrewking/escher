from escher.urls import get_url, names, root_directory
from escher.version import __version__, __schema_version__, __map_model_version__
import os
from os.path import join, exists

from pytest import raises

def test_online():
    url = get_url('escher', source='web', protocol='https')
    assert url == 'https://unpkg.com/escher-vis@%s/dist/escher.js' % __version__

def test_no_protocol():
    url = get_url('escher', 'web')
    assert url == '//unpkg.com/escher-vis@%s/dist/escher.js' % __version__

def test_local():
    url = get_url('escher_min', 'local')
    assert url == 'escher/static/escher/escher.min.js'
    assert exists(join(root_directory, url))

def test_localhost():
    url = get_url('escher', source='local', local_host='http://localhost:7778/')
    assert url == 'http://localhost:7778/escher/static/escher/escher.js'

def test_download():
    url = get_url('server_index', source='local')
    assert url == '../' + __schema_version__ + '/' + __map_model_version__ + '/index.json'
    url = get_url('map_download', protocol='https')
    assert url == 'https://escher.github.io/%s/%s/maps/' % (__schema_version__, __map_model_version__)

def test_bad_url():
    with raises(Exception):
        get_url('bad-name')
    with raises(Exception):
        get_url('d3', source='bad-source')
    with raises(Exception):
        get_url('d3', protocol='bad-protocol')
