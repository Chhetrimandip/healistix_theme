"""Server-only Claude Messages adapter, disabled unless explicitly configured.

No key needed for deterministic tests. Never log request bodies or provider responses.
Retention is an account/model agreement, not something this module can switch off.
"""
import json
import os
import urllib.request
from pathlib import Path

class ClaudeProvider:
    def __init__(self, key, model, opener=None):
        if not key or not model:
            raise ValueError('Provider configuration incomplete')
        self.key, self.model = key,model
        self.opener = opener or urllib.request.urlopen

    def recommend(self,payload,failure_code=None):
        # Only screened candidates, goal text and goal IDs; never raw screening/allergy answers.
        system = (Path(__file__).parent/'prompts/recommend.txt').read_text()
        if failure_code:
            system += '\nPrevious attempt failed deterministic validation: '+failure_code
        body=dict(model=self.model,max_tokens=800,temperature=0,system=system,
                  messages=[dict(role='user',content=json.dumps(payload))])
        request=urllib.request.Request('https://api.anthropic.com/v1/messages',data=json.dumps(body).encode(),
                   headers={'content-type':'application/json','x-api-key':self.key,'anthropic-version':'2023-06-01'},method='POST')
        with self.opener(request,timeout=6) as response:
            raw=response.read(65537)
        if len(raw)>65536:
            raise ValueError('Provider response too large')
        result=json.loads(raw)
        if result.get('stop_reason')!='end_turn':
            raise ValueError('Incomplete provider response')
        blocks=result.get('content',[])
        if len(blocks)!=1 or blocks[0].get('type')!='text':
            raise ValueError('Unsupported provider content')
        from server import strict_json
        return strict_json(blocks[0]['text'])

def configured_provider():
    if os.environ.get('BUILDER_PROVIDER')!='claude':
        return None
    if os.environ.get('BUILDER_PROVIDER_PRIVACY_REVIEWED')!='true':
        raise ValueError('Review provider retention before enabling external processing')
    return ClaudeProvider(os.environ.get('ANTHROPIC_API_KEY'),os.environ.get('ANTHROPIC_MODEL'))
