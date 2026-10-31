#!/usr/bin/env bash
# Fioletowo-czarny wariant istniejącego NPΩ Panel (Pterodactyl 1.15.1).
# Nie zastępuje plików serwerów ani bazy danych.
set -euo pipefail
PANEL="${1:-/var/www/pterodactyl}"
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${HERE}/../.." && pwd)"
if [[ ${EUID} -ne 0 ]]; then echo "Uruchom jako root: sudo bash $0 [sciezka-panelu]" >&2; exit 1; fi
if [[ ! -f "$PANEL/artisan" || ! -d "$PANEL/resources/views" ]]; then echo "Nie znaleziono panelu w $PANEL" >&2; exit 1; fi
if grep -q 'DRAKORIA_PURPLE_HEAD_BEGIN' "$PANEL/resources/views/templates/wrapper.blade.php" 2>/dev/null; then
 echo "Wykryto już inny wariant Drakoria Purple. Najpierw go odinstaluj, aby uniknąć kolizji." >&2
 exit 1
fi
if [[ ! -f "$PANEL/public/npomega/npomega.css" ]]; then
 echo "Instaluję bazę poprzedniego polskiego panelu (z weryfikacją zgodności)..."
 python3 "$ROOT/install.py" install --panel "$PANEL"
fi
CSS="$PANEL/public/npomega/npomega.css"
if [[ ! -f "$CSS" ]]; then echo "Brakuje stylów bazowych: $CSS" >&2; exit 1; fi
BACKUP_DIR="$PANEL/storage/app/drakoria-purple-versions/$(date +%Y%m%d-%H%M%S)-$$"
mkdir -p "$BACKUP_DIR"
cp -p "$CSS" "$BACKUP_DIR/npomega.css"
echo "$BACKUP_DIR" > "$PANEL/storage/app/drakoria-purple-last-backup"
python3 - "$CSS" <<'PY'
from pathlib import Path
import re, sys
path = Path(sys.argv[1])
s = path.read_text(encoding='utf-8')
start = '/* DRAKORIA_VIOLET_PATCH_START */'
if start in s:
    s = s.split(start,1)[0]
palette = {
    '#0b0d12':'#080712', '#14171f':'#121025', '#1b1f29':'#191330',
    '#303542':'#33234e', '#11141c':'#0d0a1b', '#13161f':'#110d20',
    '#d72d46':'#a43cff', '#ff5268':'#bd75ff', '#962238':'#6b16d6',
    '#ff7586':'#d7a2ff', '#a81d34':'#6b16d6', '#2b1922':'#27143e',
    '#ffb6c1':'#dfc0ff', '#a8495a':'#8751c9', '#30202a':'#28183e',
    '#ff8698':'#d19bff', '#ff6076':'#bd75ff', '#291b25':'#23153c',
    '#b9233b':'#8224d2', '#ec5268':'#ad57f4', '#9d1e33':'#6f14ba',
    '#ff9eb0':'#d9adff', '#d9465b':'#9240d6', '#ffb4c1':'#dfb0ff'
}
for old,new in palette.items():
    s = re.sub(re.escape(old)+r'(?![0-9a-fA-F])',new,s,flags=re.I)
s += """
/* DRAKORIA_VIOLET_PATCH_START */
:root { --np-bg:#080712; --np-panel:#121025; --np-raised:#191330;
--np-line:#33234e; --np-red:#a43cff; --np-bright:#bd75ff;
--np-text:#f3edff; --np-muted:#aca0ca; }
html body { background:radial-gradient(ellipse at 84% 0%,#261343 0%,transparent 38%),linear-gradient(160deg,#080712 0%,#0c081b 65%,#100820 100%) fixed!important; }
body #app { position:relative; z-index:1; }
body #app :is([class*="bg-neutral-900"],[class*="bg-gray-900"]) { border-color:#33234e; }
body #app :is(button,a):focus-visible { outline:2px solid #d7a2ff!important; }
body #app button:not(:disabled):hover { filter:brightness(1.12); }
body #app :is(input,select,textarea):focus { border-color:#a43cff!important; }
body .bg-neutral-900:has(#logo) { box-shadow:0 3px 0 #6b16d6!important; }
body .np-subnav { background:linear-gradient(90deg,#0d0a1b,#19102b)!important; }
body .np-subnav a.active { background:#28133f!important; color:#e4caff!important; }
body :is(.np-card,.np-panel,.np-chart,.np-console) { border-color:#33234e!important; }
body ::selection { background:#7131bd; color:#fff; }
/* DRAKORIA_VIOLET_PATCH_END */
"""
path.write_text(s,encoding='utf-8')
PY
(cd "$PANEL" && php artisan view:clear)
echo "Fioletowo-czarny wariant włączony. Backup CSS: $BACKUP_DIR"
echo "Odśwież Pterodactyla: Ctrl+F5. Nie trzeba restartować Wings ani Minecrafta."
