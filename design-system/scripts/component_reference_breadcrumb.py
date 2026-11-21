"""Shared standalone/nested finite Breadcrumb structure, not browser evidence."""
from component_reference_links import safe_anchor_target
def validate_breadcrumb(el,name):
    if name in ['full-width-light','full-width-dark']:
        mode='dark' if name=='full-width-dark' else 'light'
        return el['tag']=='div' and el['attrs'].get('class')=='ds-breadcrumb-source-full-width' and el['attrs'].get('data-breadcrumb-source-container')==mode and 'style' not in el['attrs'] and len(el['children'])==1 and validate_breadcrumb(el['children'][0],'dark' if mode=='dark' else 'default')
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    expected=['ds-breadcrumb']+(['ds-breadcrumb--dark'] if name=='dark' else [])
    if el['tag']!='nav' or sorted(el['attrs'].get('class','').split())!=sorted(expected) or el['attrs'].get('aria-label')!='Breadcrumb' or len(el['children'])<2:return False
    if 'data-breadcrumb-current' not in el['attrs']:return False
    if any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    for i,item in enumerate(el['children']):
        if item['tag']!='div' or item['attrs'].get('class')!='ds-breadcrumb__item':return False
        if i==len(el['children'])-1:
            if len(item['children'])!=1:return False
            current=item['children'][0]
            if current['tag']!='span' or current['attrs'].get('class')!='ds-breadcrumb__current' or current['children'] or not current.get('text','').strip():return False
        else:
            if len(item['children'])!=2:return False
            link,separator=item['children']
            if link['tag']!='a' or link['attrs'].get('class')!='ds-breadcrumb__link' or link['children'] or not link.get('text','').strip():return False
            if not safe_anchor_target(link['attrs']):return False
            if separator['tag']!='span' or separator['attrs'].get('class')!='ds-breadcrumb__separator' or separator['children'] or separator.get('text','').strip()!='/':return False
            if separator['attrs'].get('aria-hidden')!='true':return False
    return True
