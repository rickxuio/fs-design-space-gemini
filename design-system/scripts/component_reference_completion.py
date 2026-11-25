"""Finite missing source shapes; existing admitted shapes keep their original validators."""
from component_reference_links import safe_anchor_target

def nodes(n):
    yield n
    for child in n['children']:
        yield from nodes(child)

def exact(n, tag, cls):
    return n['tag'] == tag and n['attrs'].get('class') == cls

def plain(n, tag, cls):
    return exact(n, tag, cls) and not n['children'] and bool(n.get('text', '').strip())

def clean(n):
    return not any('style' in x['attrs'] or any(k.lower().startswith('on') for k in x['attrs']) for x in nodes(n))

def validate_list_links(n):
    if not exact(n, 'div', 'ds-list ds-list--unordered-links-12') or n['attrs'].get('data-list-current') != 'unordered-links' or not clean(n) or not 1 <= len(n['children']) <= 24:
        return False
    for item in n['children']:
        if not exact(item, 'div', 'ds-list__unordered-item') or len(item['children']) != 1:
            return False
        link = item['children'][0]
        if not plain(link, 'a', 'ds-list__unordered-link') or not link['attrs'].get('href', '').strip() or not safe_anchor_target(link['attrs']):
            return False
    return True

def validate_profile_list(n):
    if not exact(n,'div','ds-list ds-list--key-value') or n['attrs'].get('data-list-current')!='key-value' or not clean(n) or len(n['children'])!=2:
        return False
    profile,fields=n['children']
    if not exact(profile,'div','ds-list__key-value-profile') or not exact(fields,'div','ds-list__key-value-fields') or not 1<=len(fields['children'])<=12:
        return False
    for row in fields['children']:
        if not exact(row,'div','ds-list__key-value-row') or len(row['children']) not in [2,3]:return False
        if not plain(row['children'][0],'p','ds-list__key-value-label') or not plain(row['children'][1],'p','ds-list__key-value-content'):return False
    actions=[x for x in nodes(n) if 'data-list-profile-action' in x['attrs']]
    return len(actions)>=2 and all(x['tag']=='button' and x['attrs'].get('type')=='button' and x['attrs'].get('data-list-profile-action') in ['photo','certify','edit'] and 'disabled' not in x['attrs'] for x in actions)

def validate_search_part(n,part='banner-search42',surface='gray'):
    if not exact(n,'form','ds-input-search') or n['attrs'].get('data-input-part')!=part or n['attrs'].get('data-input-search-surface')!=surface or n['attrs'].get('role')!='search' or len(n['children'])!=2 or not clean(n):return False
    field,button=n['children']
    if not exact(field,'input','ds-input-search__field') or field['attrs'].get('type')!='search' or not field['attrs'].get('placeholder','').strip() or not field['attrs'].get('aria-label','').strip() or 'disabled' in field['attrs']:return False
    return exact(button,'button','ds-icon-btn ds-icon-btn--plain ds-icon-btn--m') and button['attrs'].get('type')=='button' and button['attrs'].get('aria-label')=='Search' and len(button['children'])==1 and exact(button['children'][0],'img','ds-icon-btn__icon') and button['children'][0]['attrs'].get('src')=='../icons/icon-button-search-m-default.svg'

def validate_search_banner(n):
    if not exact(n,'div','ds-banner ds-banner--search') or 'data-banner-search-current' not in n['attrs'] or not clean(n) or len(n['children'])!=2:return False
    copy,row=n['children']
    if not exact(copy,'div','ds-banner__search-copy') or len(copy['children'])!=2 or not plain(copy['children'][0],'p','ds-banner__title') or not plain(copy['children'][1],'p','ds-banner__desc') or not exact(row,'div','ds-banner__search-row') or len(row['children'])!=2 or not validate_search_part(row['children'][0]):return False
    gpt=row['children'][1]
    if not exact(gpt,'button','ds-banner__gpt') or gpt['attrs'].get('type')!='button' or len(gpt['children'])!=3:return False
    slot,label,arrow=gpt['children']
    return exact(slot,'span','ds-banner__gpt-slot') and len(slot['children'])==1 and slot['children'][0]['attrs'].get('src')=='../sources/banner/gpt28-native-official-1015.svg' and plain(label,'span','ds-banner__gpt-label') and label.get('text','').strip()=='FS GPT' and exact(arrow,'img','ds-banner__gpt-arrow') and arrow['attrs'].get('src')=='../icons/mastergo-library/通用Icon/33189-59138.svg'

def validate_icon_card_completion(n, name):
    from component_reference_list import validate_list
    jump = name == 'left.jump-type'
    layout = name.split('.')[0]
    cls = 'ds-icon-card ds-icon-card--' + layout + (' ds-icon-card--bg-white ds-icon-card--bordered' if jump else ' ds-icon-card--bg-gray')
    marker = 'jump' if jump else layout + '-expandable'
    if not exact(n, 'div', cls) or n['attrs'].get('data-icon-card-current') != marker or not clean(n) or len(n['children']) != 2:
        return False
    icon, body = n['children']
    if not exact(icon, 'img', 'ds-icon-card__icon') or icon['attrs'].get('src') != '../icons/icon-placeholder-switch.svg' or not exact(body, 'div', 'ds-icon-card__body') or len(body['children']) != (2 if jump else 4):
        return False
    title = body['children'][0]
    if not exact(title, 'div', 'ds-icon-card__title-slot') or len(title['children']) != 1:
        return False
    a = title['children'][0]
    if not exact(a, 'a', 'ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l') or len(a['children']) != 1 or not plain(a['children'][0], 'span', 'ds-text-btn__text') or a['attrs'].get('aria-disabled') != 'true':
        return False
    if jump:
        links = body['children'][1]
        return exact(links, 'div', 'ds-icon-card__blue-links') and len(links['children']) == 1 and validate_list_links(links['children'][0])
    desc, content, action = body['children'][1:]
    if not plain(desc, 'p', 'ds-icon-card__desc') or not exact(content, 'div', 'ds-icon-card__bullets') or len(content['children']) != 1 or not validate_list(content['children'][0], 'unordered-12'):
        return False
    if not exact(action, 'div', 'ds-icon-card__link') or len(action['children']) != 1:
        return False
    b = action['children'][0]
    return exact(b, 'button', 'ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m') and b['attrs'].get('type') == 'button' and b['attrs'].get('data-text-button-part') == 'icon-card-disclosure' and b['attrs'].get('aria-expanded') == 'false' and len(b['children']) == 2 and plain(b['children'][0], 'span', 'ds-text-btn__text') and exact(b['children'][1], 'img', 'ds-text-btn__icon') and b['children'][1]['attrs'].get('src') == '../icons/icon-chevron-down.svg'

def validate_card_completion(n, name):
    from component_reference_list import validate_list
    from component_reference_cart import validate_cart
    from component_reference_tag import validate_tag
    detail = name == 'embedded.product-detail'
    plp = name == 'embedded.product-plp'
    expected = {'ds-card', 'ds-card--embedded', 'ds-card--embedded-detail' if detail else 'ds-card--embedded-full'}
    if plp:
        expected.add('ds-card--embedded-plp')
    if not detail:
        expected.add('ds-card--embedded-bg-gray')
    expected_marker = 'embedded-detail' if detail else ('embedded-plp' if plp else 'embedded-full')
    if n['tag'] != 'div' or set(n['attrs'].get('class', '').split()) != expected or not clean(n) or n['attrs'].get('data-card-current') != expected_marker or len(n['children']) != (2 if detail else 3):
        return False
    media, body = n['children'][:2]
    if not exact(media, 'div', 'ds-card__product-image-wrap' if detail else 'ds-card__product-image') or len(media['children']) != 1:
        return False
    image = media['children'][0]
    if not exact(image, 'img', 'ds-card__product-image') or not image['attrs'].get('src', '').strip() or not image['attrs'].get('alt', '').strip() or not exact(body, 'div', 'ds-card__product-body'):
        return False
    if detail:
        if len(body['children']) != 2:
            return False
        heading, listing = body['children']
        return heading['tag'] == 'div' and len(heading['children']) == 2 and plain(heading['children'][0], 'p', 'ds-card__product-title') and plain(heading['children'][1], 'p', 'ds-card__product-subtitle') and validate_list(listing, 'unordered-12')
    if plp:
        if len(body['children']) != 5:
            return False
        title, specs, price, stock, stats = body['children']
        if not plain(title, 'p', 'ds-card__title') or not plain(specs, 'p', 'ds-card__specs') or not plain(price, 'p', 'ds-card__price') or not exact(stock, 'div', 'ds-card__stock') or not exact(stats, 'div', 'ds-card__stats'):
            return False
        carts = [x for x in nodes(stats) if 'ds-cart' in x['attrs'].get('class', '').split()]
        if len(carts) != 1 or not validate_cart(carts[0]):
            return False
        badge = n['children'][2]
        return exact(badge, 'div', 'ds-card__tag-slot') and len(badge['children']) == 1 and (validate_tag(badge['children'][0], 'semantic-new') or validate_tag(badge['children'][0], 'semantic-hot'))
    if len(body['children']) != 6:
        return False
    tags, title, price, listing, stock, stats = body['children']
    if not exact(tags, 'div', 'ds-card__compat-tags') or len(tags['children']) < 2 or sum(t['attrs'].get('aria-pressed')=='true' for t in tags['children'])!=1:
        return False
    from copy import deepcopy
    for tag in tags['children']:
        if tag['attrs'].get('aria-pressed') not in ['true','false']:return False
        t=deepcopy(tag);t['attrs']['aria-pressed']='false'
        if not validate_tag(t,'product-custom-small' if 'ds-tag--product-custom' in t['attrs'].get('class','').split() else 'product-regular-small'):return False
    if not plain(title, 'p', 'ds-card__title') or not plain(price, 'p', 'ds-card__price') or not validate_list(listing, 'unordered-12') or not exact(stock, 'div', 'ds-card__stock') or not exact(stats, 'div', 'ds-card__stats'):
        return False
    carts = [x for x in nodes(stats) if 'ds-cart' in x['attrs'].get('class', '').split()]
    if len(carts) != 1 or not validate_cart(carts[0]):
        return False
    badge = n['children'][2]
    return exact(badge, 'div', 'ds-card__tag-slot') and len(badge['children']) == 1 and validate_tag(badge['children'][0], 'semantic-new')
