import json
from os import listdir
from os.path import join, dirname, realpath

directory = realpath(dirname(realpath(__file__)), '..')

index_directories = ['maps/v1', 'models/v1']

for index_dir in index_directories:
    index = []
    for filename in listdir(join(directory, index_dir)):
        if filename.endswith('.json'):
            index.append(filename.replace('.json', ''))
    with open(join(directory, index_dir, 'index.json'), 'w') as f:
        json.dump(index, f)
