from sys import argv
from subprocess import call
import threading
import webbrowser
from os.path import join, dirname, realpath

try:
    from setuptools import setup
except:
    from distutils.core import setup

directory = dirname(realpath(__file__))
version = __import__('escher').__version__
escher = 'escher.%s.js'%version
escher_min = 'escher.%s.min.js'%version
port = 8789
    
if 'clean' in argv:
    call(['rm', join('escher/lib', escher)])
    call(['rm', join('escher/lib', escher_min)])

if 'build' in argv:
    call([join(directory, 'bin/r.js'), '-o', 'escher/js/build/build.js',
          'out=escher/lib/%s'%escher, 'optimize=none'])
    call([join(directory, 'bin/r.js'), '-o', 'escher/js/build/build.js',
          'out=escher/lib/%s'%escher_min, 'optimize=uglify'])
    print 'done building'

setup(name='Escher',
      version=version,
      author='Zachary King',
      url='http://zakandrewking.github.io/escher/',
      packages=['escher'],
      package_data={'escher': ['css/*', 'templates/*', 'example_data/*',
                               'lib/*.js', 'lib/*.css', 'lib/fonts/*',
                               'resources/*']})

if 'test' in argv:
    call(['py.test'])
    call(['jasmine', '--port=%d' % port])
