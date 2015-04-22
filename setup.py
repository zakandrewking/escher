# -*- coding: utf-8 -*-

import sys
from sys import argv
from subprocess import call
import threading
import webbrowser
import os
from shutil import copy, move, rmtree
from os.path import join, dirname, realpath, exists
from glob import glob
import re

try:
    from setuptools import setup, Command
    from setuptools.command.sdist import sdist as SDistCommand
    from setuptools.command.bdist import bdist as BDistCommand
    from setuptools.command.upload import upload as UploadCommand
except ImportError:
    from distutils.core import setup, Command

directory = dirname(realpath(__file__))
sys.path.insert(0, join(directory, 'escher'))
version = __import__('version').__version__
escher = 'escher-%s.js' % version
escher_min = 'escher-%s.min.js' % version
builder_css = 'builder-%s.css' % version
builder_embed_css = 'builder-embed-%s.css' % version
port = 8789

class CleanCommand(Command):
    description = "Custom clean command that removes static site"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        def remove_if(x):
            if exists(x): rmtree(x)
        remove_if(join(directory, 'build'))
        remove_if(join(directory, 'dist'))
        # remove site files
        for f in glob(join(directory, '*.html')):
            os.remove(f)
        for f in glob(join(directory, 'builder-*.css')):
            os.remove(f)
        for f in glob(join(directory, 'escher-*.js')):
            os.remove(f)
        print('done cleaning')

class JSBuildCommand(Command):
    description = "Custom build command that generates escher lib files"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        call(['node',
              join(directory, 'bin', 'r.js'),
              '-o', join('escher', 'js', 'build', 'build.js'),
              'out='+join('escher', 'lib', escher),
              'optimize=none'])
        call(['node',
              join(directory, 'bin', 'r.js'),
              '-o', join('escher', 'js', 'build', 'build.js'),
              'out='+join('escher', 'lib', escher_min),
              'optimize=uglify'])
        print('done building js')
        
class BuildGHPagesCommand(Command):
    description = "Custom build command that generates static site, and copies escher libs"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        # copy files to top level
        copy(join('escher', 'lib', escher), '.')
        copy(join('escher', 'lib', escher_min), '.')
        copy(join('escher', 'css', builder_css), '.')
        copy(join('escher', 'css', builder_embed_css), '.')
        copy(join('escher', 'lib', escher), 'escher-latest.js')
        copy(join('escher', 'lib', escher_min), 'escher-latest.min.js')
        copy(join('escher', 'css', builder_css), 'builder-latest.css')
        copy(join('escher', 'css', builder_embed_css), 'builder-embed-latest.css')
        # generate the static site
        call(['python', join('escher', 'generate_index.py')])
        call(['python', join('escher', 'static_site.py')])
        print('Done building gh-pages')

class BuildRelease(Command):
    description = "Make file modifications for a new release version"
    user_options = [('version=', 'v', 'The new version')]
    def initialize_options(self):
        self.version = None
    def finalize_options(self):
        if self.version is None:
            print('Usage: python setup.py build_release --version=[version_number]')
            sys.exit()
    def run(self):
        old_version = version
        new_version = self.version
        # change the version
        file = join('escher', 'version.py')
        with open(file, 'r') as f:
            lines = f.readlines()
        with open(file, 'w') as f:
            for line in lines:
                f.write(line.replace(old_version, new_version))
        # update the specs
        file = join('spec', 'javascripts', 'support', 'jasmine.yml')
        with open(file, 'r') as f:
            lines = f.readlines()
        with open(file, 'w') as f:
            for line in lines:
                f.write(line.replace('escher-%s.js' % old_version, 'escher-%s.js' % new_version)) 
        # update the docs
        file = join('docs', 'conf.py')
        with open(file, 'r') as f:
            lines = f.readlines()
        with open(file, 'w') as f:
            for line in lines:
                f.write(line
                        .replace("version = '%s'" % old_version, "version = '%s'" % new_version)
                        .replace("release = '%s'" % old_version, "release = '%s'" % new_version))
        # move the files
        move(join('escher', 'lib', 'escher-%s.js' % old_version),
             join('escher', 'lib', 'escher-%s.js' % new_version))
        move(join('escher', 'lib', 'escher-%s.min.js' % old_version),
             join('escher', 'lib', 'escher-%s.min.js' % new_version))
        move(join('escher', 'css', 'builder-%s.css' % old_version),
             join('escher', 'css', 'builder-%s.css' % new_version))
        move(join('escher', 'css', 'builder-embed-%s.css' % old_version),
             join('escher', 'css', 'builder-embed-%s.css' % new_version))
        print('Done building release %s' % new_version)

class BuildDocs(Command):
    description = "Build the sphinx documentation"
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        import platform
        if platform.system() == 'Windows':
            call('cd docs & make.bat html & cd ..', shell=True)
        else:
            call(['make', 'html', '-C', 'docs'])

class TestCommand(Command):
    description = "Custom test command that runs pytest and jasmine"
    user_options = [('jsonly', None, 'Only run jasmine tests'),
                    ('pyonly', None, 'Only run pytest'),
                    ('noweb', None, 'Skip run tests that require the Escher website')]
    def initialize_options(self):
        self.jsonly = False
        self.pyonly = False
        self.noweb = False
    def finalize_options(self):
        pass
    def run(self):
        if not self.jsonly:
            import pytest
            if self.noweb:
                exit_code = pytest.main(['-m', 'not web'])
            else:
                exit_code = pytest.main([])
        else:
            exit_code = 0
        if not self.pyonly:
            call(['jasmine', '--port=%d' % port])
        sys.exit(exit_code)

setup(name='Escher',
      version=version,
      author='Zachary King',
      url='https://escher.github.io',
      license='MIT',
      classifiers=[
          'Development Status :: 5 - Production/Stable',
          'License :: OSI Approved :: MIT License',
          'Topic :: Scientific/Engineering',
          'Topic :: Scientific/Engineering :: Visualization',
          'Programming Language :: Python :: 2',
          'Programming Language :: Python :: 2.7',
          'Programming Language :: Python :: 3',
          'Programming Language :: Python :: 3.3',
          'Programming Language :: Python :: 3.4'
      ],
      keywords='visualization, pathway maps, web application, D3.js',
      packages=['escher'],
      package_data={'escher': ['css/web/*.css', 'css/*.css', 'templates/*',
                               'example_data/*', 'lib/*.js', 'lib/*.css',
                               'fonts/*', 'js/src/*.js', 'js/web/*.js',
                               'resources/*', 'jsonschema/*']},
      install_requires=['Jinja2>=2.7.3',
                        'tornado>=4.0.2',
                        'pytest>=2.6.2',
                        'jsonschema>=2.4.0'],
      extras_require={'docs': ['sphinx>=1.2',
                               'sphinx-rtd-theme>=0.1.6'],
                      'all': ['sphinx>=1.2',
                              'sphinx-rtd-theme>=0.1.6',
                              'jasmine>=2.2.0',
                              'ipython>=2.3.1',
                              'cobra>=0.3.0b4',
                              'wheel>=0.24.0',
                              'twine>=1.5.0'] },
      cmdclass={'clean': CleanCommand,
                'buildjs': JSBuildCommand,
                'buildgh': BuildGHPagesCommand,
                'build_release': BuildRelease,
                'build_docs': BuildDocs,
                'test': TestCommand})
