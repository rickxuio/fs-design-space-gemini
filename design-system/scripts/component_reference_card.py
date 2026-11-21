"""Four finite image/body Card structures with genuine inline-black/M TextButton."""
import re
from component_reference_links import safe_anchor_target
from component_reference_cart import validate_cart
def validate_card(el,name):
    if name in ['spliced.horizontal.with-sidebar','spliced.horizontal.with-sidebar.bordered-background']:
        from component_reference_five import sidebar
        return sidebar(el,name)
    if name in ['embedded.product-detail','embedded.product-full']:
        from component_reference_completion import validate_card_completion
        return validate_card_completion(el,name)
    if name=='spliced.vertical.category-nav':
        if el['tag']!='div' or el['attrs'].get('class')!='ds-card ds-card--vertical ds-card--no-border' or el['attrs'].get('data-card-current')!='category-nav' or len(el['children'])!=2:return False
        image,body=el['children']
        if image['attrs'].get('class')!='ds-card__image' or len(image['children'])!=1 or image['children'][0]['tag']!='img' or not image['children'][0]['attrs'].get('src') or not image['children'][0]['attrs'].get('alt'):return False
        src=image['children'][0]['attrs']['src']
        if ':' in src and re.sub(r'[\x00-\x20]','',src.split(':',1)[0]).lower() not in ['http','https']:return False
        if body['attrs'].get('class')!='ds-card__body' or len(body['children'])!=2:return False
        title,links=body['children']
        return title['tag']=='span' and title['attrs'].get('class')=='ds-card__title ds-card__title--single-line' and bool(title.get('text','').strip()) and links['attrs'].get('class')=='ds-card__sub-links' and bool(links['children']) and all(n['tag']=='span' and n['attrs'].get('class')=='ds-card__sub-link' and bool(n.get('text','').strip()) and not n['children'] for n in links['children']) and not any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in [el,image,*image['children'],body,title,links,*links['children']])
    if name=='embedded.product-small':
        def nodes(n):
            yield n
            for child in n['children']:yield from nodes(child)
        expected={'ds-card','ds-card--embedded','ds-card--embedded-small','ds-card--embedded-bg-gray'}
        if el['tag']!='div' or set(el['attrs'].get('class','').split())!=expected or el['attrs'].get('data-card-current')!='embedded-small' or len(el['children'])!=2:return False
        if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
        image,body=el['children']
        if image['tag']!='img' or image['attrs'].get('class')!='ds-card__product-image' or not image['attrs'].get('src','').strip() or not image['attrs'].get('alt','').strip() or 'hidden' in image['attrs']:return False
        protocol=re.sub(r'[\x00-\x20]','',image['attrs']['src'].split(':',1)[0]).lower()
        if ':' in image['attrs']['src'] and protocol not in ['http','https']:return False
        if body['tag']!='div' or body['attrs'].get('class')!='ds-card__product-body' or len(body['children'])!=3:return False
        title,price,slot=body['children']
        for n,cls in [(title,'ds-card__product-title'),(price,'ds-card__product-price')]:
            if n['tag']!='p' or n['attrs'].get('class')!=cls or n['children'] or not n.get('text','').strip():return False
        return slot['tag']=='div' and set(slot['attrs'].get('class','').split())=={'ds-card__add-btn','ds-card__cart-slot'} and len(slot['children'])==1 and validate_cart(slot['children'][0]) and slot['children'][0]['children'][1].get('text','').strip()=='Add'
    if name=='embedded.product-standard':
        def descendants(n):
            yield n
            for c in n['children']:yield from descendants(c)
        allowed=[['ds-card','ds-card--embedded','ds-card--embedded-standard','ds-card--embedded-standard-bg-white'],['ds-card','ds-card--embedded','ds-card--embedded-standard','ds-card--embedded-standard-bg-gray']]
        if el['tag']!='div' or el['attrs'].get('class','').split() not in allowed or el['attrs'].get('data-card-current')!='embedded-standard' or el['attrs'].get('data-card-surface') not in ['white','gray'] or len(el['children'])!=2:return False
        if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in descendants(el)):return False
        media,body=el['children']
        if media['tag']!='div' or media['attrs'].get('class')!='ds-card__product-image' or len(media['children'])!=1:return False
        img=media['children'][0]
        if img['tag']!='img' or not img['attrs'].get('src','').strip() or not img['attrs'].get('alt','').strip() or img['children'] or 'hidden' in img['attrs']:return False
        protocol=re.sub(r'[\x00-\x20]','',img['attrs']['src'].split(':',1)[0]).lower()
        if ':' in img['attrs']['src'] and protocol not in ['http','https']:return False
        if body['tag']!='div' or body['attrs'].get('class')!='ds-card__product-body' or len(body['children'])!=3:return False
        title,desc,link=body['children']
        for n,cls in [(title,'ds-card__product-title'),(desc,'ds-card__product-description')]:
            if n['tag']!='p' or n['attrs'].get('class')!=cls or n['children'] or not n.get('text','').strip():return False
        if link['attrs'].get('class')!='ds-card__product-link':return False
        translated=dict(link);translated['attrs']=dict(link['attrs'],**{'class':'ds-card__link'})
        return validate_link(translated)
    if 'ds-card' not in el['attrs'].get('class','').split():return True
    variants={'spliced.horizontal.full-width.responsive':'ds-card ds-card--horizontal ds-card--source-responsive','spliced.horizontal.full-width':'ds-card ds-card--horizontal','spliced.horizontal.full-width.bordered-background':'ds-card ds-card--horizontal ds-card--horizontal-bordered','spliced.vertical.single-event':'ds-card ds-card--vertical ds-card--no-border','spliced.vertical.single-event.bordered':'ds-card ds-card--vertical ds-card--bordered'}
    if name not in variants or el['tag']!='div' or el['attrs'].get('class')!=variants[name] or len(el['children'])!=2:return False
    if name in ['spliced.horizontal.full-width','spliced.horizontal.full-width.responsive'] and el['attrs'].get('data-card-current')!='horizontal-unbordered':return False
    if name in ['spliced.vertical.single-event','spliced.vertical.single-event.bordered'] and el['attrs'].get('data-card-current')!='vertical-single-event':return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('id' in n['attrs'] or 'style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    media,body=el['children']
    if media['tag']!='div' or media['attrs'].get('class')!='ds-card__image' or len(media['children'])!=1:return False
    img=media['children'][0]
    if img['tag']!='img' or not img['attrs'].get('src','').strip() or not img['attrs'].get('alt','').strip() or img['children']:return False
    source=img['attrs']['src'];protocol=re.sub(r'[\x00-\x20]','',source.split(':',1)[0]).lower()
    if ':' in source and protocol not in ['http','https']:return False
    if body['tag']!='div' or body['attrs'].get('class')!='ds-card__body':return False
    vertical=name in ['spliced.vertical.single-event','spliced.vertical.single-event.bordered'];bordered=name.endswith('.bordered-background')
    if vertical:
        if len(body['children'])!=4:return False
        meta,title,desc,link=body['children']
        if meta['tag']!='div' or meta['attrs'].get('class')!='ds-card__meta' or len(meta['children'])!=1:return False
        category=meta['children'][0]
        if category['tag']!='span' or category['attrs'].get('class')!='ds-card__category' or category['children'] or not category.get('text','').strip():return False
        if title['tag']!='p' or title['attrs'].get('class')!='ds-card__title' or title['children'] or not title.get('text','').strip():return False
        if desc['tag']!='div' or desc['attrs'].get('class')!='ds-card__desc' or len(desc['children'])!=1:return False
        paragraph=desc['children'][0]
        if paragraph['tag']!='p' or paragraph['attrs'] or paragraph['children'] or not paragraph.get('text','').strip():return False
        return validate_link(link)
    if len(body['children'])!=2:return False
    stack,link=body['children']
    if stack['tag']!='div' or stack['attrs'].get('class')!='ds-card__content-stack' or len(stack['children'])!=(3 if bordered else 2):return False
    for n,cls in zip(stack['children'][:2],['ds-card__title'+(' ds-card__title--single-line' if bordered else ''),'ds-card__desc']):
        if n['tag']!='p' or n['attrs'].get('class')!=cls or n['children'] or not n.get('text','').strip():return False
    if bordered:
        from component_reference_list import validate_list
        if not validate_list(stack['children'][2],'unordered-12'):return False
    return validate_link(link)

def validate_link(link):
    if link['tag']!='div' or link['attrs'].get('class')!='ds-card__link' or len(link['children'])!=1:return False
    anchor=link['children'][0]
    if anchor['tag']!='a' or anchor['attrs'].get('class')!='ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m' or len(anchor['children'])!=2:return False
    if not safe_anchor_target(anchor['attrs']):return False
    label,arrow=anchor['children']
    return label['tag']=='span' and label['attrs'].get('class')=='ds-text-btn__text' and not label['children'] and bool(label.get('text','').strip()) and arrow['tag']=='img' and arrow['attrs'].get('class')=='ds-text-btn__icon' and arrow['attrs'].get('src')=='../icons/icon-text-button-arrow-right-regular.svg' and arrow['attrs'].get('alt')==''
