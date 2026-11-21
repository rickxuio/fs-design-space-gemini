"""Existing full-copy Hero with opt-in component-owned layout correction."""
from component_reference_breadcrumb import validate_breadcrumb
def validate_banner(el,name):
    if name=='mini':
        from component_reference_five import mini
        return mini(el)
    if name=='search':
        from component_reference_completion import validate_search_banner
        return validate_search_banner(el)
    if 'ds-banner' not in el['attrs'].get('class','').split():return True
    if name=='hero':
        if el['tag']!='div' or el['attrs']!={'class':'ds-banner ds-banner--hero','data-banner-native-hero':'','data-ai-example':'ai-banner-hero-static'}:return False
        if len(el['children'])!=3:return False
        title,desc,actions=el['children']
        for n,cls in [(title,'ds-banner__title'),(desc,'ds-banner__desc')]:
            if n['tag']!='p' or n['attrs']!={'class':cls} or n['children'] or not n.get('text','').strip():return False
        if actions['tag']!='div' or actions['attrs']!={'class':'ds-banner__actions'} or len(actions['children'])!=1:return False
        button=actions['children'][0]
        if button['tag']!='button' or button['attrs']!={'type':'button','class':'ds-btn ds-btn--outline-white ds-btn--xl'} or len(button['children'])!=1:return False
        label=button['children'][0]
        return label['tag']=='span' and label['attrs']=={'class':'ds-btn__text'} and not label['children'] and bool(label.get('text','').strip())
    if name in ['hero','sub','title-only']:
        if el['tag']!='div' or el['attrs'].get('class')!='ds-banner ds-banner--'+name or set(el['attrs'])!={'class','data-banner-static','data-ai-example'}:return False
        children=el['children']
        if len(children)!=({'hero':4,'sub':3,'title-only':1}[name]):return False
        if name in ['hero','sub'] and not validate_breadcrumb(children[0],'dark'):return False
        copy=children[1:3] if name in ['hero','sub'] else children
        for n,cls in zip(copy,['ds-banner__title','ds-banner__desc']):
            if n['tag']!='p' or n['attrs']!={'class':cls} or n['children'] or not n.get('text','').strip():return False
        if name=='hero':
            actions=children[-1]
            if actions['tag']!='div' or actions['attrs']!={'class':'ds-banner__actions'} or len(actions['children'])!=2:return False
            for button,variant in zip(actions['children'],['filled-gray','outline-white']):
                size='xl-bold' if variant=='filled-gray' else 'xl'
                if button['tag']!='button' or button['attrs']!={'type':'button','class':'ds-btn ds-btn--'+variant+' ds-btn--'+size} or len(button['children'])!=1:return False
                label=button['children'][0]
                if label['tag']!='span' or label['attrs']!={'class':'ds-btn__text'} or label['children'] or not label.get('text','').strip():return False
        return True
    if name!='hero-responsive' or el['tag']!='div' or el['attrs'].get('class')!='ds-banner ds-banner--hero ds-banner--hero-responsive' or 'data-banner-current' not in el['attrs'] or len(el['children'])!=1:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    inner=el['children'][0]
    if inner['tag']!='div' or inner['attrs'].get('class')!='ds-banner__responsive-inner' or len(inner['children'])!=3:return False
    title,desc,actions=inner['children']
    for n,cls in [(title,'ds-banner__title'),(desc,'ds-banner__desc')]:
        if n['tag']!='p' or n['attrs'].get('class')!=cls or n['children'] or not n.get('text','').strip():return False
    if actions['tag']!='div' or actions['attrs'].get('class')!='ds-banner__actions' or len(actions['children'])!=1:return False
    button=actions['children'][0]
    if button['tag']!='button' or button['attrs'].get('class')!='ds-btn ds-btn--outline-white ds-btn--xl' or button['attrs'].get('type')!='button' or 'disabled' in button['attrs'] or len(button['children'])!=1:return False
    label=button['children'][0]
    return label['tag']=='span' and label['attrs'].get('class')=='ds-btn__text' and not label['children'] and bool(label.get('text','').strip())
