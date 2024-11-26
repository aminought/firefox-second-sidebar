# Second Sidebar for Firefox

A Firefox userChrome.js script for adding a second sidebar with web panels like in Vivaldi/Floorp/Zen.

![update](https://github.com/user-attachments/assets/3cdfc422-e33c-4142-8400-99222ac3b444)

## Motivation

There are many forks of Firefox, but I prefer to continue using the original browser. However, I have also tried other browsers such as Vivaldi, Floorp and Zen. I also miss the feature of having a decent sidebar with web panels, which is why I decided to create my own version, with blackjack and hookers.

## Demo

https://github.com/user-attachments/assets/60a2da4f-2165-4d92-983a-f4a79d17e3ef

## Features

1. Adding a new web panel by left-clicking on the plus sign. If you are on a web page, the current address will be automatically inserted into the address bar.
2. Changing the width of the sidebar, each web panel has its own width.
3. Pinning and unpinning the sidebar, each web panel has its own state. In the pinned state, the sidebar will be located statically next to the page. The unpinned sidebar appears on top of the page and closes when the focus is lost.
4. Closing sidebar with unloading of the web panel;
5. Editing the web panel by right-clicking on the corresponding button:
   - Changing the web address.
   - Changing the favicon.
   - Resetting the favicon.
   - Option to load into memory at startup.
   - Option to unload from memory after closing.
   - Moving the web panel button.
   - Deleting the web panel.
6. Unloading web panel from memory by middle-clicking on the corresponding button.
7. Managing the page opened in the web panel: going back and forth, refreshing the page and going to the home page.
8. Sound indicator.
9. Indicator of unloaded web panel (dimmed icon).

## Install (fx-autoconfig)

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copy the contents of the `src/` directory (`second_sidebar/` and `second_sidebar.uc.mjs`) into `chrome/JS/`.
3. [Clear](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) startup-cache.
4. Have fun!

## If you use another loader

Use a wrapper script provided by @dimdamin: https://github.com/aminought/firefox-second-sidebar/issues/5.
