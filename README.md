# Second Sidebar for Firefox

A Firefox userChrome.js script for adding a second sidebar with web panels like in Vivaldi/Edge/Floorp/Zen but better.

![promo-rounded](https://github.com/user-attachments/assets/2eb261b0-0942-4c74-a8c9-087d7455bfbd)

## Motivation

I've tried various browsers, such as Vivaldi, Edge, Floorp, and Zen, and they all have one thing in common that I can't imagine using a browser without — the sidebar. Unfortunately, Firefox, which I feel most closely aligns with my needs in terms of spirit and functionality, has a rather unsatisfactory sidebar. Therefore, I decided to create another one myself, with blackjack and hookers!

## Demo

https://github.com/user-attachments/assets/e4a2c01a-0d32-463d-84da-ffa6b090508c

## Features

### Sidebar

- Actions: `Show` • `Hide`
- Customize via [Customize Toolbar...](https://support.mozilla.org/en-US/kb/customize-firefox-controls-buttons-and-toolbars)
- Settings: `Position (left / right)` • `Auto-hide` • `Animate hiding / showing` • `Width` • `Floating web panel offset` • `Position of the new web panel button (Before plus button / After plus button)` • `Container indicator position (Left / Right / Top / Bottom / Around)` • `Hide sidebar in popup windows` • `Auto hide back button` • `Auto hide forward button`

### Web panels

- Actions: `Create` • `Delete` • `Edit` • `Change width` • `Unload` • `Mute` • `Unmute` • `Pin` • `Unpin` • `Change zoom` • `Go back` • `Go forward` • `Reload` • `Go home`
- Extensions support
- Sound icon
- Notification badge
- Periodic reload
- Settings: `Web address` • `Multi-Account Container` • `Favicon web address` • `Type of web panel (pinned / floating)` • `Mobile View` • `Loading into memory at startup` • `Unloading from memory after closing` • `Hide toolbar` • `Hide sound icon` • `Hide notification badge` • `Periodic reload` • `Zoom`

### Widgets

- `Second Sidebar` to show / hide sidebar

## Install (fx-autoconfig)

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copy the contents of the `src/` directory (`second_sidebar/` and `second_sidebar.uc.mjs`) into `chrome/JS/`.
3. [Clear](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) startup-cache.
4. Have fun!

## If you use another loader

Use a wrapper script provided by @dimdamin: https://github.com/aminought/firefox-second-sidebar/issues/5.
