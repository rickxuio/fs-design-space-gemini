"""Finite gray single-event and native jump IconCards; no disclosure adaptation."""
from component_reference_links import safe_anchor_target
def validate_icon_card(el,name):
    if name in ['left.jump-type','center.multi-event-expandable','left.multi-event-expandable']:
        from component_reference_completion import validate_icon_card_completion
        return validate_icon_card_completion(el,name)
    classes=el['attrs'].get('class','').split()
    if 'ds-icon-card' not in classes:
        return True
    layout=name.split('.')[0]
    if name not in ['center.single-event','left.single-event','left.jump-type'] or el['tag']!='div' or sorted(classes)!=sorted(['ds-icon-card','ds-icon-card--'+layout,'ds-icon-card--bg-gray']) or len(el['children'])!=2 or 'data-expandable' in el['attrs']:
        return False
    def nodes(n):
        yield n
        for child in n['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):
        return False
    def exact(n,tag,cls):return n['tag']==tag and n['attrs'].get('class')==cls
    def img(n,cls,file):return exact(n,'img',cls) and n['attrs'].get('src')=='../icons/'+file and n['attrs'].get('alt')=='' and not n['children']
    def text(n,tag,cls):return exact(n,tag,cls) and not n['children'] and bool(n.get('text','').strip())
    icon,body=el['children']
    def valid_title(title):
        if not exact(title,'div','ds-icon-card__title-slot') or len(title['children'])!=1:return False
        a=title['children'][0]
        return a['tag']=='a' and sorted(a['attrs'].get('class','').split())==sorted(['ds-text-btn','ds-text-btn--inline','ds-text-btn--black-bold','ds-text-btn--l']) and len(a['children'])==1 and text(a['children'][0],'span','ds-text-btn__text') and a['attrs'].get('aria-disabled')=='true' and not a['attrs'].get('href')
    markers={'center.single-event':'center-atom','left.single-event':'left-atom','left.jump-type':'jump'}
    if el['attrs'].get('data-icon-card-current')!=markers[name]:return False
    if name=='left.jump-type':
        if el['attrs'].get('data-icon-card-current')!='jump' or not img(icon,'ds-icon-card__icon','icon-placeholder-switch.svg') or not exact(body,'div','ds-icon-card__body') or len(body['children'])!=2:return False
        title,links=body['children']
        if not valid_title(title) or not exact(links,'div','ds-icon-card__blue-links') or not links['children']:return False
        for anchor in links['children']:
            if not text(anchor,'a','ds-icon-card__blue-link') or not safe_link(anchor):return False
            if not anchor['attrs'].get('href','').strip() and anchor['attrs'].get('role')!='link':return False
        return True
    if not img(icon,'ds-icon-card__icon','icon-placeholder-switch.svg') or not exact(body,'div','ds-icon-card__body') or len(body['children'])!=4:
        return False
    title,description,bullets,link=body['children']
    if not valid_title(title):return False
    if not text(description,'p','ds-icon-card__desc') or not exact(bullets,'div','ds-icon-card__bullets') or not bullets['children'] or not exact(link,'div','ds-icon-card__link') or len(link['children'])!=1:
        return False
    for bullet in bullets['children']:
        if not exact(bullet,'div','ds-card__bullet-item') or len(bullet['children'])!=2 or not img(bullet['children'][0],'ds-card__bullet-icon','icon-bullet.svg') or not text(bullet['children'][1],'p','ds-card__bullet-text'):
            return False
    anchor=link['children'][0]
    if anchor['tag']!='a' or sorted(anchor['attrs'].get('class','').split())!=sorted(['ds-text-btn','ds-text-btn--inline','ds-text-btn--black','ds-text-btn--m']) or len(anchor['children'])!=2 or not text(anchor['children'][0],'span','ds-text-btn__text') or not img(anchor['children'][1],'ds-text-btn__icon','icon-text-button-arrow-right-regular.svg'):
        return False
    return safe_link(anchor)

def safe_link(anchor):
    return safe_anchor_target(anchor['attrs'])
