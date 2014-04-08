from escher import Builder
from escher.plots import get_cache_dir
import os

def test_get_cache_dir():
    d = get_cache_dir()
    assert os.path.isdir(d)

def test_Builder():
    b = Builder(map_json="ccc", model_json="asss")
    b.embedded_html()
    b.standalone_html()
