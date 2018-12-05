from escher.urls import (
    get_url,
    get_filepath,
    root_directory,
)
from escher.version import (
    __version__,
    __schema_version__,
    __map_model_version__,
)
from os.path import join, exists
from pytest import raises


def test_online():
    url = get_url('escher')
    assert url == 'https://unpkg.com/escher@%s/dist/escher.js' % __version__


def test_local():
    assert exists(get_filepath('map_jsonschema'))


def test_index_url():
    url = get_url('server_index')
    assert url == ('https://escher.github.io/%s/%s/index.json' %
                   (__schema_version__, __map_model_version__))


def test_map_download_url():
    url = get_url('map_download')
    assert url == ('https://escher.github.io/%s/%s/maps/' %
                   (__schema_version__, __map_model_version__))


def test_bad_url():
    with raises(Exception):
        get_url('bad-name')
