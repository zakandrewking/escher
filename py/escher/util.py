import base64
import json
import sys

# user input for python 2 and 3
try:
    import __builtin__
    input = getattr(__builtin__, 'raw_input')
except (ImportError, AttributeError):
    pass

def query_yes_no(question):
    """Ask a yes/no question via input() and return their answer.

    Returns True for yes or False for no.

    Arguments
    ---------

    question: A string that is presented to the user.


    Adapted from http://stackoverflow.com/questions/3041986/python-command-line-yes-no-input.

    """
    valid = {"yes": True, "y": True, "ye": True,
             "no": False, "n": False}
    prompt = " [y/n] "

    while True:
        sys.stdout.write(question + prompt)
        choice = input().lower()
        try:
            return valid[choice]
        except KeyError:
            sys.stdout.write("Please respond with 'yes' or 'no' "
                             "(or 'y' or 'n').\n")

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
