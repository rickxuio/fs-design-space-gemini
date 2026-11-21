#!/usr/bin/env python3
"""Inspect authored reference examples using the standard HTML parser.
Supports tag, id, class, attribute and descendant selectors used by this contract.
Rejects unsupported selector syntax instead of silently accepting it.
"""
import json, re, sys
from html.parser import HTMLParser
from component_reference_rate import validate_rate
from component_reference_video import validate_video
from component_reference_stepper import validate_stepper
from component_reference_collapse import validate_collapse
from component_reference_icon_card import validate_icon_card
from component_reference_menu import validate_menu
from component_reference_tab import validate_tab
from component_reference_list import validate_list
from component_reference_option_selector import validate_option_selector
from component_reference_table import validate_table
from component_reference_carousel import validate_carousel
from component_reference_comment import validate_comment
from component_reference_card import validate_card
from component_reference_banner import validate_banner
from component_reference_breadcrumb import validate_breadcrumb
from component_reference_dropdown import validate_dropdown
from component_reference_form import validate_form
from component_reference_tag import validate_tag
from component_reference_dialog import validate_dialog
from component_reference_input import validate_input
from component_reference_cart import validate_cart
class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.source=source; self.root={'tag':'root','attrs':{},'children':[]}; self.stack=[self.root]
        self.lines=[0]
        for m in re.finditer('\n',source): self.lines.append(m.end())
    def source_position(self):
        line,col=self.getpos(); return self.lines[line-1]+col
    def handle_starttag(self, tag, attrs):
        node={'tag':tag,'attrs':dict(attrs),'children':[],'text':'','start':self.source_position(),'end':self.source_position()+len(self.get_starttag_text())}
        self.stack[-1]['children'].append(node)
        if tag not in ['img','input','br','hr','meta','link','source','wbr','area','base','embed','param','track','col']:self.stack.append(node)
    def handle_data(self,data):
        self.stack[-1]['text']=self.stack[-1].get('text','')+data
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i]['tag']==tag:
                self.stack[i]['end']=self.source.find('>',self.source_position())+1
                self.stack=self.stack[:i];break

def descendants(node):
    for c in node['children']:
        yield c;yield from descendants(c)
def matches(node, selector):
    attrs=re.findall(r'\[([\w-]+)(?:="([^"]*)")?\]',selector)
    plain=re.sub(r'\[[^\]]+\]','',selector)
    if not re.fullmatch(r'(?:[\w-]+)?(?:[.#][\w-]+)*',plain):raise ValueError('Unsupported selector: '+selector)
    tag=re.match(r'^[\w-]+',plain)
    if tag and node['tag']!=tag[0]:return False
    for op,value in re.findall(r'([.#])([\w-]+)',plain):
        if op=='#' and node['attrs'].get('id')!=value:return False
        if op=='.' and value not in (node['attrs'].get('class') or '').split():return False
    for name,value in attrs:
        if name not in node['attrs'] or (value and node['attrs'][name]!=value):return False
    return True

def query_all(root,selector):
    if selector==':scope':return [root]
    parts=re.findall(r'(?:\[[^\]]*\]|[^\s])+',selector)
    current=[root]
    for part in parts:current=[n for parent in current for n in descendants(parent) if matches(n,part)]
    return list({id(n):n for n in current}.values())

def query(root,selector):
    current=query_all(root,selector)
    return current[0] if current else None
payload=json.load(sys.stdin);p=Parser(payload['html']);p.feed(payload['html']);result={}
for name,v in payload['variants'].items():
    examples=query_all(p.root,v['exampleSelector'])
    el=examples[0] if examples else None
    if not el:result[name]={'found':False,'matchCount':0};continue
    missing=[s for s in v['required'] if not query(el,s)]
    slots=[]
    for key,d in v['slots'].items():
        target=query(el,d['selector'])
        if d.get('required') and len(query_all(el,d['selector']))!=1:slots.append(key)
        for s in d.get('preserve',[]):
            if target is None or query(target,s) is None:missing.append(s)
    title_selector=v.get('slots',{}).get('title',{}).get('selector')
    title=query(el,title_selector) if title_selector else None
    inputs=query_all(el,'input.ds-input-field__input')
    labels=query_all(el,'label.ds-input-field__label')
    errors=query_all(el,'.ds-input-field__error')
    input_identity=validate_input(el,name,query_all,p.root) if 'data-input-current' in el['attrs'] else False
    anchor_identity=True
    if 'ds-anchor-nav' in el['attrs'].get('class','').split():
        inners=query_all(el,'div.ds-anchor-nav__inner');groups=query_all(el,'div.ds-anchor-nav__tabs');actions=query_all(el,'div.ds-anchor-nav__action');tabs=query_all(el,'div.ds-anchor-nav__tab');buttons=query_all(el,'button.ds-btn')
        anchor_identity=el['tag']=='div' and el['attrs'].get('class')=='ds-anchor-nav' and 'data-anchor-group' in el['attrs'] and 'data-anchor-current' in el['attrs'] and 'data-anchor-nav-ready' not in el['attrs'] and len(inners)==len(groups)==len(actions)==len(buttons)==1 and el['children']==inners and inners[0]['children']==[groups[0],actions[0]] and groups[0]['children']==tabs and len(tabs)>=2
        if anchor_identity:
            anchor_identity=sum('ds-anchor-nav__tab--active' in n['attrs'].get('class','').split() for n in tabs)==1 and actions[0]['children']==buttons
            for tab in tabs:anchor_identity=anchor_identity and 'data-anchor-tab' in tab['attrs'] and not tab['children'] and bool(tab.get('text','').strip()) and set(tab['attrs'].get('class','').split()).issubset({'ds-anchor-nav__tab','ds-anchor-nav__tab--active'})
            button=buttons[0];texts=query_all(button,'span.ds-btn__text')
            anchor_identity=anchor_identity and sorted(button['attrs'].get('class','').split())==sorted(['ds-btn','ds-btn--filled-red','ds-btn--xl-regular']) and button['attrs'].get('type')=='button' and len(texts)==1 and button['children']==texts and not texts[0]['children'] and not any('style' in n['attrs'] or 'onclick' in n['attrs'] for n in [el,*descendants(el)])
    breadcrumb_identity=validate_breadcrumb(el,name) if any(c in el['attrs'].get('class','').split() for c in ['ds-breadcrumb','ds-breadcrumb-source-full-width']) else True
    if 'ds-breadcrumb' in el['attrs'].get('class','').split():
        breadcrumb_identity=breadcrumb_identity and 'data-breadcrumb-current' in el['attrs'] and all(n['attrs'].get('aria-hidden')=='true' for n in descendants(el) if n['attrs'].get('class')=='ds-breadcrumb__separator')
    badge_identity=True
    if name in ['dot','count','icon'] and any(cls.startswith('ds-badge') for cls in el['attrs'].get('class','').split()):
        expected={'dot':'ds-badge-status','count':'ds-badge-count'+(' ds-badge-count--max' if el.get('text','').strip()=='99+' else ''),'icon':'ds-badge-icon'}[name]
        badge_identity=el['tag']=='span' and el['attrs'].get('class')==expected and not any(k in el['attrs'] for k in ['style','onclick','role','tabindex']) and not any('style' in n['attrs'] for n in descendants(el))
        if name=='count':badge_identity=badge_identity and 'data-badge-current' in el['attrs'] and not el['children'] and bool(re.fullmatch(r'(?:0|[1-9][0-9]?|99\+)',el.get('text','').strip()))
        elif name=='icon':badge_identity=badge_identity and len(el['children'])==1 and el['children'][0]['tag']=='img' and el['children'][0]['attrs'].get('src')=='../icons/icon-badge-logged-in-pc.svg' and 'alt' in el['children'][0]['attrs']
        else:
            children=el['children'];badge_identity=badge_identity and len(children)==2 and children[0]['tag']=='span' and children[0]['attrs'].get('class')=='ds-badge-dot ds-badge-dot--success' and not children[0]['children'] and children[1]['tag']=='span' and children[1]['attrs'].get('class')=='ds-badge-status__text' and not children[1]['children']
    radio_identity=True
    if 'ds-radio' in (el['attrs'].get('class') or '').split():
        suffix={'regular-lg':None,'regular-sm':'ds-radio--sm','bordered-compact':'ds-radio--bordered-compact','bordered-detail':'ds-radio--bordered-detail'}.get(name)
        expected=['ds-radio']+([suffix] if suffix else [])
        fields=query_all(el,'input.ds-radio__input');indicators=query_all(el,'span.ds-radio__indicator');contents=query_all(el,'span.ds-radio__content');labels=query_all(el,'span.ds-radio__label');descriptions=query_all(el,'span.ds-radio__description')
        radio_identity=el['tag']=='label' and sorted(el['attrs'].get('class','').split())==sorted(expected) and len(fields)==len(indicators)==len(contents)==len(labels)==1 and el['children']==[fields[0],indicators[0],contents[0]]
        radio_identity=radio_identity and (el['attrs'].get('data-radio-source-default14')=='official' and 'data-radio-source-default18' not in el['attrs'] if name!='regular-lg' else el['attrs'].get('data-radio-source-default18')=='official' and 'data-radio-source-default14' not in el['attrs'])
        if radio_identity:
            field=fields[0]['attrs'];radio_identity=field.get('type')=='radio' and bool(field.get('name','').strip()) and bool(field.get('value','').strip()) and not any(k in field for k in ['checked','disabled','style','onclick']) and indicators[0]['attrs'].get('aria-hidden')=='true' and not indicators[0]['children'] and not labels[0]['children']
            if name=='bordered-detail':radio_identity=radio_identity and len(descriptions)==1 and contents[0]['children']==[labels[0],descriptions[0]] and not descriptions[0]['children']
            else:radio_identity=radio_identity and not descriptions and contents[0]['children']==[labels[0]]
            radio_identity=radio_identity and not any(k in el['attrs'] for k in ['for','style','role','onclick','tabindex']) and not any('style' in n['attrs'] for n in descendants(el))
    number_identity=True
    if 'ds-input-number' in (el['attrs'].get('class') or '').split():
        expected=['ds-input-number','ds-input-number--filled' if name=='filled-lg' else 'ds-input-number--outline']+(['ds-input-number--sm'] if name=='outline-sm' else [])
        decrements=query_all(el,'button[data-input-number-decrement]');increments=query_all(el,'button[data-input-number-increment]');fields=query_all(el,'input.ds-input-number__input')
        number_identity=el['tag']=='div' and sorted((el['attrs'].get('class') or '').split())==sorted(expected) and 'data-input-number' in el['attrs'] and len(decrements)==1 and len(fields)==1 and len(increments)==1 and el['children']==[decrements[0],fields[0],increments[0]]
        if number_identity:
            field=fields[0]['attrs'];values=[el['attrs'].get('data-min',''),el['attrs'].get('data-max',''),el['attrs'].get('data-step','1'),field.get('value','')]
            number_identity=all(re.fullmatch(r'[1-9][0-9]*',v) and int(v)<=9007199254740991 for v in values)
            if number_identity:number_identity=int(values[0])<=int(values[3])<=int(values[1])
            number_identity=number_identity and field.get('type')=='text' and bool(field.get('aria-label','').strip()) and not any(k in field for k in ['disabled','readonly','style'])
            for button,classes in [(decrements[0],['ds-input-number__button','ds-input-number__button--decrement']),(increments[0],['ds-input-number__button','ds-input-number__button--increment'])]:
                number_identity=number_identity and sorted(button['attrs'].get('class','').split())==sorted(classes) and button['attrs'].get('type')=='button' and not button['children'] and not any(k in button['attrs'] for k in ['disabled','onclick','style'])
            number_identity=number_identity and 'data-input-number-current' in el['attrs'] and not any(k in el['attrs'] for k in ['style','data-input-number-ready'])
    tag_identity=validate_tag(el,name)
    checkbox_identity=True
    if 'ds-checkbox' in (el['attrs'].get('class') or '').split():
        classes=(el['attrs'].get('class') or '').split()
        expected=['ds-checkbox']+(['ds-checkbox--sm'] if name=='sm' else [])
        children=el['children']
        checkbox_identity=el['tag']=='label' and sorted(classes)==sorted(expected) and len(children)==3 and all(k in el['attrs'] for k in ['data-checkbox-current','data-checkbox-control'])
        if checkbox_identity:
            field=children[0]['attrs']
            checkbox_identity=children[0]['tag']=='input' and field.get('class')=='ds-checkbox__input' and field.get('type')=='checkbox' and bool(field.get('name','').strip()) and bool(field.get('value','').strip()) and not any(k in field for k in ['checked','disabled','data-checkbox-initial-mixed','aria-checked','onclick','style'])
            checkbox_identity=checkbox_identity and children[1]['tag']=='span' and children[1]['attrs'].get('class')=='ds-checkbox__box' and children[1]['attrs'].get('aria-hidden')=='true' and not children[1]['children']
            checkbox_identity=checkbox_identity and children[2]['tag']=='span' and children[2]['attrs'].get('class')=='ds-checkbox__label' and not children[2]['children']
        checkbox_identity=checkbox_identity and len(query_all(el,'input'))==1 and not any(query(el,s) for s in ['svg','button'])
        checkbox_identity=checkbox_identity and not any(k in el['attrs'] for k in ['for','role','tabindex','aria-checked','onclick','style']) and not any('style' in n['attrs'] for n in descendants(el))
    select_identity=True
    if 'ds-select' in (el['attrs'].get('class') or '').split():
        triggers=query_all(el,'.ds-select__trigger');panels=query_all(el,'.ds-select__panel');options=query_all(el,'.ds-select__option')
        select_identity=len(triggers)==1 and len(panels)==1 and bool(options) and bool(el['attrs'].get('id'))
        if select_identity:
            t=triggers[0]['attrs'];panel=panels[0]['attrs']
            select_identity=t.get('type')=='button' and t.get('role')=='combobox' and t.get('aria-expanded')=='false' and t.get('aria-controls')==panel.get('id') and panel.get('role')=='listbox' and panel.get('aria-labelledby')==t.get('id') and 'hidden' in panel and 'ds-select--open' not in el['attrs'].get('class','').split()
            semantics=v.get('runtimeSemantics',{})
            mode=semantics.get('mode');confirmation=semantics.get('confirmation')
            select_identity=select_identity and mode in ['single','multiple'] and type(confirmation) is bool and el['attrs'].get('data-select-mode')==mode and ('data-select-confirm' in el['attrs'])==confirmation
            if mode=='multiple':select_identity=select_identity and panel.get('aria-multiselectable')=='true'
            else:select_identity=select_identity and panel.get('aria-multiselectable') in [None,'false'] and sum(n['attrs'].get('aria-selected')=='true' for n in options)<=1
            if confirmation:select_identity=select_identity and mode=='multiple' and bool(query(el,'[data-select-cancel]')) and bool(query(el,'[data-select-close]'))
            for node in [el,triggers[0],panels[0],*options]:
                ident=node['attrs'].get('id','')
                select_identity=select_identity and bool(ident) and len(query_all(p.root,'[id="'+ident+'"]'))==1
            for option in options:
                a=option['attrs'];select_identity=select_identity and a.get('role')=='option' and a.get('aria-selected') in ['true','false'] and len(query_all(option,'.ds-select__option-label'))==1
                for marker in ['.ds-select__radio','.ds-select__check','.ds-checkbox--sm','.ds-checkbox__box']:
                    if marker in v['required']:select_identity=select_identity and bool(query(option,marker))
                if '.ds-checkbox--sm' in v['required']:
                    atoms=query_all(option,'.ds-checkbox')
                    complete=len(atoms)==1
                    if complete:
                        atom=atoms[0];children=atom['children'];classes=atom['attrs'].get('class','').split()
                        complete='data-checkbox-current' in atom['attrs'] and 'data-checkbox-control' not in atom['attrs'] and atom['tag']=='label' and set(classes)<=set(['ds-checkbox','ds-checkbox--sm','ds-checkbox--checked','ds-checkbox--disabled']) and len(children)==2
                        complete=complete and children[0]['tag']=='span' and children[0]['attrs'].get('class')=='ds-checkbox__box' and not children[0]['children']
                        complete=complete and children[1]['tag']=='span' and set(children[1]['attrs'].get('class','').split())==set(['ds-checkbox__label','ds-select__option-label']) and not children[1]['children']
                        complete=complete and not any(k in atom['attrs'] for k in ['for','role','tabindex','aria-checked','onclick','style']) and not any(query(atom,s) for s in ['input','button','svg'])
                        complete=complete and not any('style' in child['attrs'] or any(k.startswith('on') for k in child['attrs']) for child in children)
                        complete=complete and ('ds-checkbox--checked' in classes)==(a.get('aria-selected')=='true') and ('ds-checkbox--disabled' in classes)==(a.get('aria-disabled')=='true')
                    select_identity=select_identity and complete
    result[name]={'found':True,'matchCount':len(examples),'tag':el['tag'],'attrs':el['attrs'],'classes':(el['attrs'].get('class') or '').split(),'html':p.source[el['start']:el['end']],'missingRequired':missing,'missingSlots':slots,'dialogIdentity':validate_dialog(el,name,query_all,p.root),'inputIdentity':input_identity,'rateIdentity':validate_rate(el,name),'videoIdentity':validate_video(el,name),'stepperIdentity':validate_stepper(el,name),'collapseIdentity':validate_collapse(el,name,query_all,p.root),'iconCardIdentity':validate_icon_card(el,name),'menuIdentity':validate_menu(el,name,query_all,p.root),'tabIdentity':validate_tab(el,name),'listIdentity':validate_list(el,name),'optionIdentity':validate_option_selector(el,name),'tableIdentity':validate_table(el,name),'tableBodyRowCount':sum(len([row for row in body['children'] if row['tag']=='tr']) for body in query_all(el,'tbody')),'carouselIdentity':validate_carousel(el,name),'commentIdentity':validate_comment(el,name,query_all,p.root),'cartIdentity':validate_cart(el),'cardIdentity':validate_card(el,name),'bannerIdentity':validate_banner(el,name),'dropdownIdentity':validate_dropdown(el,name,query_all,p.root),'formIdentity':validate_form(el,name,query_all,p.root),'anchorIdentity':bool(anchor_identity),'breadcrumbIdentity':bool(breadcrumb_identity),'badgeIdentity':bool(badge_identity),'radioIdentity':bool(radio_identity),'numberIdentity':bool(number_identity),'tagIdentity':bool(tag_identity),'checkboxIdentity':bool(checkbox_identity),'selectIdentity':bool(select_identity),'titleIdentity':not el['attrs'].get('aria-labelledby') or (title is not None and el['attrs'].get('aria-labelledby')==title['attrs'].get('id'))}
json.dump(result,sys.stdout)
