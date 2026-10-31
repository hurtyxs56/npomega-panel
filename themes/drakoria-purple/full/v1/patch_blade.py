#!/usr/bin/env python3
import argparse,shutil,sys
from pathlib import Path
from datetime import datetime
p=argparse.ArgumentParser();p.add_argument('action',choices=['install','uninstall']);p.add_argument('panel',type=Path);args=p.parse_args()
panel=args.panel.resolve()
files=[panel/'resources/views/templates/wrapper.blade.php',panel/'resources/views/layouts/admin.blade.php']
if not (panel/'artisan').is_file() or not all(f.is_file() for f in files):sys.exit('BŁĄD: Brakuje wymaganych plików Pterodactyla 1.x.')
if args.action=='install' and (panel/'storage/app/npomega-theme.json').exists():sys.exit('BŁĄD: Motyw NPΩ już zainstalowany. Najpierw go cofnij.')
head='<!-- DRAKORIA_PURPLE_HEAD_BEGIN -->\n<link rel="stylesheet" href="/purple-ptero/gui.css?v=2.0.0">\n<!-- DRAKORIA_PURPLE_HEAD_END -->'
body='<!-- DRAKORIA_PURPLE_BODY_BEGIN -->\n<script src="/purple-ptero/gui.js?v=2.0.0" defer></script>\n<!-- DRAKORIA_PURPLE_BODY_END -->'
originals={f:f.read_text(encoding='utf8') for f in files};updated={}
for f,s in originals.items():
 if args.action=='install':
  if 'DRAKORIA_PURPLE_HEAD_BEGIN' in s:sys.exit('GUI jest już dołączony: '+str(f))
  if '</head>' not in s or '</body>' not in s:sys.exit('Nieznana struktura Blade: '+str(f))
  updated[f]=s.replace('</head>',head+'\n</head>',1).replace('</body>',body+'\n</body>',1)
 else:updated[f]=s.replace(head+'\n','').replace(body+'\n','')
if args.action=='install':
 backup=panel/'storage/app/drakoria-purple-backup'/datetime.now().strftime('%Y%m%d-%H%M%S-%f')
 backup.mkdir(parents=True,exist_ok=False)
 for i,f in enumerate(files):shutil.copy2(f,backup/(str(i)+'.blade.php'))
 print('Kopia:',backup)
done=[]
try:
 for f,s in updated.items():f.write_text(s,encoding='utf8');done.append(f)
except Exception:
 for f in done:f.write_text(originals[f],encoding='utf8')
 raise
print('OK:',args.action)