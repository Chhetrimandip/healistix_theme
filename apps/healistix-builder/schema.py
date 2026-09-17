"""Executable Draft 2020-12 contract. Generate portable files with python schema.py."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).parent
LIBRARY = json.loads((ROOT / 'data/library.json').read_text(encoding='utf-8'))
CONDITIONS = dict(thyroid='THYROID', blood_thinners='ANTICOAG', blood_pressure='BP',
                  diabetes_meds='GLUCOSE', sedatives='SEDATIVE', antidepressants='SSRI',
                  hormone_sensitive='HORMONE', kidney='KIDNEY', autoimmune='AUTOIMMUNE',
                  seizures='SEIZURE', reflux='GERD', ragweed='ASTER', caffeine_sensitive='CAFFEINE')

def obj(properties, required=None):
    return dict(type='object', properties=properties, required=list(properties) if required is None else required, additionalProperties=False)

def choice(values):
    return {'enum': list(values)}

def array(items, minimum=0, maximum=100, unique=False):
    return dict(type='array', items=items, minItems=minimum, maxItems=maximum, uniqueItems=unique)

TEXT = {'type': 'string'}
BOOL = {'type': 'boolean'}
USE = choice(u['id'] for u in LIBRARY['uses'])
USES = array(USE, 1, 2, True)
FLAVOR = obj(dict(id=choice(LIBRARY['flavors']), level=choice(['standard', 'extra'])))
HERB = obj(dict(id=choice(h['id'] for h in LIBRARY['herbs']), g={'type': 'number', 'exclusiveMinimum': 0, 'maximum': 30}))
RECIPE = obj(dict(uses=USES, herbs=array(HERB, 1, 4)))
CUSTOMER = obj(dict(adult=BOOL, pregnant_nursing=BOOL, seaweed_iodine_allergy=BOOL,
                    screening_complete=BOOL, first_time=BOOL, sex=choice([None, 'men', 'women']),
                    stim_sensitive=BOOL, conditions=array(choice(CONDITIONS), 0, len(CONDITIONS), True),
                    allergies={'type': 'string', 'maxLength': 200}, country={'type': 'string', 'pattern': '^[A-Z]{2}$'}))
REQUEST = obj(dict(goal_text={'type': 'string', 'maxLength': 200}, use_chips=array(USE, 0, 2, True),
                   customer=CUSTOMER, flavor_pref=obj(dict(id=choice(LIBRARY['flavors']),
                   family=choice(['tropical', 'berry', 'citrus', 'floral', 'none']), level=choice(['standard', 'extra']))),
                   strength_pref=choice(['standard', 'strong']), clarification_attempted=BOOL))
EDIT_REQUEST = obj(dict(**REQUEST['properties'], recipe=RECIPE))
MODEL = obj(dict(uses=USES, herbs=array(HERB, 0, 4), flavor_suggestion=choice(LIBRARY['flavors']),
                 explanation={'type':'string','maxLength':1000}, needs_clarification=BOOL,
                 clarify_question={'type':'string','maxLength':200}))
BUILD = obj(dict(build_id={'type':'string','pattern':'^B-[A-Z2-7]{8}$'}, base=choice(['gold-16oz']),
                 flavor=FLAVOR, strength=choice(['standard','strong']), herbs=array(HERB,1,4), uses=USES,
                 total_powder_g={'type':'number','exclusiveMinimum':0,'maximum':30},
                 engine_version=TEXT, library_version=TEXT))
PUBLIC_HERB = obj(dict(id=TEXT,name=TEXT,default_g={'type':'number'},max_g={'type':'number'},
                       g={'type':'number'},premium=BOOL,approved_phrase=TEXT))
DISPLAY = obj(dict(summary=TEXT, explanation=TEXT, uses=array(obj(dict(id=USE,name=TEXT)),1,2),
                   herbs=array(obj(dict(id=TEXT,name=TEXT,g={'type':'number'},approved_phrase=TEXT)),1,4),
                   editable_herbs=array(PUBLIC_HERB), swaps={'type':'object','additionalProperties':array(TEXT,0,3,True)}))
nullable = lambda s: {'anyOf':[s,{'type':'null'}]}
PURCHASE = obj(dict(enabled={'const':False},reason_code=TEXT))
PRICING = obj(dict(currency={'const':'USD'},total_minor={'type':'integer','minimum':0},
                   breakdown=array(obj(dict(code=TEXT,label=TEXT,quantity={'type':'integer','minimum':0},
                   unit_minor={'type':'integer','minimum':0},total_minor={'type':'integer','minimum':0}))), confirmed={'const':False}))
RESPONSE = obj(dict(schema_version={'const':'1'},request_id=TEXT,
                    status=choice(['recommended','clarification','foundation','stopped','invalid','unavailable']),
                    build=nullable(BUILD),display=nullable(DISPLAY),
                    notes=array(obj(dict(code=TEXT,text=TEXT))),errors=array(obj(dict(code=TEXT,field=TEXT,message=TEXT))),
                    clarification=nullable(obj(dict(question=TEXT,options=array(obj(dict(id=USE,name=TEXT)),1,16)))),
                    foundation_url=nullable(TEXT),pricing=nullable(PRICING),
                    availability=nullable(obj(dict(ship_by=nullable(TEXT),confirmed=BOOL))),purchase=PURCHASE))
RECORD = obj(dict(record_version={'const':'1'},recipe_digest=TEXT,build=BUILD,pricing_version=TEXT,
                  pricing=PRICING,approval_status={'const':'provisional'}))
CATALOG = obj(dict(schema_version={'const':'1'},request_id=TEXT,
                   uses=array(obj(dict(id=USE,name=TEXT)),16,16),herbs=array(PUBLIC_HERB),
                   flavors=array(choice(LIBRARY['flavors']),19,19,True),conditions=array(choice(CONDITIONS),13,13,True),
                   capabilities=obj(dict(preview_only={'const':True},model_configured=BOOL,pricing_confirmed={'const':False},availability_confirmed={'const':False})),purchase=PURCHASE))

def errors(schema, value):
    return list(Draft202012Validator(schema).iter_errors(value))

if __name__ == '__main__':
    directory = ROOT / 'schemas'
    directory.mkdir(exist_ok=True)
    for name, value in [('recommend-request',REQUEST),('validate-request',EDIT_REQUEST),('response',RESPONSE),('catalog',CATALOG),('model-output',MODEL),('recipe-record',RECORD)]:
        Draft202012Validator.check_schema(value)
        (directory / (name+'.schema.json')).write_text(json.dumps({'$schema':'https://json-schema.org/draft/2020-12/schema',**value},indent=2)+'\n',encoding='utf-8')
