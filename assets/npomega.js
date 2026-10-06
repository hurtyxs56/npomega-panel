/* NPΩ Panel · only known navigation/auth labels are translated. */
(() => {
  'use strict';
  if (window.__npomegaLoaded) return;
  window.__npomegaLoaded = true;
  // Runs after Blade's configuration and before the original React bundle.
  if (window.SiteConfiguration && typeof window.SiteConfiguration === 'object') {
    window.SiteConfiguration.name = 'NPΩ Panel';
  }
  const labels = new Map(Object.entries({
  "Dashboard": "Moje serwery",
  "Console": "Konsola",
  "Files": "Pliki",
  "File Manager": "Menedżer plików",
  "Databases": "Bazy danych",
  "Schedules": "Harmonogramy",
  "Users": "Użytkownicy",
  "Backups": "Kopie zapasowe",
  "Network": "Sieć",
  "Startup": "Uruchamianie",
  "Settings": "Ustawienia",
  "Activity": "Aktywność",
  "Account": "Konto",
  "Account Overview": "Przegląd konta",
  "Account Settings": "Ustawienia konta",
  "Account Password": "Hasło konta",
  "Account API": "API konta",
  "Account Activity Log": "Dziennik aktywności konta",
  "API Credentials": "Klucze API",
  "API Keys": "Klucze API",
  "SSH Keys": "Klucze SSH",
  "Overview": "Przegląd",
  "Application API": "API aplikacji",
  "Locations": "Lokalizacje",
  "Nodes": "Węzły",
  "Servers": "Serwery",
  "Mounts": "Punkty montowania",
  "Nests": "Gniazda",
  "BASIC ADMINISTRATION": "ADMINISTRACJA",
  "MANAGEMENT": "ZARZĄDZANIE",
  "SERVICE MANAGEMENT": "KONFIGURACJA USŁUG",
  "Login to Continue": "Zaloguj się do NPΩ",
  "Username or Email": "Nazwa użytkownika lub e-mail",
  "Password": "Hasło",
  "Login": "Zaloguj się",
  "Log in": "Zaloguj się",
  "Sign In": "Zaloguj się",
  "Sign Out": "Wyloguj się",
  "Logout": "Wyloguj się",
  "Forgot password?": "Nie pamiętasz hasła?",
  "Forgot Password?": "Nie pamiętasz hasła?",
  "Return to Login": "Wróć do logowania",
  "Go to Login": "Przejdź do logowania",
  "Email": "E-mail",
  "Email Address": "Adres e-mail",
  "Reset Password": "Zresetuj hasło",
  "Send Password Reset Email": "Wyślij link do resetowania",
  "Request Password Reset": "Poproś o reset hasła",
  "Confirm Password": "Potwierdź hasło",
  "Confirm New Password": "Potwierdź nowe hasło",
  "Current Password": "Obecne hasło",
  "New Password": "Nowe hasło",
  "Two-Factor Authentication": "Uwierzytelnianie dwuskładnikowe",
  "Authentication Code": "Kod uwierzytelniający",
  "Recovery Code": "Kod odzyskiwania",
  "Two-Step Verification": "Weryfikacja dwuetapowa",
  "Two-Step Authentication Enabled": "Weryfikacja dwuetapowa jest włączona",
  "Enable Two-Step": "Włącz weryfikację dwuetapową",
  "Enable Two-Step Verification": "Włącz weryfikację dwuetapową",
  "Disable Two-Step": "Wyłącz weryfikację dwuetapową",
  "Disable Two-Step Verification": "Wyłącz weryfikację dwuetapową",
  "Disabling two-step verification will make your account less secure.": "Wyłączenie weryfikacji dwuetapowej zmniejszy bezpieczeństwo konta.",
  "These codes will not be shown again.": "Te kody nie zostaną ponownie wyświetlone.",
  "Authentication Required": "Wymagane uwierzytelnienie",
  "2-Factor Required": "Wymagana weryfikacja dwuetapowa",
  "Device Checkpoint": "Weryfikacja urządzenia",
  "Your account must have two-factor authentication enabled in order to continue.": "Aby kontynuować, włącz uwierzytelnianie dwuskładnikowe na swoim koncie.",
  "You must enter your account password to continue.": "Aby kontynuować, wpisz hasło do konta.",
  "Passwords must be at least 8 characters in length.": "Hasło musi mieć co najmniej 8 znaków.",
  "Update Email": "Zmień e-mail",
  "Update Email Address": "Zmień adres e-mail",
  "Update Password": "Zmień hasło",
  "Your primary email has been updated.": "Twój główny adres e-mail został zmieniony.",
  "Username": "Nazwa użytkownika",
  "Start": "Uruchom",
  "Stop": "Zatrzymaj",
  "Kill": "Wymuś zatrzymanie",
  "Restart": "Restart",
  "Start the server": "Uruchom serwer",
  "Stop the server": "Zatrzymaj serwer",
  "Restart the server": "Uruchom serwer ponownie",
  "Terminate the server": "Wymuś zatrzymanie serwera",
  "Forcibly Stop Process": "Wymuś zatrzymanie procesu",
  "Forcibly stopping a server can lead to data corruption.": "Wymuszenie zatrzymania serwera może spowodować uszkodzenie danych.",
  "Type a command...": "Wpisz komendę…",
  "Console command input.": "Pole komendy konsoli.",
  "Address": "Adres",
  "Server Address": "Adres serwera",
  "Uptime": "Czas działania",
  "CPU Load": "Procesor",
  "Memory": "Pamięć RAM",
  "Disk": "Dysk",
  "Network (Inbound)": "Sieć — pobrano",
  "Network (Outbound)": "Sieć — wysłano",
  "Inbound": "Pobieranie",
  "Outbound": "Wysyłanie",
  "Online": "Włączony",
  "Offline": "Wyłączony",
  "Starting": "Uruchamianie",
  "Stopping": "Zatrzymywanie",
  "Running": "Uruchomiony",
  "Installing": "Instalowanie",
  "Unavailable": "Niedostępny",
  "Suspended": "Zawieszony",
  "Connection Error": "Błąd połączenia",
  "Under Maintenance": "Przerwa techniczna",
  "Transferring": "Przenoszenie",
  "Restoring Backup": "Przywracanie kopii",
  "Unlimited": "Bez limitu",
  "Showing your servers": "Twoje serwery",
  "Showing others' servers": "Serwery innych użytkowników",
  "There are no servers associated with your account.": "Do Twojego konta nie przypisano żadnego serwera.",
  "There are no other servers to display.": "Brak innych serwerów do wyświetlenia.",
  "Save": "Zapisz",
  "Save Changes": "Zapisz zmiany",
  "Save Settings": "Zapisz ustawienia",
  "Save Modifications": "Zapisz zmiany",
  "Save Content": "Zapisz zawartość",
  "Create": "Utwórz",
  "Add": "Dodaj",
  "Edit": "Edytuj",
  "Update": "Zaktualizuj",
  "Delete": "Usuń",
  "Remove": "Usuń",
  "Cancel": "Anuluj",
  "Close": "Zamknij",
  "Continue": "Kontynuuj",
  "Confirm": "Potwierdź",
  "Submit": "Zatwierdź",
  "Done": "Gotowe",
  "Okay": "OK",
  "I Accept": "Akceptuję",
  "Yes": "Tak",
  "No": "Nie",
  "None": "Brak",
  "None All": "Brak uprawnień",
  "All": "Wszystkie",
  "Enabled": "Włączone",
  "Disabled": "Wyłączone",
  "Enable": "Włącz",
  "Disable": "Wyłącz",
  "Active": "Aktywne",
  "Name": "Nazwa",
  "Description": "Opis",
  "Notes": "Notatki",
  "Note": "Uwaga",
  "Details": "Szczegóły",
  "Created": "Utworzono",
  "Created by": "Utworzone przez",
  "Last Used": "Ostatnie użycie",
  "Status": "Stan",
  "Action": "Akcja",
  "Actions": "Akcje",
  "Search": "Szukaj",
  "Search term": "Wyszukiwana fraza",
  "Enter a server name, uuid, or allocation to begin searching.": "Wpisz nazwę serwera, UUID lub przypisany adres, aby wyszukać.",
  "Clear Filters": "Wyczyść filtry",
  "Error": "Błąd",
  "Success": "Sukces",
  "Failed": "Niepowodzenie",
  "Processing": "Przetwarzanie",
  "Oops!": "Coś poszło nie tak",
  "Access Denied": "Brak dostępu",
  "You do not have permission to access this page.": "Nie masz uprawnień do tej strony.",
  "An error was encountered by the application while rendering this view. Try refreshing the page.": "Wystąpił błąd podczas wyświetlania tego widoku. Spróbuj odświeżyć stronę.",
  "Network Error": "Błąd połączenia sieciowego",
  "Request failed with status code 403": "Brak uprawnień do wykonania tej operacji.",
  "Request failed with status code 404": "Nie znaleziono żądanego elementu.",
  "Request failed with status code 500": "Wystąpił błąd serwera.",
  "Request failed with status code 502": "Serwer pośredniczący nie uzyskał poprawnej odpowiedzi.",
  "Request failed with status code 504": "Przekroczono czas oczekiwania na serwer.",
  "Unauthenticated.": "Sesja wygasła. Zaloguj się ponownie.",
  "This action is unauthorized.": "Nie masz uprawnień do wykonania tej operacji.",
  "The given data was invalid.": "Podane dane są nieprawidłowe.",
  "No account matching those credentials could be found.": "Nie znaleziono konta z takimi danymi logowania.",
  "The two-factor authentication token was invalid.": "Kod uwierzytelniania dwuskładnikowego jest nieprawidłowy.",
  "A username or email must be provided.": "Podaj nazwę użytkownika lub adres e-mail.",
  "Please enter your account password.": "Wpisz hasło do konta.",
  "Admin": "Administracja",
  "Administrator": "Administrator",
  "Administrative Overview": "Przegląd administracyjny",
  "Basic Details": "Podstawowe dane",
  "Base Information": "Informacje podstawowe",
  "Core Details": "Główne dane",
  "Advanced": "Zaawansowane",
  "Advanced Settings": "Ustawienia zaawansowane",
  "Advanced:": "Zaawansowane:",
  "At-a-Glance": "Podsumowanie",
  "System Information": "Informacje o systemie",
  "Panel Settings": "Ustawienia panelu",
  "General Configuration": "Konfiguracja ogólna",
  "Configure Pterodactyl to your liking.": "Dostosuj ustawienia Pterodactyla.",
  "Configure advanced settings for Pterodactyl.": "Skonfiguruj zaawansowane ustawienia Pterodactyla.",
  "A quick glance at your system.": "Podstawowe informacje o systemie.",
  "About": "Informacje",
  "Documentation": "Dokumentacja",
  "Get Help": "Uzyskaj pomoc",
  "Support the Project": "Wesprzyj projekt",
  "More info": "Więcej informacji",
  "Information": "Informacje",
  "Warning!": "Uwaga!",
  "Danger!": "Niebezpieczeństwo!",
  "Default Language": "Domyślny język",
  "Company Name": "Nazwa panelu",
  "Require 2-Factor Authentication": "Wymagaj uwierzytelniania dwuskładnikowego",
  "Admin Only": "Tylko administratorzy",
  "All Users": "Wszyscy użytkownicy",
  "Not Required": "Niewymagane",
  "Mail Settings": "Ustawienia poczty",
  "Email Settings": "Ustawienia e-mail",
  "SMTP Host": "Serwer SMTP",
  "SMTP Port": "Port SMTP",
  "Mail From": "Adres nadawcy",
  "Mail From Name": "Nazwa nadawcy",
  "Encryption": "Szyfrowanie",
  "Configure how Pterodactyl should handle sending emails.": "Skonfiguruj wysyłanie wiadomości e-mail przez Pterodactyla.",
  "Enter the SMTP server address that mail should be sent through.": "Wpisz adres serwera SMTP do wysyłania poczty.",
  "Enter the SMTP server port that mail should be sent through.": "Wpisz port serwera SMTP.",
  "The username to use when connecting to the SMTP server.": "Nazwa użytkownika do połączenia z serwerem SMTP.",
  "Enter an email address that all outgoing emails will originate from.": "Wpisz adres e-mail nadawcy wiadomości.",
  "The name that emails should appear to come from.": "Nazwa nadawcy wyświetlana w wiadomościach.",
  "Select the type of encryption to use when sending mail.": "Wybierz sposób szyfrowania wysyłanej poczty.",
  "Test": "Testuj",
  "Send Email": "Wyślij e-mail",
  "Connection Timeout": "Limit czasu połączenia",
  "Request Timeout": "Limit czasu żądania",
  "The amount of time in seconds to wait for a connection to be opened before throwing an error.": "Czas oczekiwania na nawiązanie połączenia w sekundach.",
  "The amount of time in seconds to wait for a request to be completed before throwing an error.": "Czas oczekiwania na zakończenie żądania w sekundach.",
  "Site Key": "Klucz witryny",
  "Secret Key": "Klucz tajny",
  "Used for communication between your site and Google. Be sure to keep it a secret.": "Klucz do komunikacji witryny z Google. Zachowaj go w tajemnicy.",
  "If enabled, login forms and password reset forms will do a silent captcha check and display a visible captcha if needed.": "Po włączeniu formularze logowania i resetowania hasła sprawdzają CAPTCHA w tle, a w razie potrzeby wyświetlają zadanie.",
  "If enabled, any account falling into the selected grouping will be required to have 2-Factor authentication enabled to use the Panel.": "Konta z wybranej grupy będą musiały włączyć uwierzytelnianie dwuskładnikowe, aby korzystać z panelu.",
  "User List": "Lista użytkowników",
  "User Details": "Dane użytkownika",
  "Create User": "Utwórz użytkownika",
  "Delete User": "Usuń użytkownika",
  "New User": "Nowy użytkownik",
  "User Email": "E-mail użytkownika",
  "Client First Name": "Imię użytkownika",
  "Client Last Name": "Nazwisko użytkownika",
  "Client Name": "Nazwa użytkownika",
  "First Name": "Imię",
  "Last Name": "Nazwisko",
  "Servers Owned": "Posiadane serwery",
  "Subuser Of": "Dostęp do serwerów",
  "All registered users on the system.": "Wszyscy użytkownicy zarejestrowani w systemie.",
  "Add a new user to the system.": "Dodaj nowego użytkownika do systemu.",
  "Setting this to 'Yes' gives a user full administrative access.": "Wybór „Tak” nadaje użytkownikowi pełne uprawnienia administratora.",
  "Leave blank to keep this user's password the same. User will not receive any notification if password is changed.": "Pozostaw puste, aby zachować obecne hasło. Zmiana hasła nie powoduje wysłania powiadomienia.",
  "Providing a user password is optional. New user emails prompt users to create a password the first time they login. If a password is provided here you will need to find a different method of providing it to the user.": "Hasło jest opcjonalne. Nowy użytkownik otrzyma e-mail z możliwością jego ustawienia. Jeśli wpiszesz hasło tutaj, przekaż je użytkownikowi samodzielnie.",
  "There must be no servers associated with this account in order for it to be deleted.": "Przed usunięciem konta odłącz od niego wszystkie serwery.",
  "New Credentials": "Nowy klucz dostępu",
  "Credentials List": "Lista kluczy dostępu",
  "Create Credentials": "Utwórz klucz dostępu",
  "Create API Key": "Utwórz klucz API",
  "Delete API Key": "Usuń klucz API",
  "Delete Key": "Usuń klucz",
  "Your API Key": "Twój klucz API",
  "Allowed IPs": "Dozwolone adresy IP",
  "A description of this API key.": "Opis tego klucza API.",
  "Create a new application API key.": "Utwórz nowy klucz API aplikacji.",
  "Control access credentials for managing this Panel via the API.": "Zarządzaj kluczami dostępu do API panelu.",
  "Permissions": "Uprawnienia",
  "Select Permissions": "Wybierz uprawnienia",
  "Read": "Odczyt",
  "Read All": "Odczyt wszystkiego",
  "Read Only": "Tylko odczyt",
  "Read & Write": "Odczyt i zapis",
  "Read & Write All": "Odczyt i zapis wszystkiego",
  "Can Access": "Dostęp",
  "Once you have assigned permissions and created this set of credentials you will be unable to come back and edit it. If you need to make changes down the road you will need to create a new set of credentials.": "Po utworzeniu klucza nie można zmienić jego uprawnień. W razie potrzeby utwórz nowy klucz.",
  "Add SSH Key": "Dodaj klucz SSH",
  "Delete SSH Key": "Usuń klucz SSH",
  "SSH Key Name": "Nazwa klucza SSH",
  "Public Key": "Klucz publiczny",
  "Enter your public SSH key.": "Wklej swój publiczny klucz SSH.",
  "Database": "Baza danych",
  "New Database": "Nowa baza danych",
  "Create Database": "Utwórz bazę danych",
  "Create New Database": "Utwórz nową bazę danych",
  "Create new database": "Utwórz nową bazę danych",
  "Database Name": "Nazwa bazy danych",
  "Delete Database": "Usuń bazę danych",
  "Confirm Database Name": "Potwierdź nazwę bazy danych",
  "Confirm database deletion": "Potwierdź usunięcie bazy danych",
  "Enter the database name to confirm deletion.": "Wpisz nazwę bazy danych, aby potwierdzić usunięcie.",
  "Database connection details": "Dane połączenia z bazą danych",
  "A descriptive name for your database instance.": "Nazwa opisująca tę bazę danych.",
  "Connections From": "Połączenia z adresów",
  "Connections from": "Połączenia z adresów",
  "Connections": "Połączenia",
  "Connection": "Połączenie",
  "Concurrent Connections": "Jednoczesne połączenia",
  "Max Connections": "Maksymalna liczba połączeń",
  "Rotate Password": "Wygeneruj nowe hasło",
  "JDBC Connection String": "Adres połączenia JDBC",
  "Endpoint": "Punkt połączenia",
  "Database Host": "Host bazy danych",
  "Database Hosts": "Hosty baz danych",
  "Host": "Host",
  "Host Details": "Dane hosta",
  "Host List": "Lista hostów",
  "Create New Database Host": "Dodaj host bazy danych",
  "Active Databases": "Aktywne bazy danych",
  "Database Limit": "Limit baz danych",
  "Database hosts that servers can have databases created on.": "Hosty, na których można tworzyć bazy danych dla serwerów.",
  "Viewing associated databases and details for this database host.": "Bazy danych i szczegóły tego hosta.",
  "The IP address or FQDN that should be used when attempting to connect to this MySQL host": "Adres IP lub domena do połączenia z tym hostem MySQL.",
  "The port that MySQL is running on for this host.": "Port MySQL na tym hoście.",
  "The username of an account that has enough permissions to create new users and databases on the system.": "Nazwa konta z uprawnieniami do tworzenia użytkowników i baz danych.",
  "The password to the account defined.": "Hasło do wskazanego konta.",
  "The password to the account defined. Leave blank to continue using the assigned password.": "Hasło do wskazanego konta. Pozostaw puste, aby zachować obecne.",
  "Do not use the same account details for MySQL that you have defined for this panel.": "Użyj innego konta MySQL niż konto używane przez ten panel.",
  "Select the host database server that this database should be created on.": "Wybierz host, na którym ma powstać baza danych.",
  "A username and password for this database will be randomly generated after form submission.": "Nazwa użytkownika i hasło zostaną wygenerowane po wysłaniu formularza.",
  "Manage server databases.": "Zarządzaj bazami danych serwera.",
  "New File": "Nowy plik",
  "Create File": "Utwórz plik",
  "Create Directory": "Utwórz katalog",
  "File Name": "Nazwa pliku",
  "File Mode": "Tryb pliku",
  "File Uploads": "Przesyłanie plików",
  "Rename": "Zmień nazwę",
  "Copy": "Kopiuj",
  "Move": "Przenieś",
  "New location:": "Nowa lokalizacja:",
  "Archive": "Spakuj",
  "Unarchive": "Rozpakuj",
  "Download": "Pobierz",
  "Upload": "Prześlij",
  "Delete Files": "Usuń pliki",
  "Cancel Uploads": "Anuluj przesyłanie",
  "Drag and drop files to upload.": "Przeciągnij i upuść pliki, aby je przesłać.",
  "The following files are being uploaded to your server.": "Poniższe pliki są przesyłane na serwer.",
  "This directory seems to be empty.": "Ten katalog jest pusty.",
  "Enter the name that this file should be saved as.": "Wpisz nazwę, pod którą chcesz zapisać plik.",
  "Launch SFTP": "Otwórz SFTP",
  "SFTP Details": "Dane SFTP",
  "Your SFTP password is the same as the password you use to access this panel.": "Hasło SFTP jest takie samo jak hasło do panelu.",
  "Schedule name": "Nazwa harmonogramu",
  "Create schedule": "Utwórz harmonogram",
  "Delete Schedule": "Usuń harmonogram",
  "Schedule Enabled": "Harmonogram włączony",
  "A human readable identifier for this schedule.": "Czytelna nazwa tego harmonogramu.",
  "This schedule will be executed automatically if enabled.": "Włączony harmonogram będzie wykonywany automatycznie.",
  "Only When Server Is Online": "Tylko przy włączonym serwerze",
  "Only execute this schedule when the server is in a running state.": "Wykonuj harmonogram tylko wtedy, gdy serwer jest uruchomiony.",
  "There are no schedules configured for this server.": "Ten serwer nie ma skonfigurowanych harmonogramów.",
  "Minute": "Minuta",
  "Hour": "Godzina",
  "Day (Month)": "Dzień miesiąca",
  "Day (Week)": "Dzień tygodnia",
  "Day of month": "Dzień miesiąca",
  "Day of week": "Dzień tygodnia",
  "Month": "Miesiąc",
  "Show Cheatsheet": "Pokaż pomoc",
  "Show the cron cheatsheet for some examples.": "Pokaż przykłady składni harmonogramu cron.",
  "Examples": "Przykłady",
  "Special Characters": "Znaki specjalne",
  "Increasing": "Przyrost",
  "Run Now": "Uruchom teraz",
  "New Task": "Nowe zadanie",
  "Edit scheduled task": "Edytuj zaplanowane zadanie",
  "Delete scheduled task": "Usuń zaplanowane zadanie",
  "Confirm task deletion": "Potwierdź usunięcie zadania",
  "Are you sure you want to delete this task? This action cannot be undone.": "Czy na pewno usunąć to zadanie? Tej operacji nie można cofnąć.",
  "Payload": "Treść zadania",
  "Time offset (in seconds)": "Opóźnienie w sekundach",
  "Continue on Failure": "Kontynuuj po błędzie",
  "Continues on Failure": "Kontynuuje po błędzie",
  "Future tasks will be run when this task fails.": "Kolejne zadania zostaną wykonane także wtedy, gdy to zadanie zakończy się błędem.",
  "Send command": "Wyślij komendę",
  "Send power action": "Zmień stan zasilania",
  "Start backup": "Rozpocznij tworzenie kopii",
  "All tasks will be removed and any running processes will be terminated.": "Wszystkie zadania zostaną usunięte, a wykonywane procesy zatrzymane.",
  "Backup name": "Nazwa kopii zapasowej",
  "Create backup": "Utwórz kopię zapasową",
  "Create server backup": "Utwórz kopię serwera",
  "Restore": "Przywróć",
  "Locked": "Zablokowana",
  "Ignored Files": "Pomijane pliki",
  "Ignored Files & Directories": "Pomijane pliki i katalogi",
  "If provided, the name that should be used to reference this backup.": "Opcjonalna nazwa tej kopii zapasowej.",
  "Prevents this backup from being deleted until explicitly unlocked.": "Chroni tę kopię przed usunięciem do czasu odblokowania.",
  "This backup will no longer be protected from automated or accidental deletions.": "Ta kopia nie będzie już chroniona przed automatycznym lub przypadkowym usunięciem.",
  "This is a permanent operation. The backup cannot be recovered once deleted.": "To operacja nieodwracalna. Usuniętej kopii nie można odzyskać.",
  "Delete all files before restoring backup.": "Usuń wszystkie pliki przed przywróceniem kopii.",
  "Backups cannot be created for this server because the backup limit is set to 0.": "Nie można tworzyć kopii tego serwera, ponieważ limit kopii wynosi 0.",
  "Edit subuser": "Edytuj dodatkowego użytkownika",
  "Delete subuser": "Usuń dodatkowego użytkownika",
  "Delete this subuser?": "Usunąć tego dodatkowego użytkownika?",
  "Create Allocation": "Dodaj adres i port",
  "Remove Allocation": "Usuń przypisany adres i port",
  "Make Primary": "Ustaw jako główny",
  "Primary": "Główny",
  "Port": "Port",
  "This allocation will be immediately removed from your server.": "Ten adres i port zostaną natychmiast odłączone od serwera.",
  "Startup Command": "Komenda startowa",
  "Startup Settings": "Ustawienia uruchamiania",
  "Docker Image": "Obraz Dockera",
  "Update Docker Image": "Zmień obraz Dockera",
  "Variables": "Zmienne",
  "Change Server Details": "Zmień dane serwera",
  "Server Name": "Nazwa serwera",
  "Server Description": "Opis serwera",
  "Server ID": "Identyfikator serwera",
  "Reinstall Server": "Zainstaluj serwer ponownie",
  "Confirm server reinstallation": "Potwierdź ponowną instalację serwera",
  "Yes, reinstall server": "Tak, zainstaluj ponownie",
  "Your server has begun the reinstallation process.": "Rozpoczęto ponowną instalację serwera.",
  "Debug Information": "Informacje diagnostyczne",
  "Node": "Węzeł",
  "Node under Maintenance": "Węzeł w trybie konserwacji",
  "Server Suspended": "Serwer zawieszony",
  "This server is suspended and cannot be accessed.": "Ten serwer jest zawieszony i nie można uzyskać do niego dostępu.",
  "The node of this server is currently under maintenance.": "Węzeł tego serwera jest w trybie konserwacji.",
  "The node of this server is currently under maintenance and all actions are unavailable.": "Węzeł tego serwera jest w trybie konserwacji. Wszystkie operacje są niedostępne.",
  "This server is currently running its installation process and most actions are unavailable.": "Trwa instalacja serwera. Większość operacji jest niedostępna.",
  "This server is currently being transferred to another node and all actions are unavailable.": "Serwer jest przenoszony na inny węzeł. Wszystkie operacje są niedostępne.",
  "Running Installer": "Trwa instalacja",
  "Your server should be ready soon, please try again in a few minutes.": "Serwer powinien wkrótce być gotowy. Spróbuj ponownie za kilka minut.",
  "Activity Log": "Dziennik aktywności",
  "No activity logs available for this server.": "Brak wpisów aktywności tego serwera.",
  "Using API Key": "Z użyciem klucza API",
  "Using SFTP": "Przez SFTP",
  "Metadata": "Metadane",
  "Unsupported Java Version": "Nieobsługiwana wersja Javy",
  "This server is currently running an unsupported version of Java and cannot be started.": "Serwer korzysta z nieobsługiwanej wersji Javy i nie może zostać uruchomiony.",
  "Memory or process limit reached...": "Osiągnięto limit pamięci lub procesów…",
  "This server has reached the maximum process or memory limit.": "Serwer osiągnął limit procesów lub pamięci.",
  "Out of available disk space...": "Brak wolnego miejsca na dysku…",
  "Possible resource limit reached...": "Prawdopodobnie osiągnięto limit zasobów…",
  "Invalid GSL token!": "Nieprawidłowy token GSL!",
  "It seems like your Gameserver Login Token (GSL token) is invalid or has expired.": "Token logowania serwera gry (GSL) jest nieprawidłowy lub wygasł.",
  "Update GSL Token": "Zmień token GSL",
  "GSL Token": "Token GSL",
  "Visit https://steamcommunity.com/dev/managegameservers to generate a token.": "Aby wygenerować token, otwórz https://steamcommunity.com/dev/managegameservers.",
  "Location": "Lokalizacja",
  "Location List": "Lista lokalizacji",
  "Location Details": "Dane lokalizacji",
  "Create Location": "Utwórz lokalizację",
  "Short Code": "Krótki identyfikator",
  "All locations that nodes can be assigned to for easier categorization.": "Lokalizacje służące do grupowania węzłów.",
  "A longer description of this location. Must be less than 191 characters.": "Dłuższy opis lokalizacji. Maksymalnie 190 znaków.",
  "Node List": "Lista węzłów",
  "Node Name": "Nazwa węzła",
  "New Node": "Nowy węzeł",
  "Create Node": "Utwórz węzeł",
  "Delete Node": "Usuń węzeł",
  "Yes, Delete This Node": "Tak, usuń ten węzeł",
  "Node Visibility": "Widoczność węzła",
  "Public": "Publiczny",
  "Private": "Prywatny",
  "All nodes available on the system.": "Wszystkie węzły dostępne w systemie.",
  "A quick overview of your node.": "Podsumowanie węzła.",
  "Configure your node settings.": "Skonfiguruj ustawienia węzła.",
  "Create a new local or remote node for servers to be installed to.": "Utwórz lokalny lub zdalny węzeł do instalowania serwerów.",
  "Deleting a node is a irreversible action and will immediately remove this node from the panel. There must be no servers associated with this node in order to continue.": "Usunięcie węzła jest nieodwracalne. Przed kontynuowaniem odłącz od niego wszystkie serwery.",
  "Maintenance Mode": "Tryb konserwacji",
  "Maintenance": "Konserwacja",
  "If the node is marked as 'Under Maintenance' users won't be able to access servers that are on this node.": "Gdy węzeł jest w trybie konserwacji, użytkownicy nie mogą zarządzać znajdującymi się na nim serwerami.",
  "Fully Qualified Domain Name": "Pełna nazwa domenowa",
  "Communicate Over SSL": "Połączenie szyfrowane SSL",
  "Use SSL Connection": "Użyj połączenia SSL",
  "Use HTTP Connection": "Użyj połączenia HTTP",
  "Behind Proxy": "Za serwerem proxy",
  "Not Behind Proxy": "Bez serwera proxy",
  "Daemon Port": "Port Wings",
  "Daemon SFTP Port": "Port SFTP Wings",
  "Daemon Version": "Wersja Wings",
  "Daemon Server File Directory": "Katalog plików serwerów",
  "Daemon Configuration": "Konfiguracja Wings",
  "Configuration": "Konfiguracja",
  "Configuration File": "Plik konfiguracyjny",
  "Configuration Files": "Pliki konfiguracyjne",
  "Your daemon configuration file.": "Plik konfiguracyjny Wings.",
  "Generate Token": "Wygeneruj token",
  "Reset Daemon Master Key": "Zresetuj główny klucz Wings",
  "Total Memory": "Łączna pamięć RAM",
  "Total Disk Space": "Łączna przestrzeń dyskowa",
  "Total CPU Threads": "Łączna liczba wątków CPU",
  "Total Servers": "Łączna liczba serwerów",
  "Memory Allocated": "Przydzielona pamięć RAM",
  "Allocated Memory": "Przydzielona pamięć RAM",
  "Memory Over-Allocation": "Nadprzydział pamięci RAM",
  "Disk Space": "Miejsce na dysku",
  "Disk Space Allocated": "Przydzielone miejsce na dysku",
  "Disk Over-Allocation": "Nadprzydział miejsca na dysku",
  "Overallocate": "Nadprzydział",
  "Maximum Web Upload Filesize": "Maksymalny rozmiar przesyłanego pliku",
  "Enter the directory where server files should be stored.": "Wpisz katalog przechowywania plików serwerów.",
  "Enter the maximum size of files that can be uploaded through the web-based file manager.": "Wpisz maksymalny rozmiar pliku przesyłanego przez menedżer plików.",
  "Do not use the same port that you have assigned for your physical server's SSH process.": "Nie używaj portu zajętego przez SSH serwera.",
  "Allocation": "Przypisany adres i port",
  "Allocations": "Przypisane adresy i porty",
  "Allocation Management": "Zarządzanie adresami i portami",
  "Assign New Allocations": "Przypisz nowe adresy i porty",
  "Assign Additional Ports": "Przypisz dodatkowe porty",
  "Existing Allocations": "Istniejące adresy i porty",
  "Delete Allocations": "Usuń przypisane adresy i porty",
  "Delete Allocations for IP Block": "Usuń przypisania dla bloku IP",
  "IP Address": "Adres IP",
  "IP Alias": "Alias adresu IP",
  "Ports": "Porty",
  "No Alias Assigned": "Brak aliasu",
  "Assigned To": "Przypisano do",
  "Enter an IP address to assign ports to here.": "Wpisz adres IP, do którego mają zostać przypisane porty.",
  "Enter individual ports or port ranges here separated by commas or spaces.": "Wpisz porty lub zakresy portów oddzielone przecinkami albo spacjami.",
  "If you would like to assign a default alias to these allocations enter it here.": "Wpisz opcjonalny domyślny alias dla tych przypisań.",
  "Control allocations available for servers on this node.": "Zarządzaj adresami i portami dostępnymi na tym węźle.",
  "Server": "Serwer",
  "Server List": "Lista serwerów",
  "Create Server": "Utwórz serwer",
  "Server Owner": "Właściciel serwera",
  "Server Node": "Węzeł serwera",
  "Owner": "Właściciel",
  "All servers available on the system.": "Wszystkie serwery dostępne w systemie.",
  "All servers currently assigned to this node.": "Serwery przypisane do tego węzła.",
  "Add a new server to the panel.": "Dodaj nowy serwer do panelu.",
  "A brief description of this server.": "Krótki opis serwera.",
  "Email address of the Server Owner.": "Adres e-mail właściciela serwera.",
  "External Identifier": "Zewnętrzny identyfikator",
  "Internal Identifier": "Wewnętrzny identyfikator",
  "Build Configuration": "Konfiguracja zasobów",
  "Update Build Configuration": "Zapisz konfigurację zasobów",
  "Resource Management": "Zarządzanie zasobami",
  "Allocation Limits": "Limity przypisań",
  "Allocation Limit": "Limit adresów i portów",
  "Backup Limit": "Limit kopii zapasowych",
  "Application Feature Limits": "Limity funkcji",
  "CPU Limit": "Limit procesora",
  "CPU Pinning": "Przypisanie rdzeni CPU",
  "Disk Space Limit": "Limit miejsca na dysku",
  "Allocated Swap": "Przydzielona pamięć wymiany",
  "Swap": "Pamięć wymiany",
  "Block IO Weight": "Waga operacji wejścia/wyjścia",
  "Block IO Proportion": "Priorytet operacji wejścia/wyjścia",
  "Enable OOM Killer": "Włącz OOM Killer",
  "Enabling OOM killer may cause server processes to exit unexpectedly.": "Włączenie OOM Killer może powodować nagłe kończenie procesów serwera.",
  "Default Allocation": "Główny adres i port",
  "Additional Allocation(s)": "Dodatkowe adresy i porty",
  "Default Connection": "Główne połączenie",
  "Connection Alias": "Alias połączenia",
  "Additional allocations to assign to this server on creation.": "Dodatkowe adresy i porty przypisywane przy tworzeniu serwera.",
  "The main allocation that will be assigned to this server.": "Główny adres i port przypisany do serwera.",
  "The default connection address that will be used for this game server.": "Domyślny adres połączenia z serwerem gry.",
  "The total number of allocations a user is allowed to create for this server.": "Maksymalna liczba adresów i portów, które użytkownik może utworzyć dla serwera.",
  "The total number of backups that can be created for this server.": "Maksymalna liczba kopii zapasowych tego serwera.",
  "The total number of databases a user is allowed to create for this server.": "Maksymalna liczba baz danych, które użytkownik może utworzyć dla serwera.",
  "Startup Configuration": "Konfiguracja uruchamiania",
  "Startup Command Modification": "Zmiana komendy startowej",
  "Docker Configuration": "Konfiguracja Dockera",
  "Docker Image Configuration": "Konfiguracja obrazu Dockera",
  "Docker Images": "Obrazy Dockera",
  "Start Configuration": "Konfiguracja startu",
  "Service Configuration": "Konfiguracja usługi",
  "Service Variables": "Zmienne usługi",
  "Service": "Usługa",
  "Skip Egg Install Script": "Pomiń skrypt instalacyjny jajka",
  "Start Server when Installed": "Uruchom serwer po instalacji",
  "Install Status": "Stan instalacji",
  "Toggle Install Status": "Zmień stan instalacji",
  "Install Failed": "Instalacja nieudana",
  "Process Management": "Zarządzanie procesem",
  "Suspend Server": "Zawieś serwer",
  "Unsuspend Server": "Odwieś serwer",
  "Transfer Server": "Przenieś serwer",
  "Reinstall": "Zainstaluj ponownie",
  "Delete this server from the panel.": "Usuń ten serwer z panelu.",
  "Safely Delete Server": "Usuń serwer",
  "Safely Delete This Server": "Usuń ten serwer",
  "Force Delete Server": "Wymuś usunięcie serwera",
  "Forcibly Delete This Server": "Wymuś usunięcie tego serwera",
  "Deleting a server is an irreversible action.": "Usunięcie serwera jest nieodwracalne.",
  "All server data": "Wszystkie dane serwera",
  "This could overwrite server data.": "Może to spowodować nadpisanie danych serwera.",
  "Additional actions to control this server.": "Dodatkowe operacje na serwerze.",
  "This will reinstall the server with the assigned service scripts.": "Serwer zostanie zainstalowany ponownie przy użyciu przypisanych skryptów.",
  "This is a destructive operation in many cases. This server will be stopped immediately in order for this action to proceed.": "Ta operacja może usunąć dane. Serwer zostanie natychmiast zatrzymany.",
  "This will suspend the server, stop any running processes, and immediately block the user from being able to access their files or otherwise manage the server through the panel or API.": "Serwer zostanie zawieszony i zatrzymany. Użytkownik utraci dostęp do plików oraz zarządzania serwerem przez panel i API.",
  "This will unsuspend the server and restore normal user access.": "Serwer zostanie odwieszony, a dostęp użytkownika przywrócony.",
  "Transfer this server to another node connected to this panel.": "Przenieś serwer na inny węzeł połączony z panelem.",
  "Transferring a server requires more than one node to be configured on your panel.": "Przenoszenie serwera wymaga co najmniej dwóch węzłów w panelu.",
  "The node which this server will be deployed to.": "Węzeł, na którym zostanie utworzony serwer.",
  "The node which this server will be transferred to.": "Węzeł docelowy przenoszenia serwera.",
  "Mount List": "Lista punktów montowania",
  "Mount Details": "Szczegóły punktu montowania",
  "Create Mount": "Utwórz punkt montowania",
  "Mount": "Punkt montowania",
  "Source": "Źródło",
  "Target": "Cel",
  "Mounted": "Zamontowany",
  "Unmounted": "Niezamontowany",
  "User Mountable": "Montowanie przez użytkownika",
  "Available Mounts": "Dostępne punkty montowania",
  "Manage server mounts.": "Zarządzaj punktami montowania serwera.",
  "Configure and manage additional mount points for servers.": "Konfiguruj dodatkowe punkty montowania serwerów.",
  "Unique name used to separate this mount from another.": "Unikalna nazwa tego punktu montowania.",
  "A longer description for this mount, must be less than 191 characters.": "Dłuższy opis punktu montowania. Maksymalnie 190 znaków.",
  "File path on the host system to mount to a container.": "Ścieżka na hoście, która zostanie zamontowana w kontenerze.",
  "Where the mount will be accessible inside a container.": "Ścieżka dostępu do punktu montowania w kontenerze.",
  "Is the mount read only inside the container?": "Czy punkt montowania ma być tylko do odczytu w kontenerze?",
  "Should users be able to mount this themselves?": "Czy użytkownicy mogą sami montować ten zasób?",
  "Add Eggs": "Dodaj jajka",
  "Add Nodes": "Dodaj węzły",
  "Nest": "Gniazdo",
  "New Nest": "Nowe gniazdo",
  "Nest Configuration": "Konfiguracja gniazda",
  "Nest Eggs": "Jajka w gnieździe",
  "Nest ID": "Identyfikator gniazda",
  "Configured Nests": "Skonfigurowane gniazda",
  "Associated Nest": "Powiązane gniazdo",
  "All nests currently available on this system.": "Wszystkie gniazda dostępne w systemie.",
  "Configure a new nest to deploy to all nodes.": "Utwórz nowe gniazdo dostępne na wszystkich węzłach.",
  "This should be a descriptive category name that encompasses all of the eggs within the nest.": "Nazwa kategorii obejmującej wszystkie jajka w tym gnieździe.",
  "Think of a Nest as a category. You can put multiple Eggs in a nest, but consider putting only Eggs that are related to each other in each Nest.": "Gniazdo to kategoria. Umieszczaj w nim jajka o podobnym przeznaczeniu.",
  "Egg": "Jajko",
  "Eggs": "Jajka",
  "New Egg": "Nowe jajko",
  "Current Egg": "Obecne jajko",
  "Egg File": "Plik jajka",
  "Import Egg": "Importuj jajko",
  "Import an Egg": "Importuj jajko",
  "Update Egg": "Zaktualizuj jajko",
  "Import": "Importuj",
  "Export": "Eksportuj",
  "Author": "Autor",
  "Unique ID": "Unikalny identyfikator",
  "Copy Settings From": "Kopiuj ustawienia z",
  "Copy Script From": "Kopiuj skrypt z",
  "Create a new Egg to assign to servers.": "Utwórz nowe jajko do przypisywania serwerom.",
  "A simple, human-readable name to use as an identifier for this Egg.": "Prosta, czytelna nazwa tego jajka.",
  "A description of this Egg.": "Opis tego jajka.",
  "A description of this Egg that will be displayed throughout the Panel as needed.": "Opis jajka wyświetlany w panelu.",
  "Install Script": "Skrypt instalacyjny",
  "Script Container": "Kontener skryptu",
  "Script Entrypoint Command": "Komenda wejściowa skryptu",
  "Stop Command": "Komenda zatrzymania",
  "Log Configuration": "Konfiguracja logów",
  "Manage the install script for this Egg.": "Zarządzaj skryptem instalacyjnym tego jajka.",
  "Docker container to use when running this script for the server.": "Kontener Dockera używany do uruchomienia skryptu.",
  "The entrypoint command to use for this script.": "Komenda wejściowa uruchamiająca skrypt.",
  "Create Variable": "Utwórz zmienną",
  "Create New Variable": "Utwórz nową zmienną",
  "Create New Egg Variable": "Utwórz nową zmienną jajka",
  "Environment Variable": "Zmienna środowiskowa",
  "Default Value": "Wartość domyślna",
  "Input Rules": "Reguły walidacji",
  "Users Can View": "Widoczna dla użytkowników",
  "Users Can Edit": "Edytowalna przez użytkowników",
  "Managing variables for this Egg.": "Zarządzanie zmiennymi tego jajka.",
  "Default Service Start Command": "Domyślna komenda startowa",
  "Force Outgoing IP": "Wymuś wychodzący adres IP",
  "Auto-Deploy": "Automatyczne wdrażanie",
  "Automatic Allocation Creation": "Automatyczne tworzenie adresów i portów",
  "Allow Automatic Allocation": "Zezwól na automatyczne przypisywanie",
  "Starting Port": "Port początkowy",
  "Ending Port": "Port końcowy",
  "The starting port in the range that can be automatically allocated.": "Pierwszy port zakresu dostępnego do automatycznego przypisywania.",
  "The ending port in the range that can be automatically allocated.": "Ostatni port zakresu dostępnego do automatycznego przypisywania.",
  "If enabled users will have the option to automatically create new allocations for their server via the frontend.": "Po włączeniu użytkownicy mogą automatycznie tworzyć przypisania adresów i portów dla swoich serwerów.",
  "This feature has not been fully tested and may have bugs.": "Ta funkcja nie została w pełni przetestowana i może zawierać błędy.",
  "Not Set": "Nie ustawiono",
  "True": "Tak",
  "False": "Nie",
  "New": "Nowy",
  "Manage": "Zarządzaj",
  "Create New": "Utwórz nowy",
  "Default": "Domyślne",
  "Exit Admin Control": "Wróć do panelu użytkownika",
  "Toggle navigation": "Przełącz menu",
  "Do you want to log out?": "Czy chcesz się wylogować?",
  "Log out": "Wyloguj się",
  "There was an error validating the data provided.": "Podane dane nie przeszły walidacji.",
  "Next": "Następna",
  "Previous": "Poprzednia",
  "Next Page": "Następna strona",
  "Previous Page": "Poprzednia strona",
  "Copied to clipboard.": "Skopiowano do schowka.",
  "Copy to clipboard": "Kopiuj do schowka",
  "Note: Wings must be restarted for the configuration file changes to take effect": "Uwaga: po zmianie pliku konfiguracji należy ponownie uruchomić Wings.",
  "A backup task cannot be created when the server": "Nie można utworzyć zadania kopii zapasowej, gdy serwer",
  "All requests using the": "Wszystkie żądania używające",
  "Help protect your account from unauthorized access. You": "Chroń swoje konto przed nieautoryzowanym dostępem.",
  "Removing the": "Usunięcie",
  "SSH key will invalidate its usage across the Panel.": "klucza SSH uniemożliwi jego używanie w panelu."
}));
  function translate(element) {
    // Modify text nodes only. Never replace React's children or input values.
    for (const node of element.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const trimmed = node.data.trim();
      if (labels.has(trimmed) && labels.get(trimmed) !== trimmed) node.data = node.data.replace(trimmed, labels.get(trimmed));
    }
  }
  function decorate() {
    const logo = document.querySelector('#logo');
    const topbar = logo?.parentElement?.parentElement;
    if (topbar) {
      topbar.classList.add('np-topbar');
      logo.parentElement.classList.add('np-topbar-inner');
      const candidate = topbar.nextElementSibling;
      if (candidate && candidate.firstElementChild?.querySelector('a[href^="/server/"],a[href^="/account"]')) {
        candidate.classList.add('np-subnav');
      }
    }
    decorateConsole();
    translateInterface();
    document.querySelectorAll('.np-subnav a,.sidebar-menu a span,.sidebar-menu li.header').forEach(translate);
    document.querySelectorAll('.main-header .logo>span').forEach(e => {
      if (e.textContent !== 'NPΩ Panel') e.textContent = 'NPΩ Panel';
    });
    if (location.pathname.startsWith('/auth/')) {
      document.querySelectorAll('form').forEach(form => {
        const container = form.parentElement;
        container.classList.add('np-auth');
        container.querySelectorAll('h2,label,button,a').forEach(translate);
        container.querySelectorAll('img[src="/assets/svgs/pterodactyl.svg"]').forEach(img => {
          img.src = '/npomega/logo.svg'; img.alt = 'NPΩ Panel'; img.dataset.npBrand = 'true';
        });
      });
    }
  }
  const protectedSelectors = 'script,style,noscript,pre,code,textarea,input,.xterm,.ace_editor,.monaco-editor,[contenteditable=true],[data-np-user],#np-server-shelf,.np-console-name,.user-menu,.select2-selection__rendered,a[href*="/files/edit#"],a[href*="/files#"],[class*="file_row"]';
  const normal = text => text.replace(/\s+/g, ' ').trim();
  function translateInterface() {
    document.documentElement.lang = 'pl';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || p.closest(protectedSelectors)) return NodeFilter.FILTER_REJECT;
        if (p.closest('td') && !p.closest('button,label,.label,.badge,[role=alert]')) return NodeFilter.FILTER_REJECT;
        if (p.closest('a[href^="/server/"]:has(>.status-bar)>div:first-child')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.content-header h1 small')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const key = normal(node.data);
      let translated = labels.get(key);
      if (!translated && /^of (?:[\d.,]+\s*(?:%|[KMGT]?i?B)|Unlimited)$/.test(key)) translated = key.replace(/^of /,'z ').replace('Unlimited','bez limitu');
      if (translated && translated !== key) node.data = node.data.replace(node.data.trim(), translated);
    }
    document.querySelectorAll('[placeholder],[title],[aria-label],input[type=submit],input[type=button]').forEach(e => {
      if (e.closest(protectedSelectors.replace(',input','')) || e.closest('td')) return;
      for (const attr of ['placeholder','title','aria-label']) {
        const value = e.getAttribute(attr);
        if (value && labels.has(normal(value))) e.setAttribute(attr, labels.get(normal(value)));
      }
      if (e.matches('input[type=submit],input[type=button]') && labels.has(e.value)) e.value = labels.get(e.value);
    });
    if (labels.has(document.title)) document.title = labels.get(document.title) + ' · NPΩ Panel';
    else {
      const split = document.title.lastIndexOf(' | ');
      const suffix = document.title.slice(split + 3);
      if (split >= 0 && labels.has(suffix) && labels.get(suffix) !== suffix) document.title = document.title.slice(0, split + 3) + labels.get(suffix);
    }
  }
  let shelfState = null;
  let opening = false;
  function decorateConsole() {
    const match = location.pathname.match(/^\/server\/([^/]+)\/?$/);
    if (!match) {
      if (shelfState) { shelfState.abort.abort(); clearInterval(shelfState.timer); shelfState.element.remove(); shelfState = null; }
      // Open the first authorized server through its existing React link. The
      // complete paginated list remains accessible via ?np-list=1.
      if (location.pathname === '/' && !new URLSearchParams(location.search).has('np-list') && !opening) {
        const first = document.querySelector('a[href^="/server/"]:has(>.status-bar)');
        if (first) { opening = true; first.click(); }
      }
      return;
    }
    opening = false;
    const input = document.querySelector('input[aria-label="Console command input."],input[aria-label="Pole komendy konsoli."]');
    const terminal = input || document.querySelector('.xterm');
    const grid = terminal?.closest('.grid.grid-cols-4');
    if (!grid) return;
    const page = grid.parentElement;
    const isNew = !page.classList.contains('np-console-page');
    page.classList.add('np-console-page');
    grid.classList.add('np-console-main');
    grid.firstElementChild?.classList.add('np-console-terminal');
    grid.lastElementChild?.classList.add('np-console-details');
    if (grid.previousElementSibling?.classList.contains('grid')) {
      grid.previousElementSibling.classList.add('np-console-header');
      grid.previousElementSibling.firstElementChild?.classList.add('np-console-name');
      grid.previousElementSibling.lastElementChild?.classList.add('np-console-power');
    }
    if (grid.nextElementSibling?.classList.contains('grid')) grid.nextElementSibling.classList.add('np-console-graphs');
    if (isNew) requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    if (shelfState?.id === match[1] && shelfState.element.isConnected) return;
    if (shelfState) { shelfState.abort.abort(); clearInterval(shelfState.timer); shelfState.element.remove(); }
    const shelf = document.createElement('section');
    shelf.id = 'np-server-shelf';
    shelf.setAttribute('aria-label','Moje serwery');
    shelf.innerHTML = '<div class="np-shelf-heading"><h1>Moje serwery</h1><a href="/?np-list=1">Wszystkie serwery</a></div><div class="np-live-cards" aria-label="Wybór serwera"></div><p class="np-shelf-message" role="status">Pobieranie serwerów…</p>';
    page.before(shelf);
    const state = {id:match[1],element:shelf,abort:new AbortController(),timer:null,busy:false,cards:[]};
    shelfState = state;
    loadShelf(state);
  }
  async function request(path, state) {
    const response = await fetch(path, {credentials:'same-origin', headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest'},signal:state.abort.signal});
    if (!response.ok) throw new Error(response.status === 403 ? 'Brak uprawnień do odczytu serwera.' : response.status === 401 ? 'Sesja wygasła. Odśwież stronę i zaloguj się.' : 'Nie udało się pobrać danych. Odśwież stronę.');
    return response.json();
  }
  function el(tag, className, text) {
    const node = document.createElement(tag); node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  const memory = value => !Number.isFinite(value) ? '—' : value >= 1073741824 ? (value/1073741824).toLocaleString('pl-PL',{maximumFractionDigits:2})+' GiB' : (value/1048576).toLocaleString('pl-PL',{maximumFractionDigits:0})+' MiB';
  async function loadShelf(state) {
    try {
      const result = await request('/api/client', state);
      let servers = (result.data || []).map(s=>s.attributes).filter(s=>s && typeof s.identifier==='string');
      const selected = s => [s.identifier,s.uuid,s.server_identifier].includes(state.id);
      if (!servers.some(selected)) {
        try { const current = await request('/api/client/servers/'+encodeURIComponent(state.id),state); if(current.attributes)servers.unshift(current.attributes); } catch(error) { if(error.name==='AbortError')throw error; }
      }
      const chosen = servers.find(selected);
      servers = servers.slice(0,3);
      if(chosen && !servers.includes(chosen))servers[servers.length ? servers.length-1 : 0]=chosen;
      if(state.abort.signal.aborted)return;
      const container = state.element.querySelector('.np-live-cards');
      for (const server of servers) {
        const card = el('a','np-live-card'+(selected(server)?' is-selected':''));
        card.href='/server/'+encodeURIComponent(server.identifier);
        if(selected(server))card.setAttribute('aria-current','page');
        const head=el('div','np-card-heading');
        const mark=el('span','np-server-mark','Ω');mark.setAttribute('aria-hidden','true');
        const identity=el('div','np-card-identity');identity.append(el('h2','',server.name));
        const allocation=server.relationships?.allocations?.data?.map(a=>a.attributes).find(a=>a.is_default);
        identity.append(el('p','np-address',allocation?(allocation.alias||allocation.ip)+':'+allocation.port:'Adres niedostępny'));
        const status=el('span','np-server-status','Łączenie…');
        head.append(mark,identity,status);
        const stats=el('div','np-card-stats');
        const cpu=el('div','np-card-metric');cpu.innerHTML='<div><span>CPU</span><strong>—</strong></div><div class="np-meter"><span></span></div>';
        const ram=el('div','np-card-metric');ram.innerHTML='<div><span>RAM</span><strong>—</strong></div><div class="np-meter"><span></span></div>';
        stats.append(cpu,ram);card.append(head,stats);container.append(card);
        state.cards.push({server,card,status,cpu,ram});
      }
      state.element.querySelector('.np-shelf-message').textContent = servers.length ? '' : 'Brak serwerów dostępnych dla tego konta.';
      await refreshShelf(state);
      if(!state.abort.signal.aborted)state.timer=setInterval(()=>{if(!document.hidden)refreshShelf(state);},30000);
    } catch(error) {
      if(error.name!=='AbortError')state.element.querySelector('.np-shelf-message').textContent=error.message;
    }
  }
  async function refreshShelf(state) {
    if(state.busy || state.abort.signal.aborted)return;
    state.busy=true;
    await Promise.all(state.cards.map(async item=>{
      const {server,card,status,cpu,ram}=item;
      try {
        if(server.is_node_under_maintenance || server.status || server.is_transferring) {
          status.textContent=server.is_node_under_maintenance?'Przerwa techniczna':server.status==='suspended'?'Zawieszony':server.status==='installing'?'Instalowanie':server.is_transferring?'Przenoszenie':'Niedostępny';card.dataset.state='unknown';return;
        }
        const data=(await request('/api/client/servers/'+encodeURIComponent(server.identifier)+'/resources',state)).attributes;
        if(state.abort.signal.aborted)return;
        const mode=data.is_suspended?'suspended':data.current_state;
        status.textContent=({running:'Włączony',offline:'Wyłączony',starting:'Uruchamianie',stopping:'Zatrzymywanie',suspended:'Zawieszony'})[mode]||'Brak danych';
        card.dataset.state=mode;
        const usage=data.resources || {};
        const percent=Number(usage.cpu_absolute);
        const bytes=Number(usage.memory_bytes);
        cpu.querySelector('strong').textContent=Number.isFinite(percent)?percent.toLocaleString('pl-PL',{maximumFractionDigits:2})+'%':'—';
        ram.querySelector('strong').textContent=memory(bytes)+' / '+(server.limits?.memory?memory(server.limits.memory*1048576):'∞');
        const cpuLimit=Number(server.limits?.cpu);
        const ramLimit=Number(server.limits?.memory)*1048576;
        for(const [node,value,limit] of [[cpu,percent,cpuLimit],[ram,bytes,ramLimit]]) {
          const meter=node.querySelector('.np-meter');
          meter.hidden=!(limit>0 && Number.isFinite(value));
          meter.querySelector('span').style.width=Math.max(0,Math.min(100,value/limit*100))+'%';
          meter.title=limit>0?'Wykorzystanie przydzielonego limitu':'Bez limitu';
        }
      } catch(error) {
        if(error.name!=='AbortError'){status.textContent='Brak odczytu';card.dataset.state='unknown';cpu.querySelector('strong').textContent='—';ram.querySelector('strong').textContent='—';cpu.querySelector('.np-meter').hidden=true;ram.querySelector('.np-meter').hidden=true;}
      }
    }));
    state.busy=false;
  }
  function start() {
    decorate();
    let queued = false;
    const observer = new MutationObserver(records => {
      // Terminal/file editor updates are deliberately excluded.
      const relevant = records.some(r => !r.target.parentElement?.closest('.xterm,.ace_editor,.monaco-editor,pre,code') &&
        !r.target.parentElement?.closest('#np-server-shelf') && (r.type === 'childList' || r.type === 'characterData'));
      if (!relevant || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; decorate(); });
    });
    observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
