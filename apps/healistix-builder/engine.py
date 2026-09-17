"""Pure, deterministic validation around optional untrusted model suggestions."""
import base64
import copy
import hashlib
import json
import uuid
from decimal import Decimal
from pathlib import Path

from policy import DO_NOT_IDS, IODINE_NOTE, MEDTIMING_NOTE, PROVIDER_NOTE, ROUTES, SYNONYMS, matches, normalize, safe_copy
from schema import CONDITIONS, EDIT_REQUEST, LIBRARY, MODEL, REQUEST, RESPONSE, errors

ROOT = Path(__file__).parent
CONFIG = json.loads((ROOT/'config.json').read_text())
HERBS = {h['id']:h for h in LIBRARY['herbs']}
USES = {u['id']:u for u in LIBRARY['uses']}

def envelope(status, code=None, message=None, field=''):
    return dict(schema_version='1', request_id=str(uuid.uuid4()), status=status, build=None, display=None,
                notes=[], errors=[] if code is None else [dict(code=code,field=field,message=message)],
                clarification=None, foundation_url=CONFIG['foundation_url'] if status=='foundation' else None,
                pricing=None,availability=None,purchase=dict(enabled=False,reason_code='PREVIEW_ONLY'))

def number(value):
    value = Decimal(str(value))
    return int(value) if value == value.to_integral_value() else float(value)

def dose(herb, strength):
    h = HERBS[herb]
    return number(min(Decimal(str(h['default_g'])) * (Decimal(str(CONFIG['strong_multiplier'])) if strength=='strong' else 1),Decimal(str(h['max_g']))))

def context(request):
    customer = request['customer']
    flags = {CONDITIONS[c] for c in customer['conditions']}
    if customer['stim_sensitive']:
        flags.add('STIM')
    routed, restrictions, matched = [], set(), False
    status = None
    for pattern, flag, goals, action in ROUTES:
        if matches(pattern,request['goal_text']):
            matched = True
            if flag:
                flags.add(flag)
            routed.extend(goals)
            if action in ('foundation','stopped'):
                if status != 'stopped':
                    status = action
            elif action:
                restrictions.add(action)
    if customer['pregnant_nursing'] or 'PREG' in flags:
        status = status or 'foundation'
    if not customer['adult']:
        status = 'stopped'  # Adult-only retail destination unresolved: no catalog link.
    if customer['seaweed_iodine_allergy']:
        status = 'stopped'
    allergy = normalize(customer['allergies'].strip())
    if allergy:
        known = ['seaweed','iodine','sea moss','lime','citric acid'] + LIBRARY['flavors'][1:]
        known += list(HERBS) + [h['name'] for h in HERBS.values()]
        if any(matches(__import__('re').escape(normalize(name)),allergy) for name in known):
            status = 'stopped'
        elif status != 'stopped':
            status = 'allergy_unresolved'
    if not customer['screening_complete'] and status != 'stopped':
        status = 'screening_incomplete'
    if customer['country'] != 'US' and status not in ('stopped','screening_incomplete'):
        status = 'shipping_unavailable'
    goals = list(dict.fromkeys(routed)) if routed else list(request['use_chips'])
    if not goals:
        goals = [use for use, words in SYNONYMS.items() if any(matches(__import__('re').escape(word),request['goal_text']) for word in words)]
    # Explicit vitality chips already express preference. Generic words require selection.
    if not goals and matches('vitality|drive',request['goal_text']) and customer['sex']:
        goals = ['vitality-'+customer['sex']]
    notes = []
    if flags or matched or customer['pregnant_nursing']:
        notes.append(dict(code='PROVIDER',text=PROVIDER_NOTE))
    if 'THYROID' in flags:
        notes.append(dict(code='IODINE',text=IODINE_NOTE))
    return dict(flags=flags,goals=goals[:2],restrictions=restrictions,notes=notes,status=status)

def allowed(herb_id, ctx, strength='standard'):
    h = HERBS.get(herb_id)
    if not h or herb_id in DO_NOT_IDS or herb_id in CONFIG['unavailable_herbs']:
        return False
    # MEDTIMING is deliberately informational, unlike exclusion flags.
    if (set(h['flags']) - {'MEDTIMING'}) & ctx['flags']:
        return False
    if 'gentle' in ctx['restrictions'] and herb_id not in ('slippery-elm','marshmallow-root','chamomile'):
        return False
    if 'mild_unresolved' in ctx['restrictions']:
        return False  # No approved mild-stress set supplied.
    if herb_id=='horsetail' and dose(herb_id,strength)>3:
        return False  # Library note conflicts with strong daily-use amount.
    return True

def validate_recipe(recipe,request,ctx):
    from schema import RECIPE
    if errors(RECIPE,recipe):
        return 'INVALID_RECIPE','Choose one to four different herbs and one or two listed goals.'
    ids = [h['id'] for h in recipe['herbs']]
    if len(set(ids)) != len(ids):
        return 'DUPLICATE_HERB','Each herb can appear only once.'
    if ctx['goals'] and set(recipe['uses']) != set(ctx['goals']):
        return 'GOAL_MISMATCH','Keep the current goals or update your goal answers first.'
    for item in recipe['herbs']:
        h = HERBS[item['id']]
        if not allowed(item['id'],ctx,request['strength_pref']):
            return 'HERB_EXCLUDED','An ingredient is unavailable for this selection.'
        if not set(h['uses']) & set(recipe['uses']):
            return 'HERB_USE_MISMATCH','An ingredient does not match the selected goals.'
        if Decimal(str(item['g'])) != Decimal(str(dose(item['id'],request['strength_pref']))):
            return 'INVALID_AMOUNT','Use the listed amount for the selected strength.'
    total = sum(Decimal(str(h['g'])) for h in recipe['herbs'])
    thickeners = sum(Decimal(str(h['g'])) for h in recipe['herbs'] if HERBS[h['id']]['thickens'])
    if total > CONFIG['max_total_powder_g']:
        return 'POWDER_LIMIT','The total powder exceeds the limit for one jar.'
    if thickeners > CONFIG['max_thickener_g']:
        return 'THICKENER_LIMIT','This combination exceeds the thickener limit.'
    if sum(h in CONFIG['strong_bitter_ids'] for h in ids)>CONFIG['max_strong_bitter']:
        return 'TASTE_LIMIT','Choose only one of these strongly bitter ingredients.'
    return None

def canonical(build):
    # v1 brief includes uses; sorted uses make list order irrelevant, not goal identity.
    value = {k:copy.deepcopy(v) for k,v in build.items() if k not in ('build_id','engine_version','library_version')}
    value['herbs'] = sorted([dict(id=h['id'],g=number(h['g'])) for h in value['herbs']],key=lambda h:h['id'])
    value['uses'] = sorted(value['uses'])
    value['total_powder_g'] = number(value['total_powder_g'])
    return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()

def digest(build):
    return hashlib.sha256(canonical(build)).hexdigest()

def price(build):
    count = len(build['herbs'])
    premium = sum(HERBS[h['id']]['premium'] for h in build['herbs'])
    tier = CONFIG['tier_1_2_minor'] if count<=2 else CONFIG['tier_3_4_minor']
    rows = [dict(code='BASE_TIER',label='Custom jar',quantity=1,unit_minor=tier,total_minor=tier)]
    for code,label,quantity,unit in [('STRONG','Strong',int(build['strength']=='strong'),CONFIG['strong_minor']),('PREMIUM','Premium herbs',premium,CONFIG['premium_each_minor'])]:
        if quantity:
            rows.append(dict(code=code,label=label,quantity=quantity,unit_minor=unit,total_minor=quantity*unit))
    return dict(currency=CONFIG['currency'],total_minor=sum(r['total_minor'] for r in rows),breakdown=rows,confirmed=False)

def recipe_record(build):
    # Pure outcome-only record factory. No persistent store or public write endpoint yet.
    return dict(record_version='1',recipe_digest=digest(build),build=copy.deepcopy(build),
                pricing_version=CONFIG['pricing_version'],pricing=price(build),approval_status='provisional')

def public_herb(h,strength='standard'):
    return dict(id=h['id'],name=h['name'],default_g=number(h['default_g']),max_g=number(h['max_g']),
                g=dose(h['id'],strength),premium=h['premium'],approved_phrase=h['approved_phrase'])

def render(recipe,request,ctx):
    failure = validate_recipe(recipe,request,ctx)
    if failure:
        return envelope('invalid',*failure,field='recipe')
    herbs = sorted([dict(id=h['id'],g=number(h['g'])) for h in recipe['herbs']],key=lambda h:h['id'])
    build = dict(base='gold-16oz',flavor={k:request['flavor_pref'][k] for k in ('id','level')},
                 strength=request['strength_pref'],herbs=herbs,uses=sorted(recipe['uses']),
                 total_powder_g=number(sum(Decimal(str(h['g'])) for h in herbs)),
                 engine_version=CONFIG['engine_version'],library_version=LIBRARY['library_version'])
    build['build_id'] = 'B-'+base64.b32encode(bytes.fromhex(digest(build))).decode()[:8]
    explanation = 'For '+', '.join(USES[u]['name'] for u in build['uses'])+': '+ '; '.join(HERBS[h['id']]['approved_phrase'] for h in herbs)+'.'
    if len(explanation.split())>80 or not safe_copy(explanation):
        return envelope('unavailable','COPY_UNAVAILABLE','The blend description is unavailable.')
    choices = [h for h in HERBS.values() if allowed(h['id'],ctx,request['strength_pref']) and set(h['uses'])&set(recipe['uses'])]
    swaps = {}
    for item in herbs:
        old = HERBS[item['id']]
        candidates = [h for h in choices if h['id'] not in [i['id'] for i in herbs] and h['premium']==old['premium']]
        candidates.sort(key=lambda h:(-len(set(h['uses'])&set(old['uses'])),h['taste']!=old['taste'],h['id']))
        swaps[item['id']] = []
        for h in candidates:
            changed = dict(uses=recipe['uses'],herbs=[dict(id=h['id'],g=dose(h['id'],request['strength_pref'])) if x['id']==item['id'] else x for x in herbs])
            if not validate_recipe(changed,request,ctx):
                swaps[item['id']].append(h['id'])
            if len(swaps[item['id']])==3:
                break
    response = envelope('recommended')
    response['build'],response['pricing'] = build,price(build)
    response['display'] = dict(summary=f"{build['flavor']['id'].title()} ({build['flavor']['level']}) · "+', '.join(USES[u]['name'] for u in build['uses'])+' · '+build['strength'].title(),
                              explanation=explanation,uses=[dict(id=u,name=USES[u]['name']) for u in build['uses']],
                              herbs=[dict(id=h['id'],g=h['g'],name=HERBS[h['id']]['name'],approved_phrase=HERBS[h['id']]['approved_phrase']) for h in herbs],
                              editable_herbs=[public_herb(h,request['strength_pref']) for h in choices],swaps=swaps)
    response['notes'] = list(ctx['notes'])+[dict(code='PREVIEW',text='Review preview. Ingredients, amounts and prices are provisional. Purchasing is unavailable.')]
    if any('MEDTIMING' in HERBS[h['id']]['flags'] for h in herbs):
        response['notes'].append(dict(code='MEDTIMING',text=MEDTIMING_NOTE))
    assert not errors(RESPONSE,response)
    return response

def fallback(request,ctx):
    goals = ctx['goals']
    if not goals:
        if request['clarification_attempted']:
            response = envelope('foundation')
            response['notes'] = [dict(code='FOUNDATION',text='No added-herb blend was selected. Regular gel options require their own suitability check.')]
            return response
        response = envelope('clarification')
        response['clarification'] = dict(question='Which of these goals best fits what you are looking for?',options=[dict(id=u['id'],name=u['name']) for u in USES.values()])
        return response
    if goals[0]=='energy' and ctx['flags'] & {'STIM','CAFFEINE'}:
        return envelope('unavailable','PAIRING_CONFLICT','This alternative blend is awaiting quantity confirmation.')
    selected = []
    for item in USES[goals[0]]['default_pairing']:
        if allowed(item['id'],ctx,request['strength_pref']):
            if item['g'] != HERBS[item['id']]['default_g']:
                return envelope('unavailable','PAIRING_CONFLICT','This blend is awaiting quantity confirmation.')
            selected.append(dict(id=item['id'],g=dose(item['id'],request['strength_pref'])))
    # Fill after exclusions at library amounts, always revalidate the entire candidate jar.
    candidates = sorted(HERBS.values(),key=lambda h:(-len(set(h['uses'])&set(goals)),h['premium'],h['id']))
    for h in candidates:
        needs_second_goal = len(goals)==2 and not any(goals[1] in HERBS[i['id']]['uses'] for i in selected)
        if len(selected)>=2 and not needs_second_goal:
            break
        if h['id'] in [i['id'] for i in selected] or (needs_second_goal and goals[1] not in h['uses']):
            continue
        changed = selected + [dict(id=h['id'],g=dose(h['id'],request['strength_pref']))]
        if not validate_recipe(dict(uses=goals,herbs=changed),request,ctx):
            selected=changed
    recipe = dict(uses=goals,herbs=selected)
    if any(not any(goal in HERBS[item['id']]['uses'] for item in selected) for goal in goals):
        return envelope('unavailable','NO_VALID_FALLBACK','No validated blend is available for all selected goals.')
    failure = validate_recipe(recipe,request,ctx)
    if failure:
        return envelope('unavailable','NO_VALID_FALLBACK','No validated blend is available for these choices.')
    return render(recipe,request,ctx)

def process(request,operation='recommend',provider=None):
    validation = errors(REQUEST if operation=='recommend' else EDIT_REQUEST,request)
    if validation:
        # Never include jsonschema messages: they contain the rejected sensitive value.
        if operation!='recommend' and isinstance(request,dict) and isinstance(request.get('recipe'),dict) and request['recipe'].get('herbs')==[]:
            return envelope('invalid','HERBS_REQUIRED','Keep at least one herb in a custom blend.',field='recipe.herbs')
        return envelope('invalid','INVALID_REQUEST','Complete all required answers using the listed choices.')
    ctx = context(request)
    status = ctx['status']
    if status:
        if status in ('stopped','foundation'):
            response = envelope(status)
            response['notes'] = ctx['notes']+[dict(code='GATE',text='This builder cannot offer an added-herb blend for these answers.')]
            return response
        return envelope('invalid' if status=='screening_incomplete' else 'unavailable',status.upper(),
                        'Complete the suitability checklist.' if status=='screening_incomplete' else 'These choices need confirmation before a blend can be offered.')
    if 'mild_unresolved' in ctx['restrictions']:
        response = envelope('unavailable','ROUTING_POLICY_UNRESOLVED','This blend option is awaiting review.')
        response['notes']=ctx['notes']
        return response
    if operation!='recommend':
        if not ctx['goals']:
            return envelope('invalid','GOALS_REQUIRED','Choose your goals before editing a blend.')
        response=render(request['recipe'],request,ctx)
        if operation=='prepare-cart' and response['status']=='recommended':
            return envelope('unavailable','PURCHASE_UNAVAILABLE','Purchasing is unavailable in this review preview.')
        return response
    if provider:
        candidates = [public_herb(h,request['strength_pref']) | {'uses':h['uses']} for h in HERBS.values() if allowed(h['id'],ctx,request['strength_pref'])]
        reason = None
        for _ in range(2):
            try:
                output = provider.recommend(dict(goal_text=request['goal_text'],uses=ctx['goals'],candidates=candidates,
                                                  flavor=request['flavor_pref']['id']),reason)
                if errors(MODEL,output):
                    reason='SCHEMA_INVALID'
                    continue
                if output['needs_clarification']:
                    break  # Never display model-written questions.
                recipe=dict(uses=output['uses'],herbs=output['herbs'])
                failure=validate_recipe(recipe,request,ctx)
                if failure or not safe_copy(output['explanation']) or len(output['explanation'].split())>80:
                    reason=failure[0] if failure else 'COPY_INVALID'
                    continue
                # Even an allowed model explanation is replaced with exact seeded phrases.
                return render(recipe,request,ctx)
            except Exception:
                break  # No raw provider error, content or credentials logged.
    response=fallback(request,ctx)
    if response['status']!='recommended':
        response['notes']=ctx['notes']+response['notes']
    return response

def catalog():
    return dict(schema_version='1',request_id=str(uuid.uuid4()),
                uses=[dict(id=u['id'],name=u['name']) for u in USES.values()],
                herbs=[public_herb(h) for h in HERBS.values() if h['id'] not in CONFIG['unavailable_herbs'] and h['id'] not in DO_NOT_IDS],
                flavors=LIBRARY['flavors'],conditions=list(CONDITIONS),
                capabilities=dict(preview_only=True,model_configured=False,pricing_confirmed=False,availability_confirmed=False),
                purchase=dict(enabled=False,reason_code='PREVIEW_ONLY'))
