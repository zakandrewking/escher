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
