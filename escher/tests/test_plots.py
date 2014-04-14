from escher import Builder
from escher.plots import get_cache_dir, load_resource, clear_cache

import os
from os.path import join
import json
from pytest import raises
from urllib2 import URLError

def test_get_cache_dir():
    d = get_cache_dir()
    assert os.path.isdir(d)

def test_clear_cache():
    clear_cache()
    d = get_cache_dir()
    assert len(os.listdir(d)) == 0
    
def test_load_resource(tmpdir):
    assert load_resource('{"r": "val"}', 'name') == '{"r": "val"}'
    assert load_resource('example.json', 'name').strip() == '{"r": "val"}'
    
    url = "https://zakandrewking.github.io/escher/maps/v1/glycolysis_tca.json"
    _ = json.loads(load_resource(url, 'name'))
        
    with raises(URLError):
        load_resource("http://asodivhowef", 'name')
       
    with raises(URLError):
        load_resource("https://asodivhowef", 'name')

    with raises(ValueError) as err:
        p = join(str(tmpdir), 'dummy')
        with open(p, 'w') as f:
            f.write('dummy')
        load_resource(p, 'name')
        assert 'not a valid json file' in err.value

def test_Builder():
    b = Builder(map_json='{"r": "val"}', model_json='{"r": "val"}')
    b.embedded_html(dev=True, enable_editing=True, height=100)
    b.standalone_html(dev=True)
    b.display_in_notebook(height=200)

    # download
    b = Builder(map_name='glycolysis_tca', model_name='iJO1366')
    assert b.loaded_map_json is not None
    assert b.loaded_model_json is not None
    b.embedded_html(dev=True, enable_editing=True, height=100)
    b.standalone_html(dev=True)
    b.display_in_notebook(height=200)
