import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        UC_API: "readonly",
        delayedStartupPromise: "readonly",
        Services: "readonly",
        Cc: "readonly",
        Ci: "readonly",
        gBrowser: "readonly",
        gCustomizeMode: "readonly",
        gContextMenu: "readonly",
        gNavToolbox: "readonly",
        gSync: "readonly",
        gTabsPanel: "readonly",
        gUnifiedExtensions: "readonly",
        openTrustedLinkIn: "readonly",
        BrowserPageActions: "readonly",
        Components: "readonly",
        ContextualIdentityService: "readonly",
        CustomizableUI: "readonly",
        ChromeUtils: "readonly",
        DownloadsIndicatorView: "readonly",
        FirefoxViewHandler: "readonly",
        NetUtil: "readonly",
        Favicons: "readonly",
        FullZoom: "readonly",
        PanelUI: "readonly",
        ZoomManager: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
];
