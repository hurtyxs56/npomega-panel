#!/usr/bin/env bash
# EUFORIE 2.3.0 — instalacja aktualizacji + kontrola poprawności
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
W="$PANEL/resources/views/templates/wrapper.blade.php"
A="$PANEL/resources/views/layouts/admin.blade.php"
DEST="$PANEL/public/purple-ptero"
VERSION="2.3.0"
if [ "$(id -u)" -ne 0 ]; then echo 'BŁĄD: Uruchom przez sudo/root.' >&2; exit 1; fi
if [ ! -f "$PANEL/artisan" ] || [ ! -f "$W" ] || [ ! -f "$A" ]; then
 echo "BŁĄD: Nie znaleziono Pterodactyla 1.x w $PANEL" >&2; exit 1
fi
if [ -f "$PANEL/storage/app/npomega-theme.json" ]; then
 echo 'BŁĄD: Aktywny stary motyw NPΩ. Nie nadpisuję bez zgody.' >&2; exit 1
fi
if [ ! -d "$DEST" ] || [ ! -f "$DEST/gui.js" ]; then
 echo 'BŁĄD: Nie ma instalacji Drakoria/EUFORIE. Uruchom pierwotny instalator.' >&2; exit 1
fi
for t in "$W" "$A"; do
 grep -q 'DRAKORIA_PURPLE_HEAD_BEGIN' "$t" || { echo "BŁĄD: Nie znaleziono znacznika motywu w $t" >&2; exit 1; }
 grep -q 'DRAKORIA_PURPLE_BODY_BEGIN' "$t" || { echo "BŁĄD: Nie znaleziono znacznika JS w $t" >&2; exit 1; }
done
grep -q '2.3.0' "$SRC/assets/gui.js" || { echo 'BŁĄD: Pobrano stary kod JS.' >&2; exit 1; }
BACKUP="$PANEL/storage/app/euforie-purple-updates/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$BACKUP"
cp -p "$W" "$BACKUP/wrapper.blade.php"
cp -p "$A" "$BACKUP/admin.blade.php"
cp -a "$DEST" "$BACKUP/purple-ptero"
rollback() {
 rc=$?
 trap - ERR
 echo "BŁĄD — przywracam poprzednią wersję GUI z: $BACKUP" >&2
 cp -p "$BACKUP/wrapper.blade.php" "$W"
 cp -p "$BACKUP/admin.blade.php" "$A"
 rm -rf -- "$DEST"
 cp -a "$BACKUP/purple-ptero" "$DEST"
 (cd "$PANEL" && php artisan view:clear) || true
 exit "$rc"
}
trap rollback ERR
cp -a "$SRC/assets/." "$DEST/"
chmod -R a+rX "$DEST"
python3 - "$W" "$A" <<'PY'
from pathlib import Path
import re,sys
wrapper=Path(sys.argv[1])
critical='''<!-- EUFORIE_PRELOAD_BEGIN -->
<style id="euforie-preload">
  html { background:#080712!important; color-scheme:dark!important; }
  html body { background:#080712!important; color:#f3edff; }
  html body:not(.dp-chrome-ready) #app { background:#080712!important; }
  html body:not(.dp-chrome-ready) #app [class*="bg-neutral-700"],
  html body:not(.dp-chrome-ready) #app [class*="bg-gray-700"] {
    background:#19132b!important;color:#ede5ff!important;
  }
  html body:not(.dp-chrome-ready) #app [class*="bg-neutral-900"],
  html body:not(.dp-chrome-ready) #app [class*="bg-gray-900"] {
    background:#110d20!important;
  }
  html body:not(.dp-chrome-ready) #app [class*="bg-neutral-800"] {
    background:#161124!important;
  }
  html body:not(.dp-chrome-ready) #app [class*="bg-blue-"],
  html body:not(.dp-chrome-ready) #app [class*="bg-cyan-"]{
    background:#6e25be!important;
  }
</style>
<!-- EUFORIE_PRELOAD_END -->
<script>(function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#080712')})()</script>'''
for path in (wrapper,Path(sys.argv[2])):
    data=path.read_text(encoding='utf8')
    if 'DRAKORIA_PURPLE_HEAD_BEGIN' not in data or 'DRAKORIA_PURPLE_BODY_BEGIN' not in data:
        raise RuntimeError('Nie znaleziono starego GUI w '+str(path))
    for asset in ('gui.css','gui.js'):
        pat=r'(/purple-ptero/'+re.escape(asset)+r'\?v=)[0-9.]+'
        data,count=re.subn(pat,lambda m:m.group(1)+'2.3.0',data)
        if count!=1:raise RuntimeError('Nieprawidłowy link do '+asset+' w '+str(path))
    if path==wrapper and 'EUFORIE_PRELOAD_BEGIN' not in data:
        if '</head>' not in data:raise RuntimeError('Brak sekcji head w '+str(path))
        data=data.replace('</head>',critical+'\n</head>',1)
    path.write_text(data,encoding='utf8')
PY
(cd "$PANEL" && php artisan view:clear)
cmp -s "$SRC/assets/gui.css" "$DEST/gui.css" || { echo 'BŁĄD: CSS na serwerze różni się od GitHub.' >&2; false; }
cmp -s "$SRC/assets/gui.js" "$DEST/gui.js" || { echo 'BŁĄD: JS na serwerze różni się od GitHub.' >&2; false; }
grep -q 'EUFORIE_PRELOAD_BEGIN' "$W"
grep -q 'gui.css?v=2.3.0' "$W"
grep -q 'gui.js?v=2.3.0' "$W"
trap - ERR
echo "SUKCES: EUFORIE $VERSION"
echo "Plik GUI JS: $(sha256sum "$DEST/gui.js" | cut -d' ' -f1)"
echo "Plik GUI CSS: $(sha256sum "$DEST/gui.css" | cut -d' ' -f1)"
echo "Ciemny ekran startowy: TAK"
echo "Backup: $BACKUP"
echo "Odśwież na telefonie stronę z wyczyszczeniem cache witryny."
