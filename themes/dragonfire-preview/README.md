# NPΩ DragonFire — podgląd GUI Pterodactyl

Smoczy motyw: grafit i czerń, krwista czerwień, pomarańczowe płomienie. Układ: boczne menu, karty serwerów, demonstracyjna konsola, wykresy i responsywny widok mobilny.

> **UWAGA: To samodzielny prototyp HTML, NIE instalator ani gotowy motyw Pterodactyl.** Dane serwerów są przykładowe, a Start, Stop, Restart i komendy w konsoli nie sterują żadną maszyną. Nie kopiuj tego `index.html` do `/var/www/pterodactyl` i nie zastępuj nim plików produkcyjnych panelu.

## Pobranie na VPS z Ubuntu

Jako root (lub po `sudo -i`):

```bash
if [ -d /root/npomega-panel/.git ]; then
  git -C /root/npomega-panel pull --ff-only
else
  git clone https://github.com/hurtyxs56/npomega-panel.git /root/npomega-panel
fi
```

## Podgląd na serwerze — bez ingerencji w Pterodactyl

```bash
cd /root/npomega-panel/themes/dragonfire-preview
python3 -m http.server 8090 --bind 127.0.0.1
```

Serwer podglądu nasłuchuje tylko lokalnie na VPS-ie. Na komputerze użytkownika uruchom w **drugim** terminalu (podstaw własny host SSH):

```bash
ssh -L 8090:127.0.0.1:8090 root@ADRES_VPS
```

Otwórz w swojej przeglądarce: **http://localhost:8090**

Zatrzymanie podglądu: `Ctrl+C` w terminalu z `python3 -m http.server`.

## Opcja: podgląd lokalny na komputerze

Po pobraniu repozytorium wystarczy otworzyć `themes/dragonfire-preview/index.html` w przeglądarce. HTML nie wymaga internetu ani dodatkowych bibliotek.

## Co dalej, żeby motyw działał w Pterodactyl?

Trzeba dopiero osadzić wygląd w prawdziwym frontendzie obsługującym zalogowaną sesję, uprawnienia, dane serwerów, WebSocket konsoli, pliki, backupy, administrowanie i akcje zasilania. Należy zrobić kopię zapasową panelu i przetestować zgodność z zainstalowaną wersją przed wdrożeniem.

Ten katalog jest odizolowany od innych motywów i istniejącego instalatora w repozytorium.
