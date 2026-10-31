# EUFORIE 3.2.0 — całkowite usunięcie obu górnych pasków

W wersji 3.2.0 poprawiono wykrywanie standardowej belki Pterodactyla oraz całego kontenera szarej nawigacji (serwer i konto). Oba paski są ukrywane, kiedy działa lewe menu. Wyszukiwarka i wylogowanie po lewej wywołują natywne akcje Pterodactyla. Na wypadek problemów na lewym pasku jest przycisk **„Przywróć pasek awaryjnie”**. Nie ukrywa on przycisków Start/Stop ani konsoli.

Aktualizacja istniejącego motywu na VPS z panelem WWW:

```bash
sudo bash -c 'set -e; D=$(mktemp -d); git clone --depth 1 https://github.com/hurtyxs56/npomega-panel.git "$D/repo"; bash "$D/repo/themes/drakoria-purple/full/v1/aktualizuj.sh" /var/www/pterodactyl'
```

Oczekiwany komunikat: `SUKCES: EUFORIE 3.2.0`. Przed zmianą robiona jest kopia szablonów i zasobów; czyszczony jest cache widoków Laravel. Po instalacji wymuś świeże pobranie strony (Ctrl+Shift+R). W konsoli przeglądarki dostępne są `document.documentElement.dataset.euforieVersion` i `window.__euforieStatus`, które pokazują bieżącą wersję i wykrycie pasków. Jeżeli nie masz lewego menu lub panel źle się zachowuje, użyj `themes/drakoria-purple/ratunek.sh` przed dalszymi próbami.

Nie zmienia baz danych, Wings, konfiguracji ani serwerów gier. Nie testowano produkcyjnej instalacji użytkownika.

---

# EUFORIE Purple 3.1 — naprawione boczne menu Pterodactyl PL

Ten motyw zachowuje wygląd EUFORIE (czarno-fioletowy + boczna nawigacja) oraz korzysta z oryginalnych mechanizmów Pterodactyla. Nie zawiera pełnoekranowej nakładki, nie przenosi węzłów React i nie przechwytuje poleceń start/stop. Wyszukiwarka otwiera oryginalne okno Pterodactyla, a przycisk wylogowania wywołuje oryginalną akcję. Dostęp administratora jest wyświetlany tylko wtedy, gdy panel udostępnia go użytkownikowi.

## Jedna komenda naprawy lub aktualizacji na VPS z panelem WWW
```bash
sudo bash -c 'set -e; D=$(mktemp -d); git clone --depth 1 https://github.com/hurtyxs56/npomega-panel.git "$D/repo"; bash "$D/repo/themes/drakoria-purple/full/v1/aktualizuj.sh" /var/www/pterodactyl'
```

Skrypt działa zarówno po wcześniejszym zainstalowaniu EUFORIE, jak i po uruchomieniu skryptu `ratunek.sh` (gdy odłączono szablony, ale pozostały pliki). Najpierw zapisuje kopię obu szablonów i zasobów, aktualizuje podpięcie w Blade, czyści cache widoków i porównuje skopiowane pliki z repo. Nie aktualizuje Pterodactyla, nie zmienia bazy danych i nie restartuje Wings ani Minecrafta. W razie błędu skrypt przywraca szablony i zasoby z kopii.

## Pierwsza instalacja
```bash
sudo bash themes/drakoria-purple/full/v1/instaluj.sh /var/www/pterodactyl
```
Przed instalacją warto sprawdzić, czy nie działa inny motyw Pterodactyla. Nie należy łączyć go z dawnym NPΩ.

## Kontrolki na lewym pasku
Panel główny; konsola; pliki; bazy danych; harmonogram; użytkownicy; kopie zapasowe; sieć; uruchamianie; ustawienia; aktywność; konto; klucze API/SSH; wyszukiwanie; wylogowanie; administracja (dla administratorów). Dostępne sekcje serwera są pobierane z oryginalnej nawigacji z uwzględnieniem uprawnień.

Górny pasek jest ukrywany **dopiero po wykryciu działających oryginalnych przycisków wyszukiwania i wylogowania**. W razie problemu można go przywrócić klikając `Przywróć pasek awaryjnie` na lewym pasku. To zabezpieczenie, nie drugi stały pasek.

## Cofnięcie GUI
```bash
sudo bash themes/drakoria-purple/ratunek.sh /var/www/pterodactyl
```
Wyłącza motyw z szablonów bez ruszania gier. Nie usuwaj backupów `storage/app/euforie-safe-updates/`.

## Ważne
Wersja 3.1 została sprawdzona pod kątem składni JavaScript i obecności bezpiecznych ścieżek do oryginalnych kontrolek, ale nie była przetestowana w Twojej konkretnej instalacji Mathost ani w przeglądarce produkcyjnego panelu. Gdyby po aktualizacji problem pozostał, prześlij błąd z konsoli przeglądarki i wynik instalatora. Nie wykonuj kolejnych instalacji w ciemno.
