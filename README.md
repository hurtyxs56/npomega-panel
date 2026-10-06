# NPΩ Panel

Czarno-czerwony motyw dla **Pterodactyla 1.15.1**. Działa na istniejącym panelu: konta, logowanie, konsola, pliki i sterowanie serwerami nadal są obsługiwane przez Pterodactyla.

## Co zawiera

- Branding NPΩ, ciemne tło, czerwone akcenty i nowe karty serwerów.
- Wygląd logowania, nawigacji oraz administracji.
- Polskie podpisy nawigacji klienta, menu administracji i podstawowego formularza logowania. **To częściowe tłumaczenie**, nie pełna polonizacja: komunikaty błędów, opisy i pozostałe formularze mogą być angielskie.
- Instalację bez Node.js, Yarn i przebudowy frontendu.
- Sprawdzenie zgodności szablonów, automatyczną kopię i polecenie cofania zmian.

## Podgląd

Otwórz `preview/index.html` w przeglądarce po pobraniu całego repozytorium. Widoki **Moje serwery**, **Konsola** i **Logowanie** zawierają wyłącznie dane przykładowe. Podgląd pokazuje kierunek wizualny; nie jest uruchomioną instalacją Pterodactyla. Elementy konsoli i układ podglądu nie zastępują oryginalnych komponentów w prawdziwym panelu.

## Instalacja na VPS-ie

Wymagania: Linux, Python **3.9+**, PHP CLI i działający Pterodactyl **1.15.1** w `/var/www/pterodactyl`. Przy innej lokalizacji dopisz `--panel /twoja/sciezka` do polecenia.

Repozytorium jest prywatne. Pobierz je na komputerze z GitHuba przez **Code → Download ZIP**, rozpakuj i prześlij folder na VPS, np. do `/root/npomega-panel`. Alternatywnie użyj `git clone` z już skonfigurowanym dostępem SSH do GitHuba. Nie wpisuj tokenów GitHub w publiczne komendy ani w wiadomości.

Sprawdzenie bez zmian:

```bash
sudo python3 /root/npomega-panel/install.py install --dry-run
```

Instalacja:

```bash
sudo python3 /root/npomega-panel/install.py install
```

Potem odśwież panel przez **Ctrl+F5**. Instalator nie restartuje Wings ani serwerów gier. Nie zmienia `.env`, bazy danych, kont ani uprawnień.

Jeśli pojawi się `Zmieniony szablon`, instalator zatrzyma się przed zmianami. Oznacza to, że szablon różni się od sprawdzonej wersji, np. przez wcześniejszy motyw. Potrzebne jest dopasowanie do obecnych plików; nie wymuszaj nadpisania.

## Cofnięcie

```bash
sudo python3 /root/npomega-panel/install.py uninstall
```

Przywraca dokładne kopie dwóch szablonów i usuwa trzy pliki NPΩ. Odmawia cofnięcia, jeśli pliki zmieniono od czasu instalacji, aby nie zgubić późniejszej pracy. Kopie zostają w `storage/app/npomega-backup-*`; manifest jest w `storage/app/npomega-theme.json`. Instalator nie tworzy kopii bazy, bo jej nie zmienia.

Aktualizacja motywu: cofnij starą wersję, pobierz nowy kod, ponownie zainstaluj. Przed aktualizacją samego Pterodactyla cofnij motyw. Inne wersje panelu wymagają ponownej weryfikacji zgodności.

## Weryfikacja

```bash
python3 -m unittest discover -s tests -v
node --check assets/npomega.js
```

Testy instalatora sprawdzają zgodność z oryginalnymi szablonami, instalację/cofanie, odrzucanie innych wersji i modyfikacji, uszkodzoną kopię oraz rollback po błędzie czyszczenia cache. W testach wywołanie PHP jest zastąpione atrapą. Testy nie uruchamiają pełnego backendu panelu ani Wings.

Plik `tests/browser.cjs` uruchamia lokalny test przeglądarkowy, jeśli dostępny jest Playwright z Chromium (`node tests/browser.cjs`). Sprawdza podgląd w dwóch rozmiarach, skrypt nawigacji/logowania i pozostawienie danych użytkownika oraz konsoli bez zmian.

Weryfikacja pierwszej wersji: **10 testów instalatora zakończonych powodzeniem** oraz poprawna składnia JavaScript. Test przeglądarkowy został przygotowany, ale nie uruchomił się w środowisku budowania z powodu braku Chromium i nieudanego pobrania przeglądarki. Pełny wygląd i zachowanie na komputerze oraz telefonie wymagają sprawdzenia na panelu testowym.

Pierwsza wersja nie została sprawdzona na produkcyjnym VPS-ie. Po instalacji sprawdź logowanie, konsolę i przejście do plików. Motyw wymaga współczesnej przeglądarki z obsługą CSS `:has()`.

## Zakres plików

Instalator dodaje odnośniki do zasobów w `resources/views/templates/wrapper.blade.php` oraz `resources/views/layouts/admin.blade.php`; zasoby umieszcza w `public/npomega/`. Po zmianie czyści wyłącznie skompilowane widoki Blade przez `php artisan view:clear`. Oryginalne pliki JavaScript Pterodactyla pozostają bez zmian.

Kod bazuje na strukturze oficjalnych szablonów [Pterodactyl v1.15.1](https://github.com/pterodactyl/panel/tree/v1.15.1). Dwie niezmienione kopie szablonów w `tests/fixtures/` służą wyłącznie testom; ich licencja znajduje się w `THIRD_PARTY_LICENSE.md`.
