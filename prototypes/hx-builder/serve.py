"""Local-only theme review. Proxy POST bodies transiently; never log them."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, unquote
import argparse
import json

ROOT = Path(__file__).resolve().parents[2]
ASSETS = {'hx-builder-shopify-cart.js','hx-builder-test-order.js','hx-builder-test-order-ui.js','hx-builder-app.js','hx-builder-api.js','hx-builder-visuals.js','hx-builder-fixture.js','hx-builder-style.css','hx-builder-raw.webp','hx-builder-logo.png','hx-builder-hero-v1.png','hx-builder-preparation-v1.png'}
class Preview(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *args):
        pass
    def list_directory(self, path):
        self.send_error(404); return None
    def do_GET(self):
        path=unquote(urlsplit(self.path).path)
        if '\\' in path or any(part.startswith('.') for part in path.split('/') if part):
            self.send_error(404); return
        self.path=path
        if path.startswith('/api/'):
            self.proxy()
        else:
            if path == '/': self.path = '/prototypes/hx-builder/index.html'
            allowed=self.path in ['/prototypes/hx-builder/index.html','/prototypes/hx-builder/fixture.html'] or self.path in {f'/assets/{name}' for name in ASSETS}
            fixture=ROOT/'prototypes/hx-builder/fixtures'
            allowed=allowed or self.path in {f'/prototypes/hx-builder/fixtures/{p.name}' for p in fixture.glob('*.json')}
            if not allowed:
                self.send_error(404); return
            super().do_GET()
    def do_HEAD(self):
        self.send_error(405)
    def do_POST(self):
        self.proxy()
    def proxy(self):
        if self.path not in ['/api/catalog','/api/recommend','/api/validate','/api/prepare-cart']:
            self.send_error(404); return
        body=None
        if self.command == 'POST':
            try:
                lengths=self.headers.get_all('Content-Length',[])
                if len(lengths)!=1 or self.headers.get('Transfer-Encoding'): raise ValueError()
                size=int(lengths[0])
                if size<=0: raise ValueError()
                if size>16384:
                    self.send_error(413); return
                self.connection.settimeout(8)
                body=self.rfile.read(size)
                if len(body)!=size: raise ValueError()
            except (ValueError,TimeoutError):
                self.send_error(400); return
        req = Request('http://127.0.0.1:8787' + self.path[4:], data=body, method=self.command, headers={'Content-Type':'application/json'})
        try:
            with urlopen(req, timeout=8) as response:
                status, payload = response.status, response.read()
        except HTTPError as error:
            status, payload = error.code, error.read()
        except (URLError, TimeoutError):
            status, payload = 503, json.dumps({'schema_version':'1','status':'unavailable','request_id':'local-unavailable','build':None,'display':None,'notes':[],'errors':[],'purchase':{'enabled':False}}).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json')
        self.send_header('Cache-Control','no-store')
        self.end_headers(); self.wfile.write(payload)
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()

if __name__ == '__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--port',type=int,default=8788); args=parser.parse_args()
    print(f'Healistix UI review: http://127.0.0.1:{args.port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Preview).serve_forever()
