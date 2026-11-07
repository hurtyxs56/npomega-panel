#!/usr/bin/env python3
"""DragonFire live theme installer for a real Pterodactyl panel.

Makes a complete backup of the two Blade templates, injects real CSS/JS,
and keeps Pterodactyl's original React/API/WebSocket functionality.
No changes to database, .env, Wings, or Minecraft servers.
"""
import argparse
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

VERSION = "1.0.0"
ROOT = Path(__file__).resolve().parent
RELATIVE = [
    "resources/views/templates/wrapper.blade.php",
    "resources/views/layouts/admin.blade.php",
]
ASSETS = ("gui.css", "gui.js")
STATE = "storage/app/dragonfire-live.json"
MARKERS = [
    ("<!-- NPOMEGA BEGIN -->", "<!-- NPOMEGA END -->"),
    ("<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->", "<!-- DRAKORIA_PURPLE_HEAD_END -->"),
    ("<!-- DRAKORIA_PURPLE_BODY_BEGIN -->", "<!-- DRAKORIA_PURPLE_BODY_END -->"),
    ("<!-- EUFORIE_PRELOAD_BEGIN -->", "<!-- EUFORIE_PRELOAD_END -->"),
]
HEAD = """<!-- DRAGONFIRE_HEAD_BEGIN -->
<style id="dragonfire-preload">html,body{background:#090909!important;color-scheme:dark!important}body{color:#fff1e9}</style>
<link rel="stylesheet" href="/dragonfire-live/gui.css?v=1.0.0">
<!-- DRAGONFIRE_HEAD_END -->"""
BODY = """<!-- DRAGONFIRE_BODY_BEGIN -->
<script defer src="/dragonfire-live/gui.js?v=1.0.0"></script>
<!-- DRAGONFIRE_BODY_END -->"""

def digest(data):
    return hashlib.sha256(data).hexdigest()

def write_atomic(path, data, original=None):
    fd, name = tempfile.mkstemp(prefix=".dragonfire-", dir=str(path.parent))
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        if original:
            os.chmod(name, original.st_mode & 0o777)
            if os.geteuid() == 0:
                os.chown(name, original.st_uid, original.st_gid)
        else:
            os.chmod(name, 0o644)
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)

def validate(panel):
    for name in RELATIVE + ["artisan", "config/app.php", "vendor/autoload.php"]:
        p = panel / name
        if not p.is_file() or p.is_symlink() or panel not in p.resolve().parents:
            raise RuntimeError("Nie znaleziono pliku Pterodactyla lub symlink: " + str(p))
    for name in ("public", "storage/app"):
        p = panel / name
        if not p.is_dir() or p.is_symlink() or panel not in p.resolve().parents:
            raise RuntimeError("Niepoprawny katalog Pterodactyla: " + str(p))
    if not shutil.which("php"):
        raise RuntimeError("Brak php CLI w PATH.")
    for name in ASSETS:
        p = ROOT / "assets" / name
        if not p.is_file():
            raise RuntimeError("Brak pliku motywu na GitHubie: " + str(p))

def remove_known_blocks(source):
    text = source
    if "DRAGONFIRE_HEAD_BEGIN" in text or "DRAGONFIRE_BODY_BEGIN" in text:
        raise RuntimeError("Motyw DragonFire już jest w szablonie; przerwano.")
    for begin, end in MARKERS:
        if text.count(begin) != text.count(end) or text.count(begin) > 1:
            raise RuntimeError("Niespójne znaczniki starego motywu: " + begin)
        if begin in text:
            pattern = re.escape(begin) + r".*?" + re.escape(end) + r"\s*"
            text = re.sub(pattern, "", text, count=1, flags=re.S)
    # Inline theme-color snippet left by the EUFORIE installer.
    text = re.sub(
        r"<script>\s*\(function\(\)\{var m=document\.querySelector\("
        r"['\"]meta\[name=['\"]theme-color['\"]\]['\"]\);"
        r"if\(m\)m\.setAttribute\(['\"]content['\"],['\"]#080712['\"]\)"
        r"\}\)\(\)\s*</script>\s*",
        "", text, count=1
    )
    if "/npomega/npomega.js" in text or "/purple-ptero/gui.js" in text:
        raise RuntimeError("Pozostaly nieznane hooki poprzedniego motywu. Nie lacze ich w ciemno.")
    return text

def prepare(panel):
    changed = {}
    for rel in RELATIVE:
        source = (panel / rel).read_bytes()
        try:
            text = source.decode("utf-8")
        except UnicodeDecodeError as e:
            raise RuntimeError("Szablon nie jest UTF-8: " + rel) from e
        if text.count("</head>") != 1 or text.count("</body>") != 1:
            raise RuntimeError("Nieznana struktura Blade: " + rel)
        text = remove_known_blocks(text)
        text = text.replace("</head>", HEAD + "\n</head>", 1)
        text = text.replace("</body>", BODY + "\n</body>", 1)
        changed[rel] = text.encode("utf-8")
    return changed

def clear_views(panel):
    st = (panel / "storage").stat()
    args = {}
    if os.geteuid() == 0 and st.st_uid != 0:
        args = dict(user=st.st_uid, group=st.st_gid, extra_groups=[])
    subprocess.run(
        ["php", "artisan", "view:clear"], cwd=panel, check=True, timeout=90,
        **args
    )

def install(panel, dry_run):
    state = panel / STATE
    if state.exists():
        raise RuntimeError("DragonFire juz zainstalowany. Nie instaluj drugi raz. Uzyj 'uninstall', jesli chcesz cofnac.")
    dest = panel / "public/dragonfire-live"
    if dest.exists():
        raise RuntimeError("Katalog public/dragonfire-live istnieje; nie nadpisuje nieznanych plikow.")
    payload = prepare(panel)
    assets = {name:(ROOT / "assets" / name).read_bytes() for name in ASSETS}
    if dry_run:
        print("OK DRAGONFIRE: szablony i CSS/JS zgodne. Mozna instalowac.")
        return
    originals = {rel:((panel / rel).read_bytes(), (panel / rel).stat()) for rel in RELATIVE}
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
    backup = Path(tempfile.mkdtemp(prefix="dragonfire-backup-" + stamp + "-", dir=panel / "storage/app"))
    for i, rel in enumerate(RELATIVE):
        (backup / (str(i) + ".blade.php")).write_bytes(originals[rel][0])
    meta = {
        "version": VERSION, "backup": backup.name,
        "originals": {rel:digest(originals[rel][0]) for rel in RELATIVE},
        "installed": {rel:digest(payload[rel]) for rel in RELATIVE},
        "assets": {name:digest(assets[name]) for name in ASSETS}
    }
    created = False
    try:
        dest.mkdir(mode=0o755)
        created = True
        for name, data in assets.items():
            write_atomic(dest / name, data)
        for rel in RELATIVE:
            write_atomic(panel / rel, payload[rel], originals[rel][1])
        clear_views(panel)
        write_atomic(state, (json.dumps(meta, indent=2) + "\n").encode())
        print("SUKCES: DragonFire LIVE aktywny na Pterodactyl. Odswiez przegladarke Ctrl+Shift+R.")
        print("BACKUP: " + str(backup))
    except BaseException:
        for rel in RELATIVE:
            write_atomic(panel / rel, originals[rel][0], originals[rel][1])
        if created and dest.is_dir():
            for name in ASSETS:
                (dest / name).unlink(missing_ok=True)
            dest.rmdir()
        try:
            clear_views(panel)
        except Exception:
            pass
        print("BŁĄD: Cofnięto zmiany w panelu.", file=sys.stderr)
        raise

def uninstall(panel, dry_run):
    statepath = panel / STATE
    if not statepath.is_file() or statepath.is_symlink():
        raise RuntimeError("DragonFire LIVE nie jest zainstalowany.")
    st = json.loads(statepath.read_text(encoding="utf-8"))
    if set(st.get("originals", {})) != set(RELATIVE) or set(st.get("installed", {})) != set(RELATIVE) or set(st.get("assets", {})) != set(ASSETS):
        raise RuntimeError("Niepoprawny manifest motywu.")
    backupname = st.get("backup", "")
    if not re.fullmatch(r"dragonfire-backup-[0-9TZ]+-[a-z0-9_]+", backupname):
        raise RuntimeError("Niepoprawna nazwa backupu.")
    backup = panel / "storage/app" / backupname
    if not backup.is_dir() or backup.is_symlink():
        raise RuntimeError("Brak backupu do przywrocenia.")
    originals = {}
    current = {}
    for i, rel in enumerate(RELATIVE):
        file = panel / rel
        content = file.read_bytes()
        if digest(content) != st["installed"][rel]:
            raise RuntimeError("Szablon zmieniony po instalacji, cofanie wstrzymane: " + rel)
        backfile = backup / (str(i) + ".blade.php")
        original = backfile.read_bytes()
        if digest(original) != st["originals"][rel]:
            raise RuntimeError("Backup uszkodzony: " + rel)
        originals[rel] = original
        current[rel] = (content, file.stat())
    dest = panel / "public/dragonfire-live"
    if dest.is_symlink() or not dest.is_dir():
        raise RuntimeError("Brak katalogu motywu.")
    if {x.name for x in dest.iterdir()} != set(ASSETS):
        raise RuntimeError("W katalogu motywu sa nieznane pliki, nie usuwam.")
    for name in ASSETS:
        asset = dest / name
        if asset.is_symlink() or digest(asset.read_bytes()) != st["assets"][name]:
            raise RuntimeError("Plik motywu zmieniony, nie usuwam: " + name)
    if dry_run:
        print("OK: przywrocenie wygladu sprzed DragonFire jest mozliwe.")
        return
    try:
        for rel in RELATIVE:
            write_atomic(panel / rel, originals[rel], current[rel][1])
        clear_views(panel)
        for name in ASSETS:
            (dest / name).unlink()
        dest.rmdir()
        statepath.unlink()
        print("OK: Przywrocono poprzedni motyw z: " + str(backup))
    except BaseException:
        for rel in RELATIVE:
            write_atomic(panel / rel, current[rel][0], current[rel][1])
        try:
            clear_views(panel)
        except Exception:
            pass
        raise

def main():
    p = argparse.ArgumentParser(description="DragonFire LIVE — Pterodactyl theme")
    p.add_argument("action", choices=["install", "uninstall"])
    p.add_argument("--panel", default="/var/www/pterodactyl")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    panel = Path(args.panel).resolve()
    try:
        validate(panel)
        if not args.dry_run and os.geteuid() != 0:
            raise RuntimeError("Instalacje uruchom jako root.")
        if args.dry_run:
            (install if args.action == "install" else uninstall)(panel, True)
        else:
            lockpath = panel / "storage/app/dragonfire-live.lock"
            fd = os.open(lockpath, os.O_WRONLY | os.O_CREAT | os.O_NOFOLLOW, 0o600)
            with os.fdopen(fd, "w") as lock:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                (install if args.action == "install" else uninstall)(panel, False)
        return 0
    except (OSError, RuntimeError, ValueError, KeyError, subprocess.SubprocessError) as error:
        print("BŁĄD: " + str(error), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
