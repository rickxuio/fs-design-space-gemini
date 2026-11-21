"""Import the two native MasterGo SVG downloads without changing drawing bytes.

Run from the repository root after the recorded native exports exist.
"""
import hashlib
import json
import re
import shutil
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).resolve().parent
OUTPUT = ROOT / 'components/icons/mastergo-library'
FILE_ID = '143880409387753'
PAGE_ID = '3752:3996'
PENDING_DUPLICATES = set()


class TreeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.roots = []

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs, True)

    def handle_starttag(self, tag, attrs, closed=False):
        node = {'tag': tag, 'attrs': dict(attrs), 'children': []}
        if self.stack:
            self.stack[-1]['children'].append(node)
        else:
            self.roots.append(node)
        if not closed and tag not in ('img', 'br', 'hr', 'input', 'meta', 'link'):
            self.stack.append(node)

    def handle_endtag(self, tag):
        if self.stack:
            self.stack.pop()


def ids(node):
    result = {node['attrs'].get('data-node-id')}
    for child in node['children']:
        result |= ids(child)
    return result - {None}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save_json(file, value):
    file.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def source_style_size(style):
    return {key: float(m.group(1)) for key in ('width', 'height')
            if (m := re.search(r'(?:^|;)\s*' + key + r':\s*([\d.]+)px', style))}


def record(node, category, name, original, family=None, variants=None, order=None):
    a = node['attrs']
    node_id = a['data-node-id']
    if not original.is_file():
        raise ValueError(f'Missing native export: {node_id}: {original}')
    data = original.read_bytes()
    svg = ET.fromstring(data)
    if svg.tag.split('}')[-1] != 'svg':
        raise ValueError(f'Not SVG: {original}')
    canvas = {key: float(svg.attrib[key]) for key in ('width', 'height')}
    source_size = source_style_size(a.get('style', ''))
    bounds_difference = {key: {'node': size, 'svg': canvas[key]}
                         for key, size in source_size.items()
                         if abs(size - canvas[key]) > 0.02}
    # The native exporter includes node IDs in clipping/effect definitions where
    # they exist. Check these against snapshot descendants; no ID is invented
    # for a flat path export that has no definitions.
    svg_ids = sorted({f'{x}:{y}' for x, y in
                      re.findall(rb'master_svg\w+_(\d+)_(\d+)', data)
                      for x, y in [(x.decode(), y.decode())]})
    matched = sorted(set(svg_ids) & ids(node))
    destination = OUTPUT / category / f'{node_id.replace(":", "-")}.svg'
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() != data:
        previous = OUTPUT / 'manifest.json'
        previous_entries = json.loads(previous.read_text()) if previous.exists() else {}
        old = next((e for e in previous_entries.get('icons', []) + previous_entries.get('families', [])
                    if e['id'] == node_id), None)
        if not old or old['sha256'] != sha(destination.read_bytes()):
            raise ValueError(f'Refusing to overwrite changed bytes: {destination}')
    shutil.copyfile(original, destination)
    paints = sorted({value for el in svg.iter() for key, value in el.attrib.items()
                     if key in ('fill', 'stroke') and value not in ('none', 'transparent')
                     and not value.startswith('url(')})
    item = {
        'id': node_id, 'name': name, 'category': category,
        'family': family, 'variants': variants or {},
        'kind': 'component-set' if a.get('data-type') == 'component-set' else 'icon',
        'file': destination.relative_to(ROOT).as_posix(),
        'original': original.relative_to(ROOT).as_posix(),
        'sha256': sha(data), 'bytes': len(data),
        'size': canvas, 'measuredSourceStyleSize': source_size,
        'exportBoundsDifference': bounds_difference,
        'sourceStyle': a.get('style', ''), 'paints': paints,
        'source': {'fileId': FILE_ID, 'pageId': PAGE_ID, 'nodeId': node_id,
                   'url': f'https://mastergo.com/file/{FILE_ID}?page_id=3752%3A3996&layer_id={node_id.replace(":", "%3A")}',
                   'readDate': '2026-10-21', 'revision': None,
                   'download': 'MasterGo desktop native SVG export',
                   'matchedEmbeddedNodeIds': matched,
                   'filenameRule': 'native full name / ordered variant values; duplicate names use -2, -3 in selection order',
                   'selectionOrder': order},
        'usage': {'preserveOriginalPaint': True, 'automaticResize': False,
                  'eligibleForSelection': canvas['width'] > 0 and canvas['height'] > 0 and node_id not in PENDING_DUPLICATES,
                  'identityStatus': 'duplicate-source-check-pending' if node_id in PENDING_DUPLICATES else 'source-bound',
                  'scenarioApproval': 'required-per-use',
                  'note': '原件尺寸是资产画布尺寸，不自动证明某页面场景应该使用该尺寸。'}
    }


    # User-authorized local derivative; retain the native export and its hash.
    if node_id == '67934:128195':
        adjusted = re.sub(rb'<filter\b[^>]*>.*?</filter>', b'', data, flags=re.S)
        adjusted = re.sub(rb' filter="url\(#master_svg0_67934_128195\)"', b'', adjusted)
        derivative = destination.with_name(destination.stem + '-no-shadow.svg')
        derivative.write_bytes(adjusted)
        item['localAdjustment'] = {
            'file': derivative.relative_to(ROOT).as_posix(),
            'sha256': sha(adjusted), 'operation': 'remove-drop-shadow',
            'authorization': '用户2026-10-21要求：去掉投影',
            'note': '本地去投影版；保留原路径、颜色与画布尺寸，MG原件另存。'}
    return item


def main():
    board = json.loads((SOURCE / 'source-tree.json').read_text())
    entries, families = [], []
    category_counts = Counter()
    seen_names = Counter()
    family_by_node = {}
    batch = SOURCE / 'originals/batch-437'
    for group in board['children']:
        category = group['attrs'].get('data-name', '')
        if not category.endswith('Icon'):
            continue
        for node in group['children']:
            a = node['attrs']
            if a.get('data-type') not in ('component', 'component-set'):
                continue
            name = a['data-name']
            seen_names[name] += 1
            suffix = '' if seen_names[name] == 1 else '-' + str(seen_names[name])
            original = batch / (name + suffix + '.svg')
            # Native export collision order can differ from rendered layout
            # order. Resolve these two names by embedded source-node identity.
            corrected = {'66145:66875': 'Icon/通用Icon/Report-报告-2.svg',
                         '66142:66229': 'Icon/通用Icon/Report-报告.svg',
                         '4980:5925': 'Icon/定制Icon/Chat-2.svg',
                         '2632:3490': 'Icon/定制Icon/Chat.svg',
                         '67934:114904': 'Icon/定制Icon/价值Icon/技术支持.svg',
                         '67934:115647': 'Icon/定制Icon/价值Icon/技术支持-2.svg',
                         '67934:120335': 'Icon/定制Icon/价值Icon/智能网络运维.svg',
                         '67934:125345': 'Icon/定制Icon/价值Icon/智能网络运维-2.svg',
                         '67934:114653': 'Icon/定制Icon/价值Icon/智能搜索.svg',
                         '67934:119706': 'Icon/定制Icon/价值Icon/智能搜索-2.svg'}
            if a['data-node-id'] in corrected:
                original = batch / corrected[a['data-node-id']]
            item = record(node, category, name, original)
            if a['data-node-id'] in corrected:
                item['source']['duplicateMappingEvidence'] = 'components/sources/icon-library-1021/duplicate-bindings.json'
            if item['kind'] == 'component-set':
                families.append(item)
                for child in node['children']:
                    family_by_node[child['attrs']['data-node-id']] = name
            else:
                entries.append(item)
                category_counts[category] += 1

    text = json.loads((SOURCE / 'mastergo-interaction-states.json').read_text())['content'][0]['text']
    blocks = re.findall(r'^### \[(\d+)\] (.*?) \(([^()]+)\)\n\n```html\n(.*?)\n```', text, re.M | re.S)
    if len(blocks) != 105:
        raise ValueError(f'Expected 105 selected variants, got {len(blocks)}')
    seen_names = Counter()
    for order, heading, node_id, code in blocks:
        parser = TreeParser()
        parser.feed(code)
        node = parser.roots[0]
        if node['attrs']['data-node-id'] != node_id:
            raise ValueError(f'Wrong block identity: {node_id}')
        # MCP can split attribute names containing spaces over new lines.
        # Its selection headings preserve the exact ordered source properties.
        variants = dict(re.findall(r'([^,]+?)\[[^\]]+\]=([^,]*)', heading))
        values = list(variants.values())
        native_name = ','.join(values)
        seen_names[native_name] += 1
        suffix = '' if seen_names[native_name] == 1 else '-' + str(seen_names[native_name])
        original = SOURCE / 'originals/batch-105' / (native_name + '-states-1021' + suffix + '.svg')
        family = family_by_node.get(node_id)
        if node_id == '67746:166570':
            family = 'Icon/交互Icon/Star-评星'
        if not family:
            raise ValueError(f'Unmapped family: {node_id}')
        item = record(node, '交互Icon', family + ' / ' + native_name,
                      original, family, variants, int(order))
        item['source']['snapshot'] = 'components/sources/icon-library-1021/mastergo-interaction-states.json'
        item['source']['visibleInBoardSnapshot'] = node_id in family_by_node
        entries.append(item)
        category_counts['交互Icon'] += 1
    if len(entries) != 520 or len(families) != 13:
        raise ValueError(f'Incomplete import: {len(entries)} icons / {len(families)} families')
    if len({e['id'] for e in entries + families}) != 533:
        raise ValueError('Duplicate source identities')
    result = {
        'schemaVersion': 'fs-mastergo-icon-library/1', 'readDate': '2026-10-21',
        'scope': {'fileId': FILE_ID, 'pageId': PAGE_ID, 'boardNodeId': '59586:69810',
                  'title': '【图标组件】设计规范v2.1.2605A',
                  'authorization': '用户2026-10-21截图红框内图标，参考原分类下载。',
                  'screenshot': 'components/sources/icon-library-1021/authorized-scope.png',
                  'boundaries': '仅原件与检索目录；未修改页面选型、组件调用、源图形或尺寸规范。'},
        'counts': {'icons': len(entries), 'nonEmptyIcons': sum(e['size']['width'] > 0 and e['size']['height'] > 0 for e in entries),
                   'emptyIcons': sum(e['size']['width'] == 0 or e['size']['height'] == 0 for e in entries),
                   'variantFamilies': len(families),
                   'byCategory': {c: category_counts[c] for c in ('系统Icon', '通用Icon', '品牌Icon', '交互Icon', '鼠标手势Icon', '定制Icon', '风格化Icon')}},
        'sourceEvidence': ['components/sources/icon-library-1021/mastergo-frame.json',
                           'components/sources/icon-library-1021/mastergo-interaction-states.json',
                           'components/sources/icon-library-1021/originals/mastergo-icon-board.svg'],
        'icons': entries, 'families': families
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    save_json(OUTPUT / 'manifest.json', result)
    check = {'status': 'passed', 'icons': len(entries), 'families': len(families),
             'svgParsed': 533, 'sourceStyleDimensionsChecked': sum(bool(e['measuredSourceStyleSize']) for e in entries + families),
             'embeddedNodeIdentityMatched': sum(bool(e['source']['matchedEmbeddedNodeIds']) for e in entries + families),
             'exportBoundsDifferences': [{'id': e['id'], 'name': e['name'], 'difference': e['exportBoundsDifference']}
                                         for e in entries + families if e['exportBoundsDifference']],
             'uniqueNodeIds': 533, 'preservedOriginalBytes': True,
             'emptyNativeExports': [e['id'] for e in entries if not e['usage']['eligibleForSelection']],
             'sceneSuitability': 'not-assessed', 'browserCatalog': 'pending',
             'manifestSha256': sha((OUTPUT / 'manifest.json').read_bytes())}
    save_json(SOURCE / 'verification.json', check)
    print(json.dumps(check, ensure_ascii=False))


if __name__ == '__main__':
    main()
