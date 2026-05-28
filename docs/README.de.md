[English](../README.md) | **Deutsch**

Ein Firefox userChrome.js-Skript, das eine zweite Seitenleiste mit Web-Panels wie in Vivaldi/Edge/Floorp bringt – nur besser.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## Motivation

Ich habe verschiedene Browser ausprobiert, wie Vivaldi, Edge, Floorp und Zen, und sie alle haben eines gemeinsam, ohne das ich mir ein Browser nicht vorstellen kann — die Seitenleiste. Leider hat Firefox, der meinen Bedürfnissen am ehesten entspricht, eine eher unbefriedigende Seitenleiste. Also beschloss ich, selbst eine zu erstellen, mit Blackjack und Hostessen!

## Demo

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## Funktionen

### Seitenleiste

- Aktionen: `Anzeigen` • `Ausblenden`
- Anpassen über [Symbolleiste anpassen...](https://support.mozilla.org/de/kb/customize-firefox-controls-buttons-and-toolbars)
- Einstellungen:
  - Allgemein: `Position (Links / Rechts)` • `Breite`
  - Sichtbarkeit: `Seitenleiste automatisch ausblenden` • `Verhalten beim automatischen Ausblenden (Inline / Überlagerung)` • `Web-Panel ausblenden, wenn Seitenleiste ausgeblendet ist` • `Tastenkombination zum Aus-/Einblenden der Seitenleiste`
  - Web-Panel: `Standard-Versatz für schwebende Panels` • `Position neuer Panels (Vor dem Plus-Button / Nach dem Plus-Button)` • `Geometriehinweis anzeigen`
  - Web-Panel-Schaltfläche: `Container-Anzeige (Aus / Links / Rechts / Oben / Unten / Ringsum)` • `Quickinfo (Aus / Titel / URL / Titel und URL)` • `Vollständige URL in Quickinfo anzeigen`
  - Web-Panel-Symbolleiste: `Vorwärts-Button automatisch ausblenden` • `Zurück-Button automatisch ausblenden`
  - Animationen: `Seitenleiste animieren` • `Web-Panel-Symbolleiste animieren`

### Web-Panels

- Aktionen: `Erstellen` • `Löschen` • `Bearbeiten` • `Position und Größe ändern` • `Position und Größe zurücksetzen` • `Entladen` • `Stumm schalten` • `Ton einschalten` • `Anheften` • `Lösen` • `Zoom ändern` • `Zurück` • `Vorwärts` • `Neu laden` • `Startseite`
- Erweiterungsunterstützung
- Popup-Benachrichtigungsunterstützung (Berechtigungen für Mikrofon/Kamera/Standort usw.)
- Einstellungen:
  - Allgemein: `URL` • `Multi-Account-Container` • `Temporär` • `Mobile Ansicht` • `Zoom`
  - Titel: `Dynamisch` • `Statischen Titel festlegen`
  - Favicon: `Dynamisch` • `Statisches Favicon festlegen`
  - Position und Größe: `Modus (Schwebend / Angeheftet)` • `Immer im Vordergrund` • `Positionsanker` • `Horizontaler Versatz` • `Vertikaler Versatz` • `Breite` • `Höhe`
  - Laden: `Beim Start in den Speicher laden` • `Zuletzt geöffnete Seite wiederherstellen` • `Nach dem Schließen aus dem Speicher entladen` • `Periodisches Neuladen`
  - Tastenkombination: `Tastenkombination zum Aus-/Einblenden des Web-Panels`
  - CSS-Selektor: `Aktivieren` • `CSS-Selektor festlegen`
  - Elemente ausblenden: `Symbolleiste ausblenden` • `Ton-Symbol ausblenden` • `Benachrichtigungsbadge ausblenden`

### Widgets

- `Zweite Seitenleiste` zum Anzeigen / Ausblenden der Seitenleiste

## Installation

### Ein-Klick-Installation (Windows, empfohlen)

PowerShell als **Administrator** öffnen und ausführen:

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

Das Skript führt automatisch Folgendes aus:

1. fx-autoconfig und Second Sidebar von GitHub herunterladen
2. Firefox-Installationsverzeichnis und Profilordner erkennen
3. fx-autoconfig-Programmdateien und Profildateien installieren
4. Second Sidebar-Skript installieren
5. Installation überprüfen

> **Administratorrechte**: fx-autoconfigs `config.js` muss nach `C:\Program Files\Mozilla Firefox\` kopiert werden, was Administratorrechte erfordert. Wenn nicht als Administrator ausgeführt, wird zur manuellen Kopie aufgefordert.

**Deinstallation:**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

Das Deinstallationsskript ermöglicht die interaktive Auswahl der zu entfernenden Komponenten.

### Manuelle Installation

1. [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) installieren.
2. Den Inhalt des `src/`-Verzeichnisses (`second_sidebar/` und `second_sidebar.uc.mjs`) in `chrome/JS/` kopieren.
3. `toolkit.legacyUserProfileCustomizations.stylesheets` und `dom.allow_scripts_to_close_windows` in `about:config` aktivieren.
4. [Start-Cache löschen](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache).
5. Viel Spaß!

## Lokalisierung

Das Skript unterstützt mehrere Sprachen und zeigt die Benutzeroberfläche automatisch in der Firefox-Sprache an.

### Neue Sprache hinzufügen

1. `en-US.mjs` in eine neue Datei kopieren (z.B. `it.mjs`)
2. Englische Werte durch Übersetzungen ersetzen (Schlüssel nicht ändern)
3. Neue Sprache in `index.mjs` importieren und registrieren
4. PR einreichen
