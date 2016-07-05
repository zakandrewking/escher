from __future__ import print_function, unicode_literals

from escher import __schema_version__, __map_model_version__
import escher.server
from escher import Builder, get_cache_dir, clear_cache
from escher.plots import (_load_resource, local_index, server_index,
                          model_json_for_name, map_json_for_name)

from escher.urls import get_url

import os
import sys
from os.path import join, basename
import json
from pytest import raises, mark
try:
    from urllib.error import URLError
except ImportError:
    from urllib2 import URLError

if sys.version < '3':
    unicode_type = unicode
else:
    unicode_type = str

# cache

def test_get_cache_dir():
    d = get_cache_dir(versioned=False)
    assert os.path.isdir(d)
    assert basename(d) != __map_model_version__
    d = get_cache_dir()
    assert os.path.isdir(d)
    assert basename(d) == __map_model_version__
    assert __schema_version__ in d
    d = get_cache_dir(name='maps')
    assert os.path.isdir(d)

def test_clear_cache(tmpdir, request):
    (tmpdir.mkdir('2').mkdir('maps').mkdir('Escherichia coli')
     .join('iJO1366.Central metabolism.json').write('temp'))
    (tmpdir.join('2').mkdir('models').mkdir('Escherichia coli')
     .join('iJO1366.json').write('temp'))
    (tmpdir.mkdir('x').mkdir('y').mkdir('z'))
    clear_cache(str(tmpdir), ask=False)
    assert os.listdir(str(tmpdir)) == []
    def fin():
        tmpdir.remove()
    request.addfinalizer(fin)

def test_local_index(tmpdir, request):
    maps = tmpdir.mkdir('maps')
    maps.mkdir('Escherichia coli').join('iJO1366.Central metabolism.json').write('temp')
    # ignore these
    maps.join('ignore_md.json').write('ignore')
    tmpdir.mkdir('models').mkdir('Escherichia coli').join('iJO1366.json').write('temp')
    assert local_index(str(tmpdir)) == { 'maps': [ { 'organism': 'Escherichia coli',
                                                     'map_name': 'iJO1366.Central metabolism' } ],
                                         'models': [ { 'organism': 'Escherichia coli',
                                                       'model_name': 'iJO1366' } ] }
    def fin():
        tmpdir.remove()
    request.addfinalizer(fin)

# server

@mark.web
def test_server_index():
    index = server_index()
    map_0 = index['maps'][0]
    assert 'organism' in map_0
    assert 'map_name' in map_0
    model_0 = index['models'][0]
    assert 'organism' in model_0
    assert 'model_name' in model_0

# model and maps

def test_model_json_for_name(tmpdir):
    models = tmpdir.mkdir('models')
    models.mkdir('Escherichia coli').join('iJO1366.json').write('"temp"')
    json = model_json_for_name('iJO1366', cache_dir=str(tmpdir))
    assert json == '"temp"'

@mark.web
def test_model_json_for_name_web(tmpdir):
    data = model_json_for_name('iJO1366', cache_dir=str(tmpdir))
    assert 'reactions' in data
    assert 'metabolites' in data

def test_map_json_for_name(tmpdir):
    maps = tmpdir.mkdir('maps')
    maps.mkdir('Escherichia coli').join('iJO1366.Central metabolism.json').write('"temp"')
    json = map_json_for_name('iJO1366.Central metabolism', cache_dir=str(tmpdir))
    assert json == '"temp"'

@mark.web
def test_map_json_for_name_web(tmpdir):
    data = map_json_for_name('iJO1366.Central metabolism', cache_dir=str(tmpdir))
    root = get_url('escher_root', protocol='https').rstrip('/')
    assert json.loads(data)[0]['schema'] == '/'.join([root, 'escher', 'jsonschema',
                                                      __schema_version__ + '#'])

# helper functions

def test_load_resource_json(tmpdir):
    test_json = '{"r": "val"}'
    assert _load_resource(test_json, 'name') == test_json

def test_load_resource_long_json(tmpdir):
    # this used to fail on Windows with Python 3
    test_json = '{"r": "' + ('val' * 100000) + '"}'
    assert _load_resource(test_json, 'name') == test_json

def test_load_resource_directory(tmpdir):
    directory = os.path.abspath(os.path.dirname(__file__))
    assert _load_resource(join(directory, 'example.json'), 'name').strip() == '{"r": "val"}'

def test_load_resource_invalid_file(tmpdir):
    with raises(ValueError) as err:
        p = join(str(tmpdir), 'dummy')
        with open(p, 'w') as f:
            f.write('dummy')
        _load_resource(p, 'name')
        assert 'not a valid json file' in err.value

@mark.web
def test_load_resource_web(tmpdir):
    url = '/'.join([get_url('map_download', protocol='https'),
                    'Escherichia%20coli/iJO1366.Central%20metabolism.json'])
    _ = json.loads(_load_resource(url, 'name'))

def test_Builder(tmpdir):
    # ok with embedded_css arg
    b = Builder(map_json='{"r": "val"}', model_json='{"r": "val"}', embedded_css='')
    # b.display_in_notebook(js_source='local')
    b.save_html(join(str(tmpdir), 'Builder.html'), js_source='local')

    # test options
    with raises(Exception):
        b._get_html(js_source='devv')
    with raises(Exception):
        b._get_html(menu='')
    with raises(Exception):
        b._get_html(scroll_behavior='asdf')
    b._get_html(js_source='local')
    b._get_html(menu='all')
    b._get_html(scroll_behavior='zoom')

@mark.web
def test_Builder_download():
    # download
    b = Builder(map_name='iJO1366.Central metabolism',
                model_name='iJO1366')
    assert b.loaded_map_json is not None
    assert b.loaded_model_json is not None
    b._get_html(js_source='web')
    # b.display_in_notebook(height=200)

    # data
    b = Builder(map_name='iJO1366.Central metabolism',
                model_name='iJO1366',
                reaction_data=[{'GAPD': 123}, {'GAPD': 123}])
    b = Builder(map_name='iJO1366.Central metabolism',
                model_name='iJO1366',
                metabolite_data=[{'nadh_c': 123}, {'nadh_c': 123}])
    b = Builder(map_name='iJO1366.Central metabolism',
                model_name='iJO1366',
                gene_data=[{'gapA': 123}, {'adhE': 123}])

    assert type(b.the_id) is unicode_type
    assert len(b.the_id) == 10

def test_Builder_options():
    b = Builder(embedded_css='')
    b.set_metabolite_no_data_color('white')
    assert b.metabolite_no_data_color=='white'
    html = b._get_html(js_source='local')
    assert '"metabolite_no_data_color": "white"' in html


def test__get_html():
    b = Builder(map_json='"useless_map"', model_json='"useless_model"',
                embedded_css='')

    def look_for_string(st, substring):
        """Look for the string in the substring. This solves a bug in py.test
        for these cases"""
        try:
            found = st.find(substring)
            assert found > -1
        except AssertionError:
            raise AssertionError('Could not find\n\n%s\n\nin\n\n%s' % (substring, st))

    # no static parse, local
    html = b._get_html(js_source='local')
    look_for_string(html, 'map_data: JSON.parse(\'"useless_map"\'),')
    look_for_string(html, 'model_data: JSON.parse(\'"useless_model"\'),')
    look_for_string(html, 'escher.Builder(t_map_data, t_model_data, data.builder_embed_css,')

    # static parse, not dev
    static_index = '{"my": ["useless", "index"]}'
    html = b._get_html(static_site_index_json=static_index, protocol='https')
    look_for_string(html, 'map_data: JSON.parse(\'"useless_map"\'),')
    look_for_string(html, 'model_data: JSON.parse(\'"useless_model"\'),')
    look_for_string(html, 'map_download_url: JSON.parse(\'"https://escher.github.io/%s/%s/maps/"\'),' % (__schema_version__, __map_model_version__))
    look_for_string(html, 'model_download_url: JSON.parse(\'"https://escher.github.io/%s/%s/models/"\'),' % (__schema_version__, __map_model_version__))
    look_for_string(html, static_index)
    look_for_string(html, 'escher.Builder(t_map_data, t_model_data, data.builder_embed_css,')
