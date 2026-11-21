"""Finite Rate specimen validation; authored state, not computed browser styles."""
import json
import re

def validate_rate(el, name):
    classes = el['attrs'].get('class', '').split()
    if 'ds-rate' not in classes:
        return True
    variant = name.split('::')[0]
    if variant=='summary':return validate_summary_current(el) if 'data-rate-summary-current' in el['attrs'] else validate_summary(el)
    size = next((s for s in ['sm', 'md', 'lg'] if 'ds-rate--'+s in classes), None)
    if variant not in ['display', 'input'] or size is None:
        return False
    if sorted(classes) != sorted(['ds-rate', 'ds-rate--'+variant, 'ds-rate--'+size]) or el['tag'] != 'div':
        return False
    def nodes(root):
        yield root
        for child in root['children']:
            yield from nodes(child)
    if any('style' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in nodes(el)):
        return False
    px = {'sm':16, 'md':20, 'lg':24}[size]
    children = el['children']
    def star(img, on):
        return img['tag']=='img' and img['attrs'].get('class')=='ds-rate__star' and img['attrs'].get('src')=='../icons/icon-rate-'+('on' if on else 'off')+'-'+str(px)+'.svg' and img['attrs'].get('alt')=='' and not img['children']
    if variant == 'display':
        if el['attrs'].get('role')!='img' or not children or children[0]['tag']!='span' or children[0]['attrs'].get('class')!='ds-rate__stars' or children[0]['attrs'].get('aria-hidden')!='true':
            return False
        match = re.fullmatch(r'([0-5]) out of 5 stars(?:, (.+))?', el['attrs'].get('aria-label',''))
        if not match or len(children[0]['children'])!=5 or len(children)>2:
            return False
        value = int(match[1]); label = children[1] if len(children)==2 else None
        if label:
            if label['tag']!='span' or label['attrs'].get('class') not in ['ds-rate__label','ds-rate__label ds-rate__label--muted'] or label['children']:
                return False
            text = label.get('text','').strip()
            if text != (match[2] if match[2] else str(value)+'.0'):
                return False
        elif match[2]:
            return False
        return all(star(img, i<value) for i,img in enumerate(children[0]['children']))
    if size not in ['md','lg'] or 'data-rate-current' not in el['attrs'] or 'data-rate' not in el['attrs'] or not re.fullmatch('[0-5]', el['attrs'].get('data-value','')) or el['attrs'].get('aria-disabled')!='false' or len(children)!=3:
        return False
    value = int(el['attrs']['data-value']); group,output,clear = children
    if group['tag']!='div' or group['attrs'].get('class')!='ds-rate__control' or group['attrs'].get('role')!='radiogroup' or not group['attrs'].get('aria-label','').strip() or len(group['children'])!=5:
        return False
    if output['tag']!='span' or output['attrs'].get('class')!='ds-rate__label' or 'data-rate-output' not in output['attrs'] or output['children'] or clear['tag']!='button' or clear['attrs'].get('class')!='ds-rate__clear' or clear['attrs'].get('type')!='button' or clear['children'] or clear.get('text','').strip()!='Clear' or 'disabled' in clear['attrs']:
        return False
    try:
        labels = json.loads(el['attrs'].get('data-rate-labels','[]'))
    except (ValueError, TypeError):
        return False
    if not isinstance(labels,list) or len(labels) not in [0,5] or not all(isinstance(v,str) for v in labels):
        return False
    expected = (labels[value-1] if value and labels else '') or (str(value)+'.0' if value else '')
    if output.get('text','').strip()!=expected or ('hidden' in output['attrs'])!=(value==0 or 'data-rate-clear-only' in el['attrs']):
        return False
    for i,button in enumerate(group['children'],1):
        attrs=button['attrs']
        if button['tag']!='button' or attrs.get('class')!='ds-rate__star-button' or attrs.get('type')!='button' or attrs.get('role')!='radio' or attrs.get('data-value')!=str(i) or attrs.get('aria-label')!=str(i)+(' star' if i==1 else ' stars') or attrs.get('aria-checked')!=str(i==value).lower() or len(button['children'])!=1 or 'disabled' in attrs or not star(button['children'][0],i<=value):
            return False
    return True

def validate_summary(el):
    if el['tag']!='div' or el['attrs'].get('class')!='ds-rate ds-rate--summary' or 'data-rate-summary' not in el['attrs'] or 'data-rate-summary-ready' in el['attrs'] or len(el['children'])!=2:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('style' in n['attrs'] or 'id' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) or n['tag'] in ['button','a','input','select','textarea'] or 'tabindex' in n['attrs'] for n in nodes(el)):return False
    scorecard,distribution=el['children']
    if scorecard['tag']!='div' or scorecard['attrs'].get('class')!='ds-rate__score-card' or len(scorecard['children'])!=3:return False
    score,stars,total_node=scorecard['children']
    if score['tag']!='span' or score['attrs'].get('class')!='ds-rate__summary-score' or score['children'] or not re.fullmatch('[1-5]\.0',score.get('text','').strip()):return False
    value=int(score['text'].strip()[0])
    if stars['tag']!='span' or stars['attrs'].get('class')!='ds-rate__stars' or stars['attrs'].get('role')!='img' or stars['attrs'].get('aria-label')!=str(value)+' out of 5 stars' or len(stars['children'])!=5:return False
    for i,img in enumerate(stars['children']):
        if img['tag']!='img' or img['attrs']!={'class':'ds-rate__star','src':'../icons/icon-rate-'+('on' if i<value else 'off')+'-16.svg','alt':''} or img['children']:return False
    if total_node['tag']!='span' or total_node['attrs'].get('class')!='ds-rate__review-count' or total_node['children']:return False
    match=re.fullmatch('（([1-9][0-9]*) reviews）',total_node.get('text','').strip())
    if not match:return False
    total=int(match[1])
    if total>1000000 or el['attrs'].get('aria-label')!=f'Rating summary: {value}.0 out of 5 from {total} reviews':return False
    if distribution['tag']!='div' or distribution['attrs'].get('class')!='ds-rate__distribution' or distribution['attrs'].get('aria-label')!='Rating distribution' or len(distribution['children'])!=5:return False
    counts=[]
    for index,row in enumerate(distribution['children']):
        rating=5-index
        rating_label=f'{rating} star'+('s' if rating!=1 else '')
        if row['tag']!='div' or len(row['children'])!=3:return False
        label,progress,count=row['children']
        if label['tag']!='span' or label['attrs'] or label['children'] or label.get('text','')!=rating_label:return False
        if count['tag']!='span' or count['attrs'].get('class')!='ds-rate__distribution-count' or count['children'] or not re.fullmatch('0|[1-9][0-9]*',count.get('text','')):return False
        number=int(count['text']);counts.append(number)
        if number>total or row['attrs'].get('class')!='ds-rate__distribution-row'+(' ds-rate__distribution-row--available' if number else ''):return False
        if progress['tag']!='span' or progress['attrs']!={'class':'ds-rate__progress','role':'progressbar','aria-label':f'{rating_label}: {number} reviews','aria-valuemin':'0','aria-valuemax':str(total),'aria-valuenow':str(number)} or len(progress['children'])!=1:return False
        fill=progress['children'][0]
        if fill['tag']!='span' or fill['attrs']!={'class':'ds-rate__progress-fill'} or fill['children'] or fill.get('text','').strip():return False
    return sum(counts)==total and sum((5-i)*count for i,count in enumerate(counts))==value*total

def validate_summary_current(el):
    try:
        counts=json.loads(el['attrs'].get('data-rate-summary-counts',''))
    except Exception:return False
    if el['tag']!='div' or el['attrs'].get('class')!='ds-rate ds-rate--summary' or not isinstance(counts,list) or len(counts)!=5 or any(type(n)!=int or n<0 or n>1000000 for n in counts) or len(el['children'])!=2:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    all_nodes=list(nodes(el))
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) or n['tag'] in ['script','svg','iframe','input','a','textarea','select'] for n in all_nodes):return False
    ids=[n['attrs']['id'] for n in all_nodes if 'id' in n['attrs']]
    if len(ids)!=5 or len(set(ids))!=5:return False
    card,distribution=el['children']
    if card['attrs'].get('class')!='ds-rate__score-card' or len(card['children'])!=3 or distribution['attrs'].get('class')!='ds-rate__distribution' or len(distribution['children'])!=5:return False
    score,stars,total_node=card['children']
    total=sum(counts);derived=sum((5-i)*n for i,n in enumerate(counts))/total if total else 0
    if score['attrs'].get('class')!='ds-rate__summary-score' or not re.fullmatch(r'[0-5]\.[0-9]',score.get('text','').strip()) or abs(float(score['text'])-derived)>.051:return False
    if total_node.get('text','').strip()!=f'({total} reviews)' or stars['attrs'].get('role')!='img' or len(stars['children'])!=5:return False
    if stars['attrs'].get('aria-label')!=score['text'].strip()+' out of 5 stars':return False
    for star in stars['children']:
        if star['attrs'].get('class')!='ds-rate__summary-star' or len(star['children'])!=2:return False
        off,fill=star['children']
        if off['tag']!='img' or off['attrs']!={'class':'ds-rate__star','src':'../icons/icon-rate-off-16.svg','alt':''} or fill['attrs'].get('class')!='ds-rate__summary-star-fill' or len(fill['children'])!=1:return False
        on=fill['children'][0]
        if on['tag']!='img' or on['attrs']!={'class':'ds-rate__star','src':'../icons/icon-rate-on-16.svg','alt':''}:return False
    for i,row in enumerate(distribution['children']):
        rating=5-i
        if row['tag']!='button' or row['attrs'].get('class')!='ds-rate__distribution-row' or row['attrs'].get('type')!='button' or row['attrs'].get('value')!=str(rating) or row['attrs'].get('aria-pressed')!='false' or len(row['children'])!=4 or ('disabled' in row['attrs'])!=(counts[i]==0):return False
        label,progress,count,tooltip=row['children']
        if label['attrs'].get('class')!='ds-rate__distribution-label' or progress['attrs'].get('class')!='ds-rate__progress' or progress['attrs'].get('role')!='progressbar' or progress['attrs'].get('aria-valuenow')!=str(counts[i]) or progress['attrs'].get('aria-valuemax')!=str(max(1,total)) or len(progress['children'])!=1:return False
        if progress['children'][0]['attrs'].get('class')!='ds-rate__progress-fill' or count['attrs'].get('class')!='ds-rate__distribution-count' or count.get('text','').strip()!=str(counts[i]):return False
        if tooltip['attrs'].get('role')!='tooltip' or 'hidden' not in tooltip['attrs'] or tooltip['attrs'].get('id')!=row['attrs'].get('aria-describedby'):return False
    return True
