#!/usr/bin/env bash
# Awaryjne wyłączenie EUFORIE/Drakoria na panelu Pterodactyl 1.x.
# Bez zmian Wings, Minecrafta, bazy danych i .env.
set -Eeuo pipefail
PANEL="$1"
if [ "$(id -u)" -ne 0 ]; then echo 'BŁĄD: uruchom przez sudo/root.' >&2; exit 1; fi
if [ ! -f "$PANEL/artisan" ] || [ ! -d "$PANEL/resources/views" ] || [ ! -d "$PANEL/storage/app" ]; then
  echo "BŁĄD: brak Pterodactyla pod: $PANEL" >&2; exit 1
fi
python3 - "$PANEL" <<'PY'
from pathlib import Path
from datetime import datetime, timezone
import os,re,shutil,sys,tempfile
panel=Path(sys.argv[1]).resolve()
paths=[panel/'resources/views/templates/wrapper.blade.php',panel/'resources/views/layouts/admin.blade.php']
for p in paths:
    if not p.is_file() or p.is_symlink():
        raise SystemExit('BŁĄD: brak lub symlink szablonu: '+str(p))
markers=(
    ('<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->','<!-- DRAKORIA_PURPLE_HEAD_END -->'),
    ('<!-- DRAKORIA_PURPLE_BODY_BEGIN -->','<!-- DRAKORIA_PURPLE_BODY_END -->'),
    ('<!-- EUFORIE_PRELOAD_BEGIN -->','<!-- EUFORIE_PRELOAD_END -->'),
)
meta_js='<script>(function(){var m=document.querySelector(\'meta[name="theme-color"]\');if(m)m.setAttribute(\'content\',\'#080712\')})()</script>'
changes=[]
for p in paths:
    old=p.read_text(encoding='utf8')
    new=old
    for start,end in markers:
        if new.count(start)!=new.count(end) or new.count(start)>1:
            raise SystemExit('BŁĄD: niespójne znaczniki. Nie nadpisuję '+str(p))
        if start in new:
            new,count=re.subn(r'(?m)^[ \t]*'+re.escape(start)+r'[\s\S]*?'+re.escape(end)+r'[ \t]*(?:\r?\n)?','',new,count=1)
            if count!=1: raise SystemExit('BŁĄD: nierozpoznany blok w '+str(p))
    new=new.replace(meta_js,'')
    if new!=old: changes.append((p,new))
if not changes:
    print('Nie znaleziono aktywnego EUFORIE w szablonach. Niczego nie zmieniono.')
    sys.exit(4)
backup=panel/'storage/app'/('euforie-rescue-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'-'+str(os.getpid()))
backup.mkdir(mode=0o700)
for i,(p,_) in enumerate(changes): shutil.copy2(p,backup/(str(i)+'-'+p.name))
(backup/'README.txt').write_text('\n'.join(str(p) for p,_ in changes)+'\n')
written=[]
try:
    for p,new in changes:
        original=p.read_bytes()
        metadata=p.stat()
        fd,temp=tempfile.mkstemp(prefix='.euforie-',dir=p.parent)
        try:
            with os.fdopen(fd,'wb') as h:
                h.write(new.encode('utf8'));h.flush();os.fsync(h.fileno())
            os.chmod(temp,metadata.st_mode & 0o777)
            os.chown(temp,metadata.st_uid,metadata.st_gid)
            os.replace(temp,p)
        finally:
            if os.path.exists(temp):os.unlink(temp)
        written.append((p,original,metadata))
except BaseException:
    for p,old,meta in written:
        p.write_bytes(old);os.chown(p,meta.st_uid,meta.st_gid);os.chmod(p,meta.st_mode & 0o777)
    raise
print('OK: odłączono EUFORIE/Drakoria z panelu.')
print('Kopia bezpieczeństwa: '+str(backup))
PY
if command -v php >/dev/null 2>&1; then
  (cd "$PANEL" && php artisan view:clear) || echo 'UWAGA: błąd php artisan view:clear. Sprawdź PHP.' >&2
else
  echo 'UWAGA: brak PHP CLI na tym VPS.' >&2
fi
echo 'GOTOWE. Odśwież panel Ctrl+Shift+R; Minecraft i Wings nie były restartowane.'
