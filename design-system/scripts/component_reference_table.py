"""Finite native table data and opt-in matrix structure; no disclosure host inference."""
def validate_matrix(el,name):
    if name not in ['matrix-products','matrix-plain']:return False
    expected=['ds-table','ds-table--matrix','ds-table--'+name]
    if el['tag']!='div' or sorted(el['attrs'].get('class','').split())!=sorted(expected) or set(el['attrs'])!={'class','data-ai-example','data-table-current'} or len(el['children'])!=2:return False
    scroll,controls=el['children']
    if scroll['tag']!='div' or scroll['attrs']!={'class':'ds-table__scroll'} or len(scroll['children'])!=1:return False
    table=scroll['children'][0]
    if table['tag']!='table' or table['attrs']!={'class':'ds-table__table'} or [n['tag'] for n in table['children']]!=['thead','tbody']:return False
    head,body=table['children']
    if head['attrs'] or body['attrs'] or len(head['children'])!=1 or not 1<=len(body['children'])<=6:return False
    row=head['children'][0]
    if row['tag']!='tr' or row['attrs'] or len(row['children'])!=6:return False
    for i,cell in enumerate(row['children']):
        if cell['tag']!='th':return False
        if name=='matrix-plain' or i==0:
            if cell['attrs']!={'scope':'col'} or cell['children'] or not cell.get('text','').strip():return False
        else:
            if cell['attrs']!={'scope':'col','data-table-product':''} or len(cell['children'])!=1:return False
            product=cell['children'][0]
            if product['tag']!='span' or product['attrs']!={'class':'ds-table__product'} or len(product['children'])!=2:return False
            media,label=product['children']
            if label['tag']!='span' or label['attrs'] or label['children'] or not label.get('text','').strip():return False
            if media['tag']!='span' or media['attrs']!={'class':'ds-table__product-media'} or len(media['children'])!=1:return False
            image=media['children'][0]
            if image['tag']!='img' or set(image['attrs'])!={'src','alt'} or image['children']:return False
            src=image['attrs']['src'].strip()
            if not src or src.startswith('//') or (':' in src and not src.startswith(('https://','http://'))):return False
    for row in body['children']:
        if row['tag']!='tr' or row['attrs'] or len(row['children'])!=6:return False
        for i,cell in enumerate(row['children']):
            if cell['tag']!=('th' if i==0 else 'td') or cell['attrs']!=({'class':'ds-table__row-header','scope':'row'} if i==0 else {}) or cell['children'] or not cell.get('text','').strip():return False
    if controls['tag']!='div' or controls['attrs']!={'class':'ds-table__scroll-controls','data-table-scroll-controls':'','hidden':''} or len(controls['children'])!=2:return False
    for button,direction in zip(controls['children'],['prev','next']):
        attrs=button['attrs']
        if button['tag']!='button' or set(attrs)!={'class','type','data-table-scroll','aria-label','disabled'} or attrs['class']!='ds-table__scroll-control' or attrs['type']!='button' or attrs['data-table-scroll']!=direction or not attrs['aria-label'].strip() or len(button['children'])!=1:return False
        image=button['children'][0]
        if image['tag']!='img' or image['attrs']!={'src':'../icons/icon-carousel-'+direction+'.svg','alt':''} or image['children']:return False
    return True

def validate_table(el,name):
    if 'ds-table' not in el['attrs'].get('class','').split():return True
    if name.startswith('matrix-'):return validate_matrix(el,name)
    variants={'vertical-double':['ds-table--vertical','ds-table--vertical-double'],'vertical-single':['ds-table--vertical','ds-table--vertical-single'],'horizontal-zebra':['ds-table--horizontal'],'horizontal-grid-13':['ds-table--horizontal','ds-table--grid'],'horizontal-grid-12-gpt':['ds-table--horizontal','ds-table--grid','ds-table--grid-compact'],'horizontal-row-line':['ds-table--horizontal','ds-table--row-line']}
    expected=variants.get(name)
    if expected is None or el['tag']!='div' or sorted(el['attrs'].get('class','').split())!=sorted(['ds-table']+expected) or len(el['children'])!=1:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or 'role' in n['attrs'] or 'tabindex' in n['attrs'] or 'colspan' in n['attrs'] or 'rowspan' in n['attrs'] or any(k.startswith('data-table') or k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    scroll=el['children'][0]
    if scroll['tag']!='div' or scroll['attrs'].get('class')!='ds-table__scroll' or len(scroll['children'])!=1:return False
    table=scroll['children'][0]
    if table['tag']!='table' or table['attrs'].get('class')!='ds-table__table':return False
    vertical=name.startswith('vertical')
    if [n['tag'] for n in table['children']]!=(['tbody'] if vertical else ['thead','tbody']):return False
    body=table['children'][-1]
    if not 1<=len(body['children'])<=6:return False
    columns=4 if name=='vertical-double' else 2 if vertical else None
    if not vertical:
        head=table['children'][0]
        if len(head['children'])!=1:return False
        tr=head['children'][0];columns=len(tr['children'])
        if tr['tag']!='tr' or columns<2:return False
        for cell in tr['children']:
            if cell['tag']!='th' or cell['attrs']!={'scope':'col'} or cell['children'] or not cell.get('text','').strip():return False
    for row in body['children']:
        if row['tag']!='tr' or row['attrs'] or len(row['children'])!=columns:return False
        for i,cell in enumerate(row['children']):
            header=vertical and i%2==0
            if cell['tag']!=('th' if header else 'td') or cell['children'] or not cell.get('text','').strip():return False
            if cell['attrs']!=({'class':'ds-table__row-header','scope':'row'} if header else {}):return False
    return True
