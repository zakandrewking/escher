# npm

update version in package.json
yarn clean
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
deactivate
twine upload --repository-url https://upload.pypi.org/legacy/ dist/*

# Docs

If changes have been made to example notebooks, then save them with widget state
in Jupyter Notebook (not lab). You might have to do another push to master after
the npm release to get the latest version embedded. If you are having trouble,
try:

- Clearing widget state in notebook
- Restarting Jupyter notebook
- Rerunning and saving widget state
