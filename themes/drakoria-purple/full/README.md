# EUFORIE Purple — polski motyw Pterodactyl 1.x

Prawdziwe pliki GUI: CSS, JavaScript, SVG, instalator, aktualizator, cofanie i statyczny podgląd. To nakładka na oryginalny frontend Pterodactyl, dlatego przyciski sterowania, pliki, konsola i inne operacje pozostają obsługiwane przez panel oraz jego uprawnienia.

## Nowości 2.3.0
- Naprawiono niebieski błysk (FOUC) na telefonie: ciemne CSS od początku dokumentu i ciemny kolor paska mobilnej przeglądarki.
- Aktualizator potwierdza zgodność JS/CSS z repo i wersję odnośników 2.3.0.

- Branding **EUFORIE** (zamiast Drakoria).
- Zlikwidowany zdublowany górny pasek nawigacji po załadowaniu panelu.
- Menu boczne z prawdziwymi linkami do sekcji serwera.
- Dostęp do wyszukiwarki, konta, administracji i wylogowania w menu bocznym.
- Zmodernizowane ciemno-fioletowe tło konsoli, kart, przycisków i listy plików.
- Automatyczna kopia poprzednich zasobów podczas aktualizacji.
- Oryginalna nawigacja nie jest ukrywana, jeśli nowy interfejs nie załadował się poprawnie.

## Aktualizacja istniejącej instalacji
W katalogu repozytorium:

```bash
sudo bash themes/drakoria-purple/full/v1/aktualizuj.sh /var/www/pterodactyl
```

Przy aktualizacji kopie plików trafiają do `storage/app/euforie-purple-updates/`. Zasoby są podmieniane w katalogu `public/purple-ptero/`, a wersja odnośników CSS/JS jest zwiększana, żeby nie pozostały w pamięci podręcznej przeglądarki. W razie błędu podczas podmiany skrypt próbuje przywrócić kopię. Nie dotyka Wings ani plików serwerów gier.

## Pierwsza instalacja Pterodactyl 1.x
```bash
sudo bash themes/drakoria-purple/instaluj.sh /var/www/pterodactyl
```
Instalator weryfikuje obecność odpowiednich szablonów i tworzy kopie Blade w `storage/app/drakoria-purple-backup/`. Nie wymusza konkretnej wersji 1.15.1. Gdy włączony jest poprzedni motyw NPΩ, zatrzyma instalację, żeby nie nadpisać cudzych modyfikacji.

## Cofanie
```bash
sudo bash themes/drakoria-purple/full/v1/odinstaluj.sh /var/www/pterodactyl
```

## Wariant 2.x
Pliki w `full/v2/` wykorzystują natywną komendę `p:theme:apply` i dotyczą wyłącznie paneli oferujących ten mechanizm; są osobnym, uproszczonym wariantem kolorystycznym.

Ścieżka folderu w repozytorium nadal zawiera historyczne `drakoria-purple`, aby stare linki i komendy instalacyjne nie przestały działać. To nie jest nazwa widoczna w GUI.

**Ograniczenia:** wygląd w przeglądarce zależy od używanej wersji Pterodactyla i ewentualnych innych modyfikacji. Aktualizator nie był uruchamiany na Twoim produkcyjnym VPS; przed wdrożeniem warto wykonać snapshot VPS lub kopię całego panelu. Pokazowy HTML nie pobiera danych serwera.

## Uwaga na cache
Po wykonaniu `aktualizuj.sh` odśwież panel; na telefonie, jeżeli interfejs jest nadal stary, usuń cache *witryny panelu* (nie danych serwera). Poprawkę potwierdzają komunikat `SUKCES: EUFORIE 2.3.0` oraz znacznik `EUFORIE_PRELOAD_BEGIN` w `resources/views/templates/wrapper.blade.php`.
