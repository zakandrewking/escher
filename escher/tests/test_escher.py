from escher import Builder
from escher.escher import get_maps_cache_dir, get_embed_style
import os

def test_get_cache_dir():
    d = get_maps_cache_dir()
    assert os.path.isdir(d)

def test_get_embed_style():
    assert isinstance(get_embed_style(), str)
    
def test_Builder():
    b = Builder()
    b._repr_html_()
    b.create_standalone_html()
