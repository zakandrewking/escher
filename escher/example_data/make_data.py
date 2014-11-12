from theseus import load_model
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

# 
