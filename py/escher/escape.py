# -*- coding: utf-8 -*-

import json


def _escape_for_embedding(json_string):
    return json_string.replace('\\', '\\\\').replace("'", "\\'")

def escape_json_or_null(json_string):
    """Escape the JSON string. If None, then return JSON 'null'."""
    if json_string is None:
        return json.dumps(None)
    else:
        return _escape_for_embedding(json_string)

def json_dump_and_escape(data):
    return _escape_for_embedding(json.dumps(data))
