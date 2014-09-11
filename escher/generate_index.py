import json
from os import listdir
from os.path import join, dirname, realpath, exists

directory = realpath(join(dirname(realpath(__file__)), '..'))

index_directories = ['maps/v1', 'models/v1']

for index_dir in index_directories:
    index = []
    if not exists(join(directory, index_dir)):
        print '%s does not exist' % index_dir
        continue
    for filename in listdir(join(directory, index_dir)):
        if filename.endswith('.json') and filename not in ['index.json', 'README']:
            index.append(filename.replace('.json', ''))
    with open(join(directory, index_dir, 'index.json'), 'w') as f:
        json.dump(index, f)
