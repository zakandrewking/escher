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
full_version = __import__('version').__full_version__
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
    description = "Custom test command that runs pytest"
    user_options = [('noweb', None, 'Skip run tests that require the Escher website')]
    def initialize_options(self):
        self.noweb = False
    def finalize_options(self):
        pass
    def run(self):
        import pytest
        if self.noweb:
            exit_code = pytest.main(['-m', 'not web'])
        else:
            exit_code = pytest.main([])
        sys.exit(exit_code)


setup(
    name='Escher',
    version=full_version,
    author='Zachary King',
    url='https://escher.github.io',
    description='Escher: A Web Application for Building, Sharing, and Embedding Data-Rich Visualizations of Biological Pathways',
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
        'Programming Language :: Python :: 3.4',
        'Operating System :: OS Independent'
    ],
    keywords='visualization, pathway maps, web application, D3.js',
    packages=['escher'],
    package_data={'escher': ['static/*', 'static/*', 'templates/*',
                             'resources/*']},
    install_requires=['Jinja2>=2.7.3',
                      'tornado>=4.0.2',
                      'pytest>=2.6.2',
                      'jsonschema>=2.4.0'],
    extras_require={'docs': ['sphinx>=1.2',
                             'sphinx-rtd-theme>=0.1.6'],
                    'all': ['sphinx>=1.2',
                            'sphinx-rtd-theme>=0.1.6',
                            'ipython>=2.3.1',
                            'cobra>=0.3.0b4',
                            'wheel>=0.24.0',
                            'twine>=1.5.0'] },
    cmdclass={'clean': CleanCommand,
              'build_gh': BuildGHPagesCommand,
              'build_docs': BuildDocs,
              'test': TestCommand}
)
