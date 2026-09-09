"""Read-only storefront crawl; writes evidence locally, never submits forms."""
import concurrent.futures
import json
from pathlib import Path
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

OUT = Path('staging/launch-audit-20260908')
OUT.mkdir(parents=True, exist_ok=True)
PATHS = ['/', '/products/sea-moss-gel-banana', '/products/raw-honduran-batana-oil',
         '/products/himalayan-shilajit', '/collections/all', '/pages/about',
         '/pages/contact', '/pages/faq', '/pages/quiz', '/cart', '/search?q=sea+moss',
         '/policies/shipping-policy', '/policies/refund-policy',
         '/policies/privacy-policy', '/policies/terms-of-service']

def fetch(base, path):
    try:
        r = requests.get(base + path, timeout=35)
        soup = BeautifulSoup(r.text, 'html.parser')
        links = sorted(set(a.get('href') for a in soup.select('a[href]')))
        forms = [{'action': f.get('action'), 'method': f.get('method'),
                  'fields': [i.get('name') for i in f.select('input,select,textarea')]} for f in soup.select('form')]
        for x in soup.select('script,style,noscript,svg'): x.decompose()
        main = soup.select_one('main') or soup
        result = {'base': base, 'path': path, 'status': r.status_code, 'url': r.url,
                  'title': soup.title.get_text() if soup.title else '',
                  'h1': [h.get_text(' ', strip=True) for h in soup.select('h1')],
                  'text': main.get_text(' ', strip=True), 'links': links, 'forms': forms,
                  'footer': (soup.select_one('footer').get_text(' ', strip=True) if soup.select_one('footer') else ''),
                  'liquid_errors': 'Liquid error' in r.text}
        slug = ('preview' if '127.0.0.1' in base else 'live') + '-' + (path.strip('/').replace('/', '-').replace('?', '-').replace('=', '-') or 'home')
        (OUT / (slug + '.html')).write_text(r.text, encoding='utf-8')
        return result
    except Exception as e:
        return {'base': base, 'path': path, 'error': str(e)}

if __name__ == '__main__':
    jobs = [(b, p) for b in ['http://127.0.0.1:9292', 'https://healistix.com'] for p in PATHS]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(lambda args: fetch(*args), jobs))
    (OUT / 'pages.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    for r in results:
        print(json.dumps({k: r.get(k) for k in ['base','path','status','title','h1','error','liquid_errors']}, ensure_ascii=True))
