import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        checkForMiddleClick: "readonly",
        delayedStartupPromise: "readonly",
        gBrowser: "readonly",
        gCustomizeMode: "readonly",
        gContextMenu: "readonly",
        gNavToolbox: "readonly",
        openTrustedLinkIn: "readonly",
        AppConstants: "readonly",
        Cc: "readonly",
        Ci: "readonly",
        ContextualIdentityService: "readonly",
        CustomizableUI: "readonly",
        ChromeUtils: "readonly",
        Favicons: "readonly",
        FullZoom: "readonly",
        NetUtil: "readonly",
        Services: "readonly",
        SessionStore: "readonly",
        SidebarController: "readonly",
        UC_API: "readonly",
        ZoomManager: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
];
