#!/usr/bin/env python3
"""Split a reference screenshot into readable, ordered A1 inspection panels.

A long screenshot is often scaled down by the viewer. This tool keeps the source
width intact and cuts vertical panels so that, after fitting to the declared
maximum readable edge, each panel is at most that edge in both dimensions.
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover - exercised on hosts without Pillow
    Image = None

DEFAULT_MAX_READABLE_EDGE = 2048
DEFAULT_CONTEXT_OVERLAP = 256


def panel_height(source_width: int, max_edge: int) -> int:
    """Return the largest source-height that fits a max_edge square when shown."""
    scale = min(1.0, max_edge / source_width)
    return max(1, math.floor(max_edge / scale))


def sips_dimensions(source: Path) -> tuple[int, int]:
    """Read image dimensions with the macOS built-in sips fallback."""
    result = subprocess.run(
        ['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(source)],
        check=True,
        capture_output=True,
        text=True,
    )
    dimensions = {}
    for line in result.stdout.splitlines():
        if ':' not in line:
            continue
        key, value = line.split(':', 1)
        if key.strip() in {'pixelWidth', 'pixelHeight'}:
            dimensions[key.strip()] = int(value.strip())
    width = dimensions.get('pixelWidth')
    height = dimensions.get('pixelHeight')
    if not width or not height:
        raise ValueError(f'Unable to read image dimensions with sips: {source}')
    return width, height


def split_with_sips(source: Path, output_dir: Path, max_edge: int, overlap: int) -> dict:
    """Crop ordered panels when Pillow is not installed on macOS hosts."""
    width, height = sips_dimensions(source)
    source_panel_height = panel_height(width, max_edge)
    if overlap >= source_panel_height:
        raise ValueError('--overlap must be smaller than the source panel height')
    output_dir.mkdir(parents=True, exist_ok=True)
    display_scale = min(1.0, max_edge / width)
    starts = [0]
    while starts[-1] + source_panel_height < height:
        starts.append(starts[-1] + source_panel_height - overlap)
    part_count = len(starts)
    parts = []

    # Some macOS sips versions ignore cropOffset or return the untouched source
    # with exit code 0. A centered crop cannot satisfy ordered A1 evidence.
    # Native ImageIO crops in source coordinates without requiring Pillow.
    swift = """
import Foundation
import ImageIO
import CoreGraphics
let args = CommandLine.arguments
let source = URL(fileURLWithPath: args[1])
guard let input = CGImageSourceCreateWithURL(source as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(input, 0, nil) else { fatalError("Invalid source image") }
let records = try JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: args[2]))) as! [[String: Any]]
for record in records {
    let y = record["top"] as! Int
    let h = record["height"] as! Int
    let file = record["file"] as! String
    guard let crop = image.cropping(to: CGRect(x: 0, y: y, width: image.width, height: h)),
          let output = CGImageDestinationCreateWithURL(URL(fileURLWithPath: file) as CFURL, "public.png" as CFString, 1, nil) else { fatalError("Crop failed") }
    CGImageDestinationAddImage(output, crop, nil)
    guard CGImageDestinationFinalize(output) else { fatalError("PNG write failed") }
}
"""
    jobs = []
    for index, y_start in enumerate(starts, start=1):
        y_end = min(y_start + source_panel_height, height)
        filename = f'{source.stem}.part-{index:03d}-of-{part_count:03d}.png'
        output_path = output_dir / filename
        jobs.append({'top': y_start, 'height': y_end - y_start, 'file': str(output_path.resolve())})
        parts.append({
            'index': index,
            'file': str(output_path),
            'sourceCrop': {'left': 0, 'top': y_start, 'right': width, 'bottom': y_end},
            'overlapFromPrevious': 0 if index == 1 else overlap,
            'sourceSize': {'width': width, 'height': y_end - y_start},
            'fittedDisplaySize': {
                'width': round(width * display_scale),
                'height': round((y_end - y_start) * display_scale),
            },
        })
    import tempfile
    with tempfile.TemporaryDirectory(prefix='fs-screenshot-crop-') as work:
        swift_file = Path(work) / 'crop.swift'
        jobs_file = Path(work) / 'jobs.json'
        swift_file.write_text(swift, encoding='utf-8')
        jobs_file.write_text(json.dumps(jobs), encoding='utf-8')
        subprocess.run(['swift', str(swift_file), str(source.resolve()), str(jobs_file)],
                       check=True, capture_output=True, text=True, timeout=60)
    for part in parts:
        if sips_dimensions(Path(part['file'])) != (width, part['sourceSize']['height']):
            raise ValueError(f"Crop dimensions do not match manifest: {part['file']}")

    manifest = {
        'source': str(source.resolve()),
        'sourceSize': {'width': width, 'height': height},
        'maxReadableEdge': max_edge,
        'sourcePanelHeight': source_panel_height,
        'contextOverlap': overlap,
        'readingOrder': 'top-to-bottom by index; adjacent panels overlap for boundary context',
        'splitter': 'macos-imageio',
        'parts': parts,
    }
    manifest_path = output_dir / f'{source.stem}.manifest.json'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return {'manifest': manifest_path, 'part_count': part_count, 'panel_height': source_panel_height}


def split_screenshot(source: Path, output_dir: Path, max_edge: int, overlap: int) -> dict:
    if max_edge <= 0:
        raise ValueError('--max-readable-edge must be greater than zero')
    if overlap < 0:
        raise ValueError('--overlap must not be negative')
    if not source.is_file():
        raise FileNotFoundError(f'Input image does not exist: {source}')

    if Image is None:
        return split_with_sips(source, output_dir, max_edge, overlap)

    with Image.open(source) as image:
        image.load()
        width, height = image.size
        if width <= 0 or height <= 0:
            raise ValueError(f'Invalid image dimensions: {width}×{height}')

        source_panel_height = panel_height(width, max_edge)
        if overlap >= source_panel_height:
            raise ValueError('--overlap must be smaller than the source panel height')
        output_dir.mkdir(parents=True, exist_ok=True)
        display_scale = min(1.0, max_edge / width)
        starts = [0]
        while starts[-1] + source_panel_height < height:
            starts.append(starts[-1] + source_panel_height - overlap)
        part_count = len(starts)
        parts = []

        for index, y_start in enumerate(starts, start=1):
            y_end = min(y_start + source_panel_height, height)
            panel = image.crop((0, y_start, width, y_end))
            filename = f'{source.stem}.part-{index:03d}-of-{part_count:03d}.png'
            output_path = output_dir / filename
            panel.save(output_path, format='PNG')
            parts.append({
                'index': index,
                'file': str(output_path),
                'sourceCrop': {'left': 0, 'top': y_start, 'right': width, 'bottom': y_end},
                'overlapFromPrevious': 0 if index == 1 else overlap,
                'sourceSize': {'width': width, 'height': y_end - y_start},
                'fittedDisplaySize': {
                    'width': round(width * display_scale),
                    'height': round((y_end - y_start) * display_scale),
                },
            })

    manifest = {
        'source': str(source.resolve()),
        'sourceSize': {'width': width, 'height': height},
        'maxReadableEdge': max_edge,
        'sourcePanelHeight': source_panel_height,
        'contextOverlap': overlap,
        'readingOrder': 'top-to-bottom by index; adjacent panels overlap for boundary context',
        'parts': parts,
    }
    manifest_path = output_dir / f'{source.stem}.manifest.json'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return {'manifest': manifest_path, 'part_count': part_count, 'panel_height': source_panel_height}


def main() -> int:
    parser = argparse.ArgumentParser(
        description='Split a reference screenshot into ordered panels for A1 visual reading.'
    )
    parser.add_argument('image', type=Path, help='Source screenshot image')
    parser.add_argument('--output-dir', type=Path, required=True, help='Directory for PNG panels and manifest')
    parser.add_argument(
        '--max-readable-edge',
        type=int,
        default=DEFAULT_MAX_READABLE_EDGE,
        help=f'Maximum displayed width and height for each panel (default: {DEFAULT_MAX_READABLE_EDGE})',
    )
    parser.add_argument(
        '--overlap',
        type=int,
        default=DEFAULT_CONTEXT_OVERLAP,
        help=f'Vertical context overlap between adjacent panels in source pixels (default: {DEFAULT_CONTEXT_OVERLAP})',
    )
    args = parser.parse_args()

    try:
        result = split_screenshot(args.image, args.output_dir, args.max_readable_edge, args.overlap)
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        print(f'Error: {error}', file=sys.stderr)
        return 1

    print(f"Created {result['part_count']} ordered panel(s); source panel height: {result['panel_height']}px")
    print(f"Manifest: {result['manifest']}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
