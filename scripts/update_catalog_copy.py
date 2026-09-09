from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
p=root/'templates/product.seamoss.json'
text=p.read_text(encoding='utf-8'); prefix=text[:text.index('{')]; data=json.loads(text[text.index('{'):])
s=data['sections']
s['main']['blocks']['info_tab_1']['settings']['content']='<p><strong>Find your next favorite spoonful.</strong> Browse bright fruit flavors, familiar classics and blends. Choose a jar to see its photos, price and availability.</p><p>Where available, tap 360° to take a look around or View Jar Label to read the printed details.</p>'
steps=s['product_steps']['blocks']
steps['step_1']['settings']['text']='From Banana and Blueberry to tropical fruit blends, choose the jar that catches your eye.'
steps['step_2']['settings']['text']='Tap the photos for a closer look at your selected jar.'
steps['step_3']['settings']['text']='When you see the 360° thumbnail, tap it and drag horizontally to turn the jar.'
steps['step_4']['settings']['text']='Open View Jar Label, where available, to read the printed details for your flavor.'
faq=s['product_faq']['blocks']
faq['faq_1']['settings']['answer']='Browse the flavor selector at the top of this page for the full selection. Pick a flavor to see its photos, current price and availability.'
faq['faq_3']['settings']['answer']='When your selected flavor has a 360° thumbnail, tap it and drag horizontally. You can also use the arrow controls, zoom buttons or keyboard arrows. Open View Jar Label for a flat, readable view of the printed panels.'
faq['faq_6']['settings']['answer']='Choose your flavor, then open View Jar Label where available. If your selection does not have a label view yet, contact hi@healistix.com for its details before ordering. Follow the directions on the jar you receive.'
s['benefits_list']['settings']['heading']='A few to get you started'
s['benefits_list']['settings']['subheading']='Meet five favorites, then explore the full flavor selection above.'
manifest=json.loads((root/'staging/overnight-asset-manifest.json').read_text())
for item in manifest:
    key='flavor_'+item['slug'].replace('-','_')
    if key not in s['main']['blocks']:
        s['main']['blocks'][key]={'type':'flavor','settings':{'label':item['flavor'],'option_value':item['flavor'],'tagline':'','badge':''}}
        s['main']['block_order'].insert(len([k for k in s['main']['block_order'] if k.startswith('flavor_')]),key)
p.write_text(prefix+json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Updated catalog copy and merchant flavor blocks')
