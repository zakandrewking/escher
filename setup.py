from sys import argv
from subprocess import call

try:
    from setuptools import setup
except:
    from distutils.core import setup

def clean():
    call(['rm', 'escher.js'])
    call(['rm', 'escher.min.js'])

def build():
    call("bin/r.js -o js/build.js".split(' '))
    call("bin/r.js -o js/build.min.js".split(' '))
    print 'done building'

if 'clean' in argv:
    clean()
    
if 'build' in argv or 'install' in argv:
    clean()
    build()

if 'install' in argv:
    version = __import__('escher').__version__
    setup(name='Escher',
          version=version,
          author='Zachary King',
          url='http://zakandrewking.github.io/escher/',
          packages=['escher'],
          package_data={'escher': ['js/*', 'css/*', 'templates/*']})
