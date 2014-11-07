import escher.server
from escher import (Builder, get_cache_dir, clear_cache, list_cached_maps,
                    list_cached_models)
from escher.plots import load_resource
from escher.urls import get_url

import os
from os.path import join
import json
from pytest import raises, mark 
from urllib2 import URLError

def test_get_cache_dir():
    d = get_cache_dir()
    assert os.path.isdir(d)
    d = get_cache_dir(name='maps')
    assert os.path.isdir(d)

# These are generally not run, because I don't want to casually loosen my cache

# def test_clear_cache():
#     clear_cache()
#     d = get_cache_dir(name='maps')
#     assert len(os.listdir(d)) == 0
#     d = get_cache_dir(name='models')
#     assert len(os.listdir(d)) == 0

# def test_list_cached_maps():
#     clear_cache()
#     Builder(map_name='iJO1366_central_metabolism')
#     assert list_cached_maps() == ['iJO1366_central_metabolism']

# def test_list_cached_models():
#     clear_cache()
#     Builder(model_name='iJO1366')
#     assert list_cached_models() == ['iJO1366']
    
def test_load_resource(tmpdir):
    assert load_resource('{"r": "val"}', 'name') == '{"r": "val"}'
    
    directory = os.path.abspath(os.path.dirname(__file__))
    assert load_resource(join(directory, 'example.json'), 'name').strip() == '{"r": "val"}'
    
    with raises(ValueError) as err:
        p = join(str(tmpdir), 'dummy')
        with open(p, 'w') as f:
            f.write('dummy')
        load_resource(p, 'name')
        assert 'not a valid json file' in err.value

@mark.web
def test_load_resource_web(tmpdir): 
    url = '/'.join([get_url('escher_download', protocol='https'),
                    'organisms/e_coli/models/iJO1366/maps/central_metabolism.json'])
    _ = json.loads(load_resource(url, 'name'))
                
def test_Builder(tmpdir):
    b = Builder(map_json='{"r": "val"}', model_json='{"r": "val"}')
    # Cannot load dev/local version without an explicit css string property.
    # TODO include a test where these do not raise.
    with raises(Exception):
        b.display_in_notebook(js_source='dev')
    with raises(Exception):
        b.display_in_notebook(js_source='local')

    # ok with embedded_css arg
    b = Builder(map_json='{"r": "val"}', model_json='{"r": "val"}', embedded_css='')
    b.display_in_notebook(js_source='dev')
    b.save_html(join(str(tmpdir), 'Builder.html'), js_source='dev')

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
    b = Builder(map_name='e_coli.iJO1366.central_metabolism',
                model_name='e_coli.iJO1366')
    assert b.loaded_map_json is not None
    assert b.loaded_model_json is not None
    b._get_html(js_source='web')
    b.display_in_notebook(height=200)

    # data
    b = Builder(map_name='e_coli.iJO1366.central_metabolism',
                model_name='e_coli.iJO1366',
                reaction_data=[{'GAPD': 123}, {'GAPD': 123}])
    b = Builder(map_name='e_coli.iJO1366.central_metabolism',
                model_name='e_coli.iJO1366',
                metabolite_data=[{'nadh_c': 123}, {'nadh_c': 123}])
    b = Builder(map_name='e_coli.iJO1366.central_metabolism',
                model_name='e_coli.iJO1366',
                gene_data=[{'gapA': 123}, {'adhE': 123}])

    assert type(b.the_id) is unicode
    assert len(b.the_id) == 10

def test_Builder_options():
    b = Builder(embedded_css='')
    b.set_metabolite_no_data_color('white')
    assert b.metabolite_no_data_color=='white'
    html = b._get_html(js_source='local')
    assert 'metabolite_no_data_color: "white"' in html

def test_Builder_kwargs():
    b = Builder(quick_jump=['new_map'])
    assert b.quick_jump == ['new_map']
