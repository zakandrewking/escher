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
rm -rf dist build
python setup.py sdist bdist_wheel
twine upload --repository-url https://test.pypi.org/legacy/ dist/*
cd ~/new-directory
virtualenv env
source env/bin/activate
python -m pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple "escher==<version>"
python -m ipython kernel install --user --name=env
ipython, jupyter, etc.
cd -
twine upload --repository-url https://upload.pypi.org/legacy/ dist/*
