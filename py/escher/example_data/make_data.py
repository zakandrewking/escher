from theseus import load_model
import math
import cobra.io
import random
import json
import pandas as pd

# model
ijo = load_model('iJO1366')
ijo.genes.get_by_id('b1779').name = 'gapA'
cobra.io.save_json_model(ijo, 'iJO1366.json')

# gene data
gene_data = {gene.id: random.random() * 20 for gene in ijo.genes}
with open('gene_data_iJO1366.json', 'w') as f:
    json.dump(gene_data, f)

(pd.DataFrame.from_records(gene_data.items(), columns=['gene', 'value'])
 .to_csv('gene_data_iJO1366.csv', index=None))

# reaction text data
reaction_text_data = {reaction.id: reaction.build_reaction_string() for reaction in ijo.reactions}

(pd.DataFrame.from_records(reaction_text_data.items(), columns=['reaction', 'value'])
 .to_csv('reaction_text_data_iJO1366.csv', index=None))

# convert RNA-seq data to normalize data that looks like array data
with open('aerobic_anaerobic_E_coli_RNA-seq.json', 'r') as f:
    gene_comparison = json.load(f)
all_vals = gene_comparison[0].values() + gene_comparison[1].values()
# log values
all_vals = [math.pow(x, 1./4) for x in all_vals if x > 0]
the_min, the_max = min(all_vals), max(all_vals)
diff = the_max - the_min
norm = lambda x: (x * 2 / diff) - 1 - (the_min * 2 / diff)
out = []
for dataset in gene_comparison:
    this_out = {}
    for k, v in dataset.iteritems():
        if v > 0:
            this_out[k] = norm(math.pow(v, 1./4))
    out.append(this_out)
with open('aerobic_anaerobic_E_coli_RNA-seq_negatives.json', 'w') as f:
    json.dump(out, f)
