#!/usr/bin/env python3
"""Safe in-place upgrade for an already installed DragonFire LIVE 1.0.0.

Preserves initial rollback manifest and original Blade backups. Does not
reinstall Pterodactyl, restart Wings, or modify any game server.
"""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile

from install import validate, write_atomic, clear_views, digest, RELATIVE, ASSETS, ROOT, STATE

TARGET = "1.1.0"
OLD = "1.0.0"
ASSET_DIR = "public/dragonfire-live"
OLD_URLS = (
    ("/dragonfire-live/gui.css?v=1.0.0", "/dragonfire-live/gui.css?v=1.1.0"),
    ("/dragonfire-live/gui.js?v=1.0.0", "/dragonfire-live/gui.js?v=1.1.0"),
)

def upgrade(panel, dry_run=False):
    validate(panel)
    statepath = panel / STATE
    if not statepath.is_file() or statepath.is_symlink():
        raise RuntimeError("Nie ma aktywnej instalacji DragonFire. Uzyj 'python3 themes/dragonfire-live/install.py install'.")
    state_bytes = statepath.read_bytes()
    state = json.loads(state_bytes)
    version = state.get("version")
    if version not in (OLD, TARGET):
        raise RuntimeError("Nieznana wersja motywu: " + str(version))
    if set(state.get("installed", {})) != set(RELATIVE):
        raise RuntimeError("Manifest szablonow jest niekompletny.")
    if set(state.get("assets", {})) != set(ASSETS):
        raise RuntimeError("Manifest zasobow jest niekompletny.")
    old_templates = {}
    old_meta = {}
    for name in RELATIVE:
        p = panel / name
        if not p.is_file() or p.is_symlink():
            raise RuntimeError("Brak szablonu: " + name)
        data = p.read_bytes()
        if digest(data) != state["installed"][name]:
            raise RuntimeError("Szablon modyfikowany po instalacji: " + name + "; nie nadpisuje zmian.")
        old_templates[name] = data
        old_meta[name] = p.stat()
    dest = panel / ASSET_DIR
    if not dest.is_dir() or dest.is_symlink():
        raise RuntimeError("Brak katalogu public/dragonfire-live.")
    old_assets = {}
    old_asset_meta = {}
    new_assets = {}
    for name in ASSETS:
        p = dest / name
        if not p.is_file() or p.is_symlink():
            raise RuntimeError("Brak pliku motywu: " + name)
        data = p.read_bytes()
        if digest(data) != state["assets"][name]:
            raise RuntimeError("Zmieniony plik motywu: " + name + "; nie nadpisuje zmian.")
        old_assets[name] = data
        old_asset_meta[name] = p.stat()
        new_assets[name] = (ROOT / "assets" / name).read_bytes()
    if version == TARGET:
        for name in ASSETS:
            if digest(new_assets[name]) != state["assets"][name]:
                raise RuntimeError("Zainstalowana wersja 1.1.0 rozni sie od repo. Nie nadpisuje.")
        print("OK: DragonFire LIVE 1.1.0 jest juz zainstalowany.")
        return

    new_templates = {}
    for name, data in old_templates.items():
        txt = data.decode("utf-8")
        if txt.count("DRAGONFIRE_HEAD_BEGIN") != 1 or txt.count("DRAGONFIRE_BODY_BEGIN") != 1:
            raise RuntimeError("Nie znaleziono obu znacznikow DragonFire: " + name)
        for old, new in OLD_URLS:
            if txt.count(old) != 1:
                raise RuntimeError("Nieoczekiwany URL motywu: " + name + ": " + old)
            txt = txt.replace(old, new, 1)
        new_templates[name] = txt.encode("utf-8")
    if dry_run:
        print("OK: DragonFire 1.0.0 mozna bezpiecznie zaktualizowac do 1.1.0.")
        return
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup = Path(tempfile.mkdtemp(prefix="dragonfire-upgrade-" + stamp + "-", dir=panel / "storage/app"))
    for i, name in enumerate(RELATIVE):
        (backup / (str(i) + ".blade.php")).write_bytes(old_templates[name])
    for name in ASSETS:
        (backup / name).write_bytes(old_assets[name])
    (backup / "manifest.json").write_bytes(state_bytes)

    new_state = json.loads(state_bytes)
    new_state["version"] = TARGET
    for name in RELATIVE:
        new_state["installed"][name] = digest(new_templates[name])
    for name in ASSETS:
        new_state["assets"][name] = digest(new_assets[name])
    try:
        for name in ASSETS:
            write_atomic(dest / name, new_assets[name], old_asset_meta[name])
        for name in RELATIVE:
            write_atomic(panel / name, new_templates[name], old_meta[name])
        clear_views(panel)
        write_atomic(statepath, (json.dumps(new_state, indent=2) + "\n").encode(), statepath.stat())
        print("SUKCES: DragonFire 1.1.0 aktywny na prawdziwym panelu Pterodactyl.")
        print("Zapisano kopie poprzedniej wersji: " + str(backup))
        print("Odswiez strone Ctrl+Shift+R.")
    except BaseException:
        for name in ASSETS:
            write_atomic(dest / name, old_assets[name], old_asset_meta[name])
        for name in RELATIVE:
            write_atomic(panel / name, old_templates[name], old_meta[name])
        write_atomic(statepath, state_bytes, statepath.stat())
        try:
            clear_views(panel)
        except Exception:
            pass
        print("BLAD: przywrocono pliki DragonFire 1.0.0.", file=sys.stderr)
        raise

def main():
    parser = argparse.ArgumentParser(description="Bezpieczna aktualizacja DragonFire LIVE 1.0.0 -> 1.1.0")
    parser.add_argument("--panel", default="/var/www/pterodactyl")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if os.geteuid() != 0 and not args.dry_run:
        print("BLAD: Uruchom aktualizacje jako root.", file=sys.stderr)
        return 1
    try:
        upgrade(Path(args.panel).resolve(), args.dry_run)
    except (OSError, RuntimeError, ValueError, KeyError, UnicodeError) as exc:
        print("BLAD: " + str(exc), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
