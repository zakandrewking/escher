from sys import argv
import json, warnings, csv, re

if len(argv) < 3:
    warnings.warn('python csv_to_json.py in_file out_file')

in_file = argv[1]
out_file = argv[2]

x = {}
with open(in_file) as file:
    for row in csv.reader(file):
        val = float(row[1])
        if val != 0:
            if re.search('_b', row[0]):
                val = -val
            id = re.sub(r'_(f|b)', '', row[0])
            x[id] = val

with open(out_file,'w') as file:
    json.dump(x,file)
