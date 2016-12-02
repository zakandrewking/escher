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
package = __import__('version').package
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
        remove_if(join(directory, '..', 'builder'))
        for f in glob(join(directory, '..', 'index.html')):
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
        # generate the static site
        try:
            from escher import generate_index, static_site
        except ImportError:
            raise Exception('Escher not installed')
        generate_index.main()
        static_site.generate_static_site()
        print('Done building gh-pages')


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
    author=package['author'],
    url=package['homepage'],
    description=package['description'],
    keywords=', '.join(package['keywords']),
    license=package['license'],
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'License :: OSI Approved :: MIT License',
        'Topic :: Scientific/Engineering',
        'Topic :: Scientific/Engineering :: Visualization',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Operating System :: OS Independent'
    ],
    packages=['escher'],
    package_data={'escher': ['package.json', 'static/escher/*', 'static/fonts/*',
                             'static/jsonschema/*', 'static/homepage/*',
                             'static/img/*', 'static/lib/*', 'templates/*']},
    install_requires=['Jinja2>=2.7.3',
                      'tornado>=4.0.2',
                      'pytest>=2.6.2',
                      'cobra>=0.3.0',
                      'jsonschema>=2.4.0'],
    extras_require={'docs': ['sphinx>=1.2',
                             'sphinx-rtd-theme>=0.1.6'],
                    'all': ['sphinx>=1.2',
                            'sphinx-rtd-theme>=0.1.6',
                            'ipython>=4.0.2',
                            'jupyter>=1.0.0',
                            'wheel>=0.24.0',
                            'twine>=1.5.0'] },
    cmdclass={'clean': CleanCommand,
              'build_gh': BuildGHPagesCommand,
              'test': TestCommand}
)
