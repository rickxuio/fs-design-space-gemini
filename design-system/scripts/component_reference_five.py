"""Finite source-owned Mini, account edit and sidebar host identities."""
def walk(n):
    yield n
    for c in n['children']:yield from walk(c)
def clean(el):return not any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in walk(el))
def cls(n,c):return n['attrs'].get('class')==c
def mini(el):
    if el['tag']!='div' or not cls(el,'ds-banner ds-banner--mini') or el['attrs'].get('data-banner-mini-runtime')!='source-three' or not clean(el) or len(el['children'])!=2:return False
    slides,pagination=el['children']
    if not cls(slides,'ds-banner__mini-slides') or len(slides['children'])!=3 or not cls(pagination,'ds-banner__mini-pagination') or len(pagination['children'])!=1:return False
    dots=pagination['children'][0]
    if 'data-carousel-mini-pagination' not in dots['attrs'] or not cls(dots,'ds-carousel__dots') or len(dots['children'])!=3:return False
    ids=set()
    for i,(slide,dot) in enumerate(zip(slides['children'],dots['children'])):
        a=slide['attrs'];da=dot['attrs'];ident=a.get('id')
        if not cls(slide,'ds-banner__mini-slide') or not ident or ident in ids or a.get('aria-hidden')!=str(i!=0).lower() or ('hidden' in a)!=(i!=0) or ('inert' in a)!=(i!=0) or len(slide['children'])!=2:return False
        ids.add(ident)
        image,copy=slide['children']
        if image['tag']!='img' or not cls(image,'ds-banner__mini-image') or not image['attrs'].get('src') or not cls(copy,'ds-banner__mini-content') or len(copy['children'])!=3:return False
        for n,c in zip(copy['children'][:2],['ds-banner__title','ds-banner__desc']):
            if n['tag']!='p' or not cls(n,c) or n['children'] or not n.get('text','').strip():return False
        link=copy['children'][2]
        from component_reference_links import safe_anchor_target
        if link['tag']!='a' or not cls(link,'ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m') or not safe_anchor_target(link['attrs']) or len(link['children'])!=2:return False
        if dot['tag']!='button' or da.get('type')!='button' or da.get('aria-controls')!=ident or da.get('aria-current')!=('true' if i==0 else None) or not cls(dot,'ds-carousel__dot'+(' ds-carousel__dot--active' if i==0 else '')):return False
    return True

def edit(el,query_all,page):
    if el['tag']!='div' or not cls(el,'ds-collapse ds-collapse--inline-edit') or el['attrs'].get('data-collapse-edit-current')!='account' or not clean(el) or not 1<=len(el['children'])<=12:return False
    fields=set()
    for row in el['children']:
        field=row['attrs'].get('data-collapse-field')
        if not field or field in fields or not cls(row,'ds-collapse__item') or len(row['children'])!=1:return False
        fields.add(field);head=row['children'][0]
        if not cls(head,'ds-collapse__header') or len(head['children'])!=4:return False
        label,value,form,button=head['children'];a=form['attrs'];b=button['attrs']
        if not cls(label,'ds-collapse__label') or not cls(value,'ds-collapse__value') or label['children'] or value['children'] or not label.get('text','').strip():return False
        if form['tag']!='form' or not cls(form,'ds-collapse__edit-panel') or 'hidden' not in a or a.get('aria-hidden')!='true' or not a.get('id') or len(query_all(page,'[id="'+a['id']+'"]'))!=1 or b.get('aria-controls')!=a['id'] or b.get('aria-expanded')!='false' or b.get('data-collapse-edit-atom')!='current' or button['tag']!='button' or b.get('type')!='button':return False
        inputs=[n for n in walk(form) if n['tag']=='input'];actions=[n for n in walk(form) if n['tag']=='button'];labels=[n for n in walk(form) if n['tag']=='label']
        if len(inputs)!=1 or len(labels)!=1 or len(actions)!=2:return False
        ia=inputs[0]['attrs']
        if ia.get('class')!='ds-input-field__input ds-input-field__input--gray' or ia.get('type') not in ['text','tel','email'] or ia.get('name')!=field or ia.get('value')!=value.get('text','').strip() or labels[0]['attrs'].get('for')!=ia.get('id') or len(query_all(page,'[id="'+ia.get('id','')+'"]'))!=1:return False
        cancel,save=actions
        if not cls(cancel,'ds-btn ds-btn--outline-gray ds-btn--xl') or cancel['attrs'].get('type')!='button' or 'data-collapse-cancel' not in cancel['attrs'] or not cls(save,'ds-btn ds-btn--filled-black ds-btn--xl') or save['attrs'].get('type')!='submit' or 'data-collapse-save' not in save['attrs'] or 'disabled' in save['attrs']:return False
    return True

def sidebar(el,name):
    if el['tag']!='div' or not cls(el,'ds-card--horizontal-sidebar') or not clean(el) or len(el['children'])!=1:return False
    bordered=name.endswith('.bordered-background')
    if el['attrs'].get('data-card-sidebar-current')!=('bordered' if bordered else 'plain'):return False
    layout=el['children'][0]
    if not cls(layout,'ds-card__sidebar-layout') or len(layout['children'])!=2:return False
    side,content=layout['children']
    if side['tag']!='aside' or not cls(side,'ds-card__sidebar-shell') or len(side['children'])!=1 or not cls(content,'ds-card__content-area') or len(content['children'])!=1:return False
    menu=side['children'][0]
    if menu['attrs'].get('data-menu-card-sidebar')!='current' or not cls(menu,'ds-menu-navigation ds-menu-navigation--single-level ds-menu-navigation--width-288'):return False
    from component_reference_menu import validate_menu
    translated=dict(menu);translated['attrs']=dict(menu['attrs'],**{'class':'ds-menu-navigation ds-menu-navigation--single-level ds-menu-navigation--width-250'})
    if not validate_menu(translated,'single-level',lambda *_:[],el):return False
    from component_reference_card import validate_card
    card=dict(content['children'][0]);card['attrs']=dict(card['attrs'],**{'data-card-current':'horizontal-unbordered'})
    return validate_card(card,'spliced.horizontal.full-width'+('.bordered-background' if bordered else ''))
