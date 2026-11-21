"""Two finite radio button shapes; group assembly is required separately."""
def validate_option_selector(el,name):
    if name in ['color','service']:
        def allnodes(n):
            yield n
            for c in n['children']:yield from allnodes(c)
        ns=list(allnodes(el))
        if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in ns):return False
        def cls(n,c):return c in n['attrs'].get('class','').split()
        if name=='service':
            if el['tag']!='label' or el['attrs'].get('data-option-service-current')!='mg-pc' or el['attrs'].get('data-tag-part')!='configuration-service' or len(el['children'])!=3:return False
            atom,image,content=el['children']
            if atom['tag']!='span' or not cls(atom,'ds-checkbox--sm') or 'data-checkbox-control' not in atom['attrs'] or len(atom['children'])!=2:return False
            inp,box=atom['children']
            if inp['tag']!='input' or inp['attrs'].get('type')!='checkbox' or not inp['attrs'].get('value') or 'checked' in inp['attrs'] or 'disabled' in inp['attrs'] or not cls(inp,'ds-checkbox__input') or not cls(box,'ds-checkbox__box'):return False
            return image['tag']=='img' and bool(image['attrs'].get('src')) and bool(image['attrs'].get('alt')) and len(content['children'])==2 and all(n['tag']=='span' and not n['children'] and n.get('text','').strip() for n in content['children'])
        if el['tag']!='div' or not cls(el,'ds-select') or el['attrs'].get('data-option-color-current')!='mg-pc' or el['attrs'].get('data-select-mode')!='single' or len(el['children'])!=2:return False
        trigger,panel=el['children'];ta=trigger['attrs'];pa=panel['attrs']
        if trigger['tag']!='button' or ta.get('type')!='button' or ta.get('role')!='combobox' or ta.get('aria-haspopup')!='listbox' or ta.get('aria-expanded')!='false' or ta.get('aria-controls')!=pa.get('id') or pa.get('role')!='listbox' or 'hidden' not in pa or pa.get('aria-labelledby')!=ta.get('id') or len(trigger['children'])!=1:return False
        part=trigger['children'][0]
        if part['attrs'].get('data-tag-part')!='configuration-color' or len(part['children'])!=3:return False
        options=[n for n in ns if n['attrs'].get('role')=='option']
        import re
        return 2<=len(options)<=24 and sum(n['attrs'].get('aria-selected')=='true' for n in options)==1 and len({n['attrs'].get('data-value') for n in options})==len(options) and all(n['attrs'].get('data-value') and re.fullmatch(r'#[0-9a-fA-F]{6}',n['attrs'].get('data-color','')) for n in options)
    classes=el['attrs'].get('class','').split()
    if 'ds-option-selector' not in classes:return True
    expected=['ds-option-selector','ds-option-selector--plain'] if name=='media' else ['ds-option-selector','ds-option-selector--sm','ds-option-selector--product'] if name=='product' else []
    if not expected or sorted(classes)!=sorted(expected) or el['tag']!='button' or el['attrs'].get('type')!='button' or el['attrs'].get('role')!='radio' or el['attrs'].get('aria-checked')!='false' or el['attrs'].get('tabindex')!='-1' or not el['attrs'].get('value','').strip() or 'disabled' in el['attrs'] or len(el['children'])!=(2 if name=='media' else 4):return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    if name=='product':
        image,label,price,disclosure=el['children']
        return image['tag']=='img' and image['attrs'].get('class')=='ds-option-selector__media' and image['attrs'].get('src')=='../../docs/assets/20250901105611h7ydr7.jpg.webp' and label['tag']=='span' and label['attrs'].get('class')=='ds-option-selector__label' and not label['children'] and bool(label.get('text','').strip()) and price['tag']=='span' and price['attrs'].get('class')=='ds-option-selector__price' and not price['children'] and bool(price.get('text','').strip()) and disclosure['tag']=='span' and disclosure['attrs'].get('class')=='ds-option-selector__disclosure' and disclosure['attrs'].get('aria-hidden')=='true' and not disclosure['children']
    img,content=el['children']
    if img['tag']!='img' or img['attrs'].get('class')!='ds-option-selector__media' or img['attrs'].get('src')!='../icons/goods-包裹.svg' or img['attrs'].get('alt')!='' or img['children']:return False
    labels=[content] if name=='media' else content['children']
    if name=='product' and (content['tag']!='span' or content['attrs'].get('class')!='ds-option-selector__content' or len(labels)!=2):return False
    for i,label in enumerate(labels):
        expected_class='ds-option-selector__label' if i==0 else 'ds-option-selector__description'
        if label['tag']!='span' or label['attrs'].get('class')!=expected_class or label['children'] or not label.get('text','').strip():return False
    return True
