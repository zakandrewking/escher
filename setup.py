from sys import argv

try:
    from setuptools import setup
except:
    from distutils.core import setup

if 'build' in argv or 'install' in argv:
    from subprocess import call
    call("bin/r.js -o js/build.js".split(' '))
    call("bin/r.js -o js/build.min.js".split(' '))
    call("mkdir escher/js".split(' '))
    call("cp escher.js escher/js/".split(' '))
    call("cp escher.min.js escher/js/".split(' '))
    call("cp js/lib/d3.v3.js escher/js/".split(' '))
    call("cp -r css escher/css".split(' '))
    call("cp -r templates escher/templates".split(' '))


if 'install' in argv:
    version = __import__('escher').__version__
    setup(name='Escher',
          version=version,
          author='Zachary King',
          url='http://zakandrewking.github.io/escher/',
          packages=['escher'],
          package_data={'escher': ['js/*', 'css/*', 'templates/*']})
