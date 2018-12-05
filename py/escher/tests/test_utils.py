# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

import base64
import json

from escher.util import b64dump


def b64decode(str):
    return base64.b64decode(str.encode('utf-8')).decode('utf-8')


def test_b64dump():
    assert b64decode(b64dump(None)) == 'null'
    accented_str = 'árvíztűrő tükörfúrógép'
    assert b64decode(b64dump(accented_str)) == accented_str
    obj = {'foo': 1, 'bar': 2}
    assert json.loads(b64decode(b64dump(obj))) == obj
