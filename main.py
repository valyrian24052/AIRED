import json

# Read the JSON file
with open('data.json', 'r') as json_file:
    data = json.load(json_file)

# Write to JSONL file
with open('data.jsonl', 'w') as jsonl_file:
    for item in data:
        jsonl_file.write(json.dumps(item) + '\n')
