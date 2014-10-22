from escher.convert_map import genes_for_gene_reaction_rule

def test_genes_for_gene_reaction_rule():
    assert genes_for_gene_reaction_rule('((G1 and G2)or G3and)') == ['G1', 'G2', 'G3and']
