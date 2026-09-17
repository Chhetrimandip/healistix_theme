"""Local review HTTP service. Loopback only. Not a production hosting stack."""
import argparse
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

from engine import catalog, envelope, process
from provider import configured_provider
from proxy_auth import verify

def strict_json(raw):
    def pairs(items):
        result={}
        for key,value in items:
            if key in result:
                raise ValueError('Duplicate JSON key')
            result[key]=value
        return result
    def reject(value):
        raise ValueError('Non-finite JSON number')
    return json.loads(raw,object_pairs_hook=pairs,parse_constant=reject)

class Handler(BaseHTTPRequestHandler):
    server_version='HealistixPreview/1'
    def setup(self):
        super().setup()
        self.connection.settimeout(10)

    def log_message(self,*args):
        pass  # Default server logs include URLs: suppress them entirely.

    def respond(self,status,value):
        data=json.dumps(value,allow_nan=False,separators=(',',':')).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(data)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers()
        self.wfile.write(data)

    def authenticated_path(self):
        parsed=urlsplit(self.path)
        if os.environ.get('BUILDER_PROXY_REQUIRED')=='true':
            if not verify(parsed.query,os.environ.get('SHOPIFY_API_SECRET',''),os.environ.get('SHOPIFY_SHOP','')):
                self.respond(401,envelope('unavailable','PROXY_AUTH_FAILED','Request authentication failed.'))
                return None
        elif parsed.query:
            self.respond(400,envelope('invalid','QUERY_NOT_ALLOWED','Send answers in a POST body.'))
            return None
        return parsed.path

    def do_GET(self):
        path=self.authenticated_path()
        if path is None:
            return
        if path=='/catalog':
            value=catalog()
            value['capabilities']['model_configured']=self.server.provider is not None
            self.respond(200,value)
        elif path=='/health':
            self.respond(200,dict(status='ok',preview_only=True,purchase_enabled=False))
        else:
            self.respond(404,envelope('invalid','NOT_FOUND','Endpoint not found.'))

    def do_POST(self):
        path=self.authenticated_path()
        if path is None:
            return
        if path not in ('/recommend','/validate','/prepare-cart'):
            self.respond(404,envelope('invalid','NOT_FOUND','Endpoint not found.'))
            return
        if self.headers.get_content_type()!='application/json':
            self.respond(415,envelope('invalid','CONTENT_TYPE','Send application/json.'))
            return
        try:
            lengths=self.headers.get_all('Content-Length',[])
            if len(lengths)!=1 or self.headers.get('Transfer-Encoding'):
                raise ValueError()
            length=int(lengths[0])
            if length>16384:
                self.respond(413,envelope('invalid','BODY_TOO_LARGE','Request is too large.'))
                return
            if length<=0:
                raise ValueError()
            raw=self.rfile.read(length)
            if len(raw)!=length:
                raise ValueError()
            body=strict_json(raw)
        except (ValueError,UnicodeError,RecursionError,TimeoutError):
            self.respond(400,envelope('invalid','MALFORMED_JSON','Send a valid JSON request.'))
            return
        try:
            result=process(body,path[1:],self.server.provider)
            status={'invalid':422,'unavailable':503}.get(result['status'],200)
            self.respond(status,result)
        except Exception:
            self.respond(503,envelope('unavailable','ENGINE_UNAVAILABLE','The blend service is temporarily unavailable.'))

class Server(ThreadingHTTPServer):
    daemon_threads=True
    def handle_error(self,*args):
        pass  # No exception tracebacks containing request-local values.

def make_server(port=8787,provider=None):
    server=Server(('127.0.0.1',port),Handler)
    server.provider=provider
    return server

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8787)
    args=parser.parse_args()
    server=make_server(args.port,configured_provider())
    print(f'Healistix review engine: http://127.0.0.1:{server.server_port} (purchase disabled)',flush=True)
    server.serve_forever()
