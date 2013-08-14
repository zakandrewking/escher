from sys import argv
import shutil, os
from csv_to_json import dump_json

if len(argv) <= 1:
    raise Exception("not enough arguments");
elif len(argv) > 1:
    file1 = argv[1]
    if os.path.lexists(file1): 
        if file1.endswith('.csv'):
            file1 = dump_json(file1)
        if not file1.endswith('.json'):
            raise Exception('%s not a json file' % file1);
        print "file1: %s" % file1
        shutil.copy(file1, 'flux1.json')
    else:
        raise Exception('%s does not exist' % file1);
if len(argv) >= 3:
    file2 = argv[2]
    if os.path.lexists(file2):
        if file2.endswith('.csv'):
            file2 = dump_json(file2)
        if not file2.endswith('.json'):
            raise Exception('%s not a json file' % file2);
        print "file2: %s" % file2
        shutil.copy(file2, 'flux2.json')
    else:
        raise Exception('%s does not exist' % file2);
else:
    try:
        os.remove('flux2.json')
    except OSError:
        pass
