"""Finite locked Dialog anatomy and full default footer Button calls.
Body content remains the declared structured slot. No browser inference.
"""
import re
from component_reference_input import validate_input

def validate_dialog(el,name,query_all,document):
    if el['tag']!='dialog':return True
    if name in ['form','cart','message']:return validate_template(el,name,query_all,document)
    if name not in ['information','confirmation']:return False
    a=el['attrs']
    if set(a.get('class','').split())!={'ds-dialog','ds-dialog--'+name}:return False
    for key in ['id','aria-labelledby']:
        ident=a.get(key,'')
        if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*',ident) or len(query_all(document,'#'+ident))!=1:return False
    children=el['children']
    if len(children)!=(3 if name=='confirmation' else 2):return False
    header,body=children[:2]
    if header['tag']!='header' or header['attrs'].get('class')!='ds-dialog__header' or len(header['children'])!=2:return False
    if body['tag']!='div' or body['attrs'].get('class')!='ds-dialog__body':return False
    title,close=header['children']
    if title['tag']!='h2' or title['attrs'].get('class')!='ds-dialog__title' or title['attrs'].get('id')!=a['aria-labelledby'] or title['children'] or not title.get('text','').strip():return False
    ca=close['attrs']
    if close['tag']!='button' or set(ca.get('class','').split())!={'ds-dialog__close-position','ds-icon-btn','ds-icon-btn--plain','ds-icon-btn--l'} or ca.get('type')!='button' or 'data-dialog-close' not in ca or not ca.get('aria-label','').strip() or len(close['children'])!=1:return False
    icon=close['children'][0]
    if icon['tag']!='img' or icon['attrs'].get('class')!='ds-icon-btn__icon' or icon['attrs'].get('src')!='../icons/icon-close.svg' or icon['attrs'].get('alt')!='' or icon['children']:return False
    locked=[el,header,body,title,close,icon]
    text_slots=[body,title]
    if name=='confirmation':
        footer=children[2]
        if footer['tag']!='footer' or footer['attrs'].get('class')!='ds-dialog__footer' or len(footer['children'])!=2:return False
        locked.append(footer)
        for button,variant,action in zip(footer['children'],['filled-gray','filled-red'],['data-dialog-close','data-dialog-confirm']):
            ba=button['attrs']
            if button['tag']!='button' or set(ba.get('class','').split())!={'ds-btn','ds-btn--'+variant,'ds-btn--xl-regular'} or ba.get('type')!='button' or action not in ba or ('data-dialog-confirm' if action=='data-dialog-close' else 'data-dialog-close') in ba or not ba.get('aria-label','').strip() or len(button['children'])!=1:return False
            label=button['children'][0]
            if label['tag']!='span' or label['attrs'].get('class')!='ds-btn__text' or label['children'] or not label.get('text','').strip():return False
            locked.extend([button,label])
            text_slots.append(label)
    # State, styling and behavior belong to the locked scaffold, not editable text.
    for node in locked:
        if any(k.startswith('on') or k in ['style','hidden','inert','disabled','open'] for k in node['attrs']) or node['attrs'].get('aria-disabled')=='true':return False
        if node.get('text','').strip() and all(node is not slot for slot in text_slots):return False
    return True

def validate_template(el,name,query_all,document):
    a=el['attrs']
    if set(a.get('class','').split())!={'ds-dialog','ds-dialog--'+name} or not a.get('id') or not a.get('aria-labelledby') or len(query_all(document,'#'+a['id']))!=1:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    all_nodes=list(nodes(el))
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) or n['tag'] in ['script','iframe','svg'] for n in all_nodes):return False
    titles=[n for n in all_nodes if n['attrs'].get('id')==a['aria-labelledby']]
    if len(titles)!=1 or titles[0]['tag']!='h2' or not titles[0].get('text','').strip():return False
    close=[n for n in all_nodes if 'data-dialog-close' in n['attrs'] and 'ds-dialog__close-position' in n['attrs'].get('class','').split()]
    if len(close)!=1 or close[0]['attrs'].get('class')!='ds-dialog__close-position ds-icon-btn ds-icon-btn--plain ds-icon-btn--l' or close[0]['attrs'].get('type')!='button' or len(close[0]['children'])!=1 or close[0]['children'][0]['attrs'].get('src')!='../icons/icon-close.svg':return False
    if name=='message':
        return len(el['children'])==3 and bool(query_all(el,'.ds-dialog__message-icon img')) and bool(query_all(el,'.ds-dialog__message-description p')) and titles[0]['attrs'].get('class')=='ds-dialog__message-title'
    if len(el['children'])!=3:return False
    header,body,footer=el['children']
    if header['tag']!='header' or header['attrs'].get('class')!='ds-dialog__header' or body['attrs'].get('class')!='ds-dialog__body' or footer['tag']!='footer' or footer['attrs'].get('class')!='ds-dialog__footer' or len(footer['children'])!=2:return False
    for n,color,action in zip(footer['children'],['gray','red'],['data-dialog-close','data-dialog-submit' if name=='form' else 'data-dialog-cart-action']):
        if n['tag']!='button' or n['attrs'].get('type')!='button' or n['attrs'].get('class')!='ds-btn ds-btn--filled-'+color+' ds-btn--xl-regular' or action not in n['attrs'] or len(n['children'])!=1 or n['children'][0]['attrs'].get('class')!='ds-btn__text':return False
    if name=='form':
        if a.get('data-dialog-backdrop')!='false':return False
        forms=query_all(el,'form[data-form-part="dialog-content"]')
        if len(forms)!=1 or forms[0]['attrs'].get('data-form-current')!='dialog-content' or any(k in forms[0]['attrs'] for k in ['action','method','target']):return False
        inputs=query_all(forms[0],'input.ds-input-field__input');areas=query_all(forms[0],'textarea.ds-input-field__input');checks=query_all(forms[0],'label.ds-checkbox')
        if len(inputs)!=2 or len(areas)!=1 or len(checks)!=1:return False
        atoms=query_all(forms[0],'.ds-input-field')
        if len(atoms)!=3 or any(not validate_input(n,'white',query_all,document) for n in atoms[:2]):return False
        return checks[0]['attrs'].get('class')=='ds-checkbox' and len(checks[0]['children'])==3 and checks[0]['children'][0]['attrs'].get('type')=='checkbox' and areas[0]['attrs'].get('maxlength')=='5000' and 'required' in areas[0]['attrs']
    parts=query_all(el,'div[data-list-part="dialog-cart-products"]')
    if len(parts)!=1 or not query_all(header,'img.ds-dialog__header-icon'):return False
    rows=query_all(parts[0],'.ds-list__product-source-row')
    if not 1<=len(rows)<=6 or query_all(parts[0],'[data-list-product-delete]'):return False
    for row in rows:
        controls=query_all(row,'[data-input-number-current]')
        if len(row['children'])!=4 or len(controls)!=1 or controls[0]['attrs'].get('class')!='ds-input-number ds-input-number--outline ds-input-number--sm' or len(controls[0]['children'])!=3:return False
    return True
