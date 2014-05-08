from sys import argv
from subprocess import call
import threading
import webbrowser

try:
    from setuptools import setup
except:
    from distutils.core import setup

version = __import__('escher').__version__
escher = 'escher.%s.js'%version
escher_min = 'escher.%s.min.js'%version
port = 8789
    
if 'clean' in argv:
    call(['rm', escher])
    call(['rm', escher_min])
    call(['rm', '-r', 'build'])
    call(['rm', '-r', 'Escher.egg-info'])
    print 'done cleaning'

if 'test' in argv or 'build' in argv or 'install' in argv or 'jasmine' in argv:
    call(['bin/r.js', '-o', 'escher/js/build/build.js',
          'out=%s'%escher, 'optimize=none'])
    
if 'build' in argv or 'install' in argv:
    call(['bin/r.js', '-o', 'escher/js/build/build.js',
          'out=%s'%escher_min, 'optimize=uglify'])
    print 'done building'

if 'install' in argv:
    setup(name='Escher',
          version=version,
          author='Zachary King',
          url='http://zakandrewking.github.io/escher/',
          packages=['escher'],
          package_data={'escher': ['css/*', 'templates/*', 'example_data/*']},
          data_files=[('escher/lib', [escher, escher_min,
                                      'lib/d3.v3.js', 'lib/d3.v3.min.js'])])

if 'test' in argv or 'pytest' in argv:
    call(['py.test'])
if 'test' in argv or 'jasmine' in argv:
    call(['jasmine', '--port=%d' % port])
