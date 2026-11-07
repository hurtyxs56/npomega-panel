# DragonFire LIVE 🔥 — stały motyw Pterodactyl

To **prawdziwy motyw dla działającego panelu Pterodactyl**, a nie osobny HTML. Interfejs pozostawia oryginalną aplikację Pterodactyl (logowanie, WebSocket konsoli, pliki, przyciski Start/Stop/Restart, bazy danych, kopie, uprawnienia), zmieniając jej wygląd i nawigację. Boczny pasek opiera się na funkcjonalnym kodzie poprzedniego motywu EUFORIE, ale ma nowy wygląd smoka: czerń, krwista czerwień, pomarańczowy żar.

Motyw tworzy zapasową kopię dotychczasowych szablonów i potrafi przywrócić dokładnie poprzedni wygląd. Nie zmienia Wings, plików Minecrafta, baz danych, kont ani .env.

## Mathost / Ubuntu — instalacja

W konsoli SSH **na VPS obsługującym stronę Pterodactyl** (root):

```bash
cd /root/npomega-panel
git pull --ff-only
python3 themes/dragonfire-live/install.py install --dry-run
python3 themes/dragonfire-live/install.py install
```

Po komunikacie `SUKCES: DragonFire LIVE aktywny na Pterodactyl` otwórz swój dotychczasowy adres panelu i naciśnij **Ctrl+Shift+R**. Motyw jest trwały po odświeżeniu i restarcie serwera, ponieważ pliki znajdują się w `/var/www/pterodactyl/public/dragonfire-live`, a szablony Blade odwołują się do nich bezpośrednio.

Jeśli katalog panelu jest inny niż `/var/www/pterodactyl`, dopisz do obu komend `--panel /wlasna/sciezka`.

**Ważne:** polecenia zadziałają tylko tam, gdzie jest zainstalowany *sam panel WWW Pterodactyl*, a nie na węźle z samym Wings. Skrypt zweryfikuje strukturę i zatrzyma instalację w razie problemu. Wymaga Python 3.9+ i `php` CLI. Nie wymaga Node, npm, yarn ani przebudowy frontendu.

## Przywrócenie poprzedniego wyglądu

```bash
cd /root/npomega-panel
python3 themes/dragonfire-live/install.py uninstall --dry-run
python3 themes/dragonfire-live/install.py uninstall
```

Instalator zachowuje kopie Blade w `/var/www/pterodactyl/storage/app/dragonfire-backup-*` i usuwa tylko własne zasoby. Po przywróceniu odśwież stronę.

## Technicznie

- Podłącza `gui.css` i `gui.js` do dwóch oryginalnych szablonów Blade.
- Jeśli wykryje własne, opisane znacznikami wcześniejsze motywy NPΩ/EUFORIE, usuwa tylko ich odwołania z szablonów na czas działania DragonFire. **Nie usuwa ich backupów ani plików.** Cofnięcie DragonFire przywraca stare odwołania z kopii.
- Zapisuje manifest `storage/app/dragonfire-live.json`, aby uniknąć przypadkowego nadpisania. Jeśli wykryje nieznaną modyfikację szablonów przy odinstalowaniu, zatrzyma się zamiast kasować zmiany.
- Nie podmienia Reacta ani kontrolek zasilania własnymi atrapami.
- Boczna nawigacja powstaje z prawdziwych linków i uprawnień widocznych w oryginalnej aplikacji. Ma awaryjny przycisk przywrócenia górnego paska.
- Na małych ekranach nawigacja jest wysuwana przyciskiem Menu.
- Administracja wykorzystuje istniejący panel i jego akcje.

**Uczciwe ograniczenie:** kod został oparty na poprzedniej implementacji dla Pterodactyl v1.x i przygotowany z bezpiecznym cofnięciem. Nie został jeszcze przetestowany na konkretnym serwerze Mathost użytkownika — przed zastosowaniem skrypt przeprowadza kontrolę struktury. W przypadku niezgodnego układu skrypt przerywa bez zmian.

Wersja demonstracyjna (nie do instalacji): [../dragonfire-preview](../dragonfire-preview).
