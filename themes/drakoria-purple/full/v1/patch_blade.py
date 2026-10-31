#!/usr/bin/env python3
"""EUFORIE Purple: safe Blade integration for Pterodactyl v1.x."""
import argparse, re, shutil, sys
from pathlib import Path
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument('action', choices=('install', 'uninstall'))
parser.add_argument('panel', type=Path)
args = parser.parse_args()
panel = args.panel.resolve()
wrapper = panel / 'resources/views/templates/wrapper.blade.php'
admin = panel / 'resources/views/layouts/admin.blade.php'
files = (wrapper, admin)
if not (panel / 'artisan').is_file() or not all(f.is_file() for f in files):
    sys.exit('BŁĄD: Nie znaleziono kompatybilnych szablonów Pterodactyla v1.x.')
if args.action == 'install' and (panel / 'storage/app/npomega-theme.json').exists():
    sys.exit('BŁĄD: Stary motyw NPΩ jest aktywny. Nie nadpisuję go.')

head = '''<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->
<link rel="stylesheet" href="/purple-ptero/gui.css?v=3.1.0">
<!-- DRAKORIA_PURPLE_HEAD_END -->'''
body = '''<!-- DRAKORIA_PURPLE_BODY_BEGIN -->
<script src="/purple-ptero/gui.js?v=3.1.0" defer></script>
<!-- DRAKORIA_PURPLE_BODY_END -->'''
preload = '''<!-- EUFORIE_PRELOAD_BEGIN -->
<style id="euforie-preload">
 html { background:#080712!important; color-scheme:dark!important; }
 html body { background:#080712!important; color:#f3edff; }
 html body:not(.dp-chrome-ready) #app { background:#080712!important; }
 html body:not(.dp-chrome-ready) #app [class*="bg-neutral-700"],
 html body:not(.dp-chrome-ready) #app [class*="bg-gray-700"] {background:#19132b!important;color:#ede5ff!important}
 html body:not(.dp-chrome-ready) #app [class*="bg-neutral-900"],
 html body:not(.dp-chrome-ready) #app [class*="bg-gray-900"] {background:#110d20!important}
 html body:not(.dp-chrome-ready) #app [class*="bg-neutral-800"] {background:#161124!important}
 html body:not(.dp-chrome-ready) #app [class*="bg-blue-"],
 html body:not(.dp-chrome-ready) #app [class*="bg-cyan-"] {background:#6e25be!important}
</style>
<!-- EUFORIE_PRELOAD_END -->
<script>(function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#080712')})()</script>'''
patterns = (
    re.compile(r'<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->.*?<!-- DRAKORIA_PURPLE_HEAD_END -->\s*', re.S),
    re.compile(r'<!-- DRAKORIA_PURPLE_BODY_BEGIN -->.*?<!-- DRAKORIA_PURPLE_BODY_END -->\s*', re.S),
    re.compile(r'<!-- EUFORIE_PRELOAD_BEGIN -->.*?</script>\s*', re.S),
)
before = {p:p.read_text(encoding='utf-8') for p in files}
after = {}
for p, data in before.items():
    if args.action == 'install':
        if 'DRAKORIA_PURPLE_HEAD_BEGIN' in data or 'DRAKORIA_PURPLE_BODY_BEGIN' in data:
            sys.exit('BŁĄD: Motyw jest już dołączony: '+str(p))
        if '</head>' not in data or '</body>' not in data:
            sys.exit('BŁĄD: Nieznana struktura Blade: '+str(p))
        injected = (preload+'\n' if p == wrapper else '') + head
        after[p] = data.replace('</head>', injected+'\n</head>',1).replace('</body>',body+'\n</body>',1)
    else:
        if 'DRAKORIA_PURPLE_HEAD_BEGIN' not in data or 'DRAKORIA_PURPLE_BODY_BEGIN' not in data:
            sys.exit('BŁĄD: Brak aktywnych znaczników motywu: '+str(p))
        for pat in patterns:
            data = pat.sub('',data)
        after[p]=data
backup = panel / 'storage/app/drakoria-purple-backup' / datetime.now().strftime('%Y%m%d-%H%M%S-%f')
backup.mkdir(parents=True, exist_ok=False)
for i,p in enumerate(files): shutil.copy2(p, backup/(str(i)+'.blade.php'))
written=[]
try:
    for p,data in after.items():
        p.write_text(data,encoding='utf-8')
        written.append(p)
except BaseException:
    for p in written:p.write_text(before[p],encoding='utf-8')
    raise
print('OK EUFORIE:',args.action,'— kopia:',backup)
