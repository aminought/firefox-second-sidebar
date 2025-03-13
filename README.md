# Second Sidebar for Firefox

A Firefox userChrome.js script for adding a second sidebar with web panels like in Vivaldi/Floorp/Zen but better.

![promo-rounded](https://github.com/user-attachments/assets/2eb261b0-0942-4c74-a8c9-087d7455bfbd)

## Motivation

There are many forks of Firefox, but I prefer to continue using the original browser. However, I have also tried other browsers such as Vivaldi, Floorp and Zen. I also miss the feature of having a decent sidebar with web panels, which is why I decided to create my own version, with blackjack and hookers.

## Demo

https://github.com/user-attachments/assets/6eac0881-649b-4e43-b45a-78451e92a69d

## Features

### Sidebar
- Actions: `Show` • `Hide`
- Customize via [Customize Toolbar...](https://support.mozilla.org/en-US/kb/customize-firefox-controls-buttons-and-toolbars)
- Settings: `Position (left / right)` • `Auto-hide` • `Animate hiding / showing` • `Width` • `Floating web panel offset` • `Position of the new web panel button (Before plus button / After plus button)` • `Container indicator position (Left / Right / Top / Bottom / Around)` • `Hide sidebar in popup windows` • `Auto hide back button` • `Auto hide forward button`

### Web panels
- Actions: `Create` • `Delete` • `Edit` • `Unload` • `Mute` • `Unmute` • `Pin` • `Unpin` • `Change zoom` • `Go back` • `Go forward` • `Reload` • `Go home`
- Extensions support
- Sound icon
- Notification badge
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
