#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""This script has two purposes:

1. Apply the attributes from a cobra model to an existing Escher
map. For instance, update modified reversibilities.

2. Convert maps made with Escher beta versions to valid jsonschema/1-0-0
maps.

"""


from __future__ import print_function, unicode_literals


usage_string = """
Usage:

./convert_map.py {map path} {model path}

OR

python -m escher.convert_map {map path} {model path}
"""


try:
    import cobra.io
    import jsonschema
except ImportError:
    raise Exception(('The Python packages jsonschema and COBRApy (0.3.0b3 or later) '
                     'are required for converting maps.'))
import sys
import json
import random
import string
import hashlib
from os.path import basename, join
import logging
try:
    from urllib.request import urlopen
except ImportError:
    from urllib import urlopen

from escher.validate import validate_map, genes_for_gene_reaction_rule

# configure logger
logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def main():
    """Main entrypoint for convert_map. Instructions are at the top of this file."""
    # get the arguments
    try:
        in_file = sys.argv[1]
        model_path = sys.argv[2]
    except IndexError:
        print(usage_string)
        sys.exit()

    # load the cobra model
    try:
        model = cobra.io.load_json_model(model_path)
    except (IOError, ValueError):
        try:
            model = cobra.io.read_sbml_model(model_path)
        except IOError:
            raise Exception('Could not load the model: %s' % model_path)

    # get the current map
    with open(in_file, 'r') as f:
        out = json.load(f)

    # convert the map
    the_map = convert(out, model)

    # don't replace the file
    out_file = in_file.replace('.json', '_converted.json')
    logging.info('Saving validated map to %s' % out_file)
    with open(out_file, 'w') as f:
        json.dump(the_map, f, allow_nan=False)

# ------------------------------------------------------------------------------
# Functions for manipulating Escher maps as Python objects
# ------------------------------------------------------------------------------

class MissingDefaultAttribute(Exception):
    pass

def make_map(header, body):
    return [header, body]

def get_header(a_map):
    return a_map[0]

def set_header(a_map, value):
    a_map[0] = value

def get_body(a_map):
    return a_map[1]

def set_body(a_map, value):
    a_map[1] = value

def get_nodes(body):
    return body['nodes']

def set_nodes(body, value):
    body['nodes'] = value

def get_reactions(body):
    return body['reactions']

def set_reactions(body, value):
    body['reactions'] = value

def is_valid_header(val):
    """Header must have these values."""
    return (isinstance(val, dict) and
            all(x in val for x in
                ['schema', 'homepage', 'map_name', 'map_id', 'map_description']))

def is_valid_body(val):
    """Body must be a dictionary."""
    return isinstance(val, dict)

def has_header_and_body(val):
    """Check for header and body."""
    return (isinstance(val, list) and len(val) == 2 and
            is_valid_header(get_header(val)) and is_valid_body(get_body(val)))

# ------------------------------------------------------------------------------
# Functions for fixing nested dictionaries & lists
# ------------------------------------------------------------------------------

def dict_with_required_elements(the_dict, required_attributes, get_default=None,
                                nullable=[], cast={}):
    """Remove unsupported elements and provide defaults for missing
    elements or elements with zero length (e.g. {}, []).

    Arguments
    ---------

    the_dict: A dictionary.

    required_attributes: The attributes required in the dictionary.

    get_default: A function that takes the attribute name and the current
    object, and returns a default value. If not function is provided, then
    MissingDefaultAttribute is raised when an attribute is not present.

    nullable: A list of attributes that can be None.

    cast: A dictionary of attributes for keys and functions for values.

    """
    if type(the_dict) is not dict:
        raise MissingDefaultAttribute('(Bad object)')

    def has_zero_length(o):
        """Returns True if o has a length and it is zero."""
        try:
            return len(o) == 0
        except TypeError:
            return False

    def current_otherwise_default(name):
        """Take the value in the current dict, or else provide a default."""
        if name not in the_dict or has_zero_length(the_dict[name]):
            if get_default is not None:
                default = get_default(name, the_dict)
                the_dict[name] = default
            else:
                raise MissingDefaultAttribute(name)
        elif the_dict[name] is None and name not in nullable:
            raise MissingDefaultAttribute('%s (is None)' % name)
        # casting
        try:
            new = cast[name](the_dict[name])
        except KeyError:
            pass
        else:
            the_dict[name] = new

    # map over the dict
    not_required = set(the_dict.keys())
    for name in required_attributes:
        current_otherwise_default(name)
        # remember the keys that are not required
        try:
            not_required.remove(name)
        except KeyError:
            pass

    # remove not required
    for key in not_required:
        del the_dict[key]

def map_over_dict_with_deletions(the_dict, fix_function):
    """Use this to map over dictionary. The fix function updates values, and returns
    None to delete a value.

    Returns the dictionary.

    Arguments
    ---------

    the_dict: A dictionary to fix.

    fix_function: A function that takes the dictionary key and value as
    arguments, and that returns None if the key is deleted, otherwise
    returns the updated value.

    """

    # this will update the dictionary and return a set of deleted ids
    deleted_keys = set()
    for key, val in list(the_dict.items()):
        updated_val = fix_function(key, val)
        if updated_val is None:
            # add to aggregation set
            deleted_keys.add(key)
            # delete the value
            del the_dict[key]
        else:
            # set the new value
            the_dict[key] = updated_val

    return the_dict

def list_of_dicts_with_required_elements(a_list, required_attributes,
                                         get_default=None, nullable=[],
                                         cast={}):
    """For a list (dictionary) of dictionaries with required attributes, check
    each one. Returns the new list.

    Arguments
    ---------

    a_list: A dictionary with values that are dictionaries.

    required_attributes: A list of required attributes for the internal
    dictionaries.

    get_default: A function that takes the attribute name and the current
    object, and returns a default value. If not function is provided, then
    MissingDefaultAttribute is raised when an attribute is not present.

    """

    def fix_a_value(val):
        try:
            dict_with_required_elements(val, required_attributes,
                                        nullable=nullable, cast=cast)
            return val
        except MissingDefaultAttribute:
            return None

    # fix each element in the list
    return [y for y in (fix_a_value(x) for x in a_list)
            if y is not None]

def collection_of_dicts_with_required_elements(collection, required_attributes,
                                               get_default=None, nullable=[],
                                               cast={}):
    """For a collection (dictionary) of dictionaries with required
    attributes, check each one. Returns the new collection.

    Arguments
    ---------

    collection: A dictionary with values that are dictionaries.

    required_attributes: A list of required attributes for the internal
    dictionaries.

    get_default: A function that takes the attribute name and the current
    object, and returns a default value. If not function is provided, then
    MissingDefaultAttribute is raised when an attribute is not present.

    """

    def fix_a_value(val):
        try:
            dict_with_required_elements(val, required_attributes,
                                         nullable=nullable, cast=cast)
            return val
        except MissingDefaultAttribute:
            return None

    # update the dictionary
    for k, v in list(collection.items()):
        new_value = fix_a_value(v)
        if new_value is None:
            del collection[k]
        else:
            collection[k] = new_value

    return collection

# ------------------------------------------------------------------------------
# Functions for cleaning up unconnected map elements
# ------------------------------------------------------------------------------

def remove_unconnected_nodes(nodes, reactions, node_ids_deleted=set()):
    """Check for nodes with no connected segments in the reactions object, and
    return a new nodes object with only connected nodes.

    Arguments
    ---------

    nodes: A collection (dict) of nodes.

    reactions: A collection (dict) of reactions.

    node_ids_deleted: A set of previously deleted ids to update.

    """
    # update
    def map_over_connected_node_ids(fn, reactions):
        """Run fn with all node ids that have connected segments."""
        for reaction in reactions.values():
            for segment in reaction['segments'].values():
                fn(segment['from_node_id'])
                fn(segment['to_node_id'])

    # use a set to keep track of connected nodes
    nodes_with_segments = set()
    add_node = nodes_with_segments.add
    has_node = lambda x: x in nodes_with_segments
    # update
    map_over_connected_node_ids(add_node, reactions)

    # filter the nodes
    def check_fn(key, value):
        if has_node(key):
            return value
        else:
            logging.debug('No segments for node %s. Deleting' % key)
            return None
    map_over_dict_with_deletions(nodes, check_fn)

def remove_unconnected_segments(reactions, nodes):
    """Check for segments with no connected nodes.

    Arguments
    ---------

    reactions: A collection (dict) of reactions.

    nodes: A collection (dict) of nodes.

    """
    # use a set to keep track of connected nodes
    node_ids = set(nodes.keys())
    is_node = lambda x: x in node_ids

    # filter the segments
    def check_fn(key, value):
        if is_node(value['from_node_id']) and is_node(value['to_node_id']):
            return value
        else:
            logging.debug('Missing node for segment %s. Deleting' % key)
            return None
    for reaction in reactions.values():
        map_over_dict_with_deletions(reaction['segments'], check_fn)

def remove_reactions_with_missing_metabolites(reactions, nodes):
    """Check for reactions that do not have all of their metabolites.

    Arguments
    ---------

    reactions: A collection (dict) of reactions.

    nodes: A collection (dict) of nodes.

    """
    # filter the reactions
    def check_fn(reaction_id, reaction):
        # get the metabolites
        metabolite_ids = {x['bigg_id'] for x in reaction['metabolites']}
        # look for matching segments
        for segment_id, segment in reaction['segments'].items():
            # find node
            for n in 'from_node_id', 'to_node_id':
                node = nodes[segment[n]]
                try:
                    metabolite_ids.remove(node['bigg_id'])
                except KeyError:
                    pass
        if len(metabolite_ids) > 0:
            logging.info('Deleting reaction %s with missing metabolites %s' % (reaction['bigg_id'],
                                                                               str(list(metabolite_ids))))
            return None
        else:
            return reaction

    map_over_dict_with_deletions(reactions, check_fn)

# ------------------------------------------------------------------------------
# Functions for converting maps
# ------------------------------------------------------------------------------

def old_map_to_new_schema(the_map, map_name=None, map_description=None):
    """Convert any old map to match the latest schema. Returns a new map.

    Arguments
    ---------

    the_map: An Escher map loaded as a Python object (e.g. json.load('my_map.json')).

    map_name: A name for the map. If a name is already present, this name
    overrides it.

    map_description: A description for the map. If a name is already present,
    this name overrides it.

    """

    def add_header_if_missing(a_map):
        """Check for new, 2-level maps, and add the header."""

        def add_default_header(body):
            """Return a map with header and body."""

            def check_for(var, name):
                """Print a warning if var is None."""
                if var is None:
                    logging.warn('No {} for map'.format(name))
                    return ''
                return var

            new_id = hashlib.md5(json.dumps(body).encode('utf-8')).hexdigest()
            default_header = {
                "schema": "https://escher.github.io/escher/jsonschema/1-0-0#",
                "homepage": "https://escher.github.io",
                "map_name": check_for(map_name, 'name'),
                "map_id": new_id,
                "map_description": check_for(map_description, 'description')
            }
            logging.info('Map has the ID {}'.format(new_id))
            return make_map(default_header, body)

        if has_header_and_body(a_map):
            return a_map
        elif is_valid_body(a_map):
            return add_default_header(a_map)
        else:
            raise Exception('The map provided cannot be converted. It is not a valid Escher map.')

    def fix_body(body):
        """Fill in necessary attributes for the body."""

        def get_default(key, _):
            """Get default value for key in body."""
            if key == 'canvas':
                # default canvas
                return {'x': -1440, 'y': -775, 'width': 4320, 'height': 2325}
            else:
                # other defaults
                return {}

        def fix_canvas(canvas):
            """Return a canvas with correct attributes."""
            canvas_keys = ['x', 'y', 'width', 'height']
            cast = {'x': float, 'y': float, 'width': float, 'height': float}
            dict_with_required_elements(canvas, canvas_keys, cast=cast)

        def fix_text_labels(text_labels):
            """Return a list of text_labels with correct attributes."""
            text_label_keys = ['x', 'y', 'text']
            cast = {'x': float, 'y': float}
            collection_of_dicts_with_required_elements(text_labels,
                                                       text_label_keys,
                                                       cast=cast)

        # fix canvas before body so that a default canvas can be added if the
        # canvas is invalid
        try:
            fix_canvas(body['canvas'])
        except KeyError:
            pass
        except MissingDefaultAttribute:
            del body['canvas']

        # fix body
        core_keys = ['nodes', 'reactions', 'text_labels', 'canvas']
        dict_with_required_elements(body, core_keys, get_default)

        # fix text labels
        fix_text_labels(body['text_labels'])

    def fix_nodes(nodes):
        """Fill in necessary attributes for the nodes. Returns nodes."""

        def get_default_node_attr(name, obj):
            """Return default values when possible. Otherwise, raise MissingDefaultAttribute."""
            if name == 'node_is_primary':
                return False
            elif name == 'name':
                return ''
            elif name == 'label_x' and 'x' in obj:
                return obj['x']
            elif name == 'label_y' and 'y' in obj:
                return obj['y']
            else:
                raise MissingDefaultAttribute(name)

        def fix_a_node(node_id, node):
            """Return an updated node, or None if the node is invalid."""

            if not 'node_type' in node:
                logging.debug('Deleting node %s with no node_type' % node_id)
                return None

            elif node['node_type'] == 'metabolite':
                met_keys = ['node_type', 'x', 'y', 'bigg_id', 'name', 'label_x',
                            'label_y', 'node_is_primary']
                cast = {'x': float, 'y': float, 'label_x': float, 'label_y': float}
                try:
                    dict_with_required_elements(node, met_keys, get_default_node_attr, cast=cast)
                    return node
                except MissingDefaultAttribute as e:
                    logging.debug('Deleting node %s with missing attribute %s' % (node_id, e))
                    return None

            elif node['node_type'] in ['multimarker', 'midmarker']:
                marker_keys = ['node_type', 'x', 'y']
                cast = {'x': float, 'y': float}
                try:
                    dict_with_required_elements(node, marker_keys, get_default_node_attr, cast=cast)
                    return node
                except MissingDefaultAttribute as e:
                    logging.debug('Deleting node %s with missing attribute %s' % (node_id, e))
                    return None

            else:
                logging.debug('Deleting node %s with bad node_type %s' % (node_id, node['node_type']))
                return None

        # run fix functions
        map_over_dict_with_deletions(nodes, fix_a_node)

    def fix_reactions(reactions):
        """Fill in necessary attributes for the reactions.

        Returns reactions.

        """

        def get_default_reaction_attr(name, obj):
            """Return default values when possible. Otherwise, raise MissingDefaultAttribute."""
            if name in ['name', 'gene_reaction_rule']:
                return ''
            elif name == 'reversibility':
                return True
            elif name in ['genes', 'metabolites']:
                return []
            else:
                raise MissingDefaultAttribute(name)

        def fix_a_reaction(reaction_id, reaction):
            """Return an updated reaction, or None if the reaction is invalid."""

            def fix_segments(segments):
                """Fix dictionary of segments with correct attributes."""
                def fix_a_segment(segment_id, segment):
                    segment_keys = ['from_node_id', 'to_node_id', 'b1', 'b2']
                    def get_default_segment_attr(key, _):
                        if key in ['b1', 'b2']:
                            return None
                        else:
                            raise MissingDefaultAttribute(key)
                    try:
                        dict_with_required_elements(segment, segment_keys,
                                                    get_default_segment_attr,
                                                    nullable=['b1', 'b2'])
                    except MissingDefaultAttribute as e:
                        logging.debug('Deleting segment %s with missing attribute %s' % (segment_id, e))
                        return None

                    # check the beziers too
                    required_bezier_keys = ['x', 'y']
                    cast = {'x': float, 'y': float}
                    for b in ['b1', 'b2']:
                        try:
                            dict_with_required_elements(segment[b],
                                                        required_bezier_keys,
                                                        cast=cast)
                        except MissingDefaultAttribute as e:
                            logging.debug('Deleting bezier %s with missing attribute %s in segment %s' % (b, e, segment_id))
                            segment[b] = None

                    return segment

                map_over_dict_with_deletions(segments, fix_a_segment)

            def fix_metabolites(metabolites):
                """Return a list of metabolites with correct attributes."""
                metabolite_keys = ['coefficient', 'bigg_id']
                cast = {'coefficient': float}
                return list_of_dicts_with_required_elements(metabolites,
                                                            metabolite_keys,
                                                            cast=cast)

            def fix_genes(genes):
                """Return a list of genes with correct attributes."""
                gene_keys = ['bigg_id', 'name']
                def get_default_gene_attr(name, _):
                    if name == 'name':
                        return ''
                    else:
                        raise MissingDefaultAttribute(name)
                return list_of_dicts_with_required_elements(genes, gene_keys,
                                                            get_default_gene_attr)

            # fix all the attributes
            reaction_keys = ['name', 'bigg_id','reversibility', 'label_x',
                             'label_y', 'gene_reaction_rule', 'genes',
                             'metabolites', 'segments']
            cast = {'label_x': float, 'label_y': float}
            try:
                dict_with_required_elements(reaction, reaction_keys,
                                            get_default_reaction_attr,
                                            cast=cast)
            except MissingDefaultAttribute as e:
                logging.debug('Deleting reaction %s with missing attribute %s' % (reaction_id, e))
                return None

            # fix segments, metabolites, and genes
            fix_segments(reaction['segments'])
            # must have segments
            if len(reaction['segments']) == 0:
                logging.debug('Deleting reaction %s with no segments' % reaction_id)
                return None
            reaction['metabolites'] = fix_metabolites(reaction['metabolites'])
            reaction['genes'] = fix_genes(reaction['genes'])

            return reaction

        # run the fix functions
        map_over_dict_with_deletions(reactions, fix_a_reaction)


    # make sure there is a body and a head
    the_map = add_header_if_missing(the_map)
    body = get_body(the_map)

    # add missing elements to body
    fix_body(body)

    # fix the nodes
    fix_nodes(get_nodes(body))

    # fix the reactions
    fix_reactions(get_reactions(body))

    # delete any nodes with no segment
    remove_unconnected_nodes(get_nodes(body), get_reactions(body))

    # delete segments with no nodes
    remove_unconnected_segments(get_reactions(body), get_nodes(body))

    # delete reactions with missing metabolite segments
    remove_reactions_with_missing_metabolites(get_reactions(body), get_nodes(body))

    return the_map


def apply_id_mappings(the_map, reaction_id_mapping=None,
                      metabolite_id_mapping=None, gene_id_mapping=None):
    """Convert bigg_ids in the map using the mappings dictionaries.

    Arguments
    ---------

    the_map: The Escher map Python object.

    reaction_id_mapping: A dictionary with keys for existing bigg_ids and value for new bigg_ids.

    metabolite_id_mapping: A dictionary with keys for existing bigg_ids and value for new bigg_ids.

    gene_id_mapping: A dictionary with keys for existing bigg_ids and value for new bigg_ids.

    """

    id_key = 'bigg_id'

    def check(a_dict, mapping):
        """Try to change the value for id_key to a new value defined in mapping."""
        try:
            new_id = mapping[a_dict[id_key]]
        except KeyError:
            pass
        else:
            a_dict[id_key] = new_id
        return a_dict

    def apply_mapping_list(a_list, mapping):
        """Use the mapping on each dict in the list. Returns a new list."""
        return [check(x, mapping) for x in a_list]

    def apply_mapping_dict(collection, mapping):
        """Use the mapping on each dict in the collection (dict). Returns the dictionary."""
        for val in collection.values():
            check(val, mapping)
        return collection

    body = get_body(the_map)
    # reactions
    if reaction_id_mapping is not None:
        apply_mapping_dict(get_reactions(body), reaction_id_mapping)
    # metabolites
    if metabolite_id_mapping is not None:
        apply_mapping_dict(get_nodes(body), metabolite_id_mapping)
    # genes & metabolites in reactions
    for reaction in get_reactions(body).values():
        if gene_id_mapping is not None:
            reaction['genes'] = apply_mapping_list(reaction['genes'], gene_id_mapping)
        if metabolite_id_mapping is not None:
            reaction['metabolites'] = apply_mapping_list(reaction['metabolites'], metabolite_id_mapping)


def apply_cobra_model_to_map(the_map, model):
    """Apply the COBRA model attributes (descriptive names, gene reaction rules,
    reversibilities) to the map.

    Cleans up unconnected segments and nodes after deleting any nodes and
    reactions not found in the cobra model.

    """

    def apply_model_attributes(a_dict, dict_list, attribute_fns, collection_on='bigg_id'):
        """For each attribute_fn, apply the values from the dict_list to given
        dictionary, using the given IDs. Returns the dictionary, or None if a
        matching object was not found in the DictList.

        """
        try:
            on_id = a_dict[collection_on]
        except KeyError:
            return a_dict
        try:
            dl_object = dict_list.get_by_id(on_id)
        except KeyError:
            logging.info('Could not find %s in model. Deleting.' % on_id)
            return None
        else:
            for attribute_fn in attribute_fns:
                attribute_fn(a_dict, dl_object)

        return a_dict

    def apply_model_attributes_dict(collection, dict_list, attribute_fns,
                                    collection_on='bigg_id'):
        """For each attribute_fn, apply the values from the dict_list to the matching
        results in the collection, using the given IDs. Returns the collection."""
        for key, val in list(collection.items()):
            new_val = apply_model_attributes(val, dict_list, attribute_fns,
                                             collection_on)
            if new_val is None:
                del collection[key]

    def apply_model_attributes_list(a_list, dict_list, attribute_fns,
                                    collection_on='bigg_id'):
        """For each attribute_fn, apply the values from the dict_list to the matching
        results in the list of dicts, using the given IDs. Returns a new list."""
        return [y for y in (apply_model_attributes(x, dict_list, attribute_fns, collection_on) for x in a_list)
                if y is not None]

    def get_attr_fn(attribute):
        """Make a default attribute setting function."""
        def new_attr_fn(val, dl_object):
            try:
                val[attribute] = getattr(dl_object, attribute)
            except AttributeError:
                logging.debug('No %s found in DictList %s' % (attribute, on_id))
        return new_attr_fn

    def set_reversibility(reaction, cobra_reaction):
        reaction['reversibility'] = (cobra_reaction.lower_bound < 0 and cobra_reaction.upper_bound > 0)
        # reverse metabolites if reaction runs in reverse
        rev_mult = (-1 if
                    (cobra_reaction.lower_bound < 0 and cobra_reaction.upper_bound <= 0)
                    else 1)
        # use metabolites from reaction
        reaction['metabolites'] = [{'bigg_id': met.id, 'coefficient': coeff * rev_mult}
                                   for met, coeff in
                                   cobra_reaction.metabolites.items()]

    def set_genes(reaction, cobra_reaction):
        reaction['genes'] = [{'bigg_id': x.id, 'name': x.name} for x in cobra_reaction.genes]

    # vars
    body = get_body(the_map)

    # compare reactions to model
    reaction_attributes = [get_attr_fn('name'), get_attr_fn('gene_reaction_rule'),
                           set_reversibility, set_genes]
    apply_model_attributes_dict(get_reactions(body), model.reactions,
                                reaction_attributes)

    # compare metabolites to model
    metabolite_attributes = [get_attr_fn('name')]
    apply_model_attributes_dict(get_nodes(body), model.metabolites,
                                metabolite_attributes)

    # delete any nodes with no segment
    remove_unconnected_nodes(get_nodes(body), get_reactions(body))

    # delete segments with no nodes
    remove_unconnected_segments(get_reactions(body), get_nodes(body))

    # delete reactions with missing metabolite segments
    remove_reactions_with_missing_metabolites(get_reactions(body), get_nodes(body))


def convert(the_map, model, map_name=None, map_description=None,
            reaction_id_mapping=None, metabolite_id_mapping=None,
            gene_id_mapping=None, debug=False):
    """Convert an Escher map to the latest format using the COBRA model to update
    content. Returns a new map.

    Arguments
    ---------

    the_map: An Escher map loaded as a Python object (e.g. json.load('my_map.json')).

    model: A COBRA model.

    map_name: A name for the map. If a name is already present, this name
    overrides it.

    map_description: A description for the map. If a name is already present,
    this name overrides it.

    reaction_id_mapping: A dictionary with existing reaction IDs as keys and the
    new reaction IDs as values.

    metabolite_id_mapping: A dictionary with existing metabolite IDs as keys and the
    new metabolite IDs as values.

    gene_id_mapping: A dictionary with existing gene IDs as keys and the new
    gene IDs as values.

    debug: Check the map against the schema at some intermediate steps.

    """

    # make sure everything is up-to-date
    new_map = old_map_to_new_schema(the_map, map_name=map_name,
                                    map_description=map_description)
    if debug:
        validate_map(new_map)

    # apply the ids mappings
    apply_id_mappings(new_map, reaction_id_mapping, metabolite_id_mapping,
                      gene_id_mapping)
    if debug:
        validate_map(new_map)

    # apply the new model
    apply_cobra_model_to_map(new_map, model)

    validate_map(new_map)
    return new_map


if __name__ == "__main__":
    main()
