from sys import argv
import pandas
import json, warnings, csv, re

def dump_json(in_file):
    """ convert csv file to json, and take care of _f and _b from pFBA
    """
    out_file = in_file.replace('tsv','json')
    df = pandas.read_csv(in_file, sep="\t", header=0)
    df = df.dropna(axis=0, how='any')
    x = []
    for row in df.itertuples():
        x.append([row[1], row[2]])
    with open(out_file,'w') as file:
        json.dump(x, file)
    return out_file

if __name__ == '__main__':
    if len(argv) < 2:
        warnings.warn('python tsv_to_json.py in_file')
    in_file = argv[1]
    dump_json(in_file)
