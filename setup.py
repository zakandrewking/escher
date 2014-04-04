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
      package_data={'escher': ['js/*', 'css/*']})
