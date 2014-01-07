from visbio import get_maps_cache_dir, get_style, Map
import os

def test_get_cache_dir():
    d = get_maps_cache_dir()
    assert os.path.isdir(d)

def test_get_style():
    s = get_style()
    assert type(s) is str
    len(s) > 0

def test_Map():
    m = Map()
