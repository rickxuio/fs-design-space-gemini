"""Only the existing default S/L rectangular duration specimens are callable."""
import re

def validate_video(el, name):
    classes=el['attrs'].get('class','').split()
    if 'ds-video-btn' not in classes:
        return True
    variant=name.split('::')[0]
    size=next((s for s in ['s','l'] if 'ds-video-btn--'+s in classes),None)
    children=el['children']
    if variant not in ['dark','light'] or size is None or sorted(classes)!=sorted(['ds-video-btn','ds-video-btn--'+variant,'ds-video-btn--'+size]) or el['tag']!='button' or el['attrs'].get('type')!='button' or not el['attrs'].get('aria-label','').strip() or len(children)!=2:
        return False
    icon,text=children
    return icon['tag']=='img' and icon['attrs'].get('class')=='ds-video-btn__icon' and icon['attrs'].get('src')=='../icons/icon-play.svg' and icon['attrs'].get('alt')=='' and not icon['children'] and text['tag']=='span' and text['attrs'].get('class')=='ds-video-btn__text' and not text['children'] and bool(re.fullmatch(r'[0-9]+:[0-5][0-9]',text.get('text','').strip())) and not any('style' in n['attrs'] or 'id' in n['attrs'] or 'disabled' in n['attrs'] or any(k.lower().startswith('on') for k in n['attrs']) for n in [el,icon,text])
