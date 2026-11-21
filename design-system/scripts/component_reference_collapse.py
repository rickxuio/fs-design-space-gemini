"""Finite split/feature disclosure identity, authored single-open state."""
def validate_collapse(el,name,query_all,page):
    if name=='inline-edit':
        from component_reference_five import edit
        return edit(el,query_all,page)
    if name=='data-preview':
        if el['tag']!='div' or el['attrs'].get('class')!='ds-collapse ds-collapse--data-preview' or el['attrs'].get('data-collapse-data-current')!='mg-v3.1' or not 1<=len(el['children'])<=24:return False
        def walk(n):
            yield n
            for c in n['children']:yield from walk(c)
        if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in walk(el)):return False
        for row in el['children']:
            if row['tag']!='div' or row['attrs'].get('class')!='ds-collapse__item' or not row['attrs'].get('data-order-id') or len(row['children'])!=2:return False
            head,body=row['children'];ns=list(walk(head));toggles=[n for n in ns if n['attrs'].get('class')=='ds-collapse__order-toggle']
            if len(toggles)!=1:return False
            t=toggles[0];ta=t['attrs'];ba=body['attrs']
            if t['tag']!='button' or ta.get('type')!='button' or ta.get('aria-expanded')!='false' or ta.get('aria-controls')!=ba.get('id') or 'hidden' not in ba or ba.get('aria-hidden')!='true' or len(query_all(page,'[id="'+ba.get('id','')+'"]'))!=1:return False
            if len([n for n in ns if n['attrs'].get('data-badge-part')=='collapse-pending'])!=1:return False
            if sorted(n['attrs']['data-order-action'] for n in ns if 'data-order-action' in n['attrs'])!=['info','more','view']:return False
            if not query_all(body,'div.ds-collapse__preview-item'):return False
        return True
    if name=='faq':
        if el['tag']!='div' or el['attrs'].get('class')!='ds-collapse ds-collapse--faq' or 'data-collapse-current' not in el['attrs'] or len(el['children'])<2:return False
        for i,row in enumerate(el['children']):
            position='first' if i==0 else 'last' if i==len(el['children'])-1 else 'middle'
            if row['tag']!='div' or row['attrs'].get('class')!='ds-collapse ds-collapse--faq-source-row ds-collapse__item' or row['attrs'].get('data-faq-position')!=position or row['attrs'].get('data-faq-state')!='collapsed' or row['attrs'].get('data-faq-divider')!=('off' if position=='last' else 'on') or len(row['children'])!=2:return False
            h,b=row['children'];ha=h['attrs'];ba=b['attrs']
            if h['tag']!='button' or ha.get('class')!='ds-collapse__header ds-collapse__faq-source-header' or ha.get('type')!='button' or ha.get('aria-expanded')!='false' or ha.get('aria-controls')!=ba.get('id') or len(h['children'])!=2:return False
            t,icon=h['children']
            if t['tag']!='span' or t['attrs'].get('class')!='ds-collapse__faq-source-title' or t['children'] or not t.get('text','').strip():return False
            if icon['tag']!='img' or icon['attrs'].get('src')!='../icons/icon-collapse-faq-down-current.svg' or icon['attrs'].get('alt')!='':return False
            if b['tag']!='p' or ba.get('class')!='ds-collapse__body ds-collapse__faq-source-body' or 'hidden' not in ba or ba.get('aria-hidden')!='true' or b['children'] or not b.get('text','').strip() or not ba.get('id') or len(query_all(page,'[id="'+ba['id']+'"]'))!=1:return False
        return True
    classes=el['attrs'].get('class','').split()
    if 'ds-collapse' not in classes:
        return True
    if name not in ['split','feature'] or el['tag']!='div' or 'data-collapse-current' not in el['attrs'] or sorted(classes)!=sorted(['ds-collapse','ds-collapse--'+name]):
        return False
    def nodes(n):
        yield n
        for child in n['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):
        return False
    if el['attrs'].get('data-collapse-mode') not in [None,'single']:
        return False
    items=el['children']
    if len(items)!=(2 if name=='split' else 4):
        return False
    icons=['icon-grid-view.svg','icon-demo-report.svg','icon-list-view.svg','icon-eye.svg']
    for index,item in enumerate(items):
        opened=index==0
        if item['tag']!='div' or item['attrs'].get('class')!='ds-collapse__item'+(' ds-collapse__item--open' if opened else '') or len(item['children'])!=2:
            return False
        header,body=item['children'];ha=header['attrs'];ba=body['attrs']
        if header['tag']!='button' or ha.get('class')!='ds-collapse__header' or ha.get('type')!='button' or ha.get('aria-expanded')!=str(opened).lower() or 'disabled' in ha or body['tag']!='div' or ba.get('class')!='ds-collapse__body' or not ba.get('id') or ha.get('aria-controls')!=ba['id'] or len(query_all(page,'[id="'+ba['id']+'"]'))!=1 or ba.get('aria-hidden')!=str(not opened).lower() or ('hidden' in ba)==opened :
            return False
        if name=='split':
            if el['attrs'].get('data-collapse-source-cookies')!='official' or len(body['children'])!=1:return False
            content=body['children'][0]
            if content['tag']!='p' or content['attrs'].get('class')!='ds-collapse__copy-region' or content['children'] or not content.get('text','').strip():return False
        elif body['children'] or not body.get('text','').strip():return False
        hc=header['children']
        if len(hc) not in ([1,2] if name=='split' else [1]):
            return False
        title=hc[0]
        if title['tag']!='span' or title['attrs'].get('class')!='ds-collapse__title' or not title.get('text','').strip() or len(title['children'])!=1:
            return False
        img=title['children'][0];file=('icon-collapse-minus.svg' if opened else 'icon-collapse-plus.svg') if name=='split' else icons[index]
        if img['tag']!='img' or img['attrs'].get('src')!='../icons/'+file or img['attrs'].get('alt')!='' or img['children']:
            return False
        if len(hc)==2 and (hc[1]['tag']!='span' or hc[1]['attrs'].get('class')!='ds-collapse__always' or hc[1]['children'] or not hc[1].get('text','').strip()):
            return False
    return True
