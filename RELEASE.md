# Release

This project publishes two packages:

- `escher` on npm, built from the repository root.
- `escher` on PyPI, built from `py/` after the JavaScript assets have been
  copied into `py/escher/static/`.

Use the same version for both packages.

## Preflight

1. Update versions:

   - `package.json`
   - `py/pyproject.toml`
   - `CHANGELOG.md`

2. Run the JavaScript checks and rebuild the assets:

   ```sh
   yarn install
   yarn test
   yarn clean
   yarn build
   yarn copy
   ```

3. Run the Python tests:

   ```sh
   cd py
   uv sync --extra dev
   uv run pytest
   cd ..
   ```

4. Commit the release changes:

   ```sh
   git status --short
   git add package.json py/pyproject.toml CHANGELOG.md py/escher/static
   git commit -m "Release vX.Y.Z"
   ```

## npm

Publish from the repository root:

```sh
npm login
npm pack --dry-run
npm publish
```

## PyPI

Build from `py/`. Escher v2 uses `pyproject.toml`; do not use `setup.py`.

```sh
cd py
python -m pip install -U build twine
rm -rf dist build
python -m build
twine check dist/*
twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```

Test the TestPyPI package in a clean environment:

```sh
cd "$(mktemp -d)"
python -m venv env
source env/bin/activate
python -m pip install -U pip
python -m pip install \
  --index-url https://test.pypi.org/simple/ \
  --extra-index-url https://pypi.org/simple \
  "escher==X.Y.Z"
python -c "import escher; print(escher.__version__)"
deactivate
```

If the TestPyPI package works, publish to PyPI:

```sh
cd /path/to/escher/py
twine upload --repository-url https://upload.pypi.org/legacy/ dist/*
```

## Git tag and GitHub release

After both package uploads are good:

```sh
git tag vX.Y.Z
git push origin master
git push origin vX.Y.Z
```

Create a GitHub release for the tag and paste in the matching section from
`CHANGELOG.md`.

## Website

The website is maintained in the `escher/escher.github.io` repository and is
published by pushing built files to its `master` branch.

Use the released npm package version. In the website repository:

1. Update versions in `package.json`:

   - The top-level website package `version`.
   - The `escher` dependency.

2. Rebuild the website:

   ```sh
   yarn install
   bin/build-index
   yarn build
   yarn copy
   ```

   `bin/build-index` refreshes `src/data/index.json` from the installed
   `escher` package metadata. `yarn build` writes to `build/`. `yarn copy`
   copies the generated site files into the repository root and refreshes
   `assets/`.

3. Commit and publish the website:

   ```sh
   git status --short
   git add package.json yarn.lock src/data/index.json index.html assets 1-0-0
   git commit -m "Release website vX.Y.Z"
   git push origin master
   ```

Check https://escher.github.io after GitHub Pages updates.

## Docs

Read the Docs should rebuild from the pushed commit. If changes have been made
to example notebooks, save them with widget state in Jupyter Notebook.

If notebook widget state is stale or missing:

- Clear widget state in the notebook.
- Restart Jupyter Notebook.
- Rerun the notebook and save widget state.
- Push the updated notebook.
