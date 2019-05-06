import base64
import json


def b64dump(data):
    """Returns the base64 encoded dump of the input

    Arguments
    ---------

    data: Can be a dict, a (JSON or plain) string, or None

    """
    if isinstance(data, dict):
        data = json.dumps(data)
    elif data is None:
        data = json.dumps(None)
    return base64.b64encode(data.encode('utf-8')).decode('utf-8')
