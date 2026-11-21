"""Finite desktop List structures; action literals are real runtime routing keys."""
def validate_list(el,name):
    if name=='attribute-key-value':
        from component_reference_completion import validate_profile_list
        return validate_profile_list(el)
    if name=='unordered-links-12':
        from component_reference_completion import validate_list_links
        return validate_list_links(el)
    classes=el['attrs'].get('class','').split()
    if 'ds-list' not in classes:return True
    if name in ['operation-intensive','product-content']:
        kind='operations' if name=='operation-intensive' else 'products'
        if el['tag']!='div' or classes!=['ds-list','ds-list--'+kind] or el['attrs'].get('data-list-current')!=kind:return False
        def allnodes(n):
            yield n
            for child in n['children']:yield from allnodes(child)
        nodes=list(allnodes(el))
        if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes):return False
        if name=='operation-intensive':
            if len(el['children'])<2 or el['children'][0]['attrs'].get('class')!='ds-list__operations-toolbar':return False
            actions=[n['attrs'].get('data-list-action') for n in nodes if 'data-list-action' in n['attrs']]
            if actions!=['delete','read','read-all','delete-all']:return False
            return all(n['tag']=='div' and set(n['attrs'].get('class','').split()) <= {'ds-list__operation-row','is-read','is-unread','is-source-state-bg'} and 'ds-list__operation-row' in n['attrs'].get('class','').split() for n in el['children'][1:])
        if not 2<=len(el['children'])<=7 or el['children'][0]['attrs'].get('class')!='ds-list__product-source-grid ds-list__product-source-head':return False
        for row in el['children'][1:]:
            descendants=list(allnodes(row))
            if row['attrs'].get('class')!='ds-list__product-source-grid ds-list__product-source-row' or len(row['children'])!=4:return False
            if sum(n['attrs'].get('class')=='ds-input-number ds-input-number--outline ds-input-number--sm' for n in descendants)!=1:return False
            if sum('data-list-product-delete' in n['attrs'] for n in descendants)!=1:return False
        return True
    if name in ['unordered-12','unordered-14']:
        if el['tag']!='div' or classes!=['ds-list','ds-list--'+name] or el['attrs'].get('data-list-current')!='unordered' or el['attrs'].get('data-list-source')!='legacy-fixed' or not el['children']:return False
        if set(el['attrs'])-{'class','data-list-current','data-list-source','data-ai-example'}:return False
        for item in el['children']:
            if item['tag']!='div' or item['attrs']!={'class':'ds-list__unordered-item'} or item.get('text','').strip() or len(item['children'])!=2:return False
            dot,text=item['children']
            if dot['tag']!='span' or dot['attrs']!={'class':'ds-list__unordered-dot','aria-hidden':'true'} or dot['children'] or dot.get('text','').strip():return False
            if text['tag']!='p' or text['attrs']!={'class':'ds-list__unordered-text'} or text['children'] or not text.get('text','').strip():return False
        return True
    variant={'structured-data':'structured','content-stream':'stream'}.get(name)
    if not variant or el['tag']!='div' or sorted(classes)!=sorted(['ds-list','ds-list--'+variant]):return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if variant=='structured' and el['attrs'].get('data-list-current')!='structured':return False
    if any('style' in n['attrs'] or 'id' in n['attrs'] or 'role' in n['attrs'] or 'tabindex' in n['attrs'] or 'contenteditable' in n['attrs'] or any((k.startswith('data-list-') and not (n is el and k=='data-list-current' and variant=='structured')) or k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    def simple(n,tag,cls=None):
        return n['tag']==tag and not n['children'] and (n['attrs'].get('class')==cls if cls else not n['attrs'].get('class')) and bool(n.get('text','').strip())
    if variant=='structured':
        if len(el['children'])<2:return False
        head=el['children'][0]
        if head['tag']!='div' or head['attrs'].get('class')!='ds-list__head ds-list__structured-grid' or len(head['children'])!=4 or not all(simple(n,'span') for n in head['children']):return False
        for row in el['children'][1:]:
            if row['tag']!='div' or row['attrs'].get('class')!='ds-list__row ds-list__structured-grid' or len(row['children'])!=4:return False
            title,status,date,actions=row['children']
            if not simple(title,'span') or not simple(date,'span') or status['tag']!='span' or status['attrs'].get('class')!='ds-list__status' or len(status['children'])!=1 or not status.get('text','').strip():return False
            dot=status['children'][0]
            if dot['tag']!='span' or dot['children'] or dot.get('text','').strip() or dot['attrs'].get('class') not in ['ds-list__status-dot ds-list__status-dot--pending','ds-list__status-dot ds-list__status-dot--text']:return False
            if actions['tag']!='span' or actions['attrs'].get('class')!='ds-list__action':return False
            if actions['children']:
                labels=[n.get('text','').strip() for n in actions['children']]
                if labels!=['Edit','Delete'] or not all(simple(n,'span') for n in actions['children']) or actions.get('text','').strip():return False
            elif actions.get('text','').strip()!='Delete':return False
        return True
    count=0;previous_divider=True
    for child in el['children']:
        if child['attrs'].get('class')=='ds-list__stream-source-divider':
            if previous_divider or child['tag']!='div' or child['children'] or child.get('text','').strip():return False
            previous_divider=True;continue
        previous_divider=False;count+=1
        if child['tag']!='article' or child['attrs'].get('class')!='ds-list__stream-source-item' or len(child['children'])!=3:return False
        title,summary,meta=child['children']
        if not simple(title,'h3','ds-list__stream-source-title') or not simple(summary,'p',summary['attrs'].get('class')) or summary['attrs'].get('class') not in ['ds-list__stream-source-summary','ds-list__stream-source-summary is-clamped']:return False
        if meta['tag']!='div' or meta['attrs'].get('class')!='ds-list__stream-source-meta' or len(meta['children'])!=2:return False
        tags,date=meta['children']
        if not simple(date,'time') or tags['tag']!='div' or tags['attrs'].get('class')!='ds-list__stream-source-tags' or not tags['children'] or len(tags['children'])%2==0:return False
        for i,tag in enumerate(tags['children']):
            if i%2:
                if tag['tag']!='span' or tag['attrs'].get('class')!='ds-list__stream-source-separator' or tag['attrs'].get('data-source-asset')!='svg_e7f98577.svg' or tag['children'] or tag.get('text','').strip():return False
            elif not simple(tag,'span'):return False
    return count>0 and not previous_divider
