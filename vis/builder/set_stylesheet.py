from sys import argv
import shutil

css_filename = "map.css"

if len(argv) <= 1:
    raise Exception("not enough arguments");
file1 = argv[1]

if not file1.endswith('.css'):
    raise Exception('%s not a css file' % file1);

shutil.copy(file1, css_filename)
print "copied %s to %s" % (file1, css_filename) 
