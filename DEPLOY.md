# npm

update version in package.json
yarn install
yarn build
yarn copy # for docs to build
git commit version change
git tag version
git push commit & tags
npm login # last time i tried, yarn wasn't working for login & publish
npm publish

# pypi

after the above

cd py
pip install -U pip setuptools wheel twine
python setup.py sdist bdist_wheel
twine upload --repository-url https://test.pypi.org/legacy/ dist/*
cd ~/new-directory
virtualenv env
source env/bin/activate
pip install --index-url https://test.pypi.org/simple/ escher
ipython, jupyter, etc.
cd -
twine upload dist/*
