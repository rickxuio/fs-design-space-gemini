"""Finite gray/white native forms; business policy and responsive acceptance excluded."""
import re
from component_reference_input import validate_input, validate_static_prefix
from component_reference_links import safe_anchor_target
def validate_form(el,name,query_all,document):
    if 'ds-form' not in el['attrs'].get('class','').split(): return True
    if name not in ['gray','white'] or el['tag']!='form' or el['attrs'].get('class')!='ds-form' or 'data-form-current' not in el['attrs'] or 'data-form-ready' in el['attrs']: return False
    if el['attrs']['data-form-current']!=('white' if name=='white' else ''):return False
    def nodes(n):
        yield n
        for child in n['children']: yield from nodes(child)
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) or n['tag']=='svg' for n in nodes(el)):return False
    if any(k in el['attrs'] for k in ['action','method','novalidate']):return False
    expected=['ds-form__title','ds-form__desc','ds-form__row','ds-form__row','ds-form__row','ds-form__field','ds-form__field','ds-form__consent','']
    if [n['attrs'].get('class','') for n in el['children']]!=expected:return False
    columns=[]
    for row in el['children'][2:5]:
        if row['tag']!='div' or len(row['children'])!=2 or any(n['tag']!='div' or n['attrs'].get('class')!='ds-form__field' for n in row['children']):return False
        columns.extend(row['children'])
    def label(n):
        return n['tag']=='label' and n['attrs'].get('class')=='ds-form__label' and not n['children'] and bool(n.get('text','').strip())
    for i,column in enumerate(columns):
        children=column['children']
        if i==4 or (name=='gray' and i==5):
            if len(children)!=1 or children[0]['attrs'].get('data-input-layout')!='fill' or children[0]['attrs'].get('data-input-arrow')!='down' or not validate_input(children[0],name,query_all,document):return False
            continue
        if i in [0,1,2] or (name=='white' and i==5):
            if len(children)!=1 or children[0]['attrs'].get('data-input-layout')!='fill' or 'data-input-arrow' in children[0]['attrs'] or not validate_input(children[0],name,query_all,document):return False
            continue
        if i==3:
            if len(children)!=2 or children[0]['tag']!='label' or children[0]['attrs'].get('class')!='ds-input-field__label':return False
            row=children[1]
            if row['tag']!='div' or row['attrs'].get('class')!='ds-form__phone-row' or len(row['children'])!=2:return False
            atom=row['children'][1]
            if atom['attrs'].get('data-input-label')!='external' or not validate_input(atom,name,query_all,document):return False
            continue
        return False
    title,desc=el['children'][:2]
    if any(n['tag']!='p' or n['children'] or not n.get('text','').strip() for n in [title,desc]):return False
    fields=query_all(el,'input.ds-form__input')+query_all(el,'input.ds-input-field__input')+query_all(el,'textarea.ds-input-field__input')
    if len(fields)!=7:return False
    for field in fields:
        a=field['attrs'];identity=a.get('id','')
        if not re.fullmatch(r'[A-Za-z][\w-]*',identity) or len(query_all(document,'[id="'+identity+'"]'))!=1 or len(query_all(el,'label[for="'+identity+'"]'))!=1 or not a.get('name'):return False
        if field['tag']=='input' and 'ds-input-field__input' not in a.get('class','').split() and (a.get('type')!='text' or a.get('class') not in ['ds-form__input ds-form__input--'+name,'ds-form__input ds-form__input--'+name+' ds-form__phone-input']):return False
        if field['tag']=='textarea' and (a.get('maxlength')!='5000' or a.get('class')!='ds-input-field__input ds-input-field__input--'+name):return False
    prefixes=query_all(el,'div.ds-input-prefix')
    if len(prefixes)!=1 or not validate_static_prefix(prefixes[0],name):return False
    if query_all(el,'div.ds-form__phone-prefix'):return False
    textarea=fields[-1];counters=query_all(el,'span.ds-input-field__count')
    if len(counters)!=1 or counters[0].get('text','')!='0/5000' or not counters[0]['attrs'].get('id') or textarea['attrs'].get('aria-describedby')!=counters[0]['attrs']['id']:return False
    area=el['children'][5]
    if len(area['children'])!=1:return False
    atom=area['children'][0]
    if atom['tag']!='div' or atom['attrs']!={'class':'ds-input-field','data-input-current':'','data-input-layout':'fill','data-input-kind':'textarea'} or len(atom['children'])!=2 or atom['children'][1] is not textarea:return False
    header=atom['children'][0]
    if header['tag']!='div' or header['attrs']!={'class':'ds-input-field__header'} or len(header['children'])!=2:return False
    caption=header['children'][0]
    if caption['tag']!='label' or caption['attrs'].get('class')!='ds-input-field__label' or caption['children'] or not caption.get('text','').strip() or header['children'][1] is not counters[0]:return False
    if counters[0]['attrs'].get('class')!='ds-input-field__count' or counters[0]['children']:return False
    if set(textarea['attrs'])!={'class','placeholder','id','name','maxlength','aria-describedby'}:return False
    dropdowns=query_all(el,'div.ds-dropdown');bridges=query_all(el,'input.ds-form__dropdown-value')
    if dropdowns or bridges:return False
    inputs=query_all(el,'input')
    names=[n['attrs'].get('name','') for n in inputs]+[textarea['attrs'].get('name','')]
    if any(not n for n in names):return False
    # Two contact checkboxes intentionally share a name; all other names unique.
    contact=query_all(el,'label.ds-checkbox[data-checkbox-control]');consent=query_all(el,'label.ds-form__consent')
    if len(contact)!=2 or len(consent)!=1:return False
    for label in contact:
        if not label['children'] or label['children'][0]['tag']!='input' or label['children'][0]['attrs'].get('type')!='checkbox':return False
    for n in contact:
        if n['attrs']!={'class':'ds-checkbox ds-checkbox--sm','data-checkbox-current':'','data-checkbox-control':''} or len(n['children'])!=3:return False
        control,box,caption=n['children']
        if control['attrs'].get('class')!='ds-checkbox__input' or control['attrs'].get('value') not in ['email','phone']:return False
        if box['tag']!='span' or box['attrs']!={'class':'ds-checkbox__box','aria-hidden':'true'} or box['children']:return False
        if caption['tag']!='span' or caption['attrs']!={'class':'ds-checkbox__label'} or caption['children'] or not caption.get('text','').strip():return False
        if ('checked' in control['attrs'])!=(control['attrs']['value']=='email'):return False
    contact_field=el['children'][6]
    if len(contact_field['children'])!=2:return False
    prompt,group=contact_field['children']
    if prompt['tag']!='span' or prompt['attrs'].get('class')!='ds-form__label' or prompt['children'] or not prompt.get('text','').strip() or group['tag']!='div' or group['attrs'].get('class')!='ds-form__radio-group' or group['children']!=contact:return False
    if len(consent[0]['children'])!=2:return False
    atom,prose=consent[0]['children']
    if atom['tag']!='span' or atom['attrs']!={'class':'ds-checkbox ds-checkbox--sm','data-checkbox-current':'','data-checkbox-control':''} or len(atom['children'])!=2:return False
    control,box=atom['children']
    if control['tag']!='input' or control['attrs']!={'class':'ds-checkbox__input','type':'checkbox','name':'consent','value':'agreed'}:return False
    if box['tag']!='span' or box['attrs']!={'class':'ds-checkbox__box','aria-hidden':'true'} or box['children']:return False
    if prose['tag']!='span' or prose['attrs'].get('class')!='ds-form__consent-copy' or len(prose['children'])!=2 or not prose.get('text','').strip():return False
    for link in prose['children']:
        if link['tag']!='a' or link['children'] or not link.get('text','').strip():return False
        if not safe_anchor_target(link['attrs'],protocols=('http','https'),require_disabled_role=True):return False
    if len(query_all(el,'a'))!=2:return False
    if contact[0]['children'][0]['attrs'].get('name')!=contact[1]['children'][0]['attrs'].get('name') or len(set(names))!=len(names)-1:return False
    buttons=query_all(el,'button.ds-btn')
    if len(buttons)!=1:return False
    b=buttons[0]
    if el['children'][-1]['tag']!='div' or el['children'][-1]['children']!=[b]:return False
    if b['attrs'].get('class')!='ds-btn ds-btn--filled-red ds-btn--xl-regular' or b['attrs'].get('type')!='submit' or len(b['children'])!=1:return False
    text=b['children'][0]
    return text['tag']=='span' and text['attrs'].get('class')=='ds-btn__text' and not text['children'] and bool(text.get('text','').strip())
