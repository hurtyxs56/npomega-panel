#!/usr/bin/env bash
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
python3 "$SRC/patch_blade.py" uninstall "$PANEL"
(cd "$PANEL" && php artisan view:clear)
echo 'Wyłączono GUI. Zachowano kopie oraz zasoby do ewentualnego przywrócenia.'