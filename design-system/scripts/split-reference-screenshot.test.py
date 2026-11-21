import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from PIL import Image

spec = importlib.util.spec_from_file_location('splitter', Path(__file__).with_name('split-reference-screenshot.py'))
splitter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(splitter)

class OrderedCropTest(unittest.TestCase):
    def verify(self, native, size):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'source.png'
            image = Image.new('RGB', size)
            image.putdata([(x % 256, y % 256, (y // 100) % 256) for y in range(size[1]) for x in range(size[0])])
            image.save(source)
            with patch.object(splitter, 'Image', None if native else Image):
                result = splitter.split_screenshot(source, root / 'parts', 2048, 256)
            manifest = json.loads(result['manifest'].read_text())
            for part in manifest['parts']:
                crop = part['sourceCrop']
                with Image.open(part['file']) as actual:
                    expected = image.crop((crop['left'], crop['top'], crop['right'], crop['bottom']))
                    self.assertEqual(actual.size, expected.size)
                    self.assertEqual(actual.convert('RGB').tobytes(), expected.tobytes())
            self.assertEqual(manifest['parts'][0]['sourceCrop']['top'], 0)
            self.assertEqual(manifest['parts'][-1]['sourceCrop']['bottom'], size[1])
    def test_native_ordered_overlap(self): self.verify(True, (100, 4300))
    def test_native_single(self): self.verify(True, (100, 500))
    def test_pillow_ordered_overlap(self): self.verify(False, (100, 4300))
    def test_pillow_single(self): self.verify(False, (100, 500))

if __name__ == '__main__': unittest.main()
