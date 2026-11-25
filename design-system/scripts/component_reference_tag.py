"""Finite Tag examples: static spans stay distinct from marker-only button toggles."""
def validate_tag(el, name):
    cls=el['attrs'].get('class','').split()
    if not ('ds-tag' in cls or 'ds-tag-meta' in cls):return True
    def nodes(n):
        yield n
        for c in n['children']:yield from nodes(c)
    if any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    def text(n):return n['tag']=='span' and not n['children'] and bool(n.get('text','').strip())
    children=el['children']
    if name in ['product-regular-small','product-custom-small','product-color-small']:
        import re
        expected=['ds-tag','ds-tag--product-small']
        if name=='product-custom-small':expected+=['ds-tag--product-custom']
        if name=='product-color-small':expected+=['ds-tag--product-color']
        attrs=el['attrs']
        if el['tag']!='button' or sorted(cls)!=sorted(expected) or attrs.get('type')!='button' or attrs.get('aria-pressed')!='false' or attrs.get('data-tag-product')!='current':return False
        if any(k in attrs for k in ['disabled','data-tag-current','data-tag-state','data-tag-static','data-tag-action','data-select-remove','href']):return False
        if len(children)!=1:return False
        child=children[0]
        if name=='product-color-small':
            return bool(re.fullmatch(r'#[0-9a-fA-F]{6}',attrs.get('data-tag-color',''))) and bool(attrs.get('aria-label','').strip()) and child['tag']=='span' and child['attrs']=={'class':'ds-tag__product-chip','aria-hidden':'true'} and not child['children'] and not child.get('text','').strip()
        if attrs.get('data-tag-image')!='false' or 'data-tag-color' in attrs:return False
        return text(child) and child['attrs']=={'class':'ds-tag__product-label'} and (name!='product-custom-small' or child.get('text','').strip()=='Customized')
    if name in ['selectable','filter']:
        expected=['ds-tag','ds-tag--selectable']+(['ds-tag--filter'] if name=='filter' else [])
        if el['tag']!='button' or sorted(cls)!=sorted(expected) or 'data-tag-current' not in el['attrs'] or el['attrs'].get('type')!='button' or el['attrs'].get('aria-pressed')!='false':return False
        if any(k in el['attrs'] for k in ['disabled','data-select-remove']):return False
        if len(children)!=(2 if name=='filter' else 1) or children[0]['tag']!='span' or children[0]['attrs'].get('class')!='ds-tag__label':return False
        if name=='selectable':return text(children[0])
        if el['attrs'].get('data-tag-close')!='event' or el['attrs'].get('aria-keyshortcuts')!='Delete Backspace' or el['attrs'].get('aria-description')!='按 Delete 或 Backspace 删除此标签':return False
        labels=children[0]['children'];close=children[1]
        return len(labels)==2 and text(labels[0]) and labels[0]['attrs'].get('class')=='ds-tag__prefix' and text(labels[1]) and labels[1]['attrs'].get('class')=='ds-tag__value' and close['tag']=='img' and close['attrs'].get('class')=='ds-tag__close' and close['attrs'].get('src')=='../icons/icon-close.svg' and close['attrs'].get('alt')=='' and not close['children']
    if el['tag']!='span' or any(k in n['attrs'] for n in nodes(el) for k in ['type','role','tabindex','aria-pressed','data-tag-current','data-select-remove','href']):return False
    if name=='status-text':return sorted(cls)==sorted(['ds-tag','ds-tag--status-text','ds-tag--success']) and not children and bool(el.get('text','').strip())
    if name=='metadata-single':
        return sorted(cls)==sorted(['ds-tag-meta','ds-tag-meta--single']) and el['attrs'].get('data-tag-source-metadata')=='single' and len(children)==1 and text(children[0]) and children[0]['attrs']=={'data-tag-value':'first'}
    if name=='metadata':
        if cls!=['ds-tag-meta'] or len(children)!=3 or el['attrs'].get('data-tag-source-metadata')!='dual':return False
        left,divider,right=children
        return text(left) and left['attrs']=={'data-tag-value':'first'} and text(right) and right['attrs']=={'data-tag-value':'second'} and divider['tag']=='span' and divider['attrs']=={'class':'ds-tag-meta__divider','aria-hidden':'true'} and not divider['children'] and not divider.get('text','').strip()
    if name=='semantic-new':
        return sorted(cls)==sorted(['ds-tag','ds-tag--semantic','ds-tag--new','ds-tag--emphasis']) and el['attrs'].get('data-tag-source-new')=='official' and len(children)==1 and text(children[0]) and children[0]['attrs'].get('class')=='ds-tag__label' and children[0].get('text','').strip()=='New'
    if name=='semantic-hot':
        return sorted(cls)==sorted(['ds-tag','ds-tag--semantic','ds-tag--hot','ds-tag--emphasis']) and el['attrs'].get('data-tag-source-hot')=='official' and len(children)==1 and text(children[0]) and children[0]['attrs'].get('class')=='ds-tag__label' and children[0].get('text','').strip()=='Hot'
    if name=='semantic':
        if sorted(cls)!=sorted(['ds-tag','ds-tag--semantic','ds-tag--neutral']) or len(children)!=2 or el['attrs'].get('data-tag-source-individual-info')!='official':return False
        label,icon=children
        return text(label) and label['attrs'].get('class')=='ds-tag__label' and label.get('text','').strip()=='Individual' and icon['tag']=='span' and sorted(icon['attrs'].get('class','').split())==sorted(['ds-tag__icon','ds-tag__icon--info']) and icon['attrs'].get('aria-hidden')=='true' and not icon['children'] and not icon.get('text','').strip()
    if name=='featured':
        if sorted(cls)!=sorted(['ds-tag','ds-tag--featured']) or len(children)!=2 or el['attrs'].get('data-tag-source-featured')!='official':return False
        icon,label=children
        return icon['tag']=='img' and icon['attrs'].get('class')=='ds-tag__icon' and icon['attrs'].get('src')=='../icons/icon-featured-star.svg' and icon['attrs'].get('alt')=='' and not icon['children'] and text(label) and label['attrs'].get('class')=='ds-tag__label' and label.get('text','').strip()=='FEATURED'
    return False
