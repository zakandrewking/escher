try:
    from setuptools import setup
except:
    from distutils.core import setup

version = __import__('escher').__version__
    
setup(name='Escher',
      version=version,
      author='Zachary King',
      url='http://zakandrewking.github.io/escher/',
      packages=['escher'],
      data_files=[('escher/js', ['js/escher-1.0.dev.js', 'js/escher-1.0.dev.min.js', 'js/lib/d3.v3.js'])])
