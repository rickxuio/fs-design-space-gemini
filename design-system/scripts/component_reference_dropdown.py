"""Finite basic/search/brand single choice; multiple/grouped hosts remain unsupported."""
def validate_dropdown(el, name, query_all, document):
    if 'ds-dropdown-command' in el['attrs'].get('class','').split(): return validate_commands(el,name,query_all,document)
    if 'ds-dropdown' not in el['attrs'].get('class','').split(): return True
    if name not in ['basic','with-search','brand-select'] or el['tag'] != 'div' or el['attrs'].get('class') != 'ds-dropdown' or 'data-dropdown-current' not in el['attrs'] or len(el['children']) != 2: return False
    searching=name!='basic';brand=name=='brand-select'
    if searching and el['attrs'].get('data-dropdown-kind')!=('brand' if brand else 'search'):return False
    if not searching and 'data-dropdown-kind' in el['attrs']:return False
    def nodes(n):
        yield n
        for child in n['children']: yield from nodes(child)
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)): return False
    if 'data-dropdown-ready' in el['attrs'] or el['attrs'].get('data-value','') != '': return False
    trigger,panel = el['children']
    if trigger['tag'] != 'button' or trigger['attrs'].get('type') != 'button' or trigger['attrs'].get('class') != ('ds-dropdown__trigger ds-dropdown__trigger--sm' if brand else 'ds-dropdown__trigger') or trigger['attrs'].get('aria-expanded') != 'false' or trigger['attrs'].get('aria-haspopup') != 'listbox' or len(trigger['children']) != 2: return False
    text,arrow=trigger['children']
    if text['tag']!='span' or text['attrs'].get('class')!='ds-dropdown__trigger-text' or text['children'] or not text.get('text','').strip(): return False
    if arrow['tag']!='img' or arrow['attrs'].get('class')!='ds-dropdown__trigger-arrow' or not arrow['attrs'].get('src','').endswith('icons/icon-chevron-down.svg') or arrow['attrs'].get('alt')!='': return False
    identity=panel['attrs'].get('id','')
    if not identity or len(query_all(document,'[id="'+identity+'"]'))!=1 or trigger['attrs'].get('aria-controls')!=identity: return False
    if panel['tag']!='div' or panel['attrs'].get('class')!='ds-dropdown__panel' or 'hidden' not in panel['attrs'] or len(panel['children'])!=(2 if searching else 1): return False
    if searching:
        search=panel['children'][0]
        if search['tag']!='div' or search['attrs'].get('class')!=('ds-dropdown__search ds-dropdown__search--bordered' if brand else 'ds-dropdown__search') or len(search['children'])!=2:return False
        field,icon=search['children']
        if field['tag']!='input' or field['attrs']!={'type':'text','placeholder':'Search','aria-label':'Search choices','autocomplete':'off'} or field['children']:return False
        if icon['tag']!='img' or icon['attrs']!={'class':'ds-dropdown__search-icon','src':'../icons/icon-search.svg','alt':''} or icon['children']:return False
    group=panel['children'][-1]
    if group['tag']!='div' or group['attrs'].get('class')!='ds-dropdown__list' or group['attrs'].get('role')!='listbox' or not group['attrs'].get('aria-label','').strip() or len(group['children'])<2: return False
    values=[]
    for item in group['children']:
        a=item['attrs']
        if item['tag']!='button' or a.get('type')!='button' or a.get('class')!='ds-dropdown__item' or a.get('role')!='option' or a.get('aria-selected')!='false' or a.get('tabindex')!='-1' or 'hidden' in a or not a.get('value') or item['children'] or not item.get('text','').strip(): return False
        values.append(a['value'])
    return len(set(values))==len(values)

def validate_commands(el,name,query_all,document):
    positions={'command-text':['bottom','top','left','right'],'command-dot':['br','bl','tr','tl','left','right'],'account-guest':['br'],'account-signed-in':['br']}
    a=el['attrs']
    if name not in positions or el['tag']!='div' or a.get('class')!='ds-dropdown-command' or a.get('data-dropdown-command')!=name or a.get('data-dropdown-placement') not in positions[name] or a.get('data-dropdown-trigger') not in ['click','hover'] or len(el['children'])!=2:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    all_nodes=list(nodes(el))
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in all_nodes):return False
    trigger,panel=el['children'];ta=trigger['attrs'];pid=panel['attrs'].get('id','')
    if trigger['tag']!='button' or ta.get('type')!='button' or ta.get('aria-haspopup')!='menu' or ta.get('aria-expanded')!='false' or ta.get('aria-controls')!=pid or not pid or len(query_all(document,'[id="'+pid+'"]'))!=1:return False
    if panel['tag']!='div' or panel['attrs'].get('class')!='ds-dropdown-command__panel' or 'hidden' not in panel['attrs'] or len(panel['children'])!=1:return False
    menu=panel['children'][0]
    if menu['tag']!='div' or menu['attrs'].get('role')!='menu' or not menu['attrs'].get('aria-label') or 'ds-dropdown-command__menu' not in menu['attrs'].get('class','').split():return False
    commands=[n for n in nodes(menu) if n['attrs'].get('role')=='menuitem']
    if not 1<=len(commands)<=24:return False
    values=[]
    for n in commands:
        x=n['attrs'];values.append(x.get('value'))
        if n['tag']!='button' or x.get('type')!='button' or x.get('tabindex')!='-1' or not x.get('value') or 'aria-selected' in x:return False
    if len(set(values))!=len(values):return False
    if name=='command-dot':
        if ta.get('class')!='ds-icon-btn ds-icon-btn--plain ds-icon-btn--m' or len(trigger['children'])!=1 or trigger['children'][0]['attrs'].get('src')!='../icons/icon-more.svg':return False
    elif name=='command-text':
        if ta.get('class')!='ds-dropdown-command__text-trigger' or len(trigger['children'])!=2:return False
    elif ta.get('class')!='ds-dropdown-command__account-trigger' or len(trigger['children'])!=1 or trigger['children'][0]['attrs'].get('src')!='../icons/icon-account.svg':return False
    return True
