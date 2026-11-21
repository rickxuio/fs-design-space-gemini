"""Exact authored current basic Input structure; no browser/source-type proof."""
def validate_input(el, name, query_all, page_root):
    if name not in ['gray', 'white']:
        return False
    attrs = el['attrs']
    if el['tag'] != 'div' or attrs.get('class') != 'ds-input-field' or 'data-input-current' not in attrs:
        return False
    if set(attrs) - {'class', 'data-input-current', 'data-ai-example', 'data-input-layout', 'data-input-label', 'data-input-join', 'data-input-arrow'}:
        return False
    if 'data-input-arrow' in attrs and (attrs['data-input-arrow'] != 'down' or 'data-input-label' in attrs):
        return False
    external = attrs.get('data-input-label') == 'external'
    # Only the observed gray/white phone assembly may close its internal label.
    if external:
        if attrs.get('data-input-join') != 'start' or attrs.get('data-input-layout') != 'fill':
            return False
    elif 'data-input-label' in attrs or 'data-input-join' in attrs:
        return False
    if attrs.get('data-input-layout', 'fill') != 'fill':
        return False
    inputs = query_all(el, 'input.ds-input-field__input')
    labels = query_all(el, 'label.ds-input-field__label')
    errors = query_all(el, 'div.ds-input-field__error')
    if len(inputs) != 1 or len(errors) != 1:
        return False
    field, error = inputs[0], errors[0]
    if external:
        if labels or el['children'] != [field, error]:
            return False
        labels = query_all(page_root, 'label[for="' + field['attrs'].get('id', '') + '"]')
        def parent_of(node, target):
            for child in node['children']:
                if child is target: return node
                found = parent_of(child, target)
                if found: return found
            return None
        parent = parent_of(page_root, el)
        prefix_parts = [n for n in parent['children'] if 'ds-input-prefix' in n['attrs'].get('class','').split() or 'data-input-prefix' in n['attrs']] if parent else []
        if prefix_parts:
            if len(prefix_parts)!=1 or parent['children'] != [prefix_parts[0],el] or 'style' in parent['attrs'] or not validate_static_prefix(prefix_parts[0],name): return False

    elif len(labels) != 1 or el['children'] != [labels[0], field, error]:
        return False
    if len(labels) != 1:
        return False
    label = labels[0]
    ia, la, ea = field['attrs'], label['attrs'], error['attrs']
    if ia.get('class') != 'ds-input-field__input ds-input-field__input--' + name or ia.get('type') != 'text':
        return False
    if set(ia) - {'class', 'type', 'id', 'placeholder', 'name', 'value', 'aria-invalid'} or ia.get('aria-invalid', 'false') != 'false':
        return False
    if not ia.get('id') or not ea.get('id') or ia['id'] == ea['id']:
        return False
    if any(len(query_all(page_root, '[id="' + identity + '"]')) != 1 for identity in [ia['id'], ea['id']]):
        return False
    label_attrs = {'class', 'for', 'data-input-current'} if external else {'class', 'for'}
    if la.get('class') != 'ds-input-field__label' or la.get('for') != ia['id'] or set(la) != label_attrs or label['children'] or not label.get('text', '').strip():
        return False
    if ea.get('class') != 'ds-input-field__error' or set(ea) != {'class', 'id', 'hidden'} or len(error['children']) != 2:
        return False
    icon, message = error['children']
    if icon['tag'] != 'span' or icon['attrs'] != {'class': 'ds-input-field__error-icon', 'aria-hidden': 'true'} or icon['children'] or icon.get('text', '').strip():
        return False
    if message['tag'] != 'span' or message['attrs'] != {'class': 'ds-input-field__error-text'} or message['children'] or not message.get('text', '').strip():
        return False
    return True

def validate_static_prefix(el, name):
    """Finite presentation adapter; not a complete Select or standalone AI input."""
    if name not in ['gray','white'] or el['tag'] != 'div': return False
    attrs = dict(el['attrs'])
    if attrs.get('data-input-current') not in [None,'']: return False
    if 'data-input-current' in attrs: attrs['data-input-current'] = ''
    if attrs != {'class':'ds-input-prefix','data-input-current':'',
                       'data-input-prefix':'static','data-input-color':name,
                       'aria-label':'Country code +1'}: return False
    if len(el['children']) != 2: return False
    text, icon = el['children']
    return (text['tag']=='span' and not text['attrs'] and not text['children']
            and text.get('text','').strip()=='+1' and icon['tag']=='img'
            and icon['attrs']=={'src':'../icons/icon-input-down.svg','alt':''}
            and not icon['children'])
