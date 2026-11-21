"""Finite dark homepage and light five-slide scaffold; demo bodies are page content."""
def validate_carousel(el,name):
    if name == 'external-cards':
        a=el['attrs']
        if el['tag']!='div' or a.get('class')!='ds-carousel-external' or a.get('data-carousel-external')!='v1' or a.get('data-rail')!='external-cards' or a.get('data-carousel-columns')!='3' or a.get('role')!='region' or not a.get('aria-label') or len(el['children'])!=5:return False
        viewport,prev,next_button,dots,status=el['children']
        if viewport['attrs'].get('class')!='ds-carousel-external__viewport' or len(viewport['children'])!=1:return False
        track=viewport['children'][0]
        if track['attrs'].get('class')!='ds-carousel-external__track rail-track' or len(track['children'])!=4:return False
        for wrapper in track['children']:
            if wrapper['attrs'].get('class')!='ds-carousel-external__item' or len(wrapper['children'])!=1 or 'ds-card' not in wrapper['children'][0]['attrs'].get('class','').split():return False
        for wrapper,side in [(prev,'left'),(next_button,'right')]:
            if len(wrapper['children'])!=1 or not validate_carousel(wrapper['children'][0],'navigation.solid-xl.'+side):return False
        return dots['attrs'].get('class')=='ds-carousel-external__pagination' and status['attrs'].get('class')=='ds-carousel-external__status'
    if name in ['navigation.outlined-m.left','navigation.outlined-m.right','navigation.solid-xl.left','navigation.solid-xl.right']:
        side=name.rsplit('.',1)[1]
        a=el['attrs']
        solid=name.startswith('navigation.solid-xl.')
        css='ds-carousel__btn ds-carousel__btn--xl' if solid else 'ds-carousel__btn ds-carousel__btn--outlined-m'
        marker='data-carousel-source-solid48' if solid else 'data-carousel-source-outline28'
        asset='solid48' if solid else 'outline28'
        if el['tag']!='button' or a.get('class')!=css or a.get(marker)!=side+'-default' or a.get('type')!='button' or not a.get('aria-label','').strip() or len(el['children'])!=1 or any(k in a for k in ['style','id','disabled','aria-disabled']) or any(k.startswith('on') for k in a):return False
        img=el['children'][0]
        return img['tag']=='img' and img['attrs']=={'src':'../icons/icon-carousel-'+asset+'-'+side+'-current.svg','alt':''}
    if 'ds-carousel' not in el['attrs'].get('class','').split():return True
    light=name=='light'
    if name not in ['dark','light'] or el['tag']!='div' or el['attrs'].get('class')!=('ds-carousel' if light else 'ds-carousel ds-carousel--homepage-banner') or el['attrs'].get('data-carousel-current')!=('light-five' if light else '') or 'data-carousel-ready' in el['attrs'] or not el['attrs'].get('aria-label','').strip() or len(el['children'])!=(3 if light else 4):return False
    def nodes(n):
        yield n
        for child in n['children']:yield from nodes(child)
    if any('id' in n['attrs'] or 'style' in n['attrs'] or any(k.startswith('on') for k in n['attrs']) for n in nodes(el)):return False
    track,prev,next_button=el['children'][:3]
    if track['tag']!='div' or track['attrs'].get('class')!='ds-carousel__track' or len(track['children'])!=(5 if light else 7):return False
    for slide in track['children']:
        if slide['tag']!='div' or slide['attrs'].get('class')!='ds-carousel__slide' or not slide['children'] or 'aria-hidden' in slide['attrs']:return False
        if any(n['tag'] in ['a','button','input','select','textarea','iframe','video','audio'] or 'tabindex' in n['attrs'] or 'contenteditable' in n['attrs'] for n in nodes(slide)):return False
    for control,direction in [(prev,'prev'),(next_button,'next')]:
        expected='ds-carousel__btn ds-carousel__btn--l ds-carousel__btn--overlay ds-carousel__btn--' if light else 'ds-carousel__btn ds-carousel__btn--xl ds-carousel__btn--dark ds-carousel__btn--overlay ds-carousel__btn--'
        if control['tag']!='button' or control['attrs'].get('class')!=expected+direction or control['attrs'].get('type')!='button' or not control['attrs'].get('aria-label','').strip() or ('disabled' in control['attrs'])!=(direction=='prev') or len(control['children'])!=1:return False
        img=control['children'][0]
        if img['tag']!='img' or img['attrs'].get('src')!='../icons/icon-carousel-'+direction+'.svg' or img['attrs'].get('alt')!='':return False
    if light:return True
    dots=el['children'][3]
    if dots['tag']!='div' or dots['attrs'].get('class')!='ds-carousel__dots ds-carousel__dots--dark' or len(dots['children'])!=7:return False
    for i,dot in enumerate(dots['children']):
        if dot['tag']!='button' or dot['attrs'].get('class')!='ds-carousel__dot'+(' ds-carousel__dot--active' if i==0 else '') or dot['attrs'].get('type')!='button' or dot['attrs'].get('data-index')!=str(i) or dot['attrs'].get('aria-current')!=('true' if i==0 else None) or not dot['attrs'].get('aria-label','').strip() or dot['children']:return False
    return True
