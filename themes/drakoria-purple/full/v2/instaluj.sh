#!/usr/bin/env bash
set -Eeuo pipefail
PANEL="$1"
SRC="$(cd "$(dirname "$0")" && pwd)"
test -f "$PANEL/artisan" || exit 1
(cd "$PANEL" && php artisan list --raw | grep -q '^p:theme:apply') || { echo 'Ten panel nie obsługuje natywnego systemu motywów 2.x.'; exit 1; }
mkdir -p "$PANEL/themes/euforie-purple"
cp -a "$SRC/theme/." "$PANEL/themes/euforie-purple/"
(cd "$PANEL" && php artisan p:theme:apply euforie-purple)