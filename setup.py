from sys import argv
from subprocess import call
import threading
import webbrowser
import os
from os.path import join, dirname, realpath
from glob import glob
    
try:
    from setuptools import setup, Command
except:
    from distutils.core import setup, Command

directory = dirname(realpath(__file__))
version = __import__('escher').__version__
escher = 'escher.%s.js'%version
escher_min = 'escher.%s.min.js'%version
port = 8789

class CleanCommand(Command):
    description = "Custom clean command that removes escher lib files"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        call(['rm', '-rf', join(directory, 'build')])
        call(['rm', '-rf', join(directory, 'dist')])
        for f in glob(join(directory, 'escher/lib/escher.*.js')):
            os.remove(f)
        print 'done cleaning'

class JSBuildCommand(Command):
    description = "Custom build command that generates escher lib files"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        call([join(directory, 'bin/r.js'), '-o', 'escher/js/build/build.js',
              'out=escher/lib/%s'%escher, 'optimize=none'])
        call([join(directory, 'bin/r.js'), '-o', 'escher/js/build/build.js',
              'out=escher/lib/%s'%escher_min, 'optimize=uglify'])
        print 'done building'

class TestCommand(Command):
    description = "Custom test command that runs pytest and jasmine"
    user_options = [('jsonly', None, 'Only run jasmine tests'),
                    ('pyonly', None, 'Only run pytest')]
    def initialize_options(self):
        self.jsonly = False
        self.pyonly = False
    def finalize_options(self):
        pass
    def run(self):
        if not self.jsonly:
            call(['py.test'])
        if not self.pyonly:
            call(['jasmine', '--port=%d' % port])
        
setup(name='Escher',
      version=version,
      author='Zachary King',
      url='http://zakandrewking.github.io/escher/',
      packages=['escher'],
      package_data={'escher': ['css/*', 'templates/*', 'example_data/*',
                               'lib/*.js', 'lib/*.css', 'lib/fonts/*',
                               'resources/*']},
      cmdclass={'clean': CleanCommand,
                'buildjs': JSBuildCommand,
                'test': TestCommand})
