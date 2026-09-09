"""Follow internal page links and quiz destinations from saved launch crawl."""
import concurrent.futures
import importlib.util
import json
import re
from pathlib import Path
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

spec = importlib.util.spec_from_file_location('audit', Path(__file__).with_name('audit-storefront.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
pages = json.loads((audit.OUT / 'pages.json').read_text(encoding='utf-8'))
quiz = Path('sections/hx-quiz-flow.liquid').read_text(encoding='utf-8')
paths = {'/products/' + h for h in re.findall(r"handle: '([^']+)'", quiz)}
for page in pages:
    for link in page.get('links', []):
        u = urlparse(link)
        if (not u.netloc or u.netloc == 'healistix.com') and u.path.startswith(('/pages/', '/collections/', '/policies/', '/products/')):
            paths.add(u.path)
paths.update(['/pages/about-us', '/pages/provenance'])
known = {(p['base'], p['path']) for p in pages if p.get('status') != 502}
jobs = [(b, p) for b in ['http://127.0.0.1:9292', 'https://healistix.com'] for p in sorted(paths) if (b, p) not in known]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    extra = list(pool.map(lambda args: audit.fetch(*args), jobs))
(audit.OUT / 'linked-pages.json').write_text(json.dumps(extra, ensure_ascii=False, indent=2), encoding='utf-8')
for r in extra:
    print(json.dumps({k: r.get(k) for k in ['base','path','status','title','error']}, ensure_ascii=True))
catalog = requests.get('https://healistix.com/products.json?limit=250', timeout=35).json()
(audit.OUT / 'public-catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
for p in catalog.get('products', []):
    print(json.dumps({'product':p['title'],'handle':p['handle'],'description':p['body_html'],
                     'variants':[{'id':v['id'],'title':v['title'],'price':v['price'],'available':v['available']} for v in p['variants']]}, ensure_ascii=True))
