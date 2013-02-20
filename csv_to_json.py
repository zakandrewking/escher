from sys import argv
import json, warnings, csv, re

def dump_json(in_file):
    """ convert csv file to json, and take care of _f and _b from pFBA
    """
    out_file = in_file.replace('csv','json')
    x = {}
    with open(in_file) as file:
        for row in csv.reader(file):
            val = float(row[1])
            if val != 0:
                if re.search('_b', row[0]):
                    val = -val
                id = re.sub(r'_(f|b)', '', row[0])
                id = id.replace('swap', 'y')
                x[id] = val
    with open(out_file,'w') as file:
        json.dump(x,file)
    return out_file

if __name__ == '__main__':
    if len(argv) < 2:
        warnings.warn('python csv_to_json.py in_file')
    in_file = argv[1]
    dump_json(in_file)
