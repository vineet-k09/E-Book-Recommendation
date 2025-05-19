
#backend/scripts/exports/hdfs/refreshData.py

import json

with open('backend/scripts/exports/hdfs/interactions.json', 'r', encoding='utf-8') as f_in, open('interactions_lines.json', 'w', encoding='utf-8') as f_out:
    data = json.load(f_in)  # loads the entire array
    for obj in data:
        f_out.write(json.dumps(obj) + '\n')
