from escher import Builder
from escher.escher import get_maps_cache_dir
import os

def test_get_cache_dir():
    d = get_maps_cache_dir()
    assert os.path.isdir(d)

def test_Builder():
    b = Builder()
    b.embedded_html()
    b.standalone_html()
