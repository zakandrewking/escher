from sys import argv
import os
import json
import gzip

ids = set()
    
def main():
    directory = argv[1]
    for filename in os.listdir(directory):
        if filename.endswith('.json') or filename.endswith('.json.gz'):
            identify_compartments(ids, os.path.join(directory, filename))

        print ", ".join(ids)
        
def identify_compartments(ids, filename):
    if filename.endswith('.json.gz'):
        with gzip.open(in_file, "r") as f:
            data = json.load(f)
    else:
        with open(filename, "r") as f:
            data = json.load(f)

    try:
        nodes = data['MAPNODE']
    except KeyError:
        return
            
    for node in nodes:
        try:
            ids.add(node['MAPNODECOMPARTMENT_ID'])
        except KeyError:
            pass

if __name__=='__main__':
    main()    
