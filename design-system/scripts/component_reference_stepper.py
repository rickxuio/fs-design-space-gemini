"""Authored four-stage desktop Stepper specimens; no browser geometry claim."""
def validate_stepper(el, name):
    classes=el['attrs'].get('class','').split()
    if 'ds-stepper' not in classes:
        return True
    suffix={'circle-centered-solution':'circle-centered','circle-centered-order':'circle-order','icon-regular':'icon-regular','icon-divider':'icon-divider'}.get(name)
    if not suffix or el['tag']!='div' or sorted(classes)!=sorted(['ds-stepper','ds-stepper--'+suffix]):
        return False
    def nodes(n):
        yield n
        for child in n['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):
        return False
    def exact(n,tag,cls):
        return n['tag']==tag and n['attrs'].get('class')==cls
    def text(n,cls):
        return exact(n,'p',cls) and not n['children'] and bool(n.get('text','').strip())
    def image(n,cls,file):
        return exact(n,'img',cls) and n['attrs'].get('src','').split('?')[0]=='../icons/'+file and n['attrs'].get('alt')=='' and not n['children']
    children=el['children'];circle=name.startswith('circle-')
    if circle:
        order=name=='circle-centered-order'
        if (order and ('data-stepper-interactive' in el['attrs'] or el['attrs'].get('data-stepper-current')!='order-static')) or (not order and ('data-stepper-interactive' not in el['attrs'] or el['attrs'].get('data-stepper-interactive') not in [None,''])) or not el['attrs'].get('aria-label','').strip() or any(k in el['attrs'] for k in ['role','tabindex']) or len(children)!=4:
            return False
        for index,item in enumerate(children):
            if not exact(item,'div','ds-stepper__item'+(' ds-stepper__item--current' if index==0 else '')) or 'data-stepper-item' not in item['attrs'] or any(k in item['attrs'] for k in ['role','tabindex','aria-current']):
                return False
            parts=item['children'];expected=3 if order else (3 if index<3 else 2)
            if len(parts)!=expected:
                return False
            if order:
                bar,marker,body=parts
                if not exact(bar,'span','ds-stepper__order-bar') or bar['attrs'].get('aria-hidden')!='true' or bar['children']:
                    return False
            else:
                marker=parts[0];body=parts[-1]
                if index<3 and (not exact(parts[1],'span','ds-stepper__connector') or parts[1]['attrs'].get('aria-hidden')!='true' or parts[1]['children']):
                    return False
            if not exact(marker,'span','ds-stepper__marker') or marker['attrs'].get('aria-hidden')!='true' or marker['children'] or marker.get('text','').strip()!=str(index+1) or not exact(body,'div','ds-stepper__body'):
                return False
            content=body['children']
            if len(content)!=(2 if order else 1) or not text(content[0],'ds-stepper__title') or (order and not text(content[1],'ds-stepper__description')):
                return False
        return True
    if 'data-stepper-interactive' in el['attrs'] or len(children)!=7:
        return False
    divider=name=='icon-divider'
    for index,node in enumerate(children):
        if index%2:
            if divider:
                if not exact(node,'span','ds-stepper__divider') or node['attrs'].get('aria-hidden')!='true' or len(node['children'])!=2 or node['children'][0]['tag']!='i' or node['children'][0]['children'] or not image(node['children'][1],'ds-stepper__divider-icon','icon-stepper-divider-next.svg'):
                    return False
            else:
                if not exact(node,'span','ds-stepper__connector ds-stepper__connector--arrow') or node['attrs'].get('aria-hidden')!='true' or len(node['children'])!=1:
                    return False
                svg=node['children'][0]
                if not exact(svg,'svg','ds-stepper__connector-arrow-icon') or svg['attrs'].get('viewbox')!='0 0 36 16' or svg['attrs'].get('width')!='36' or svg['attrs'].get('height')!='16' or len(svg['children'])!=1:
                    return False
                path=svg['children'][0]
                if path['tag']!='path' or path['attrs'].get('d')!='M0 8H32M32 8L26 2M32 8L26 14' or path['attrs'].get('stroke')!='currentColor' or path['attrs'].get('stroke-width')!='1.2':
                    return False
            continue
        if not exact(node,'div','ds-stepper__item') or len(node['children'])!=2 or not image(node['children'][0],'ds-stepper__placeholder','icon-demo-report-current-68.svg' if divider and el['attrs'].get('data-stepper-source-icon68')=='official' else 'icon-demo-report.svg'):
            return False
        body=node['children'][1]
        if not exact(body,'div','ds-stepper__body') or len(body['children'])!=2:
            return False
        title,description=body['children']
        if not text(description,'ds-stepper__description'):
            return False
        if divider:
            if not exact(title,'div','ds-stepper__title') or len(title['children'])!=1 or el['attrs'].get('data-stepper-current')!='divider-text-atom' or el['attrs'].get('data-stepper-source-icon68')!='official':
                return False
            atom=title['children'][0]
            if not exact(atom,'a','ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l') or atom['attrs'].get('aria-disabled')!='true' or 'href' in atom['attrs'] or len(atom['children'])!=2:
                return False
            label,arrow=atom['children']
            if not exact(label,'span','ds-text-btn__text') or label['children'] or not label.get('text','').strip() or not image(arrow,'ds-text-btn__icon','icon-text-button-arrow-right-bold.svg'):
                return False
        elif not text(title,'ds-stepper__title'):
            return False
    return True
