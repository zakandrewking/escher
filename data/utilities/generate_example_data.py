import pandas as pd
import random
random.seed(10)
import numpy as np
from scipy import percentile
import json

df = pd.DataFrame(np.random.randn(8, 4), columns=['A', 'B', 'C', 'D'])

out = []
for row in df.T.itertuples(index=False):
    out.append({'max': max(row), 'min': min(row), 
                'Q1': percentile(row, 25), 
                'median': percentile(row, 50), 
                'Q3': percentile(row, 75)})
print out

with open("../quartiles/quartiles.json", "w") as f:
    json.dump(out, f)
