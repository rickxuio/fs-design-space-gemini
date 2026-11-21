#!/usr/bin/env python3
"""Read-only, narrow raster pilot: two flat bands in a US mobile header.

Requires Pillow. Does not infer font size/weight, inspect interactions, or edit images.
Transparent export shadow is excluded; an explicit export scale is required.
"""
import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def sha(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def display_path(file):
    try:
        return str(Path(file).relative_to(ROOT))
    except ValueError:
        return str(Path(file))


class SourceStyles(HTMLParser):
    def __init__(self):
        super().__init__()
        self.styles = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('data-node-id'):
            self.styles[attrs['data-node-id']] = attrs.get('style', '')


def source_property(styles, node, property):
    match = re.search(r'(?:^|;)\s*' + re.escape(property) + r'\s*:\s*([^;]+)', styles.get(node, ''))
    if not match:
        raise ValueError(f'Source property missing: {node} {property}')
    return match.group(1).strip()


def color(hex_value):
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', hex_value):
        raise ValueError('Only explicit six-digit source colors are supported')
    return tuple(int(hex_value[i:i + 2], 16) for i in (1, 3, 5)) + (255,)


def review(image_file, source_file, scale):
    if not 0.5 <= scale <= 4:
        raise ValueError('Export scale must be explicit and within 0.5–4')
    source = json.loads(Path(source_file).read_text())
    if source.get('fileId') != '143880409387753':
        raise ValueError('This pilot only supports the captured FS US mobile header source')
    parsed = SourceStyles()
    parsed.feed(source['html'])
    expected_top = float(source_property(parsed.styles, '68908:033002', 'height').removesuffix('px'))
    expected_main = float(source_property(parsed.styles, '68908:033016', 'height').removesuffix('px'))
    gray = color(source_property(parsed.styles, '68908:033002', 'background'))
    white = color(source_property(parsed.styles, '68908:033010', 'background'))
    image = Image.open(image_file).convert('RGBA')
    # Fully opaque content has a rectangular surface; alpha-only export shadows are not content.
    mask = image.getchannel('A').point(lambda a: 255 if a == 255 else 0)
    bounds = mask.getbbox()
    if not bounds:
        raise ValueError('No opaque header content')
    left, top, right, bottom = bounds
    x = left + max(1, round(4 * scale))
    if x >= right:
        raise ValueError('Opaque region too narrow for the declared header')
    rows = [image.getpixel((x, y)) for y in range(top, bottom)]
    split = next((i for i, value in enumerate(rows) if value != gray), None)
    report = {
        'schemaVersion': 'fs-design-header-review/1.0.0',
        'toolFingerprints': {display_path(Path(__file__).resolve()): sha(__file__)},
        'reviewedAt': datetime.now(timezone.utc).isoformat(),
        'target': {'image': display_path(image_file), 'sha256': sha(image_file),
                   'imageSize': list(image.size), 'exportScale': scale, 'end': 'M',
                   'role': 'US mobile public header', 'opaqueBoundsPixels': list(bounds)},
        'standard': {'source': display_path(source_file), 'sha256': sha(source_file),
                     'fileId': source['fileId'], 'nodeId': '68908:033001',
                     'capturedAt': source.get('capturedAt'),
                     'ruleNodes': ['68908:033002', '68908:033010', '68908:033016']},
        'scope': '完整可辨认 Header 的两段平面背景高度；显式导出比例换算；排除透明投影',
        'checks': [], 'findings': [], 'pending': [],
        'unverified': ['文字、字重、字号、图标形状与色彩的逐项判断', 'Header 之外的模块、其他端与全部交互',
                       '导出比例由调用者明确提供；本工具不自行推断比例', '非矩形或带背景图片的其他设计稿'],
        'visualApproval': 'not-established-by-this-review',
    }
    if split is None or split == 0 or any(value != white for value in rows[split:]):
        report['status'] = 'pending-visible-evidence'
        report['pending'].append('采样列未形成来源中的灰色→白色两个连续区域；不能猜测边界。')
        return report
    checks = [('header-height', expected_top + expected_main, (bottom - top) / scale, [left, top, right, bottom]),
              ('topbar-height', expected_top, split / scale, [left, top, right, top + split]),
              ('main-height', expected_main, (bottom - top - split) / scale, [left, top + split, right, bottom])]
    for rule, expected, actual, rect in checks:
        item = {'rule': rule, 'expected': expected, 'actual': actual, 'unit': 'CSS px',
                'evidence': {'pixelRect': rect, 'sampleColumn': x, 'exportScale': scale},
                'status': 'passed' if abs(expected - actual) <= 0.5 else 'difference'}
        report['checks'].append(item)
        if item['status'] == 'difference':
            report['findings'].append({'id': f'F-{len(report["findings"]) + 1:03}', **item,
                                       'recommendation': '在该设计稿受检区域核对来源高度；不反向改写规范。'})
    report['status'] = 'differences-found' if report['findings'] else 'checked-design-scope-passed'
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--image', required=True)
    parser.add_argument('--source', required=True)
    parser.add_argument('--scale', required=True, type=float)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    output = Path(args.out).resolve()
    if output.is_relative_to(ROOT) and not output.is_relative_to(ROOT / 'page-reviews'):
        raise ValueError('Project reports must be written under page-reviews')
    if output.exists() and (not output.is_file() or output.stat().st_nlink > 1):
        raise ValueError('Report cannot overwrite hardlinks or non-files')
    if output in [Path(args.image).resolve(), Path(args.source).resolve()]:
        raise ValueError('Report must not overwrite its sources')
    result = review(Path(args.image).resolve(), Path(args.source).resolve(), args.scale)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'{result["status"]}; differences={len(result["findings"])}; pending={len(result["pending"])}')
    return 0 if result['status'] == 'checked-design-scope-passed' else 2


if __name__ == '__main__':
    raise SystemExit(main())
