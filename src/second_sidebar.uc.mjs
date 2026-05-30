// ==UserScript==
// @name            Second Sidebar for Firefox
// @description     A Firefox userChrome.js script that brings a second sidebar with web panels like in Vivaldi/Edge/Floorp but better
// @author          aminought
// @homepageURL     https://github.com/aminought/firefox-second-sidebar
// ==/UserScript==

import { BrowserElements } from "./second_sidebar/browser_elements.mjs";
import { ContextualIdentityServiceWrapper } from "./second_sidebar/wrappers/contextual_identity_service.mjs";
import { CustomizeModePatcher } from "./second_sidebar/patchers/customize_mode_patcher.mjs";
import { SidebarDecorator } from "./second_sidebar/sidebar_decorator.mjs";
import { SidebarInjector } from "./second_sidebar/sidebar_injector.mjs";

const run = () => {
  if (BrowserElements.root.hasClass("sb2-webpanels-window")) return;
  ContextualIdentityServiceWrapper.ensureDataReady();
  if (SidebarInjector.inject()) {
    SidebarDecorator.decorate();
    CustomizeModePatcher.patch();
  }
};

if (typeof UC_API !== "undefined") {
  UC_API.Runtime.startupFinished().then(run);
} else {
  delayedStartupPromise.then(run);
}
