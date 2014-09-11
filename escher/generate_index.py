import json
from os import listdir
from os.path import join, dirname, realpath, exists, isdir, relpath

directory = realpath(join(dirname(realpath(__file__)), '..'))

index_directories = ['maps/v1', 'models/v1']
ignore_files = ['index.json', 'README']

for index_dir in index_directories:
    index = []
    if not exists(join(directory, index_dir)):
        print '%s does not exist' % index_dir
        continue
    for filename in listdir(join(directory, index_dir)):
        if filename.endswith('.json') and filename not in ignore_files:
            index.append(filename.replace('.json', ''))
    with open(join(directory, index_dir, 'index.json'), 'w') as f:
        json.dump(index, f)

# organism index
org_dir = join(directory, 'organisms')
org_index = []
model_index = []
map_index = []
# for all organisms
for d in listdir(org_dir):
    org_file = join(org_dir, d)
    if isdir(org_file):
        org_index.append(relpath(org_file, directory))
    # for nested models
    model_dir = join(org_file, 'models')
    if isdir(model_dir):
        for e in listdir(model_dir):
            model_file = join(model_dir, e)
            if model_file.endswith('.json') and model_file not in ignore_files:
                model_index.append(relpath(model_file, directory).replace('.json', ''))
            map_dir = join(model_file, 'maps')
            if isdir(map_dir):
                for f in listdir(map_dir):
                    map_file = join(map_dir, f)
                    if map_file.endswith('.json') and map_file not in ignore_files:
                        map_index.append(relpath(map_file, directory).replace('.json', ''))

with open(join(directory, 'index.json'), 'w') as f:
    index = {'organisms': org_index,
             'models': model_index,
             'maps': map_index}
    json.dump(index, f)
