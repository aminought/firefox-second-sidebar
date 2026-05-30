**English** | [中文（简体）](docs/README.zh-CN.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md) | [Deutsch](docs/README.de.md) | [Français](docs/README.fr.md) | [Español](docs/README.es.md) | [Português (Brasil)](docs/README.pt-BR.md) | [Русский](docs/README.ru.md)

A Firefox userChrome.js script that brings a second sidebar with web panels like in Vivaldi/Edge/Floorp but better.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## Motivation

I've tried various browsers, such as Vivaldi, Edge, Floorp, and Zen, and they all have one thing in common that I can't imagine using a browser without — the sidebar. Unfortunately, Firefox, which I feel most closely aligns with my needs in terms of spirit and functionality, has a rather unsatisfactory sidebar. Therefore, I decided to create another one myself, with blackjack and hookers!

## Demo

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## Features

### Sidebar

- Actions: `Show` • `Hide`
- Customize via [Customize Toolbar...](https://support.mozilla.org/en-US/kb/customize-firefox-controls-buttons-and-toolbars)
- Settings:
  - General: `Position (Left / Right)` • `Width`
  - Visibility: `Auto-hide sidebar` • `Auto-hide behaviour (Inline / Overlay)` • `Hide web panel when sidebar is hidden` • `Set shortcut to hide/show sidebar`
  - Web panel: `Default floating panel offset` • `New panel position (Before plus button / After plus button)` • `Show geometry hint`
  - Web panel button: `Container indicator (Off / Left / Right / Top / Bottom / Around)` • `Tooltip (Off / Title / URL / Title and URL)` • `Show full URL in tooltip`
  - Web panel toolbar: `Auto-hide forward button` • `Auto-hide back button`
  - Animations: `Animate sidebar` • `Animate web panel toolbar`

### Web panels

- Actions: `Create` • `Delete` • `Edit` • `Change position and size` • `Reset position and size` • `Unload` • `Mute` • `Unmute` • `Pin` • `Unpin` • `Change zoom` • `Go back` • `Go forward` • `Reload` • `Go home`
- Extensions support
- Popup notifications support (permissions to use microphone/camera/location, etc.)
- Settings:
  - General: `URL` • `Multi-Account Container` • `Temporary` • `Mobile view` • `Zoom`
  - Title: `Dynamic` • `Set static title`
  - Favicon: `Dynamic` • `Set static favicon`
  - Position and size: `Mode (Floating / Pinned)` • `Always on top` • `Position anchor` • `Horizontal offset` • `Vertical offset` • `Width` • `Height`
  - Loading: `Load into memory at startup` • `Restore last opened page` • `Unload from memory after closing` • `Periodic reload`
  - Keyboard shortcut: `Set shortcut to hide/show web panel`
  - CSS selector: `Enable` • `Set CSS selector`
  - Hide elements: `Hide toolbar` • `Hide sound icon` • `Hide notification badge`

### Widgets

- `Second Sidebar` to show / hide sidebar

## Installation

### One-click install (Windows, recommended)

Open PowerShell as **Administrator** and run:

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

The script will automatically:

1. Download fx-autoconfig and Second Sidebar from GitHub
2. Detect Firefox install directory and profile folder
3. Install fx-autoconfig program files and profile files
4. Install Second Sidebar script
5. Verify the installation

> **Admin privileges**: fx-autoconfig's `config.js` must be copied to `C:\Program Files\Mozilla Firefox\`, which requires admin privileges. If not running as admin, the script will prompt for manual copy.

**Uninstall:**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

The uninstall script lets you interactively choose which components to remove (Second Sidebar script, fx-autoconfig profile files, fx-autoconfig program files).

### Manual install

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copy the contents of the `src/` directory (`second_sidebar/` and `second_sidebar.uc.mjs`) into `chrome/JS/`.
3. Enable `toolkit.legacyUserProfileCustomizations.stylesheets` and `dom.allow_scripts_to_close_windows` in `about:config`.
4. [Clear](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) startup-cache.
5. Have fun!

## Localization

The script supports multiple languages and automatically displays the UI in the user's Firefox language.

### Supported languages

| Language           | Code    | Status  |
| ------------------ | ------- | ------- |
| English            | `en-US` | ✅ Full |
| 中文（简体）       | `zh-CN` | ✅ Full |
| 日本語             | `ja`    | ✅ Full |
| 한국어             | `ko`    | ✅ Full |
| Deutsch            | `de`    | ✅ Full |
| Français           | `fr`    | ✅ Full |
| Español            | `es`    | ✅ Full |
| Português (Brasil) | `pt-BR` | ✅ Full |
| Русский            | `ru`    | ✅ Full |

### Language file structure

```
src/second_sidebar/i18n/
├── index.mjs     # Language detection and loading entry
├── en-US.mjs     # English
├── zh-CN.mjs     # Simplified Chinese
├── ja.mjs        # Japanese
├── ko.mjs        # Korean
├── de.mjs        # German
├── fr.mjs        # French
├── es.mjs        # Spanish
├── pt-BR.mjs     # Brazilian Portuguese
└── ru.mjs        # Russian
```

### How it works

All UI strings are extracted from source code into language files under `src/second_sidebar/i18n/`. Each source file imports `L` from the i18n module:

```js
import { L } from "../i18n/index.mjs";
```

At startup, `index.mjs` detects the browser language via `Services.locale.requestedLocale` and exports the matching language object. If no exact match is found, it falls back by language prefix (e.g., `de-AT` → `de`), and ultimately to `en-US`.

### Adding a new language

1. Copy `en-US.mjs` to a new file (e.g., `it.mjs`)
2. Replace the English values with translations, keeping the keys unchanged
3. Import and register the new language in `index.mjs`

### Switching language

The script automatically detects the Firefox browser language. To switch:

1. Open Firefox Settings → General → Language
2. Change the Firefox interface language
3. Restart the browser
