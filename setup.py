try:
    from setuptools import setup
except:
    from distutils.core import setup

setup(name='visbio',
      version='0.4',
      author='Zachary King',
      url='http://zakandrewking.github.io/escher/',
      packages=['visbio'],
      package_data={'visbio': ['static/*']})
