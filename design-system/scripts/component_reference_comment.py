"""Unanswered QA with complete composer and unique linked identity."""
import re
def validate_comment(el,name,query_all,document):
    if 'data-comment-call' in el['attrs']:return validate_current(el,name,query_all,document)
    if 'ds-comment' not in el['attrs'].get('class','').split():return True
    if el['attrs'].get('data-comment-current')!='qa-empty':return False
    if name!='qa-thread' or el['tag']!='article' or el['attrs'].get('class')!='ds-comment ds-comment--qa-thread' or len(el['children'])!=3:return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    question,empty,panel=el['children']
    if question['tag']!='div' or question['attrs'].get('class')!='ds-comment__question' or len(question['children'])!=2:return False
    marker,body=question['children']
    if marker['tag']!='span' or marker['attrs'].get('class')!='ds-comment__marker' or marker.get('text','').strip()!='Q:' or marker['children'] or body['tag']!='div' or body['attrs'].get('class')!='ds-comment__body' or len(body['children'])!=2:return False
    title,meta=body['children']
    for n,tag,cls in [(title,'h3','ds-comment__title'),(meta,'p','ds-comment__meta')]:
        if n['tag']!=tag or n['attrs'].get('class')!=cls or n['children'] or not n.get('text','').strip():return False
    if empty['tag']!='div' or empty['attrs'].get('class')!='ds-comment__empty-answer' or len(empty['children'])!=1:return False
    prompt=empty['children'][0]
    if prompt['tag']!='p' or prompt['attrs'].get('class')!='ds-comment__empty-copy' or len(prompt['children'])!=1 or not prompt.get('text','').strip():return False
    trigger=prompt['children'][0];panel_id=panel['attrs'].get('id','')
    if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*',panel_id) or len(query_all(document,'#'+panel_id))!=1 or len(query_all(document,'[aria-controls="'+panel_id+'"]'))!=1:return False
    if trigger['tag']!='button' or trigger['attrs'].get('class')!='ds-comment__inline-action' or trigger['attrs'].get('type')!='button' or trigger['attrs'].get('data-comment-action')!='answer' or trigger['attrs'].get('aria-expanded')!='false' or trigger['attrs'].get('aria-controls')!=panel_id or trigger['children'] or not trigger.get('text','').strip():return False
    if panel['tag']!='div' or panel['attrs'].get('class')!='ds-comment__answer-composer' or 'hidden' not in panel['attrs'] or len(panel['children'])!=1:return False
    if any('id' in n['attrs'] and n is not panel for n in nodes(el)):return False
    form=panel['children'][0]
    if form['tag']!='form' or form['attrs'].get('class')!='ds-comment__composer' or 'data-comment-composer' not in form['attrs'] or form['attrs'].get('data-composer-type')!='answer' or len(form['children'])!=2 or any(k in form['attrs'] for k in ['action','method','target']):return False
    field,actions=form['children']
    if field['tag']!='textarea' or field['attrs'].get('class')!='ds-comment__textarea' or not field['attrs'].get('aria-label','').strip() or not field['attrs'].get('placeholder','').strip() or field['children'] or field.get('text','').strip() or 'disabled' in field['attrs']:return False
    if actions['tag']!='div' or actions['attrs'].get('class')!='ds-comment__composer-actions' or len(actions['children'])!=2:return False
    cancel,submit=actions['children']
    if cancel['tag']!='button' or cancel['attrs'].get('class')!='ds-comment__cancel' or cancel['attrs'].get('type')!='button' or 'data-comment-cancel' not in cancel['attrs'] or cancel['children'] or not cancel.get('text','').strip():return False
    if submit['tag']!='button' or submit['attrs'].get('class')!='ds-btn ds-btn--filled-red ds-btn--l' or submit['attrs'].get('type')!='submit' or len(submit['children'])!=1:return False
    label=submit['children'][0]
    return label['tag']=='span' and label['attrs'].get('class')=='ds-btn__text' and not label['children'] and bool(label.get('text','').strip())

def validate_current(el,name,query_all,document):
    tags={'qa-thread':'article','qa-unanswered':'article','review-thread':'article','rating-summary':'section','customer-gallery':'dialog'}
    if name not in tags or el['tag']!=tags[name] or el['attrs'].get('data-comment-call')!=name or any(k in el['attrs'] for k in ['open','inert','hidden']):return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    all_nodes=list(nodes(el))
    if any('style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) or n['tag'] in ['svg','script','iframe','object'] for n in all_nodes):return False
    for n in all_nodes:
        ident=n['attrs'].get('id')
        if ident and (not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*',ident) or len(query_all(document,'#'+ident))!=1):return False
    if name.startswith('qa'):
        if len(query_all(el,'.ds-comment__question'))!=1 or len(query_all(el,'.ds-comment__title'))!=1:return False
        if name=='qa-unanswered':return len(el['children'])==2 and not query_all(el,'form') and len(query_all(el,'button[data-comment-action="answer"]'))==1
        answers=query_all(el,'.ds-comment__answer')
        if len(answers)!=1 or 'hidden' in answers[0]['attrs'] or not query_all(answers[0],'.ds-comment__text'):return False
    if name in ['qa-thread','review-thread']:
        triggers=query_all(el,'button[data-comment-action="comment"]');panels=query_all(el,'.ds-comment__comments');forms=query_all(el,'form[data-comment-composer]')
        if len(triggers)!=1 or len(panels)!=1 or len(forms)!=1 or 'hidden' not in panels[0]['attrs'] or triggers[0]['attrs'].get('aria-controls')!=panels[0]['attrs'].get('id') or triggers[0]['attrs'].get('aria-expanded')!='false':return False
        fields=query_all(forms[0],'textarea');buttons=query_all(forms[0],'button.ds-btn');cancel=query_all(forms[0],'a[data-comment-cancel]')
        if len(fields)!=1 or 'required' not in fields[0]['attrs'] or len(buttons)!=1 or buttons[0]['attrs'].get('class')!='ds-btn ds-btn--filled-red ds-btn--l' or buttons[0]['attrs'].get('type')!='submit' or len(cancel)!=1:return False
        if any(k in forms[0]['attrs'] for k in ['action','method','target']):return False
    if name in ['review-thread','customer-gallery']:
        ratings=query_all(el,'.ds-rate')
        if len(ratings)!=1 or len(query_all(ratings[0],'img.ds-rate__star'))!=5 or not query_all(ratings[0],'.ds-rate__label'):return False
    if name=='rating-summary':
        import json
        try: counts=json.loads(el['attrs'].get('data-comment-rating-counts',''))
        except Exception:return False
        if not isinstance(counts,list) or len(counts)!=5 or any(type(n)!=int or n<0 or n>1000000 for n in counts):return False
        from component_reference_rate import validate_summary_current
        rates=query_all(el,'.ds-rate[data-rate-summary-current]')
        return len(rates)==1 and validate_summary_current(rates[0]) and rates[0]['attrs'].get('data-rate-summary-counts')==el['attrs'].get('data-comment-rating-counts') and len(query_all(el,'button.ds-tag'))>0 and not query_all(el,'[data-tag-current]')
    if name=='customer-gallery':
        if not el['attrs'].get('id') or not el['attrs'].get('aria-label'):return False
        grid=query_all(el,'[data-gallery-view="grid"]');detail=query_all(el,'[data-gallery-view="detail"]')
        if len(grid)!=1 or len(detail)!=1 or 'hidden' not in detail[0]['attrs']:return False
        count=len(query_all(grid[0],'button[data-gallery-item]'))
        if not 1<=count<=24 or len(query_all(detail[0],'.ds-comment__gallery-slide'))!=count or len(query_all(detail[0],'[data-gallery-thumb]'))!=count:return False
        if len(query_all(el,'button[data-comment-gallery-close].ds-icon-btn--l'))!=2:return False
    return True
