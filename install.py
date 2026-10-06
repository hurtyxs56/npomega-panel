#!/usr/bin/env python3
"""Transactional, build-free NPΩ theme installer. Python 3.9+, Linux."""
import argparse
import contextlib
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

VERSION = '1.2.0'
ROOT = Path(__file__).resolve().parent
TEMPLATES = {
    'resources/views/templates/wrapper.blade.php': '855f4aebfee7b4853d4603916e5eb549dcd77cbaf1a63e6d3b4eaa04d8f8f692',
    'resources/views/layouts/admin.blade.php': '2dcba41aeb6a54edc0e42048dcdda50bbf59289dfd50d17cfdd4f3a7b9e45d96',
}
ASSETS = ('npomega.css', 'npomega.js', 'logo.svg')
STATE = 'storage/app/npomega-theme.json'
HOOK = '''    <!-- NPOMEGA BEGIN -->
        <link rel="stylesheet" href="/npomega/npomega.css?v=1.2.0">
        <link rel="icon" type="image/svg+xml" href="/npomega/logo.svg">
        <script src="/npomega/npomega.js?v=1.2.0"></script>
    <!-- NPOMEGA END -->
'''

def digest(data):
    return hashlib.sha256(data).hexdigest()

def atomic_write(path, data, metadata=None):
    """Same-directory rename; retain original ownership and permissions."""
    fd, temporary = tempfile.mkstemp(prefix='.npomega-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, metadata.st_mode & 0o777 if metadata else 0o644)
        if metadata and os.geteuid() == 0:
            os.chown(temporary, metadata.st_uid, metadata.st_gid)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)

def clear_views(panel):
    # Match the existing Laravel storage owner; avoid root-owned runtime logs.
    owner = (panel / 'storage').stat()
    kwargs = {}
    if os.geteuid() == 0 and owner.st_uid != 0:
        kwargs = dict(user=owner.st_uid, group=owner.st_gid, extra_groups=[])
    subprocess.run(['php', 'artisan', 'view:clear'], cwd=panel, check=True,
                   timeout=90, **kwargs)

def validate_panel(panel):
    for name in (*TEMPLATES, 'config/app.php', 'artisan', 'vendor/autoload.php'):
        path = panel / name
        if not path.is_file() or path.is_symlink():
            raise RuntimeError('Brak zwykłego pliku panelu: ' + str(path))
        if panel not in path.resolve().parents:
            raise RuntimeError('Plik poza katalogiem panelu: ' + str(path))
    if not (panel / 'storage/app').is_dir() or not (panel / 'public').is_dir():
        raise RuntimeError('To nie jest kompletny katalog Pterodactyla.')
    for folder in ['public', 'storage/app']:
        if panel not in (panel / folder).resolve().parents:
            raise RuntimeError('Katalog poza panelem: ' + folder)

def build_payload(panel):
    version = re.search(r"['\"]version['\"]\s*=>\s*['\"]([^'\"]+)['\"]", (panel / 'config/app.php').read_text())
    if not version or version.group(1) != '1.15.1':
        raise RuntimeError('Ten motyw obsługuje wydanie Pterodactyl 1.15.1. Inna wersja wymaga sprawdzenia zgodności.')
    if (panel / 'public/npomega').exists():
        raise RuntimeError('public/npomega już istnieje. Nie nadpisuję nieznanych plików.')
    payload = {}
    for relative, expected in TEMPLATES.items():
        data = (panel / relative).read_bytes()
        if digest(data) != expected:
            raise RuntimeError('Zmieniony szablon: ' + relative + '. Instalacja przerwana bez zmian; potrzebne dopasowanie do obecnego motywu.')
        text = data.decode('utf-8')
        if text.count('    </head>') != 1:
            raise RuntimeError('Nieznana struktura szablonu: ' + relative)
        payload[relative] = text.replace('    </head>', HOOK + '    </head>').encode()
    for asset in ASSETS:
        payload['public/npomega/' + asset] = (ROOT / 'assets' / asset).read_bytes()
    return payload

def install(panel, dry_run=False):
    if (panel / STATE).exists():
        raise RuntimeError('Motyw jest już zainstalowany. Aby zaktualizować, najpierw użyj uninstall.')
    payload = build_payload(panel)
    if dry_run:
        print('OK: wersja, oba szablony i 3 pliki motywu. Można instalować.')
        return
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = Path(tempfile.mkdtemp(prefix='npomega-backup-' + stamp + '-', dir=panel / 'storage/app'))
    originals = {name: ((panel / name).read_bytes(), (panel / name).stat()) for name in TEMPLATES}
    for i, (name, (data, _)) in enumerate(originals.items()):
        (backup / str(i)).write_bytes(data)
    state = {'theme_version': VERSION, 'backup': backup.name,
             'originals': {name: {'file': str(i), 'sha256': digest(data)} for i, (name, (data, _)) in enumerate(originals.items())},
             'installed': {name: digest(data) for name, data in payload.items()}}
    created = False
    try:
        (panel / 'public/npomega').mkdir(mode=0o755)
        created = True
        for name, data in payload.items():
            atomic_write(panel / name, data, originals[name][1] if name in originals else None)
        clear_views(panel)
        atomic_write(panel / STATE, (json.dumps(state, indent=2) + '\n').encode())
        print('NPΩ Panel zainstalowany. Odśwież panel przez Ctrl+F5.')
        print('Kopia szablonów: ' + str(backup))
    except BaseException:
        for name, (data, metadata) in originals.items():
            atomic_write(panel / name, data, metadata)
        if created:
            for asset in ASSETS:
                (panel / 'public/npomega' / asset).unlink(missing_ok=True)
            (panel / 'public/npomega').rmdir()
        with contextlib.suppress(Exception):
            clear_views(panel)
        print('Błąd instalacji — przywrócono oryginalne szablony.', file=sys.stderr)
        raise

def uninstall(panel, dry_run=False):
    state_path = panel / STATE
    if not state_path.is_file() or state_path.is_symlink():
        raise RuntimeError('Nie znaleziono stanu instalacji NPΩ.')
    state = json.loads(state_path.read_text())
    expected_paths = set(TEMPLATES) | {'public/npomega/' + asset for asset in ASSETS}
    if set(state.get('installed', {})) != expected_paths or set(state.get('originals', {})) != set(TEMPLATES):
        raise RuntimeError('Nieprawidłowy manifest. Przerwano bez zmian.')
    backup = panel / 'storage/app' / state['backup']
    if backup.parent != panel / 'storage/app' or backup.is_symlink() or not backup.name.startswith('npomega-backup-'):
        raise RuntimeError('Nieprawidłowa ścieżka kopii.')
    current = {}
    for name, expected in state['installed'].items():
        path = panel / name
        if not path.is_file() or path.is_symlink() or panel not in path.resolve().parents or digest(path.read_bytes()) != expected:
            raise RuntimeError('Plik zmieniono po instalacji: ' + name + '. Cofanie przerwane, aby zachować nowsze zmiany.')
        current[name] = (path.read_bytes(), path.stat())
    originals = {}
    for i, name in enumerate(TEMPLATES):
        info = state['originals'][name]
        if info['file'] != str(i):
            raise RuntimeError('Nieprawidłowa nazwa pliku kopii.')
        data = (backup / str(i)).read_bytes()
        if digest(data) != info['sha256'] or digest(data) != TEMPLATES[name]:
            raise RuntimeError('Uszkodzona kopia: ' + name)
        originals[name] = data
    if dry_run:
        print('OK: kopia poprawna, cofanie zmian możliwe.')
        return
    try:
        for name, data in originals.items():
            atomic_write(panel / name, data, current[name][1])
        clear_views(panel)
        for asset in ASSETS:
            (panel / 'public/npomega' / asset).unlink()
        with contextlib.suppress(OSError):
            (panel / 'public/npomega').rmdir()
        state_path.unlink()
    except BaseException:
        (panel / 'public/npomega').mkdir(exist_ok=True)
        for name, (data, metadata) in current.items():
            atomic_write(panel / name, data, metadata)
        with contextlib.suppress(Exception):
            clear_views(panel)
        raise
    print('Przywrócono oryginalne szablony. Kopia pozostaje w ' + str(backup))

def main():
    parser = argparse.ArgumentParser(description='Motyw NPΩ dla Pterodactyla 1.15.1')
    parser.add_argument('action', choices=['install', 'uninstall'])
    parser.add_argument('--panel', default='/var/www/pterodactyl', help='Katalog istniejącego panelu')
    parser.add_argument('--dry-run', action='store_true', help='Sprawdź zgodność bez zmiany panelu')
    args = parser.parse_args()
    panel = Path(args.panel).resolve()
    try:
        validate_panel(panel)
        if not args.dry_run and not shutil.which('php'):
            raise RuntimeError('Brak PHP CLI w PATH.')
        action = install if args.action == 'install' else uninstall
        if args.dry_run:
            action(panel, True)
        else:
            lock_path = panel / 'storage/app/npomega-theme.lock'
            fd = os.open(lock_path, os.O_WRONLY | os.O_CREAT | os.O_NOFOLLOW, 0o600)
            with os.fdopen(fd, 'w') as lock:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                action(panel)
    except (OSError, RuntimeError, ValueError, KeyError, subprocess.SubprocessError) as error:
        print('BŁĄD: ' + str(error), file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
