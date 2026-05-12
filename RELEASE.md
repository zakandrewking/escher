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

## Smoke test

Before publishing to npm or PyPI, run the visual smoke test:

```sh
./scripts/smoke-release-visual
```

The script builds the Python wheel, checks the distribution metadata, installs
the wheel into a temporary uv environment, generates a standalone HTML page from
real example map/model data, and inlines the packaged `escher.min.js` from that
wheel. Open the printed HTML file in a browser and confirm that the Escher map
renders, pan/zoom work, menu/search/reaction interactions respond, and the
browser console has no obvious errors.

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
rm -rf dist build
uv build
uvx twine check dist/*
uvx twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```

Test the TestPyPI package in a clean environment:

```sh
tmpdir="$(mktemp -d)"
uv venv "$tmpdir/env"
uv pip install --python "$tmpdir/env/bin/python" \
  --index-url https://test.pypi.org/simple/ \
  --extra-index-url https://pypi.org/simple \
  "escher==X.Y.Z"
"$tmpdir/env/bin/python" -c "import escher; print(escher.__version__)"
rm -rf "$tmpdir"
```

If the TestPyPI package works, publish to PyPI:

```sh
uvx twine upload --repository-url https://upload.pypi.org/legacy/ dist/*
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

3. Confirm the homepage footer embeds the release version:

   ```sh
   grep -R "Version X.Y.Z" assets/index-*.js
   ```

   The footer uses `VITE_APP_VERSION`, which is set by `src/.env` from the
   website package version during `yarn build`.

4. Commit and publish the website:

   ```sh
   git status --short
   git add package.json yarn.lock src/data/index.json index.html assets 1-0-0
   git commit -m "Release website vX.Y.Z"
   git push origin master
   ```

Check https://escher.github.io after GitHub Pages updates.

## Docs

Check Read the Docs after pushing the release commit. If a build did not start
automatically, trigger one manually from the Read the Docs project dashboard.

If changes have been made to example notebooks, save them with widget state in
Jupyter Notebook.

If notebook widget state is stale or missing:

- Clear widget state in the notebook.
- Restart Jupyter Notebook.
- Rerun the notebook and save widget state.
- Push the updated notebook.
