#!/usr/bin/env bash
# EUFORIE Purple — aktualizacja motywu Pterodactyl 1.x
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
if [ "$(id -u)" -ne 0 ]; then echo "BŁĄD: Uruchom przez sudo/root." >&2; exit 1; fi
if [ ! -f "$PANEL/artisan" ]; then echo "BŁĄD: Brak Pterodactyla w $PANEL." >&2; exit 1; fi
WRAPPER="$PANEL/resources/views/templates/wrapper.blade.php"
ADMIN="$PANEL/resources/views/layouts/admin.blade.php"
if [ ! -f "$WRAPPER" ] || [ ! -f "$ADMIN" ]; then
  echo "BŁĄD: Nieznana struktura panelu. Nie zmieniono żadnych plików." >&2; exit 1
fi
if ! grep -q 'DRAKORIA_PURPLE_HEAD_BEGIN' "$WRAPPER"; then
  if [ -e "$PANEL/public/purple-ptero" ]; then
    echo "BŁĄD: Zasoby motywu istnieją, ale nie ma znaczników w szablonie. Nie nadpisuję." >&2; exit 1
  fi
  echo "Motyw nie jest jeszcze zainstalowany — uruchamiam instalator."
  exec bash "$SRC/instaluj.sh" "$PANEL"
fi
if ! grep -q 'DRAKORIA_PURPLE_HEAD_BEGIN' "$ADMIN" || [ ! -f "$PANEL/public/purple-ptero/gui.css" ]; then
  echo "BŁĄD: Instalacja motywu niekompletna. Nie nadpisuję." >&2; exit 1
fi
BACKUP="$PANEL/storage/app/euforie-purple-updates/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$BACKUP"
cp -a "$WRAPPER" "$BACKUP/wrapper.blade.php"
cp -a "$ADMIN" "$BACKUP/admin.blade.php"
cp -a "$PANEL/public/purple-ptero" "$BACKUP/purple-ptero"
rollback() {
  echo "BŁĄD podczas aktualizacji. Przywracam kopię $BACKUP" >&2
  cp -a "$BACKUP/wrapper.blade.php" "$WRAPPER"
  cp -a "$BACKUP/admin.blade.php" "$ADMIN"
  rm -rf "$PANEL/public/purple-ptero"
  cp -a "$BACKUP/purple-ptero" "$PANEL/public/purple-ptero"
  (cd "$PANEL" && php artisan view:clear) || true
}
trap rollback ERR
cp -a "$SRC/assets/." "$PANEL/public/purple-ptero/"
chmod -R a+rX "$PANEL/public/purple-ptero"
python3 - "$WRAPPER" "$ADMIN" <<'PY'
from pathlib import Path
import re,sys
for filename in sys.argv[1:]:
    path=Path(filename)
    data=path.read_text(encoding="utf-8")
    if "DRAKORIA_PURPLE_HEAD_BEGIN" not in data or "DRAKORIA_PURPLE_BODY_BEGIN" not in data:
        raise SystemExit("Brak wymaganych znaczników motywu: "+str(path))
    data,n=re.subn(r'(/purple-ptero/gui\.(?:css|js)\?v=)[0-9.]+',r'\g<1>2.1.0',data)
    if n!=2:
        raise SystemExit("Nieoczekiwany format odnośników motywu: "+str(path))
    path.write_text(data,encoding="utf-8")
PY
(cd "$PANEL" && php artisan view:clear)
trap - ERR
echo "SUKCES: EUFORIE Purple 2.1.0 zainstalowany."
echo "Kopia: $BACKUP"
echo "Odśwież panel przez Ctrl+F5. Wings oraz serwery gier nie są restartowane."
