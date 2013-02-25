d3maps
======

Metabolic network visualizations using d3.js.

### Generate a map

To generate a json map file from svg, run:
```Bash
generate_map_json.py -f bigg maps/ecoli.svg
```

Use the -f option to specify format, either 'BIGG' or 'SimPheny' [default].

### Flux

map.js searches for two flux files: flux1.json and flux2.json. If only
flux1.json is present, the map presents a single set of fluxes overlaid on the
map. If both files are present, the map presents the difference between the two
flux vectors. The json format is:

```javascript
{"reaction-id1": 0.200, "reaction-id2": 0.450}
```

and so on. Reaction id's should match those in the file reaction_name_to_id.tsv.

To simplify loading the files, you can call:

```bash
python set_flux_files.py <file1>
# OR
python set_flux_files.py <file1> <file2>
```

Replace <file1> and <file2> with either .json files, or .csv files where each
line contains the reaction id followed by a comma and a flux value. This script
writes over the files flux1.json and flux2.json. Perform a hard reload
(Cmd-Shift-R or Ctrl-Shift-R) in you browser to see the changes.

### Serving the map

To run locally, you can start the python simple server in the d3maps directory

```Bash
python -m SimpleHTTPServer 8080
```

Then point your browser to http://localhost:8080/
