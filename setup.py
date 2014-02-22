try:
    from setuptools import setup
except:
    from distutils.core import setup

setup(name='Escher',
      version='0.4.0',
      author='Zachary King',
      url='http://zakandrewking.github.io/escher/',
      packages=['escher'],
      package_data={'escher': ['static/*']})
