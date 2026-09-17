"""Shopify app-proxy query authentication. Does NOT authorize purchases or bodies."""
import hashlib
import hmac
import time
from urllib.parse import parse_qs

def verify(query,secret,shop,now=None,max_age=300):
    try:
        values=parse_qs(query,keep_blank_values=True,strict_parsing=True,max_num_fields=30)
        for key in ('signature','shop','timestamp','path_prefix','logged_in_customer_id'):
            if key not in values or len(values[key])!=1:
                return False
        signature=values.pop('signature')[0]
        if values['shop']!=[shop] or not secret:
            return False
        if abs((time.time() if now is None else now)-int(values['timestamp'][0]))>max_age:
            return False
        message=''.join(sorted(key+'='+','.join(value) for key,value in values.items()))
        expected=hmac.new(secret.encode(),message.encode(),hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature,expected)
    except (ValueError,TypeError):
        return False
