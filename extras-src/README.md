# Additional Features

## Zen Mods Menu

![ezgif-20b2e65657e052](https://github.com/user-attachments/assets/96d792e3-2cd5-4465-8ee9-c368ac734d67)

It's a web panel that mimics browser menu, allowing you to quickly switch Zen mods on or off.

### Installation and setup

1. Copy `zen_mods_menu.uc.mjs` from `extras-src/js/` to `chrome/js/`
2. Edit `config-prefs.js` at the browser installation directory `Zen Browser/defaults/pref/`. Add new line `pref("userChromeJS.persistent_domcontent_callback", true);` at the end
3. Open browser
4. Create a new web panel with address `about:preferences#zenMarketplace`
5. Edit its settings as shown here:
   
<img src="https://github.com/user-attachments/assets/84d39e35-56f2-4319-b33f-32d86f0cedcb" width="400"/>

(for easier copy-paste `chrome://browser/skin/customize.svg`)
