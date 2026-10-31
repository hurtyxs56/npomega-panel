#!/usr/bin/env bash
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
if [ "$(id -u)" -ne 0 ]; then echo 'Uruchom jako root (sudo)'; exit 1; fi
test -f "$PANEL/artisan" || { echo "Brak panelu w $PANEL"; exit 1; }
test -f "$PANEL/resources/views/templates/wrapper.blade.php" || { echo "Nieobsługiwana struktura szablonów"; exit 1; }
test -f "$PANEL/resources/views/layouts/admin.blade.php" || { echo "Nieobsługiwana struktura szablonów"; exit 1; }
test ! -e "$PANEL/public/purple-ptero" || { echo 'Katalog purple-ptero istnieje — nie nadpisuję.'; exit 1; }
test ! -e "$PANEL/storage/app/npomega-theme.json" || { echo 'Najpierw odinstaluj poprzednie NPΩ.'; exit 1; }
python3 "$SRC/patch_blade.py" install "$PANEL"
mkdir -p "$PANEL/public/purple-ptero"
cp -a "$SRC/assets/." "$PANEL/public/purple-ptero/"
chmod -R a+rX "$PANEL/public/purple-ptero"
(cd "$PANEL" && php artisan view:clear)
echo 'Sukces: EUFORIE Purple PL 2.4.0. Odśwież Ctrl+F5.'