from escher import __schema_version__
from escher.urls import get_filepath
from os.path import join
import re
import json
import sys

usage_string = """
Usage:

./validate my_map.json

OR

python -m escher.validate my_map.json

"""


def main():
    if len(sys.argv) < 2:
        print(usage_string)
        sys.exit(1)

    with open(sys.argv[1], 'r') as f:
        map_data = json.load(f)
    validate_map(map_data)
    print('Your map passed inspection and is free of infection.')


def validate_map(map_data):
    """Validate a map using the jsonschema, and some extra checks for consistency."""
    import jsonschema
    schema = get_jsonschema()
    jsonschema.validate(map_data, schema)

    # check that all segments have nodes, segments never connect midmarkers with
    # metabolites, and check that every metabolite is represented with
    # stoichiometry information
    (bad_segments,
     missing_multimarkers,
     missing_stoich,
     missing_gene_names) = check_map(map_data)

    error = ''
    if len(bad_segments) > 0:
        error += 'No nodes for segments: %s\n' % (', '.join(str(x) for x in bad_segments))
    # if len(missing_multimarkers) > 0:
    #     error += 'Segments connect midmarkers to metabolites: %s\n' % (', '.join(str(x) for x in missing_multimarkers))
    if len(missing_stoich) > 0:
        error += 'No non-zero stoichiometry for a connected metabolite node: %s\n' % (', '.join(str(x) for x in missing_stoich))
    if len(missing_gene_names) > 0:
        error += 'No gene name for gene in gene_reaction_rule: %s\n' % (', '.join(str(x) for x in missing_gene_names))
    if error != '':
        raise Exception(error)


def validate_schema():
    import jsonschema
    schema = get_jsonschema()
    jsonschema.Draft4Validator.check_schema(schema)


def check_map(map_data):
    """Check reactions and metabolites.

    1. Make sure that nodes exist on either end of each segment

    2. check that every metabolite is represented with stoichiometry information

    3. that every gene in the gene_reaction_rule has a name

    """
    reactions = map_data[1]['reactions'];
    nodes = map_data[1]['nodes'];
    bad_segments = []
    missing_multimarkers = []
    missing_stoich = []
    missing_gene_names = []
    for _, reaction in reactions.items():
        metabolites = reaction['metabolites']
        for segment_id, segment in reaction['segments'].items():
            for n in ['to_node_id', 'from_node_id']:
                # check that the node exists
                if segment[n] not in nodes:
                    bad_segments.append((n, segment_id))
                else:
                    # check that the coefficients exist and are non-zero
                    node = nodes[segment[n]]
                    if node['node_type'] == 'metabolite':
                        if not any((node['bigg_id'] == m['bigg_id'] and abs(m['coefficient']) > 0) for m in metabolites):
                            missing_stoich.append((n, segment_id))

        # check gene reaction rule
        found_genes = genes_for_gene_reaction_rule(reaction['gene_reaction_rule'])
        for found_gene in found_genes:
            if not any((found_gene == g['bigg_id'] and 'name' in g) for g in reaction['genes']):
                missing_gene_names.append(found_gene)
    return bad_segments, missing_multimarkers, missing_stoich, missing_gene_names


def get_jsonschema():
    """Get the local jsonschema.

    """
    with open(get_filepath('map_jsonschema'), 'r') as f:
        return json.load(f)


def genes_for_gene_reaction_rule(rule):
    """ Find genes in gene_reaction_rule string.

    Arguments
    ---------

    rule: A boolean string containing gene names, parentheses, AND's and
    OR's.

    """

    # remove ANDs and ORs, surrounded by space or parentheses
    rule = re.sub(r'([()\s])(?:and|or)([)(\s])', r'\1\2', rule)
    # remove parentheses
    rule = re.sub(r'\(|\)', r'', rule)
    # split on whitespace
    genes = [x for x in rule.split(' ') if x != '']
    return genes

if __name__=="__main__":
    main()
