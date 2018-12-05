# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

from escher import __schema_version__, __map_model_version__
from escher import Builder
from escher.plots import (
    _load_resource,
    server_index,
    model_json_for_name,
    map_json_for_name,
)
from escher.urls import get_url

import base64
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


@mark.web
def test_server_index():
    index = server_index()
    map_0 = index['maps'][0]
    assert 'organism' in map_0
    assert 'map_name' in map_0
    model_0 = index['models'][0]
    assert 'organism' in model_0
    assert 'model_name' in model_0


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
    val = _load_resource(join(directory, 'example.json'), 'name').strip()
    assert val == '{"r": "val"}'


def test_load_resource_invalid_file(tmpdir):
    with raises(ValueError) as err:
        p = join(str(tmpdir), 'dummy')
        with open(p, 'w') as f:
            f.write('dummy')
        _load_resource(p, 'name')
        assert 'not a valid json file' in err.value


@mark.web
def test_load_resource_web(tmpdir):
    url = '/'.join([get_url('map_download'),
                    'Escherichia%20coli/iJO1366.Central%20metabolism.json'])
    _ = json.loads(_load_resource(url, 'name'))


def test_save_html(tmpdir):
    # ok with embedded_css arg
    b = Builder(map_json='"useless_map"', model_json='"useless_model"',
                embedded_css='')
    filepath = join(str(tmpdir), 'builder.html')
    b.save_html(filepath)

    def look_for_string(st, substring):
        """Look for the string in the substring. This solves a bug in py.test
        for these cases"""
        try:
            found = st.find(substring)
            assert found > -1
        except AssertionError:
            raise AssertionError('Could not find\n\n%s\n\nin\n\n%s' %
                                 (substring, st))

    # no static parse, local
    with open(filepath, 'r') as f:
        html = f.read()

    look_for_string(
        html,
        'map_data: JSON.parse(b64DecodeUnicode(\'InVzZWxlc3NfbWFwIg==\')),',
    )
    look_for_string(
        html,
        'model_data: JSON.parse(b64DecodeUnicode(\'InVzZWxlc3NfbW9kZWwi\')),',
    )
    look_for_string(
        html,
        'escher.Builder(data.map_data, data.model_data, ',
    )


def test_Builder_options():
    b = Builder(embedded_css='')
    b.set_metabolite_no_data_color('white')
    assert b.metabolite_no_data_color == 'white'
