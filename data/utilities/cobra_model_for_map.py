import cobra.io, re, pandas, json, os
from IPython.display import HTML

m = cobra.io.load_matlab_model('../models/iJO1366.mat')
directory = "../maps"

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
