import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / 'themes/dragonfire-live'
spec = importlib.util.spec_from_file_location('install', THEME / 'install.py')
install = importlib.util.module_from_spec(spec)
spec.loader.exec_module(install)
# upgrade imports its neighboring install module.
with patch.dict(sys.modules, {'install': install}):
    spec = importlib.util.spec_from_file_location('dragon_upgrade', THEME / 'upgrade.py')
    upgrade = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(upgrade)

class DragonUpgradeTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.panel = Path(self.tmp.name)
        for directory in ['public','storage/app','config','vendor']:
            (self.panel / directory).mkdir(parents=True)
        for name in ['artisan','config/app.php','vendor/autoload.php']:
            (self.panel / name).write_text('<?php')
        for name in install.RELATIVE:
            p = self.panel / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes((ROOT / 'tests/fixtures' / p.name).read_bytes())
        with patch.object(install,'clear_views'):
            install.install(self.panel, False)
        # Simulate a verified previous installation and its recorded hashes.
        statepath = self.panel / install.STATE
        state = json.loads(statepath.read_text())
        state['version'] = '1.2.0'
        for name in install.RELATIVE:
            p = self.panel / name
            p.write_text(p.read_text().replace('1.3.0','1.2.0'))
            state['installed'][name] = install.digest(p.read_bytes())
        statepath.write_text(json.dumps(state))

    def test_upgrade_and_original_uninstall(self):
        with patch.object(upgrade,'clear_views'), patch.object(upgrade,'validate'):
            upgrade.upgrade(self.panel)
            upgrade.upgrade(self.panel) # idempotent
        self.assertEqual(json.loads((self.panel / install.STATE).read_text())['version'],'1.3.0')
        for name in install.RELATIVE:
            self.assertIn('?v=1.3.0',(self.panel / name).read_text())
        with patch.object(install,'clear_views'):
            install.uninstall(self.panel,False)
        for name in install.RELATIVE:
            self.assertEqual((self.panel / name).read_bytes(),(ROOT / 'tests/fixtures' / Path(name).name).read_bytes())

    def test_cache_error_restores_previous_version(self):
        before = (self.panel / install.STATE).read_bytes()
        with patch.object(upgrade,'validate'), patch.object(upgrade,'clear_views',side_effect=RuntimeError('cache')):
            with self.assertRaises(RuntimeError): upgrade.upgrade(self.panel)
        self.assertEqual((self.panel / install.STATE).read_bytes(),before)
        for name in install.RELATIVE:
            self.assertIn('?v=1.2.0',(self.panel / name).read_text())

    def test_modified_asset_is_not_overwritten(self):
        asset = self.panel / 'public/dragonfire-live/gui.js'
        asset.write_text('custom changes')
        with patch.object(upgrade,'validate'):
            with self.assertRaises(RuntimeError): upgrade.upgrade(self.panel)
        self.assertEqual(asset.read_text(),'custom changes')
