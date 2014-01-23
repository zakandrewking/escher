import cobra.io, re, json, os
from IPython.display import HTML

m = cobra.io.load_matlab_model('../models/iJO1366.mat')
directory = "../maps"
version = 'v0.4.0'

if version=='v0.1.0':
    # Version 0.1 model
    data = []
    for reaction in m.reactions:
        mets = []
        for metabolite_id, coefficient in reaction._metabolites.iteritems():
            mets.append({'cobra_id': unicode(metabolite_id),
                         'coefficient': coefficient})
        data.append({'cobra_id': unicode(reaction.id),
                     'metabolites': mets})

    out_file = os.path.join(directory, 'cobra_model_0.1.json')
    with open(out_file, 'w') as f:
        json.dump(data, f)
elif version=='v0.2.0':
    # Version 0.2 model
    reactions = {}
    for reaction in m.reactions:
        mets = {}
        for metabolite_id, coefficient in reaction._metabolites.iteritems():
            mets[unicode(metabolite_id)] = {'coefficient': coefficient}
        reactions[unicode(reaction.id)] = {'metabolites': mets}
    data = {'reactions': reactions}

    out_file = os.path.join(directory, 'cobra_model_0.2.json')
    with open(out_file, 'w') as f:
        json.dump(data, f)
        
elif version=='v0.4.0':
    # Version 0.4 model
    reactions = {}
    compartments = {'_c': 'cytosol', '_p': 'periplasm', '_e': 'extracellular'}
    for reaction in m.reactions:
        mets = {}
        for metabolite, coefficient in reaction._metabolites.iteritems():
            # get the compartment
            try:
                compartment = compartments[metabolite.id[-2:]]
            except KeyError:
                raise Exception('Compartment not found for: %s' % metabolite.id)

            # replace __ with -
            the_id = unicode(metabolite.id).replace('__', '-')
            # add metabolite
            mets[the_id] = { 'coefficient': coefficient,
                             'compartment': compartment }
            
        # replace __ with -
        the_id = unicode(reaction.id).replace('__', '-')

        # save reaction
        reactions[the_id] = { 'metabolites': mets,
                              'reversibility': reaction.reversibility,
                              'name': reaction.name }

        # # check that they are all in the same compartment
        # first_compartment = mets.iterkeys().next()[-2:]
        # if all([met_id[-2:] == first_compartment for met_id in mets.iterkeys()]):
        #     # remove compartment labels
        #     new_mets = dict([(k[:-2], v) for k, v in mets.iteritems()])
        #     reactions[unicode(reaction.id)] = {'metabolites': new_mets,
        #                                        'compartment': first_compartment.replace('_','')}
        # else:
        #     # transport reaction
        #     reactions[unicode(reaction.id)] = {'metabolites': mets,
        #                                        'compartment': 'transport'}
        
    data = {'reactions': reactions}

    out_file = os.path.join(directory, 'iJO1366_visbio_model_0.4.0.json')
    with open(out_file, 'w') as f:
        json.dump(data, f)
