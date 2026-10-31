#!/usr/bin/env bash
# EUFORIE 3.1 — naprawa GUI, odtwarzanie brakujących hooków po ratunek.sh.
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
W="$PANEL/resources/views/templates/wrapper.blade.php"
A="$PANEL/resources/views/layouts/admin.blade.php"
DEST="$PANEL/public/purple-ptero"
if [ "$(id -u)" -ne 0 ]; then echo 'BŁĄD: uruchom przez sudo/root' >&2; exit 1; fi
for f in "$PANEL/artisan" "$W" "$A"; do
  if [ ! -f "$f" ] || [ -L "$f" ]; then echo "BŁĄD: brak pliku panelu: $f" >&2; exit 1; fi
done
if [ -f "$PANEL/storage/app/npomega-theme.json" ]; then
  echo 'BŁĄD: motyw NPΩ nadal aktywny. Nie łączę dwóch motywów.' >&2; exit 1
fi
grep -q '3.1.0' "$SRC/assets/gui.js" || { echo 'BŁĄD: stare pliki na GitHubie'; exit 1; }
BACKUP="$PANEL/storage/app/euforie-safe-updates/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$BACKUP"
cp -p "$W" "$BACKUP/wrapper.blade.php"
cp -p "$A" "$BACKUP/admin.blade.php"
if [ -d "$DEST" ]; then cp -a "$DEST" "$BACKUP/purple-ptero"; fi
rollback() {
  code=$?; trap - ERR
  echo "BŁĄD instalacji, cofam do: $BACKUP" >&2
  cp -p "$BACKUP/wrapper.blade.php" "$W"
  cp -p "$BACKUP/admin.blade.php" "$A"
  rm -rf -- "$DEST"
  if [ -d "$BACKUP/purple-ptero" ]; then cp -a "$BACKUP/purple-ptero" "$DEST"; fi
  (cd "$PANEL" && php artisan view:clear) || true
  exit "$code"
}
trap rollback ERR
python3 - "$W" "$A" <<'PY'
from pathlib import Path
import re,sys
wrapper,admin=[Path(p) for p in sys.argv[1:]]
head='''<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->
<link rel="stylesheet" href="/purple-ptero/gui.css?v=3.1.0">
<!-- DRAKORIA_PURPLE_HEAD_END -->'''
body='''<!-- DRAKORIA_PURPLE_BODY_BEGIN -->
<script src="/purple-ptero/gui.js?v=3.1.0" defer></script>
<!-- DRAKORIA_PURPLE_BODY_END -->'''
preload='''<!-- EUFORIE_PRELOAD_BEGIN -->
<style id="euforie-preload">
html{background:#080712!important;color-scheme:dark!important}
html body{background:#080712!important;color:#f3edff}
html body:not(.euforie-ready) #app{background:#080712!important}
html body:not(.euforie-ready) #app [class*="bg-neutral-900"]{background:#110d20!important}
</style>
<!-- EUFORIE_PRELOAD_END -->
<script>(function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#080712')})()</script>'''
for file in (wrapper,admin):
    s=file.read_text(encoding='utf8')
    for begin,end,value,closing in [
      ('DRAKORIA_PURPLE_HEAD_BEGIN','DRAKORIA_PURPLE_HEAD_END',head,'</head>'),
      ('DRAKORIA_PURPLE_BODY_BEGIN','DRAKORIA_PURPLE_BODY_END',body,'</body>')]:
        if s.count(begin)!=s.count(end) or s.count(begin)>1:
            raise RuntimeError('Niespójny szablon: '+str(file))
        if begin in s:
            pat=r'(?s)<!-- '+begin+r' -->.*?<!-- '+end+r' -->'
            s=re.sub(pat,lambda m:value,s,count=1)
        else:
            if closing not in s:raise RuntimeError('Brak '+closing+' w '+str(file))
            s=s.replace(closing,value+'\n'+closing,1)
    if file==wrapper:
        pat=r'(?s)<!-- EUFORIE_PRELOAD_BEGIN -->.*?<!-- EUFORIE_PRELOAD_END -->\s*(?:<script>\(function\(\).*?</script>)?'
        if 'EUFORIE_PRELOAD_BEGIN' in s:
            if s.count('EUFORIE_PRELOAD_BEGIN')!=1:raise RuntimeError('Podwójny preloader')
            s=re.sub(pat,lambda m:preload,s,count=1)
        else:
            s=s.replace('</head>',preload+'\n</head>',1)
    file.write_text(s,encoding='utf8')
PY
mkdir -p "$DEST"
cp -a "$SRC/assets/." "$DEST/"
chmod -R a+rX "$DEST"
(cd "$PANEL" && php artisan view:clear)
cmp -s "$SRC/assets/gui.js" "$DEST/gui.js"
cmp -s "$SRC/assets/gui.css" "$DEST/gui.css"
grep -q 'gui.css?v=3.1.0' "$W"
grep -q 'gui.js?v=3.1.0' "$W"
trap - ERR
echo 'SUKCES: EUFORIE 3.1.0. Boczny panel i oryginalne kliknięcia Pterodactyla.'
echo "Backup: $BACKUP"
