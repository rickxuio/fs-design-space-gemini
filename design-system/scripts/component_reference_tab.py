"""Canonical complete inner structure and unique initial active indicator."""
def validate_tab(el,name):
    classes=el['attrs'].get('class','').split()
    if 'ds-tab' not in classes:
        return True
    variant=name.split('::')[0]
    if variant not in ['capsule','standard','standard-center','product']:return False
    large=name.endswith('::large')
    source_bottom=el['attrs'].get('data-tab-source-pc-default')
    source_large=el['attrs'].get('data-tab-source-pc-large')
    if variant=='standard' and not large and source_bottom!='official':return False
    if variant=='standard' and large and source_large!='official':return False
    if source_large and (variant!='standard' or not large or source_large!='official'):return False
    if variant=='standard-center':
        marker='data-tab-source-pc-center-large' if large else 'data-tab-source-pc-center-default'
        other='data-tab-source-pc-center-default' if large else 'data-tab-source-pc-center-large'
        if el['attrs'].get(marker)!='official' or other in el['attrs'] or source_bottom or source_large:return False
    elif any(k in el['attrs'] for k in ['data-tab-source-pc-center-default','data-tab-source-pc-center-large']):return False
    if source_bottom and (variant!='standard' or large or source_bottom!='official'):return False
    expected=(['ds-tab','ds-tab--standard','ds-tab--center'] if variant=='standard-center' else ['ds-tab','ds-tab--'+variant])+(['ds-tab--standard-lg'] if large else [])
    if el['tag']!='div' or sorted(classes)!=sorted(expected) or 'data-tab-group' not in el['attrs'] or 'data-tab-ready' in el['attrs'] or 'role' in el['attrs'] or len(el['children'])<2:return False
    def nodes(n):
        yield n
        for child in n['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or 'role' in n['attrs'] or 'aria-selected' in n['attrs'] or 'tabindex' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    for index,item in enumerate(el['children']):
        active=index==0
        if item['tag']!='div' or item['attrs'].get('class')!='ds-tab__item'+(' ds-tab__item--active' if active else '') or 'data-tab-item' not in item['attrs'] or len(item['children'])!=(2 if variant=='product' else 1):return False
        inner=item['children'][-1]
        if variant=='product':
            wrapper=item['children'][0]
            if wrapper['tag']!='div' or wrapper['attrs'].get('class')!='ds-tab__item-icon' or len(wrapper['children'])!=1:return False
            img=wrapper['children'][0]
            if img['tag']!='img' or img['attrs'].get('src')!='../icons/icon-placeholder-switch.svg' or img['attrs'].get('alt')!='' or img['children']:return False
        if inner['tag']!='div' or inner['attrs'].get('class')!='ds-tab__item-inner' or len(inner['children'])!=(2 if active else 1):return False
        label=inner['children'][0]
        if label['tag']!='span' or label['attrs'].get('class')!='ds-tab__item-text' or label['children'] or not label.get('text','').strip():return False
        if active:
            indicator=inner['children'][1]
            if indicator['tag']!='div' or indicator['attrs'].get('class')!='ds-tab__indicator' or indicator['children']:return False
    return True
