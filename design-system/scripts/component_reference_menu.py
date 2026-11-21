"""Exact native-button two-level MenuNavigation identity and authored states."""
def validate_menu(el,name,query_all,page):
    classes=el['attrs'].get('class','').split()
    if 'ds-menu-navigation' not in classes:
        return True
    widths={'single-level':'250','multi-level':'288','multi-level-search':'250','public-header':None}
    if name not in widths:
        return False
    if name!='public-header' and el['attrs'].get('data-menu-navigation-current')!='menu-atom':
        raise ValueError('current menu atom marker required')
    expected=['ds-menu-navigation','ds-menu-navigation--'+name]+(['ds-menu-navigation--width-'+widths[name]] if widths[name] else [])
    if el['tag']!='nav' or sorted(classes)!=sorted(expected) or 'data-menu-navigation' not in el['attrs'] or 'data-menu-navigation-ready' in el['attrs'] or 'data-preview-static' in el['attrs'] or not el['attrs'].get('aria-label','').strip():
        return False
    def nodes(n):
        yield n
        for child in n['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or 'tabindex' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):
        return False
    def exact(n,tag,cls):return n['tag']==tag and n['attrs'].get('class')==cls
    def img(n,cls,file):return exact(n,'img',cls) and n['attrs'].get('src')=='../icons/'+file and n['attrs'].get('alt')=='' and not n['children']
    children=el['children'][:]
    if children and exact(children[0],'div','ds-menu-navigation__title'):
        title=children.pop(0)
        if name=='public-header' or title['children'] or not title.get('text','').strip():return False
    if name=='multi-level-search':
        from component_reference_completion import validate_search_part
        if not children or not exact(children[0],'div','ds-menu-navigation__search') or len(children[0]['children'])!=1 or not validate_search_part(children[0]['children'][0],'menu-search42','white'):return False
        children.pop(0)
    if len(children)!=1 or not exact(children[0],'ul','ds-menu-navigation__list') or not children[0]['children']:return False
    values=set();selected=0;expanded=0;parent_count=0;valid=True
    def visit_list(list_node,depth=0,hidden=False):
        nonlocal selected,expanded,parent_count,valid
        for li in list_node['children']:
            if li['tag']!='li' or len(li['children']) not in [1,2]:valid=False;return
            button=li['children'][0];a=button['attrs'];cs=a.get('class','').split();value=a.get('data-value','');is_parent='aria-expanded' in a
            if button['tag']!='button' or a.get('type')!='button' or 'disabled' in a or not value.strip() or value in values or not set(cs).issubset({'ds-menu-navigation__item','ds-menu-navigation__item--selected'}) or 'ds-menu-navigation__item' not in cs:valid=False;return
            values.add(value);parts=button['children'];is_selected='ds-menu-navigation__item--selected' in cs
            if is_parent:
                parent_count+=1
                if depth!=0 or name not in ['multi-level','multi-level-search'] or is_selected or a.get('aria-expanded') not in ['true','false'] or len(li['children'])!=2 or len(parts)!=2 or not img(parts[1],'ds-menu-navigation__chevron','icon-chevron-down.svg'):valid=False;return
                panel=li['children'][1];ident=panel['attrs'].get('id','');opened=a['aria-expanded']=='true';expanded+=opened
                if not exact(panel,'ul','ds-menu-navigation__panel') or not ident or a.get('aria-controls')!=ident or len(query_all(page,'[id="'+ident+'"]'))!=1 or ('hidden' in panel['attrs'])==opened or not panel['children']:valid=False;return
                visit_list(panel,1,not opened)
                label=parts[0]
            else:
                if len(li['children'])!=1 or 'aria-controls' in a or a.get('aria-pressed', 'false')!=str(is_selected).lower() or (is_selected and hidden):valid=False;return
                selected+=is_selected
                if name=='public-header':
                    if len(parts)!=2 or not img(parts[0],'ds-menu-navigation__product-icon','icon-menu-'+value+'.svg'):valid=False;return
                    label=parts[1]
                else:
                    if len(parts)!=1:valid=False;return
                    label=parts[0]
            if not exact(label,'span','ds-menu-navigation__item-label') or label['children'] or not label.get('text','').strip():valid=False;return
    visit_list(children[0])
    return valid and selected==1 and expanded<=1 and ((parent_count>0)==(name in ['multi-level','multi-level-search']))
