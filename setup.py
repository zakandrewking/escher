from sys import argv
from subprocess import call

try:
    from setuptools import setup
except:
    from distutils.core import setup

if 'clean' in argv:
    call(['rm', 'escher.js'])
    call(['rm', 'escher.min.js'])
    call(['rm', '-r', 'build'])
    call(['rm', '-r', 'Escher.egg-info'])
    print 'done cleaning'
    
if 'build' in argv or 'install' in argv:
    call("bin/r.js -o escher/js/build/build.js".split(' '))
    call("bin/r.js -o escher/js/build/build.min.js".split(' '))
    print 'done building'

if 'install' in argv:
    version = __import__('escher').__version__
    setup(name='Escher',
          version=version,
          author='Zachary King',
          url='http://zakandrewking.github.io/escher/',
          packages=['escher'],
          package_data={'escher': ['css/*', 'templates/*', 'example_data/*']},
          data_files=[('escher/lib', ['escher.js', 'escher.min.js',
                                      'lib/d3.v3.js', 'lib/d3.v3.min.js'])])
