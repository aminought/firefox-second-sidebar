A Firefox userChrome.js script that brings a second sidebar with web panels like in Vivaldi/Edge/Floorp/Zen but better.

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
  - Visibility: `Auto-hide sidebar` • `Auto-hide behaiour (Inline / Overlay)` • `Hide web panel when sidebar is hidden` • `Set shortcut to hide/show sidebar`
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

## Install (fx-autoconfig)

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copy the contents of the `src/` directory (`second_sidebar/` and `second_sidebar.uc.mjs`) into `chrome/JS/`.
3. Enable `toolkit.legacyUserProfileCustomizations.stylesheets` and `dom.allow_scripts_to_close_windows` in `about:config`.
4. [Clear](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) startup-cache.
5. Have fun!

## If you use another loader

Use a wrapper script provided by @dimdamin: https://github.com/aminought/firefox-second-sidebar/issues/5.
