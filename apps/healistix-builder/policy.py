"""Versioned routing implementation of the brief, not independent medical approval."""
import re
import unicodedata

PROVIDER_NOTE = 'Sea moss and herbs can interact with medications. Check with your healthcare provider before adding this to your routine.'
IODINE_NOTE = 'Sea moss is a natural source of iodine.'
MEDTIMING_NOTE = 'Take 2 hours apart from medications.'
DO_NOT_IDS = set('aristolochia duck-flower comfrey lobelia pennyroyal ephedra ma-huang kava yohimbe wormwood tansy rue blue-cohosh black-cohosh goldenseal st-johns-wort senna cascara mucuna kanna chaparral germander poke-root mistletoe bitter-orange arnica'.split())
SYNONYMS = {
 'digestion':['digestion','gut','bloated','bloating','gassy','stomach'],
 'skin-hair-nails':['skin','hair','nails'], 'energy':['energy','tired','sluggish','drained','stamina'],
 'vitality-men':['strong back','male vitality'], 'vitality-women':['female vitality','women vitality'],
 'stress':['stress','calm','relax'], 'sleep':['sleep','rest','bedtime'], 'focus':['focus','memory','concentrate'],
 'joints':['joints','joint','mobility'], 'greens':['greens','minerals','daily routine'],
 'cleanse':['cleanse','clean out'], 'respiratory':['respiratory','chest','seasonal comfort'],
 'metabolism':['metabolism','appetite'], 'womens-balance':['monthly balance','women balance'],
 'recovery':['recovery','workout','exercise'], 'mood':['mood','uplift']}

# Explicit expansions avoid unsafe general substring matching ("flu" in "fluffy").
ROUTES = [
 (r'diabet\w*|blood sugar|insulin|a1c','GLUCOSE',['greens','digestion'],None),
 (r'high blood pressure|hypertension','BP',['stress'],None),
 (r'thyroid\w*|hashimoto\w*|hypothyroid\w*|hyperthyroid\w*|goiter','THYROID',['energy','greens'],None),
 (r'pregnan\w*|breastfeed\w*|nursing|trying to conceive','PREG',[],'foundation'),
 (r'depress\w*|anxiety disorder|bipolar|schizophren\w*|antidepressant\w*','SSRI',['stress'],'mild_unresolved'),
 (r'blood thinner\w*|warfarin|eliquis|surgery','ANTICOAG',[],None),
 (r'cancer\w*|chemo\w*|tumou?r\w*',None,[],'foundation'),
 (r'kidney disease|dialysis','KIDNEY',[],'foundation'),
 (r'liver disease|hepatitis|cirrhosis',None,[],'foundation'),
 (r'heart disease|arrhythmia\w*|stroke|heart failure',None,[],'foundation'),
 (r'epilep\w*|seizure\w*','SEIZURE',[],None),
 (r'lupus|ms|rheumatoid arthritis|autoimmune','AUTOIMMUNE',['joints','stress'],None),
 (r'ibs|ibd|crohn\w*|colitis|gerd|reflux|ulcer\w*','GERD',['digestion'],'gentle'),
 (r'weight loss|lose weight|fat|slimm\w*',None,['metabolism'],None),
 (r'erectile dysfunction|ed|libido|testosterone',None,['vitality-men'],None),
 (r'under 18|my kid|my teenager|(?:my |for (?:my )?)?(?:[0-9]|1[0-7])[ -]year[ -]old',None,[],'stopped')]
BANNED = r'immune|immunity|cold|flu|virus|antiviral|infection|cur(?:e|es)|treat\w*|heal(?:s|ing)?|prevent\w*|disease|weight loss|fat burning|slimming|sexual power|libido booster|testosterone|thyroid support|hormone therapy|anxiety|depression|insomnia|arthritis|inflammation|detox toxins|92 minerals|regrowth|follicle\w*|adhd|dementia|pcos|menopause|will|guarantee\w*'

def normalize(text):
    return unicodedata.normalize('NFKC',text).replace('’',"'").casefold()

def matches(pattern, text):
    return bool(re.search(r'(?<!\w)(?:'+pattern+r')(?!\w)',normalize(text)))

def safe_copy(text):
    return not matches(BANNED,text) and not any(matches(pattern,text) for pattern, *_ in ROUTES)
