"""Finite product-card Cart atom; no host appearance overrides."""
def validate_cart(el):
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if el['tag']!='button' or set(el['attrs'].get('class','').split())!={'ds-cart','ds-cart--product-card'} or el['attrs'].get('type')!='button' or len(el['children'])!=2:return False
    icon,text=el['children']
    if icon['tag']!='img' or icon['attrs'].get('class')!='ds-cart__icon' or icon['attrs'].get('src')!='../icons/icon-cart-add.svg' or icon['attrs'].get('alt')!='':return False
    if text['tag']!='span' or text['attrs'].get('class')!='ds-cart__text' or text['children'] or not text.get('text','').strip():return False
    return not any(k=='style' or k=='hidden' or k.startswith('on') or k=='disabled' for n in nodes(el) for k in n['attrs'])
