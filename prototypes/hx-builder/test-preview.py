from urllib.request import urlopen, Request
from urllib.error import HTTPError
for path in ['/.git/config','/%2e%2e/design.md','/design.md','/assets/','/apps/healistix-builder/config.json']:
    try: urlopen('http://127.0.0.1:8788'+path); raise AssertionError(path)
    except HTTPError as e: assert e.code==404,(path,e.code)
for value in ['-1','not-a-number','20000']:
    try:
        urlopen(Request('http://127.0.0.1:8788/api/recommend',data=b'{}',headers={'Content-Length':value})); raise AssertionError(value)
    except HTTPError as e: assert e.code in [400,413],(value,e.code)
print('8 preview boundary checks passed.')
