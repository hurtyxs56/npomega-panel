# Drakoria Purple — GUI Pterodactyl PL
Pełne, jawne pliki motywu: CSS, JS, SVG, instalator, cofanie i podgląd HTML.
Na Pterodactylu 1.x motyw jest wstrzykiwany w standardowe Blade i zachowuje funkcjonalne przyciski, konsolę oraz uprawnienia oryginalnego panelu. Nie podmienia API, Wings ani bazy danych. Nie jest pikselowo identyczny z grafiką koncepcyjną.

## Instalacja (na VPS z panelem WWW)
Z katalogu repozytorium:
    sudo bash themes/drakoria-purple/instaluj.sh /var/www/pterodactyl
Nowy instalator NIE używa starego NPΩ sprawdzającego dokładnie wersję 1.15.1; waliduje obecność kompatybilnych szablonów. Tworzy kopię obu szablonów w storage/app/drakoria-purple-backup/.
Gdy poprzedni motyw NPΩ jest zainstalowany, instalator kończy pracę bez zmian — trzeba go najpierw bezpiecznie odinstalować.

## Cofanie
    sudo bash themes/drakoria-purple/full/v1/odinstaluj.sh /var/www/pterodactyl

## Pliki
- full/v1/assets/gui.css, gui.js, logo.svg, dragon-landscape.svg
- full/v1/instaluj.sh, odinstaluj.sh, patch_blade.py
- full/v2/instaluj.sh, theme/theme.json i theme/assets/tokens.css
- full/preview/index.html (statyczny podgląd)

Dla 2.x wymagane jest natywne polecenie p:theme:apply; wariant 2.x zmienia jedynie kolory. Sprawdź działanie na własnej wersji panelu przed wdrożeniem produkcyjnym.