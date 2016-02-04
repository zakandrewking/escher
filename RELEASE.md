Build and test:

```
grunt
grunt test
cd py; python setup.py test --noweb; cd ..
```

Create a new release:

```
grunt release:major # OR
grunt release:minor # OR
grunt release:patch # OR
grunt release:prerelease # OR
grunt release:1.4.0-beta.1
```

Publish:

```
grunt publish
```

Test python with web:

```
cd py; python setup.py test; cd ..
```
