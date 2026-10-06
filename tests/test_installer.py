import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('installer', ROOT / 'install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)

class InstallerTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.panel = Path(self.temp.name)
        self.originals = {}
        for relative in installer.TEMPLATES:
            path = self.panel / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            data = (ROOT / 'tests/fixtures' / path.name).read_bytes()
            path.write_bytes(data)
            self.originals[relative] = data
        for directory in ['public', 'storage/app', 'config', 'vendor']:
            (self.panel / directory).mkdir(parents=True, exist_ok=True)
        (self.panel / 'config/app.php').write_text("<?php return ['version' => '1.15.1'];")
        (self.panel / 'artisan').write_text('<?php')
        (self.panel / 'vendor/autoload.php').write_text('<?php')
        self.clear = patch.object(installer, 'clear_views')
        self.mock_clear = self.clear.start()
        self.addCleanup(self.clear.stop)

    def assert_originals(self):
        for name, expected in self.originals.items():
            self.assertEqual((self.panel / name).read_bytes(), expected)

    def test_upstream_hashes_are_exact(self):
        for name, data in self.originals.items():
            self.assertEqual(installer.digest(data), installer.TEMPLATES[name])

    def test_dry_run_does_not_write(self):
        before = sorted(str(p) for p in self.panel.rglob('*'))
        installer.install(self.panel, dry_run=True)
        self.assertEqual(before, sorted(str(p) for p in self.panel.rglob('*')))
        self.assert_originals()
        self.mock_clear.assert_not_called()

    def test_install_and_restore_exactly(self):
        installer.validate_panel(self.panel)
        installer.install(self.panel)
        for relative in self.originals:
            self.assertEqual((self.panel / relative).read_text().count('NPOMEGA BEGIN'), 1)
        for asset in installer.ASSETS:
            self.assertEqual((self.panel / 'public/npomega' / asset).read_bytes(), (ROOT / 'assets' / asset).read_bytes())
        installer.uninstall(self.panel)
        self.assert_originals()
        self.assertFalse((self.panel / installer.STATE).exists())
        self.assertFalse((self.panel / 'public/npomega').exists())

    def test_upgrade_from_previous_asset_version(self):
        with tempfile.TemporaryDirectory() as old:
            old_root = Path(old)
            (old_root / 'assets').mkdir()
            for asset in installer.ASSETS:
                (old_root / 'assets' / asset).write_text('previous version ' + asset)
            with patch.object(installer, 'ROOT', old_root), patch.object(installer, 'VERSION', '1.1.0'), patch.object(installer, 'HOOK', installer.HOOK.replace('1.2.0', '1.1.0')):
                installer.install(self.panel)
            installer.uninstall(self.panel)
            self.assert_originals()
            installer.install(self.panel)
            for asset in installer.ASSETS:
                self.assertEqual((self.panel / 'public/npomega' / asset).read_bytes(), (ROOT / 'assets' / asset).read_bytes())

    def test_reinstall_is_rejected_without_changes(self):
        installer.install(self.panel)
        installed = {name: (self.panel / name).read_bytes() for name in self.originals}
        with self.assertRaises(RuntimeError):
            installer.install(self.panel)
        for name, data in installed.items():
            self.assertEqual((self.panel / name).read_bytes(), data)

    def test_custom_template_is_not_overwritten(self):
        relative = next(iter(self.originals))
        (self.panel / relative).write_bytes(b'custom theme')
        with self.assertRaisesRegex(RuntimeError, 'Zmieniony szablon'):
            installer.install(self.panel)
        self.assertEqual((self.panel / relative).read_bytes(), b'custom theme')
        self.assertFalse((self.panel / 'public/npomega').exists())

    def test_wrong_version_rejected(self):
        (self.panel / 'config/app.php').write_text("<?php return ['version' => '1.14.0'];")
        with self.assertRaises(RuntimeError):
            installer.install(self.panel)
        self.assert_originals()

    def test_cache_failure_rolls_back(self):
        self.mock_clear.side_effect = RuntimeError('cache failure')
        with self.assertRaises(RuntimeError):
            installer.install(self.panel)
        self.assert_originals()
        self.assertFalse((self.panel / installer.STATE).exists())
        self.assertFalse((self.panel / 'public/npomega').exists())

    def test_changed_file_blocks_uninstall(self):
        installer.install(self.panel)
        target = self.panel / 'public/npomega/npomega.css'
        target.write_text('newer custom edit')
        with self.assertRaisesRegex(RuntimeError, 'Plik zmieniono'):
            installer.uninstall(self.panel)
        self.assertEqual(target.read_text(), 'newer custom edit')
        self.assertTrue((self.panel / installer.STATE).exists())

    def test_uninstall_cache_failure_keeps_theme(self):
        installer.install(self.panel)
        before = {name: (self.panel / name).read_bytes() for name in self.originals}
        self.mock_clear.side_effect = RuntimeError('cache failure')
        with self.assertRaises(RuntimeError):
            installer.uninstall(self.panel)
        for name, data in before.items():
            self.assertEqual((self.panel / name).read_bytes(), data)
        self.assertTrue((self.panel / installer.STATE).exists())

    def test_corrupt_backup_blocks_restore(self):
        installer.install(self.panel)
        backup = next((self.panel / 'storage/app').glob('npomega-backup-*'))
        (backup / '0').write_bytes(b'broken')
        with self.assertRaisesRegex(RuntimeError, 'Uszkodzona kopia'):
            installer.uninstall(self.panel)
        self.assertTrue((self.panel / installer.STATE).exists())

if __name__ == '__main__':
    unittest.main()
