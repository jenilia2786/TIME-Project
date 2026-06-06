import urllib.request
import json
import codecs

data = json.loads(urllib.request.urlopen('http://localhost:8000/college/2710').read().decode('utf-8'))
with codecs.open('cutoffs_utf8.txt', 'w', encoding='utf-8') as f:
    f.write(json.dumps(data['branches'], indent=2))
